import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Menu, Plus, X } from 'lucide-react';
import { BackPill, useFonts } from '../shared.jsx';
import { BRAND, PAGE } from './content.js';
import Dashboard from './Dashboard.jsx';

/*
 * Kosh, a money app for freelancers. Direction: clean ledger, white cards on a soft
 * paper grey, one deep green. Layout: centred product hero, bento features, sticky
 * stacked steps. Architecture: the page is data (content.js) drawn by a block renderer.
 * Loader: logo and a progress bar. Skeleton: the whole dashboard boots before its data.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';
const vars = {
    '--k-bg': '#F4F5F1',
    '--k-surface': '#FFFFFF',
    '--k-ink': '#0E1A13',
    '--k-muted': '#5E6B63',
    '--k-line': '#E2E6E0',
    '--k-accent': '#126B47',
    '--k-soft': '#E3F0E8',
    fontFamily: '"Geist", system-ui, sans-serif',
};
const mono = { fontFamily: '"Geist Mono", ui-monospace, monospace' };
const EASE = [0.16, 1, 0.3, 1];
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const CSS = `
.ks ::selection { background: var(--k-accent); color: #fff; }
@keyframes ks-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
.ks-bone { background: #ECEFEA; animation: ks-pulse 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ks-bone { animation: none; } }
`;

const Mark = ({ className = 'h-8 w-8 text-base' }) => (
    <span className={`grid place-items-center rounded-[28%] bg-[var(--k-accent)] font-semibold text-white ${className}`} aria-hidden="true">
        k
    </span>
);

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 0.8, ease: EASE, delay },
});

/* ---------- loader: the mark, a bar that fills, then a soft fade ---------- */
function Loader({ onDone }) {
    const reduce = useReducedMotion();
    const done = useRef(onDone);
    const [p, setP] = useState(0);
    const [leaving, setLeaving] = useState(false);
    useEffect(() => {
        if (reduce) return done.current();
        const c = animate(0, 100, { duration: 1.2, ease: [0.45, 0, 0.2, 1], onUpdate: setP, onComplete: () => setTimeout(() => setLeaving(true), 150) });
        return () => c.stop();
    }, [reduce]);
    if (reduce) return null;
    return (
        <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-[var(--k-bg)]"
            animate={leaving ? { opacity: 0 } : undefined}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={() => leaving && done.current()}
            aria-hidden="true"
        >
            <motion.div className="flex flex-col items-center" animate={leaving ? { scale: 0.92, y: -10 } : undefined} transition={{ duration: 0.5, ease: EASE }}>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                    <Mark className="h-14 w-14 text-2xl" />
                </motion.div>
                <div className="mt-7 h-1 w-44 overflow-hidden rounded-full bg-[var(--k-line)]">
                    <div className="h-full origin-left rounded-full bg-[var(--k-accent)]" style={{ transform: `scaleX(${p / 100})` }} />
                </div>
                <p className="mt-3 text-xs tabular-nums text-[var(--k-muted)]" style={mono}>
                    {Math.round(p)}%
                </p>
            </motion.div>
        </motion.div>
    );
}

