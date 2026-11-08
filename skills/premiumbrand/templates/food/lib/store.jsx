/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api.js';
import { crunch } from './sound.js';

const Ctx = createContext(null);
const BAG_KEY = 'lays.bag.v1';
const WISH_KEY = 'lays.wish.v1';

const load = (k, fallback) => {
    try {
        const v = JSON.parse(localStorage.getItem(k));
        return v ?? fallback;
    } catch {
        return fallback;
    }
};
const keep = (k, v) => {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch {
        /* private mode: the bag still works for this visit */
    }
};

export function StoreProvider({ children }) {
    const [catalogue, setCatalogue] = useState(null);
    const [error, setError] = useState(null);
    const [shots, setShots] = useState({});
    const [bag, setBag] = useState(() => load(BAG_KEY, []));
    const [wish, setWish] = useState(() => load(WISH_KEY, []));
    const [bagOpen, setBagOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(0);

    const fetchCatalogue = useCallback(() => {
        setError(null);
        return api('/products')
            .then((d) => {
                setCatalogue(d);
                return d;
            })
            .catch((e) => {
                setError(e.message);
                throw e;
            });
    }, []);

    useEffect(() => keep(BAG_KEY, bag), [bag]);
    useEffect(() => keep(WISH_KEY, wish), [wish]);

    const bySlug = useMemo(() => new Map((catalogue?.products || []).map((p) => [p.slug, p])), [catalogue]);

    const say = useCallback((text) => {
        clearTimeout(toastTimer.current);
        setToast({ text, id: Date.now() });
        toastTimer.current = setTimeout(() => setToast(null), 2600);
    }, []);

    const add = useCallback(
        (slug, size = 'm', qty = 1, box = null, { quiet = false } = {}) => {
            setBag((b) => {
                const i = b.findIndex((l) => l.slug === slug && l.size === size && (l.box || null) === box);
                if (i >= 0) return b.map((l, j) => (j === i ? { ...l, qty: Math.min(24, l.qty + qty) } : l));
                return [...b, { slug, size, qty, box }];
            });
            crunch();
            if (!quiet) {
                const p = bySlug.get(slug);
                const s = p?.sizes.find((x) => x.id === size);
                say(`${p?.name ?? 'Pack'}${s ? `, ${s.label}` : ''} is in your bag.`);
            }
        },
        [bySlug, say],
    );

    const addBox = useCallback(
        (box) => {
            setBag((b) => {
                let next = b.filter((l) => l.box !== box.id);
                for (const pc of box.pieces) next = [...next, { slug: pc.slug, size: pc.size, qty: pc.qty, box: box.id }];
                return next;
            });
            say(`The ${box.name} box is in your bag.`);
        },
        [say],
    );

    // build your 3 pack: three 52 g packs under one box, priced as a set by the server
    const addPick3 = useCallback(
        (slugs) => {
            setBag((b) => {
                let next = b;
                for (const slug of slugs) {
                    const i = next.findIndex((l) => l.slug === slug && l.size === 'm' && l.box === 'pick3');
                    next = i >= 0 ? next.map((l, j) => (j === i ? { ...l, qty: Math.min(24, l.qty + 1) } : l)) : [...next, { slug, size: 'm', qty: 1, box: 'pick3' }];
                }
                return next;
            });
            crunch();
            say('Your 3 pack is in the basket.');
        },
        [say],
    );

    const setQty = useCallback((i, qty) => setBag((b) => (qty <= 0 ? b.filter((_, j) => j !== i) : b.map((l, j) => (j === i ? { ...l, qty: Math.min(24, qty) } : l)))), []);
    const remove = useCallback((i) => setBag((b) => b.filter((_, j) => j !== i)), []);
    const clear = useCallback(() => setBag([]), []);
    const toggleWish = useCallback(
        (slug) => {
            const on = wish.includes(slug);
            say(on ? 'Taken off your list.' : 'Saved to your list.');
            setWish((w) => (on ? w.filter((s) => s !== slug) : [...w, slug]));
        },
        [wish, say],
    );

    const count = bag.reduce((s, l) => s + l.qty, 0);
    const value = { catalogue, error, fetchCatalogue, bySlug, shots, setShots, bag, add, addBox, addPick3, setQty, remove, clear, count, wish, toggleWish, bagOpen, setBagOpen, toast, say };
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

// The server prices the bag. Re-quote when the bag or coupon changes.
export function useQuote(items, coupon = '', enabled = true) {
    const [state, setState] = useState({ loading: true, data: null, error: null });
    const key = JSON.stringify([items, coupon]);
    useEffect(() => {
        if (!enabled) return undefined;
        const ctl = new AbortController();
        setState((s) => ({ ...s, loading: true }));
        const t = setTimeout(() => {
            api('/quote', { method: 'POST', body: { items, coupon }, signal: ctl.signal })
                .then((data) => setState({ loading: false, data, error: null }))
                .catch((e) => e.name !== 'AbortError' && setState({ loading: false, data: null, error: e.message }));
        }, 180);
        return () => {
            clearTimeout(t);
            ctl.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, enabled]);
    return state;
}
