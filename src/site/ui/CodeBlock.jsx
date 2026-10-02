import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);

const codeTheme = {
    ...oneDark,
    'pre[class*="language-"]': { ...oneDark['pre[class*="language-"]'], background: 'transparent', margin: 0, padding: 0 },
    'code[class*="language-"]': { ...oneDark['code[class*="language-"]'], background: 'transparent' },
};

export function CopyButton({ text, className = '' }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100 ${className}`}
        >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--lime)]" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    );
}

/*
 * Dark code panel used across the docs (dark in both themes, like most
 * product docs). `title` renders a filename bar above the code.
 */
export default function CodeBlock({ code, language = 'jsx', title, className = '' }) {
    const text = code.trim();
    return (
        <div className={`group relative overflow-hidden rounded-xl border border-[var(--code-line)] bg-[var(--code-bg)] ${className}`}>
            {title ? (
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
                    <span className="font-mono text-xs text-zinc-400">{title}</span>
                    <CopyButton text={text} />
                </div>
            ) : (
                <CopyButton text={text} className="absolute right-2.5 top-2.5 z-10 opacity-70 group-hover:opacity-100" />
            )}
            <div className="thin-scroll overflow-x-auto px-4 py-3.5 pr-12 text-[0.8rem] leading-6">
                <SyntaxHighlighter
                    language={language === 'text' ? 'bash' : language}
                    style={codeTheme}
                    customStyle={{ background: 'transparent', margin: 0, padding: 0, fontSize: 'inherit', lineHeight: 'inherit' }}
                    codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
                >
                    {text}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

/* One-line terminal command with a `$` prompt and copy button. */
export function CommandLine({ command, className = '' }) {
    return (
        <div className={`flex items-center gap-3 rounded-xl border border-[var(--code-line)] bg-[var(--code-bg)] py-2.5 pl-4 pr-2 font-mono text-[0.8rem] text-zinc-200 ${className}`}>
            <span className="select-none text-zinc-500">$</span>
            <span className="thin-scroll flex-1 overflow-x-auto whitespace-nowrap">{command}</span>
            <CopyButton text={command} />
        </div>
    );
}
