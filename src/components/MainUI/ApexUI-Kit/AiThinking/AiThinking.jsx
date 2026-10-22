import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Check, ChevronDown, Loader2 } from "lucide-react";

/*
 * AI Thinking: shows an assistant working through its steps. A shimmering
 * "Thinking" label with a live timer, steps that tick off one by one, and a
 * collapsible panel for the reasoning. Drive `step` yourself, or let it play.
 */

const DEFAULT_STEPS = [
    { label: "Understanding the question", detail: "Looking for the goal and the constraints." },
    { label: "Searching 12 sources", detail: "Docs, changelogs and two blog posts look relevant." },
    { label: "Comparing approaches", detail: "CSS transforms win: no layout, GPU friendly." },
    { label: "Writing the answer", detail: "Short summary first, then the code." },
];

const AiThinking = ({ steps = DEFAULT_STEPS, step: stepProp, stepDuration = 1400, loop = true, accentColor = "#a3e635", theme = "dark", defaultOpen = true, className = "" }) => {
    const [auto, setAuto] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [open, setOpen] = useState(defaultOpen);
    const controlled = typeof stepProp === "number";
    const current = controlled ? stepProp : auto;
    const done = current >= steps.length;
    const dark = theme !== "light";

    useEffect(() => {
        if (controlled) return undefined;
        const id = setTimeout(() => setAuto((s) => (s >= steps.length ? (loop ? 0 : s) : s + 1)), current >= steps.length ? 2400 : stepDuration);
        return () => clearTimeout(id);
    }, [controlled, current, steps.length, stepDuration, loop]);

    useEffect(() => {
        if (current === 0) setSeconds(0);
        if (done) return undefined;
        const id = setInterval(() => setSeconds((s) => s + 0.1), 100);
        return () => clearInterval(id);
    }, [done, current]);

    const muted = dark ? "text-white/50" : "text-neutral-500";

    return (
        <div className={`w-full max-w-md rounded-3xl border p-4 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"} ${className}`}>
            <style>{"@keyframes apex-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}"}</style>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 text-left">
                <span className="relative grid h-9 w-9 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${accentColor} 18%, transparent)`, color: accentColor }}>
                    {!done && <motion.span className="absolute inset-0 rounded-xl border-2" style={{ borderColor: accentColor }} animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />}
                    {done ? <Check className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                </span>
                <span className="flex-1">
                    <span
                        className="block text-[0.95rem] font-semibold"
                        style={
                            done
                                ? undefined
                                : {
                                      backgroundImage: `linear-gradient(90deg, ${dark ? "#fff6" : "#0006"} 0%, ${dark ? "#fff" : "#000"} 50%, ${dark ? "#fff6" : "#0006"} 100%)`,
                                      backgroundSize: "200% 100%",
                                      WebkitBackgroundClip: "text",
                                      backgroundClip: "text",
                                      color: "transparent",
                                      animation: "apex-shimmer 1.6s linear infinite",
                                  }
                        }
                    >
                        {done ? "Thought it through" : "Thinking"}
                    </span>
                    <span className={`text-[0.75rem] tabular-nums ${muted}`}>{done ? `Done in ${seconds.toFixed(1)}s` : `${seconds.toFixed(1)}s · step ${Math.min(current + 1, steps.length)} of ${steps.length}`}</span>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""} ${muted}`} />
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="relative mt-4 overflow-hidden pl-3">
                        <span aria-hidden="true" className={`absolute bottom-3 left-[1.15rem] top-2 w-px ${dark ? "bg-white/10" : "bg-black/10"}`} />
                        {steps.map((s, i) => {
                            const state = i < current ? "done" : i === current && !done ? "active" : "todo";
                            return (
                                <motion.li key={s.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: state === "todo" ? 0.4 : 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex gap-3 pb-3.5 last:pb-0">
                                    <span className="relative z-10 mt-0.5 grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full" style={{ background: state === "done" ? accentColor : dark ? "#262626" : "#e5e5e5", color: "#0a0a0a" }}>
                                        {state === "done" && <Check className="h-3 w-3" strokeWidth={3} />}
                                        {state === "active" && <Loader2 className="h-3 w-3 animate-spin" style={{ color: accentColor }} />}
                                    </span>
                                    <span>
                                        <span className="block text-[0.85rem] font-medium">{s.label}</span>
                                        <AnimatePresence>
                                            {state !== "todo" && s.detail && (
                                                <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`block text-[0.78rem] ${muted}`}>
                                                    {s.detail}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </span>
                                </motion.li>
                            );
                        })}
                    </motion.ol>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AiThinking;
