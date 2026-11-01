import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Compass, Home, Pause, Play, User, Wind, X } from 'lucide-react';
import { BackPill, Container, Section, photo, useFonts } from './shared.jsx';
import { Counter, EASE, Intro, Lines, Reveal, useIntroDelay } from './motion.jsx';

/* Stillwater: a meditation app and its landing page. Direction: custom, calm pine. */

const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Instrument+Sans:wght@400;500;600&display=swap';
const vars = {
    '--d-bg': '#F4F2EE',
    '--d-surface': '#E9E6E0',
    '--d-ink': '#1B1D1C',
    '--d-muted': '#6B6F6B',
    '--d-line': '#DCD8D0',
    '--d-accent': '#2F4A3E',
    fontFamily: '"Instrument Sans", system-ui, sans-serif',
};
const display = { fontFamily: '"Newsreader", Georgia, serif', fontWeight: 400 };

const SESSIONS = [
    { title: 'Morning arrival', mins: 10, kind: 'Breath', img: 'photo-1506126613408-eca07ce68773' },
    { title: 'Walking slowly', mins: 15, kind: 'Movement', img: 'photo-1464822759023-fed622ff2c3b' },
    { title: 'Before sleep', mins: 20, kind: 'Body scan', img: 'photo-1505144808419-1957a94ca61e' },
];

const TOPICS = [
    ['Sleep', 'photo-1505144808419-1957a94ca61e'],
    ['Focus', 'photo-1470770841072-f978cf4d019e'],
    ['Stress', 'photo-1499209974431-9dddcece7f88'],
    ['Movement', 'photo-1544367567-0f2fcb009e0b'],
];

