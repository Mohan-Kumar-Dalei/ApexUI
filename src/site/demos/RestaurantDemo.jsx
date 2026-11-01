import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BackPill, Container, Section, photo, useFonts } from './shared.jsx';
import { ClipImage, EASE, Intro, Lines, Parallax, Reveal, useIntroDelay } from './motion.jsx';

/* Brasa: a charcoal grill restaurant. Direction: Harbour. Signature: the fire, hour by hour. */

const FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Figtree:wght@400;500&display=swap';
const vars = {
    '--d-bg': '#F1EFEA',
    '--d-surface': '#E6E3DC',
    '--d-ink': '#14212A',
    '--d-muted': '#5B6870',
    '--d-line': '#D2D2CC',
    '--d-accent': '#163E4E',
    fontFamily: '"Figtree", system-ui, sans-serif',
};
const display = { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 400, fontVariationSettings: '"opsz" 144' };

const MENU = {
    'From the grill': [
        ['Lamb skewers', 'Cumin, yoghurt, charred onion', 19, 'photo-1555939594-58d7cb561ad1'],
        ['Dry-aged rib of beef', 'For two, bone marrow butter, chips', 68, 'photo-1600891964092-4316c288032e'],
        ['Whole sea bream', 'Fennel, lemon, green oil', 32],
        ['Hispi cabbage', 'Brown butter, hazelnut, anchovy', 14],
    ],
    'Small plates': [
        ['Garden salad', 'Leaves from Quinta da Vinha, mustard dressing', 11, 'photo-1540189549336-e6e99c3679fe'],
        ['Flatbread from the oven', 'Whipped feta, honey, thyme', 9, 'photo-1565299624946-b28f40a0ae38'],
        ['Smoked mackerel', 'Pickled cucumber, rye', 13],
        ['Burnt cheesecake', 'Sour cherries', 9],
    ],
};

const FIRE = [
    ['3 pm', 'The fire is lit', 'Holm oak from a farm in the Alentejo goes into the grill. It needs three hours to burn down to the right embers.', 'photo-1517248135467-4c7edcad34c4'],
    ['6 pm', 'The embers settle', 'Hot enough to blister a pepper in seconds, gentle enough to roast a rib for two hours. The first tables sit down.', 'photo-1555939594-58d7cb561ad1'],
    ['9 pm', 'The rib comes off', 'Rested by the fire for twenty minutes, carved at the pass and sent out with chips and bone marrow butter.', 'photo-1600891964092-4316c288032e'],
];

const HOURS = [
    ['Tuesday to Thursday', '6 pm till 11 pm'],
    ['Friday and Saturday', '12.30 pm till midnight'],
    ['Sunday', '12.30 pm till 5 pm'],
    ['Monday', 'Closed'],
];

/* A slowly turning ring of text, drawn as SVG. */
function Badge({ text, className = '' }) {
    const reduce = useReducedMotion();
    return (
        <div className={`grid h-28 w-28 place-items-center rounded-full bg-[var(--d-accent)] text-[var(--d-bg)] sm:h-36 sm:w-36 ${className}`}>
            <motion.svg viewBox="0 0 100 100" className="absolute h-full w-full" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, ease: 'linear', repeat: Infinity }}>
                <defs>
                    <path id="brasa-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text fontSize="9.6" letterSpacing="2.4" fill="currentColor">
                    <textPath href="#brasa-ring">{text}</textPath>
                </text>
            </motion.svg>
            <span className="text-[26px] sm:text-[32px]" style={display}>
                6 pm
            </span>
        </div>
    );
}

