import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Check, Copy, Globe, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

/*
 * AI Response: an assistant answer that streams in, with paragraphs, a code
 * block (with its own copy button), source chips and an action bar — copy,
 * regenerate, thumbs up / down. Blocks are plain objects, so it is easy to
 * feed from your own model.
 */

const DEFAULT_BLOCKS = [
    { type: "text", text: "To make a card lift smoothly on hover, animate only transform and box-shadow. Here's a tiny Tailwind version:" },
    { type: "code", lang: "jsx", text: '<div className="transition duration-300 hover:-translate-y-1 hover:shadow-xl">\n  Card\n</div>' },
    { type: "text", text: "Transforms run on the GPU, so the motion stays smooth even on low-end phones." },
];
const DEFAULT_SOURCES = [
    { title: "MDN: CSS transitions", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions" },
    { title: "web.dev: Animations", href: "https://web.dev/articles/animations-guide" },
];

function CodeBlock({ lang, text, dark }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className={`overflow-hidden rounded-xl border ${dark ? "border-white/10 bg-black/40" : "border-black/10 bg-neutral-50"}`}>
            <div className={`flex items-center justify-between px-3 py-1.5 text-[0.7rem] ${dark ? "bg-white/[0.04] text-white/50" : "bg-black/[0.03] text-neutral-500"}`}>
                <span className="font-mono">{lang}</span>
                <button
                    type="button"
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(text);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1400);
                        } catch {
                            /* clipboard blocked */
                        }
                    }}
                    className="inline-flex items-center gap-1 hover:opacity-100"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[0.78rem] leading-relaxed">{text}</pre>
        </div>
    );
}

const AiResponse = ({ blocks = DEFAULT_BLOCKS, sources = DEFAULT_SOURCES, speed = 18, assistant = "Apex AI", accentColor = "#a3e635", theme = "dark", onRegenerate, onFeedback, className = "" }) => {
    const [run, setRun] = useState(0);
    const [chars, setChars] = useState(0);
    const [vote, setVote] = useState(null);
    const [copied, setCopied] = useState(false);
    const total = blocks.reduce((n, b) => n + b.text.length, 0);
    const done = chars >= total;
    const dark = theme !== "light";

    useEffect(() => {
        setChars(0);
        const id = setInterval(() => setChars((c) => (c >= total ? (clearInterval(id), c) : c + 3)), speed);
        return () => clearInterval(id);
    }, [run, total, speed]);

    // Cut the blocks at the current character count.
    let left = chars;
    const visible = [];
    for (const b of blocks) {
        if (left <= 0) break;
        visible.push({ ...b, text: b.text.slice(0, left), partial: left < b.text.length });
        left -= b.text.length;
    }

    const copyAll = async () => {
        try {
            await navigator.clipboard.writeText(blocks.map((b) => b.text).join("\n\n"));
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            /* clipboard blocked */
        }
    };

    const muted = dark ? "text-white/55" : "text-neutral-500";
    const iconBtn = `grid h-8 w-8 place-items-center rounded-lg transition ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`;

    return (
        <div className={`w-full max-w-xl rounded-3xl border p-5 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"} ${className}`}>
            <div className="mb-3 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl text-black" style={{ background: accentColor }}>
                    <Bot className="h-4 w-4" />
                </span>
                <span className="text-[0.88rem] font-semibold">{assistant}</span>
                {!done && <span className={`text-[0.72rem] ${muted}`}>writing…</span>}
            </div>

            <div className="space-y-3 text-[0.92rem] leading-relaxed" aria-live="polite">
                {visible.map((b, i) =>
                    b.type === "code" ? (
                        <CodeBlock key={i} lang={b.lang} text={b.text} dark={dark} />
                    ) : (
                        <p key={i} className={dark ? "text-white/85" : "text-neutral-700"}>
                            {b.text}
                            {b.partial && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm align-middle" style={{ background: accentColor }} />}
                        </p>
                    )
                )}
            </div>

            <AnimatePresence>
                {done && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {sources.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {sources.map((s, i) => (
                                    <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] transition ${dark ? "border-white/10 hover:border-white/25" : "border-black/10 hover:border-black/20"}`}>
                                        <span className="grid h-4 w-4 place-items-center rounded-full text-[0.6rem] font-bold text-black" style={{ background: accentColor }}>
                                            {i + 1}
                                        </span>
                                        <Globe className="h-3 w-3 opacity-60" />
                                        {s.title}
                                    </a>
                                ))}
                            </div>
                        )}
                        <div className={`mt-4 flex items-center gap-1 border-t pt-3 ${dark ? "border-white/10" : "border-black/10"}`}>
                            <button type="button" aria-label="Copy answer" onClick={copyAll} className={iconBtn}>
                                {copied ? <Check className="h-4 w-4" style={{ color: accentColor }} /> : <Copy className="h-4 w-4" />}
                            </button>
                            <button
                                type="button"
                                aria-label="Regenerate"
                                onClick={() => {
                                    setVote(null);
                                    setRun((r) => r + 1);
                                    onRegenerate?.();
                                }}
                                className={iconBtn}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                            <span className={`mx-1 h-4 w-px ${dark ? "bg-white/10" : "bg-black/10"}`} />
                            {[
                                ["up", ThumbsUp, "Good answer"],
                                ["down", ThumbsDown, "Bad answer"],
                            ].map(([key, Icon, label]) => (
                                <motion.button
                                    key={key}
                                    type="button"
                                    aria-label={label}
                                    aria-pressed={vote === key}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => {
                                        const v = vote === key ? null : key;
                                        setVote(v);
                                        onFeedback?.(v);
                                    }}
                                    className={iconBtn}
                                    style={vote === key ? { color: accentColor } : undefined}
                                >
                                    <Icon className="h-4 w-4" fill={vote === key ? "currentColor" : "none"} />
                                </motion.button>
                            ))}
                            <span className={`ml-auto text-[0.7rem] ${muted}`}>{vote === "up" ? "Thanks for the feedback!" : vote === "down" ? "We'll do better." : ""}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AiResponse;
