import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BackPill, Container, Section, photo, useFonts } from './shared.jsx';
import { ClipImage, EASE, Intro, Lines, Marquee, Parallax, Reveal, useIntroDelay } from './motion.jsx';

/* Halden: a photography studio portfolio. Direction: Noir Gallery. Signature: the pinned sideways gallery. */

const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Familjen+Grotesk:wght@400;500&display=swap';
const vars = {
    '--d-bg': '#0F0F0E',
    '--d-surface': '#181816',
    '--d-ink': '#ECE8E1',
    '--d-muted': '#8E8A82',
    '--d-line': '#2B2A27',
    fontFamily: '"Familjen Grotesk", system-ui, sans-serif',
};
const display = { fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 };

const WORK = [
    { title: 'Still water', place: 'Lofoten', year: 2026, client: 'Personal series', img: 'photo-1464822759023-fed622ff2c3b' },
    { title: 'The boathouse', place: 'Dolomites', year: 2025, client: 'Hotel Lago, campaign', img: 'photo-1470770841072-f978cf4d019e' },
    { title: 'Concrete light', place: 'Oslo', year: 2025, client: 'Snehvit Arkitekter', img: 'photo-1487958449943-2429e8be8625' },
    { title: 'North Atlantic', place: 'Faroe Islands', year: 2024, client: 'Personal series', img: 'photo-1505144808419-1957a94ca61e' },
    { title: 'Vertical city', place: 'New York', year: 2024, client: 'Kinfolk, editorial', img: 'photo-1511818966892-d7d671e672a2' },
    { title: 'Red road', place: 'Utah', year: 2023, client: 'Personal series', img: 'photo-1500530855697-b586d89ba3ee' },
];

const ROAD = [
    ['photo-1493246507139-91e8fad9978e', 'Moraine Lake, 5.40 am'],
    ['photo-1500530855697-b586d89ba3ee', 'Route 12, Utah'],
    ['photo-1470770841072-f978cf4d019e', 'Lago di Braies'],
    ['photo-1480714378408-67cf0d13bc1b', 'Manhattan from the 86th floor'],
    ['photo-1505144808419-1957a94ca61e', 'Gjógv, Faroe Islands'],
];

const SERVICES = [
    ['Architecture', 'Buildings and interiors for architects, developers and magazines. Shot on site with daylight, usually over two days.'],
    ['Landscape', 'Commissioned series for hotels and tourism boards. We scout first and shoot at the edges of the day.'],
    ['Prints', 'Editions of 25 on cotton rag paper, signed and numbered. Framed in oak in our studio.'],
];

/* Pointer position, a tight spring for the cursor and a looser one for the preview. */
function useCursor() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, { stiffness: 500, damping: 40 });
    const sy = useSpring(y, { stiffness: 500, damping: 40 });
    const px = useSpring(x, { stiffness: 140, damping: 22 });
    const py = useSpring(y, { stiffness: 140, damping: 22 });
    const onMove = (e) => {
        x.set(e.clientX);
        y.set(e.clientY);
    };
    return { sx, sy, px, py, onMove };
}

/* Sideways gallery pinned while you scroll (desktop); a swipe row on phones. */
function RoadGallery() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%']);
    return (
        <>
            <section ref={ref} id="road" className="relative hidden h-[300vh] lg:block">
                <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
                    <Container>
                        <p className="text-sm text-[var(--d-muted)]">On the road, 2023 to 2026</p>
                        <h2 className="mt-2 text-[56px] leading-none" style={display}>
                            Five mornings worth the drive
                        </h2>
                    </Container>
                    <motion.div style={reduce ? undefined : { x }} className="mt-12 flex gap-8 pl-[max(3rem,calc((100vw-1360px)/2+3rem))]">
                        {ROAD.map(([id, cap]) => (
                            <figure key={id} className="w-[38vw] max-w-[620px] shrink-0">
                                <div className="aspect-[4/3] overflow-hidden bg-[var(--d-surface)]">
                                    <img src={photo(id, 1400)} alt={cap} loading="lazy" className="h-full w-full object-cover" />
                                </div>
                                <figcaption className="mt-3 text-sm text-[var(--d-muted)]">{cap}</figcaption>
                            </figure>
                        ))}
                    </motion.div>
                </div>
            </section>
            <Section className="lg:hidden">
                <Container>
                    <p className="text-sm text-[var(--d-muted)]">On the road, 2023 to 2026</p>
                    <Lines text="Five mornings worth the drive" className="mt-2 text-[40px] leading-[1.02] sm:text-[56px]" style={display} />
                </Container>
                <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8">
                    {ROAD.map(([id, cap]) => (
                        <figure key={id} className="w-[80vw] max-w-[440px] shrink-0 snap-start">
                            <div className="aspect-[4/3] overflow-hidden bg-[var(--d-surface)]">
                                <img src={photo(id, 900)} alt={cap} loading="lazy" className="h-full w-full object-cover" />
                            </div>
                            <figcaption className="mt-3 text-sm text-[var(--d-muted)]">{cap}</figcaption>
                        </figure>
                    ))}
                </div>
            </Section>
        </>
    );
}

