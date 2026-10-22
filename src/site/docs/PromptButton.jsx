import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

/* A ready-to-paste prompt that lets any AI assistant rebuild the component. */
function buildPrompt({ title, description, variant }) {
    const name = variant.name && variant.name !== title ? `${title} (${variant.name})` : title;
    const deps = (variant.dependencies ?? []).map((d) => d.name).join(', ') || 'React and Tailwind CSS';
    const props = (variant.props ?? []).map((p) => `  - ${p.prop} (${p.type}, default ${p.def}): ${p.desc}`).join('\n');
    const about = [description, variant.name && variant.description ? `This version: ${variant.description}` : variant.description].filter((t, i, a) => t && a.indexOf(t) === i).join('\n');
    return [
        `Build a React component called "${name}" for a React + Tailwind CSS project.`,
        '',
        'What it should do:',
        about,
        '',
        'Requirements:',
        `- Use React function components, Tailwind CSS utility classes and: ${deps}.`,
        '- Put everything in one file with a default export.',
        '- Make it responsive from 320px phones to wide desktop screens, with sizes in rem where possible.',
        '- Make it accessible: keyboard support, visible focus, sensible ARIA labels.',
        '- Respect prefers-reduced-motion and keep animations smooth (transform / opacity, GPU friendly).',
        '- Support light and dark pages.',
        props ? `- Props (with defaults):\n${props}` : '',
        '',
        variant.code ? `Example usage:\n\`\`\`jsx\n${variant.code}\n\`\`\`` : '',
        '',
        'Return the complete, working component code and a short note on how to use it.',
    ]
        .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
        .join('\n')
        .trim();
}

/*
 * "Prompt" button for the preview toolbar: copies an AI prompt that rebuilds
 * the component, with shortcuts to open it straight in ChatGPT or Claude.
 */
export default function PromptButton({ title, description, variant }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const rootRef = useRef(null);
    const prompt = buildPrompt({ title, description, variant });

    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
        const esc = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('pointerdown', close);
        document.addEventListener('keydown', esc);
        return () => {
            document.removeEventListener('pointerdown', close);
            document.removeEventListener('keydown', esc);
        };
    }, [open]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked */
        }
    };

    const links = [
        { label: 'Open in ChatGPT', href: `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` },
        { label: 'Open in Claude', href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
    ];

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                title="Copy an AI prompt for this component"
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.78rem] font-medium transition-colors ${open ? 'border-[var(--lime-line)] bg-[var(--lime-soft)] text-[var(--ink)]' : 'border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]'}`}
            >
                <Sparkles className="h-3.5 w-3.5 text-[var(--lime-text)]" />
                <span className="hidden sm:inline">Prompt</span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label="AI prompt"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[var(--shadow)]"
                    >
                        <p className="px-1 text-[0.82rem] font-semibold text-[var(--ink)]">Build it with AI</p>
                        <p className="mt-0.5 px-1 text-[0.75rem] text-[var(--ink-3)]">Paste this prompt into any AI assistant to generate the whole component.</p>
                        <pre className="mt-2.5 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-[var(--panel-2)] p-3 font-mono text-[0.7rem] leading-relaxed text-[var(--ink-2)]">{prompt}</pre>
                        <button
                            type="button"
                            onClick={copy}
                            className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--lime)] text-[0.82rem] font-semibold text-[var(--lime-ink)] transition hover:brightness-105 active:scale-[0.98]"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied' : 'Copy prompt'}
                        </button>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {links.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-xl border border-[var(--line)] text-[0.75rem] font-medium text-[var(--ink-2)] transition hover:border-[var(--lime-line)] hover:text-[var(--ink)]"
                                >
                                    {l.label} <ExternalLink className="h-3 w-3" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
