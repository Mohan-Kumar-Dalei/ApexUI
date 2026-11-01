import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BackPill, Container, Img, Section, riseCss, useFonts } from './shared.jsx';

/* Brasa: a charcoal grill restaurant. Direction: Harbour. */

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
        ['Lamb skewers', 'Cumin, yoghurt, charred onion', 19],
        ['Dry-aged rib of beef', 'For two, bone marrow butter, chips', 68],
        ['Whole sea bream', 'Fennel, lemon, green oil', 32],
        ['Hispi cabbage', 'Brown butter, hazelnut, anchovy', 14],
    ],
    'Small plates': [
        ['Garden salad', 'Leaves from Quinta da Vinha, mustard dressing', 11],
        ['Flatbread from the oven', 'Whipped feta, honey, thyme', 9],
        ['Smoked mackerel', 'Pickled cucumber, rye', 13],
        ['Burnt cheesecake', 'Sour cherries', 9],
    ],
};

const HOURS = [
    ['Tuesday to Thursday', '6 pm till 11 pm'],
    ['Friday and Saturday', '12.30 pm till midnight'],
    ['Sunday', '12.30 pm till 5 pm'],
    ['Monday', 'Closed'],
];

export default function RestaurantDemo() {
    useFonts(FONTS);
    const [open, setOpen] = useState(false);
    const [booked, setBooked] = useState(null);
    const [form, setForm] = useState({ date: '', time: '19:30', guests: '2', name: '' });
    const today = new Date().toISOString().slice(0, 10);

    const links = [
        ['Menu', '#menu'],
        ['Story', '#story'],
        ['Private dining', '#private'],
        ['Visit', '#visit'],
    ];

    const field = 'w-full border-b border-[var(--d-bg)]/35 bg-transparent py-3 text-[16px] text-[var(--d-bg)] outline-none placeholder:text-[var(--d-bg)]/45 focus:border-[var(--d-bg)] [color-scheme:dark]';

    return (
        <div style={vars} className="min-h-dvh overflow-x-hidden bg-[var(--d-bg)] text-[16px] text-[var(--d-ink)] antialiased">
            <style>{riseCss}</style>

            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
                <Container className="flex h-16 items-center justify-between sm:h-20">
                    <a href="#top" className="text-[26px] leading-none" style={display}>
                        Brasa
                    </a>
                    <nav className="hidden items-center gap-8 lg:flex">
                        {links.map(([l, h]) => (
                            <a key={l} href={h} className="text-[15px] text-[var(--d-muted)] transition-colors hover:text-[var(--d-ink)]">
                                {l}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <a href="#book" className="rounded-[4px] bg-[var(--d-accent)] px-5 py-3 text-[14px] text-[var(--d-bg)] transition-opacity hover:opacity-90">
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
                            {links.map(([l, h]) => (
                                <a key={l} href={h} onClick={() => setOpen(false)} className="border-b border-[var(--d-line)] py-4 text-[26px] last:border-0" style={display}>
                                    {l}
                                </a>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            {/* Hero: split */}
            <Section id="top" className="pt-10 sm:pt-16">
                <Container className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-6">
                        <h1 className="demo-rise text-[50px] leading-[0.98] sm:text-[76px] lg:text-[96px]" style={display}>
                            Cooked over charcoal, served by the river
                        </h1>
                        <p className="demo-rise mt-7 max-w-md text-[18px] leading-relaxed text-[var(--d-muted)]" style={{ animationDelay: '100ms' }}>
                            Forty seats in an old cork warehouse in Lisbon. Meat and fish from small farms and day boats, a short menu that changes with what arrives.
                        </p>
                        <div className="demo-rise mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: '180ms' }}>
                            <a href="#book" className="rounded-[4px] bg-[var(--d-accent)] px-7 py-4 text-[15px] text-[var(--d-bg)] transition-opacity hover:opacity-90">
                                Book a table
                            </a>
                            <a href="#menu" className="text-[15px] underline decoration-[var(--d-line)] underline-offset-8 hover:decoration-[var(--d-ink)]">
                                See tonight's menu
                            </a>
                        </div>
                    </div>
                    <Img className="lg:col-span-6" ratio="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" id="photo-1555939594-58d7cb561ad1" w={1600} alt="Lamb skewers and grilled vegetables on a wooden board" />
                </Container>
            </Section>

            {/* Hours */}
            <section id="visit" className="scroll-mt-20 border-y border-[var(--d-line)]">
                <Container className="grid gap-y-6 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:items-start">
                    <div className="lg:col-span-1">
                        <p className="text-[15px] text-[var(--d-muted)]">Rua da Cintura 12</p>
                        <p className="text-[15px] text-[var(--d-muted)]">Santos, Lisbon</p>
                    </div>
                    {HOURS.map(([d, h]) => (
                        <div key={d}>
                            <p className="text-[15px]">{d}</p>
                            <p className="text-[15px] text-[var(--d-muted)]">{h}</p>
                        </div>
                    ))}
                </Container>
            </section>

            {/* Menu */}
            <Section id="menu">
                <Container>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <h2 className="text-[40px] leading-none sm:text-[60px]" style={display}>
                            Tonight
                        </h2>
                        <p className="max-w-sm text-[15px] text-[var(--d-muted)]">The menu changes most days. Tell us about allergies when you book and the kitchen will cook around them.</p>
                    </div>
                    <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
                        {Object.entries(MENU).map(([group, dishes]) => (
                            <div key={group}>
                                <h3 className="text-[22px]" style={display}>
                                    {group}
                                </h3>
                                <ul className="mt-5">
                                    {dishes.map(([n, note, p]) => (
                                        <li key={n} className="border-t border-[var(--d-line)] py-5">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-[17px]">{n}</span>
                                                <span aria-hidden="true" className="flex-1 -translate-y-1 border-b border-dotted border-[var(--d-line)]" />
                                                <span className="tabular-nums">€{p}</span>
                                            </div>
                                            <p className="mt-1 text-[15px] text-[var(--d-muted)]">{note}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Story */}
            <Section id="story" className="bg-[var(--d-surface)]">
                <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <Img className="lg:col-span-7" ratio="aspect-[3/2]" id="photo-1517248135467-4c7edcad34c4" w={1600} alt="The dining room with dark wood tables and low lights" />
                    <div className="lg:col-span-5">
                        <h2 className="text-[38px] leading-[1.05] sm:text-[54px]" style={display}>
                            One fire, lit at three every afternoon
                        </h2>
                        <p className="mt-6 text-[17px] leading-relaxed text-[var(--d-muted)]">
                            We burn holm oak from a farm in the Alentejo. By service it has settled into embers hot enough to blister a pepper in seconds and gentle enough to roast a rib for two hours. Everything on the menu passes over it.
                        </p>
                    </div>
                </Container>
            </Section>

            {/* Gallery */}
            <Section>
                <Container className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    <Img className="sm:col-span-2 lg:col-span-2" ratio="aspect-[3/2]" id="photo-1600891964092-4316c288032e" w={1600} alt="Steak with chips and herbs" />
                    <Img ratio="aspect-[3/2] lg:aspect-auto lg:h-full" id="photo-1540189549336-e6e99c3679fe" w={900} alt="Green salad with seeds and onion" />
                </Container>
            </Section>

            {/* Private dining */}
            <Section id="private" className="border-t border-[var(--d-line)]">
                <Container className="grid gap-10 lg:grid-cols-12">
                    <h2 className="text-[38px] leading-[1.05] sm:text-[54px] lg:col-span-5" style={display}>
                        The long table upstairs
                    </h2>
                    <div className="lg:col-span-7">
                        <p className="text-[18px] leading-relaxed text-[var(--d-muted)]">
                            A private room for up to sixteen guests, with its own window onto the river. We cook a set menu for the table and pour wines from small growers in the Douro and the Dão.
                        </p>
                        <ul className="mt-8 border-t border-[var(--d-line)]">
                            {[
                                ['Set menu', 'From €65 a guest'],
                                ['Wine pairing', 'From €40 a guest'],
                                ['Minimum', 'Eight guests, three weeks ahead'],
                            ].map(([a, b]) => (
                                <li key={a} className="flex justify-between gap-6 border-b border-[var(--d-line)] py-4 text-[16px]">
                                    <span>{a}</span>
                                    <span className="text-right text-[var(--d-muted)]">{b}</span>
                                </li>
                            ))}
                        </ul>
                        <a href="mailto:mesa@brasa.pt" className="mt-8 inline-block text-[15px] underline underline-offset-8">
                            Ask about a date
                        </a>
                    </div>
                </Container>
            </Section>

            {/* Booking */}
            <Section id="book" className="bg-[var(--d-accent)] text-[var(--d-bg)]">
                <Container className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <h2 className="text-[42px] leading-[1.02] sm:text-[64px]" style={display}>
                            Tables open thirty days ahead
                        </h2>
                        <p className="mt-5 max-w-sm opacity-75">For groups larger than six, or for tonight, call us on +351 21 000 0000.</p>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        {booked ? (
                            <div className="border-t border-[var(--d-bg)]/35 pt-6">
                                <p className="text-[28px]" style={display}>
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
                                <button className="rounded-[4px] bg-[var(--d-bg)] px-7 py-4 text-[15px] text-[var(--d-accent)] transition-opacity hover:opacity-90 sm:col-span-2 sm:justify-self-start">
                                    Request the table
                                </button>
                            </form>
                        )}
                    </div>
                </Container>
            </Section>

            <footer className="pt-16">
                <Container>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
                        <div className="lg:col-span-6">
                            <p className="text-[40px] leading-none sm:text-[56px]" style={display}>
                                Brasa
                            </p>
                            <p className="mt-4 max-w-xs text-[var(--d-muted)]">Rua da Cintura 12, Santos, Lisbon. Five minutes from the Santos tram stop.</p>
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
                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[var(--d-line)] py-6 text-[14px] text-[var(--d-muted)] sm:flex-row">
                        <p>© 2026 Brasa, Lisbon</p>
                        <p>Privacy and cookies</p>
                    </div>
                </Container>
            </footer>
            <BackPill />
        </div>
    );
}