/* ---------- floating pill nav ---------- */
function Nav({ ready }) {
    const [small, setSmall] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const on = () => setSmall(window.scrollY > 40);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);
    const go = (id) => (e) => {
        e.preventDefault();
        setOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <motion.header initial={{ y: -80 }} animate={ready ? { y: 0 } : undefined} transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }} className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
            <div className={`mx-auto max-w-5xl rounded-full border transition-all duration-500 ${small || open ? 'border-[var(--k-line)] bg-white/90 shadow-[0_10px_30px_-18px_rgba(14,26,19,0.35)] backdrop-blur' : 'border-transparent bg-transparent'}`}>
                <div className={`flex items-center justify-between gap-4 pl-3 pr-2 transition-all duration-500 sm:pl-4 ${small ? 'h-14' : 'h-16'}`}>
                    <a href="#top" onClick={go('top')} className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em]">
                        <Mark /> {BRAND.name}
                    </a>
                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="flex gap-1">
                            {BRAND.nav.map(([l, id]) => (
                                <li key={id}>
                                    <a href={`#${id}`} onClick={go(id)} className="rounded-full px-3.5 py-2 text-sm text-[var(--k-muted)] transition-colors hover:bg-[var(--k-bg)] hover:text-[var(--k-ink)]">
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="flex items-center gap-1.5">
                        <a href="#top" className="hidden rounded-full px-3.5 py-2 text-sm font-medium sm:block">
                            Log in
                        </a>
                        <a href="#pricing" onClick={go('pricing')} className="hidden h-10 items-center rounded-full bg-[var(--k-ink)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--k-accent)] sm:inline-flex">
                            Start free
                        </a>
                        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="grid h-10 w-10 place-items-center rounded-full md:hidden">
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="mx-auto mt-2 max-w-5xl origin-top rounded-3xl border border-[var(--k-line)] bg-white p-3 shadow-[0_20px_50px_-24px_rgba(14,26,19,0.4)] md:hidden"
                    >
                        {BRAND.nav.map(([l, id], i) => (
                            <motion.a key={id} href={`#${id}`} onClick={go(id)} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }} className="block rounded-2xl px-4 py-3.5 text-[17px] font-medium hover:bg-[var(--k-bg)]">
                                {l}
                            </motion.a>
                        ))}
                        <a href="#pricing" onClick={go('pricing')} className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-[var(--k-ink)] text-[15px] font-medium text-white">
                            Start free
                        </a>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

/* ---------- the little live interfaces inside the bento ---------- */
function Cell({ kind }) {
    const ref = useRef(null);
    const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
    const [inter, setInter] = useState(false);
    const [usd, setUsd] = useState('1200');
    const [share, setShare] = useState(25);
    const [payout, setPayout] = useState(1);
    const line = 'flex items-center justify-between gap-3 py-2 text-[13px]';

    if (kind === 'invoice')
        return (
            <div ref={ref} className="rounded-xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--k-muted)]" style={mono}>
                        INV-1043
                    </span>
                    <span className="rounded-full bg-[var(--k-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--k-accent)]">Ready to send</span>
                </div>
                <div className="mt-3 divide-y divide-[var(--k-line)]">
                    {[
                        ['Brand identity, phase 1', 60000],
                        ['Two extra rounds of changes', 8000],
                        ['Print files for packaging', 12000],
                    ].map(([t, n], i) => (
                        <motion.div key={t} className={line} initial={{ opacity: 0, x: -10 }} animate={seen ? { opacity: 1, x: 0 } : undefined} transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.25 }}>
                            <span className="truncate">{t}</span>
                            <span className="tabular-nums text-[var(--k-muted)]">{inr(n)}</span>
                        </motion.div>
                    ))}
                    <motion.div className={`${line} font-semibold`} initial={{ opacity: 0 }} animate={seen ? { opacity: 1 } : undefined} transition={{ delay: 1.1 }}>
                        <span>Total</span>
                        <span className="tabular-nums">{inr(80000)}</span>
                    </motion.div>
                </div>
            </div>
        );

    if (kind === 'gst') {
        const base = 68000;
        return (
            <div className="rounded-xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
                <div className="grid grid-cols-2 rounded-lg bg-[var(--k-bg)] p-1 text-xs font-medium">
                    {['Same state', 'Other state'].map((t, i) => (
                        <button key={t} type="button" onClick={() => setInter(!!i)} aria-pressed={inter === !!i} className="relative rounded-md py-1.5">
                            {inter === !!i && <motion.span layoutId="ks-gst" className="absolute inset-0 rounded-md bg-white shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                            <span className="relative">{t}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-2 divide-y divide-[var(--k-line)]">
                    <div className={line}>
                        <span>Amount</span>
                        <span className="tabular-nums">{inr(base)}</span>
                    </div>
                    {(inter ? [['IGST 18%', 0.18]] : [['CGST 9%', 0.09], ['SGST 9%', 0.09]]).map(([t, r]) => (
                        <motion.div key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${line} text-[var(--k-muted)]`}>
                            <span>{t}</span>
                            <span className="tabular-nums">{inr(base * r)}</span>
                        </motion.div>
                    ))}
                    <div className={`${line} font-semibold`}>
                        <span>Client pays</span>
                        <span className="tabular-nums">{inr(base * 1.18)}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (kind === 'fx') {
        const n = Math.min(Number(usd.replace(/[^0-9.]/g, '')) || 0, 1e7);
        return (
            <div className="rounded-xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
                <label className="block text-xs text-[var(--k-muted)]" htmlFor="ks-usd">
                    Client pays
                </label>
                <div className="mt-1.5 flex h-11 items-center gap-2 rounded-lg border border-[var(--k-line)] px-3 focus-within:border-[var(--k-accent)]">
                    <span className="text-sm text-[var(--k-muted)]">USD</span>
                    <input id="ks-usd" inputMode="decimal" value={usd} onChange={(e) => setUsd(e.target.value.slice(0, 9))} className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-medium tabular-nums outline-none" />
                </div>
                <p className="mt-3 text-xs text-[var(--k-muted)]">You get, after 1% fee</p>
                <p className="mt-0.5 text-2xl font-semibold tracking-[-0.02em] tabular-nums">{inr(n * 83.4 * 0.99)}</p>
                <p className="mt-1 text-[11px] text-[var(--k-muted)]" style={mono}>
                    1 USD = ₹83.40, rate held for 24h
                </p>
            </div>
        );
    }

    if (kind === 'pot') {
        const month = 145000;
        return (
            <div className="rounded-xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
                <div className="flex items-baseline justify-between">
                    <label htmlFor="ks-pot" className="text-xs text-[var(--k-muted)]">
                        Set aside
                    </label>
                    <span className="text-sm font-semibold tabular-nums">{share}%</span>
                </div>
                <input id="ks-pot" type="range" min="10" max="40" step="1" value={share} onChange={(e) => setShare(Number(e.target.value))} className="mt-3 w-full accent-[var(--k-accent)]" />
                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[var(--k-bg)]">
                    <motion.div className="h-full rounded-full bg-[var(--k-accent)]" animate={{ width: `${share}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                </div>
                <p className="mt-3 text-[13px] text-[var(--k-muted)]">
                    <span className="font-semibold text-[var(--k-ink)] tabular-nums">{inr((month * share) / 100)}</span> of this month's {inr(month)}
                </p>
            </div>
        );
    }

    if (kind === 'remind')
        return (
            <div ref={ref} className="space-y-2">
                {[
                    ['Day 3', 'Hi Priya, a gentle reminder that invoice 1039 is due on Friday.'],
                    ['Day 7', 'Just checking this reached you. Happy to resend it if needed.'],
                    ['Day 14', 'Invoice 1039 is a week overdue. Could you share a date for payment?'],
                ].map(([d, t], i) => (
                    <motion.div key={d} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={seen ? { opacity: 1, y: 0, scale: 1 } : undefined} transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.35 }} className="rounded-xl rounded-tl-sm border border-[var(--k-line)] bg-[var(--k-surface)] p-3">
                        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--k-accent)]">{d}</p>
                        <p className="mt-1 text-[13px] leading-snug">{t}</p>
                    </motion.div>
                ))}
            </div>
        );

    // payout
    const bars = [
        [12, 18, 9, 22, 15, 8, 0],
        [0, 0, 0, 0, 84, 0, 0],
        [0, 0, 41, 0, 0, 0, 43],
    ][payout];
    return (
        <div className="rounded-xl border border-[var(--k-line)] bg-[var(--k-surface)] p-4">
            <div className="flex flex-wrap gap-1.5">
                {['Daily', 'Weekly', 'On request'].map((t, i) => (
                    <button key={t} type="button" onClick={() => setPayout(i)} aria-pressed={payout === i} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${payout === i ? 'border-[var(--k-ink)] bg-[var(--k-ink)] text-white' : 'border-[var(--k-line)] text-[var(--k-muted)] hover:text-[var(--k-ink)]'}`}>
                        {t}
                    </button>
                ))}
            </div>
            <div className="mt-4 flex h-24 items-end gap-2">
                {bars.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                        <motion.div className="w-full rounded-md bg-[var(--k-accent)]" animate={{ height: `${Math.max(v, 3)}px`, opacity: v ? 1 : 0.15 }} transition={{ type: 'spring', stiffness: 260, damping: 26, delay: i * 0.03 }} />
                        <span className="text-[10px] text-[var(--k-muted)]">{'MTWTFSS'[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- sticky stacked steps ---------- */
function StepCard({ step, i, total, progress }) {
    const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - 1 - i) * 0.05]);
    const tones = ['bg-[var(--k-surface)]', 'bg-[var(--k-soft)]', 'bg-[var(--k-ink)] text-white'];
    return (
        <div className={i < total - 1 ? 'h-[60vh] sm:h-[70vh]' : ''}>
            <motion.article style={{ scale, top: `calc(6rem + ${i * 1.25}rem)` }} className={`sticky origin-top rounded-[1.75rem] border border-[var(--k-line)] p-6 sm:p-10 ${tones[i % 3]}`}>
                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-lg">
                        <span className="text-[clamp(3.5rem,9vw,6rem)] font-semibold leading-none tracking-[-0.04em] opacity-25">{step.n}</span>
                        <h3 className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold tracking-[-0.02em]">{step.title}</h3>
                        <p className={`mt-3 text-[1.02rem] leading-relaxed ${i % 3 === 2 ? 'text-white/70' : 'text-[var(--k-muted)]'}`}>{step.text}</p>
                    </div>
                    <span className={`self-start rounded-full border px-3.5 py-1.5 text-xs sm:self-end ${i % 3 === 2 ? 'border-white/20' : 'border-[var(--k-line)]'}`} style={mono}>
                        {step.meta}
                    </span>
                </div>
            </motion.article>
        </div>
    );
}

function Stack({ block }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    return (
        <section id={block.id} className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <motion.h2 {...reveal()} className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                    {block.title}
                </motion.h2>
                <div ref={ref} className="mt-12">
                    {block.steps.map((s, i) => (
                        <StepCard key={s.n} step={s} i={i} total={block.steps.length} progress={scrollYProgress} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- pricing with a monthly / yearly switch ---------- */
function Pricing({ block }) {
    const [yearly, setYearly] = useState(true);
    return (
        <section id={block.id} className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <motion.h2 {...reveal()} className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                        {block.title}
                    </motion.h2>
                    <div className="grid w-full grid-cols-2 rounded-full border border-[var(--k-line)] bg-white p-1 text-sm font-medium sm:w-auto">
                        {['Monthly', 'Yearly, 2 months free'].map((t, i) => (
                            <button key={t} type="button" onClick={() => setYearly(!!i)} aria-pressed={yearly === !!i} className="relative rounded-full px-4 py-2">
                                {yearly === !!i && <motion.span layoutId="ks-bill" className="absolute inset-0 rounded-full bg-[var(--k-ink)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                                <span className={`relative whitespace-nowrap transition-colors ${yearly === !!i ? 'text-white' : 'text-[var(--k-muted)]'}`}>{t}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-12 grid gap-4 lg:grid-cols-3">
                    {block.plans.map((p, i) => {
                        const price = yearly ? p.year : p.month;
                        return (
                            <motion.article key={p.name} {...reveal(i * 0.08)} className={`flex flex-col rounded-[1.5rem] border p-6 sm:p-8 ${p.best ? 'border-[var(--k-ink)] bg-white shadow-[0_24px_60px_-36px_rgba(14,26,19,0.45)]' : 'border-[var(--k-line)] bg-white/60'}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{p.name}</h3>
                                    {p.best && <span className="rounded-full bg-[var(--k-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--k-accent)]">Most picked</span>}
                                </div>
                                <p className="mt-1 text-sm text-[var(--k-muted)]">{p.text}</p>
                                <div className="mt-6 flex h-12 items-baseline gap-1.5 overflow-hidden">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span key={price} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="text-[2.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                                            {inr(price)}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="text-sm text-[var(--k-muted)]">{price ? (yearly ? '/ year' : '/ month') : ''}</span>
                                </div>
                                <ul className="mt-6 space-y-2.5 text-[15px]">
                                    {p.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--k-accent)]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <a href="#top" className={`mt-8 flex h-12 items-center justify-center rounded-full text-[15px] font-medium transition-colors ${p.best ? 'bg-[var(--k-accent)] text-white hover:bg-[var(--k-ink)]' : 'border border-[var(--k-line)] hover:border-[var(--k-ink)]'}`}>
                                    {p.month ? `Choose ${p.name}` : 'Start free'}
                                </a>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Faq({ block }) {
    const [open, setOpen] = useState(0);
    return (
        <section id={block.id} className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
                <motion.h2 {...reveal()} className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                    {block.title}
                </motion.h2>
                <div className="divide-y divide-[var(--k-line)] border-y border-[var(--k-line)] lg:col-span-2">
                    {block.items.map(([q, a], i) => (
                        <div key={q}>
                            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium">
                                {q}
                                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--k-line)]">
                                    <Plus className="h-4 w-4" />
                                </motion.span>
                            </button>
                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                                        <p className="max-w-2xl pb-6 leading-relaxed text-[var(--k-muted)]">{a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- the block renderer ---------- */
const SPANS = ['md:col-span-2 lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'md:col-span-2 lg:col-span-6'];

function Block({ block, ready }) {
    switch (block.type) {
        case 'hero': {
            const up = (d) => ({ initial: { opacity: 0, y: 20 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.9, ease: EASE, delay: d } });
            return (
                <section className="px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
                    <div className="mx-auto max-w-4xl text-center">
                        <motion.p {...up(0.15)} className="inline-flex items-center gap-2 rounded-full border border-[var(--k-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--k-muted)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--k-accent)]" /> {block.eyebrow}
                        </motion.p>
                        <motion.h1 {...up(0.25)} className="mt-6 text-[clamp(2.5rem,6.6vw,5rem)] font-semibold leading-[1] tracking-[-0.045em]">
                            {block.title}
                        </motion.h1>
                        <motion.p {...up(0.35)} className="mx-auto mt-6 max-w-xl text-[1.1rem] leading-relaxed text-[var(--k-muted)]">
                            {block.text}
                        </motion.p>
                        <motion.div {...up(0.45)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                            <a href="#pricing" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--k-accent)] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[var(--k-ink)]">
                                {block.primary} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </a>
                            <a href="#how" className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--k-line)] bg-white px-6 text-[15px] font-medium transition-colors hover:border-[var(--k-ink)]">
                                {block.secondary}
                            </a>
                        </motion.div>
                        <motion.p {...up(0.5)} className="mt-4 text-sm text-[var(--k-muted)]">
                            {block.note}
                        </motion.p>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 60 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.1, ease: EASE, delay: 0.55 }} className="mx-auto mt-16 max-w-5xl">
                        <Dashboard start={ready} />
                    </motion.div>
                </section>
            );
        }
        case 'chips':
            return (
                <section className="px-4 py-12 sm:px-6">
                    <p className="text-center text-sm text-[var(--k-muted)]">{block.label}</p>
                    <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
                        {block.items.map((t, i) => (
                            <motion.li key={t} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 380, damping: 22, delay: i * 0.04 }} className="rounded-full border border-[var(--k-line)] bg-white px-4 py-2 text-sm">
                                {t}
                            </motion.li>
                        ))}
                    </ul>
                </section>
            );
        case 'bento':
            return (
                <section id={block.id} className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
                    <div className="mx-auto max-w-6xl">
                        <motion.h2 {...reveal()} className="max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                            {block.title}
                        </motion.h2>
                        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                            {block.cells.map((c, i) => (
                                <motion.article key={c.kind} {...reveal((i % 3) * 0.08)} className={`flex min-w-0 flex-col gap-6 rounded-[1.5rem] bg-[var(--k-bg)] p-5 ring-1 ring-[var(--k-line)] sm:p-6 ${SPANS[i]} ${c.kind === 'payout' ? 'lg:flex-row lg:items-center' : ''}`}>
                                    <div className={c.kind === 'payout' ? 'lg:w-1/3' : ''}>
                                        <h3 className="text-lg font-semibold tracking-[-0.01em]">{c.title}</h3>
                                        <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--k-muted)]">{c.text}</p>
                                    </div>
                                    <div className={`mt-auto ${c.kind === 'payout' ? 'lg:mt-0 lg:flex-1' : ''}`}>
                                        <Cell kind={c.kind} />
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            );
        case 'stack':
            return <Stack block={block} />;
        case 'pricing':
            return <Pricing block={block} />;
        case 'faq':
            return <Faq block={block} />;
        case 'cta':
            return (
                <section className="px-4 pb-6 pt-10 sm:px-6">
                    <motion.div {...reveal()} className="mx-auto max-w-6xl rounded-[2rem] bg-[var(--k-accent)] px-6 py-16 text-center text-white sm:px-10 sm:py-24">
                        <h2 className="mx-auto max-w-2xl text-[clamp(2.2rem,5.4vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">{block.title}</h2>
                        <p className="mt-5 text-white/75">{block.text}</p>
                        <a href="#top" className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[var(--k-ink)] transition-transform hover:-translate-y-0.5">
                            {block.action} <ArrowRight className="h-4 w-4" />
                        </a>
                    </motion.div>
                </section>
            );
        default:
            return null;
    }
}

export default function Kosh() {
    useFonts(FONTS);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        document.title = 'Kosh, money app for freelancers';
    }, []);
    return (
        <div id="top" className="ks min-h-dvh overflow-x-clip bg-[var(--k-bg)] text-[var(--k-ink)] antialiased" style={vars}>
            <style>{CSS}</style>
            {!ready && <Loader onDone={() => setReady(true)} />}
            <Nav ready={ready} />
            <main>
                {PAGE.map((b, i) => (
                    <Block key={i} block={b} ready={ready} />
                ))}
            </main>
            <footer className="px-4 py-14 sm:px-6">
                <div className="mx-auto grid max-w-6xl gap-10 border-t border-[var(--k-line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="flex items-center gap-2.5 text-[17px] font-semibold">
                            <Mark /> Kosh
                        </p>
                        <p className="mt-3 max-w-xs text-sm text-[var(--k-muted)]">Money tools for people who work for themselves. Made in Bengaluru.</p>
                    </div>
                    {[
                        ['Product', ['Invoices', 'GST', 'Payments from abroad', 'Tax pot']],
                        ['Company', ['About', 'Careers', 'Security', 'Contact']],
                        ['Legal', ['Terms', 'Privacy', 'Grievance officer']],
                    ].map(([h, links]) => (
                        <div key={h}>
                            <p className="text-sm font-semibold">{h}</p>
                            <ul className="mt-3 space-y-2 text-sm text-[var(--k-muted)]">
                                {links.map((l) => (
                                    <li key={l}>
                                        <a href="#top" className="hover:text-[var(--k-ink)]">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className="mx-auto mt-12 max-w-6xl text-xs text-[var(--k-muted)]">© 2025 Kosh Technologies Pvt. Ltd. Payments are processed by an RBI-licensed payment aggregator.</p>
            </footer>
            <BackPill />
        </div>
    );
}
