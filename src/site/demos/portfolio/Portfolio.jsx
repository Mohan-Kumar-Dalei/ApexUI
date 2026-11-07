import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Check, Copy, RotateCw } from 'lucide-react';
import { BackPill, useFonts } from '../shared.jsx';
import { COMMITS, JOBS, NOTES, PERSON, PROJECTS, SECTIONS, STACK } from './data.js';
import { useClock, useScramble, useScrollSpy, useSlowLoad } from './hooks.js';

/*
 * Ishaan Mehra, frontend engineer. Direction: dark terminal paper.
 * Layout: split screen, a sticky identity column on the left and a scrolling work column on the right.
 * Loader: a terminal boot log. Skeleton: commit rows that shimmer while "GitHub" answers.
 * Signature: letters that scramble into place, and a project preview that follows the cursor.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap';
const vars = {
    '--p-bg': '#0E0F0C',
    '--p-panel': '#171914',
    '--p-ink': '#ECEAE0',
    '--p-muted': '#8C8D82',
    '--p-line': '#272922',
    '--p-accent': '#F2A541',
    fontFamily: '"Instrument Sans", system-ui, sans-serif',
};
const mono = { fontFamily: '"IBM Plex Mono", ui-monospace, monospace' };
const EASE = [0.16, 1, 0.3, 1];
const ids = SECTIONS.map(([id]) => id);

const CSS = `
.pf ::selection { background: var(--p-accent); color: var(--p-bg); }
@keyframes pf-sweep { from { transform: translateX(-100%); } to { transform: translateX(260%); } }
.pf-bone { position: relative; overflow: hidden; background: var(--p-panel); }
.pf-bone::after { content: ''; position: absolute; inset: 0; width: 40%; background: rgba(236, 234, 224, 0.06); animation: pf-sweep 1.2s ease-in-out infinite; }
@keyframes pf-blink { 50% { opacity: 0; } }
.pf-caret { animation: pf-blink 1s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) { .pf-bone::after, .pf-caret { animation: none; } }
`;

/* ---------- page loader: a short boot log, then the screen folds up ---------- */
const BOOT = ['> ssh ishaanmehra.dev', 'loading fonts ............ ok', 'reading 5 projects ....... ok', 'checking the kettle ...... ok', 'ready'];
function Boot({ onDone }) {
    const reduce = useReducedMotion();
    const [lines, setLines] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const done = useRef(onDone);
    useEffect(() => {
        if (reduce) return done.current();
        const timers = BOOT.map((_, i) => setTimeout(() => setLines(i + 1), 120 + i * 230));
        timers.push(setTimeout(() => setLeaving(true), 120 + BOOT.length * 230 + 250));
        return () => timers.forEach(clearTimeout);
    }, [reduce]);
    if (reduce) return null;
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-end bg-[var(--p-bg)] p-5 sm:p-10"
            style={mono}
            initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            animate={leaving ? { clipPath: 'inset(0% 0% 100% 0%)' } : undefined}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => leaving && done.current()}
        >
            <div className="w-full max-w-2xl text-[14px] leading-8 text-[var(--p-muted)] sm:text-lg sm:leading-9 lg:text-xl lg:leading-10">
                {BOOT.slice(0, lines).map((l, i) => (
                    <p key={l} className={i === 0 || l === 'ready' ? 'text-[var(--p-ink)]' : ''}>
                        {l.endsWith('ok') ? (
                            <>
                                {l.slice(0, -2)}
                                <span className="text-[var(--p-accent)]">ok</span>
                            </>
                        ) : (
                            l
                        )}
                    </p>
                ))}
                <span className="pf-caret inline-block h-[1.1em] w-[0.55em] translate-y-1 bg-[var(--p-accent)]" />
                <div className="mt-6 h-px w-full bg-[var(--p-line)]">
                    <motion.div className="h-px origin-left bg-[var(--p-accent)]" initial={{ scaleX: 0 }} animate={{ scaleX: lines / BOOT.length }} transition={{ duration: 0.3 }} />
                </div>
            </div>
        </motion.div>
    );
}

