import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BackPill, Container, Img, Section, photo, riseCss, useFonts } from './shared.jsx';

/* Halden: a photography studio portfolio. Direction: Noir Gallery. */

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

const SERVICES = [
    ['Architecture', 'Buildings and interiors for architects, developers and magazines. Shot on site with daylight, usually over two days.'],
    ['Landscape', 'Commissioned series for hotels and tourism boards. We scout first and shoot at the edges of the day.'],
    ['Prints', 'Editions of 25 on cotton rag paper, signed and numbered. Framed in oak in our studio.'],
];

export default function PortfolioDemo() {
    useFonts(FONTS);
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(0);

    const links = [
        ['Work', '#work'],
        ['Studio', '#studio'],
        ['Contact', '#contact'],
    ];

    return (
        <div style={vars} className="min-h-dvh overflow-x-hidden bg-[var(--d-bg)] text-[15px] text-[var(--d-ink)] antialiased">
            <style>{riseCss}</style>

            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
                <Container className="flex h-16 items-center justify-between sm:h-20">
                    <a href="#top" className="text-[24px]" style={display}>
                        Halden
                    </a>
                    <nav className="hidden items-center gap-9 md:flex">
                        {links.map(([l, h]) => (
                            <a key={l} href={h} className="text-[var(--d-muted)] transition-colors hover:text-[var(--d-ink)]">
                                {l}
                            </a>
                        ))}
                        <a href="#contact" className="border border-[var(--d-ink)] px-5 py-2.5 text-sm transition-colors hover:bg-[var(--d-ink)] hover:text-[var(--d-bg)]">
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
                            {links.map(([l, h]) => (
                                <a key={l} href={h} onClick={() => setOpen(false)} className="border-b border-[var(--d-line)] py-4 text-[30px] last:border-0" style={display}>
                                    {l}
                                </a>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            {/* Hero: type-led statement */}
            <Section id="top" className="pt-16 sm:pt-24">
                <Container>
                    <h1 className="demo-rise text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[88px] lg:text-[136px]" style={display}>
                        Landscape and architecture photography.
                    </h1>
                    <div className="demo-rise mt-12 grid gap-4 border-t border-[var(--d-line)] pt-6 text-[var(--d-muted)] sm:grid-cols-3" style={{ animationDelay: '120ms' }}>
                        <p>A two-person studio in Oslo</p>
                        <p>Working across Europe and beyond</p>
                        <p className="sm:text-right">Booking projects from March</p>
                    </div>
                </Container>
            </Section>

            <section className="relative h-[72svh] min-h-[380px]">
                <img src={photo('photo-1493246507139-91e8fad9978e', 2400)} alt="Turquoise lake below steep mountains at sunrise" className="h-full w-full object-cover" />
            </section>

            {/* Selected work: index list, preview on hover (desktop), inline images (phone) */}
            <Section id="work">
                <Container>
                    <div className="flex items-end justify-between gap-6">
                        <h2 className="text-[38px] leading-none sm:text-[56px]" style={display}>
                            Selected work
                        </h2>
                        <p className="text-sm text-[var(--d-muted)]">2023 to 2026</p>
                    </div>
                    <div className="mt-12 grid gap-10 lg:grid-cols-12">
                        <ul className="lg:col-span-7" onMouseLeave={() => setHover(0)}>
                            {WORK.map((w, i) => (
                                <li key={w.title} onMouseEnter={() => setHover(i)} className="border-t border-[var(--d-line)] last:border-b">
                                    <a href="#work" className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 sm:py-7">
                                        <span className={`text-[34px] leading-none transition-colors sm:text-[52px] ${hover === i ? 'text-[var(--d-ink)]' : 'lg:text-[var(--d-muted)]'}`} style={display}>
                                            {w.title}
                                        </span>
                                        <span className="text-sm tabular-nums text-[var(--d-muted)]">{w.year}</span>
                                        <span className="col-span-2 text-sm text-[var(--d-muted)]">
                                            {w.place}, {w.client}
                                        </span>
                                        <Img className="col-span-2 mt-4 lg:hidden" ratio="aspect-[3/2]" id={w.img} w={1000} alt={`${w.title}, ${w.place}`} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="hidden lg:col-span-5 lg:block">
                            <div className="sticky top-28">
                                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--d-surface)]">
                                    {WORK.map((w, i) => (
                                        <img
                                            key={w.title}
                                            src={photo(w.img, 1200)}
                                            alt=""
                                            aria-hidden="true"
                                            loading="lazy"
                                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover === i ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm text-[var(--d-muted)]">
                                    {WORK[hover].title}, {WORK[hover].place}
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Studio */}
            <Section id="studio" className="bg-[var(--d-surface)]">
                <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <Img className="lg:col-span-6" ratio="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]" id="photo-1480714378408-67cf0d13bc1b" w={1400} alt="Manhattan at golden hour from above" />
                    <div className="lg:col-span-6">
                        <h2 className="text-[38px] leading-[1.05] sm:text-[56px]" style={display}>
                            Two photographers, one way of seeing
                        </h2>
                        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--d-muted)]">
                            Halden is two photographers who spent ten years shooting for architecture magazines before opening a studio together. We still work slowly: one location at a time, natural light, very little retouching.
                        </p>
                        <div className="mt-10 border-t border-[var(--d-line)] pt-6">
                            <p className="text-sm text-[var(--d-muted)]">Recent clients</p>
                            <p className="mt-3 leading-relaxed">Snehvit Arkitekter, Hotel Lago, Kinfolk, Visit Norway, Norm Architects, The Plant Journal</p>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Services */}
            <Section>
                <Container className="grid gap-10 lg:grid-cols-12">
                    <h2 className="text-[38px] leading-[1.05] sm:text-[56px] lg:col-span-4" style={display}>
                        What we take on
                    </h2>
                    <ul className="lg:col-span-8">
                        {SERVICES.map(([t, b]) => (
                            <li key={t} className="grid gap-2 border-t border-[var(--d-line)] py-7 sm:grid-cols-[12rem_1fr] sm:gap-8">
                                <h3 className="text-[22px]" style={display}>
                                    {t}
                                </h3>
                                <p className="text-[var(--d-muted)]">{b}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </Section>

            {/* Contact */}
            <Section id="contact" className="border-t border-[var(--d-line)]">
                <Container>
                    <p className="text-[var(--d-muted)]">Tell us about the place and the light you have in mind.</p>
                    <a href="mailto:studio@halden.no" className="mt-6 block break-words text-[40px] leading-[1.1] underline decoration-[var(--d-line)] decoration-1 underline-offset-[14px] transition-colors hover:decoration-[var(--d-ink)] sm:text-[80px] lg:text-[120px]" style={display}>
                        studio@halden.no
                    </a>
                    <p className="mt-8 text-[var(--d-muted)]">Or call +47 22 00 00 00, weekdays 9 to 17.</p>
                </Container>
            </Section>

            <footer className="border-t border-[var(--d-line)] py-10">
                <Container className="flex flex-col justify-between gap-4 text-sm text-[var(--d-muted)] sm:flex-row">
                    <p>© 2026 Halden Studio, Oslo</p>
                    <div className="flex gap-6">
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Instagram
                        </a>
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Prints
                        </a>
                        <a href="#top" className="hover:text-[var(--d-ink)]">
                            Privacy
                        </a>
                    </div>
                </Container>
            </footer>
            <BackPill />
        </div>
    );
}
