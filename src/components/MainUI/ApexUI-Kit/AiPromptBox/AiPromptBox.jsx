import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronDown, Paperclip, Square, Wand2, X } from "lucide-react";

/*
 * AI Prompt Box: the input of an AI app. The border lights up with a moving
 * gradient while focused and spins faster while generating; the textarea
 * grows with its text; you can pick a model, attach files and use quick
 * actions. The send button turns into a stop button while busy.
 */

const DEFAULT_MODELS = ["Apex 2 Pro", "Apex 2 Flash", "Apex Vision"];
const DEFAULT_ACTIONS = ["Summarize", "Write code", "Brainstorm", "Translate"];

const AiPromptBox = ({
    placeholder = "Describe what you want to build…",
    models = DEFAULT_MODELS,
    actions = DEFAULT_ACTIONS,
    onSubmit,
    maxLength = 2000,
    colors = ["#a3e635", "#22d3ee", "#a78bfa", "#f472b6"],
    theme = "dark",
    className = "",
}) => {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [busy, setBusy] = useState(false);
    const [model, setModel] = useState(models[0]);
    const [menu, setMenu] = useState(false);
    const [files, setFiles] = useState([]);
    const area = useRef(null);
    const fileInput = useRef(null);
    const timer = useRef(0);
    const dark = theme !== "light";

    // Grow with the text, up to about eight lines.
    useEffect(() => {
        const el = area.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);
    useEffect(() => () => clearTimeout(timer.current), []);

    const submit = async () => {
        if (busy) {
            clearTimeout(timer.current);
            setBusy(false);
            return;
        }
        if (!value.trim()) return;
        setBusy(true);
        const payload = { prompt: value.trim(), model, files };
        try {
            if (onSubmit) await onSubmit(payload);
            else await new Promise((r) => (timer.current = setTimeout(r, 2200)));
        } finally {
            setBusy(false);
            setValue("");
            setFiles([]);
        }
    };

    const glow = `conic-gradient(from var(--apex-angle), ${colors.join(", ")}, ${colors[0]})`;

    return (
        <div className={`w-full max-w-2xl ${className}`}>
            <style>{"@property --apex-angle{syntax:'<angle>';initial-value:0deg;inherits:false}@keyframes apex-spin{to{--apex-angle:360deg}}"}</style>
            <div
                className="relative rounded-[1.6rem] p-[1.5px] transition-shadow duration-500"
                style={{
                    background: focused || busy ? glow : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    animation: focused || busy ? `apex-spin ${busy ? 1.2 : 4}s linear infinite` : "none",
                    boxShadow: focused || busy ? `0 0 40px -10px ${colors[0]}88` : "none",
                }}
            >
                <div className={`rounded-[1.55rem] p-3 ${dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}>
                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 overflow-hidden px-1 pb-2">
                                {files.map((f) => (
                                    <span key={f} className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.75rem] ${dark ? "bg-white/[0.07]" : "bg-black/[0.05]"}`}>
                                        <Paperclip className="h-3 w-3" /> {f}
                                        <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((l) => l.filter((x) => x !== f))} className="opacity-60 hover:opacity-100">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <textarea
                        ref={area}
                        rows={2}
                        value={value}
                        maxLength={maxLength}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                submit();
                            }
                        }}
                        placeholder={placeholder}
                        aria-label="Prompt"
                        className={`block w-full resize-none bg-transparent px-2 py-1.5 text-[0.95rem] leading-relaxed outline-none ${dark ? "placeholder:text-white/35" : "placeholder:text-neutral-400"}`}
                    />
                    <div className="mt-2 flex items-center gap-2">
                        <input ref={fileInput} type="file" multiple hidden onChange={(e) => setFiles((l) => [...new Set([...l, ...[...e.target.files].map((f) => f.name)])])} />
                        <button type="button" aria-label="Attach files" onClick={() => fileInput.current?.click()} className={`grid h-9 w-9 place-items-center rounded-full transition ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <Paperclip className="h-4 w-4" />
                        </button>
                        <div className="relative">
                            <button type="button" aria-haspopup="listbox" aria-expanded={menu} onClick={() => setMenu((m) => !m)} className={`inline-flex h-9 items-center gap-1 rounded-full px-3 text-[0.8rem] font-medium transition ${dark ? "bg-white/[0.06] hover:bg-white/10" : "bg-black/[0.04] hover:bg-black/[0.07]"}`}>
                                {model}
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menu ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {menu && (
                                    <motion.ul
                                        role="listbox"
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        className={`absolute bottom-full left-0 z-20 mb-2 min-w-[10rem] rounded-xl border p-1 shadow-xl ${dark ? "border-white/10 bg-neutral-900" : "border-black/10 bg-white"}`}
                                    >
                                        {models.map((m) => (
                                            <li key={m}>
                                                <button type="button" role="option" aria-selected={m === model} onClick={() => { setModel(m); setMenu(false); }} className={`w-full rounded-lg px-3 py-1.5 text-left text-[0.8rem] ${m === model ? (dark ? "bg-white/10" : "bg-black/5") : dark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.04]"}`}>
                                                    {m}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                        <span className={`ml-auto font-mono text-[0.7rem] tabular-nums ${dark ? "text-white/35" : "text-neutral-400"}`}>
                            {value.length}/{maxLength}
                        </span>
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={submit}
                            aria-label={busy ? "Stop generating" : "Send"}
                            disabled={!busy && !value.trim()}
                            className="grid h-10 w-10 place-items-center rounded-full text-black transition disabled:opacity-35"
                            style={{ background: busy ? (dark ? "#fff" : "#111") : colors[0], color: busy ? (dark ? "#111" : "#fff") : "#000" }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span key={busy ? "stop" : "send"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                                    {busy ? <Square className="h-3.5 w-3.5" fill="currentColor" /> : <ArrowUp className="h-5 w-5" />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
                {actions.map((a) => (
                    <button key={a} type="button" onClick={() => { setValue((v) => (v ? `${a}: ${v}` : `${a}: `)); area.current?.focus(); }} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.78rem] transition ${dark ? "border-white/10 text-white/70 hover:border-white/25 hover:text-white" : "border-black/10 text-neutral-600 hover:border-black/20 hover:text-neutral-900"}`}>
                        <Wand2 className="h-3 w-3" style={{ color: colors[0] }} />
                        {a}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AiPromptBox;
