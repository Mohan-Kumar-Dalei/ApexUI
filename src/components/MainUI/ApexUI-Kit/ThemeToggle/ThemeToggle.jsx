import { useState, useEffect, useRef, useId } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { buildAnimationCSS } from "./ThemeAnimation.js";

const STORAGE_KEY = "apexui-theme";

const readSavedTheme = (lightTheme) => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "dark" || saved === lightTheme) return saved;
    } catch {
        /* storage unavailable (private mode, blocked cookies) */
    }
    return "dark";
};

export default function ThemeToggle({
    animation = "circle",
    duration = "1.5s",
    ease = "var(--vt-ease)",
    className = "",
    onApplied,
    LightTheme = "light"
}) {
    const uid = useId();
    const [theme, setTheme] = useState(() => (typeof window === "undefined" ? "dark" : readSavedTheme(LightTheme)));
    const btnRef = useRef(null);
    const onAppliedRef = useRef(onApplied);
    onAppliedRef.current = onApplied;

    // A stable key so an inline `animation={{...}}` object doesn't rebuild the CSS every render.
    const animationKey = typeof animation === "string" ? animation : JSON.stringify(animation ?? {});

    // Inject this instance's animation CSS, scoped with html[vt-owner] so several
    // toggles with different animations can live on one page.
    useEffect(() => {
        const scope = `html[vt-owner="${uid}"]`;
        const anim = animationKey.startsWith("{") ? JSON.parse(animationKey) : animationKey;
        const css = buildAnimationCSS(anim, { duration, ease })
            .replaceAll(":root", scope)
            .replaceAll("::view-transition-new", `${scope}::view-transition-new`)
            .replaceAll("::view-transition-old", `${scope}::view-transition-old`)
            .replaceAll("::view-transition-group", `${scope}::view-transition-group`);

        const styleEl = document.createElement("style");
        styleEl.dataset.apexuiThemeToggle = uid;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        return () => styleEl.remove();
    }, [animationKey, duration, ease, uid]);

    // Apply the theme class to <html> and tell other toggles about it.
    useEffect(() => {
        const html = document.documentElement;
        [...html.classList].forEach((c) => c.startsWith("theme-") && html.classList.remove(c));
        html.classList.add(`theme-${theme}`);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* ignore */
        }
        window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
        onAppliedRef.current?.(theme);
    }, [theme]);

    useEffect(() => {
        const handler = (e) => setTheme(e.detail);
        window.addEventListener("theme-change", handler);
        return () => window.removeEventListener("theme-change", handler);
    }, []);

    const handleClick = () => {
        const nextTheme = theme === LightTheme ? "dark" : LightTheme;
        const html = document.documentElement;
        const run = () => setTheme(nextTheme);

        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || reduceMotion) {
            run();
            return;
        }

        if (btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            html.style.setProperty("--cx", `${r.left + r.width / 2}px`);
            html.style.setProperty("--cy", `${r.top + r.height / 2}px`);
        }
        html.setAttribute("vt-owner", uid);
        const vt = document.startViewTransition(run);
        vt.finished.finally(() => html.removeAttribute("vt-owner"));
    };

    const isLight = theme === LightTheme;

    return (
        <button
            ref={btnRef}
            type="button"
            onClick={handleClick}
            className={`rounded-full text-2xl transition-transform hover:scale-110 text-[var(--color-text)] ${className}`}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            title="Toggle theme"
        >
            {isLight ? <FiMoon /> : <FiSun />}
        </button>
    );
}
