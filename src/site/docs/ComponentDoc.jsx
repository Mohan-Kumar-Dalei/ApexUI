import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Eye, Grid3x3, Maximize2, Minimize2, Package, RotateCcw, Square, Sparkle } from 'lucide-react';
import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import { findPage } from '../config/navigation.js';
import { CliChip, DocFooter, DocHero, NewChip, Pager } from './parts.jsx';
import { PAD_X } from './style.js';

const STAGE_BG = [
    { id: 'dots', icon: Sparkle, label: 'Dots', className: 'stage-dots' },
    { id: 'grid', icon: Grid3x3, label: 'Grid', className: 'stage-grid' },
    { id: 'plain', icon: Square, label: 'Plain', className: '' },
];

const STAGE_H = 'min-h-[clamp(26rem,64vh,60rem)]';

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
                        {o.label && <span className="relative whitespace-nowrap">{o.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}

const toolBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)]';

/* The live preview: a dark canvas with view / background / replay / fullscreen controls. */
function Stage({ variant, variants, activeVariant, onVariant }) {
    const [view, setView] = useState('preview');
    const [bg, setBg] = useState(variant.fullBleed ? 'plain' : 'dots');
    const [replayKey, setReplayKey] = useState(0);
    const [full, setFull] = useState(false);
    const stageRef = useRef(null);

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

    return (
        <section ref={stageRef} aria-label="Live preview" className="flex min-w-0 flex-col bg-[var(--bg)]">
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
                            <div>
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
                    <Segmented
                        value={view}
                        onChange={setView}
                        options={[
                            { value: 'preview', label: 'Preview', icon: Eye },
                            { value: 'code', label: 'Code', icon: Code2 },
                        ]}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {view === 'preview' ? (
                    <motion.div
                        key={`preview-${activeVariant}-${replayKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`relative isolate flex flex-1 items-center justify-center overflow-hidden bg-[var(--stage)] text-white [transform:translateZ(0)] ${full ? 'h-screen' : STAGE_H} ${variant.fullBleed ? '' : 'p-[clamp(1.25rem,3vw,3.5rem)]'} ${variant.previewClassName ?? ''}`}
                    >
                        {bgClass && <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${bgClass} ${variant.fullBleed ? 'stage-overlay z-20' : '-z-10'}`} />}
                        {variant.preview}
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

function PropsList({ rows }) {
    if (!rows?.length) return <p className="text-sm text-[var(--ink-3)]">This component takes no props.</p>;
    return (
        <ul className="divide-y divide-[var(--line)]">
            {rows.map((row) => (
                <li key={row.prop} className="py-3.5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded-md bg-[var(--lime-soft)] px-1.5 py-0.5 text-[0.78rem] font-medium text-[var(--lime-text)]">{row.prop}</code>
                        <code className="text-[0.72rem] text-[var(--syntax-type)]">{row.type}</code>
                        {row.def != null && row.def !== '' && <code className="ml-auto text-[0.72rem] text-[var(--ink-3)]">= {row.def}</code>}
                    </div>
                    <p className="mt-1.5 text-[0.84rem] leading-relaxed text-[var(--ink-2)]">{row.desc}</p>
                </li>
            ))}
        </ul>
    );
}

function DependencyList({ items }) {
    if (!items?.length) return <p className="text-sm text-[var(--ink-3)]">No extra dependencies.</p>;
    return (
        <ul className="space-y-2">
            {items.map((dep) => (
                <li key={dep.name} className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--panel-2)] text-[var(--ink-3)]">
                        <Package className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)]">{dep.name}</p>
                        <p className="text-[0.8rem] leading-5 text-[var(--ink-2)]">{dep.desc}</p>
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
        <ol className="space-y-4">
            {steps.map((step, i) => (
                <li key={step.command}>
                    <p className="mb-2 flex items-center gap-2 text-[0.82rem] font-medium text-[var(--ink)]">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--panel-3)] font-mono text-[0.65rem] text-[var(--ink-2)]">{i + 1}</span>
                        {step.title}
                    </p>
                    <CommandLine command={step.command} />
                </li>
            ))}
        </ol>
    );
}

