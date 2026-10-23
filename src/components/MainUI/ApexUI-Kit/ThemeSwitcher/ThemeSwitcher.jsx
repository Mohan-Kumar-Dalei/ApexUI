/* eslint-disable react-refresh/only-export-components -- the hook and helpers ship with the component on purpose */
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { applyTheme, defaultThemes } from "./themes.js";

/*
 * Theme Switcher: a palette button that opens a grid of colour themes. Picking
 * one reveals it with a soft circle growing from the swatch you clicked (View
 * Transitions API), and every component calling useTheme stays in sync.
 *
 * Props: themes = defaultThemes, placement = "down" | "up", align = "right" |
 * "left", label (text on the trigger; without it the trigger is a round icon
 * button), storageKey = "theme", target (element or ref to theme instead of
 * <html>, e.g. one preview box), className, buttonClassName.
 *
 * Hook: const [themeId, setTheme] = useTheme(themes, { storageKey, defaultTheme });
 *       setTheme("grape", event.currentTarget) reveals from that element.
 */

export { defaultThemes, applyTheme, themeScript } from "./themes.js";

const REVEAL_CSS = `@property --reveal { syntax: '<length>'; inherits: false; initial-value: 0px; }
@keyframes theme-reveal { from { --reveal: -10vmax; } to { --reveal: 160vmax; } }
html[data-theme-switching]::view-transition-old(root) { animation: none; }
html[data-theme-switching]::view-transition-new(root) {
  mix-blend-mode: normal;
  mask-image: radial-gradient(circle at var(--reveal-x, 100%) var(--reveal-y, 0px), #000 var(--reveal), transparent calc(var(--reveal) + 10vmax));
  animation: theme-reveal 0.9s cubic-bezier(0.65, 0, 0.35, 1) both;
}`;

const injectCss = () => {
    if (typeof document === "undefined" || document.getElementById("apex-theme-reveal")) return;
    const style = document.createElement("style");
    style.id = "apex-theme-reveal";
    style.textContent = REVEAL_CSS;
    document.head.appendChild(style);
};

const read = (key) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};
const write = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* storage blocked: the theme still applies for this visit */
    }
};

// One small store per storage key, so every useTheme with that key shares state.
const stores = new Map();
function storeFor(key, themes, defaultTheme) {
    if (stores.has(key)) return stores.get(key);
    const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const saved = read(key);
    const initial = (themes.find((x) => x.id === saved) ?? themes.find((x) => x.id === defaultTheme) ?? themes.find((x) => x.scheme === (prefersDark ? "dark" : "light")) ?? themes[0])?.id;
    const subs = new Set();
    const store = {
        id: initial,
        get: () => store.id,
        subscribe: (fn) => {
            subs.add(fn);
            return () => subs.delete(fn);
        },
        set: (id) => {
            store.id = id;
            subs.forEach((fn) => fn());
        },
    };
    stores.set(key, store);
    return store;
}

export function useTheme(themes = defaultThemes, { storageKey = "theme", defaultTheme, target } = {}) {
    const store = storeFor(storageKey, themes, defaultTheme);
    const id = useSyncExternalStore(store.subscribe, store.get, store.get);
    const rootEl = () => target?.current ?? (target instanceof Element ? target : null) ?? document.documentElement;

    useEffect(() => {
        injectCss();
        applyTheme(themes.find((x) => x.id === store.get()), rootEl());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themes, store, id]);

    const setTheme = (next, origin) => {
        const theme = themes.find((x) => x.id === next);
        if (!theme || next === store.get()) return;
        write(storageKey, next);
        const commit = () => {
            applyTheme(theme, rootEl());
            flushSync(() => store.set(next));
        };
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || reduced) {
            commit();
            return;
        }
        const root = document.documentElement;
        if (origin?.getBoundingClientRect) {
            const r = origin.getBoundingClientRect();
            root.style.setProperty("--reveal-x", `${r.left + r.width / 2}px`);
            root.style.setProperty("--reveal-y", `${r.top + r.height / 2}px`);
        } else {
            root.style.setProperty("--reveal-x", "100%");
            root.style.setProperty("--reveal-y", "0px");
        }
        root.setAttribute("data-theme-switching", "");
        const transition = document.startViewTransition(commit);
        transition.ready.catch(() => {});
        transition.finished.catch(() => {}).finally(() => root.removeAttribute("data-theme-switching"));
    };

    return [id, setTheme];
}

const Palette = () => (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-1.8a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22z" />
        <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
        <circle cx="10.5" cy="6.5" r="1" fill="currentColor" />
        <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
);

const ThemeSwitcher = ({ themes = defaultThemes, placement = "down", align = "right", label, storageKey = "theme", target, className = "", buttonClassName = "" }) => {
    const [id, setTheme] = useTheme(themes, { storageKey, target });
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const current = themes.find((x) => x.id === id) ?? themes[0];
    const up = placement === "up";

    useEffect(() => {
        if (!open) return undefined;
        const down = (e) => !root.current?.contains(e.target) && setOpen(false);
        const key = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", down);
        document.addEventListener("keydown", key);
        return () => {
            document.removeEventListener("pointerdown", down);
            document.removeEventListener("keydown", key);
        };
    }, [open]);

    return (
        <div ref={root} className={`relative inline-block ${className}`}>
            <button
                type="button"
                aria-label="Choose colour theme"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={`relative inline-flex items-center justify-center gap-2 border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--accent)] ${label ? "h-9 rounded-full px-3.5 text-sm font-medium" : "h-9 w-9 rounded-full"} ${buttonClassName}`}
            >
                <Palette />
                {label && <span>{label}</span>}
                <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full ring-2 ring-[var(--surface)]" style={{ background: current?.vars["--accent"] }} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label="Colour themes"
                        initial={{ opacity: 0, y: up ? 8 : -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: up ? 8 : -8, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        className={`absolute z-50 w-[17.5rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)] ${up ? "bottom-full mb-2" : "top-full mt-2"} ${align === "left" ? "left-0" : "right-0"}`}
                        style={{ transformOrigin: `${up ? "bottom" : "top"} ${align === "left" ? "left" : "right"}` }}
                    >
                        <p className="mb-2.5 px-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Pick a colour vibe</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            {themes.map((theme, i) => {
                                const active = theme.id === id;
                                return (
                                    <motion.button
                                        key={theme.id}
                                        type="button"
                                        aria-pressed={active}
                                        initial={{ y: 6 }}
                                        animate={{ y: 0 }}
                                        transition={{ delay: 0.03 * i, type: "spring", stiffness: 380, damping: 28 }}
                                        onClick={(e) => {
                                            setTheme(theme.id, e.currentTarget.querySelector("[data-swatch]"));
                                            setOpen(false);
                                        }}
                                        className={`relative flex items-center gap-2.5 rounded-xl py-2 pl-2 pr-5 text-left text-[0.82rem] font-medium transition-colors hover:bg-[var(--bg)] ${active ? "bg-[var(--bg)]" : ""}`}
                                        style={{ animation: `apex-theme-in 240ms ease-out ${30 * i}ms backwards` }}
                                    >
                                        <span data-swatch="" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--line)]" style={{ background: theme.vars["--bg"] }}>
                                            <span className="h-3 w-3 rounded-full" style={{ background: theme.vars["--accent"] }} />
                                        </span>
                                        <span className="flex-1 truncate">{theme.name}</span>
                                        {active && (
                                            <svg viewBox="0 0 24 24" className="absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M5 12l5 5L20 7" />
                                            </svg>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                        <style>{"@keyframes apex-theme-in{from{opacity:0}to{opacity:1}}"}</style>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeSwitcher;
