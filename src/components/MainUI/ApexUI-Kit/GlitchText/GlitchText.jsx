import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Glitch Text: two colored copies of the text sit behind it and jump
 * around in random horizontal slices, like a broken signal. Runs all the
 * time or only while hovered.
 */

const slice = () => {
    const top = Math.random() * 90;
    return `inset(${top}% 0 ${Math.max(0, 100 - top - (6 + Math.random() * 22))}% 0)`;
};

const GlitchText = ({ text = "GLITCH", colors = ["#22d3ee", "#f43f5e"], speed = 90, hoverOnly = false, className = "" }) => {
    const reduced = useReducedMotion();
    const [hover, setHover] = useState(false);
    const a = useRef(null);
    const b = useRef(null);
    const active = !reduced && (!hoverOnly || hover);

    useEffect(() => {
        const layers = [a.current, b.current];
        if (!active) {
            layers.forEach((el) => {
                el.style.clipPath = "inset(50% 0 50% 0)";
                el.style.transform = "none";
            });
            return undefined;
        }
        const id = setInterval(() => {
            layers.forEach((el, i) => {
                const burst = Math.random() < 0.25;
                el.style.clipPath = slice();
                el.style.transform = `translate(${(i ? 1 : -1) * (burst ? 6 + Math.random() * 6 : 1 + Math.random() * 3)}px, ${(Math.random() - 0.5) * 2}px)`;
            });
        }, speed);
        return () => clearInterval(id);
    }, [active, speed]);

    const layer = "pointer-events-none absolute inset-0 select-none";
    return (
        <span className={`relative inline-block font-black tracking-tight ${className}`} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <span>{text}</span>
            {/* Sliced, shifted copies painted over the text. */}
            <span ref={a} aria-hidden="true" className={layer} style={{ color: colors[0], clipPath: "inset(50% 0 50% 0)" }}>
                {text}
            </span>
            <span ref={b} aria-hidden="true" className={layer} style={{ color: colors[1], clipPath: "inset(50% 0 50% 0)" }}>
                {text}
            </span>
        </span>
    );
};

export default GlitchText;
