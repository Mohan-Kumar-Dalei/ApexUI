import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownLeft, BarChart3, CheckCircle2, FileText, Home, PiggyBank, RotateCw, Settings, Users } from 'lucide-react';
import { DASH } from './content.js';

/*
 * The product in the hero. It boots like the real app: a skeleton of the dashboard
 * first, then the numbers count up, the chart draws and a payment arrives.
 */
const EASE = [0.16, 1, 0.3, 1];
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const usd = (n) => `$${n.toLocaleString('en-US')}`;

function Count({ to }) {
    const reduce = useReducedMotion();
    const [v, setV] = useState(reduce ? to : 0);
    useEffect(() => {
        if (reduce) return undefined;
        const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: setV });
        return () => c.stop();
    }, [to, reduce]);
    return <span className="tabular-nums">{inr(v)}</span>;
}

const Bone = ({ className = '', style }) => <span className={`ks-bone block rounded-md ${className}`} style={style} />;

function Chart() {
    const w = 320;
    const h = 120;
    const max = Math.max(...DASH.income) * 1.15;
    const pts = DASH.income.map((v, i) => [(i / (DASH.income.length - 1)) * w, h - (v / max) * h]);
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const area = `${line} L${w} ${h} L0 ${h} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${h + 18}`} className="h-auto w-full overflow-visible" role="img" aria-label="Income for the last six months, highest in October">
            {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--k-line)" strokeDasharray="3 4" />
            ))}
            <motion.path d={area} fill="var(--k-accent)" initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 0.8, delay: 0.9 }} />
            <motion.path d={line} fill="none" stroke="var(--k-accent)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }} />
            {pts.map(([x, y], i) => (
                <motion.circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4.5 : 2.5} fill={i === pts.length - 1 ? 'var(--k-accent)' : 'var(--k-surface)'} stroke="var(--k-accent)" strokeWidth="1.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 + i * 0.2, type: 'spring', stiffness: 400, damping: 20 }} />
            ))}
            {DASH.months.map((m, i) => (
                <text key={m} x={pts[i][0]} y={h + 15} textAnchor={i === 0 ? 'start' : i === DASH.months.length - 1 ? 'end' : 'middle'} fontSize="9" fill="var(--k-muted)">
                    {m}
                </text>
            ))}
        </svg>
    );
}

const STATUS = {
    Paid: 'bg-[var(--k-soft)] text-[var(--k-accent)]',
    Due: 'bg-[#EEF0F4] text-[#4A5468]',
    Overdue: 'bg-[#FBEDE8] text-[#A6432A]',
};

