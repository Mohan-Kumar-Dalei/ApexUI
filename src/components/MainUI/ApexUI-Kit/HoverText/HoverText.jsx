import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const glow = (color) => `drop-shadow(0 4px 32px ${color})`;
const noGlow = (color) => `drop-shadow(0 0px 0px ${color})`;

const HoverText = ({
    text = "ApexUI",
    fontSize = "2.5rem",
    className = "",
    effect = "defaultReveal",
    effectColor = "#C27AFF",
    textColor = "#fff",
}) => {
    const charsRef = useRef([]);
    const containerRef = useRef(null);
    const chars = () => charsRef.current.slice(0, text.length).filter(Boolean);

    // `overwrite: "auto"` lets a new hover take over smoothly from the previous one.
    const to = (el, vars) => el && gsap.to(el, { overwrite: "auto", ...vars });

    const rest = (el, duration = 0.4) =>
        to(el, {
            x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0,
            color: textColor,
            filter: noGlow(effectColor),
            duration,
            ease: "power3.out",
        });

    // Reset every letter whenever the text, colours or effect change, so
    // switching effects never leaves letters stuck mid-animation.
    useEffect(() => {
        const els = chars();
        gsap.killTweensOf(els);
        gsap.set(els, { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0, color: textColor, filter: noGlow(effectColor) });
        return () => gsap.killTweensOf(els);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, effect, effectColor, textColor]);

    const neighbours = (i, radius, fn) => {
        for (let j = -radius; j <= radius; j++) fn(charsRef.current[i + j], j);
    };

    const onCharEnter = (i) => {
        const el = charsRef.current[i];
        switch (effect) {
            case "wave":
                neighbours(i, 2, (n, j) => to(n, {
                    y: -18 + Math.abs(j) * 8,
                    scale: 1.12 - Math.abs(j) * 0.08,
                    color: effectColor,
                    filter: glow(effectColor),
                    duration: 0.45 + Math.abs(j) * 0.08,
                    ease: "elastic.out(1, 0.55)",
                }));
                break;
            case "rubber":
                if (!el) return;
                gsap.timeline({ defaults: { overwrite: "auto" } })
                    .to(el, { scaleX: 1.5, scaleY: 0.7, color: effectColor, filter: glow(effectColor), duration: 0.18, ease: "power3.out" })
                    .to(el, { scaleX: 0.85, scaleY: 1.18, duration: 0.16, ease: "power2.inOut" })
                    .to(el, { scaleX: 1, scaleY: 1, color: textColor, filter: noGlow(effectColor), duration: 0.5, ease: "elastic.out(1, 0.4)" });
                break;
            case "jump":
                neighbours(i, 1, (n, j) => to(n, j === 0
                    ? { y: -28, color: effectColor, filter: glow(effectColor), duration: 0.35, ease: "back.out(2)" }
                    : { x: j * 8, rotate: j * 8, duration: 0.25, ease: "power3.out" }));
                break;
            case "rotate":
                neighbours(i, 1, (n, j) => to(n, j === 0
                    ? { rotate: 24, scale: 1.18, color: effectColor, filter: glow(effectColor), duration: 0.35, ease: "back.out(2)" }
                    : { rotate: j * 12, duration: 0.25, ease: "power3.out" }));
                break;
            case "defaultReveal":
            default:
                if (effect !== "defaultReveal" && effect) return;
                to(el, {
                    scale: 1.4,
                    rotate: gsap.utils.random(-10, 10),
                    color: effectColor,
                    filter: glow(effectColor),
                    duration: 0.45,
                    ease: "elastic.out(1, 0.5)",
                });
        }
    };

    const onCharLeave = (i) => {
        switch (effect) {
            case "wave":
                neighbours(i, 2, (n, j) => rest(n, 0.45 + Math.abs(j) * 0.08));
                break;
            case "jump":
            case "rotate":
                neighbours(i, 1, (n) => rest(n, 0.4));
                break;
            case "defaultReveal":
                rest(charsRef.current[i], 0.4);
                break;
            default:
        }
    };

    const onMove = (e) => {
        if (effect !== "magnetic") return;
        const box = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - box.left;
        const my = e.clientY - box.top;
        // Measure every letter once per move, then animate.
        const data = chars().map((el) => {
            const r = el.getBoundingClientRect();
            const dx = (mx - (r.left - box.left + r.width / 2)) / box.width;
            const dy = (my - (r.top - box.top + r.height / 2)) / box.height;
            return { el, dx, dy, dist: Math.hypot(dx, dy) };
        });
        const focus = data.reduce((best, d) => (d.dist < best.dist ? d : best), data[0]);
        data.forEach((d) => {
            const mag = Math.max(0, 1 - d.dist / 0.35);
            const isFocus = d === focus;
            to(d.el, {
                x: d.dx * 18 * mag,
                y: d.dy * 18 * mag,
                scale: isFocus ? 1.22 : 1 + 0.12 * mag,
                rotate: d.dx * 10 * mag,
                filter: isFocus ? glow(effectColor) : `drop-shadow(0 2px 16px ${effectColor}44)`,
                color: isFocus ? effectColor : textColor,
                zIndex: isFocus ? 10 : 2,
                duration: 0.35,
                ease: "power3.out",
            });
        });
    };

    const onEnter = () => {
        if (effect !== "party") return;
        chars().forEach((el, i) => to(el, {
            scale: 1.25,
            rotate: (i % 2 === 0 ? 1 : -1) * (18 + i * 4),
            color: effectColor,
            filter: glow(effectColor),
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
            delay: i * 0.015,
        }));
    };

    const onLeave = () => {
        if (effect === "party" || effect === "magnetic") chars().forEach((el) => rest(el, 0.6));
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center select-none cursor-pointer ${className}`}
            style={{ fontSize, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}
            onMouseMove={onMove}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            aria-label={text}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => (charsRef.current[i] = el)}
                    aria-hidden="true"
                    onMouseEnter={() => onCharEnter(i)}
                    onMouseLeave={() => onCharLeave(i)}
                    style={{
                        display: "inline-block",
                        marginRight: char === " " ? "0.18em" : 0,
                        padding: "0 0.04em",
                        willChange: "transform",
                        position: "relative",
                        zIndex: 2,
                        color: textColor,
                    }}
                >
                    {char === " " ? " " : char}
                </span>
            ))}
        </div>
    );
};

export default HoverText;
