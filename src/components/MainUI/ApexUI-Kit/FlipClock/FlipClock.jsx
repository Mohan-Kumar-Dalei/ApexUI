import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Flip Clock: split-flap digits that fold over when they change. Count down
 * to a date, count down a number of seconds, or show the time of day.
 */

const pad = (n) => String(n).padStart(2, "0");

function partsFor(mode, target, seconds, start) {
    const now = Date.now();
    if (mode === "clock") {
        const d = new Date(now);
        return [
            ["Hours", pad(d.getHours())],
            ["Minutes", pad(d.getMinutes())],
            ["Seconds", pad(d.getSeconds())],
        ];
    }
    const end = mode === "date" ? new Date(target).getTime() : start + seconds * 1000;
    const left = Math.max(0, Math.floor((end - now) / 1000));
    return [
        ["Days", pad(Math.floor(left / 86400))],
        ["Hours", pad(Math.floor((left % 86400) / 3600))],
        ["Minutes", pad(Math.floor((left % 3600) / 60))],
        ["Seconds", pad(left % 60)],
    ];
}

// One half of a digit card: the full glyph, clipped to the top or bottom half.
function Half({ digit, top, card, style, ...motionProps }) {
    return (
        <motion.span
            className={`absolute inset-x-0 h-1/2 overflow-hidden ${top ? "top-0 origin-bottom rounded-t-[0.14em]" : "bottom-0 origin-top rounded-b-[0.14em]"}`}
            style={{ background: card, backfaceVisibility: "hidden", ...style }}
            {...motionProps}
        >
            <span className={`absolute inset-x-0 grid h-[200%] place-items-center leading-none ${top ? "top-0" : "bottom-0"}`}>{digit}</span>
        </motion.span>
    );
}

function Flap({ digit, card, ink, moving }) {
    const [prev, setPrev] = useState(digit);
    const [flip, setFlip] = useState(0);

    // A new digit: fold the old top half down, then swing the new bottom half in.
    useEffect(() => {
        if (digit === prev) return undefined;
        if (!moving) {
            setPrev(digit);
            return undefined;
        }
        setFlip((f) => f + 1);
        const t = setTimeout(() => setPrev(digit), 620);
        return () => clearTimeout(t);
    }, [digit, prev, moving]);

    const flipping = digit !== prev;
    return (
        <span className="relative inline-block h-[1.35em] w-[0.9em] rounded-[0.14em] [perspective:400px]" style={{ color: ink }}>
            <Half digit={digit} top card={card} />
            <Half digit={flipping ? prev : digit} card={card} />
            {flipping && (
                <React.Fragment key={flip}>
                    <Half digit={prev} top card={card} style={{ zIndex: 2 }} initial={{ rotateX: 0 }} animate={{ rotateX: -90 }} transition={{ duration: 0.3, ease: "easeIn" }} />
                    <Half digit={digit} card={card} style={{ zIndex: 2 }} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }} />
                </React.Fragment>
            )}
            <span aria-hidden="true" className="absolute inset-x-0 top-1/2 z-[3] h-px bg-black/40" />
        </span>
    );
}

const FlipClock = ({ mode = "seconds", target, seconds = 3 * 86400 + 4 * 3600 + 25 * 60, accentColor = "#a3e635", theme = "dark", showLabels = true, size = 3, className = "" }) => {
    const reduced = useReducedMotion();
    const start = useRef(Date.now());
    const [parts, setParts] = useState(() => partsFor(mode, target, seconds, start.current));

    useEffect(() => {
        start.current = Date.now();
        const tick = () => setParts(partsFor(mode, target, seconds, start.current));
        tick();
        const id = setInterval(tick, 250);
        return () => clearInterval(id);
    }, [mode, target, seconds]);

    const dark = theme !== "light";
    const card = dark ? "#18181b" : "#f4f4f5";
    const ink = dark ? "#fafafa" : "#18181b";

    return (
        // The clock is sized in em; on narrow screens the font shrinks with the
        // container (cqw) so every unit fits instead of being cut off.
        <div className="flex w-full justify-center" style={{ containerType: "inline-size" }}>
        <div role="timer" aria-live="off" aria-label={parts.map(([l, v]) => `${v} ${l}`).join(", ")} className={`inline-flex items-start gap-[0.35em] font-mono font-bold ${className}`} style={{ fontSize: `min(${size}rem, ${(100 / (parts.length * 2.55)).toFixed(2)}cqw)` }}>
            {parts.map(([label, value], i) => (
                <React.Fragment key={label}>
                    {i > 0 && (
                        <span aria-hidden="true" className="flex h-[1.35em] flex-col justify-center gap-[0.18em]">
                            <span className="h-[0.12em] w-[0.12em] rounded-full" style={{ background: accentColor }} />
                            <span className="h-[0.12em] w-[0.12em] rounded-full" style={{ background: accentColor }} />
                        </span>
                    )}
                    <span className="flex flex-col items-center">
                        <span aria-hidden="true" className="flex gap-[0.08em]">
                            {[...value].map((d, k) => (
                                <Flap key={k} digit={d} card={card} ink={ink} moving={!reduced} />
                            ))}
                        </span>
                        {showLabels && (
                            <span className="mt-[0.4em] text-[0.22em] font-semibold uppercase tracking-[0.2em]" style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
                                {label}
                            </span>
                        )}
                    </span>
                </React.Fragment>
            ))}
        </div>
        </div>
    );
};

export default FlipClock;
