import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Box, Check, CodeXml, Layers, Palette, Plus, Rocket, Zap } from 'lucide-react';
import DocShell, { DocSection } from '../../docs/DocShell.jsx';
import { CommandLine } from '../../ui/CodeBlock.jsx';
import { componentPages } from '../../config/navigation.js';

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
    { id: 'quick-start', label: 'Quick start' },
    { id: 'why-apexui', label: 'Why ApexUI' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'faq', label: 'FAQ' },
];

function FaqItem({ item, open, onToggle }) {
    return (
        <div className="border-b border-[var(--border)]">
            <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-[var(--fg)]">
                {item.q}
                <Plus className={`h-4 w-4 shrink-0 text-[var(--fg-subtle)] transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-[15px] leading-7 text-[var(--fg-muted)]">{item.a}</p>
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
            <DocSection id="quick-start" title="Quick start" description="Install the package and add your first component.">
                <div className="space-y-3">
                    <CommandLine command="npm i apex-ui-kit" />
                    <CommandLine command="npx apex-ui-kit add hyper-card" />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/components/docs/getting-started/installation/react-setup" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--fg)] px-4 text-sm font-medium text-[var(--bg)] transition hover:opacity-90">
                        Installation guide <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/components" className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--surface-2)]">
                        Browse {componentPages.length} components
                    </Link>
                </div>
            </DocSection>

            <DocSection
                id="why-apexui"
                title="Why ApexUI"
                description="More than a component library — a faster workflow, with ready-to-use, fully customizable, animated components right inside your project."
            >
                <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="bg-[var(--bg)] p-5">
                            <Icon className="h-5 w-5 text-[var(--accent-text)]" />
                            <h3 className="mt-3 text-[15px] font-medium text-[var(--fg)]">{title}</h3>
                            <p className="mt-1 text-sm leading-6 text-[var(--fg-muted)]">{description}</p>
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="requirements" title="Requirements">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                        <h3 className="text-sm font-medium text-[var(--fg)]">Tech stack</h3>
                        <ul className="mt-3 space-y-2.5 text-sm text-[var(--fg-muted)]">
                            {['React — component-based UI', 'Tailwind CSS — utility-first styling', 'GSAP & Framer Motion — animation'].map((t) => (
                                <li key={t} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-text)]" />{t}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                        <h3 className="text-sm font-medium text-[var(--fg)]">You’ll need</h3>
                        <ul className="mt-3 space-y-2.5 text-sm text-[var(--fg-muted)]">
                            {['React + Vite (latest recommended)', 'Tailwind CSS, properly configured', 'Node.js 18 or newer'].map((t) => (
                                <li key={t} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-text)]" />{t}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </DocSection>

            <DocSection id="faq" title="Frequently asked questions">
                <div className="border-t border-[var(--border)]">
                    {faqs.map((item, i) => (
                        <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                    ))}
                </div>
            </DocSection>
        </DocShell>
    );
}
