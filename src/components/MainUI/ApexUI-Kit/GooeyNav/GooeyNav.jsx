import React, { useId, useRef, useState } from "react";
import { motion } from "framer-motion";

/*
 * Gooey Nav: the active pill glides between links like a drop of liquid,
 * and every click bursts a few droplets that melt back into it. The goo
 * comes from an SVG blur + contrast filter on the blob layer only, so the
 * labels stay crisp.
 */

const DEFAULT_ITEMS = [
    { label: "Home", href: "#" },
    { label: "Components", href: "#" },
    { label: "Templates", href: "#" },
    { label: "Docs", href: "#" },
];

const GooeyNav = ({ items = DEFAULT_ITEMS, initialActive = 0, onChange, accentColor = "#a3e635", particleCount = 8, theme = "dark", className = "" }) => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const [active, setActive] = useState(initialActive);
    const [bursts, setBursts] = useState([]);
    const counter = useRef(0);
    const refs = useRef([]);
    const wrap = useRef(null);
    const dark = theme !== "light";

    const box = (i) => {
        const el = refs.current[i];
        const p = wrap.current;
        if (!el || !p) return null;
        const a = el.getBoundingClientRect();
        const b = p.getBoundingClientRect();
        return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
    };
    const [pill, setPill] = useState(null);

    const select = (i, e) => {
        e?.preventDefault();
        const b = box(i);
        setActive(i);
        setPill(b);
        onChange?.(i, items[i]);
        if (!b) return;
        const id = counter.current++;
        const drops = Array.from({ length: particleCount }, (_, k) => {
            const a = (Math.PI * 2 * k) / particleCount + Math.random() * 0.6;
            const dist = 26 + Math.random() * 22;
            return { k, dx: Math.cos(a) * dist, dy: Math.sin(a) * dist * 0.6, s: 8 + Math.random() * 8 };
        });
        setBursts((list) => [...list, { id, cx: b.x + b.w / 2, cy: b.y + b.h / 2, drops }]);
        setTimeout(() => setBursts((list) => list.filter((x) => x.id !== id)), 900);
    };

    return (
        <nav className={`relative inline-flex ${className}`} aria-label="Main">
            <svg width="0" height="0" className="absolute" aria-hidden="true">
                <filter id={`goo${uid}`}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
                </filter>
            </svg>
            <div ref={wrap} className={`relative flex items-center gap-1 rounded-full border p-1.5 ${dark ? "border-white/10 bg-neutral-950" : "border-black/10 bg-white"}`}>
                {/* Blob layer (gooey) */}
                <div className="pointer-events-none absolute inset-0" style={{ filter: `url(#goo${uid})` }} aria-hidden="true">
                    <motion.span
                        className="absolute left-0 top-0 rounded-full"
                        style={{ background: accentColor }}
                        initial={false}
                        animate={pill ? { x: pill.x, y: pill.y, width: pill.w, height: pill.h, opacity: 1 } : { opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                    {bursts.map((b) =>
                        b.drops.map((d) => (
                            <motion.span
                                key={`${b.id}-${d.k}`}
                                className="absolute rounded-full"
                                style={{ left: b.cx - d.s / 2, top: b.cy - d.s / 2, width: d.s, height: d.s, background: accentColor }}
                                initial={{ x: 0, y: 0, scale: 0.6 }}
                                animate={{ x: [0, d.dx, 0], y: [0, d.dy, 0], scale: [0.6, 1, 0.2] }}
                                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
                            />
                        )),
                    )}
                </div>
                {items.map((item, i) => (
                    <a
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el;
                            if (el && i === active && !pill) requestAnimationFrame(() => setPill(box(i)));
                        }}
                        href={item.href}
                        onClick={(e) => select(i, e)}
                        aria-current={i === active ? "page" : undefined}
                        className={`relative z-[1] rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${i === active ? "text-black" : dark ? "text-white/70 hover:text-white" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default GooeyNav;
