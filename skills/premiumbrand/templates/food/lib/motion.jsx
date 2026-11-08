/* eslint-disable react-refresh/only-export-components */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EASE = 'expo.out';
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll: Lenis driven by the GSAP ticker ---------- */
let lenis = null;
export const getLenis = () => lenis;

export function SmoothScroll() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduced()) return undefined;
        lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
        window.__lenis = lenis; // lets the screenshot script jump to a section
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
        const t = setTimeout(() => ScrollTrigger.refresh(), 150);
        return () => clearTimeout(t);
    }, [pathname]);
    return null;
}

export function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
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

/* ---------- reveals ---------- */
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

// Words rise out of a mask one after another. Pass `accent` to set the last words in red italic.
export function Lines({ text, accent = '', as: Tag = 'h2', className = '', delay = 0, onLoad = false, accentClass = 'italic text-accent' }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const words = ref.current.querySelectorAll('[data-w]');
        const ctx = gsap.context(() => {
            gsap.from(words, { yPercent: 110, duration: 1.2, delay, stagger: 0.06, ease: EASE, ...(onLoad ? {} : { scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } }) });
        });
        return () => ctx.revert();
    }, [delay, onLoad, text, accent]);
    const words = [...text.split(' ').map((w) => [w, false]), ...(accent ? accent.split(' ').map((w) => [w, true]) : [])];
    return (
        <Tag ref={ref} className={className} aria-label={`${text}${accent ? ' ' + accent : ''}`}>
            {words.map(([w, a], i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
                    <span data-w className={`inline-block ${a ? accentClass : ''}`}>
                        {w}
                        {i < words.length - 1 ? ' ' : ''}
                    </span>
                </span>
            ))}
        </Tag>
    );
}

// Section heading that fades up from a soft blur (the Blur Fade idea).
export function BlurFade({ as: Tag = 'div', className = '', children, delay = 0 }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.from(ref.current, { y: 18, filter: 'blur(8px)', autoAlpha: 0, duration: 0.9, delay, ease: EASE, scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } });
        });
        return () => ctx.revert();
    }, [delay]);
    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
}

// true once the loader has lifted, so heavy 3D scenes start after the page is shown
export function useRevealed() {
    const [on, setOn] = useState(() => typeof document !== 'undefined' && document.documentElement.dataset.revealed === '1');
    useEffect(() => {
        if (on) return undefined;
        const go = () => setOn(true);
        addEventListener('lays:revealed', go);
        return () => removeEventListener('lays:revealed', go);
    }, [on]);
    return on;
}
