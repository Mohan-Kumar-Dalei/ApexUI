import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { BackPill, photo, useFonts } from '../shared.jsx';
import { Marquee } from '../motion.jsx';
import { CATS, CartProvider, FREE_SHIPPING, PRODUCTS, inr, useCart } from './store.jsx';

/*
 * Volta, a streetwear label. Direction: loud colour block, condensed caps, signal orange.
 * Layout: store grid with a filter bar, a draggable lookbook and a drop countdown.
 * Architecture: cart state in a reducer + context (store.jsx) shared by cards, nav and drawer.
 * Loader: a big counter, then colour panels wipe up. Skeleton: product cards blink in a wave.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600&display=swap';
const vars = {
    '--v-bg': '#F2F0EA',
    '--v-ink': '#111111',
    '--v-muted': '#6A6862',
    '--v-line': '#D9D6CE',
    '--v-accent': '#FF4D1F',
    '--v-tile': '#E6E3DB',
    fontFamily: '"Archivo", system-ui, sans-serif',
};
const anton = { fontFamily: '"Anton", Impact, sans-serif', fontWeight: 400 };
const EASE = [0.16, 1, 0.3, 1];
const WIPE = [0.76, 0, 0.24, 1];
const SIZES = ['S', 'M', 'L', 'XL'];

const CSS = `
.vt ::selection { background: var(--v-accent); color: var(--v-ink); }
@keyframes vt-wave { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.vt-bone { background: var(--v-tile); animation: vt-wave 1.1s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .vt-bone { animation: none; } }
`;

/* ---------- loader: count to 100, then two colour panels wipe up and away ---------- */
function Loader({ onDone }) {
    const reduce = useReducedMotion();
    const done = useRef(onDone);
    const [n, setN] = useState(0);
    const [phase, setPhase] = useState(0); // 0 counting, 1 orange covers, 2 all leave
    useEffect(() => {
        if (reduce) return done.current();
        const c = animate(0, 100, { duration: 1.3, ease: [0.3, 0, 0.2, 1], onUpdate: (v) => setN(Math.round(v)), onComplete: () => setPhase(1) });
        return () => c.stop();
    }, [reduce]);
    useEffect(() => {
        if (phase !== 1) return undefined;
        const t = setTimeout(() => setPhase(2), 550);
        return () => clearTimeout(t);
    }, [phase]);
    if (reduce) return null;
    return (
        <motion.div className="fixed inset-0 z-[100] overflow-hidden" animate={phase === 2 ? { y: '-100%' } : undefined} transition={{ duration: 0.8, ease: WIPE }} onAnimationComplete={() => phase === 2 && done.current()} aria-hidden="true">
            <div className="absolute inset-0 flex flex-col justify-between bg-[var(--v-ink)] p-5 text-[var(--v-bg)] sm:p-10">
                <div className="flex justify-between text-xs uppercase tracking-[0.2em]">
                    <span>Volta</span>
                    <span>Drop 07</span>
                </div>
                <span className="text-[clamp(7rem,30vw,22rem)] leading-[0.8] tabular-nums" style={anton}>
                    {n}
                </span>
            </div>
            <motion.div className="absolute inset-0 grid place-items-center bg-[var(--v-accent)]" initial={{ y: '100%' }} animate={phase >= 1 ? { y: '0%' } : undefined} transition={{ duration: 0.55, ease: WIPE }}>
                <span className="text-[clamp(4rem,16vw,12rem)] uppercase leading-none text-[var(--v-ink)]" style={anton}>
                    Volta
                </span>
            </motion.div>
        </motion.div>
    );
}

