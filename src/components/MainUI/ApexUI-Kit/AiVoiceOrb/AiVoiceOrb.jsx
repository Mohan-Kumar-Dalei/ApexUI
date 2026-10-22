import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/*
 * AI Voice Orb: the "face" of a voice assistant. Soft colour blobs swirl
 * inside a glass sphere and the whole orb reacts to its state — calm when
 * idle, pulsing while listening, spinning while thinking and rippling while
 * speaking. Tap it (or control `state`) to switch between them.
 */

const STATES = {
    idle: { label: "Tap to talk", scale: [1, 1.02, 1], spin: 14, speed: 3.2 },
    listening: { label: "Listening…", scale: [1, 1.1, 0.97, 1.08, 1], spin: 8, speed: 1.1 },
    thinking: { label: "Thinking…", scale: [0.96, 1, 0.96], spin: 2.2, speed: 1.4 },
    speaking: { label: "Speaking…", scale: [1, 1.06, 1, 1.12, 1, 1.04, 1], spin: 5, speed: 1.3 },
};
const ORDER = ["idle", "listening", "thinking", "speaking"];

const AiVoiceOrb = ({ state: stateProp, onStateChange, colors = ["#a3e635", "#22d3ee", "#a78bfa", "#f472b6"], size = 12, showLabel = true, className = "" }) => {
    const [inner, setInner] = useState("idle");
    const state = stateProp ?? inner;
    const s = STATES[state] ?? STATES.idle;

    const next = () => {
        const n = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        if (stateProp === undefined) setInner(n);
        onStateChange?.(n);
    };

    return (
        <div className={`flex flex-col items-center gap-6 ${className}`}>
            <button type="button" onClick={next} aria-label={`Voice assistant: ${s.label}`} className="relative grid place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-white/30" style={{ width: `${size}rem`, height: `${size}rem` }}>
                {/* Ripples while speaking or listening */}
                {(state === "speaking" || state === "listening") &&
                    [0, 1, 2].map((i) => (
                        <motion.span key={`${state}-${i}`} className="absolute inset-0 rounded-full border" style={{ borderColor: colors[i % colors.length] }} initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }} />
                    ))}
                {/* Outer glow: a soft gradient that only pulses (no blur filter, so it stays cheap). */}
                <motion.span className="absolute inset-[-22%] rounded-full" style={{ background: `radial-gradient(circle, ${colors[0]}55 0%, ${colors[2 % colors.length]}33 35%, transparent 68%)` }} animate={{ opacity: [0.6, 1, 0.6], scale: [0.96, 1.04, 0.96] }} transition={{ duration: s.speed * 1.4, repeat: Infinity, ease: "easeInOut" }} />
                {/* The sphere */}
                <motion.span className="relative block h-full w-full overflow-hidden rounded-full bg-neutral-950 shadow-[inset_0_0_40px_rgba(255,255,255,0.08)]" animate={{ scale: s.scale }} transition={{ duration: s.speed, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.span className="absolute inset-0 will-change-transform" animate={{ rotate: 360 }} transition={{ duration: s.spin, repeat: Infinity, ease: "linear" }}>
                        {colors.map((c, i) => (
                            <motion.span
                                key={c}
                                className="absolute h-3/4 w-3/4 rounded-full will-change-transform"
                                // Soft-edged blobs from gradients instead of a blur filter.
                                style={{ background: `radial-gradient(circle, ${c} 0%, ${c}aa 30%, transparent 68%)`, mixBlendMode: "screen", left: `${[0, 30, 10, 35][i % 4]}%`, top: `${[5, 0, 35, 30][i % 4]}%` }}
                                animate={{ x: ["0%", `${(i % 2 ? -1 : 1) * 12}%`, "0%"], y: ["0%", `${(i % 3 ? 1 : -1) * 14}%`, "0%"] }}
                                transition={{ duration: s.speed * (2 + i * 0.4), repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </motion.span>
                    {/* Glass highlight */}
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_35%)]" />
                    <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
                </motion.span>
            </button>
            {showLabel && (
                <div className="flex items-center gap-2 text-sm font-medium">
                    {state === "idle" ? <MicOff className="h-4 w-4 opacity-60" /> : <Mic className="h-4 w-4" style={{ color: colors[0] }} />}
                    <AnimatePresence mode="wait">
                        <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                            {s.label}
                        </motion.span>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AiVoiceOrb;
