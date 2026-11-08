/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import gsap from 'gsap';
import { getLenis, img, inr, reduced, useBag, useScrollLock, useWish } from './lib.jsx';
import { isPage, u } from './base.js';

const EASE = [0.16, 1, 0.3, 1];

export const LINKS = [
    ['Home', '/'],
    ['Try the look', '/#look'],
    ['Pick a silk', '/#silk'],
    ['The rail', '/#rail'],
    ['Bridal', '/#bridal'],
    ['Sarees', '/sarees'],
];

export function Wordmark({ className = '' }) {
    return <span className={`font-tn-display text-[1.9rem] leading-none tracking-[-0.03em] ${className}`}>taana</span>;
}

// Hash links ("/#weaves") scroll smoothly once the home page is there.
function useGo() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (to) => {
        const [path, hash] = to.split('#');
        const scroll = () => {
            const el = hash && document.getElementById(hash);
            if (!el) return;
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(el, { offset: -72 });
            else el.scrollIntoView({ behavior: 'smooth' });
        };
        if (hash && isPage(pathname, path || '/')) return scroll();
        navigate(u(path || '/'));
        if (hash) setTimeout(scroll, 450);
    };
}

/* ---------------- the glass pill nav ----------------
 * Floats over the page. On the home hero it is dark glass with white text; once the
 * page scrolls past the hero it turns ivory glass with ink text.
 */
