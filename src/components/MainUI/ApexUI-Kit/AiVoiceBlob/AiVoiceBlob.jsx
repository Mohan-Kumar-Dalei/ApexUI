import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

/*
 * AI Voice Blob: a soft gradient blob whose outline wobbles with the voice.
 * Nearly round when idle, rippling while listening, slowly morphing while
 * thinking and bouncing while speaking. Drawn as one smooth SVG path that
 * updates each frame. Tap to cycle, or set `state`.
 */

const LABELS = { idle: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" };
const ORDER = ["idle", "listening", "thinking", "speaking"];
const POINTS = 10;

// Closed smooth curve through the points (Catmull-Rom → Bézier).
const smoothPath = (pts) => {
    const n = pts.length;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    return `${d}Z`;
};

const AiVoiceBlob = ({ state: stateProp, onStateChange, colors = ["#a3e635", "#22d3ee", "#a78bfa"], size = 13, showLabel = true, className = "" }) => {
    const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const pathRef = useRef(null);
    const glowRef = useRef(null);
    const [inner, setInner] = useState("idle");
    const state = stateProp ?? inner;
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        let raf = 0;
        let energy = 0.05;
        const tick = (now) => {
            const t = now / 1000;
            const s = stateRef.current;
            const target = s === "speaking" ? 0.16 + 0.12 * Math.abs(Math.sin(t * 7)) : s === "listening" ? 0.12 + 0.06 * Math.abs(Math.sin(t * 4.3)) : s === "thinking" ? 0.1 : 0.035;
            energy += (target - energy) * 0.08;
            const speed = s === "thinking" ? 0.8 : s === "idle" ? 0.6 : 2.4;
            const pts = [];
            for (let i = 0; i < POINTS; i++) {
                const a = (i / POINTS) * Math.PI * 2;
                const wob = Math.sin(t * speed + i * 1.7) * 0.6 + Math.sin(t * speed * 1.7 + i * 2.9) * 0.4;
                const r = 40 * (1 + energy * wob);
                pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
            }
            const d = smoothPath(pts);
            pathRef.current?.setAttribute("d", d);
            glowRef.current?.setAttribute("d", d);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const next = () => {
        const n = ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
        if (stateProp === undefined) setInner(n);
        onStateChange?.(n);
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <button type="button" onClick={next} aria-label={`Voice assistant: ${LABELS[state]}`} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/30" style={{ width: `min(${size}rem, 76vw)`, aspectRatio: "1" }}>
                <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
                    <defs>
                        <linearGradient id={`g${gid}`} x1="0" y1="0" x2="1" y2="1">
                            {colors.map((c, i) => (
                                <stop key={c} offset={`${(i / Math.max(1, colors.length - 1)) * 100}%`} stopColor={c} />
                            ))}
                        </linearGradient>
                        <radialGradient id={`h${gid}`} cx="0.35" cy="0.3" r="0.6">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {/* A wider, faint copy works as the glow without a blur filter. */}
                    <path ref={glowRef} fill={`url(#g${gid})`} opacity="0.25" transform="translate(50 50) scale(1.14) translate(-50 -50)" />
                    <path ref={pathRef} fill={`url(#g${gid})`} />
                    <circle cx="40" cy="38" r="22" fill={`url(#h${gid})`} />
                </svg>
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

export default AiVoiceBlob;
