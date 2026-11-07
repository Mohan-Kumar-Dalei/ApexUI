import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BackPill, photo, useFonts } from '../shared.jsx';
import { Parallax } from '../motion.jsx';
import { COURSES, NAV, STORY, img } from './content.js';
import Reserve from './Reserve.jsx';

/*
 * Hinoki, an omakase counter. Direction: lacquer dark, warm ivory type, one vermilion accent.
 * Layout: cinematic and centred; a pinned horizontal run of courses on desktop.
 * Loader: an ensō brush circle draws itself, then the screen parts in two.
 * Skeleton: seatings shimmer while availability "loads" for the chosen day.
 * Signature: the story lights up word by word as you read it.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500&display=swap';
const vars = {
    '--h-bg': '#0F0D0B',
    '--h-panel': '#1A1714',
    '--h-ink': '#EFE7DA',
    '--h-muted': '#9C9183',
    '--h-line': '#2E2823',
    '--h-accent': '#B8402A',
    fontFamily: '"Manrope", system-ui, sans-serif',
};
const serif = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400 };
const EASE = [0.16, 1, 0.3, 1];
const SPLIT = [0.76, 0, 0.24, 1];

const CSS = `
.hk ::selection { background: var(--h-accent); color: var(--h-ink); }
@keyframes hk-sweep { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
.hk-bar { position: relative; overflow: hidden; background: var(--h-panel); }
.hk-bar::after { content: ''; position: absolute; inset: 0; width: 35%; background: rgba(239, 231, 218, 0.07); animation: hk-sweep 1.4s ease-in-out infinite; }
.hk-row::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) { .hk-bar::after { animation: none; } }
`;

/* ---------- loader: the ensō draws, the name settles, the screen parts ---------- */
function Enso({ onDone }) {
    const reduce = useReducedMotion();
    const done = useRef(onDone);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (reduce) return done.current();
        const a = setTimeout(() => setOpen(true), 1900);
        const b = setTimeout(() => done.current(), 2900);
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        };
    }, [reduce]);
    if (reduce) return null;
    return (
        <div className="fixed inset-0 z-[100]" aria-hidden="true">
            <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-[var(--h-bg)]" animate={open ? { y: '-100%' } : undefined} transition={{ duration: 1, ease: SPLIT }} />
            <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--h-bg)]" animate={open ? { y: '100%' } : undefined} transition={{ duration: 1, ease: SPLIT }} />
            <motion.div className="absolute inset-0 grid place-items-center" animate={open ? { opacity: 0, scale: 0.96 } : undefined} transition={{ duration: 0.4 }}>
                <div className="relative grid place-items-center">
                    <svg viewBox="0 0 120 120" className="h-56 w-56 sm:h-72 sm:w-72" fill="none">
                        <motion.path
                            d="M96 32 C 84 16, 52 10, 34 26 C 14 44, 18 82, 46 96 C 70 108, 102 94, 104 64 C 105 52, 101 42, 96 36"
                            stroke="var(--h-accent)"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0.2 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
                        />
                    </svg>
                    <motion.span className="absolute text-[1.5rem] uppercase text-[var(--h-ink)] sm:text-[1.9rem]" style={serif} initial={{ opacity: 0, letterSpacing: '0.7em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.3, ease: EASE, delay: 0.55 }}>
                        Hinoki
                    </motion.span>
                </div>
            </motion.div>
        </div>
    );
}

