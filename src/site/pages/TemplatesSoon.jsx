import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '../layout/SiteHeader.jsx';
import SiteFooter from '../layout/SiteFooter.jsx';

const upcoming = ['SaaS landing page', 'Developer portfolio', 'Product launch'];

export default function TemplatesSoon() {
    useEffect(() => {
        document.title = 'Templates – ApexUI';
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
            <SiteHeader />
            <main className="relative isolate overflow-hidden">
                <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
                <div className="pointer-events-none absolute left-1/2 top-[-260px] -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--glow)] blur-[120px]" />
                <div className="mx-auto max-w-5xl px-4 pb-28 pt-24 text-center sm:px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--fg-muted)]"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                        </span>
                        In progress
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl"
                    >
                        Templates are coming soon
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto mt-5 max-w-xl text-lg text-[var(--fg-muted)]"
                    >
                        Complete, production-ready page templates built from ApexUI components. Until then, explore the component library.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-8">
                        <Link to="/components" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--fg)] px-5 text-sm font-medium text-[var(--bg)] transition hover:opacity-90">
                            Browse components <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>

                    <div className="mt-20 grid gap-5 text-left sm:grid-cols-3">
                        {upcoming.map((name, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.06 }}
                                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                            >
                                <div className="aspect-[4/3] space-y-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                                    <div className="h-2.5 w-1/3 animate-pulse rounded bg-[var(--surface-3)]" />
                                    <div className="h-14 animate-pulse rounded-lg bg-[var(--surface-2)]" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-10 animate-pulse rounded bg-[var(--surface-2)]" />
                                        <div className="h-10 animate-pulse rounded bg-[var(--surface-2)]" />
                                        <div className="h-10 animate-pulse rounded bg-[var(--surface-2)]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4">
                                    <span className="text-sm font-medium">{name}</span>
                                    <span className="text-xs text-[var(--fg-subtle)]">Soon</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