export function Nav() {
    const bag = useBag();
    const wish = useWish();
    const go = useGo();
    const { pathname, hash } = useLocation();
    const [overHero, setOverHero] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [menu, setMenu] = useState(false);
    const [bump, setBump] = useState(0);
    const first = useRef(true);
    useScrollLock(menu);
    const home = isPage(pathname, '/');

    useEffect(() => {
        let last = scrollY;
        const on = () => {
            const y = scrollY;
            setOverHero(y < innerHeight - 90);
            setHidden(y > last && y > innerHeight);
            last = y;
        };
        on();
        addEventListener('scroll', on, { passive: true });
        return () => removeEventListener('scroll', on);
    }, []);
    useEffect(() => {
        if (first.current) return void (first.current = false);
        setBump((b) => b + 1);
    }, [bag.count]);
    useEffect(() => {
        if (!menu) return undefined;
        const esc = (e) => e.key === 'Escape' && setMenu(false);
        addEventListener('keydown', esc);
        return () => removeEventListener('keydown', esc);
    }, [menu]);

    const dark = home && overHero && !menu;
    const active = (to) => (to === '/' ? home && !hash : u(to) === pathname || u(to) === `${pathname}${hash}`);
    const icon = `grid h-11 w-11 place-items-center rounded-full border transition-colors ${dark ? 'border-white/25 hover:bg-white/10' : 'border-tn-line hover:bg-tn-surface'}`;

    return (
        <>
            <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-5 sm:pt-4 ${hidden && !menu ? '-translate-y-[130%]' : ''}`}>
                <div className={`mx-auto flex h-16 max-w-[1400px] items-center gap-3 rounded-full border pl-5 pr-2 backdrop-blur-xl transition-colors duration-500 sm:h-[72px] sm:pl-7 ${dark ? 'border-white/20 bg-black/35 text-white' : 'border-tn-line bg-tn-bg/85 text-tn-ink shadow-[0_10px_40px_-20px_rgba(28,23,20,0.35)]'}`}>
                    <Link to={u('/')} aria-label="Taana home" onClick={() => setMenu(false)} className="flex shrink-0 flex-col items-center leading-none">
                        <Wordmark className="text-[1.75rem]" />
                        <span className={`mt-0.5 text-[8px] font-semibold uppercase tracking-[0.32em] ${dark ? 'text-white/70' : 'text-tn-muted'}`}>Handwoven</span>
                    </Link>
                    <nav aria-label="Main" className="mx-auto hidden items-center gap-1 lg:flex">
                        {LINKS.map(([label, to]) => (
                            <a
                                key={to}
                                href={u(to)}
                                onClick={(e) => (e.preventDefault(), go(to))}
                                aria-current={active(to) ? 'page' : undefined}
                                className={`rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors ${active(to) ? 'bg-[#E2C47E] text-tn-ink' : dark ? 'hover:bg-white/10' : 'hover:bg-tn-surface'}`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
                        <Link to={u('/account')} aria-label={`Your account${wish.list.length ? `, ${wish.list.length} saved` : ''}`} className={`${icon} relative hidden sm:grid`}>
                            <Heart className="h-[18px] w-[18px]" />
                            {wish.list.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-tn-accent px-1 text-[11px] text-tn-on-accent">{wish.list.length}</span>}
                        </Link>
                        <button type="button" onClick={() => bag.setOpen(true)} aria-label={`Bag, ${bag.count} items`} className={`${icon} relative`}>
                            <ShoppingBag className="h-[18px] w-[18px]" />
                            {bag.count > 0 && (
                                <motion.span key={bump} initial={bump ? { scale: 1.6 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-tn-accent px-1 text-[11px] text-tn-on-accent tnum">
                                    {bag.count}
                                </motion.span>
                            )}
                        </button>
                        <Link to={u('/video-call')} className="hidden h-12 items-center gap-3 rounded-full bg-tn-accent pl-5 pr-1.5 text-[15px] font-medium text-tn-on-accent md:flex">
                            Book a video call
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-tn-on-accent text-tn-accent">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                        <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'} className={`${icon} lg:hidden`}>
                            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* phone menu: big links arriving one after another */}
            <AnimatePresence>
                {menu && (
                    <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: EASE }} className="fixed inset-0 z-40 flex flex-col bg-tn-bg px-6 pb-10 pt-28 lg:hidden">
                        <nav aria-label="Menu" className="flex flex-col">
                            {[...LINKS, ['Video call', '/video-call'], ['Your account', '/account']].map(([l, to], i) => (
                                <motion.a
                                    key={to}
                                    href={u(to)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMenu(false);
                                        go(to);
                                    }}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: EASE }}
                                    className="border-b border-tn-line py-3.5 font-tn-display text-[2.1rem] leading-none"
                                >
                                    {l}
                                </motion.a>
                            ))}
                        </nav>
                        <p className="mt-auto text-[15px] text-tn-muted">Video calls Monday to Saturday, 11 am to 7 pm. Write to hello@taana.example.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ---------------- bag drawer ---------------- */
export function BagDrawer() {
    const bag = useBag();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    useScrollLock(bag.open);
    useEffect(() => {
        if (!bag.open) return undefined;
        const esc = (e) => e.key === 'Escape' && bag.setOpen(false);
        addEventListener('keydown', esc);
        return () => removeEventListener('keydown', esc);
    }, [bag]);
    const t = bag.quote?.totals;

    return (
        <AnimatePresence>
            {bag.open && (
                <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button type="button" aria-label="Close bag" className="absolute inset-0 bg-black/40" onClick={() => bag.setOpen(false)} />
                    <motion.aside role="dialog" aria-modal="true" aria-label="Your bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: EASE }} className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-tn-bg shadow-2xl">
                        <div className="flex items-center justify-between border-b border-tn-line px-6 py-5">
                            <h2 className="text-3xl">Your bag</h2>
                            <button type="button" onClick={() => bag.setOpen(false)} aria-label="Close bag" className="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-tn-surface">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {bag.items.length === 0 ? (
                            <div className="flex flex-1 flex-col items-start justify-center px-6">
                                <p className="font-tn-display text-2xl">Nothing on the loom yet.</p>
                                <p className="mt-2 text-tn-muted">Every saree here is woven by hand in small numbers. Have a look.</p>
                                <button type="button" onClick={() => (bag.setOpen(false), navigate(u('/sarees')))} className="mt-6 h-12 rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                                    See the sarees
                                </button>
                            </div>
                        ) : (
                            <>
                                <ul className="flex-1 divide-y divide-tn-line overflow-y-auto px-6" data-lenis-prevent>
                                    {bag.items.map((it) => (
                                        <li key={`${it.slug}${it.blouse}${it.blouseSize}${it.fallPico}${it.look}`} className="flex gap-4 py-5">
                                            <img src={img(it.image, 200, 260)} alt="" className="h-28 w-[86px] shrink-0 bg-tn-surface object-cover" />
                                            <div className="min-w-0 flex-1">
                                                <p className="label">{it.weave}</p>
                                                <p className="mt-1 font-tn-display text-lg leading-tight">{it.name}</p>
                                                <p className="mt-1 text-[13px] text-tn-muted">
                                                    {it.kind === 'jewellery' ? 'Jewellery' : `Blouse ${it.blouse === 'stitched' ? `stitched, size ${it.blouseSize}` : it.blouse === 'none' ? 'not needed' : 'piece, unstitched'}`}
                                                    {it.fallPico ? ', fall and pico done' : ''}
                                                    {it.look ? '. Part of a look' : ''}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center rounded-full border border-tn-line">
                                                        <button type="button" aria-label="One less" onClick={() => bag.setQty(it, it.qty - 1)} className="grid h-9 w-9 place-items-center">
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm tnum">{it.qty}</span>
                                                        <button type="button" aria-label="One more" disabled={it.qty >= 3} onClick={() => bag.setQty(it, it.qty + 1)} className="grid h-9 w-9 place-items-center disabled:opacity-30">
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                    <span className="tnum">{inr(it.price * it.qty)}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-tn-line px-6 py-5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            bag.setCoupon(code.trim().toUpperCase());
                                        }}
                                        className="flex gap-2"
                                    >
                                        <label htmlFor="bag-code" className="sr-only">
                                            Coupon code
                                        </label>
                                        <input id="bag-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="h-11 min-w-0 flex-1 rounded-full border border-tn-line bg-transparent px-4 uppercase placeholder:normal-case placeholder:text-tn-muted" />
                                        <button className="h-11 rounded-full border border-tn-ink px-5 text-[15px] font-medium">Apply</button>
                                    </form>
                                    {bag.quote?.coupon && <p className={`mt-2 text-[13px] ${bag.quote.coupon.ok ? 'text-tn-veg' : 'text-tn-accent'}`}>{bag.quote.coupon.label}</p>}
                                    {!bag.coupon && <p className="mt-2 text-[13px] text-tn-muted">First order? Try FIRSTDRAPE.</p>}
                                    <dl className="mt-4 space-y-1.5 text-[15px]">
                                        <Row k="Sarees" v={t ? inr(t.subtotal) : '…'} />
                                        {t?.services > 0 && <Row k="Stitching and finishing" v={inr(t.services)} />}
                                        {t?.lookDiscount > 0 && <Row k="Complete look, 10% off" v={`− ${inr(t.lookDiscount)}`} />}
                                        {t?.discount > 0 && <Row k="Coupon" v={`− ${inr(t.discount)}`} />}
                                        <Row k="Shipping" v={t ? (t.shipping ? inr(t.shipping) : 'Free') : '…'} />
                                        <div className="flex justify-between border-t border-tn-line pt-3 text-lg font-semibold">
                                            <dt>Total</dt>
                                            <dd className="tnum">{t ? inr(t.total) : '…'}</dd>
                                        </div>
                                    </dl>
                                    <button type="button" onClick={() => (bag.setOpen(false), navigate(u('/checkout')))} className="mt-5 h-14 w-full rounded-full bg-tn-accent text-[16px] font-medium text-tn-on-accent transition-transform hover:-translate-y-0.5">
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function Row({ k, v }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-tn-muted">{k}</dt>
            <dd className="tnum">{v}</dd>
        </div>
    );
}

/* ---------------- page loader: warp threads, then the weft crosses ---------------- */
export function Loader({ onDone }) {
    const ref = useRef(null);
    const done = useRef(onDone);
    const [show] = useState(() => {
        try {
            return !reduced() && !sessionStorage.getItem('taana-seen');
        } catch {
            return !reduced();
        }
    });
    useEffect(() => {
        if (!show) return void done.current();
        try {
            sessionStorage.setItem('taana-seen', '1');
        } catch {
            /* fine */
        }
        const el = ref.current;
        const tl = gsap.timeline({ onComplete: () => done.current() });
        tl.from(el.querySelectorAll('[data-warp]'), { scaleY: 0, transformOrigin: 'top', duration: 0.9, stagger: 0.05, ease: 'expo.out' })
            .from(el.querySelector('[data-weft]'), { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'expo.inOut' }, 0.45)
            .from(el.querySelector('[data-word]'), { yPercent: 110, duration: 0.9, ease: 'expo.out' }, 0.75)
            .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 1.9);
        return () => tl.kill();
    }, [show]);
    if (!show) return null;
    return (
        <div ref={ref} className="fixed inset-0 z-[100] grid place-items-center bg-tn-band text-tn-on-band" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden="true">
            <div className="relative flex h-44 w-64 items-center justify-center">
                <div className="absolute inset-0 flex justify-between px-2">
                    {Array.from({ length: 11 }, (_, i) => (
                        <span key={i} data-warp className="h-full w-px bg-tn-on-band/30" />
                    ))}
                </div>
                <span data-weft className="absolute inset-x-0 top-1/2 h-[3px] bg-tn-accent" />
                <span className="relative overflow-hidden bg-tn-band px-4 pb-1">
                    <span data-word className="block font-tn-display text-6xl leading-none">
                        taana
                    </span>
                </span>
            </div>
        </div>
    );
}

/* ---------------- footer ---------------- */
export function Footer() {
    const go = useGo();
    return (
        <footer className="bg-tn-band text-tn-on-band">
            <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-10 pt-20 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Wordmark className="text-5xl" />
                    <p className="mt-5 max-w-sm text-tn-band-muted">Handwoven sarees from nine weaving towns, bought straight from the looms that make them.</p>
                    <p className="mt-6 text-[15px]">hello@taana.example</p>
                    <p className="text-[15px] text-tn-band-muted">Video calls Mon to Sat, 11 am to 7 pm IST</p>
                </div>
                {[
                    ['Shop', [['All sarees', '/sarees'], ['Banarasi', '/sarees?weave=Banarasi'], ['Kanjivaram', '/sarees?weave=Kanjivaram'], ['Under ₹10,000', '/sarees?max=10000']]],
                    ['Help', [['Book a video call', '/video-call'], ['Track an order', '/account'], ['Care and storage', '/#care'], ['Your account', '/account']]],
                    ['Taana', [['The looms', '/#looms'], ['Our weaves', '/#weaves'], ['Shipping and returns', '/#care'], ['Privacy', '/#care']]],
                ].map(([h, links]) => (
                    <div key={h}>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tn-band-muted">{h}</p>
                        <ul className="mt-4 space-y-2.5">
                            {links.map(([l, to]) => (
                                <li key={l}>
                                    <a href={u(to)} onClick={(e) => (e.preventDefault(), go(to))} className="text-[15px] hover:underline">
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-tn-on-band/15 px-5 py-6 text-[13px] text-tn-band-muted sm:flex-row sm:justify-between sm:px-8">
                <span>© 2026 Taana Handlooms. A demo store: products, prices and orders are sample data, and the API runs in your browser.</span>
                <span>Built with the ApexUI premiumbrand skill</span>
            </div>
        </footer>
    );
}
