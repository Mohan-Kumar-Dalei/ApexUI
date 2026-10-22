import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Globe2, Lock, Rocket, Sparkles, Zap } from "lucide-react";

/*
 * Spotlight Grid: a bento grid of cards sharing one pointer spotlight. The
 * light lands on every card's border and surface at once, so moving across
 * the grid feels like sweeping a torch over it.
 */

const DEFAULT_ITEMS = [
    { title: "Lightning fast", description: "Ships as tiny chunks and loads only what a page needs.", icon: Zap, span: 2 },
    { title: "Secure by default", description: "No tracking, no cookies, nothing to configure.", icon: Lock },
    { title: "Global edge", description: "Served from 300+ cities close to your users.", icon: Globe2 },
    { title: "Insights", description: "Real-time numbers for every component you add.", icon: BarChart3 },
    { title: "Launch in minutes", description: "One CLI command copies the code into your project.", icon: Rocket },
    { title: "Delightful motion", description: "Spring physics and GPU-friendly transforms everywhere.", icon: Sparkles, span: 2 },
];

const THEMES = {
    dark: { card: "bg-neutral-950 text-white", base: "rgba(255,255,255,0.08)", muted: "text-white/55", icon: "bg-white/[0.06] text-white", edge: (c) => c, glow: 12 },
    // On white, a bright accent washes out: darken the border light and strengthen the glow.
    light: { card: "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]", base: "rgba(0,0,0,0.09)", muted: "text-neutral-500", icon: "bg-black/[0.04] text-neutral-900", edge: (c) => `color-mix(in srgb, ${c} 70%, #000)`, glow: 24 },
};

// "auto" follows the visitor's light / dark system setting.
function useResolvedTheme(theme) {
    const [system, setSystem] = useState("dark");
    useEffect(() => {
        if (theme !== "auto") return undefined;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const update = () => setSystem(mq.matches ? "dark" : "light");
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [theme]);
    return theme === "auto" ? system : theme;
}

const SpotlightGrid = ({ items = DEFAULT_ITEMS, color = "#a3e635", size = 360, theme = "auto", minCardWidth = 12, className = "" }) => {
    const ref = useRef(null);
    const t = THEMES[useResolvedTheme(theme)] ?? THEMES.dark;

    // Every card gets the pointer position in its own coordinates.
    const onMove = (e) => {
        ref.current.querySelectorAll("[data-spot]").forEach((card) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
            card.style.setProperty("--spot", "1");
        });
    };
    const onLeave = () => ref.current.querySelectorAll("[data-spot]").forEach((card) => card.style.setProperty("--spot", "0"));

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={`grid w-full gap-3 ${className}`}
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minCardWidth}rem), 1fr))` }}
        >
            {items.map((item, i) => {
                const Icon = item.icon;
                return (
                    <motion.article
                        key={item.title ?? i}
                        data-spot=""
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.05 }}
                        className={`relative overflow-hidden rounded-2xl p-5 ${item.span > 1 ? "sm:col-span-2" : ""} ${t.card}`}
                        style={{ "--spot": 0, boxShadow: `inset 0 0 0 1px ${t.base}` }}
                    >
                        {/* Border light: a ring-shaped mask over a radial gradient. */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-[inherit] p-px transition-opacity duration-300"
                            style={{
                                opacity: "var(--spot)",
                                background: `radial-gradient(${size}px circle at var(--mx) var(--my), ${t.edge(color)}, transparent 45%)`,
                                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                                WebkitMaskComposite: "xor",
                                mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                            }}
                        />
                        {/* Surface glow. */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                            style={{ opacity: "var(--spot)", background: `radial-gradient(${size * 1.2}px circle at var(--mx) var(--my), color-mix(in srgb, ${color} ${t.glow}%, transparent), transparent 45%)` }}
                        />
                        <div className="relative">
                            {Icon && (
                                <span className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${t.icon}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                            )}
                            <h3 className="text-[1rem] font-semibold">{item.title}</h3>
                            {item.description && <p className={`mt-1.5 text-[0.85rem] leading-relaxed ${t.muted}`}>{item.description}</p>}
                        </div>
                    </motion.article>
                );
            })}
        </div>
    );
};

export default SpotlightGrid;
