import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Square, Volume2 } from "lucide-react";

/*
 * AI Speak: reads text out loud with the browser's own speech engine and
 * highlights each word as it is spoken, over a live waveform. Pick a voice
 * and a speed; pause, resume or stop at any time. Where speech isn't
 * available it still plays the highlighting silently.
 */

const SPEEDS = [0.75, 1, 1.25, 1.5];

const AiSpeak = ({
    text = "Hi, I'm your Apex assistant. I can read any answer out loud, highlight each word as I go, and you can pause me whenever you like.",
    lang = "en",
    accentColor = "#a3e635",
    theme = "dark",
    showVoicePicker = true,
    onEnd,
    className = "",
}) => {
    const [status, setStatus] = useState("idle"); // idle | speaking | paused
    const [word, setWord] = useState(-1);
    const [rate, setRate] = useState(1);
    const [voices, setVoices] = useState([]);
    const [voiceName, setVoiceName] = useState("");
    const timer = useRef(0);
    const supported = typeof window !== "undefined" && "speechSynthesis" in window;
    const dark = theme !== "light";

    // Word list with the character index each word starts at.
    const words = useMemo(() => {
        const list = [];
        const re = /\S+/g;
        let m;
        while ((m = re.exec(text))) list.push({ w: m[0], start: m.index });
        return list;
    }, [text]);

    useEffect(() => {
        if (!supported) return undefined;
        const load = () => {
            const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
            setVoices(all);
            setVoiceName((n) => n || all.find((v) => v.default)?.name || all[0]?.name || "");
        };
        load();
        window.speechSynthesis.addEventListener("voiceschanged", load);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
    }, [supported, lang]);

    const stop = () => {
        clearInterval(timer.current);
        if (supported) window.speechSynthesis.cancel();
        setStatus("idle");
        setWord(-1);
    };
    useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

    const finish = () => {
        clearInterval(timer.current);
        setStatus("idle");
        setWord(words.length);
        onEnd?.();
    };

    const speak = () => {
        stop();
        setStatus("speaking");
        setWord(0);
        if (!supported) {
            // Silent fallback: step through the words at a speaking pace.
            let i = 0;
            timer.current = setInterval(() => {
                i += 1;
                if (i >= words.length) finish();
                else setWord(i);
            }, 330 / rate);
            return;
        }
        const u = new SpeechSynthesisUtterance(text);
        u.rate = rate;
        u.lang = lang;
        const voice = voices.find((v) => v.name === voiceName);
        if (voice) u.voice = voice;
        u.onboundary = (e) => {
            if (e.name && e.name !== "word") return;
            // The spoken word is the last one starting at or before charIndex.
            let idx = 0;
            for (let k = 0; k < words.length && words[k].start <= e.charIndex; k++) idx = k;
            setWord(idx);
        };
        u.onend = finish;
        u.onerror = () => setStatus("idle");
        window.speechSynthesis.speak(u);
    };

    const togglePause = () => {
        if (status === "speaking") {
            if (supported) window.speechSynthesis.pause();
            else clearInterval(timer.current);
            setStatus("paused");
        } else if (status === "paused") {
            if (supported) {
                window.speechSynthesis.resume();
                setStatus("speaking");
            } else speak();
        }
    };

    const speaking = status === "speaking";
    const muted = dark ? "text-white/50" : "text-neutral-500";
    const bars = 28;

    return (
        <div className={`w-full max-w-lg rounded-3xl border p-5 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"} ${className}`}>
            <div className="flex items-center gap-4">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={status === "idle" ? speak : togglePause}
                    aria-label={status === "idle" ? "Read aloud" : speaking ? "Pause" : "Resume"}
                    className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-black"
                    style={{ background: accentColor, boxShadow: speaking ? `0 0 0 6px ${accentColor}33, 0 0 30px ${accentColor}66` : "none", transition: "box-shadow 300ms" }}
                >
                    {speaking ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="ml-0.5 h-6 w-6" fill="currentColor" />}
                </motion.button>

                {/* Waveform: bars dance while speaking and settle when idle. */}
                <div className="flex h-12 flex-1 items-center gap-[3px]" aria-hidden="true">
                    {Array.from({ length: bars }, (_, i) => {
                        const base = 0.2 + 0.25 * Math.abs(Math.sin(i * 0.9));
                        return (
                            <motion.span
                                key={i}
                                className="flex-1 rounded-full"
                                style={{ background: accentColor, height: "100%", originY: 0.5, opacity: speaking ? 0.95 : 0.35 }}
                                animate={speaking ? { scaleY: [base, 0.35 + ((i * 37) % 60) / 100, base * 0.8, 0.5 + ((i * 53) % 50) / 100, base] } : { scaleY: 0.12 }}
                                transition={speaking ? { duration: 0.6 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                            />
                        );
                    })}
                </div>
                {status !== "idle" && (
                    <button type="button" onClick={stop} aria-label="Stop" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                        <Square className="h-4 w-4" fill="currentColor" />
                    </button>
                )}
            </div>

            {/* Transcript with the spoken word highlighted. */}
            <p className="mt-5 text-[1rem] leading-relaxed" aria-live="off">
                {words.map((w, i) => {
                    const state = word === -1 ? "idle" : i < word ? "said" : i === word ? "now" : "next";
                    return (
                        <React.Fragment key={i}>
                            <span
                                className="-mx-[0.12em] rounded-md px-[0.12em] transition-[color,background-color,opacity] duration-150"
                                style={{
                                    background: state === "now" ? `${accentColor}` : "transparent",
                                    color: state === "now" ? "#0a0a0a" : undefined,
                                    opacity: state === "next" ? 0.4 : 1,
                                }}
                            >
                                {w.w}
                            </span>{" "}
                        </React.Fragment>
                    );
                })}
            </p>

            <div className={`mt-5 flex flex-wrap items-center gap-2 border-t pt-4 text-[0.75rem] ${dark ? "border-white/10" : "border-black/10"}`}>
                <Volume2 className={`h-4 w-4 ${muted}`} />
                <div className={`flex rounded-full p-0.5 ${dark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`} role="radiogroup" aria-label="Speed">
                    {SPEEDS.map((s) => (
                        <button key={s} type="button" role="radio" aria-checked={rate === s} onClick={() => setRate(s)} className={`rounded-full px-2.5 py-1 font-mono transition ${rate === s ? "text-black" : muted}`} style={rate === s ? { background: accentColor } : undefined}>
                            {s}×
                        </button>
                    ))}
                </div>
                {showVoicePicker && supported && voices.length > 1 && (
                    <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)} aria-label="Voice" className={`ml-auto max-w-[12rem] truncate rounded-full border px-3 py-1 outline-none ${dark ? "border-white/10 bg-neutral-900" : "border-black/10 bg-white"}`}>
                        {voices.map((v) => (
                            <option key={v.name} value={v.name}>
                                {v.name.replace(/Microsoft |Google /, "")}
                            </option>
                        ))}
                    </select>
                )}
                {!supported && <span className={`ml-auto ${muted}`}>Speech isn&apos;t available here — playing silently.</span>}
            </div>
        </div>
    );
};

export default AiSpeak;
