import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, Check, Eye, Github, Lock } from 'lucide-react';
import SiteFooter from '../layout/SiteFooter.jsx';
import HorizonGlow from '../../components/MainUI/ApexUI-Kit/HorizonGlow/HorizonGlow.jsx';
import Marquee3D from '../../components/MainUI/ApexUI-Kit/Marquee3D/Marquee3D.jsx';
import ShinyText from '../../components/MainUI/ApexUI-Kit/ShinyText/ShinyText.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import useSiteTheme from '../ui/useSiteTheme.js';
import { TEMPLATE_CATEGORIES, TEMPLATES } from '../templates/index.js';

export const ProBadge = ({ className = '' }) => (
    <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--lime-line)] bg-[var(--lime-soft)] px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--lime)] ${className}`}>
        <Lock className="h-3 w-3" /> Pro
    </span>
);

const PRO_FEATURES = ['Full source of every template', 'Light and dark versions', 'Figma files for each page', 'New templates every month', 'Lifetime updates'];

const FAQ = [
    { q: 'Are the components in these templates free?', a: 'Yes. Every component used here is free in the ApexUI library, and you can add each one with a single CLI command.' },
    { q: 'What does ApexUI Pro add?', a: 'The finished pages: the full source of each template, wired up and responsive, ready to drop into your project.' },
    { q: 'When does Pro launch?', a: 'Soon. Star the repo on GitHub to hear about it first.' },
    { q: 'Can I see a template before buying?', a: 'Every template has a live preview with all its animations and interactions, open any card to try it.' },
];

// A card whose glow follows the pointer.
function TemplateCard({ t, index }) {
    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    return (
        <motion.div layout initial={{ y: 16 }} animate={{ y: 0 }} exit={{ y: 16 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <Link
                to={`/templates/${t.slug}`}
                onPointerMove={onMove}
                className="group relative block overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-2.5 transition-colors duration-300 hover:border-[var(--lime-line)]"
                style={{ '--glow': t.accent }}
            >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--glow) 22%, transparent), transparent 60%)' }} />
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-[var(--panel-2)]">
                    <img src={t.image} alt={`${t.name} template`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <Eye className="h-4 w-4" /> Live preview
                    </span>
                    <div className="absolute left-3 top-3 flex gap-1.5">
                        <ProBadge className="bg-black/50 backdrop-blur" />
                        {t.badge && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-300 backdrop-blur">
                                <Award className="h-3 w-3" /> {t.badge}
                            </span>
                        )}
                    </div>
                </div>
                <div className="relative px-2.5 pb-2 pt-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                                {String(index + 1).padStart(2, '0')} · {t.kind}
                            </p>
                            <h3 className="font-display mt-1.5 flex items-center gap-2 text-[1.45rem] font-semibold text-[var(--ink)]">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.accent, boxShadow: `0 0 14px ${t.accent}` }} />
                                {t.name}
                            </h3>
                        </div>
                        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-3)] transition-all duration-300 group-hover:border-transparent group-hover:bg-[var(--lime)] group-hover:text-[var(--lime-ink)]">
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--ink-2)]">{t.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {t.components.slice(0, 5).map((c) => (
                            <span key={c} className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[0.68rem] text-[var(--ink-3)]">
                                {c}
                            </span>
                        ))}
                        {t.components.length > 5 && <span className="px-1 py-0.5 text-[0.68rem] text-[var(--ink-3)]">+{t.components.length - 5}</span>}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function TemplatesPage() {
    const theme = useSiteTheme();
    const [cat, setCat] = useState('All');
    const list = useMemo(() => (cat === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat)), [cat]);
    const used = useMemo(() => new Set(TEMPLATES.flatMap((t) => t.components)).size, []);
    const wall = useMemo(() => [...TEMPLATES, ...TEMPLATES].map((t) => t.image), []);

    return (
        <div className="mx-auto w-full max-w-[100rem]">
            {/* Hero: glow behind the copy, a moving wall of the templates on the right. */}
            <section className="px-[clamp(0.75rem,2.2vw,2rem)] pt-[clamp(0.75rem,2vw,1.5rem)]">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c16] text-white">
                    <div className="absolute inset-0">
                        <HorizonGlow preset="lilac" intensity={0.85} />
                    </div>
                    <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.05fr]">
                        <div className="px-[clamp(1.25rem,4vw,3.5rem)] pb-4 pt-[clamp(2.5rem,6vw,5rem)] lg:pb-[clamp(2.5rem,6vw,5rem)]">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs backdrop-blur">
                                <ShinyText text={`${TEMPLATES.length} premium templates · Pro`} color="#c4b5fd" shineColor="#ffffff" />
                            </span>
                            <h1 className="font-display mt-5 text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
                                Ship a whole site,
                                <br />
                                <span className="bg-gradient-to-r from-[#f0abfc] via-[#c4b5fd] to-[#93c5fd] bg-clip-text text-transparent">not just a section</span>
                            </h1>
                            <p className="mt-5 max-w-md text-[0.98rem] text-white/70">Complete, responsive pages built from ApexUI components with real content. Open any of them to try it live, every animation included.</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a href="#templates" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
                                    Browse templates <ArrowUpRight className="h-4 w-4" />
                                </a>
                                <Link to="/components" className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold backdrop-blur transition hover:bg-white/10">
                                    Free components
                                </Link>
                            </div>
                            <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 border-t border-white/10 pt-6">
                                {[
                                    [TEMPLATES.length, 'templates'],
                                    [used, 'components used'],
                                    ['100%', 'responsive'],
                                ].map(([n, l]) => (
                                    <div key={l}>
                                        <dt className="text-2xl font-black">{n}</dt>
                                        <dd className="text-xs text-white/55">{l}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="relative h-[clamp(18rem,40vw,34rem)] [mask-image:linear-gradient(to_right,transparent,#000_18%)] lg:h-[36rem]">
                            <Marquee3D images={wall} columns={3} speed={0.6} />
                        </div>
                    </div>
                </div>
            </section>

            <section id="templates" className="scroll-mt-24 px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(3rem,6vw,5rem)]">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ink-3)]">The collection</p>
                        <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Pick a starting point</h2>
                    </div>
                    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
                        {TEMPLATE_CATEGORIES.map((c) => (
                            <button key={c} type="button" onClick={() => setCat(c)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === c ? 'text-[var(--lime-ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}>
                                {cat === c && <motion.span layoutId="tpl-cat" className="absolute inset-0 rounded-full bg-[var(--lime)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                                <span className="relative">{c}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    {list.map((t) => (
                        <TemplateCard key={t.slug} t={t} index={TEMPLATES.indexOf(t)} />
                    ))}
                </motion.div>
            </section>

            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,7rem)]">
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--lime-line)] bg-[var(--panel)] p-[clamp(1.5rem,4vw,3.5rem)]">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--lime)] opacity-[0.12] blur-3xl" />
                    <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                        <div>
                            <ProBadge />
                            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">ApexUI Pro is coming</h2>
                            <p className="mt-3 max-w-lg text-[var(--ink-2)]">Get the finished pages behind every preview here, ready to drop into your React project. Until then, all {TEMPLATES.length} templates are free to explore live.</p>
                            <a href="https://github.com/Mohan-Kumar-Dalei/ApexUI" target="_blank" rel="noreferrer" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--lime)] px-6 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                                <Github className="h-4 w-4" /> Star on GitHub to hear first
                            </a>
                        </div>
                        <ul className="space-y-3">
                            {PRO_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-[var(--ink)]">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--lime-soft)] text-[var(--lime)]">
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-[clamp(1rem,2.2vw,2rem)] py-[clamp(4rem,8vw,7rem)]">
                <h2 className="font-display mb-8 text-center text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Questions</h2>
                <FaqAccordion items={FAQ} accentColor="#a3e635" theme={theme === 'light' ? 'light' : 'dark'} />
            </section>
            <SiteFooter />
        </div>
    );
}
