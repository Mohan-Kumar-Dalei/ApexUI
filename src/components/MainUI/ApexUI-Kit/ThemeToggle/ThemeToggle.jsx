import { useState, useEffect, useRef, useId } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { buildAnimationCSS } from "./ThemeAnimation.js";

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

        // ✅ Scope selectors with html[vt-owner]
        const scopedCSS = rawCSS
            .replaceAll("::view-transition-new", `html[vt-owner="${uid}"]::view-transition-new`)
            .replaceAll("::view-transition-old", `html[vt-owner="${uid}"]::view-transition-old`)
            .replaceAll("::view-transition-group", `html[vt-owner="${uid}"]::view-transition-group`);

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
        const html = document.documentElement;
        html.classList.forEach((c) => c.startsWith("theme-") && html.classList.remove(c));
        html.classList.add(`theme-${theme}`);

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

        const run = () => setTheme(nextTheme);

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
