import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Eye, Package, RotateCcw } from 'lucide-react';
import DocShell, { DocSection } from './DocShell.jsx';
import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import { slugify as slug } from './toc.js';


/* Preview / Code tabs around a live demo. */
export function PreviewTabs({ preview, controls, code, codeLanguage = 'jsx', previewClassName = '', fullBleed = false }) {
    const [tab, setTab] = useState('preview');
    const [replayKey, setReplayKey] = useState(0);
    const pillId = useId();

    const tabBtn = (id, label, Icon) => (
        <button
            type="button"
            onClick={() => setTab(id)}
            className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === id ? 'text-[var(--fg)]' : 'text-[var(--fg-subtle)] hover:text-[var(--fg-muted)]'}`}
        >
            {tab === id && (
                <motion.span layoutId={pillId} className="absolute inset-0 rounded-md bg-[var(--surface-2)] ring-1 ring-[var(--border)]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
            )}
            <Icon className="relative h-3.5 w-3.5" />
            <span className="relative">{label}</span>
        </button>
    );

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <div className="inline-flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
                    {tabBtn('preview', 'Preview', Eye)}
                    {tabBtn('code', 'Code', Code2)}
                </div>
                {tab === 'preview' && (
                    <button
                        type="button"
                        onClick={() => setReplayKey((k) => k + 1)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs text-[var(--fg-subtle)] transition hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                        aria-label="Replay preview"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Replay
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {tab === 'preview' ? (
                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <div
                            key={replayKey}
                            className={`bg-dots relative flex min-h-[460px] [transform:translateZ(0)] w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--preview-bg)] text-white ${fullBleed ? '' : 'p-6 sm:p-10'} ${previewClassName}`}
                        >
                            {preview}
                        </div>
                        {controls && (
                            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--fg-muted)] sm:p-5">
                                {controls}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <CodeBlock code={code} language={codeLanguage} className="max-h-[560px] overflow-y-auto" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function InstallSteps({ cli }) {
    const steps = [
        { title: 'Install the package', command: 'npm i apex-ui-kit' },
        { title: 'Add the component to your project', command: `npx apex-ui-kit add ${cli}` },
    ];
    return (
        <ol className="space-y-5">
            {steps.map((step, i) => (
                <li key={step.command} className="relative pl-10">
                    <span className="absolute left-0 top-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] font-mono text-xs text-[var(--fg-muted)]">
                        {i + 1}
                    </span>
                    {i < steps.length - 1 && <span className="absolute bottom-[-14px] left-3 top-8 w-px bg-[var(--border)]" />}
                    <p className="mb-2 text-sm font-medium text-[var(--fg)]">{step.title}</p>
                    <CommandLine command={step.command} />
                </li>
            ))}
        </ol>
    );
}

export function PropsTable({ rows }) {
    if (!rows?.length) return <p className="text-sm text-[var(--fg-subtle)]">This component takes no props.</p>;
    return (
        <div className="thin-scroll overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-[var(--surface)] text-xs text-[var(--fg-subtle)]">
                    <tr>
                        <th className="px-4 py-2.5 font-medium">Prop</th>
                        <th className="px-4 py-2.5 font-medium">Type</th>
                        <th className="px-4 py-2.5 font-medium">Default</th>
                        <th className="px-4 py-2.5 font-medium">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {rows.map((row) => (
                        <tr key={row.prop} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3">
                                <code className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[12.5px] text-[var(--accent-text)]">{row.prop}</code>
                            </td>
                            <td className="px-4 py-3 font-mono text-[12.5px] text-[var(--syntax-type)]">{row.type}</td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-[var(--fg-muted)]">{row.def ?? '—'}</td>
                            <td className="px-4 py-3 leading-6 text-[var(--fg-muted)]">{row.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function DependencyList({ items }) {
    if (!items?.length) return null;
    return (
        <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((dep) => (
                <li key={dep.name} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-[var(--fg-muted)]">
                        <Package className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--fg)]">{dep.name}</p>
                        <p className="text-[13px] leading-5 text-[var(--fg-muted)]">{dep.desc}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function VariantBody({ variant, prefix = '', nested = false }) {
    const level = nested ? 3 : 2;
    return (
        <>
            <DocSection id={`${prefix}preview`} level={level}>
                <PreviewTabs {...variant} />
            </DocSection>
            <DocSection id={`${prefix}installation`} level={level} title="Installation">
                <InstallSteps cli={variant.cli} />
            </DocSection>
            {variant.extra}
            <DocSection id={`${prefix}props`} level={level} title="Props">
                <PropsTable rows={variant.props} />
            </DocSection>
            {variant.dependencies?.length > 0 && (
                <DocSection id={`${prefix}dependencies`} level={level} title="Dependencies">
                    <DependencyList items={variant.dependencies} />
                </DocSection>
            )}
        </>
    );
}

/*
 * Standard component documentation page.
 *
 * Single component:
 *   <ComponentDoc title description preview code cli props dependencies
 *                 controls? previewClassName? fullBleed? extra? />
 *
 * Several related components on one page (e.g. Carousel variants):
 *   <ComponentDoc title description variants={[{ name, description, ...same fields }]} />
 */
export default function ComponentDoc({ title, description, variants, ...single }) {
    if (variants?.length) {
        const toc = variants.map((v) => ({ id: slug(v.name), label: v.name }));
        return (
            <DocShell title={title} description={description} toc={toc}>
                {variants.map((v) => {
                    const id = slug(v.name);
                    return (
                        <section key={id} id={id} className="scroll-mt-24 space-y-10 border-t border-[var(--border)] pt-10 first:border-t-0 first:pt-0">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">{v.name}</h2>
                                {v.description && <p className="mt-2 text-[15px] leading-7 text-[var(--fg-muted)]">{v.description}</p>}
                            </div>
                            <VariantBody variant={v} prefix={`${id}-`} nested />
                        </section>
                    );
                })}
            </DocShell>
        );
    }

    const toc = [
        { id: 'preview', label: 'Preview' },
        { id: 'installation', label: 'Installation' },
        ...(single.extraToc || []),
        { id: 'props', label: 'Props' },
        ...(single.dependencies?.length ? [{ id: 'dependencies', label: 'Dependencies' }] : []),
    ];
    return (
        <DocShell title={title} description={description} toc={toc}>
            <VariantBody variant={single} />
        </DocShell>
    );
}
