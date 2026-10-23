import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Code2, Eye, Grid3x3, Maximize2, Minimize2, Monitor, Package, RotateCcw, Smartphone, Square, Sparkle, Tablet } from 'lucide-react';
import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import { findPage } from '../config/navigation.js';
import { CliChip, DocFooter, PageHeader, Pager } from './parts.jsx';
import { DOC_PAD } from './style.js';
import TableOfContents from './TableOfContents.jsx';
import NewBadge from '../ui/NewBadge.jsx';
import PromptButton from './PromptButton.jsx';

const STAGE_BG = [
    { id: 'dots', icon: Sparkle, label: 'Dots', className: 'stage-dots' },
    { id: 'grid', icon: Grid3x3, label: 'Grid', className: 'stage-grid' },
    { id: 'plain', icon: Square, label: 'Plain', className: '' },
];

const STAGE_H = 'min-h-[clamp(26rem,64vh,60rem)]';

// Responsive check: tablet / mobile narrow the live preview to that width (no iframe,
// so nothing reloads). The box is a CSS container, so @container styles respond.
const DEVICES = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: 768 },
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: 375 },
];

function Segmented({ value, onChange, options, size = 'md' }) {
    const id = useId();
    return (
        <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-[var(--line)] bg-[var(--panel)] p-0.5 thin-scroll">
            {options.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        onClick={() => onChange(o.value)}
                        aria-pressed={active}
                        aria-label={o.title}
                        title={o.title}
                        className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium transition-colors ${size === 'sm' ? 'h-7 px-2.5 text-[0.72rem]' : 'h-8 px-3.5 text-[0.8rem]'} ${active ? 'text-[var(--lime-ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                    >
                        {active && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-[var(--lime)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                        {o.icon && <o.icon className="relative h-3.5 w-3.5" />}
                        {/* Icon + label pairs show just the icon on phones so the toolbar fits. */}
                        {o.label && <span className={`relative whitespace-nowrap ${o.icon ? 'hidden sm:inline' : ''}`}>{o.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}

const toolBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)]';

/* The live preview: a dark canvas with view / background / replay / fullscreen controls. */
function Stage({ title, description, variant, variants, activeVariant, onVariant }) {
    const [view, setView] = useState('preview');
    const [bg, setBg] = useState(variant.fullBleed ? 'plain' : 'dots');
    const [replayKey, setReplayKey] = useState(0);
    const [full, setFull] = useState(false);
    const [device, setDevice] = useState('desktop');
    const stageRef = useRef(null);
    // The preview shows at once when a page opens; it only fades on replay,
    // variant, view or device changes (a fade on every page switch read as a flicker).
    const firstPaint = useRef(true);
    useEffect(() => {
        firstPaint.current = false;
    }, []);

    useEffect(() => {
        const onChange = () => setFull(document.fullscreenElement === stageRef.current);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    // Full-bleed previews paint their own background, so the pattern starts off there.
    useEffect(() => {
        setView('preview');
        setBg(variant.fullBleed ? 'plain' : 'dots');
    }, [activeVariant, variant.fullBleed]);

    const toggleFull = () => {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else stageRef.current?.requestFullscreen?.();
    };

    const bgClass = STAGE_BG.find((b) => b.id === bg)?.className ?? '';
    const frame = !full && device !== 'desktop' ? DEVICES.find((d) => d.id === device) : null;

    return (
        <section ref={stageRef} aria-label="Live preview" className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-3 py-2 sm:px-4">
                {variants ? (
                    <Segmented value={activeVariant} onChange={onVariant} options={variants.map((v, i) => ({ value: i, label: v.name }))} />
                ) : (
                    <span className="inline-flex items-center gap-2 px-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lime)] opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--lime)]" />
                        </span>
                        Live
                    </span>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                    {view === 'preview' && (
                        <>
                            <div className="hidden md:block">
                                <Segmented size="sm" value={device} onChange={setDevice} options={DEVICES.map((d) => ({ value: d.id, icon: d.icon, title: `${d.label} view` }))} />
                            </div>
                            <div className="hidden min-[360px]:block">
                                <Segmented size="sm" value={bg} onChange={setBg} options={STAGE_BG.map((b) => ({ value: b.id, icon: b.icon, title: variant.fullBleed ? `${b.label} overlay` : `${b.label} background` }))} />
                            </div>
                            <button type="button" onClick={() => setReplayKey((k) => k + 1)} className={toolBtn} aria-label="Replay preview" title="Replay">
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={toggleFull} className={`${toolBtn} hidden sm:inline-flex`} aria-label={full ? 'Exit full screen' : 'Full screen'} title="Full screen">
                                {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                            </button>
                        </>
                    )}
                    <PromptButton title={title} description={description} variant={variant} />
                    <Segmented
                        value={view}
                        onChange={setView}
                        options={[
                            { value: 'preview', label: 'Preview', icon: Eye, title: 'Preview' },
                            { value: 'code', label: 'Code', icon: Code2, title: 'Code' },
                        ]}
                    />
                </div>
            </div>

            {/* No initial={false} here: it would block the first-mount animations of every
                motion component inside the preview (e.g. Orbs stayed still until "Replay"). */}
            <AnimatePresence mode="wait">
                {view === 'preview' ? (
                    <motion.div
                        key={`preview-${activeVariant}-${replayKey}-${frame ? 'frame' : 'desktop'}`}
                        initial={{ opacity: firstPaint.current ? 1 : 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`relative isolate flex flex-1 items-center justify-center overflow-hidden [transform:translateZ(0)] ${variant.fullBleed && !frame ? 'bg-[#09090b] text-white' : 'bg-[var(--stage)] text-[var(--stage-ink)]'} ${full ? 'h-screen' : frame ? `${STAGE_H} h-[clamp(26rem,64vh,60rem)]` : STAGE_H} ${variant.fullBleed || frame ? '' : 'p-[clamp(0.75rem,3vw,3.5rem)]'} ${frame ? '' : variant.previewClassName ?? ''}`}
                    >
                        {bgClass && <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${bgClass} ${variant.fullBleed ? 'stage-overlay z-20' : '-z-10'}`} />}
                        {frame ? (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-3 py-3">
                                <div
                                    className={`@container relative isolate flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[1.4rem] border-[6px] border-[var(--panel-3)] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)] transition-[max-width] duration-300 ease-out ${variant.fullBleed ? 'bg-[#09090b] text-white' : 'bg-[var(--stage)] p-4 text-[var(--stage-ink)]'} ${variant.previewClassName ?? ''}`}
                                    style={{ maxWidth: frame.width }}
                                >
                                    {variant.preview}
                                </div>
                                <span className="font-mono text-[0.68rem] text-[var(--ink-3)]">
                                    {frame.label} · {frame.width}px
                                </span>
                            </div>
                        ) : (
                            variant.preview
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className={`flex-1 bg-[var(--code-bg)] ${STAGE_H}`}>
                        <CodeBlock code={variant.code} language={variant.codeLanguage ?? 'jsx'} className="thin-scroll max-h-[clamp(26rem,64vh,60rem)] overflow-y-auto rounded-none border-0" />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// Long props tables start collapsed to this many rows, with a "See more" toggle.
const PROPS_PREVIEW = 5;

function PropsTable({ rows }) {
    const [expanded, setExpanded] = useState(false);
    if (!rows?.length) return <p className="text-sm text-[var(--ink-3)]">This component takes no props.</p>;
    const hidden = rows.length - PROPS_PREVIEW;
    const visible = expanded || hidden <= 0 ? rows : rows.slice(0, PROPS_PREVIEW);
    return (
        <div className="overflow-hidden rounded-xl border border-[var(--line)]">
            <div className="thin-scroll overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-[0.86rem]">
                    <thead className="bg-[var(--panel-2)] text-[0.78rem] text-[var(--ink-2)]">
                        <tr>
                            <th className="px-4 py-2.5 font-medium">Prop</th>
                            <th className="px-4 py-2.5 font-medium">Type</th>
                            <th className="px-4 py-2.5 font-medium">Default</th>
                            <th className="px-4 py-2.5 font-medium">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {visible.map((row) => (
                            <tr key={row.prop} className="align-top">
                                <td className="px-4 py-3">
                                    <code className="whitespace-nowrap rounded-md bg-[var(--lime-soft)] px-1.5 py-0.5 text-[0.8rem] font-medium text-[var(--lime-text)]">{row.prop}</code>
                                </td>
                                <td className="px-4 py-3"><code className="text-[0.78rem] text-[var(--syntax-type)]">{row.type}</code></td>
                                <td className="px-4 py-3"><code className="text-[0.78rem] text-[var(--ink-3)]">{row.def != null && row.def !== '' ? row.def : 'none'}</code></td>
                                <td className="px-4 py-3 leading-relaxed text-[var(--ink-2)]">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {hidden > 0 && (
                <button
                    type="button"
                    onClick={() => setExpanded((open) => !open)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-center gap-1.5 border-t border-[var(--line)] bg-[var(--panel-2)] py-2.5 text-[0.8rem] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                >
                    {expanded ? 'Show less' : `See ${hidden} more prop${hidden === 1 ? '' : 's'}`}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </button>
            )}
        </div>
    );
}

function DependencyList({ items }) {
    if (!items?.length) return <p className="text-sm text-[var(--ink-3)]">No extra dependencies.</p>;
    return (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((dep) => (
                <li key={dep.name} className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lime-soft)] text-[var(--lime-text)]">
                        <Package className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--ink)]">{dep.name}</p>
                        <p className="mt-0.5 text-[0.82rem] leading-5 text-[var(--ink-2)]">{dep.desc}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function InstallSteps({ cli }) {
    const steps = [
        { title: 'Install the package', command: 'npm i apex-ui-kit' },
        { title: 'Add the component', command: `npx apex-ui-kit add ${cli}` },
    ];
    return (
        <ol className="relative ml-3.5 space-y-6 border-l border-[var(--line)] pl-7">
            {steps.map((step, i) => (
                <li key={step.command} className="relative">
                    <span className="absolute -left-[2.45rem] top-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--bg)] font-mono text-[0.72rem] text-[var(--ink)]">{i + 1}</span>
                    <p className="mb-2.5 text-[0.92rem] font-medium text-[var(--ink)]">{step.title}</p>
                    <CommandLine command={step.command} />
                </li>
            ))}
        </ol>
    );
}

/* A titled section in the component page body (also used for extra sections such as Setup). */
export function DocSection({ id, title, description, children }) {
    return (
        <section id={id} className="scroll-mt-24 pt-14">
            <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-[var(--ink)]">{title}</h2>
            {description && <p className="mt-1.5 max-w-[62ch] text-[0.95rem] leading-relaxed text-[var(--ink-2)]">{description}</p>}
            <div className="mt-5 min-w-0">{children}</div>
        </section>
    );
}

/*
 * Standard component page in the docs layout: header, live preview card,
 * then Playground / Props / Installation / Dependencies sections, with an
 * "On this page" list in the right column.
 *
 * Single component:
 *   <ComponentDoc title description preview code cli props dependencies
 *                 controls? previewClassName? fullBleed? extra? extraToc? />
 *
 * Several related components on one page (e.g. Carousel):
 *   <ComponentDoc title description variants={[{ name, description, ...same fields }]} />
 */
export default function ComponentDoc({ title, description, variants, extraToc = [], ...single }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);
    const list = variants?.length ? variants : [single];
    const [active, setActive] = useState(0);
    const variant = list[Math.min(active, list.length - 1)];
    const multi = list.length > 1;

    const toc = [
        { id: 'preview', label: 'Preview' },
        ...(variant.controls ? [{ id: 'playground', label: 'Playground' }] : []),
        { id: 'props', label: 'Props' },
        { id: 'installation', label: 'Installation' },
        { id: 'dependencies', label: 'Dependencies' },
        ...extraToc,
    ];

    return (
        <article className={`${DOC_PAD} mx-auto grid w-full max-w-[84rem] gap-12 pb-4 pt-[clamp(1.75rem,4vw,3rem)] xl:grid-cols-[minmax(0,1fr)_12.5rem]`}>
            <div className="min-w-0">
                <PageHeader
                    eyebrow={
                        <span className="inline-flex items-center gap-2">
                            {[page?.category, multi ? `${list.length} variants` : null].filter(Boolean).join(' · ')}
                            {page?.isNew && <NewBadge />}
                        </span>
                    }
                    title={title}
                    description={description}
                    aside={variant.cli && <CliChip command={`npx apex-ui-kit add ${variant.cli}`} />}
                />

                <section id="preview" className="scroll-mt-24">
                    {multi && variant.description && (
                        <p className="mb-3 text-sm text-[var(--ink-2)]">
                            <span className="font-medium text-[var(--ink)]">{variant.name}.</span> {variant.description}
                        </p>
                    )}
                    <Stage title={title} description={description} variant={variant} variants={multi ? list : null} activeVariant={active} onVariant={setActive} />
                </section>

                {variant.controls && (
                    <DocSection id="playground" title="Playground" description="Change the props and watch the preview update.">
                        <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 text-sm text-[var(--ink-2)]">{variant.controls}</div>
                    </DocSection>
                )}
                <DocSection id="props" title="Props">
                    {/* Keyed by variant so switching tabs collapses the table again. */}
                    <PropsTable key={active} rows={variant.props} />
                </DocSection>
                <DocSection id="installation" title="Installation" description="Add the component with the ApexUI CLI. The source is copied into your project.">
                    <InstallSteps cli={variant.cli} />
                </DocSection>
                <DocSection id="dependencies" title="Dependencies">
                    <DependencyList items={variant.dependencies} />
                </DocSection>

                {single.extra}
                {page && <Pager path={page.path} />}
                <DocFooter />
            </div>
            <aside className="hidden xl:block">
                <div className="sticky top-24">
                    <TableOfContents items={toc} />
                </div>
            </aside>
        </article>
    );
}
