import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/*
 * AI Voice Bars: a pill of rounded equalizer bars, mirrored from the middle.
 * Short dots when idle, lively while listening, a travelling ripple while
 * thinking and tall bursts while speaking. Tap to cycle, or set `state`.
 */

const LABELS = { idle: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" };
const ORDER = ["idle", "listening", "thinking", "speaking"];

const AiVoiceBars = ({ state: stateProp, onStateChange, count = 7, color = "#a3e635", theme = "dark", showLabel = true, className = "" }) => {
    const [inner, setInner] = useState("idle");
    const state = stateProp ?? inner;
    const stateRef = useRef(state);
    stateRef.current = state;
    const bars = useRef([]);
    const dark = theme !== "light";

    // Bar heights are written straight to the DOM each frame (no re-renders).
    useEffect(() => {
        let raf = 0;
        const heights = Array(count).fill(0.15);
        const tick = (now) => {
            const t = now / 1000;
            const s = stateRef.current;
            for (let i = 0; i < count; i++) {
                const centre = 1 - Math.abs(i - (count - 1) / 2) / ((count - 1) / 2 + 0.5);
                let target = 0.14;
                if (s === "listening") target = 0.25 + 0.6 * centre * Math.abs(Math.sin(t * 6 + i * 1.3) * Math.cos(t * 2.2 + i));
                if (s === "thinking") target = 0.2 + 0.35 * Math.max(0, Math.sin(t * 4 - i * 0.9));
                if (s === "speaking") target = 0.3 + 0.7 * centre * Math.abs(Math.sin(t * 9 + i * 2.1) * Math.sin(t * 2.7 + i * 0.6));
                heights[i] += (target - heights[i]) * 0.25;
                const el = bars.current[i];
                if (el) el.style.transform = `scaleY(${Math.max(0.12, heights[i])})`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [count]);

    const next = () => {
        const n = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        if (stateProp === undefined) setInner(n);
        onStateChange?.(n);
    };

    return (
        <div className={`flex flex-col items-center gap-5 ${className}`}>
            <button
                type="button"
                onClick={next}
                aria-label={`Voice assistant: ${LABELS[state]}`}
                className={`flex h-28 items-center gap-2.5 rounded-full px-8 outline-none transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-white/30 ${dark ? "bg-neutral-950 ring-1 ring-white/10" : "bg-white ring-1 ring-black/10"}`}
                style={{ boxShadow: state === "idle" ? "none" : `0 0 50px -12px ${color}` }}
            >
                {Array.from({ length: count }, (_, i) => (
                    <span key={i} ref={(el) => (bars.current[i] = el)} className="block h-16 w-3 rounded-full will-change-transform" style={{ background: color, transform: "scaleY(0.15)" }} />
                ))}
            </button>
            {showLabel && (
                <div className="flex items-center gap-2 text-sm font-medium">
                    {state === "idle" ? <MicOff className="h-4 w-4 opacity-60" /> : <Mic className="h-4 w-4" style={{ color }} />}
                    <AnimatePresence mode="wait">
                        <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                            {LABELS[state]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AiVoiceBars;
