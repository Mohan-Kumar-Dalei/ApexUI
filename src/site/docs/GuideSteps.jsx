import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import { slugify } from './toc.js';

/* Numbered steps for the installation guides: a large index beside each step. */
export default function GuideSteps({ steps }) {
    return (
        <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {steps.map((step, i) => (
                <li key={step.title} id={slugify(step.title)} className="grid scroll-mt-24 gap-5 py-9 md:grid-cols-[5rem_minmax(0,1fr)]">
                    <span className="font-display text-[3rem] font-semibold leading-none text-[var(--panel-3)]">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                        <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{step.title}</h2>
                        <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--ink-2)]">{step.description}</p>
                        <div className="mt-5">
                            {step.lang === 'bash' && !step.code.includes('\n') ? (
                                <CommandLine command={step.code} />
                            ) : (
                                <CodeBlock code={step.code} language={step.lang} title={step.file} />
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    );
}

export function Callout({ children }) {
    return (
        <div className="ticks rounded-none border border-[var(--line)] bg-[var(--lime-soft)] px-5 py-4 text-[0.98rem] leading-relaxed text-[var(--ink-2)]">
            {children}
        </div>
    );
}