export default function PortfolioDemo() {
    useFonts(FONTS);
    const wait = useIntroDelay('Halden');
    const reduce = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(null);
    const { sx, sy, px, py, onMove } = useCursor();

    const links = [
        ['Work', '#work'],
        ['Studio', '#studio'],
        ['Contact', '#contact'],
    ];

    return (
        <div style={vars} onPointerMove={onMove} className="min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[15px] text-[var(--d-ink)] antialiased">
            <Intro name="Halden" bg="#ECE8E1" fg="#0F0F0E" font={display} />

            {/* Cursor dot that opens into a label over work (fine pointers only) */}
            {!reduce && (
                <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[90] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
                    <motion.div
                        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--d-ink)] text-[11px] tracking-[0.12em] text-[var(--d-bg)]"
                        initial={false}
                        animate={hover !== null ? { width: 84, height: 84 } : { width: 10, height: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        <span className={`transition-opacity duration-300 ${hover !== null ? 'opacity-100' : 'opacity-0'}`}>VIEW</span>
                    </motion.div>
                </motion.div>
            )}

            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]/90 backdrop-blur-sm">
                <Container className="flex h-16 items-center justify-between sm:h-20">
                    <a href="#top" className="text-[26px]" style={display}>
                        Halden
                    </a>
                    <nav className="hidden items-center gap-9 md:flex">
                        {links.map(([l, h]) => (
                            <a key={l} href={h} className="group relative text-[var(--d-muted)] transition-colors hover:text-[var(--d-ink)]">
                                {l}
                                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                            </a>
                        ))}
                        <a href="#contact" className="border border-[var(--d-ink)] px-5 py-2.5 text-sm transition-colors duration-500 hover:bg-[var(--d-ink)] hover:text-[var(--d-bg)]">
                            Start a project
                        </a>
                    </nav>
                    <button className="-mr-2 grid h-11 w-11 place-items-center md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
                        {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
                    </button>
                </Container>
                {open && (
                    <nav className="border-t border-[var(--d-line)] md:hidden">
                        <Container className="flex flex-col py-3">
                            {links.map(([l, h], i) => (
                                <Reveal key={l} delay={i * 0.05} y={14}>
                                    <a href={h} onClick={() => setOpen(false)} className="block border-b border-[var(--d-line)] py-4 text-[32px]" style={display}>
                                        {l}
                                    </a>
                                </Reveal>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            {/* Hero: type-led statement */}
            <Section id="top" className="pt-16 sm:pt-24">
                <Container>
                    <Lines as="h1" onMount delay={wait} stagger={0.08} text="Landscape and architecture photography." className="text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[92px] lg:text-[140px]" style={display} />
                    <div className="mt-12 grid gap-4 border-t border-[var(--d-line)] pt-6 text-[var(--d-muted)] sm:grid-cols-3">
                        {['A two-person studio in Oslo', 'Working across Europe and beyond', 'Booking projects from March'].map((t, i) => (
                            <Reveal key={t} delay={wait + 0.5 + i * 0.08} y={12} className={i === 2 ? 'sm:text-right' : ''}>
                                {t}
                            </Reveal>
                        ))}
                    </div>
                </Container>
            </Section>

            <Parallax src={photo('photo-1493246507139-91e8fad9978e', 2400)} alt="Turquoise lake below steep mountains at sunrise" className="h-[78svh] min-h-[400px]" strength={10} />

            {/* Selected work: index list with a floating preview that follows the pointer */}
            <Section id="work">
                <Container>
                    <div className="flex items-end justify-between gap-6">
                        <Lines text="Selected work" className="text-[42px] leading-none sm:text-[64px]" style={display} />
                        <Reveal>
                            <p className="text-sm text-[var(--d-muted)]">2023 to 2026</p>
                        </Reveal>
                    </div>
                    <ul className="mt-12" onMouseLeave={() => setHover(null)}>
                        {WORK.map((w, i) => (
                            <Reveal as="li" key={w.title} delay={i * 0.05} onMouseEnter={() => setHover(i)} className="border-t border-[var(--d-line)] last:border-b">
                                <a href="#work" className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 sm:py-8">
                                    <span className={`text-[36px] leading-none transition-all duration-500 sm:text-[64px] lg:text-[80px] ${hover === null || hover === i ? 'text-[var(--d-ink)]' : 'lg:text-[#4a4843]'} ${hover === i ? 'lg:translate-x-4' : ''}`} style={display}>
                                        {w.title}
                                    </span>
                                    <span className="text-sm tabular-nums text-[var(--d-muted)]">{w.year}</span>
                                    <span className="col-span-2 text-sm text-[var(--d-muted)]">
                                        {w.place}, {w.client}
                                    </span>
                                    <ClipImage className="col-span-2 mt-4 aspect-[3/2] lg:hidden" src={photo(w.img, 1000)} alt={`${w.title}, ${w.place}`} />
                                </a>
                            </Reveal>
                        ))}
                    </ul>
                </Container>
            </Section>

            {/* Floating preview (desktop) */}
            <motion.div aria-hidden="true" style={{ x: px, y: py }} className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block">
                <AnimatePresence>
                    {hover !== null && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="relative ml-12 h-[300px] w-[240px] -translate-y-1/2 overflow-hidden"
                        >
                            {WORK.map((w, i) => (
                                <img key={w.img} src={photo(w.img, 600)} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hover === i ? 'opacity-100' : 'opacity-0'}`} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <RoadGallery />

            {/* Studio */}
            <Section id="studio" className="bg-[var(--d-surface)]">
                <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <ClipImage className="aspect-[4/5] sm:aspect-[3/2] lg:col-span-6 lg:aspect-[4/5]" src={photo('photo-1480714378408-67cf0d13bc1b', 1400)} alt="Manhattan at golden hour from above" />
                    <div className="lg:col-span-6">
                        <Lines text="Two photographers, one way of seeing" className="text-[40px] leading-[1.05] sm:text-[60px]" style={display} />
                        <Reveal delay={0.1}>
                            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--d-muted)]">
                                Halden is two photographers who spent ten years shooting for architecture magazines before opening a studio together. We still work slowly: one location at a time, natural light, very little retouching.
                            </p>
                        </Reveal>
                        <Reveal delay={0.2} className="mt-10 border-t border-[var(--d-line)] pt-6">
                            <p className="text-sm text-[var(--d-muted)]">Recent clients</p>
                            <p className="mt-3 leading-relaxed">Snehvit Arkitekter, Hotel Lago, Kinfolk, Visit Norway, Norm Architects, The Plant Journal</p>
                        </Reveal>
                    </div>
                </Container>
            </Section>

            {/* Services */}
            <Section>
                <Container className="grid gap-10 lg:grid-cols-12">
                    <Lines text="What we take on" className="text-[40px] leading-[1.05] sm:text-[60px] lg:col-span-4" style={display} />
                    <ul className="lg:col-span-8">
                        {SERVICES.map(([t, b], i) => (
                            <Reveal as="li" key={t} delay={i * 0.07} className="grid gap-2 border-t border-[var(--d-line)] py-7 sm:grid-cols-[12rem_1fr] sm:gap-8">
                                <h3 className="text-[24px]" style={display}>
                                    {t}
                                </h3>
                                <p className="text-[var(--d-muted)]">{b}</p>
                            </Reveal>
                        ))}
                    </ul>
                </Container>
            </Section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-20 border-t border-[var(--d-line)] py-20 sm:py-28">
                <Marquee speed={30} className="text-[44px] leading-none text-[var(--d-muted)] sm:text-[72px]" style={display} items={['Booking projects from March', 'Architecture', 'Landscape', 'Prints']} mark={<span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-current opacity-40" />} />
                <Container className="mt-14">
                    <Reveal>
                        <p className="text-[var(--d-muted)]">Tell us about the place and the light you have in mind.</p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <a href="mailto:studio@halden.no" className="group mt-6 inline-block max-w-full break-words text-[40px] leading-[1.1] sm:text-[84px] lg:text-[124px]" style={display}>
                            studio@halden.no
                            <span className="mt-2 block h-px w-full origin-left scale-x-[0.3] bg-[var(--d-ink)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                        </a>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-8 text-[var(--d-muted)]">Or call +47 22 00 00 00, weekdays 9 to 17.</p>
                    </Reveal>
                </Container>
            </section>

            <footer className="border-t border-[var(--d-line)] py-10">
                <Container className="flex flex-col justify-between gap-4 text-sm text-[var(--d-muted)] sm:flex-row">
                    <p>© 2026 Halden Studio, Oslo</p>
                    <div className="flex gap-6">
                        {['Instagram', 'Prints', 'Privacy'].map((l) => (
                            <a key={l} href="#top" className="transition-colors hover:text-[var(--d-ink)]">
                                {l}
                            </a>
                        ))}
                    </div>
                </Container>
            </footer>
            <BackPill />
        </div>
    );
}
