/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { mockApi } from './mock.js';

gsap.registerPlugin(ScrollTrigger);

export const EASE = 'expo.out';
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- formatting and images ---------------- */
export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const img = (id, w = 1200, h) => `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ''}&q=78&auto=format&fit=crop`;

/* ---------------- API ---------------- */
// In the full project this calls the Express API. On the ApexUI site the same routes run
// in the browser (mock.js), because the demo is served as static files.
export async function api(path, { method = 'GET', body, signal } = {}) {
    const data = await mockApi(path, { method, body });
    if (signal?.aborted) throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    return data;
}

// Fetch on mount and when deps change. Keeps the last data while a new request runs.
export function useApi(path, { minDelay = 0 } = {}) {
    const [state, setState] = useState({ data: null, error: null, loading: true });
    useEffect(() => {
        if (!path) return undefined;
        const ctrl = new AbortController();
        setState((s) => ({ ...s, loading: true, error: null }));
        const started = Date.now();
        api(path, { signal: ctrl.signal })
            .then(async (data) => {
                const wait = minDelay - (Date.now() - started);
                if (wait > 0) await new Promise((r) => setTimeout(r, wait));
                if (!ctrl.signal.aborted) setState({ data, error: null, loading: false });
            })
            .catch((error) => !ctrl.signal.aborted && setState({ data: null, error, loading: false }));
        return () => ctrl.abort();
    }, [path, minDelay]);
    return state;
}

/* ---------------- smooth scroll (Lenis driven by the GSAP ticker) ---------------- */
let lenis = null;
export const getLenis = () => lenis;

export function SmoothScroll() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduced()) return undefined;
        lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
        window.__lenis = lenis; // lets the screenshot scripts jump to a section
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            lenis = null;
        };
    }, []);
    useEffect(() => {
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        const t = setTimeout(() => ScrollTrigger.refresh(), 120);
        return () => clearTimeout(t);
    }, [pathname]);
    return null;
}

// Stop page scroll while a drawer or dialog is open.
export function useScrollLock(on) {
    useEffect(() => {
        if (!on) return undefined;
        lenis?.stop();
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            lenis?.start();
            document.body.style.overflow = prev;
        };
    }, [on]);
}

/* ---------------- GSAP reveals ---------------- */

// Children rise and fade in once, when they reach the lower part of the screen.
export function Reveal({ as: Tag = 'div', y = 32, delay = 0, stagger = 0, className = '', children, ...rest }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const el = ref.current;
        const targets = stagger ? el.children : el;
        const ctx = gsap.context(() => {
            gsap.from(targets, { y, autoAlpha: 0, duration: 1.1, delay, stagger, ease: EASE, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
        return () => ctx.revert();
    }, [y, delay, stagger]);
    return (
        <Tag ref={ref} className={className} {...rest}>
            {children}
        </Tag>
    );
}

// A headline whose words rise out of a mask, one after another.
export function Lines({ text, as: Tag = 'h2', className = '', delay = 0, onLoad = false }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const words = ref.current.querySelectorAll('[data-w]');
        const ctx = gsap.context(() => {
            gsap.from(words, { yPercent: 110, duration: 1.2, delay, stagger: 0.06, ease: EASE, ...(onLoad ? {} : { scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }) });
        });
        return () => ctx.revert();
    }, [delay, onLoad, text]);
    return (
        <Tag ref={ref} className={className} aria-label={text}>
            {text.split(' ').map((w, i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-top">
                    <span data-w className="inline-block">
                        {w}
                        {' '}
                    </span>
                </span>
            ))}
        </Tag>
    );
}

