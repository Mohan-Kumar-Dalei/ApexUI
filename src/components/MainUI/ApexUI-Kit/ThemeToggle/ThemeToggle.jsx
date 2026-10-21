import { useState, useEffect, useRef, useId } from "react";
import { flushSync } from "react-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { buildAnimationCSS } from "./ThemeAnimation.js";

// Swaps the theme-* class on <html>.
function applyThemeClass(theme) {
    const html = document.documentElement;
    [...html.classList].forEach((c) => c.startsWith("theme-") && html.classList.remove(c));
    html.classList.add(`theme-${theme}`);
}

export default function ThemeToggle({
    animation = "circle",
    duration = "1.5s",
    ease = "var(--vt-ease)",
    className = "",
    onApplied,
    LightTheme = "light"
}) {
    // unique ID per instance
    const uid = useId();

    const getInitialTheme = () => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("apexui-theme");
            if (saved === "dark" || saved === LightTheme) return saved;
        }
        return "dark";
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const btnRef = useRef(null);

    // ------------------------------
    // Inject animation CSS (scoped per instance)
    // ------------------------------
    useEffect(() => {
        const rawCSS = buildAnimationCSS(animation, { duration, ease });
        const suffix = uid.replace(/[^\w-]/g, "");

        // ✅ Scope selectors with html[vt-owner]; :root variables and keyframe names
        // too, so several toggles on one page don't override each other's settings.
        const scopedCSS = rawCSS
            .replace(/(?<![-\w])vt-(?=[a-z])/g, `vt-${suffix}-`)
            .replace(/:root\b/g, `html[vt-owner="${uid}"]`)
            .replaceAll("::view-transition-new", `html[vt-owner="${uid}"]::view-transition-new`)
            .replaceAll("::view-transition-old", `html[vt-owner="${uid}"]::view-transition-old`)
            .replaceAll("::view-transition-group", `html[vt-owner="${uid}"]::view-transition-group`)
            // No CSS transitions while the view transition runs, otherwise elements are
            // captured mid-fade in the old colours and snap to the new ones afterwards.
            + `html[vt-owner="${uid}"] *, html[vt-owner="${uid}"] *::before, html[vt-owner="${uid}"] *::after { transition: none !important; }`;

        let styleEl = document.getElementById(`vt-style-${uid}`);
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = `vt-style-${uid}`;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = scopedCSS;
    }, [animation, duration, ease, uid]);

    // ------------------------------
    // Apply theme globally + notify
    // ------------------------------
    useEffect(() => {
        applyThemeClass(theme);

        try {
            localStorage.setItem("apexui-theme", theme);
            window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
        } catch (err) {
            console.error("Error saving theme:", err);
        }

        onApplied?.(theme);
    }, [theme, onApplied]);

    // ------------------------------
    // Listen for global theme sync
    // ------------------------------
    useEffect(() => {
        const handler = (e) => setTheme(e.detail);
        window.addEventListener("theme-change", handler);
        return () => window.removeEventListener("theme-change", handler);
    }, []);

    // ------------------------------
    // Toggle handler
    // ------------------------------
    const handleClick = () => {
        const nextTheme = theme === LightTheme ? "dark" : LightTheme;

        // Origin from button center
        if (btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            document.documentElement.style.setProperty("--cx", `${r.left + r.width / 2}px`);
            document.documentElement.style.setProperty("--cy", `${r.top + r.height / 2}px`);
        }

        // ✅ Use html instead of body
        document.documentElement.setAttribute("vt-owner", uid);

        // Apply the theme synchronously: the browser takes the transition's "new"
        // snapshot as soon as this returns, before a normal React update would land.
        const run = () => {
            applyThemeClass(nextTheme);
            flushSync(() => setTheme(nextTheme));
        };

        if (document.startViewTransition) {
            const vt = document.startViewTransition(run);
            vt.finished.finally(() => {
                document.documentElement.removeAttribute("vt-owner"); // cleanup
            });
        } else {
            run();
            document.documentElement.removeAttribute("vt-owner");
        }
    };

    const isLight = theme === LightTheme;

    return (
        <button
            ref={btnRef}
            onClick={handleClick}
            className={`rounded-full text-2xl transition-transform hover:scale-110 
                 text-[var(--color-text)] ${className}`}
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            {isLight ? <FiMoon /> : <FiSun />}
        </button>
    );
}