export default function Dashboard({ start }) {
    const reduce = useReducedMotion();
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(false);
    const [run, setRun] = useState(0);
    useEffect(() => {
        if (!start) return undefined;
        setLoading(true);
        setToast(false);
        const a = setTimeout(() => setLoading(false), reduce ? 0 : 1700);
        const b = setTimeout(() => setToast(true), reduce ? 0 : 3600);
        const c = setTimeout(() => setToast(false), 7600);
        return () => [a, b, c].forEach(clearTimeout);
    }, [start, run, reduce]);

    const side = [Home, FileText, Users, BarChart3, PiggyBank, Settings];

    return (
        <div className="relative">
            <div className="overflow-hidden rounded-[1.25rem] border border-[var(--k-line)] bg-[var(--k-surface)] shadow-[0_30px_80px_-40px_rgba(14,26,19,0.35)]">
                {/* window bar */}
                <div className="flex h-11 items-center gap-2 border-b border-[var(--k-line)] px-4">
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2.5 w-2.5 rounded-full bg-[var(--k-line)]" />
                    ))}
                    <span className="mx-auto truncate rounded-md bg-[var(--k-bg)] px-3 py-1 text-[11px] text-[var(--k-muted)]" style={{ fontFamily: '"Geist Mono", monospace' }}>
                        app.kosh.money/home
                    </span>
                    <button type="button" onClick={() => setRun((r) => r + 1)} aria-label="Reload the dashboard" className="grid h-7 w-7 place-items-center rounded-md text-[var(--k-muted)] hover:bg-[var(--k-bg)] hover:text-[var(--k-ink)]">
                        <RotateCw className="h-3.5 w-3.5" />
                    </button>
                </div>
                <div className="flex">
                    <aside className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-[var(--k-line)] py-4 sm:flex">
                        {side.map((Icon, i) => (
                            <span key={i} className={`grid h-9 w-9 place-items-center rounded-lg ${i === 0 ? 'bg-[var(--k-soft)] text-[var(--k-accent)]' : 'text-[var(--k-muted)]'}`}>
                                <Icon className="h-4 w-4" />
                            </span>
                        ))}
                    </aside>
                    <div className="min-w-0 flex-1 p-4 sm:p-6" aria-busy={loading}>
                        <div className="mb-5 flex items-center justify-between gap-3">
                            {loading ? <Bone className="h-5 w-40" /> : <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[15px] font-semibold">Good morning, here is October</motion.p>}
                            {loading ? <Bone className="h-8 w-24 rounded-full" /> : <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-full bg-[var(--k-ink)] px-3.5 py-1.5 text-xs font-medium text-white">New invoice</motion.span>}
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                            {[
                                ['In the bank', DASH.balance],
                                ['Owed to you', DASH.owed],
                                ['Tax pot', DASH.pot],
                            ].map(([label, n], i) => (
                                <div key={label} className={`rounded-xl border border-[var(--k-line)] p-3.5 sm:p-4 ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
                                    {loading ? (
                                        <>
                                            <Bone className="h-3 w-16" />
                                            <Bone className="mt-3 h-6 w-24" />
                                        </>
                                    ) : (
                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}>
                                            <p className="text-xs text-[var(--k-muted)]">{label}</p>
                                            <p className="mt-1 text-[clamp(1.05rem,2.6vw,1.45rem)] font-semibold tracking-[-0.02em]">
                                                <Count to={n} />
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 grid gap-3 lg:grid-cols-5">
                            <div className="rounded-xl border border-[var(--k-line)] p-4 lg:col-span-3">
                                {loading ? (
                                    <>
                                        <Bone className="h-3 w-28" />
                                        <div className="mt-5 flex h-[118px] items-end gap-3">
                                            {[45, 60, 38, 75, 66, 88].map((h, i) => (
                                                <Bone key={i} className="flex-1 rounded-b-none" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-xs text-[var(--k-muted)]">Income, last 6 months</p>
                                            <p className="text-xs font-medium text-[var(--k-accent)]">+30% on Sep</p>
                                        </div>
                                        <div className="mt-4">
                                            <Chart />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="rounded-xl border border-[var(--k-line)] p-2 lg:col-span-2">
                                <ul>
                                    {DASH.invoices.map(([no, client, amount, status, cur], i) => (
                                        <li key={no} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                                            {loading ? (
                                                <>
                                                    <Bone className="h-8 w-8 shrink-0 rounded-full" />
                                                    <span className="flex-1 space-y-2">
                                                        <Bone className="h-2.5 w-3/4" />
                                                        <Bone className="h-2 w-1/3" />
                                                    </span>
                                                </>
                                            ) : (
                                                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.07 }} className="flex min-w-0 flex-1 items-center gap-3">
                                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--k-bg)] text-[11px] font-semibold text-[var(--k-muted)]">{client[0]}</span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-[13px] font-medium">{client}</span>
                                                        <span className="block text-[11px] text-[var(--k-muted)]">
                                                            {no} · {cur ? usd(amount) : inr(amount)}
                                                        </span>
                                                    </span>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS[status]}`}>{status}</span>
                                                </motion.div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        role="status"
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="absolute -bottom-5 left-1/2 flex w-[min(20rem,90%)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--k-line)] bg-[var(--k-surface)] p-3 shadow-[0_18px_40px_-18px_rgba(14,26,19,0.45)] sm:-right-5 sm:left-auto sm:translate-x-0"
                    >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--k-soft)] text-[var(--k-accent)]">
                            <ArrowDownLeft className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 text-[13px] leading-snug">
                            <span className="block font-semibold">₹48,000 from Tandoor Studio</span>
                            <span className="text-[var(--k-muted)]">Invoice #1042 paid by UPI</span>
                        </span>
                        <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-[var(--k-accent)]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
