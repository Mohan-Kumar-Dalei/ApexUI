import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SiteFooter from '../layout/SiteFooter.jsx';
import { DocHero, Meta } from '../docs/parts.jsx';
import { PAD_X } from '../docs/style.js';

const upcoming = [
    { name: 'SaaS Launch', note: 'Hero, pricing, testimonials' },
    { name: 'Developer Portfolio', note: 'Profile cards, projects, contact' },
    { name: 'Product Story', note: 'Scroll marquee, parallax, CTA' },
    { name: 'Dashboard Shell', note: 'Nav menu, cards, backgrounds' },
];

export default function TemplatesSoon() {
    return (
        <div>
            <DocHero
                meta={
                    <>
                        <span className="inline-flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lime)] opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--lime)]" />
                            </span>
                            In progress
                        </span>
                        <span>· Templates</span>
                    </>
                }
                title="Templates are coming"
                description="Complete, production-ready pages assembled from ApexUI components. Until they ship, every building block is already in the library."
                aside={
                    <Link to="/components" className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--lime)] px-6 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                        Browse components <ArrowRight className="h-4 w-4" />
                    </Link>
                }
            />

            <div className="grid border-t border-[var(--line)] sm:grid-cols-2 2xl:grid-cols-4">
                {upcoming.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`${PAD_X} group border-b border-[var(--line)] py-8 sm:border-r`}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
                            <div className="space-y-2.5">
                                <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-[var(--panel-3)]" />
                                <div className="h-16 animate-pulse rounded-xl bg-[var(--panel-2)]" />
                                <div className="grid grid-cols-3 gap-2.5">
                                    {[0, 1, 2].map((k) => <div key={k} className="h-12 animate-pulse rounded-lg bg-[var(--panel-2)]" style={{ animationDelay: `${k * 150}ms` }} />)}
                                </div>
                                <div className="h-8 w-1/2 animate-pulse rounded-full bg-[var(--lime-soft)]" />
                            </div>
                        </div>
                        <div className="mt-5">
                            <Meta>T·{String(i + 1).padStart(2, '0')} · Soon</Meta>
                            <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]">{t.name}</h3>
                            <p className="mt-1 text-sm text-[var(--ink-2)]">{t.note}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <SiteFooter />
        </div>
    );
}
