import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

/*
 * Animated Button: one button, seven feels. Pick a variant:
 *  shine   – a gleam sweeps across on hover
 *  fill    – color floods in from where the pointer entered and drains out where it left
 *  border  – a light beam runs around the border
 *  press   – a chunky 3D key that sinks when pressed
 *  loading – spins while onClick's promise runs, then shows a check
 *  ripple  – a ripple spreads from every click
 *  arrow   – the arrow slides through and the label nudges over
 * Every motion is a GPU transform with one shared easing, so it stays smooth.
 */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const SIZES = {
    sm: { box: "h-9 px-4 text-[0.8rem] gap-1.5", pad: "px-4 gap-1.5" },
    md: { box: "h-11 px-5 text-[0.9rem] gap-2", pad: "px-5 gap-2" },
    lg: { box: "h-[3.25rem] px-7 text-base gap-2.5", pad: "px-7 gap-2.5" },
};

// Black or white text, whichever reads better on the accent.
const inkOn = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return l > 0.6 ? "#0a0a0a" : "#ffffff";
};

const AnimatedButton = ({ variant = "shine", children = "Get started", color = "#a3e635", size = "md", onClick, disabled, className = "", ...rest }) => {
    const ref = useRef(null);
    const [fill, setFill] = useState({ x: 0, y: 0, d: 0, on: false });
    const [ripples, setRipples] = useState([]);
    const [status, setStatus] = useState("idle");
    const ink = inkOn(color);
    const s = SIZES[size] ?? SIZES.md;
    const base = `relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-semibold outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${s.box}`;
    const smooth = { transitionTimingFunction: EASE };

    const localPoint = (e) => {
        const r = ref.current.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };

    if (variant === "shine") {
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`group ${base} bg-neutral-950 text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--c)] active:translate-y-0 active:scale-[0.97] active:duration-100 ${className}`}
                style={{ "--c": color, ...smooth }}
                {...rest}
            >
                <span aria-hidden="true" className="absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 0 1px ${color}66, inset 0 1px 0 rgba(255,255,255,0.12)` }} />
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1/2 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[900ms] will-change-transform group-hover:translate-x-[260%]"
                    style={smooth}
                />
                <span className="relative">{children}</span>
            </button>
        );
    }

    if (variant === "fill") {
        // One circle big enough to cover the button, scaled 0 → 1 from the entry point.
        const track = (e, on) => {
            const p = localPoint(e);
            setFill({ x: p.x, y: p.y, d: Math.hypot(Math.max(p.x, p.w - p.x), Math.max(p.y, p.h - p.y)) * 2, on });
        };
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                disabled={disabled}
                onPointerEnter={(e) => track(e, true)}
                onPointerLeave={(e) => track(e, false)}
                className={`${base} border-[1.5px] transition-[color,transform] duration-500 active:scale-[0.97] active:duration-100 ${className}`}
                style={{ borderColor: color, color: fill.on ? ink : color, ...smooth }}
                {...rest}
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full will-change-transform"
                    style={{
                        left: fill.x - fill.d / 2,
                        top: fill.y - fill.d / 2,
                        width: fill.d,
                        height: fill.d,
                        background: color,
                        transform: `scale(${fill.on ? 1 : 0})`,
                        transition: `transform 550ms ${EASE}`,
                    }}
                />
                <span className="relative">{children}</span>
            </button>
        );
    }

    if (variant === "border") {
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`group ${base} text-white transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_30px_-8px_var(--c)] active:scale-[0.97] active:duration-100 ${className}`}
                style={{ "--c": color, padding: "1.5px", ...smooth }}
                {...rest}
            >
                <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                    style={{ background: `conic-gradient(from 0deg, transparent 0 68%, ${color}66 78%, ${color} 88%, transparent 100%)` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                />
                <span className={`relative flex h-full w-full items-center justify-center rounded-full bg-neutral-950 transition-colors duration-300 group-hover:bg-neutral-900 ${s.pad}`}>{children}</span>
            </button>
        );
    }

    if (variant === "press") {
        const edge = `color-mix(in srgb, ${color} 55%, #000)`;
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`${base} -translate-y-1 shadow-[0_5px_0_var(--edge),0_14px_22px_-10px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[6px] hover:shadow-[0_7px_0_var(--edge),0_18px_26px_-12px_rgba(0,0,0,0.55)] active:translate-y-0 active:shadow-[0_1px_0_var(--edge),0_4px_8px_-4px_rgba(0,0,0,0.4)] active:duration-75 ${className}`}
                style={{ background: color, color: ink, "--edge": edge, ...smooth }}
                {...rest}
            >
                <span aria-hidden="true" className="absolute inset-x-3 top-[3px] h-1/3 rounded-full bg-white/25 blur-[2px]" />
                <span className="relative">{children}</span>
            </button>
        );
    }

    if (variant === "loading") {
        const run = async (e) => {
            if (status !== "idle") return;
            setStatus("loading");
            try {
                const result = onClick?.(e);
                await (result && typeof result.then === "function" ? result : new Promise((r) => setTimeout(r, 1400)));
                setStatus("done");
            } catch {
                setStatus("idle");
                return;
            }
            setTimeout(() => setStatus("idle"), 1600);
        };
        return (
            <motion.button
                ref={ref}
                type="button"
                layout
                onClick={run}
                disabled={disabled}
                aria-busy={status === "loading"}
                className={`${base} transition-[background-color,color] duration-300 active:scale-[0.97] ${className}`}
                style={{ background: status === "done" ? "#22c55e" : color, color: status === "done" ? "#fff" : ink, borderRadius: 999, ...smooth }}
                transition={{ layout: { type: "spring", stiffness: 420, damping: 34 } }}
                {...rest}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={status}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {status === "idle" && children}
                        {status === "loading" && <Loader2 className="h-[1.15em] w-[1.15em] animate-spin" aria-label="Loading" />}
                        {status === "done" && (
                            <>
                                <Check className="h-[1.15em] w-[1.15em]" /> Done
                            </>
                        )}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        );
    }

    if (variant === "ripple") {
        return (
            <button
                ref={ref}
                type="button"
                disabled={disabled}
                onPointerDown={(e) => {
                    const p = localPoint(e);
                    setRipples((list) => [...list, { id: performance.now(), x: p.x, y: p.y, d: Math.hypot(p.w, p.h) * 2.2 }]);
                }}
                onClick={onClick}
                className={`${base} transition-[transform,filter] duration-300 hover:brightness-110 active:scale-[0.98] active:duration-100 ${className}`}
                style={{ background: color, color: ink, ...smooth }}
                {...rest}
            >
                {ripples.map((r) => (
                    <motion.span
                        key={r.id}
                        aria-hidden="true"
                        className="pointer-events-none absolute rounded-full will-change-transform"
                        style={{ left: r.x - r.d / 2, top: r.y - r.d / 2, width: r.d, height: r.d, background: ink }}
                        initial={{ scale: 0, opacity: 0.28 }}
                        animate={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
                    />
                ))}
                <span className="relative">{children}</span>
            </button>
        );
    }

    // arrow
    return (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group ${base} pr-1.5 transition-transform duration-300 active:scale-[0.97] active:duration-100 ${className}`}
            style={{ background: color, color: ink, ...smooth }}
            {...rest}
        >
            <span className="relative transition-transform duration-500 group-hover:-translate-x-1" style={smooth}>
                {children}
            </span>
            <span className="relative grid aspect-square h-[calc(100%-0.5rem)] place-items-center overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105" style={{ background: ink, color, ...smooth }}>
                <ArrowRight className="absolute h-[1.1em] w-[1.1em] transition-transform duration-500 group-hover:translate-x-[180%]" style={smooth} />
                <ArrowRight className="absolute h-[1.1em] w-[1.1em] -translate-x-[180%] transition-transform duration-500 group-hover:translate-x-0" style={smooth} />
            </span>
        </button>
    );
};

export default AnimatedButton;