/* ---------- small pieces ---------- */
function ScrambleLink({ id, label, n, active, onClick }) {
    const [text, run] = useScramble(label);
    return (
        <a href={`#${id}`} onClick={onClick} onMouseEnter={run} onFocus={run} className="group flex items-center gap-4 py-1.5" aria-current={active ? 'true' : undefined}>
            <span className="text-[11px] text-[var(--p-muted)]" style={mono}>
                {String(n).padStart(2, '0')}
            </span>
            <span className={`h-px transition-all duration-500 ${active ? 'w-12 bg-[var(--p-accent)]' : 'w-5 bg-[var(--p-line)] group-hover:w-9 group-hover:bg-[var(--p-muted)]'}`} />
            <span className={`text-[13px] uppercase tracking-[0.14em] transition-colors ${active ? 'text-[var(--p-ink)]' : 'text-[var(--p-muted)] group-hover:text-[var(--p-ink)]'}`} style={mono}>
                {text}
            </span>
        </a>
    );
}

function Label({ children }) {
    return (
        <p className="mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--p-muted)] lg:sr-only" style={mono}>
            {children}
        </p>
    );
}

// The little interface drawn inside each project tile. Flat shapes only.
function Preview({ look, tone, className = '' }) {
    const ink = 'rgba(14,15,12,0.82)';
    const soft = 'rgba(14,15,12,0.16)';
    return (
        <div className={`relative overflow-hidden rounded-md ${className}`} style={{ background: tone }}>
            <div className="absolute inset-[9%] flex flex-col gap-[7%] rounded bg-[rgba(255,255,255,0.35)] p-[6%]">
                {look === 'chart' && (
                    <>
                        <div className="flex gap-[6%]">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-3 flex-1 rounded-sm" style={{ background: i ? soft : ink }} />
                            ))}
                        </div>
                        <div className="flex flex-1 items-end gap-[4%]">
                            {[40, 62, 48, 80, 66, 92, 74].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? ink : soft }} />
                            ))}
                        </div>
                    </>
                )}
                {look === 'steps' && (
                    <div className="flex flex-1 flex-col justify-center gap-[10%]">
                        <div className="flex items-center gap-[4%]">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex flex-1 items-center gap-[8%]">
                                    <div className="aspect-square w-[22%] rounded-full" style={{ background: i < 2 ? ink : soft }} />
                                    <div className="h-[3px] flex-1 rounded" style={{ background: i < 1 ? ink : soft }} />
                                </div>
                            ))}
                        </div>
                        <div className="h-3 w-3/4 rounded-sm" style={{ background: soft }} />
                        <div className="h-3 w-1/2 rounded-sm" style={{ background: soft }} />
                        <div className="mt-auto h-5 w-1/3 self-end rounded-full" style={{ background: ink }} />
                    </div>
                )}
                {look === 'code' &&
                    [70, 45, 85, 30, 60, 50, 75].map((w, i) => (
                        <div key={i} className="flex gap-[4%]" style={{ paddingLeft: `${[0, 6, 6, 12, 12, 6, 0][i]}%` }}>
                            <div className="h-2 rounded-sm" style={{ width: `${w * 0.3}%`, background: ink }} />
                            <div className="h-2 rounded-sm" style={{ width: `${w * 0.6}%`, background: soft }} />
                        </div>
                    ))}
                {look === 'calendar' && (
                    <div className="grid flex-1 grid-cols-7 gap-[3%]">
                        {Array.from({ length: 28 }, (_, i) => (
                            <div key={i} className="rounded-sm" style={{ background: [9, 10, 17, 23].includes(i) ? ink : soft }} />
                        ))}
                    </div>
                )}
                {look === 'grid' && (
                    <div className="grid flex-1 grid-cols-3 gap-[5%]">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="grid place-items-center rounded-sm" style={{ background: soft }}>
                                <div className={`${['h-1/3 w-2/3 rounded-full', 'h-1/2 w-1/2 rounded-sm', 'aspect-square w-1/3 rounded-full'][i % 3]}`} style={{ background: ink }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- work: rows, with a preview that trails the cursor on desktop ---------- */
function Work() {
    const [hover, setHover] = useState(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
    const move = (e) => {
        x.set(e.clientX + 24);
        y.set(e.clientY - 90);
    };
    return (
        <div onMouseMove={move} onMouseLeave={() => setHover(null)}>
            <ul className="border-t border-[var(--p-line)]">
                {PROJECTS.map((p, i) => (
                    <motion.li
                        key={p.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                        transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
                        onMouseEnter={() => setHover(i)}
                        className={`group border-b border-[var(--p-line)] py-7 transition-opacity duration-300 ${hover !== null && hover !== i ? 'lg:opacity-45' : ''}`}
                    >
                        <Preview look={p.look} tone={p.tone} className="mb-5 aspect-[16/10] w-full lg:hidden" />
                        <div className="lg:grid lg:grid-cols-[8.5rem_minmax(0,1fr)] lg:gap-7">
                            <Preview look={p.look} tone={p.tone} className="hidden aspect-[4/3] w-full self-start transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-[1.04] lg:block" />
                            <div>
                                <div className="flex items-baseline justify-between gap-4">
                                    <h3 className="text-[1.35rem] font-semibold tracking-[-0.01em] text-[var(--p-ink)] transition-transform duration-500 ease-out lg:group-hover:translate-x-2">{p.title}</h3>
                                    <span className="shrink-0 text-xs text-[var(--p-muted)]" style={mono}>
                                        {p.year}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-[var(--p-accent)]" style={mono}>
                                    {p.client}
                                </p>
                                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--p-muted)]">{p.text}</p>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {p.tags.map((t) => (
                                        <li key={t} className="rounded-full border border-[var(--p-line)] px-3 py-1 text-[11px] text-[var(--p-muted)]" style={mono}>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.li>
                ))}
            </ul>
            <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden w-64 lg:block" style={{ x: sx, y: sy }}>
                <AnimatePresence>
                    {hover !== null && (
                        <motion.div
                            key={hover}
                            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <Preview look={PROJECTS[hover].look} tone={PROJECTS[hover].tone} className="aspect-[16/10] w-64 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

/* ---------- activity: skeleton rows until the (pretend) request answers ---------- */
function Activity() {
    const ref = useRef(null);
    const seen = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
    const [{ loading, data }, reload] = useSlowLoad(COMMITS, 1400, seen);
    return (
        <div ref={ref}>
            <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm text-[var(--p-muted)]">Latest commits on public repos.</p>
                <button
                    type="button"
                    onClick={reload}
                    disabled={loading}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--p-line)] px-3.5 text-xs text-[var(--p-ink)] transition-colors hover:border-[var(--p-muted)] disabled:opacity-50"
                    style={mono}
                >
                    <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>
            <ul className="divide-y divide-[var(--p-line)] rounded-xl border border-[var(--p-line)]" aria-busy={loading}>
                {loading
                    ? COMMITS.map((_, i) => (
                          <li key={i} className="flex items-center gap-4 p-4 sm:p-5">
                              <span className="pf-bone h-8 w-8 shrink-0 rounded-md" />
                              <span className="flex-1 space-y-2.5">
                                  <span className="pf-bone block h-2.5 w-24 rounded" />
                                  <span className="pf-bone block h-3 rounded" style={{ width: `${[78, 64, 70, 56][i]}%` }} />
                              </span>
                              <span className="pf-bone hidden h-2.5 w-14 rounded sm:block" />
                          </li>
                      ))
                    : data.map(([repo, msg, when, diff], i) => (
                          <motion.li key={msg} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }} className="flex items-start gap-4 p-4 sm:p-5">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--p-panel)] text-[var(--p-accent)]">
                                  <Check className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                  <span className="block text-xs text-[var(--p-accent)]" style={mono}>
                                      {repo}
                                  </span>
                                  <span className="mt-1 block text-[15px] text-[var(--p-ink)]">{msg}</span>
                                  <span className="mt-1 block text-xs text-[var(--p-muted)] sm:hidden" style={mono}>
                                      {when}, {diff}
                                  </span>
                              </span>
                              <span className="hidden shrink-0 text-right text-xs leading-5 text-[var(--p-muted)] sm:block" style={mono}>
                                  {when}
                                  <br />
                                  {diff}
                              </span>
                          </motion.li>
                      ))}
            </ul>
        </div>
    );
}

function CopyEmail() {
    const [done, setDone] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(PERSON.email);
        } catch {
            /* clipboard blocked: the address is still on screen */
        }
        setDone(true);
        setTimeout(() => setDone(false), 1800);
    };
    return (
        <button
            type="button"
            onClick={copy}
            className="group mt-8 flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--p-line)] p-5 text-left transition-colors hover:border-[var(--p-accent)] sm:p-6"
        >
            <span className="min-w-0 break-all text-[clamp(1.05rem,3.6vw,1.6rem)] text-[var(--p-ink)]" style={mono}>
                {PERSON.email}
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 text-xs text-[var(--p-muted)] group-hover:text-[var(--p-accent)]" style={mono}>
                {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{done ? 'Copied' : 'Copy'}</span>
            </span>
        </button>
    );
}

