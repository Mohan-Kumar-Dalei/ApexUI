import { useCallback, useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Which section is in the middle of the screen right now.
export function useScrollSpy(ids) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-45% 0px -50% 0px' },
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        });
        return () => io.disconnect();
    }, [ids]);
    return active;
}

// Letters shuffle through glyphs and settle into the real text, left to right.
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789/<>_*';
export function useScramble(text, { auto = false, delay = 0 } = {}) {
    const [out, setOut] = useState(auto && !reduced() ? '' : text);
    const raf = useRef(0);
    const run = useCallback(() => {
        if (reduced()) return setOut(text);
        cancelAnimationFrame(raf.current);
        const start = performance.now();
        const tick = (now) => {
            const t = (now - start) / 16;
            const done = Math.floor(t / 1.2);
            setOut(
                text
                    .split('')
                    .map((ch, i) => (ch === ' ' || i < done ? ch : GLYPHS[(i * 7 + Math.floor(t)) % GLYPHS.length]))
                    .join(''),
            );
            if (done < text.length) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return undefined;
    }, [text]);
    useEffect(() => {
        if (!auto) return undefined;
        const t = setTimeout(run, delay);
        return () => {
            clearTimeout(t);
            cancelAnimationFrame(raf.current);
        };
    }, [auto, delay, run]);
    useEffect(() => () => cancelAnimationFrame(raf.current), []);
    return [out, run];
}

// Local time in a city, updated every second.
export function useClock(timeZone) {
    const fmt = () => new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
    const [now, setNow] = useState(fmt);
    useEffect(() => {
        const id = setInterval(() => setNow(fmt()), 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeZone]);
    return now;
}

// Pretends to fetch `data` with network delay, so the skeleton has something to wait for.
// Waits until `enabled` (for example, the section is on screen) before it starts.
export function useSlowLoad(data, ms = 1300, enabled = true) {
    const [state, setState] = useState({ loading: true, data: null, n: 0 });
    useEffect(() => {
        if (!state.loading || !enabled) return undefined;
        const t = setTimeout(() => setState((s) => ({ ...s, loading: false, data })), ms);
        return () => clearTimeout(t);
    }, [state.loading, state.n, data, ms, enabled]);
    const reload = () => setState((s) => ({ loading: true, data: null, n: s.n + 1 }));
    return [state, reload];
}
