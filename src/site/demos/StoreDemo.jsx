import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { BackPill, Container, Img, Section, photo, riseCss, useFonts } from './shared.jsx';

/* Maison Ivoire: a clothing store. Direction: Atelier. */

const FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Hanken+Grotesk:wght@400;500&display=swap';
const vars = {
    '--d-bg': '#F3F0EA',
    '--d-surface': '#E9E4DA',
    '--d-ink': '#161513',
    '--d-muted': '#6F6A61',
    '--d-line': '#D8D1C4',
    fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
};
const display = { fontFamily: '"Bodoni Moda", Georgia, serif', fontWeight: 400 };

const PRODUCTS = [
    { name: 'The Harlow coat', note: 'Wool check, charcoal', price: 640, img: 'photo-1485968579580-b6d095142e6e' },
    { name: 'Rib knit sweater', note: 'Undyed merino, ecru', price: 210, img: 'photo-1434389677669-e08b4cac3105' },
    { name: 'Striped poplin shirt', note: 'Cotton poplin, navy stripe', price: 145, img: 'photo-1544005313-94ddf0286df2' },
    { name: 'Wrap knit', note: 'Merino and cashmere, oat', price: 260, img: 'photo-1475180098004-ca77a66827be' },
];

const TILES = [
    { label: 'Coats', img: 'photo-1551232864-3f0890e580d9' },
    { label: 'Knitwear', img: 'photo-1434389677669-e08b4cac3105' },
    { label: 'Shirts and layers', img: 'photo-1490481651871-ab68de25d43d' },
];

const SERVICES = [
    ['Delivery', 'Free across Europe on orders over €200. Usually two to four days.'],
    ['Returns', 'Thirty days, collected from your door. Refunds within a week.'],
    ['Repairs', 'Free repairs on coats for the first five years. Buttons, linings, seams.'],
    ['Alterations', 'Sleeves and hems adjusted in our Porto studio before we send it.'],
];

const NAV = ['New in', 'Coats', 'Knitwear', 'Journal'];

