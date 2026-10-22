import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/*
 * AI Voice Wave: layered glowing sine waves, like a phone assistant. Flat
 * and calm when idle, lively while listening, a slow swell while thinking
 * and full, syllable-like bursts while speaking. Tap to cycle the states or
 * control `state` yourself.
 */

const LABELS = { idle: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" };
const ORDER = ["idle", "listening", "thinking", "speaking"];

// How loud the voice "is" at time t for each state (0–1).
const levelAt = (state, t) =>
    state === "speaking" ? 0.45 + 0.55 * Math.abs(Math.sin(t * 8.5) * Math.sin(t * 2.1)) : state === "listening" ? 0.35 + 0.45 * Math.abs(Math.sin(t * 5.2) * Math.cos(t * 1.6)) : state === "thinking" ? 0.22 + 0.1 * Math.sin(t * 2) : 0.06;

const AiVoiceWave = ({ state: stateProp, onStateChange, colors = ["#a3e635", "#22d3ee", "#a78bfa"], height = 9, showLabel = true, className = "" }) => {
    const canvasRef = useRef(null);
    const [inner, setInner] = useState("idle");
    const state = stateProp ?? inner;
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let level = 0.05;
        const resize = () => {
            const r = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(r.width * dpr);
            canvas.height = Math.round(r.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const draw = (now) => {
            const t = now / 1000;
            const { width: w, height: h } = canvas.getBoundingClientRect();
            level += (levelAt(stateRef.current, t) - level) * 0.12;
            ctx.clearRect(0, 0, w, h);
            colors.forEach((c, k) => {
                const amp = h * 0.42 * level * (1 - k * 0.18);
                const freq = 1.6 + k * 0.7;
                const phase = t * (2.2 + k * 0.9) * (stateRef.current === "thinking" ? 0.5 : 1);
                ctx.beginPath();
                for (let x = 0; x <= w; x += 2) {
                    const u = x / w;
                    // Taper both ends so the wave fades in from a flat line.
                    const taper = Math.pow(Math.sin(Math.PI * u), 2.2);
                    const y = h / 2 + Math.sin(u * Math.PI * 2 * freq + phase) * amp * taper;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = c;
                ctx.lineWidth = 3 - k * 0.5;
                ctx.shadowColor = c;
                ctx.shadowBlur = 14;
                ctx.globalAlpha = 0.85;
                ctx.stroke();
            });
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [colors]);

    const next = () => {
        const n = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        if (stateProp === undefined) setInner(n);
        onStateChange?.(n);
    };

    return (
        <div className={`flex w-full max-w-xl flex-col items-center gap-4 ${className}`}>
            <button type="button" onClick={next} aria-label={`Voice assistant: ${LABELS[state]}`} className="w-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <canvas ref={canvasRef} aria-hidden="true" className="block w-full" style={{ height: `${height}rem` }} />
            </button>
            {showLabel && <Label state={state} color={colors[0]} />}
        </div>
    );
};

function Label({ state, color }) {
    return (
        <div className="flex items-center gap-2 text-sm font-medium">
            {state === "idle" ? <MicOff className="h-4 w-4 opacity-60" /> : <Mic className="h-4 w-4" style={{ color }} />}
            <AnimatePresence mode="wait">
                <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                    {LABELS[state]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default AiVoiceWave;