/* The fire, hour by hour: the picture stays while the hours scroll past. */
function FireStory() {
    const [active, setActive] = useState(0);
    const refs = useRef([]);
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i))),
            { rootMargin: '-45% 0px -45% 0px' },
        );
        refs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);
    return (
        <section id="story" className="scroll-mt-20 bg-[var(--d-ink)] text-[var(--d-bg)]">
            <Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-0">
                <div className="hidden lg:col-span-6 lg:block">
                    <div className="sticky top-24 py-16">
                        <div className="relative h-[calc(100svh-12rem)] overflow-hidden">
                            {FIRE.map(([, , , img], i) => (
                                <motion.img
                                    key={img + i}
                                    src={photo(img, 1400)}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    initial={false}
                                    animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.08 }}
                                    transition={{ duration: 1.1, ease: EASE }}
                                />
                            ))}
                            <span className="absolute left-5 top-5 bg-[var(--d-bg)] px-3 py-1.5 text-[14px] tabular-nums text-[var(--d-ink)]">{FIRE[active][0]}</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-6 lg:py-[28vh]">
                    <Lines text="One fire, from three in the afternoon" className="text-[38px] leading-[1.05] sm:text-[56px]" style={display} />
                    <ol className="mt-12 space-y-14 lg:mt-[22vh] lg:space-y-[34vh]">
                        {FIRE.map(([time, title, body, img], i) => (
                            <li key={time} ref={(el) => (refs.current[i] = el)} data-i={i} className={`transition-opacity duration-700 ${active === i ? 'lg:opacity-100' : 'lg:opacity-40'}`}>
                                <ClipImage className="mb-6 aspect-[3/2] lg:hidden" src={photo(img, 1000)} alt={title} />
                                <p className="text-[15px] tabular-nums opacity-70">{time}</p>
                                <h3 className="mt-2 text-[30px] leading-tight sm:text-[40px]" style={display}>
                                    {title}
                                </h3>
                                <p className="mt-4 max-w-md text-[17px] leading-relaxed opacity-75">{body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    );
}

export default function RestaurantDemo() {
    useFonts(FONTS);
    const wait = useIntroDelay('Brasa');
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [booked, setBooked] = useState(null);
    const [dish, setDish] = useState(null);
    const [form, setForm] = useState({ date: '', time: '19:30', guests: '2', name: '' });
    const today = new Date().toISOString().slice(0, 10);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const fx = useSpring(mx, { stiffness: 160, damping: 22 });
    const fy = useSpring(my, { stiffness: 160, damping: 22 });

    const links = [
        ['Menu', '#menu'],
        ['The fire', '#story'],
        ['Private dining', '#private'],
        ['Visit', '#visit'],
    ];

    const field = 'w-full border-b border-[var(--d-bg)]/35 bg-transparent py-3 text-[16px] text-[var(--d-bg)] outline-none placeholder:text-[var(--d-bg)]/45 focus:border-[var(--d-bg)] [color-scheme:dark]';

    return (
        <div
            style={vars}
            onPointerMove={(e) => {
                mx.set(e.clientX);
                my.set(e.clientY);
            }}
            className="min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[16px] text-[var(--d-ink)] antialiased"
        >
            <Intro name="Brasa" bg="#14212A" fg="#F1EFEA" font={display} />

            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]/95 backdrop-blur-sm">
                <Container className="flex h-16 items-center justify-between sm:h-20">
                    <a href="#top" className="text-[28px] leading-none" style={display}>
                        Brasa
                    </a>
                    <nav className="hidden items-center gap-8 lg:flex">
                        {links.map(([l, h]) => (
                            <a key={l} href={h} className="group relative text-[15px] text-[var(--d-muted)] transition-colors hover:text-[var(--d-ink)]">
                                {l}
                                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <a href="#book" className="rounded-[4px] bg-[var(--d-accent)] px-5 py-3 text-[14px] text-[var(--d-bg)] transition-transform duration-300 hover:-translate-y-0.5">
                            Book a table
                        </a>
                        <button className="-mr-2 grid h-11 w-11 place-items-center lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
                            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
                        </button>
                    </div>
                </Container>
                {open && (
                    <nav className="border-t border-[var(--d-line)] lg:hidden">
                        <Container className="flex flex-col py-3">
                            {links.map(([l, h], i) => (
                                <Reveal key={l} delay={i * 0.05} y={14}>
                                    <a href={h} onClick={() => setOpen(false)} className="block border-b border-[var(--d-line)] py-4 text-[28px]" style={display}>
                                        {l}
                                    </a>
                                </Reveal>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            {/* Hero */}
            <Section id="top" className="pt-10 sm:pt-16">
                <Container className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-6">
                        <Lines as="h1" onMount delay={wait} text="Cooked over charcoal, served by the river" className="text-[50px] leading-[0.98] sm:text-[80px] lg:text-[100px]" style={display} />
                        <Reveal delay={wait + 0.45}>
                            <p className="mt-7 max-w-md text-[18px] leading-relaxed text-[var(--d-muted)]">
                                Forty seats in an old cork warehouse in Lisbon. Meat and fish from small farms and day boats, a short menu that changes with what arrives.
                            </p>
                        </Reveal>
                        <Reveal delay={wait + 0.55} className="mt-10 flex flex-wrap items-center gap-6">
                            <a href="#book" className="rounded-[4px] bg-[var(--d-accent)] px-7 py-4 text-[15px] text-[var(--d-bg)] transition-transform duration-300 hover:-translate-y-0.5">
                                Book a table
                            </a>
                            <a href="#menu" className="text-[15px] underline decoration-[var(--d-line)] underline-offset-8 transition-colors hover:decoration-[var(--d-ink)]">
                                See tonight's menu
                            </a>
                        </Reveal>
                    </div>
                    <div className="relative lg:col-span-6">
                        <Parallax src={photo('photo-1555939594-58d7cb561ad1', 1600)} alt="Lamb skewers and grilled vegetables on a wooden board" className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" strength={6} eager />
                        <Badge text="OPEN TONIGHT  BOOK A TABLE  OPEN TONIGHT  BOOK A TABLE  " className="absolute -bottom-8 -left-4 sm:-left-8" />
                    </div>
                </Container>
            </Section>

            {/* Hours */}
            <section id="visit" className="scroll-mt-20 border-y border-[var(--d-line)]">
                <Container className="grid gap-y-6 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:items-start">
                    <Reveal>
                        <p className="text-[15px] text-[var(--d-muted)]">Rua da Cintura 12</p>
                        <p className="text-[15px] text-[var(--d-muted)]">Santos, Lisbon</p>
                    </Reveal>
                    {HOURS.map(([d, h], i) => (
                        <Reveal key={d} delay={0.06 * (i + 1)}>
                            <p className="text-[15px]">{d}</p>
                            <p className="text-[15px] text-[var(--d-muted)]">{h}</p>
                        </Reveal>
                    ))}
                </Container>
            </section>

            {/* Menu, with a photo that follows the pointer over dishes that have one */}
            <Section id="menu">
                <Container>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <Lines text="Tonight" className="text-[44px] leading-none sm:text-[68px]" style={display} />
                        <Reveal>
                            <p className="max-w-sm text-[15px] text-[var(--d-muted)]">The menu changes most days. Tell us about allergies when you book and the kitchen will cook around them.</p>
                        </Reveal>
                    </div>
                    <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2" onMouseLeave={() => setDish(null)}>
                        {Object.entries(MENU).map(([group, dishes]) => (
                            <div key={group}>
                                <Reveal>
                                    <h3 className="text-[24px]" style={display}>
                                        {group}
                                    </h3>
                                </Reveal>
                                <ul className="mt-5">
                                    {dishes.map(([n, note, p, img], i) => (
                                        <Reveal as="li" key={n} delay={i * 0.05} onMouseEnter={() => setDish(img ?? null)} className="group border-t border-[var(--d-line)] py-5">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-[17px] transition-transform duration-500 group-hover:translate-x-1.5">{n}</span>
                                                <span aria-hidden="true" className="flex-1 -translate-y-1 border-b border-dotted border-[var(--d-line)]" />
                                                <span className="tabular-nums">€{p}</span>
                                            </div>
                                            <p className="mt-1 text-[15px] text-[var(--d-muted)]">{note}</p>
                                        </Reveal>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {!reduce && (
                <motion.div aria-hidden="true" style={{ x: fx, y: fy }} className="pointer-events-none fixed left-0 top-0 z-[80] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
                    <AnimatePresence>
                        {dish && (
                            <motion.img
                                key={dish}
                                src={photo(dish, 500)}
                                alt=""
                                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="ml-8 h-[200px] w-[160px] -translate-y-1/2 object-cover shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)]"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            <FireStory />

            {/* Gallery, each picture drifting at its own pace */}
            <Section>
                <Container className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    <Parallax className="aspect-[3/2] sm:col-span-2 lg:col-span-2" src={photo('photo-1600891964092-4316c288032e', 1600)} alt="Steak with chips and herbs" strength={8} />
                    <Parallax className="aspect-[3/2] lg:aspect-auto lg:h-full" src={photo('photo-1540189549336-e6e99c3679fe', 900)} alt="Green salad with seeds and onion" strength={14} />
                </Container>
            </Section>

            {/* Private dining */}
            <Section id="private" className="border-t border-[var(--d-line)]">
                <Container className="grid gap-10 lg:grid-cols-12">
                    <Lines text="The long table upstairs" className="text-[40px] leading-[1.05] sm:text-[58px] lg:col-span-5" style={display} />
                    <div className="lg:col-span-7">
                        <Reveal>
                            <p className="text-[18px] leading-relaxed text-[var(--d-muted)]">
                                A private room for up to sixteen guests, with its own window onto the river. We cook a set menu for the table and pour wines from small growers in the Douro and the Dão.
                            </p>
                        </Reveal>
                        <ul className="mt-8 border-t border-[var(--d-line)]">
                            {[
                                ['Set menu', 'From €65 a guest'],
                                ['Wine pairing', 'From €40 a guest'],
                                ['Minimum', 'Eight guests, three weeks ahead'],
                            ].map(([a, b], i) => (
                                <Reveal as="li" key={a} delay={i * 0.06} className="flex justify-between gap-6 border-b border-[var(--d-line)] py-4 text-[16px]">
                                    <span>{a}</span>
                                    <span className="text-right text-[var(--d-muted)]">{b}</span>
                                </Reveal>
                            ))}
                        </ul>
                        <Reveal>
                            <a href="mailto:mesa@brasa.pt" className="mt-8 inline-block text-[15px] underline underline-offset-8">
                                Ask about a date
                            </a>
                        </Reveal>
                    </div>
                </Container>
            </Section>

            {/* Booking */}
            <Section id="book" className="bg-[var(--d-accent)] text-[var(--d-bg)]">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Lines text="Tables open thirty days ahead" className="text-[44px] leading-[1.02] sm:text-[68px]" style={display} />
                        <Reveal delay={0.2}>
                            <p className="mt-5 max-w-sm opacity-75">For groups larger than six, or for tonight, call us on +351 21 000 0000.</p>
                        </Reveal>
                    </div>
                    <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.15}>
                        {booked ? (
                            <div className="border-t border-[var(--d-bg)]/35 pt-6">
                                <p className="text-[30px]" style={display}>
                                    See you on {booked.date}
                                </p>
                                <p className="mt-3 opacity-75">
                                    A table for {booked.guests} at {booked.time}, under {booked.name}. We will send a confirmation by email.
                                </p>
                                <button onClick={() => setBooked(null)} className="mt-6 text-[15px] underline underline-offset-8">
                                    Change the booking
                                </button>
                            </div>
                        ) : (
                            <form
                                className="grid gap-6 sm:grid-cols-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!form.date || !form.name.trim()) return;
                                    const d = new Date(`${form.date}T00:00`);
                                    setBooked({ ...form, date: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) });
                                }}
                            >
                                <label className="block">
                                    <span className="text-[14px] opacity-75">Date</span>
                                    <input type="date" required min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={field} />
                                </label>
                                <label className="block">
                                    <span className="text-[14px] opacity-75">Time</span>
                                    <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={`${field} appearance-none`}>
                                        {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((t) => (
                                            <option key={t} value={t} className="text-black">
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-[14px] opacity-75">Guests</span>
                                    <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={`${field} appearance-none`}>
                                        {['1', '2', '3', '4', '5', '6'].map((g) => (
                                            <option key={g} value={g} className="text-black">
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-[14px] opacity-75">Name</span>
                                    <input type="text" required autoComplete="name" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={field} />
                                </label>
                                <button className="rounded-[4px] bg-[var(--d-bg)] px-7 py-4 text-[15px] text-[var(--d-accent)] transition-transform duration-300 hover:-translate-y-0.5 sm:col-span-2 sm:justify-self-start">
                                    Request the table
                                </button>
                            </form>
                        )}
                    </Reveal>
                </Container>
            </Section>

            <footer className="overflow-hidden pt-16">
                <Container>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
                        <div className="lg:col-span-6">
                            <p className="max-w-xs text-[var(--d-muted)]">Rua da Cintura 12, Santos, Lisbon. Five minutes from the Santos tram stop.</p>
                        </div>
                        <div className="lg:col-span-3">
                            <p className="text-[14px] text-[var(--d-muted)]">Contact</p>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <a href="tel:+351210000000" className="underline-offset-4 hover:underline">
                                        +351 21 000 0000
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:mesa@brasa.pt" className="underline-offset-4 hover:underline">
                                        mesa@brasa.pt
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="lg:col-span-3">
                            <p className="text-[14px] text-[var(--d-muted)]">Elsewhere</p>
                            <ul className="mt-4 space-y-3">
                                {['Instagram', 'Gift vouchers', 'Jobs in the kitchen'].map((l) => (
                                    <li key={l}>
                                        <a href="#top" className="underline-offset-4 hover:underline">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <Reveal y={70}>
                        <p aria-hidden="true" className="mt-14 text-[26vw] leading-[0.8] tracking-[-0.04em] lg:text-[22vw]" style={display}>
                            Brasa
                        </p>
                    </Reveal>
                    <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[var(--d-line)] py-6 text-[14px] text-[var(--d-muted)] sm:flex-row">
                        <p>© 2026 Brasa, Lisbon</p>
                        <p>Privacy and cookies</p>
                    </div>
                </Container>
            </footer>
            <BackPill />
        </div>
    );
}
