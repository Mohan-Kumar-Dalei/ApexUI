import React, { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/*
 * Gooey Nav: the active pill moves between links like a drop of liquid —
 * its leading edge races ahead and the trailing edge catches up, so it
 * stretches and snaps back. Each click also squirts a few droplets that
 * melt back into the pill. The goo (blur + alpha contrast) only touches the
 * blob layer, so the labels stay crisp.
 */

const DEFAULT_ITEMS = [
    { label: "Home", href: "#" },
    { label: "Components", href: "#" },
    { label: "Templates", href: "#" },
    { label: "Docs", href: "#" },
];

const FAST = { type: "spring", stiffness: 520, damping: 34 };
const SLOW = { type: "spring", stiffness: 190, damping: 22 };

const GooeyNav = ({ items = DEFAULT_ITEMS, initialActive = 0, onChange, accentColor = "#a3e635", particleCount = 8, theme = "dark", className = "" }) => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const reduced = useReducedMotion();
    const [active, setActive] = useState(initialActive);
    const [hover, setHover] = useState(null);
    const [bursts, setBursts] = useState([]);
    const [ready, setReady] = useState(false);
    const counter = useRef(0);
    const refs = useRef([]);
    const bar = useRef(null);
    const dark = theme !== "light";

    // Pill edges move separately; that difference is the "stretch".
    const left = useMotionValue(0);
    const right = useMotionValue(0);
    const top = useMotionValue(0);
    const height = useMotionValue(0);
    const width = useTransform(() => right.get() - left.get());

    const measure = useCallback((i) => {
        const el = refs.current[i];
        const b = bar.current;
        if (!el || !b) return null;
        const a = el.getBoundingClientRect();
        const p = b.getBoundingClientRect();
        return { l: a.left - p.left, r: a.right - p.left, t: a.top - p.top, h: a.height };
    }, []);

    // Place the pill without animation on mount and whenever the bar resizes.
    useLayoutEffect(() => {
        const snap = () => {
            const m = measure(active);
            if (!m) return;
            left.set(m.l);
            right.set(m.r);
            top.set(m.t);
            height.set(m.h);
            setReady(true);
        };
        snap();
        const ro = new ResizeObserver(snap);
        ro.observe(bar.current);
        return () => ro.disconnect();
        // Only re-snap on resize / item changes, not on every selection.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length, measure]);

    const select = (i, e) => {
        e?.preventDefault();
        if (i === active) return;
        const m = measure(i);
        const goingRight = i > active;
        setActive(i);
        onChange?.(i, items[i]);
        if (!m) return;
        if (reduced) {
            left.set(m.l);
            right.set(m.r);
        } else {
            animate(left, m.l, goingRight ? SLOW : FAST);
            animate(right, m.r, goingRight ? FAST : SLOW);
        }
        animate(top, m.t, FAST);
        animate(height, m.h, FAST);
        if (reduced || particleCount <= 0) return;
        const id = counter.current++;
        const cx = (m.l + m.r) / 2;
        const cy = m.t + m.h / 2;
        const drops = Array.from({ length: particleCount }, (_, k) => {
            const a = (Math.PI * 2 * k) / particleCount + (Math.random() - 0.5) * 0.5;
            const dist = 18 + Math.random() * 16;
            return { k, dx: Math.cos(a) * dist * 1.8, dy: Math.sin(a) * dist * 0.3, s: 9 + Math.random() * 7, delay: Math.random() * 0.06 };
        });
        setBursts((list) => [...list, { id, cx, cy, drops }]);
        setTimeout(() => setBursts((list) => list.filter((x) => x.id !== id)), 900);
    };

    return (
        <nav className={`relative inline-flex max-w-full ${className}`} aria-label="Main">
            <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true" focusable="false">
                <defs>
                    <filter id={`goo${uid}`} x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <div
                ref={bar}
                className={`relative flex items-center gap-0.5 rounded-full p-1.5 ${dark ? "bg-neutral-950 ring-1 ring-white/10" : "bg-white ring-1 ring-black/10 shadow-sm"}`}
                onPointerLeave={() => setHover(null)}
            >
                {/* Hover hint (not gooey) */}
                {hover !== null && hover !== active && (
                    <motion.span
                        layoutId={`${uid}-hover`}
                        className={`pointer-events-none absolute rounded-full ${dark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`}
                        style={(() => {
                            const m = measure(hover);
                            return m ? { left: m.l, top: m.t, width: m.r - m.l, height: m.h } : undefined;
                        })()}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                )}
                {/* Gooey blob layer: pill + droplets */}
                <div className="pointer-events-none absolute inset-0" style={{ filter: `url(#goo${uid})` }} aria-hidden="true">
                    <motion.span className="absolute rounded-full" style={{ left, top, width, height, background: accentColor, opacity: ready ? 1 : 0 }} />
                    {bursts.map((b) =>
                        b.drops.map((d) => (
                            <motion.span
                                key={`${b.id}-${d.k}`}
                                className="absolute rounded-full"
                                style={{ left: b.cx - d.s / 2, top: b.cy - d.s / 2, width: d.s, height: d.s, background: accentColor }}
                                initial={{ x: 0, y: 0, scale: 0.4 }}
                                animate={{ x: [0, d.dx, 0], y: [0, d.dy, 0], scale: [0.4, 1, 0.3] }}
                                transition={{ duration: 0.75, delay: d.delay, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] }}
                            />
                        )),
                    )}
                </div>
                {items.map((item, i) => (
                    <a
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        href={item.href}
                        onClick={(e) => select(i, e)}
                        onPointerEnter={() => setHover(i)}
                        aria-current={i === active ? "page" : undefined}
                        className={`relative z-[1] shrink-0 rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium sm:px-5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-current/30 ${i === active ? "text-neutral-950" : dark ? "text-white/65 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default GooeyNav;
