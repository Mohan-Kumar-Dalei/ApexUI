import { useEffect, useRef, useState } from "react";

/*
 * Real loading progress for <LoadingScreen progress={...} />.
 *
 * Give it the things your page needs before it can show, and it loads them
 * and reports how many are done:
 *
 *   const { progress, loaded, total, done } = useLoadProgress([
 *       "/hero.jpg",                         // images are decoded
 *       "/data/products.json",               // anything else is fetched
 *       () => import("./Dashboard.jsx"),     // or any function returning a promise
 *   ]);
 *   <LoadingScreen variant="runner" progress={progress} statusText={`${loaded} of ${total} loaded`} />
 *
 * Items load in parallel; progress is the share that has finished (0 to 100),
 * so the bar and the number always match what really happened. A failed item
 * still counts as finished (see `errors`) so the screen never gets stuck.
 * Pass a stable list (define it outside the component or memoize it).
 */

const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i;

function loadItem(item) {
    if (typeof item === "function") return Promise.resolve().then(item);
    if (item && typeof item.then === "function") return item;
    if (typeof item === "string") {
        if (IMAGE.test(item)) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => (img.decode ? img.decode().then(resolve, resolve) : resolve());
                img.onerror = reject;
                img.src = item;
            });
        }
        return fetch(item).then((r) => {
            if (!r.ok) throw new Error(`${r.status} ${item}`);
            return r.blob();
        });
    }
    return Promise.resolve();
}

export function useLoadProgress(items, { enabled = true } = {}) {
    const list = useRef(items);
    list.current = items;
    const total = items.length;
    const key = `${total}|${items.map((i) => (typeof i === "string" ? i : typeof i)).join("|")}`;
    const [state, setState] = useState(() => ({ loaded: 0, total, errors: 0, progress: total ? 0 : 100, done: !total }));

    useEffect(() => {
        if (!enabled) return undefined;
        const work = list.current;
        const count = work.length;
        if (!count) {
            setState({ loaded: 0, total: 0, errors: 0, progress: 100, done: true });
            return undefined;
        }
        let cancelled = false;
        let loaded = 0;
        let errors = 0;
        setState({ loaded: 0, total: count, errors: 0, progress: 0, done: false });
        const finish = (ok) => {
            if (cancelled) return;
            loaded += 1;
            if (!ok) errors += 1;
            setState({ loaded, total: count, errors, progress: Math.round((loaded / count) * 100), done: loaded === count });
        };
        work.forEach((item) => loadItem(item).then(() => finish(true), () => finish(false)));
        return () => {
            cancelled = true;
        };
    }, [key, enabled]);

    return state;
}

export default useLoadProgress;
