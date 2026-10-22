import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/*
 * AI Voice Ring: radial bars around a glowing core, like a circular audio
 * visualiser. The ring breathes when idle, flickers while listening, spins
 * while thinking and blooms while speaking. Tap to cycle, or set `state`.
 */

const LABELS = { idle: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" };
const ORDER = ["idle", "listening", "thinking", "speaking"];

const AiVoiceRing = ({ state: stateProp, onStateChange, colors = ["#a3e635", "#22d3ee"], bars = 72, size = 14, showLabel = true, className = "" }) => {
    const canvasRef = useRef(null);
    const [inner, setInner] = useState("idle");
    const state = stateProp ?? inner;
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let spin = 0;
        let last = performance.now();
        const lens = Array(bars).fill(0.05);
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
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const t = now / 1000;
            const s = stateRef.current;
            const { width: w, height: h } = canvas.getBoundingClientRect();
            const cx = w / 2;
            const cy = h / 2;
            const inner = Math.min(w, h) * 0.24;
            const maxLen = Math.min(w, h) * 0.22;
            spin += dt * (s === "thinking" ? 1.6 : 0.15);

            ctx.clearRect(0, 0, w, h);
            const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, inner * 1.1);
            core.addColorStop(0, `${colors[0]}66`);
            core.addColorStop(1, `${colors[0]}00`);
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(cx, cy, inner * 1.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.lineCap = "round";
            ctx.lineWidth = Math.max(2, (Math.PI * 2 * inner) / bars * 0.45);
            for (let i = 0; i < bars; i++) {
                const a = (i / bars) * Math.PI * 2 + spin;
                let target = 0.05 + 0.03 * Math.sin(t * 2 + i * 0.3);
                if (s === "listening") target = 0.15 + 0.45 * Math.abs(Math.sin(t * 7 + i * 0.7) * Math.cos(t * 2.3 + i * 0.21));
                if (s === "thinking") target = 0.12 + 0.3 * Math.max(0, Math.sin(i * 0.26 - t * 5));
                if (s === "speaking") target = 0.2 + 0.8 * Math.abs(Math.sin(t * 8 + i * 0.45) * Math.sin(t * 2.6 + i * 0.13));
                lens[i] += (target - lens[i]) * 0.2;
                const len = lens[i] * maxLen;
                const k = i / bars;
                ctx.strokeStyle = k < 0.5 ? colors[0] : colors[1] ?? colors[0];
                ctx.globalAlpha = 0.55 + lens[i] * 0.45;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
                ctx.lineTo(cx + Math.cos(a) * (inner + len), cy + Math.sin(a) * (inner + len));
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = colors[0];
            ctx.shadowColor = colors[0];
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(cx, cy, inner * (0.32 + 0.06 * Math.sin(t * 3)), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [colors, bars]);

    const next = () => {
        const n = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        if (stateProp === undefined) setInner(n);
        onStateChange?.(n);
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <button type="button" onClick={next} aria-label={`Voice assistant: ${LABELS[state]}`} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/30" style={{ width: `min(${size}rem, 80vw)`, aspectRatio: "1" }}>
                <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
            </button>
            {showLabel && (
                <div className="flex items-center gap-2 text-sm font-medium">
                    {state === "idle" ? <MicOff className="h-4 w-4 opacity-60" /> : <Mic className="h-4 w-4" style={{ color: colors[0] }} />}
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

export default AiVoiceRing;
