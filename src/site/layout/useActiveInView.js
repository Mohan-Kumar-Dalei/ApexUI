import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * Keeps the active link of a scrollable nav list in view: on first paint it
 * jumps there, on later route changes it scrolls smoothly — and only when the
 * link is actually outside the visible part of the list. Only the list scrolls,
 * never the page.
 */
export default function useActiveInView(enabled = true) {
    const ref = useRef(null);
    const { pathname } = useLocation();
    const first = useRef(true);

    useEffect(() => {
        const box = ref.current;
        if (!enabled || !box) return undefined;
        const frame = requestAnimationFrame(() => {
            const link = box.querySelector('a[aria-current="page"]');
            if (!link) return;
            const boxRect = box.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            const margin = 48;
            const outside = linkRect.top < boxRect.top + margin || linkRect.bottom > boxRect.bottom - margin;
            if (outside) {
                const target = box.scrollTop + (linkRect.top - boxRect.top) - box.clientHeight / 2 + linkRect.height / 2;
                box.scrollTo({ top: Math.max(0, target), behavior: first.current ? 'auto' : 'smooth' });
            }
            first.current = false;
        });
        return () => cancelAnimationFrame(frame);
    }, [pathname, enabled]);

    return ref;
}