/* ---------- nav: announcement band, store bar, side drawer on phones ---------- */
function Nav() {
    const { count, dispatch } = useCart();
    const [menu, setMenu] = useState(false);
    const links = [
        ['Shop', 'shop'],
        ['Lookbook', 'lookbook'],
        ['Drop 08', 'next'],
    ];
    const go = (id) => (e) => {
        e.preventDefault();
        setMenu(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <>
            <div className="bg-[var(--v-accent)] py-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--v-ink)]">
                <Marquee items={['Drop 07 is live', `Free shipping over ${inr(FREE_SHIPPING)}`, 'Returns within 14 days', 'Made in Tiruppur']} speed={30} mark={<span aria-hidden="true">✦</span>} />
            </div>
            <header className="sticky top-0 z-40 border-b border-[var(--v-ink)] bg-[var(--v-bg)]">
                <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setMenu(true)} aria-label="Open menu" className="-ml-2 grid h-10 w-10 place-items-center md:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                        <nav aria-label="Main" className="hidden md:block">
                            <ul className="flex gap-7 text-[13px] font-semibold uppercase tracking-[0.1em]">
                                {links.map(([l, id]) => (
                                    <li key={id}>
                                        <a href={`#${id}`} onClick={go(id)} className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[var(--v-accent)] after:transition-transform after:duration-300 hover:after:scale-x-100">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <a href="#top" className="text-[2rem] uppercase leading-none tracking-[0.02em]" style={anton}>
                        Volta
                    </a>
                    <div className="flex items-center justify-end gap-1">
                        <button type="button" aria-label="Search" className="hidden h-10 w-10 place-items-center sm:grid">
                            <Search className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={() => dispatch({ type: 'open', open: true })} className="relative -mr-2 flex h-10 items-center gap-2 px-2 text-[13px] font-semibold uppercase tracking-[0.1em]" aria-label={`Cart, ${count} items`}>
                            <ShoppingBag className="h-5 w-5" />
                            <span className="hidden sm:inline">Cart</span>
                            <AnimatePresence mode="popLayout">
                                <motion.span key={count} initial={{ scale: 0.4, y: -6 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--v-ink)] px-1 text-[11px] text-[var(--v-bg)]">
                                    {count}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {menu && (
                    <>
                        <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
                        <motion.nav aria-label="Mobile" className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col bg-[var(--v-accent)] p-5" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.5, ease: WIPE }}>
                            <button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="-ml-2 grid h-10 w-10 place-items-center">
                                <X className="h-5 w-5" />
                            </button>
                            <ul className="mt-8">
                                {links.map(([l, id], i) => (
                                    <li key={id} className="overflow-hidden">
                                        <motion.a href={`#${id}`} onClick={go(id)} initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.06 }} className="block text-[3.6rem] uppercase leading-[1.05]" style={anton}>
                                            {l}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-auto text-sm font-medium">Studio and shop, Indiranagar, Bengaluru</p>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

/* ---------- product grid: skeleton wave while a category "loads" ---------- */
function ProductCard({ p, i }) {
    const { dispatch } = useCart();
    const [added, setAdded] = useState(null);
    const add = (size) => {
        dispatch({ type: 'add', id: p.id, size });
        setAdded(size);
        setTimeout(() => setAdded(null), 1200);
    };
    return (
        <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--v-tile)]">
                <img src={photo(p.img, 700)} alt={`${p.name} in ${p.colour.toLowerCase()}`} loading="lazy" decoding="async" style={{ objectPosition: p.pos }} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
                {i === 0 && <span className="absolute left-3 top-3 bg-[var(--v-accent)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">New</span>}
                <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-[var(--v-bg)] p-2 transition-transform duration-300 ease-out group-focus-within:translate-y-0 group-hover:translate-y-0 lg:block">
                    <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--v-muted)]">Quick add</p>
                    <div className="grid grid-cols-4 gap-1">
                        {SIZES.map((s) => (
                            <button key={s} type="button" onClick={() => add(s)} className="h-9 border border-[var(--v-ink)] text-[13px] font-semibold transition-colors hover:bg-[var(--v-ink)] hover:text-[var(--v-bg)]">
                                {added === s ? '✓' : s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-semibold">{p.name}</h3>
                    <p className="text-[13px] text-[var(--v-muted)]">{p.colour}</p>
                </div>
                <p className="shrink-0 text-[15px] font-semibold tabular-nums">{inr(p.price)}</p>
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-1 lg:hidden">
                {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => add(s)} aria-label={`Add ${p.name}, size ${s}`} className="h-9 border border-[var(--v-line)] text-[12px] font-semibold active:bg-[var(--v-ink)] active:text-[var(--v-bg)]">
                        {added === s ? '✓' : s}
                    </button>
                ))}
            </div>
        </motion.article>
    );
}

function Shop() {
    const [cat, setCat] = useState('All');
    const [loading, setLoading] = useState(true);
    const grid = useRef(null);
    const seen = useInView(grid, { once: true, margin: '0px 0px -15% 0px' });
    // The first load waits until the grid is on screen, so the skeleton is actually seen.
    useEffect(() => {
        setLoading(true);
        if (!seen) return undefined;
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, [cat, seen]);
    const items = useMemo(() => (cat === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)), [cat]);
    return (
        <section id="shop" className="scroll-mt-20 px-4 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-[1600px]">
                <div className="flex flex-col gap-6 border-b border-[var(--v-ink)] pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <h2 className="text-[clamp(3rem,8vw,6.5rem)] uppercase leading-[0.85]" style={anton}>
                        Drop 07
                    </h2>
                    <div className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist" aria-label="Category">
                        {CATS.map((c) => (
                            <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className="relative shrink-0 px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.08em]">
                                {cat === c && <motion.span layoutId="vt-cat" className="absolute inset-0 bg-[var(--v-ink)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                                <span className={`relative transition-colors ${cat === c ? 'text-[var(--v-bg)]' : ''}`}>{c}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div ref={grid} className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4" aria-busy={loading} aria-live="polite">
                    {loading
                        ? Array.from({ length: Math.max(items.length, 4) }, (_, i) => (
                              <div key={`b${i}`}>
                                  <div className="vt-bone aspect-[3/4]" style={{ animationDelay: `${i * 0.12}s` }} />
                                  <div className="vt-bone mt-3 h-3.5 w-2/3" style={{ animationDelay: `${i * 0.12 + 0.05}s` }} />
                                  <div className="vt-bone mt-2 h-3 w-1/3" style={{ animationDelay: `${i * 0.12 + 0.1}s` }} />
                              </div>
                          ))
                        : items.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
                </div>
            </div>
        </section>
    );
}

/* ---------- cart drawer ---------- */
function CartDrawer() {
    const { open, lines, total, count, dispatch } = useCart();
    const close = () => dispatch({ type: 'open', open: false });
    useEffect(() => {
        if (!open) return undefined;
        const esc = (e) => e.key === 'Escape' && dispatch({ type: 'open', open: false });
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', esc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', esc);
        };
    }, [open, dispatch]);
    const left = Math.max(0, FREE_SHIPPING - total);
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
                    <motion.aside role="dialog" aria-modal="true" aria-label="Cart" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--v-bg)]" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.5, ease: WIPE }}>
                        <div className="flex h-16 items-center justify-between border-b border-[var(--v-ink)] px-5">
                            <h2 className="text-2xl uppercase" style={anton}>
                                Cart ({count})
                            </h2>
                            <button type="button" onClick={close} aria-label="Close cart" className="-mr-2 grid h-10 w-10 place-items-center">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="border-b border-[var(--v-line)] px-5 py-4">
                            <p className="text-[13px] font-medium">{left ? `${inr(left)} more for free shipping` : 'Shipping is on us'}</p>
                            <div className="mt-2 h-1.5 bg-[var(--v-tile)]">
                                <motion.div className="h-full bg-[var(--v-accent)]" animate={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5">
                            {lines.length === 0 ? (
                                <div className="grid h-full place-items-center text-center">
                                    <div>
                                        <p className="text-[2.4rem] uppercase leading-none" style={anton}>
                                            Nothing yet
                                        </p>
                                        <p className="mt-2 text-sm text-[var(--v-muted)]">Pick a size on any piece to add it.</p>
                                    </div>
                                </div>
                            ) : (
                                <ul>
                                    <AnimatePresence initial={false}>
                                        {lines.map((l) => (
                                            <motion.li key={l.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0 }} transition={{ duration: 0.35, ease: EASE }} className="flex gap-4 border-b border-[var(--v-line)] py-4">
                                                <img src={photo(l.product.img, 200)} alt="" style={{ objectPosition: l.product.pos }} className="h-24 w-[4.5rem] shrink-0 object-cover" />
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <div className="flex justify-between gap-3">
                                                        <p className="truncate text-[15px] font-semibold">{l.product.name}</p>
                                                        <p className="shrink-0 text-[15px] font-semibold tabular-nums">{inr(l.product.price * l.qty)}</p>
                                                    </div>
                                                    <p className="text-[13px] text-[var(--v-muted)]">
                                                        {l.product.colour}, size {l.size}
                                                    </p>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <div className="flex items-center border border-[var(--v-line)]">
                                                            <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, by: -1 })} aria-label="One less" className="grid h-8 w-8 place-items-center">
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="w-7 text-center text-[13px] font-semibold tabular-nums">{l.qty}</span>
                                                            <button type="button" onClick={() => dispatch({ type: 'qty', key: l.key, by: 1 })} aria-label="One more" className="grid h-8 w-8 place-items-center">
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                        <button type="button" onClick={() => dispatch({ type: 'remove', key: l.key })} className="text-[12px] font-medium text-[var(--v-muted)] underline underline-offset-4 hover:text-[var(--v-ink)]">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>
                        <div className="border-t border-[var(--v-ink)] p-5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
                            <div className="flex justify-between text-[15px] font-semibold">
                                <span>Subtotal</span>
                                <span className="tabular-nums">{inr(total)}</span>
                            </div>
                            <button type="button" disabled={!count} className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-[var(--v-ink)] text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--v-bg)] transition-colors hover:bg-[var(--v-accent)] hover:text-[var(--v-ink)] disabled:opacity-40">
                                Checkout <ArrowRight className="h-4 w-4" />
                            </button>
                            <p className="mt-3 text-center text-[12px] text-[var(--v-muted)]">UPI, cards and cash on delivery. This is a demo store.</p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

/* ---------- lookbook: drag the strip sideways ---------- */
const LOOKS = [
    ['photo-1515886657613-9f3515b0c78f', 'Look 01, track pant in yolk'],
    ['photo-1529139574466-a303027c1d8b', 'Look 02, signal tee'],
    ['photo-1509631179647-0177331693ae', 'Look 03, stripe trouser'],
    ['photo-1517841905240-472988babdf9', 'Look 04, heavy hoodie and overshirt'],
    ['photo-1469334031218-e382a71b716b', 'Look 05, crop knit and shades'],
    ['photo-1483985988355-763728e1935b', 'Look 06, wool long coat'],
];
function Lookbook() {
    const wrap = useRef(null);
    const strip = useRef(null);
    const [left, setLeft] = useState(0);
    useEffect(() => {
        const m = () => setLeft(Math.min(0, (wrap.current?.offsetWidth ?? 0) - (strip.current?.scrollWidth ?? 0)));
        m();
        window.addEventListener('resize', m);
        return () => window.removeEventListener('resize', m);
    }, []);
    return (
        <section id="lookbook" className="scroll-mt-20 overflow-hidden bg-[var(--v-ink)] py-20 text-[var(--v-bg)] sm:py-28">
            <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-4 sm:px-8">
                <h2 className="text-[clamp(3rem,8vw,6.5rem)] uppercase leading-[0.85]" style={anton}>
                    Lookbook
                </h2>
                <p className="hidden max-w-xs pb-2 text-sm text-[var(--v-bg)]/70 sm:block">Shot on the rooftops of Shivajinagar in April. Drag to see all six looks.</p>
            </div>
            <div ref={wrap} className="mt-10 cursor-grab px-4 active:cursor-grabbing sm:px-8">
                <motion.ul ref={strip} drag="x" dragConstraints={{ left, right: 0 }} dragElastic={0.08} className="flex w-max gap-3 sm:gap-5">
                    {LOOKS.map(([id, cap], i) => (
                        <li key={id + i} className="w-[68vw] shrink-0 sm:w-[38vw] lg:w-[26vw]">
                            <div className={`overflow-hidden ${i % 2 ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
                                <img src={photo(id, 900)} alt={cap} draggable="false" loading="lazy" decoding="async" className="pointer-events-none h-full w-full object-cover" />
                            </div>
                            <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--v-bg)]/75">{cap}</p>
                        </li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}

/* ---------- next drop countdown, digits roll ---------- */
function Digit({ value }) {
    return (
        <span className="relative inline-block h-[1em] overflow-hidden align-top">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={value} className="block" initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.45, ease: EASE }}>
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
function Countdown() {
    const target = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 9);
        d.setHours(18, 0, 0, 0);
        return d.getTime();
    }, []);
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);
    const s = Math.max(0, Math.floor((target - now) / 1000));
    const parts = [
        ['Days', Math.floor(s / 86400)],
        ['Hours', Math.floor((s % 86400) / 3600)],
        ['Min', Math.floor((s % 3600) / 60)],
        ['Sec', s % 60],
    ];
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    return (
        <section id="next" className="scroll-mt-20 px-4 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-2 lg:items-end">
                <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--v-muted)]">Drop 08 lands in</p>
                    <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
                        {parts.map(([l, v]) => (
                            <div key={l} className="border-t-2 border-[var(--v-ink)] pt-3">
                                <p className="text-[clamp(3rem,10vw,7rem)] leading-none tabular-nums" style={anton}>
                                    {String(v)
                                        .padStart(2, '0')
                                        .split('')
                                        .map((d, i) => (
                                            <Digit key={i} value={d} />
                                        ))}
                                </p>
                                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--v-muted)]">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[var(--v-accent)] p-6 sm:p-10">
                    <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] uppercase leading-[0.98]" style={anton}>
                        Get it before it sells out
                    </h2>
                    <p className="mt-3 max-w-md text-[15px]">One email the night before each drop, with a link that opens an hour early. Nothing else.</p>
                    {sent ? (
                        <p className="mt-6 text-[15px] font-semibold">You are on the list. See you on drop night.</p>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSent(true);
                            }}
                            className="mt-6 flex flex-col gap-2 sm:flex-row"
                        >
                            <label htmlFor="vt-email" className="sr-only">
                                Email
                            </label>
                            <input id="vt-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" className="h-14 w-full min-w-0 border-2 sm:w-auto sm:flex-1 border-[var(--v-ink)] bg-transparent px-4 text-[15px] font-medium outline-none placeholder:text-[var(--v-ink)]/50 focus:bg-[var(--v-bg)]" />
                            <button type="submit" className="h-14 bg-[var(--v-ink)] px-6 text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--v-bg)]">
                                Notify me
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ---------- page ---------- */
function Page() {
    const reduce = useReducedMotion();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        document.title = 'Volta, Drop 07';
    }, []);
    const words = ['Loud', 'colour', 'for', 'long', 'summers'];
    const hero = [
        ['photo-1515886657613-9f3515b0c78f', 'Model in yellow track pants by a basketball hoop', 'aspect-[3/4]'],
        ['photo-1529139574466-a303027c1d8b', 'Model in a red tee and black jacket', 'aspect-[3/4] sm:mt-16'],
        ['photo-1509631179647-0177331693ae', 'Model in striped trousers against a teal wall', 'hidden aspect-[3/4] sm:block sm:mt-6'],
    ];
    return (
        <div id="top" className="vt min-h-dvh overflow-x-clip bg-[var(--v-bg)] text-[var(--v-ink)] antialiased" style={vars}>
            <style>{CSS}</style>
            {!ready && <Loader onDone={() => setReady(true)} />}
            <Nav />

            {/* Hero */}
            <section className="px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
                <div className="mx-auto max-w-[1600px]">
                    <h1 className="flex flex-wrap gap-x-[0.22em] text-[clamp(3.4rem,11.5vw,11rem)] uppercase leading-[0.94]" style={anton} aria-label={words.join(' ')}>
                        {words.map((w, i) => (
                            <span key={w} className="overflow-hidden" aria-hidden="true">
                                <motion.span className={`block ${w === 'colour' ? 'text-[var(--v-accent)]' : ''}`} initial={reduce ? false : { y: '100%' }} animate={ready ? { y: '0%' } : undefined} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}>
                                    {w}
                                </motion.span>
                            </span>
                        ))}
                    </h1>
                    <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} className="lg:col-span-3">
                            <p className="max-w-xs text-[15px] leading-relaxed">Drop 07 is eight pieces in heavy cotton and washed denim, cut and sewn in Tiruppur. When it is gone, it is gone.</p>
                            <a href="#shop" className="group mt-6 inline-flex h-14 items-center gap-3 bg-[var(--v-ink)] px-6 text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--v-bg)] transition-colors hover:bg-[var(--v-accent)] hover:text-[var(--v-ink)]">
                                Shop the drop <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:col-span-9">
                            {hero.map(([id, alt, cls], i) => (
                                <motion.div key={id} className={`overflow-hidden bg-[var(--v-tile)] ${cls}`} initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }} animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined} transition={{ duration: 1.1, ease: WIPE, delay: 0.3 + i * 0.12 }}>
                                    <motion.img src={photo(id, 900)} alt={alt} className="h-full w-full object-cover" initial={reduce ? false : { scale: 1.25 }} animate={ready ? { scale: 1 } : undefined} transition={{ duration: 1.6, ease: EASE, delay: 0.3 + i * 0.12 }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-y border-[var(--v-ink)] py-4 text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none" style={anton}>
                <Marquee items={['Heavy cotton', 'Washed denim', 'Cut in Tiruppur', 'Eight pieces only']} speed={26} mark={<span aria-hidden="true" className="inline-block h-4 w-4 rounded-full bg-[var(--v-accent)] sm:h-6 sm:w-6" />} />
            </div>

            <Shop />
            <Lookbook />
            <Countdown />

            <footer className="overflow-hidden border-t border-[var(--v-ink)] px-4 pt-12 sm:px-8">
                <div className="mx-auto grid max-w-[1600px] gap-8 text-[14px] sm:grid-cols-3">
                    <p className="max-w-xs">Studio and shop at 12th Main, Indiranagar, Bengaluru. Open Thursday to Sunday, 12 to 8.</p>
                    <ul className="space-y-1.5 font-medium">
                        {['Shipping and returns', 'Size guide', 'Care', 'Contact'].map((l) => (
                            <li key={l}>
                                <a href="#top" className="hover:text-[var(--v-accent)]">
                                    {l}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ul className="space-y-1.5 font-medium">
                        {['Instagram', 'WhatsApp', 'Spotify'].map((l) => (
                            <li key={l}>
                                <a href="#top" className="hover:text-[var(--v-accent)]">
                                    {l}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="mt-10 select-none text-center text-[34vw] uppercase leading-[0.78] text-[var(--v-accent)]" style={anton} aria-hidden="true">
                    Volta
                </p>
            </footer>
            <CartDrawer />
            <BackPill />
        </div>
    );
}

export default function Volta() {
    useFonts(FONTS);
    return (
        <CartProvider>
            <Page />
        </CartProvider>
    );
}
