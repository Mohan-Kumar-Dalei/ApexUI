/* eslint-disable react-refresh/only-export-components */
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/*
 * Two motion pieces kept outside the demos so any demo can use them. Transform only,
 * and off for people who ask for reduced motion.
 */

export const EASE = [0.16, 1, 0.3, 1];

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

