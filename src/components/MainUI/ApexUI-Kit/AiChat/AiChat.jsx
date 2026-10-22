import React, { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, Sparkles } from "lucide-react";

/*
 * AI Chat: a compact chat window. Replies stream in word by word behind a
 * typing indicator, suggestions fill the input, and the list keeps itself
 * scrolled. Pass `onSend(text)` returning a string or a Promise of one to
 * hook up your own model; without it the demo answers on its own.
 */

const DEMO_REPLIES = [
    "Sure! Wrap your section in a container with `grid` and `gap-6`, then let the cards span two columns on large screens. Want me to write the code?",
    "Great question. Animate only `transform` and `opacity`, they run on the GPU and never trigger layout, so the motion stays at 60fps.",
    "Here's a quick idea: use a spring with stiffness 380 and damping 30. It feels snappy without bouncing too much.",
];

// One message row. Memoised so streaming only re-renders the last message.
const Message = memo(function Message({ role, text, streaming, accentColor, bubbleAi }) {
    const user = role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-end gap-2 ${user ? "justify-end" : "justify-start"}`}
        >
            {!user && (
                <span className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-black" style={{ background: accentColor }}>
                    <Bot className="h-3.5 w-3.5" />
                </span>
            )}
            <p
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[0.88rem] leading-relaxed ${user ? "rounded-br-md text-black" : `rounded-bl-md ${bubbleAi}`}`}
                style={user ? { background: accentColor } : undefined}
            >
                {text}
                {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm align-[-2px]" style={{ background: accentColor }} />}
            </p>
        </motion.div>
    );
});

const AiChat = ({
    title = "Apex Assistant",
    greeting = "Hi! I can help you design, build and animate your UI. What are we making today?",
    suggestions = ["Make a bento grid", "Smooth animations?", "Best spring settings"],
    onSend,
    accentColor = "#a3e635",
    theme = "dark",
    height = "30rem",
    className = "",
}) => {
    const [messages, setMessages] = useState([{ role: "assistant", text: greeting }]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const listRef = useRef(null);
    const demoIndex = useRef(0);
    const dark = theme !== "light";

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, busy]);

    // Reveal a reply a few words at a time.
    const stream = (full) =>
        new Promise((resolve) => {
            const words = full.split(" ");
            let i = 0;
            // Two words per tick reads naturally and halves the re-renders.
            setMessages((m) => [...m, { role: "assistant", text: "", streaming: true }]);
            const id = setInterval(() => {
                i = Math.min(words.length, i + 2);
                setMessages((m) => {
                    const copy = [...m];
                    copy[copy.length - 1] = { role: "assistant", text: words.slice(0, i).join(" "), streaming: i < words.length };
                    return copy;
                });
                if (i >= words.length) {
                    clearInterval(id);
                    resolve();
                }
            }, 55);
        });

    const send = async (text) => {
        const clean = text.trim();
        if (!clean || busy) return;
        setInput("");
        setMessages((m) => [...m, { role: "user", text: clean }]);
        setBusy(true);
        try {
            const reply = onSend ? await onSend(clean) : await new Promise((r) => setTimeout(() => r(DEMO_REPLIES[demoIndex.current++ % DEMO_REPLIES.length]), 900));
            await stream(String(reply ?? ""));
        } catch {
            await stream("Sorry, something went wrong. Please try again.");
        }
        setBusy(false);
    };

    const panel = dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900";
    const bubbleAi = dark ? "bg-white/[0.06]" : "bg-black/[0.04]";
    const muted = dark ? "text-white/50" : "text-neutral-500";

    return (
        <div className={`flex w-full max-w-md flex-col overflow-hidden rounded-3xl border shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] ${panel} ${className}`} style={{ height }}>
            <header className={`flex items-center gap-3 border-b px-4 py-3 ${dark ? "border-white/10" : "border-black/10"}`}>
                <span className="relative grid h-9 w-9 place-items-center rounded-xl text-black" style={{ background: accentColor }}>
                    <Bot className="h-5 w-5" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-current bg-emerald-400" style={{ borderColor: dark ? "#0a0a0a" : "#fff" }} />
                </span>
                <div>
                    <p className="text-[0.9rem] font-semibold">{title}</p>
                    <p className={`text-[0.72rem] ${muted}`}>{busy ? "Typing…" : "Online"}</p>
                </div>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.map((m, i) => (
                    <Message key={i} role={m.role} text={m.text} streaming={m.streaming} accentColor={accentColor} bubbleAi={bubbleAi} />
                ))}
                <AnimatePresence>
                    {busy && messages[messages.length - 1]?.role === "user" && (
                        <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2" aria-label="Assistant is typing">
                            <span className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-black" style={{ background: accentColor }}>
                                <Bot className="h-3.5 w-3.5" />
                            </span>
                            <span className={`inline-flex h-9 items-center gap-1 rounded-2xl rounded-bl-md px-3.5 ${bubbleAi}`}>
                                {[0, 1, 2].map((d) => (
                                    <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-current" animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                                ))}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {messages.length <= 1 && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                    {suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => send(s)} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[0.75rem] transition ${dark ? "border-white/10 hover:border-white/25 hover:bg-white/[0.05]" : "border-black/10 hover:border-black/20 hover:bg-black/[0.03]"}`}>
                            <Sparkles className="h-3 w-3" style={{ color: accentColor }} />
                            {s}
                        </button>
                    ))}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
                className={`flex items-center gap-2 border-t p-3 ${dark ? "border-white/10" : "border-black/10"}`}
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything…"
                    aria-label="Message"
                    className={`h-11 flex-1 rounded-2xl px-4 text-[0.9rem] outline-none transition focus:ring-2 ${dark ? "bg-white/[0.06] placeholder:text-white/35 focus:ring-white/15" : "bg-black/[0.04] placeholder:text-neutral-400 focus:ring-black/10"}`}
                />
                <motion.button whileTap={{ scale: 0.9 }} type="submit" aria-label="Send" disabled={!input.trim() || busy} className="grid h-11 w-11 place-items-center rounded-2xl text-black transition disabled:opacity-40" style={{ background: accentColor }}>
                    <ArrowUp className="h-5 w-5" />
                </motion.button>
            </form>
        </div>
    );
};

export default AiChat;
