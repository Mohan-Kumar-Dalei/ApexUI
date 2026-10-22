import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Brain, Check, ChevronDown, Eye, SlidersHorizontal, Sparkles, Zap } from "lucide-react";

/*
 * AI Model Prompt: a prompt composer with a model picker and per-model
 * settings. Each model declares which settings it supports (temperature,
 * max tokens, reasoning effort); the settings panel only shows those and
 * remembers a configuration per model. Works controlled or on its own.
 */

const DEFAULT_MODELS = [
    { value: "apex-pro", label: "Apex Pro", provider: "Apex", description: "Best quality for hard problems.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "apex-flash", label: "Apex Flash", provider: "Apex", description: "Fast and cheap for everyday tasks.", tags: ["fast"], settings: { temperature: true, maxTokens: true } },
    { value: "claude-sonnet", label: "Claude Sonnet", provider: "Anthropic", description: "Great at writing and code.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "gpt-mini", label: "GPT Mini", provider: "OpenAI", description: "Small, quick and capable.", tags: ["fast", "vision"], settings: { temperature: true, maxTokens: true } },
];

const TAG_ICON = { reasoning: Brain, vision: Eye, fast: Zap };
const TOKEN_OPTIONS = [1024, 4096, 8192, 32000];
const defaultsFor = (model) => ({
    ...(model?.settings?.temperature ? { temperature: 0.7 } : {}),
    ...(model?.settings?.maxTokens ? { maxTokens: 4096 } : {}),
    ...(model?.settings?.reasoning ? { reasoning: model.settings.reasoning[1] ?? model.settings.reasoning[0] } : {}),
});

// Close a popover on outside click or Escape.
function useDismiss(open, setMenu, ref) {
    useEffect(() => {
        if (!open) return undefined;
        const down = (e) => !ref.current?.contains(e.target) && setMenu(null);
        const key = (e) => e.key === "Escape" && setMenu(null);
        document.addEventListener("pointerdown", down);
        document.addEventListener("keydown", key);
        return () => {
            document.removeEventListener("pointerdown", down);
            document.removeEventListener("keydown", key);
        };
    }, [open, setMenu, ref]);
}

const AiModelPrompt = ({
    models = DEFAULT_MODELS,
    value,
    onModelChange,
    configurations,
    onConfigurationChange,
    prompt,
    onPromptChange,
    onSubmit,
    placeholder = "Ask anything…",
    accentColor = "#a3e635",
    theme = "dark",
    className = "",
}) => {
    const id = useId();
    const [innerValue, setInnerValue] = useState(models[0]?.value);
    const [innerConfigs, setInnerConfigs] = useState({});
    const [innerPrompt, setInnerPrompt] = useState("");
    const [menu, setMenu] = useState(null); // "models" | "settings" | null
    const [sent, setSent] = useState(false);
    const modelRef = useRef(null);
    const settingsRef = useRef(null);
    const dark = theme !== "light";

    const current = models.find((m) => m.value === (value ?? innerValue)) ?? models[0];
    const configs = configurations ?? innerConfigs;
    const config = { ...defaultsFor(current), ...configs[current.value] };
    const text = prompt ?? innerPrompt;

    useDismiss(menu === "models", setMenu, modelRef);
    useDismiss(menu === "settings", setMenu, settingsRef);

    const pickModel = (m) => {
        if (value === undefined) setInnerValue(m.value);
        onModelChange?.(m);
        setMenu(null);
    };
    const setConfig = (key, v) => {
        const nextConfig = { ...config, [key]: v };
        const next = { ...configs, [current.value]: nextConfig };
        if (configurations === undefined) setInnerConfigs(next);
        onConfigurationChange?.(current, nextConfig, next);
    };
    const setText = (t) => {
        if (prompt === undefined) setInnerPrompt(t);
        onPromptChange?.(t);
    };
    const submit = () => {
        if (!text.trim()) return;
        onSubmit?.({ model: current, configuration: config, prompt: text.trim() });
        setText("");
        setSent(true);
        setTimeout(() => setSent(false), 1200);
    };

    const panel = dark ? "border-white/10 bg-neutral-900 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]" : "border-black/10 bg-white text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]";
    const chip = dark ? "bg-white/[0.06] hover:bg-white/10" : "bg-black/[0.04] hover:bg-black/[0.07]";
    const muted = dark ? "text-white/50" : "text-neutral-500";
    const groups = [...new Set(models.map((m) => m.provider))];
    const pop = { initial: { opacity: 0, y: 6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 6, scale: 0.98 }, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } };

    return (
        <div className={`w-full max-w-2xl rounded-[1.6rem] border p-3 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"} ${className}`}>
            <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
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
                {/* Model picker */}
                <div ref={modelRef} className="relative">
                    <button type="button" aria-haspopup="listbox" aria-expanded={menu === "models"} onClick={() => setMenu((m) => (m === "models" ? null : "models"))} className={`inline-flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-[0.82rem] font-medium transition ${chip}`}>
                        <span className="grid h-5 w-5 place-items-center rounded-full text-black" style={{ background: accentColor }}>
                            <Sparkles className="h-3 w-3" />
                        </span>
                        {current.label}
                        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${menu === "models" ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                        {menu === "models" && (
                            <motion.div {...pop} role="listbox" aria-label="Models" className={`absolute bottom-full left-0 z-30 mb-2 w-[min(19rem,80vw)] origin-bottom-left rounded-2xl border p-1.5 ${panel}`}>
                                {groups.map((g) => (
                                    <div key={g} className="py-1">
                                        <p className={`px-2.5 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${muted}`}>{g}</p>
                                        {models
                                            .filter((m) => m.provider === g)
                                            .map((m) => {
                                                const on = m.value === current.value;
                                                return (
                                                    <button key={m.value} type="button" role="option" aria-selected={on} onClick={() => pickModel(m)} className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${on ? (dark ? "bg-white/[0.07]" : "bg-black/[0.05]") : dark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.03]"}`}>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="flex items-center gap-1.5 text-[0.85rem] font-medium">
                                                                {m.label}
                                                                {m.tags?.map((t) => {
                                                                    const Icon = TAG_ICON[t];
                                                                    return Icon ? <Icon key={t} className={`h-3 w-3 ${muted}`} aria-label={t} /> : null;
                                                                })}
                                                            </span>
                                                            <span className={`block text-[0.74rem] ${muted}`}>{m.description}</span>
                                                        </span>
                                                        {on && <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accentColor }} />}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Per-model settings */}
                <div ref={settingsRef} className="relative">
                    <button type="button" aria-label="Model settings" aria-expanded={menu === "settings"} onClick={() => setMenu((m) => (m === "settings" ? null : "settings"))} className={`grid h-9 w-9 place-items-center rounded-full transition ${chip}`}>
                        <SlidersHorizontal className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                        {menu === "settings" && (
                            <motion.div {...pop} role="dialog" aria-label={`${current.label} settings`} className={`absolute bottom-full left-0 z-30 mb-2 w-[min(17rem,78vw)] origin-bottom-left space-y-4 rounded-2xl border p-4 ${panel}`}>
                                <p className="text-[0.8rem] font-semibold">{current.label} settings</p>
                                {current.settings?.temperature && (
                                    <label className="block">
                                        <span className="mb-1.5 flex justify-between text-[0.75rem]">
                                            <span className={muted}>Temperature</span>
                                            <span className="font-mono">{config.temperature.toFixed(1)}</span>
                                        </span>
                                        <input type="range" min={0} max={2} step={0.1} value={config.temperature} onChange={(e) => setConfig("temperature", Number(e.target.value))} className="w-full" style={{ accentColor }} />
                                    </label>
                                )}
                                {current.settings?.maxTokens && (
                                    <div>
                                        <p className={`mb-1.5 text-[0.75rem] ${muted}`}>Max tokens</p>
                                        <div className="grid grid-cols-4 gap-1">
                                            {TOKEN_OPTIONS.map((t) => (
                                                <button key={t} type="button" onClick={() => setConfig("maxTokens", t)} className={`rounded-lg py-1 font-mono text-[0.7rem] transition ${config.maxTokens === t ? "text-black" : chip}`} style={config.maxTokens === t ? { background: accentColor } : undefined}>
                                                    {t >= 1000 ? `${Math.round(t / 1000)}k` : t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {current.settings?.reasoning && (
                                    <div>
                                        <p className={`mb-1.5 text-[0.75rem] ${muted}`}>Reasoning effort</p>
                                        <div className={`relative grid rounded-lg p-0.5 ${dark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`} style={{ gridTemplateColumns: `repeat(${current.settings.reasoning.length}, 1fr)` }}>
                                            {current.settings.reasoning.map((r) => (
                                                <button key={r} type="button" onClick={() => setConfig("reasoning", r)} className={`relative rounded-md py-1 text-[0.72rem] font-medium capitalize ${config.reasoning === r ? "text-black" : ""}`}>
                                                    {config.reasoning === r && <motion.span layoutId={`${id}-effort`} className="absolute inset-0 rounded-md" style={{ background: accentColor }} transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                                                    <span className="relative">{r}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <span className={`ml-auto hidden text-[0.72rem] sm:inline ${muted}`}>
                    {config.reasoning ? `${config.reasoning} effort · ` : ""}
                    {config.maxTokens ? `${Math.round(config.maxTokens / 1000)}k tokens` : ""}
                </span>
                <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={submit} disabled={!text.trim()} aria-label="Send" className="ml-auto grid h-10 w-10 place-items-center rounded-full text-black transition disabled:opacity-35 sm:ml-0" style={{ background: accentColor }}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={sent ? "ok" : "go"} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.14 }}>
                            {sent ? <Check className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
};

export default AiModelPrompt;
