/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/*
 * Premium motion kit for the demo sites (the same patterns the skill teaches).
 * Everything animates transform, opacity or clip-path only, plays once, and
 * turns off for people who ask for reduced motion.
 */

export const EASE = [0.16, 1, 0.3, 1];

// Fade and rise when it scrolls into view.
export function Reveal({ as = 'div', delay = 0, y = 28, className = '', children, ...rest }) {
    const reduce = useReducedMotion();
    const Tag = motion[as];
    return (
        <Tag
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay }}
            className={className}
            {...rest}
        >
            {children}
        </Tag>
    );
}

// Words rise out of a mask, one after another. `onMount` plays it right away (heroes).
export function Lines({ text, as = 'h2', className = '', style, delay = 0, stagger = 0.06, onMount = false }) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
    const show = onMount || inView;
    const Tag = as;
    return (
        <Tag ref={ref} className={className} style={style} aria-label={text}>
            {text.split(' ').map((w, i) => (
                <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span
                        className="inline-block will-change-transform"
                        initial={reduce ? false : { y: '110%' }}
                        animate={show ? { y: '0%' } : undefined}
                        transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
                    >
                        {w}
                        {' '}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}

// Image uncovers from the bottom like a lifting curtain, then settles from a slight zoom.
export function ClipImage({ src, alt, className = '', imgClassName = '', delay = 0 }) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={`overflow-hidden ${className}`}
            initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.3, ease: EASE, delay }}
        >
            <motion.img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover ${imgClassName}`}
                initial={reduce ? false : { scale: 1.18 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: EASE, delay }}
            />
        </motion.div>
    );
}

// Image that drifts slower than the page while you scroll.
export function Parallax({ src, alt, className = '', strength = 12, eager = false }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
    return (
        <div ref={ref} className={`overflow-hidden ${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} ${className}`}>
            <motion.img
                src={src}
                alt={alt}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                style={reduce ? undefined : { y, scale: 1 + (strength * 2.4) / 100 }}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </div>
    );
}

// An endless line of words; separators are small shapes, not punctuation.
export function Marquee({ items, className = '', style, speed = 40, mark }) {
    const reduce = useReducedMotion();
    const row = (
        <div className="flex shrink-0 items-center gap-10 pr-10">
            {items.map((t) => (
                <span key={t} className="flex items-center gap-10 whitespace-nowrap">
                    {t}
                    {mark ?? <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rotate-45 bg-current opacity-50" />}
                </span>
            ))}
        </div>
    );
    return (
        <div className={`flex overflow-hidden ${className}`} style={style} aria-label={items.join(', ')}>
            <div aria-hidden="true" className="flex" style={reduce ? undefined : { animation: `demo-marquee ${speed}s linear infinite` }}>
                {row}
                {row}
            </div>
            <style>{'@keyframes demo-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>
        </div>
    );
}

// Counts up to `to` once it is visible.
export function Counter({ to, suffix = '', decimals = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const reduce = useReducedMotion();
    const [v, setV] = useState(reduce ? to : 0);
    useEffect(() => {
        if (!inView || reduce) return undefined;
        const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: setV });
        return () => c.stop();
    }, [inView, to, reduce]);
    return (
        <span ref={ref} className={`tabular-nums ${className}`}>
            {v.toFixed(decimals)}
            {suffix}
        </span>
    );
}

// Seconds the hero should wait so its entrance plays after the intro curtain.
export function useIntroDelay(name) {
    const [d] = useState(() => {
        if (typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 0;
        try {
            return sessionStorage.getItem(`demo-intro:${name}`) ? 0 : 1.45;
        } catch {
            return 1.45;
        }
    });
    return d;
}

// Opening curtain: the name appears, then the panel lifts away. Once per visit.
export function Intro({ name, bg, fg, font }) {
    const reduce = useReducedMotion();
    const [show, setShow] = useState(() => {
        if (reduce) return false;
        try {
            return !sessionStorage.getItem(`demo-intro:${name}`);
        } catch {
            return true;
        }
    });
    useEffect(() => {
        if (!show) return undefined;
        try {
            sessionStorage.setItem(`demo-intro:${name}`, '1');
        } catch {
            /* ignore */
        }
        const t = setTimeout(() => setShow(false), 1700);
        return () => clearTimeout(t);
    }, [show, name]);
    if (!show) return null;
    return (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center" style={{ background: bg, color: fg }} initial={{ y: 0 }} animate={{ y: '-100%' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1.05 }}>
            <span className="overflow-hidden">
                <motion.span className="block text-[clamp(2.5rem,8vw,6rem)] leading-none" style={font} initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
                    {name}
                </motion.span>
            </span>
        </motion.div>
    );
}

// Hero image that settles from a slow zoom on load.
export function SettleImage({ src, alt, className = '' }) {
    const reduce = useReducedMotion();
    return (
        <motion.img
            src={src}
            alt={alt}
            className={className}
            initial={reduce ? false : { scale: 1.16 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.6, ease: EASE }}
        />
    );
}