export default function StoreDemo() {
    useFonts(FONTS);
    const [open, setOpen] = useState(false);
    const [bag, setBag] = useState(0);
    const [toast, setToast] = useState('');
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        if (!toast) return undefined;
        const t = setTimeout(() => setToast(''), 2200);
        return () => clearTimeout(t);
    }, [toast]);

    const add = (p) => {
        setBag((b) => b + 1);
        setToast(`${p.name} added to your bag`);
    };

    return (
        <div style={vars} className="min-h-dvh overflow-x-hidden bg-[var(--d-bg)] text-[15px] text-[var(--d-ink)] antialiased">
            <style>{riseCss}</style>

            <p className="border-b border-[var(--d-line)] py-2.5 text-center text-[12px] tracking-[0.04em] text-[var(--d-muted)]">Free delivery across Europe on orders over €200</p>

            {/* Nav: links left, name centered, icons right */}
            <header className="sticky top-0 z-50 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
                <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
                    <div className="flex items-center gap-7">
                        <button className="-ml-2 grid h-11 w-11 place-items-center md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
                            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
                        </button>
                        <nav className="hidden gap-7 md:flex">
                            {NAV.map((l) => (
                                <a key={l} href="#new" className="text-[var(--d-muted)] transition-colors hover:text-[var(--d-ink)]">
                                    {l}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <a href="#top" className="text-[22px] tracking-[0.02em] sm:text-[26px]" style={display}>
                        Maison Ivoire
                    </a>
                    <div className="flex items-center justify-end gap-1 sm:gap-3">
                        <button className="hidden h-11 w-11 place-items-center sm:grid" aria-label="Search">
                            <Search className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                        <button className="hidden h-11 w-11 place-items-center sm:grid" aria-label="Account">
                            <User className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                        <button className="relative grid h-11 w-11 place-items-center" aria-label={`Bag, ${bag} items`}>
                            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                            {bag > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--d-ink)] px-1 text-[10px] text-[var(--d-bg)]">{bag}</span>}
                        </button>
                    </div>
                </Container>
                {open && (
                    <nav className="border-t border-[var(--d-line)] md:hidden">
                        <Container className="flex flex-col py-3">
                            {NAV.map((l) => (
                                <a key={l} href="#new" onClick={() => setOpen(false)} className="border-b border-[var(--d-line)] py-4 text-[26px] last:border-0" style={display}>
                                    {l}
                                </a>
                            ))}
                        </Container>
                    </nav>
                )}
            </header>

            {/* Hero: full-bleed campaign photo */}
            <section id="top" className="relative h-[82svh] min-h-[520px] overflow-hidden">
                <img src={photo('photo-1539109136881-3be0616acf4b', 2200)} alt="Woman in a long pale blue coat in a city square" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />
                <div className="absolute inset-0 bg-black/30" />
                <Container className="relative flex h-full flex-col justify-end pb-12 text-white sm:pb-20">
                    <p className="demo-rise text-[13px] tracking-[0.12em]">AUTUMN AND WINTER</p>
                    <h1 className="demo-rise mt-4 max-w-3xl text-[48px] leading-[1] sm:text-[80px] lg:text-[112px]" style={{ ...display, animationDelay: '80ms' }}>
                        Coats cut to last a decade
                    </h1>
                    <div className="demo-rise mt-9 flex flex-wrap items-center gap-6" style={{ animationDelay: '160ms' }}>
                        <a href="#new" className="bg-white px-7 py-4 text-[12px] tracking-[0.12em] text-black transition-colors hover:bg-[#ECE7DE]">
                            SHOP THE COLLECTION
                        </a>
                        <a href="#story" className="text-sm underline decoration-white/40 underline-offset-8 hover:decoration-white">
                            How we make them
                        </a>
                    </div>
                </Container>
            </section>

            {/* New in */}
            <Section id="new">
                <Container>
                    <div className="flex items-end justify-between gap-6">
                        <h2 className="text-[36px] leading-none sm:text-[52px]" style={display}>
                            New in
                        </h2>
                        <a href="#new" className="text-sm underline decoration-[var(--d-line)] underline-offset-8 hover:decoration-[var(--d-ink)]">
                            View all 48 pieces
                        </a>
                    </div>
                    <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                        {PRODUCTS.map((p) => (
                            <li key={p.name} className="group">
                                <div className="relative">
                                    <Img id={p.img} w={900} alt={p.name} />
                                    <button
                                        onClick={() => add(p)}
                                        className="absolute inset-x-3 bottom-3 bg-[var(--d-bg)] py-3 text-[11px] tracking-[0.12em] opacity-100 transition-opacity duration-300 hover:bg-white lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                                    >
                                        ADD TO BAG
                                    </button>
                                </div>
                                <div className="mt-4 flex items-baseline justify-between gap-3">
                                    <span className="text-[14px] sm:text-[15px]">{p.name}</span>
                                    <span className="shrink-0 tabular-nums text-[var(--d-muted)]">€{p.price}</span>
                                </div>
                                <p className="mt-1 text-[13px] text-[var(--d-muted)]">{p.note}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </Section>

            {/* Story */}
            <Section id="story" className="bg-[var(--d-surface)]">
                <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <Img className="lg:col-span-7" ratio="aspect-[4/3]" id="photo-1441984904996-e0b6ba687e04" w={1600} alt="The Porto studio with coats on rails" />
                    <div className="lg:col-span-5">
                        <h2 className="text-[36px] leading-[1.05] sm:text-[52px]" style={display}>
                            Cut in Porto, by eleven people
                        </h2>
                        <p className="mt-6 text-[17px] leading-relaxed text-[var(--d-muted)]">
                            Every coat is cut, sewn and pressed in one workshop near the river. We make small runs of about three hundred pieces, so nothing waits in a warehouse and nothing ends up on sale.
                        </p>
                        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--d-line)] pt-6">
                            {[
                                ['312', 'pieces this season'],
                                ['14', 'hours per coat'],
                                ['5 yrs', 'free repairs'],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <dt className="text-[28px] tabular-nums sm:text-[34px]" style={display}>
                                        {n}
                                    </dt>
                                    <dd className="mt-1 text-[13px] text-[var(--d-muted)]">{l}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </Container>
            </Section>

            {/* Categories */}
            <Section>
                <Container className="grid gap-4 sm:gap-6 md:h-[clamp(520px,58vw,820px)] md:grid-cols-3 md:grid-rows-2">
                    {TILES.map((t, i) => (
                        <a key={t.label} href="#new" className={`group relative block md:h-full md:min-h-0 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                            <Img id={t.img} w={i === 0 ? 1600 : 900} alt={t.label} className="md:h-full" ratio="aspect-[4/5] sm:aspect-[4/3] md:aspect-auto" />
                            <span className="absolute bottom-4 left-4 bg-[var(--d-bg)] px-4 py-2.5 text-[12px] tracking-[0.12em] sm:bottom-6 sm:left-6">{t.label.toUpperCase()}</span>
                        </a>
                    ))}
                </Container>
            </Section>

            {/* Quote */}
            <Section className="border-y border-[var(--d-line)]">
                <Container className="max-w-4xl text-center">
                    <blockquote className="text-[28px] leading-[1.25] sm:text-[42px]" style={display}>
                        "I have worn this coat for six winters. Last year they replaced the lining for free, and it still looks new."
                    </blockquote>
                    <p className="mt-8 text-[var(--d-muted)]">Ana R., Lisbon</p>
                </Container>
            </Section>

            {/* Services */}
            <Section>
                <Container className="grid gap-10 lg:grid-cols-12">
                    <h2 className="text-[36px] leading-[1.05] sm:text-[52px] lg:col-span-4" style={display}>
                        After you buy
                    </h2>
                    <ul className="lg:col-span-8">
                        {SERVICES.map(([t, b]) => (
                            <li key={t} className="grid gap-2 border-t border-[var(--d-line)] py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
                                <h3 className="text-[17px]">{t}</h3>
                                <p className="text-[var(--d-muted)]">{b}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </Section>

            {/* Newsletter */}
            <Section className="bg-[var(--d-ink)] text-[var(--d-bg)]">
                <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <h2 className="text-[40px] leading-[1.02] sm:text-[64px]" style={display}>
                            New pieces, before anyone else
                        </h2>
                        <p className="mt-5 max-w-md opacity-70">Two emails a month: the next run, the journal, and the occasional sample sale in Porto.</p>
                    </div>
                    <div className="lg:col-span-5">
                        {joined ? (
                            <p className="border-b border-[var(--d-bg)]/40 py-4">Thank you. Look out for the next email in your inbox.</p>
                        ) : (
                            <form
                                className="flex border-b border-[var(--d-bg)]/40"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (email.includes('@')) setJoined(true);
                                }}
                            >
                                <label htmlFor="ivoire-email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="ivoire-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="min-w-0 flex-1 bg-transparent py-4 text-[16px] outline-none placeholder:text-[var(--d-bg)]/45"
                                />
                                <button className="py-4 pl-4 text-[12px] tracking-[0.12em]">SUBSCRIBE</button>
                            </form>
                        )}
                    </div>
                </Container>
            </Section>

            {/* Footer with oversized name */}
            <footer className="overflow-hidden pt-16 sm:pt-20">
                <Container>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <p className="text-[24px]" style={display}>
                                Maison Ivoire
                            </p>
                            <p className="mt-3 max-w-xs text-[var(--d-muted)]">Rua das Flores 41, Porto. Open Monday to Saturday, 10 till 7.</p>
                        </div>
                        {[
                            ['Shop', ['New in', 'Coats', 'Knitwear', 'Gift cards']],
                            ['Help', ['Delivery', 'Returns', 'Repairs', 'Size guide']],
                            ['House', ['Our studio', 'Journal', 'Stores', 'Contact']],
                        ].map(([t, ls]) => (
                            <div key={t} className="lg:col-span-2">
                                <p className="text-[13px] text-[var(--d-muted)]">{t}</p>
                                <ul className="mt-4 space-y-3">
                                    {ls.map((l) => (
                                        <li key={l}>
                                            <a href="#top" className="underline-offset-4 hover:underline">
                                                {l}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[var(--d-line)] pt-6 text-[13px] text-[var(--d-muted)] sm:flex-row">
                        <p>© 2026 Maison Ivoire. Made in Portugal.</p>
                        <p>Privacy, Terms, Cookies</p>
                    </div>
                </Container>
                <p aria-hidden="true" className="mt-10 whitespace-nowrap px-3 text-center text-[17vw] leading-[0.78] tracking-[-0.03em]" style={display}>
                    Ivoire
                </p>
            </footer>

            {toast && (
                <div role="status" className="fixed inset-x-4 top-20 z-[70] mx-auto max-w-sm bg-[var(--d-ink)] px-5 py-4 text-sm text-[var(--d-bg)] sm:top-24">
                    {toast}
                </div>
            )}
            <BackPill />
        </div>
    );
}