/* The app inside the phone. */
function PhoneApp({ initial = 'today' }) {
    const [tab, setTab] = useState(initial);
    const [player, setPlayer] = useState(initial === 'player' ? SESSIONS[0] : null);
    const [playing, setPlaying] = useState(false);
    const [secs, setSecs] = useState(0);

    useEffect(() => {
        if (!playing) return undefined;
        const id = setInterval(() => setSecs((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [playing]);

    const open = (s) => {
        setPlayer(s);
        setSecs(0);
        setPlaying(true);
    };
    const total = (player?.mins ?? 10) * 60;
    const left = Math.max(0, total - secs);
    const mm = String(Math.floor(left / 60)).padStart(2, '0');
    const ss = String(left % 60).padStart(2, '0');

    const tabs = [
        ['today', 'Today', Home],
        ['explore', 'Explore', Compass],
        ['profile', 'You', User],
    ];

    return (
        <div className="relative flex h-full flex-col bg-[var(--d-bg)] text-[var(--d-ink)]">
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-10 [scrollbar-width:none]">
                {tab === 'today' && (
                    <>
                        <p className="text-[11px] text-[var(--d-muted)]">Thursday, 12 March</p>
                        <h3 className="mt-1 text-[26px] leading-[1.05]" style={display}>
                            Good morning
                        </h3>
                        <button onClick={() => open(SESSIONS[0])} className="relative mt-4 block aspect-[4/3] w-full overflow-hidden rounded-[14px] text-left">
                            <img src={photo(SESSIONS[0].img, 700)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                            <span className="absolute inset-0 bg-black/30" />
                            <span className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="block text-[10px] opacity-80">Today's practice, {SESSIONS[0].mins} min</span>
                                <span className="mt-0.5 block text-[18px] leading-tight" style={display}>
                                    {SESSIONS[0].title}
                                </span>
                            </span>
                            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-black">
                                <Play className="h-3.5 w-3.5 translate-x-px" fill="currentColor" />
                            </span>
                        </button>
                        <div className="mt-4 grid grid-cols-3 rounded-[12px] border border-[var(--d-line)] py-2.5 text-center">
                            {[
                                ['6', 'day streak'],
                                ['142', 'minutes'],
                                ['18', 'sessions'],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <p className="text-[17px] tabular-nums" style={display}>
                                        {n}
                                    </p>
                                    <p className="text-[9px] text-[var(--d-muted)]">{l}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-[12px] font-semibold">Short and good</p>
                        <ul className="mt-1">
                            {SESSIONS.slice(1).map((s) => (
                                <li key={s.title}>
                                    <button onClick={() => open(s)} className="flex w-full items-center gap-3 border-b border-[var(--d-line)] py-2.5 text-left">
                                        <img src={photo(s.img, 160)} alt="" className="h-10 w-10 shrink-0 rounded-[8px] object-cover" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[12px]">{s.title}</span>
                                            <span className="block text-[10px] text-[var(--d-muted)]">
                                                {s.kind}, {s.mins} min
                                            </span>
                                        </span>
                                        <Play className="h-3.5 w-3.5 text-[var(--d-muted)]" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {tab === 'explore' && (
                    <>
                        <h3 className="text-[26px] leading-[1.05]" style={display}>
                            Explore
                        </h3>
                        <div className="mt-3 rounded-[10px] bg-[var(--d-surface)] px-3 py-2.5 text-[11px] text-[var(--d-muted)]">Search sessions and teachers</div>
                        <div className="mt-4 grid grid-cols-2 gap-2.5">
                            {TOPICS.map(([t, img]) => (
                                <button key={t} onClick={() => open({ title: `${t}, a first session`, mins: 10, kind: t, img })} className="relative aspect-square overflow-hidden rounded-[12px] text-left">
                                    <img src={photo(img, 360)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                    <span className="absolute inset-0 bg-black/30" />
                                    <span className="absolute bottom-2 left-2.5 text-[14px] text-white" style={display}>
                                        {t}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
                {tab === 'profile' && (
                    <>
                        <h3 className="text-[26px] leading-[1.05]" style={display}>
                            You
                        </h3>
                        <p className="mt-1 text-[11px] text-[var(--d-muted)]">Practising since January</p>
                        <div className="mt-4 rounded-[12px] border border-[var(--d-line)] p-3">
                            <p className="text-[11px] text-[var(--d-muted)]">This week</p>
                            <div className="mt-2 flex h-16 items-end gap-1.5">
                                {[30, 55, 20, 70, 45, 85, 60].map((h, i) => (
                                    <span key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i === 5 ? 'var(--d-accent)' : 'var(--d-line)' }} />
                                ))}
                            </div>
                        </div>
                        <ul className="mt-4 divide-y divide-[var(--d-line)] border-y border-[var(--d-line)] text-[12px]">
                            {[
                                ['Daily reminder', '7:30 am'],
                                ['Session length', '10 min'],
                                ['Background sound', 'Rain'],
                                ['Download for offline', 'On'],
                            ].map(([a, b]) => (
                                <li key={a} className="flex justify-between py-2.5">
                                    <span>{a}</span>
                                    <span className="text-[var(--d-muted)]">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* Tab bar */}
            <nav className="border-t border-[var(--d-line)] bg-[var(--d-bg)] pb-3">
                <ul className="grid grid-cols-3">
                    {tabs.map(([id, label, Icon]) => {
                        const on = tab === id;
                        return (
                            <li key={id}>
                                <button onClick={() => setTab(id)} aria-current={on ? 'page' : undefined} className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 text-[9px] ${on ? 'text-[var(--d-ink)]' : 'text-[var(--d-muted)]'}`}>
                                    <Icon className="h-[18px] w-[18px]" strokeWidth={on ? 2 : 1.5} />
                                    {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Player sheet */}
            <div className={`absolute inset-0 flex flex-col bg-[var(--d-accent)] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${player ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!player}>
                {player && (
                    <>
                        <div className="relative h-[46%] shrink-0">
                            <img src={photo(player.img, 700)} alt="" className="h-full w-full object-cover" />
                            <span className="absolute inset-0 bg-black/20" />
                            <button
                                onClick={() => {
                                    setPlaying(false);
                                    setPlayer(null);
                                }}
                                aria-label="Close player"
                                className="absolute right-3 top-9 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-black"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col items-center px-5 pt-5 text-center">
                            <p className="text-[10px] opacity-70">
                                {player.kind}, {player.mins} min
                            </p>
                            <p className="mt-1 text-[22px] leading-tight" style={display}>
                                {player.title}
                            </p>
                            <p className="mt-4 text-[34px] tabular-nums" style={display}>
                                {mm}:{ss}
                            </p>
                            <div className="mt-3 h-[2px] w-full overflow-hidden bg-white/20">
                                <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${(secs / total) * 100}%` }} />
                            </div>
                            <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'} className="mt-5 grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--d-accent)] transition-transform active:scale-95">
                                {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* The signature: a circle that breathes, four seconds in and four seconds out. */
function Breathe() {
    const reduce = useReducedMotion();
    const [inhale, setInhale] = useState(true);
    useEffect(() => {
        if (reduce) return undefined;
        const id = setInterval(() => setInhale((v) => !v), 4000);
        return () => clearInterval(id);
    }, [reduce]);
    return (
        <section className="relative overflow-hidden bg-[var(--d-accent)] py-24 text-white sm:py-32">
            <Container className="grid items-center gap-14 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <Lines text="Try one breath with us" className="text-[42px] leading-[1.02] sm:text-[64px]" style={display} />
                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-sm text-[18px] leading-relaxed opacity-80">Follow the circle. In while it grows, out while it falls back. That is most of what the first session asks of you.</p>
                    </Reveal>
                </div>
                <div className="grid place-items-center lg:col-span-7">
                    <div className="relative grid aspect-square w-[min(440px,82vw)] place-items-center">
                        <span className="absolute inset-0 rounded-full border border-white/20" />
                        <span className="absolute inset-[16%] rounded-full border border-white/15" />
                        <motion.span className="absolute inset-[24%] rounded-full bg-white/10" animate={reduce ? undefined : { scale: inhale ? 1.5 : 1 }} transition={{ duration: 4, ease: [0.45, 0, 0.55, 1] }} />
                        <motion.span className="absolute inset-[33%] rounded-full bg-white" animate={reduce ? undefined : { scale: inhale ? 1.45 : 1 }} transition={{ duration: 4, ease: [0.45, 0, 0.55, 1] }} />
                        <span className="relative text-[22px] text-[var(--d-accent)] sm:text-[26px]" style={display}>
                            {inhale ? 'Breathe in' : 'Breathe out'}
                        </span>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* Hero phone: rises on load, floats, and leans toward the pointer on desktop. */
function HeroPhone({ delay }) {
    const reduce = useReducedMotion();
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 120, damping: 16 });
    const sry = useSpring(ry, { stiffness: 120, damping: 16 });
    return (
        <div
            className="[perspective:1200px]"
            onPointerMove={(e) => {
                if (e.pointerType !== 'mouse' || reduce) return;
                const r = e.currentTarget.getBoundingClientRect();
                ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
                rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
            }}
            onPointerLeave={() => {
                rx.set(0);
                ry.set(0);
            }}
        >
            <motion.div initial={reduce ? false : { opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: delay + 0.2 }}>
                <motion.div style={{ rotateX: srx, rotateY: sry }} animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}>
                    <Phone>
                        <PhoneApp />
                    </Phone>
                </motion.div>
            </motion.div>
        </div>
    );
}

/* Three phones; the middle one drifts against the scroll on desktop. */
function Screens() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const up = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const down = useTransform(scrollYProgress, [0, 1], [-20, 30]);
    const list = [
        ['today', 'Today', 'One practice chosen for you, and a few short ones if you have time.'],
        ['explore', 'Explore', 'Sleep, focus, stress and movement. Every session works offline.'],
        ['profile', 'You', 'Your week at a glance, reminders and sounds. No badges.'],
    ];
    return (
        <Section id="screens" className="bg-[var(--d-surface)]">
            <Container>
                <Lines text="Three screens, and that is the whole app" className="max-w-3xl text-[40px] leading-[1.05] sm:text-[60px]" style={display} />
                <div ref={ref} className="-mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pt-10">
                    {list.map(([id, t, b], i) => (
                        <Reveal as="figure" key={id} delay={i * 0.12} className="w-[min(300px,78vw)] shrink-0 snap-center lg:w-auto">
                            <motion.div style={reduce ? undefined : { y: i === 1 ? up : down }}>
                                <Phone className="lg:w-[min(280px,100%)]">
                                    <PhoneApp initial={id} />
                                </Phone>
                            </motion.div>
                            <figcaption className="mx-auto mt-6 max-w-[300px]">
                                <p className="text-[22px]" style={display}>
                                    {t}
                                </p>
                                <p className="mt-1 text-[15px] text-[var(--d-muted)]">{b}</p>
                            </figcaption>
                        </Reveal>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

/* A phone outline that scales with the screen. */
function Phone({ children, className = '' }) {
    return (
        <div className={`relative mx-auto aspect-[9/19] w-[min(300px,78vw)] rounded-[44px] border-[9px] border-[#1B1D1C] bg-[#1B1D1C] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] ${className}`}>
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1B1D1C]" />
            <div className="h-full overflow-hidden rounded-[35px]">{children}</div>
        </div>
    );
}

export default function AppDemo() {
    useFonts(FONTS);
    const wait = useIntroDelay('Stillwater');
    return (
        <div style={vars} className="min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[16px] text-[var(--d-ink)] antialiased">
            <Intro name="Stillwater" bg="#2F4A3E" fg="#F4F2EE" font={display} />

            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
                <Container className="flex h-16 items-center justify-between sm:h-20">
                    <a href="#top" className="flex items-center gap-2 text-[22px]" style={display}>
                        <Wind className="h-5 w-5" strokeWidth={1.5} /> Stillwater
                    </a>
                    <nav className="hidden items-center gap-8 text-[15px] md:flex">
                        <a href="#how" className="text-[var(--d-muted)] hover:text-[var(--d-ink)]">
                            How it works
                        </a>
                        <a href="#screens" className="text-[var(--d-muted)] hover:text-[var(--d-ink)]">
                            The app
                        </a>
                        <a href="#price" className="text-[var(--d-muted)] hover:text-[var(--d-ink)]">
                            Price
                        </a>
                    </nav>
                    <a href="#get" className="rounded-full bg-[var(--d-accent)] px-5 py-2.5 text-[14px] font-medium text-white">
                        Get the app
                    </a>
                </Container>
            </header>

            {/* Hero with the live app */}
            <Section id="top" className="pt-12 sm:pt-16">
                <Container className="grid items-center gap-14 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Lines as="h1" onMount delay={wait} text="Ten quiet minutes, every morning" className="text-[48px] leading-[1] sm:text-[76px] lg:text-[92px]" style={display} />
                        <Reveal delay={wait + 0.45}>
                            <p className="mt-6 max-w-md text-[18px] leading-relaxed text-[var(--d-muted)]">
                                Short guided sessions for breath, sleep and focus, recorded by teachers who have practised for decades. No streak pressure, no feed.
                            </p>
                        </Reveal>
                        <Reveal id="get" delay={wait + 0.55} className="mt-9 flex flex-wrap gap-3">
                            <a href="#top" className="rounded-full bg-[var(--d-ink)] px-6 py-3.5 text-[14px] font-medium text-white">
                                Download for iPhone
                            </a>
                            <a href="#top" className="rounded-full border border-[var(--d-ink)] px-6 py-3.5 text-[14px] font-medium">
                                Get it on Android
                            </a>
                        </Reveal>
                        <Reveal delay={wait + 0.65}>
                            <p className="mt-5 text-[14px] text-[var(--d-muted)]">Try the app on the right. Tap a session to start it.</p>
                        </Reveal>
                        <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--d-line)] pt-6">
                            {[
                                [312, '', 'sessions'],
                                [41, '', 'teachers'],
                                [12, ' min', 'average session'],
                            ].map(([n, sfx, l]) => (
                                <div key={l}>
                                    <dt className="text-[30px] leading-none" style={display}>
                                        <Counter to={n} suffix={sfx} />
                                    </dt>
                                    <dd className="mt-1 text-[13px] text-[var(--d-muted)]">{l}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <div className="lg:col-span-6">
                        <HeroPhone delay={wait} />
                    </div>
                </Container>
            </Section>

            {/* How it works */}
            <Section id="how" className="border-t border-[var(--d-line)]">
                <Container className="grid gap-10 lg:grid-cols-12">
                    <Lines text="How a morning goes" className="text-[40px] leading-[1.05] sm:text-[60px] lg:col-span-4" style={display} />
                    <ol className="lg:col-span-8">
                        {[
                            ['Open the app', 'Today shows one session picked for the time you have. Nothing else asks for your attention.'],
                            ['Sit, or walk', 'Sessions run from five to twenty minutes. Audio only, so you can close your eyes or keep walking.'],
                            ['Close it and go', 'A short note of how you feel, if you like. Your week is there when you want to look.'],
                        ].map(([t, b], i) => (
                            <Reveal as="li" key={t} delay={i * 0.08} className="grid gap-2 border-t border-[var(--d-line)] py-7 sm:grid-cols-[3.5rem_12rem_1fr] sm:gap-6">
                                <span className="tabular-nums text-[var(--d-muted)]">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="text-[20px]" style={display}>
                                    {t}
                                </h3>
                                <p className="text-[var(--d-muted)]">{b}</p>
                            </Reveal>
                        ))}
                    </ol>
                </Container>
            </Section>

            <Breathe />

            <Screens />

            {/* Quote */}
            <Section>
                <Container className="max-w-4xl">
                    <Lines as="blockquote" stagger={0.025} text={'"It is the only app on my phone that wants me to put the phone down. I use it on the tram most mornings."'} className="text-[28px] leading-[1.3] sm:text-[44px]" style={display} />
                    <p className="mt-6 text-[var(--d-muted)]">Review on the App Store, February</p>
                </Container>
            </Section>

            {/* Price */}
            <Section id="price" className="border-t border-[var(--d-line)]">
                <Container className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-[38px] leading-[1.05] sm:text-[56px]" style={display}>
                            One price, everything included
                        </h2>
                        <p className="mt-5 max-w-sm text-[var(--d-muted)]">Fourteen days free. Cancel in two taps from your phone settings.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                        {[
                            ['Monthly', '€6.99', 'a month', false],
                            ['Yearly', '€49.99', 'a year, about €4.17 a month', true],
                        ].map(([n, p, s, best]) => (
                            <div key={n} className={`rounded-[16px] border p-6 ${best ? 'border-[var(--d-ink)]' : 'border-[var(--d-line)]'}`}>
                                <p className="text-[15px]">{n}</p>
                                <p className="mt-3 text-[44px] leading-none tabular-nums" style={display}>
                                    {p}
                                </p>
                                <p className="mt-2 text-[14px] text-[var(--d-muted)]">{s}</p>
                                <a href="#get" className={`mt-6 block rounded-full py-3 text-center text-[14px] font-medium ${best ? 'bg-[var(--d-accent)] text-white' : 'border border-[var(--d-ink)]'}`}>
                                    Start free trial
                                </a>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* CTA */}
            <Section className="bg-[var(--d-accent)] text-white">
                <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                    <Lines text="Start tomorrow morning" className="max-w-2xl text-[44px] leading-[1.02] sm:text-[68px]" style={display} />
                    <div className="flex flex-wrap gap-3">
                        <a href="#top" className="rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-[var(--d-accent)]">
                            Download for iPhone
                        </a>
                        <a href="#top" className="rounded-full border border-white/60 px-6 py-3.5 text-[14px] font-medium">
                            Get it on Android
                        </a>
                    </div>
                </Container>
            </Section>

            <footer className="py-12">
                <Container className="flex flex-col justify-between gap-6 text-[14px] text-[var(--d-muted)] sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-[18px] text-[var(--d-ink)]" style={display}>
                        <Wind className="h-4 w-4" strokeWidth={1.5} /> Stillwater
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Help
                        </a>
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Teachers
                        </a>
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Privacy
                        </a>
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Terms
                        </a>
                    </div>
                    <p>© 2026 Stillwater</p>
                </Container>
            </footer>
            <BackPill />
        </div>
    );
}