/* ---------- navigation: quiet bar, full-screen menu with image previews ---------- */
function Nav({ ready }) {
    const [open, setOpen] = useState(false);
    const [solid, setSolid] = useState(false);
    const [hover, setHover] = useState(0);
    useEffect(() => {
        const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        const esc = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', esc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', esc);
        };
    }, [open]);
    const go = (id) => (e) => {
        e.preventDefault();
        setOpen(false);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), open ? 450 : 0);
    };
    const previews = [img.table, img.nigiri, img.knife, img.bar, img.platter];
    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -12 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1, ease: EASE, delay: 0.6 }}
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${solid && !open ? 'border-b border-[var(--h-line)] bg-[var(--h-bg)]/92 backdrop-blur' : 'bg-transparent'}`}
            >
                <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-3 items-center px-5 sm:h-20 sm:px-10">
                    <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="hk-menu" className="group flex items-center gap-3 justify-self-start text-[12px] uppercase tracking-[0.2em] text-[var(--h-ink)]">
                        <span className="relative h-3 w-6">
                            <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                            <span className={`absolute left-0 h-px bg-current transition-all duration-500 ${open ? 'top-1.5 w-6 -rotate-45' : 'top-3 w-4 group-hover:w-6'}`} />
                        </span>
                        <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
                    </button>
                    <a href="#top" onClick={go('top')} className="justify-self-center text-[1.3rem] uppercase tracking-[0.32em] text-[var(--h-ink)] sm:text-[1.5rem]" style={serif}>
                        Hinoki
                    </a>
                    <a href="#reserve" onClick={go('reserve')} className="justify-self-end border-b border-[var(--h-accent)] pb-1 text-[12px] uppercase tracking-[0.2em] text-[var(--h-ink)]">
                        Reserve
                    </a>
                </div>
            </motion.header>
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="hk-menu"
                        className="fixed inset-0 z-40 bg-[var(--h-bg)]"
                        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                        exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                        transition={{ duration: 0.8, ease: SPLIT }}
                    >
                        <div className="mx-auto grid h-full max-w-[1440px] items-center gap-10 px-5 pb-10 pt-24 sm:px-10 lg:grid-cols-2">
                            <nav aria-label="Main">
                                <ul>
                                    {NAV.map(([label, id], i) => (
                                        <li key={id} className="overflow-hidden">
                                            <motion.a
                                                href={`#${id}`}
                                                onClick={go(id)}
                                                onMouseEnter={() => setHover(i)}
                                                onFocus={() => setHover(i)}
                                                initial={{ y: '105%' }}
                                                animate={{ y: '0%' }}
                                                transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.06 }}
                                                className="group flex items-baseline gap-5 py-1"
                                            >
                                                <span className="w-6 text-xs text-[var(--h-muted)]">0{i + 1}</span>
                                                <span className={`text-[clamp(2.6rem,7vw,5rem)] leading-[1.05] transition-colors duration-500 ${hover === i ? 'text-[var(--h-ink)]' : 'text-[var(--h-muted)]'}`} style={serif}>
                                                    {label}
                                                </span>
                                            </motion.a>
                                        </li>
                                    ))}
                                </ul>
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 text-sm leading-relaxed text-[var(--h-muted)]">
                                    14 Chapel Road, Bandra West, Mumbai
                                    <br />
                                    Tuesday to Sunday, seatings at 6:30 and 9:00 pm
                                </motion.p>
                            </nav>
                            <div className="relative hidden aspect-[4/5] max-h-[70vh] justify-self-end overflow-hidden lg:block lg:w-[80%]">
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={hover}
                                        src={photo(previews[hover], 900)}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover"
                                        initial={{ opacity: 0, scale: 1.08 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.9, ease: EASE }}
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ---------- story: words light up as they pass the reading line ---------- */
function Word({ progress, range, children }) {
    const opacity = useTransform(progress, range, [0.16, 1]);
    return <motion.span style={{ opacity }}>{children} </motion.span>;
}
function LitText({ text }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
    const words = text.split(' ');
    return (
        <p ref={ref} className="text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.18] text-[var(--h-ink)]" style={serif}>
            {reduce ? text : words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
        </p>
    );
}

/* ---------- courses: pinned sideways run on desktop, swipe row on phones ---------- */
function CourseCard({ c, className = '' }) {
    return (
        <article className={className}>
            <div className="aspect-[3/4] overflow-hidden bg-[var(--h-panel)]">
                <img src={photo(c.id, 900)} alt={`${c.name}: ${c.note}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.04]" />
            </div>
            <div className="mt-5 flex items-baseline gap-4">
                <span className="text-xs text-[var(--h-accent)]">{c.n}</span>
                <h3 className="text-[1.9rem] leading-none" style={serif}>
                    {c.name}
                </h3>
            </div>
            <p className="mt-2 pl-8 text-[15px] text-[var(--h-muted)]">{c.note}</p>
        </article>
    );
}

function Courses() {
    const ref = useRef(null);
    const track = useRef(null);
    const [dist, setDist] = useState(0);
    useLayoutEffect(() => {
        const measure = () => setDist(track.current ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0);
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
    const intro = (
        <div className="shrink-0 lg:w-[30rem] lg:pr-10">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--h-muted)]">Tonight</p>
            <h2 className="mt-5 text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.95]" style={serif}>
                Six courses, <em>one counter</em>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-[var(--h-muted)]">The menu follows the fish. This is what Kenji is serving this week. ₹9,500 a guest, sake pairing ₹4,500.</p>
        </div>
    );
    return (
        <section id="courses" className="scroll-mt-16 border-t border-[var(--h-line)]">
            {/* Desktop: vertical scroll drives the row sideways */}
            <div ref={ref} className="relative hidden lg:block" style={{ height: `calc(100vh + ${dist}px)` }}>
                <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
                    <motion.div ref={track} style={{ x }} className="flex w-max items-end gap-10 px-10 xl:px-16">
                        {intro}
                        {COURSES.map((c) => (
                            <CourseCard key={c.n} c={c} className="w-[min(24rem,30vw)] shrink-0" />
                        ))}
                    </motion.div>
                    <div className="absolute inset-x-10 bottom-10 h-px bg-[var(--h-line)] xl:inset-x-16">
                        <motion.div className="h-px origin-left bg-[var(--h-ink)]" style={{ scaleX: scrollYProgress }} />
                    </div>
                </div>
            </div>
            {/* Phones and tablets: a swipe row */}
            <div className="py-24 sm:py-32 lg:hidden">
                <div className="px-5 sm:px-10">{intro}</div>
                <div className="hk-row mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:scroll-px-10 sm:px-10">
                    {COURSES.map((c) => (
                        <CourseCard key={c.n} c={c} className="w-[78vw] max-w-[22rem] shrink-0 snap-start" />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- page ---------- */
export default function Hinoki() {
    useFonts(FONTS);
    const reduce = useReducedMotion();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        document.title = 'Hinoki, omakase in Bandra';
    }, []);
    const rise = (delay) => ({ initial: { opacity: 0, y: 30 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 1.2, ease: EASE, delay } });
    const reveal = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -12% 0px' }, transition: { duration: 1.1, ease: EASE } };

    return (
        <div id="top" className="hk min-h-dvh overflow-x-clip bg-[var(--h-bg)] text-[var(--h-ink)] antialiased" style={vars}>
            <style>{CSS}</style>
            {!ready && <Enso onDone={() => setReady(true)} />}
            <Nav ready={ready} />

            {/* Hero */}
            <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden">
                <motion.img
                    src={photo(img.hero, 2000)}
                    alt="Nigiri laid out on a black slate"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={reduce ? false : { scale: 1.2 }}
                    animate={ready ? { scale: 1 } : undefined}
                    transition={{ duration: 3, ease: EASE }}
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-10 sm:pb-20">
                    <motion.p {...rise(0.2)} className="text-[11px] uppercase tracking-[0.26em] text-[var(--h-ink)]/80">
                        Omakase, Bandra West
                    </motion.p>
                    <h1 className="mt-5 max-w-4xl text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.01em]" style={serif}>
                        {['Twelve seats,', 'one long evening'].map((l, i) => (
                            <span key={l} className="block overflow-hidden pb-[0.06em]">
                                <motion.span className="block" initial={reduce ? false : { y: '105%' }} animate={ready ? { y: '0%' } : undefined} transition={{ duration: 1.3, ease: EASE, delay: 0.3 + i * 0.12 }}>
                                    {i ? <em>{l}</em> : l}
                                </motion.span>
                            </span>
                        ))}
                    </h1>
                    <motion.div {...rise(0.7)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <a href="#reserve" className="inline-flex h-14 items-center gap-3 bg-[var(--h-ink)] px-7 text-[12px] uppercase tracking-[0.2em] text-[var(--h-bg)] transition-colors duration-500 hover:bg-[var(--h-accent)] hover:text-[var(--h-ink)]">
                            Reserve a seat <ArrowRight className="h-4 w-4" />
                        </a>
                        <span className="text-sm text-[var(--h-ink)]/80">Two seatings, Tuesday to Sunday</span>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section id="story" className="scroll-mt-16 mx-auto max-w-[1440px] px-5 py-28 sm:px-10 sm:py-40 lg:py-48">
                <p className="mb-10 text-[11px] uppercase tracking-[0.24em] text-[var(--h-muted)]">The counter</p>
                <div className="max-w-5xl">
                    <LitText text={STORY} />
                </div>
            </section>

            <Courses />

            {/* Chef */}
            <section id="chef" className="scroll-mt-16 mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-28 sm:px-10 sm:py-40 lg:grid-cols-12 lg:gap-16 lg:py-48">
                <Parallax src={photo(img.knife, 1400)} alt="Chef slicing fish at the counter" strength={10} className="aspect-[4/5] lg:col-span-6" />
                <motion.div {...reveal} className="lg:col-span-5 lg:col-start-8">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--h-muted)]">The chef</p>
                    <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.98]" style={serif}>
                        Kenji Arai trained eleven years in Ginza before he came to Mumbai.
                    </h2>
                    <p className="mt-6 max-w-md leading-relaxed text-[var(--h-muted)]">
                        He seasons the rice with red vinegar, serves it at body temperature and changes the menu when the boats change their catch. Ask him about the knives. He will talk for a while.
                    </p>
                </motion.div>
            </section>

            {/* Pairing band */}
            <section className="relative overflow-hidden">
                <Parallax src={photo(img.whisky, 2000)} alt="Whisky poured over a clear ice sphere" strength={14} className="absolute inset-0" />
                <div className="absolute inset-0 bg-black/55" />
                <motion.div {...reveal} className="relative mx-auto max-w-[1440px] px-5 py-32 sm:px-10 sm:py-44">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--h-ink)]/75">To drink</p>
                    <h2 className="mt-5 max-w-2xl text-[clamp(2.4rem,5vw,4.2rem)] leading-[1]" style={serif}>
                        Sake chosen course by course, and a short list of Japanese whisky.
                    </h2>
                    <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-white/20 pt-6 text-sm">
                        <div>
                            <dt className="text-[var(--h-ink)]/70">Sake pairing</dt>
                            <dd className="mt-1 text-2xl" style={serif}>
                                ₹4,500
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[var(--h-ink)]/70">Whisky flight, three pours</dt>
                            <dd className="mt-1 text-2xl" style={serif}>
                                ₹3,800
                            </dd>
                        </div>
                    </dl>
                </motion.div>
            </section>

            {/* Reserve */}
            <section id="reserve" className="scroll-mt-16 mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-10 sm:py-40 lg:grid-cols-12 lg:py-48">
                <motion.div {...reveal} className="min-w-0 lg:col-span-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--h-muted)]">Reserve</p>
                    <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95]" style={serif}>
                        Book a seat at the counter
                    </h2>
                    <p className="mt-6 max-w-sm leading-relaxed text-[var(--h-muted)]">Seats open thirty days ahead at noon. We hold a booking for fifteen minutes after the seating starts.</p>
                </motion.div>
                <div className="min-w-0 lg:col-span-7 lg:col-start-6">
                    <Reserve serif={serif} />
                </div>
            </section>

            {/* Visit */}
            <section id="visit" className="scroll-mt-16 border-t border-[var(--h-line)]">
                <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:grid-cols-3 sm:px-10 sm:py-28">
                    {[
                        ['Find us', '14 Chapel Road, Bandra West, Mumbai 400050. Five minutes on foot from Mount Carmel Church.'],
                        ['Hours', 'Tuesday to Sunday. Seatings at 6:30 and 9:00 pm. Closed on Mondays.'],
                        ['Good to know', 'Tell us about allergies when you book. Children over twelve are welcome. No dress code.'],
                    ].map(([t, d], i) => (
                        <motion.div key={t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                            <h3 className="text-[1.8rem]" style={serif}>
                                {t}
                            </h3>
                            <p className="mt-3 leading-relaxed text-[var(--h-muted)]">{d}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="overflow-hidden border-t border-[var(--h-line)]">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 pt-10 text-sm text-[var(--h-muted)] sm:flex-row sm:justify-between sm:px-10">
                    <span>+91 22 4000 1212, table@hinoki.in</span>
                    <span className="flex gap-6">
                        <a href="#top" className="hover:text-[var(--h-ink)]">
                            Instagram
                        </a>
                        <a href="#top" className="hover:text-[var(--h-ink)]">
                            Gift a dinner
                        </a>
                    </span>
                </div>
                <p className="mt-6 select-none text-center text-[22vw] uppercase leading-[0.72] tracking-[0.08em] text-[var(--h-panel)]" style={serif} aria-hidden="true">
                    Hinoki
                </p>
            </footer>
            <BackPill />
        </div>
    );
}
