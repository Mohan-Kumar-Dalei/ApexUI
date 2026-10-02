import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import { slugify } from './toc.js';

/* Numbered, connected steps used by the installation guides. */
export default function GuideSteps({ steps }) {
    return (
        <ol className="relative">
            {steps.map((step, i) => (
                <li key={step.title} id={slugify(step.title)} className="relative scroll-mt-24 pb-12 pl-12 last:pb-0">
                    {i < steps.length - 1 && <span className="absolute bottom-0 left-[15px] top-9 w-px bg-[var(--border)]" aria-hidden="true" />}
                    <span className="absolute left-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] font-mono text-sm text-[var(--fg)]">
                        {i + 1}
                    </span>
                    <h2 className="pt-0.5 text-lg font-semibold tracking-tight text-[var(--fg)]">{step.title}</h2>
                    <p className="mt-1.5 text-[15px] leading-7 text-[var(--fg-muted)]">{step.description}</p>
                    <div className="mt-4">
                        {step.lang === 'bash' && !step.code.includes('\n') ? (
                            <CommandLine command={step.code} />
                        ) : (
                            <CodeBlock code={step.code} language={step.lang} title={step.file} />
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

export function Callout({ children, tone = 'success' }) {
    const tones = {
        success: 'border-[var(--accent)]/30 bg-[var(--accent-soft)]',
        info: 'border-[var(--border)] bg-[var(--surface)]',
    };
    return <div className={`rounded-xl border px-4 py-3 text-[15px] leading-7 text-[var(--fg-muted)] ${tones[tone]}`}>{children}</div>;
}
