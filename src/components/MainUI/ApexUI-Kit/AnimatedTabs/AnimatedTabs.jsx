import React, { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Animated Tabs: a pill slides to the chosen tab and the panel below
 * cross-fades in the direction you moved. Arrow keys, Home and End work.
 * Styles: "pill" (filled), "underline" or "segmented".
 */

const DEFAULT_TABS = [
    { id: "overview", label: "Overview", content: "A quick look at everything in one place — usage, limits and the latest activity." },
    { id: "analytics", label: "Analytics", content: "Visitors, conversions and retention, updated every few seconds with zero setup." },
    { id: "reports", label: "Reports", content: "Export weekly PDF reports or schedule them to land in your team's inbox." },
    { id: "settings", label: "Settings", content: "Workspace name, members, billing and the danger zone — all in one tidy screen." },
];

const AnimatedTabs = ({ tabs = DEFAULT_TABS, defaultTab, variant = "pill", accentColor = "#a3e635", theme = "dark", onChange, className = "" }) => {
    const id = useId();
    const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
    const [dir, setDir] = useState(1);
    const refs = useRef([]);
    const dark = theme !== "light";
    const index = tabs.findIndex((t) => t.id === active);
    const current = tabs[index];

    const select = (i) => {
        const t = tabs[(i + tabs.length) % tabs.length];
        setDir(tabs.indexOf(t) > index ? 1 : -1);
        setActive(t.id);
        refs.current[tabs.indexOf(t)]?.focus();
        onChange?.(t.id);
    };
    const onKeyDown = (e) => {
        const map = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
        if (map[e.key] === undefined) return;
        e.preventDefault();
        select(map[e.key]);
    };

    const list = {
        pill: `rounded-full p-1 ${dark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`,
        segmented: `rounded-xl p-1 ${dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-black/[0.04] ring-1 ring-black/10"}`,
        underline: `border-b ${dark ? "border-white/10" : "border-black/10"}`,
    }[variant];

    return (
        <div className={`w-full max-w-xl ${dark ? "text-white" : "text-neutral-900"} ${className}`}>
            <div role="tablist" aria-orientation="horizontal" onKeyDown={onKeyDown} className={`relative flex overflow-x-auto [scrollbar-width:none] ${list}`}>
                {tabs.map((t, i) => {
                    const on = t.id === active;
                    return (
                        <button
                            key={t.id}
                            ref={(el) => (refs.current[i] = el)}
                            role="tab"
                            id={`${id}-tab-${t.id}`}
                            aria-selected={on}
                            aria-controls={`${id}-panel`}
                            tabIndex={on ? 0 : -1}
                            onClick={() => select(i)}
                            className={`relative flex-1 whitespace-nowrap px-4 py-2 text-[0.88rem] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-current/40 ${variant === "underline" ? "pb-3" : variant === "pill" ? "rounded-full" : "rounded-lg"} ${on ? (variant === "pill" ? "text-neutral-950" : "") : dark ? "text-white/55 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                        >
                            {on && (
                                <motion.span
                                    layoutId={`${id}-indicator`}
                                    className={`absolute ${variant === "underline" ? "inset-x-2 -bottom-px h-[2px] rounded-full" : `inset-0 ${variant === "pill" ? "rounded-full" : "rounded-lg"}`}`}
                                    style={{
                                        background: variant === "segmented" ? (dark ? "rgba(255,255,255,0.1)" : "#fff") : accentColor,
                                        boxShadow: variant === "segmented" ? (dark ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "0 1px 3px rgba(0,0,0,0.12)") : undefined,
                                    }}
                                    transition={{ type: "spring", stiffness: 480, damping: 36 }}
                                />
                            )}
                            <span className="relative">{t.label}</span>
                        </button>
                    );
                })}
            </div>
            <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="relative mt-4 grid min-h-[6rem] overflow-hidden">
                {/* Invisible copies of every panel reserve the tallest height, so the
                    tab bar never jumps when panels of different lengths swap. */}
                {tabs.map((t) => (
                    <div key={t.id} aria-hidden="true" className="invisible col-start-1 row-start-1 p-5 text-[0.92rem] leading-relaxed">
                        <p className="mb-1.5 text-[1rem] font-semibold">{t.label}</p>
                        {t.content}
                    </div>
                ))}
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div
                        key={active}
                        custom={dir}
                        initial={{ opacity: 0, x: dir * 24, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: dir * -24, filter: "blur(4px)" }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`col-start-1 row-start-1 h-full rounded-2xl p-5 text-[0.92rem] leading-relaxed ${dark ? "bg-white/[0.04] text-white/75" : "bg-black/[0.03] text-neutral-600"}`}
                    >
                        <p className={`mb-1.5 text-[1rem] font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>{current?.label}</p>
                        {current?.content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnimatedTabs;