/* ---------- page ---------- */
export default function Portfolio() {
    useFonts(FONTS);
    const [ready, setReady] = useState(false);
    const [menu, setMenu] = useState(false);
    const active = useScrollSpy(ids);
    const time = useClock('Asia/Kolkata');
    const [name] = useScramble(PERSON.name, { auto: ready, delay: 100 });

    useEffect(() => {
        document.title = 'Ishaan Mehra, frontend engineer';
    }, []);

    const go = (id) => (e) => {
        e.preventDefault();
        setMenu(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="pf min-h-dvh overflow-x-clip bg-[var(--p-bg)] text-[var(--p-ink)] antialiased" style={vars}>
            <style>{CSS}</style>
            {!ready && <Boot onDone={() => setReady(true)} />}

            {/* Phone and tablet bar */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--p-line)] bg-[var(--p-bg)]/90 backdrop-blur lg:hidden">
                <div className="flex h-14 items-center justify-between px-5 sm:px-8">
                    <a href="#about" onClick={go('about')} className="text-sm font-semibold">
                        Ishaan Mehra
                    </a>
                    <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="h-9 rounded-full border border-[var(--p-line)] px-4 text-xs uppercase tracking-[0.14em]" style={mono}>
                        {menu ? 'Close' : 'Menu'}
                    </button>
                </div>
                <AnimatePresence>
                    {menu && (
                        <motion.nav initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden border-t border-[var(--p-line)] bg-[var(--p-bg)]">
                            <ul className="px-5 py-4 sm:px-8">
                                {SECTIONS.map(([id, label], i) => (
                                    <motion.li key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                                        <a href={`#${id}`} onClick={go(id)} className="flex items-baseline gap-4 py-2.5">
                                            <span className="text-[11px] text-[var(--p-muted)]" style={mono}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className={`text-2xl font-semibold ${active === id ? 'text-[var(--p-accent)]' : ''}`}>{label}</span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            <div className="mx-auto grid max-w-[1320px] px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-12">
                {/* Identity column */}
                <aside className="pt-28 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:py-16">
                    <div>
                        <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} className="text-xs uppercase tracking-[0.18em] text-[var(--p-muted)]" style={mono}>
                            {PERSON.role}, {PERSON.city}
                        </motion.p>
                        <h1 className="mt-5 text-[clamp(2.9rem,12vw,4.6rem)] lg:text-[clamp(2.6rem,5.4vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]" aria-label={PERSON.name}>
                            <span aria-hidden="true">{name || ' '}</span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={ready ? { opacity: 1, y: 0 } : undefined}
                            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
                            className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-[var(--p-muted)]"
                        >
                            Interfaces that load fast, read clearly and work with a keyboard.
                        </motion.p>
                        <nav aria-label="Sections" className="mt-14 hidden lg:block">
                            {SECTIONS.map(([id, label], i) => (
                                <ScrambleLink key={id} id={id} label={label} n={i + 1} active={active === id} onClick={go(id)} />
                            ))}
                        </nav>
                    </div>
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 lg:mt-0">
                        <ul className="flex gap-5 text-sm">
                            {PERSON.links.map(([l, href]) => (
                                <li key={l}>
                                    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--p-muted)] transition-colors hover:text-[var(--p-ink)]">
                                        {l} <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="flex items-center gap-2 text-xs text-[var(--p-muted)]" style={mono}>
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--p-accent)]" /> Pune {time}
                        </p>
                    </div>
                </aside>

                {/* Scrolling column */}
                <main className="pb-24 lg:py-16">
                    <section id="about" className="scroll-mt-20 pt-16 lg:pt-0">
                        <Label>About</Label>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={ready ? { opacity: 1, y: 0 } : undefined}
                            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
                            className="text-[1.2rem] leading-[1.7] text-[var(--p-ink)] sm:text-[1.35rem]"
                        >
                            {PERSON.intro}
                        </motion.p>
                        <div className="mt-10 grid grid-cols-3 border-y border-[var(--p-line)]">
                            {[
                                ['8', 'years shipping'],
                                ['1.3s', 'best first load'],
                                ['2.4k', 'GitHub stars'],
                            ].map(([n, l], i) => (
                                <div key={l} className={`py-5 ${i ? 'border-l border-[var(--p-line)] pl-4 sm:pl-6' : ''}`}>
                                    <p className="text-[clamp(1.5rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">{n}</p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--p-muted)]" style={mono}>
                                        {l}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {STACK.map(([group, items]) => (
                                <div key={group}>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--p-accent)]" style={mono}>
                                        {group}
                                    </p>
                                    <ul className="mt-3 space-y-1.5 text-[15px] text-[var(--p-muted)]">
                                        {items.map((t) => (
                                            <li key={t}>{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="work" className="scroll-mt-20 pt-24 lg:pt-32">
                        <Label>Work</Label>
                        <Work />
                    </section>

                    <section id="activity" className="scroll-mt-20 pt-24 lg:pt-32">
                        <Label>Activity</Label>
                        <Activity />
                    </section>

                    <section id="experience" className="scroll-mt-20 pt-24 lg:pt-32">
                        <Label>Experience</Label>
                        <ol className="relative border-l border-[var(--p-line)] pl-6 sm:pl-8">
                            {JOBS.map(([when, role, company, city], i) => (
                                <motion.li
                                    key={when}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                                    className="relative pb-10 last:pb-0"
                                >
                                    <span className={`absolute -left-[calc(1.5rem+4.5px)] top-1.5 h-2 w-2 rounded-full sm:-left-[calc(2rem+4.5px)] ${i ? 'bg-[var(--p-line)]' : 'bg-[var(--p-accent)]'}`} />
                                    <p className="text-xs text-[var(--p-muted)]" style={mono}>
                                        {when}
                                    </p>
                                    <p className="mt-1.5 text-lg font-semibold">{role}</p>
                                    <p className="text-[15px] text-[var(--p-muted)]">
                                        {company}, {city}
                                    </p>
                                </motion.li>
                            ))}
                        </ol>
                    </section>

                    <section id="writing" className="scroll-mt-20 pt-24 lg:pt-32">
                        <Label>Writing</Label>
                        <ul className="border-t border-[var(--p-line)]">
                            {NOTES.map(([title, date, read]) => (
                                <li key={title} className="border-b border-[var(--p-line)]">
                                    <a href="#writing" className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                                        <span className="text-[1.05rem] text-[var(--p-ink)] decoration-[var(--p-accent)] underline-offset-[6px] group-hover:underline">{title}</span>
                                        <span className="shrink-0 text-xs text-[var(--p-muted)]" style={mono}>
                                            {date}, {read}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section id="contact" className="scroll-mt-20 pt-24 lg:pt-32">
                        <Label>Contact</Label>
                        <h2 className="max-w-lg text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Have a product that feels slow? I would like to hear about it.</h2>
                        <p className="mt-4 max-w-md text-[var(--p-muted)]">Open to one project from July. I reply within two working days.</p>
                        <CopyEmail />
                    </section>

                    <footer className="mt-24 flex flex-col gap-2 border-t border-[var(--p-line)] pt-6 text-xs text-[var(--p-muted)] sm:flex-row sm:justify-between" style={mono}>
                        <span>Built with React and too much coffee.</span>
                        <span>© 2025 Ishaan Mehra</span>
                    </footer>
                </main>
            </div>
            <BackPill />
        </div>
    );
}
