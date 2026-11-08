// Template from the Taana build: Lenis + GSAP wiring and the core reveals.
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EASE = 'expo.out';
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- smooth scroll (Lenis driven by the GSAP ticker) ---------------- */
let lenis = null;
export const getLenis = () => lenis;

export function SmoothScroll() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduced()) return undefined;
        lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
        window.__lenis = lenis; // lets screenshot scripts jump to a section
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
        <div ref={ref} className={`overflow-hidden bg-surface ${ratio} ${className}`}>
            <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClass}`} />
        </div>
    );
}