/* Right-hand panel: optional playground controls plus Props / Install / Deps tabs. */
function Inspector({ variant }) {
    const [tab, setTab] = useState('props');
    const tabs = [
        { value: 'props', label: `Props${variant.props?.length ? ` · ${variant.props.length}` : ''}` },
        { value: 'install', label: 'Install' },
        { value: 'deps', label: 'Deps' },
    ];

    return (
        <aside aria-label="Inspector" className="flex min-w-0 flex-col border-t border-[var(--line)] bg-[var(--panel)] xl:border-l xl:border-t-0">
            {variant.controls && (
                <section className="border-b border-[var(--line)] p-5">
                    <h3 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--lime-text)]">Playground</h3>
                    <div className="text-sm text-[var(--ink-2)] xl:[&_.grid]:!grid-cols-1">{variant.controls}</div>
                </section>
            )}
            <div className="border-b border-[var(--line)] px-5 py-3">
                <Segmented size="sm" value={tab} onChange={setTab} options={tabs} />
            </div>
            <div className="thin-scroll flex-1 overflow-y-auto p-5 xl:max-h-[clamp(26rem,64vh,60rem)]">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                        {tab === 'props' && <PropsList rows={variant.props} />}
                        {tab === 'install' && <InstallSteps cli={variant.cli} />}
                        {tab === 'deps' && <DependencyList items={variant.dependencies} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </aside>
    );
}

/* Extra prose sections below the stage (e.g. Theme Toggle setup). */
export function DocSection({ id, title, description, children }) {
    return (
        <section id={id} className={`${PAD_X} scroll-mt-24 border-b border-[var(--line)] py-12`}>
            <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <div>
                    <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">{title}</h2>
                    {description && <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">{description}</p>}
                </div>
                <div className="min-w-0">{children}</div>
            </div>
        </section>
    );
}

/*
 * Standard component page: editorial header, then a "stage" (live preview)
 * beside an "inspector" (playground, props, install, dependencies).
 *
 * Single component:
 *   <ComponentDoc title description preview code cli props dependencies
 *                 controls? previewClassName? fullBleed? extra? />
 *
 * Several related components on one page (e.g. Carousel):
 *   <ComponentDoc title description variants={[{ name, description, ...same fields }]} />
 */
export default function ComponentDoc({ title, description, variants, ...single }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);
    const list = variants?.length ? variants : [single];
    const [active, setActive] = useState(0);
    const variant = list[Math.min(active, list.length - 1)];
    const multi = list.length > 1;

    return (
        <article>
            <DocHero
                meta={
                    <>
                        {page?.num && <span>No. {page.num}</span>}
                        {page?.category && <span>· {page.category}</span>}
                        {multi && <span>· {list.length} variants</span>}
                        {page?.badge && <NewChip />}
                    </>
                }
                title={title}
                description={description}
                aside={variant.cli && <CliChip command={`npx apex-ui-kit add ${variant.cli}`} />}
            />

            <div className="grid border-y border-[var(--line)] xl:grid-cols-[minmax(0,1fr)_clamp(22rem,24vw,30rem)]">
                <div className="flex min-w-0 flex-col">
                    {multi && variant.description && (
                        <p className={`${PAD_X} border-b border-[var(--line)] py-3 text-sm text-[var(--ink-2)]`}>
                            <span className="font-medium text-[var(--ink)]">{variant.name}.</span> {variant.description}
                        </p>
                    )}
                    <Stage variant={variant} variants={multi ? list : null} activeVariant={active} onVariant={setActive} />
                </div>
                <Inspector key={active} variant={variant} />
            </div>

            {single.extra}
            {page && <Pager path={page.path} />}
            <DocFooter />
        </article>
    );
}
