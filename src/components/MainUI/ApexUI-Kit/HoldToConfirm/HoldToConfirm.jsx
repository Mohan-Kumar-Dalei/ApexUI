import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";

/*
 * Hold to Confirm: for actions you don't want to trigger by accident. Press
 * and hold (pointer, Enter or Space) and the button fills; let go early and
 * it drains back with a nudge. Once full it confirms, shows a check, and
 * resets after a moment. Moving the pointer off the button cancels.
 */

const HoldToConfirm = ({
    children = "Hold to delete",
    confirmedLabel = "Deleted",
    icon = Trash2,
    duration = 1500,
    resetAfter = 1800,
    color = "#ef4444",
    onConfirm,
    disabled = false,
    className = "",
}) => {
    const reduced = useReducedMotion();
    const [state, setState] = useState("idle"); // idle | holding | done
    const [via, setVia] = useState("pointer");
    const shake = useAnimationControls();
    const timers = useRef({ done: 0, reset: 0 });
    const pointer = useRef(null);
    const started = useRef(0);
    const Icon = icon;

    useEffect(() => () => {
        clearTimeout(timers.current.done);
        clearTimeout(timers.current.reset);
    }, []);

    const start = (input) => {
        if (disabled || state !== "idle") return;
        setVia(input);
        setState("holding");
        started.current = performance.now();
        timers.current.done = setTimeout(() => {
            setState("done");
            pointer.current = null;
            onConfirm?.(input);
            navigator.vibrate?.(30);
            if (resetAfter > 0) timers.current.reset = setTimeout(() => setState("idle"), resetAfter);
        }, duration);
    };
    const cancel = () => {
        if (state !== "holding") return;
        clearTimeout(timers.current.done);
        pointer.current = null;
        setState("idle");
        // A short shake tells people to keep holding.
        if (!reduced && performance.now() - started.current < duration * 0.9) shake.start({ x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.35 } });
    };

    const holding = state === "holding";
    const done = state === "done";
    const fillMs = reduced ? 0 : holding ? duration : 220;

    return (
        <motion.button
            type="button"
            disabled={disabled}
            aria-label={done ? confirmedLabel : `${typeof children === "string" ? children : "Hold to confirm"} (press and hold)`}
            aria-busy={holding}
            animate={shake}
            onPointerDown={(e) => {
                if (!e.isPrimary || e.button !== 0) return;
                pointer.current = e.pointerId;
                e.currentTarget.setPointerCapture(e.pointerId);
                start("pointer");
            }}
            onPointerMove={(e) => {
                if (pointer.current !== e.pointerId || !holding) return;
                const r = e.currentTarget.getBoundingClientRect();
                const out = e.clientX < r.left - 10 || e.clientX > r.right + 10 || e.clientY < r.top - 10 || e.clientY > r.bottom + 10;
                if (out) cancel();
            }}
            onPointerUp={cancel}
            onPointerCancel={cancel}
            onKeyDown={(e) => {
                if (e.repeat || (e.key !== "Enter" && e.key !== " ")) return;
                e.preventDefault();
                start("keyboard");
            }}
            onKeyUp={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                cancel();
            }}
            onBlur={cancel}
            className={`relative inline-flex h-11 min-w-[11rem] touch-none select-none items-center justify-center overflow-hidden rounded-full border px-5 text-sm font-semibold outline-none transition-[transform,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${via === "pointer" ? "active:scale-[0.98]" : ""} ${className}`}
            style={{ borderColor: color, color: done ? "#fff" : color, background: done ? color : `color-mix(in srgb, ${color} 12%, transparent)`, "--tw-ring-color": color }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {done ? (
                    <motion.span key="done" className="relative flex items-center gap-1.5" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }}>
                        <Check className="h-4 w-4" strokeWidth={3} /> {confirmedLabel}
                    </motion.span>
                ) : (
                    <motion.span key="idle" className="relative flex items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {Icon && <Icon className="h-4 w-4" />} {children}
                    </motion.span>
                )}
            </AnimatePresence>
            {/* The fill: a solid copy of the label revealed from the left while holding. */}
            {!done && (
                <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center gap-1.5 text-white"
                    style={{
                        background: color,
                        clipPath: holding ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                        transition: `clip-path ${fillMs}ms ${holding ? "linear" : "cubic-bezier(0.22,1,0.36,1)"}`,
                    }}
                >
                    {Icon && <Icon className="h-4 w-4" />} {children}
                </span>
            )}
        </motion.button>
    );
};

export default HoldToConfirm;
