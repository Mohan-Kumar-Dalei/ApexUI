import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Box, Check, CodeXml, Layers, Palette, Plus, Rocket, Zap } from 'lucide-react';
import DocShell, { DocSection } from '../../docs/DocShell.jsx';
import { CommandLine } from '../../ui/CodeBlock.jsx';
import { LOGO_FULL } from '../../ui/Logo.jsx';
import { CATEGORIES, componentPages, SITE } from '../../config/navigation.js';

const features = [
    { icon: Zap, title: 'One-line integration', description: 'Add any component with a single CLI command. No manual setup.' },
    { icon: Box, title: 'Production-ready', description: 'Responsive, clean and performant components built with modern tech.' },
    { icon: CodeXml, title: 'Developer-first', description: 'Reusable, accessible and easy to drop into any React + Vite project.' },
    { icon: Palette, title: 'Fully customizable', description: 'Components live in your codebase, so you can edit and style them freely.' },
    { icon: Layers, title: 'Minimal dependencies', description: 'Only what each component needs, keeping your project lean and fast.' },
    { icon: Rocket, title: 'Built for motion', description: 'GSAP and Framer Motion power smooth, high-performance animations.' },
];

const faqs = [
    { q: 'Does ApexUI work with Create React App?', a: 'Yes — as long as Tailwind CSS is configured, ApexUI works with CRA too.' },
    { q: 'How can I customize a component?', a: 'Components are added to your project under src/ApexUI-Kit/. Open the generated file and change whatever you like.' },
    { q: 'Do components animate out of the box?', a: 'Yes. GSAP and Framer Motion are used for smooth, high-performance animations.' },
    { q: 'Is ApexUI open source?', a: 'Absolutely. It is MIT licensed and open to contributions on GitHub.' },
];

const toc = [
    { id: 'meet-apexui', label: 'Meet ApexUI' },
    { id: 'quick-start', label: 'Quick start' },
    { id: 'why-apexui', label: 'Why ApexUI' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'faq', label: 'FAQ' },
];

function FaqItem({ item, index, open, onToggle }) {
    return (
        <div className="border-b border-[var(--line)]">
            <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-5 py-5 text-left">
                <span className="font-mono text-[0.7rem] text-[var(--ink-3)]">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex-1 text-[1.02rem] font-medium text-[var(--ink)]">{item.q}</span>
                <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${open ? 'rotate-45 border-[var(--lime)] bg-[var(--lime)] text-[var(--lime-ink)]' : 'border-[var(--line)] text-[var(--ink-3)]'}`}>
                    <Plus className="h-4 w-4" />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <p className="pb-5 pl-10 text-[0.98rem] leading-relaxed text-[var(--ink-2)]">{item.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Introduction() {
    const [openFaq, setOpenFaq] = useState(0);
    return (
        <DocShell
            title="Introduction"
            description="ApexUI is a developer-first collection of animated React components. Add them with one command, then own the code — style and extend them however you like."
            toc={toc}
        >
            <DocSection id="meet-apexui">
                <div className="grid items-center gap-8 overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1rem,2vw,2rem)] sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                    <motion.img
                        src={LOGO_FULL}
                        alt="ApexUI logo"
                        initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-[12rem] rounded-[1.25rem] border border-white/10 shadow-[var(--shadow)]"
                    />
                    <div>
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--lime-text)]">ApexUI {SITE.version}</p>
                        <h2 className="font-display mt-3 text-[clamp(1.2rem,1.5vw,1.7rem)] font-semibold leading-snug text-[var(--ink)]">
                            {componentPages.length} components across {CATEGORIES.length} families — backgrounds, cards, text effects, navigation and more.
                        </h2>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/components" className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                                Browse components <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link to="/components/docs/getting-started/installation/react-setup" className="inline-flex h-10 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--panel-2)]">
                                Installation guide
                            </Link>
                        </div>
                    </div>
                </div>
            </DocSection>

            <DocSection id="quick-start" title="Quick start" description="Install the package, then add your first component.">
                <div className="space-y-3">
                    <CommandLine command="npm i apex-ui-kit" />
                    <CommandLine command="npx apex-ui-kit add hyper-card" />
                </div>
            </DocSection>

            <DocSection id="why-apexui" title="Why ApexUI" description="More than a component library — a faster workflow, with ready-to-use, fully customizable, animated components right inside your project.">
                <div className="grid gap-px overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 2xl:grid-cols-3">
                    {features.map(({ icon: Icon, title, description }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.04 }}
                            className="group bg-[var(--bg)] p-6 transition-colors hover:bg-[var(--panel)]"
                        >
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--lime-text)] transition-colors group-hover:border-[var(--lime-line)]">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="font-display mt-4 text-lg font-semibold text-[var(--ink)]">{title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-2)]">{description}</p>
                        </motion.div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="requirements" title="Requirements">
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        { title: 'Tech stack', items: ['React — component-based UI', 'Tailwind CSS — utility-first styling', 'GSAP & Framer Motion — animation'] },
                        { title: 'You’ll need', items: ['React + Vite (latest recommended)', 'Tailwind CSS, properly configured', 'Node.js 18 or newer'] },
                    ].map((col) => (
                        <div key={col.title} className="ticks border border-[var(--line)] bg-[var(--panel)] p-6">
                            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">{col.title}</h3>
                            <ul className="mt-4 space-y-3 text-[0.95rem] text-[var(--ink-2)]">
                                {col.items.map((t) => (
                                    <li key={t} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lime-text)]" />{t}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="faq" title="Frequently asked questions">
                <div className="border-t border-[var(--line)]">
                    {faqs.map((item, i) => (
                        <FaqItem key={item.q} item={item} index={i} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                    ))}
                </div>
            </DocSection>
        </DocShell>
    );
}
