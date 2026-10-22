import { useEffect, useState } from "react";

/*
 * Real page-load progress, used by <LoadingScreen /> when you don't pass
 * your own `progress`. It counts what the page is actually loading:
 *
 *  - every <img> still loading (including ones added later),
 *  - scripts, stylesheets, fonts and fetches as the browser finishes them,
 *  - web fonts (document.fonts.ready) and the window "load" event.
 *
 * `progress` is finished / total (0 to 100) and only reaches 100 once the
 * page has fully loaded and nothing new has started for a moment, so the
 * bar and the count always match what really happened.
 */

const SETTLE_MS = 350;

export function usePageProgress(enabled = true) {
    const [state, setState] = useState({ loaded: 0, total: 0, done: false });

    useEffect(() => {
        if (!enabled || typeof window === "undefined") return undefined;
        let loaded = 0;
        let total = 0;
        let waitingForPage = document.readyState !== "complete";
        let settle = 0;
        let finished = false;
        const seen = new WeakSet();
        const cleanups = [];

        const update = () => {
            if (finished) return;
            const idle = !waitingForPage && loaded >= total;
            setState({ loaded, total, done: false });
            clearTimeout(settle);
            if (idle) {
                // Wait a moment: a page often starts a few more requests right after load.
                settle = setTimeout(() => {
                    if (!waitingForPage && loaded >= total) {
                        finished = true;
                        setState({ loaded, total: Math.max(total, loaded), done: true });
                    }
                }, SETTLE_MS);
            }
        };
        const add = (n = 1) => {
            total += n;
            update();
        };
        const finish = () => {
            loaded += 1;
            update();
        };

        // Only what is still loading (or starts) after the loader appears is counted,
        // so the bar runs from 0 to 100 for this load.
        // Images: pending ones count until they load or fail.
        const trackImage = (img) => {
            if (seen.has(img)) return;
            seen.add(img);
            if (img.complete) return;
            add();
            const end = () => {
                img.removeEventListener("load", end);
                img.removeEventListener("error", end);
                finish();
            };
            img.addEventListener("load", end);
            img.addEventListener("error", end);
            cleanups.push(() => {
                img.removeEventListener("load", end);
                img.removeEventListener("error", end);
            });
        };
        Array.from(document.images).forEach(trackImage);
        const mo = new MutationObserver((list) => {
            for (const m of list) {
                m.addedNodes.forEach((n) => {
                    if (n.nodeType !== 1) return;
                    if (n.tagName === "IMG") trackImage(n);
                    else n.querySelectorAll?.("img").forEach(trackImage);
                });
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });

        // Other files (scripts, CSS, fonts, fetch) are counted as the browser finishes them.
        let po;
        if (typeof PerformanceObserver !== "undefined") {
            po = new PerformanceObserver((list) => {
                const fresh = list.getEntries().filter((e) => e.initiatorType !== "img");
                if (!fresh.length) return;
                total += fresh.length;
                loaded += fresh.length;
                update();
            });
            try {
                po.observe({ type: "resource", buffered: false });
            } catch {
                po = undefined;
            }
        }

        // The page itself.
        if (waitingForPage) {
            total += 1;
            const onLoad = () => {
                waitingForPage = false;
                finish();
            };
            window.addEventListener("load", onLoad, { once: true });
            cleanups.push(() => window.removeEventListener("load", onLoad));
        }
        // Web fonts.
        if (document.fonts && document.fonts.status !== "loaded") {
            total += 1;
            document.fonts.ready.then(finish, finish);
        }
        update();

        return () => {
            finished = true;
            clearTimeout(settle);
            mo.disconnect();
            po?.disconnect();
            cleanups.forEach((fn) => fn());
        };
    }, [enabled]);

    const total = Math.max(1, state.total);
    const progress = state.done ? 100 : Math.min(99, Math.round((state.loaded / total) * 100));
    return { progress, loaded: state.loaded, total: state.total, done: state.done };
}

export default usePageProgress;