// An image that opens like a curtain and settles from a slight zoom.
export function Curtain({ src, alt, className = '', imgClass = '', ratio = 'aspect-[4/5]', from = 'bottom' }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const el = ref.current;
        const start = { bottom: 'inset(100% 0 0 0)', left: 'inset(0 100% 0 0)', right: 'inset(0 0 0 100%)' }[from];
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
            tl.fromTo(el, { clipPath: start }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' }).from(el.querySelector('img'), { scale: 1.18, duration: 1.8, ease: EASE }, 0);
        });
        return () => ctx.revert();
    }, [from]);
    return (
        <div ref={ref} className={`overflow-hidden bg-tn-surface ${ratio} ${className}`}>
            <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClass}`} />
        </div>
    );
}

/* ---------------- bag ---------------- */
const BagCtx = createContext(null);
const KEY = 'taana-bag';

export function BagProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            return [];
        }
    });
    const [open, setOpen] = useState(false);
    const [coupon, setCoupon] = useState(() => {
        try {
            return localStorage.getItem(`${KEY}-coupon`) || '';
        } catch {
            return '';
        }
    });
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(items));
            localStorage.setItem(`${KEY}-coupon`, coupon);
        } catch {
            /* fine */
        }
    }, [items, coupon]);

    // The server prices the bag, so the page never shows a number it will not charge.
    useEffect(() => {
        if (!items.length) return setQuote(null);
        const ctrl = new AbortController();
        api('/quote', { method: 'POST', body: { items: items.map(({ slug, qty, blouse, blouseSize, fallPico, look }) => ({ slug, qty, blouse, blouseSize, fallPico, look })), coupon: coupon || undefined }, signal: ctrl.signal })
            .then(setQuote)
            .catch(() => {});
        return () => ctrl.abort();
    }, [items, coupon]);

    const value = useMemo(() => {
        const key = (i) => `${i.slug}:${i.blouse}:${i.blouseSize ?? ''}:${i.fallPico}:${i.look ?? ''}`;
        const make = (p, opts) => ({ slug: p.slug, kind: p.kind ?? 'saree', name: p.name, image: p.images[0], price: p.price, weave: p.weave, qty: 1, blouse: p.kind === 'jewellery' ? 'none' : opts.blouse, blouseSize: opts.blouseSize, fallPico: p.kind === 'jewellery' ? false : !!opts.fallPico, look: opts.look });
        const put = (list, item) => {
            const found = list.find((i) => key(i) === key(item));
            return found ? list.map((i) => (i === found ? { ...i, qty: Math.min(3, i.qty + 1) } : i)) : [...list, item];
        };
        return {
            items,
            open,
            setOpen,
            coupon,
            setCoupon,
            quote,
            count: items.reduce((n, i) => n + i.qty, 0),
            add: (p, opts) => setItems((list) => put(list, make(p, opts))),
            // several pieces at once, e.g. a whole look
            addMany: (entries) => setItems((list) => entries.reduce((l, [p, opts]) => put(l, make(p, opts)), list)),
            setQty: (it, qty) => setItems((list) => (qty <= 0 ? list.filter((i) => i !== it) : list.map((i) => (i === it ? { ...i, qty: Math.min(3, qty) } : i)))),
            clear: () => {
                setItems([]);
                setCoupon('');
            },
        };
    }, [items, open, coupon, quote]);
    return <BagCtx.Provider value={value}>{children}</BagCtx.Provider>;
}
export const useBag = () => useContext(BagCtx);

/* ---------------- account ---------------- */
const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        api('/auth/me')
            .then((d) => setUser(d.user))
            .catch(() => setUser(null));
    }, []);
    const value = useMemo(
        () => ({
            user,
            login: async (body) => setUser((await api('/auth/login', { method: 'POST', body })).user),
            register: async (body) => setUser((await api('/auth/register', { method: 'POST', body })).user),
            logout: async () => {
                await api('/auth/logout', { method: 'POST' });
                setUser(null);
            },
        }),
        [user],
    );
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

/* ---------------- wishlist (kept in this browser) ---------------- */
const WishCtx = createContext(null);
export function WishProvider({ children }) {
    const [list, setList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('taana-wish')) || [];
        } catch {
            return [];
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem('taana-wish', JSON.stringify(list));
        } catch {
            /* fine */
        }
    }, [list]);
    const value = useMemo(() => ({ list, has: (s) => list.includes(s), toggle: (s) => setList((l) => (l.includes(s) ? l.filter((x) => x !== s) : [...l, s])) }), [list]);
    return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}
export const useWish = () => useContext(WishCtx);
