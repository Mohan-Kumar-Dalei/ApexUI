import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Heart, Plus, ShoppingBag } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade.jsx';
import { img, inr, useApi, useBag, useWish } from '../lib.jsx';
import { u } from '../base.js';

/*
 * Try the look: eight styled looks on a stage (the centre one sharp, the others stepping
 * back and blurring), and an "In this look" panel where every piece can be bought on its
 * own, or the whole look at 10% off (the server checks that every piece is there).
 */

const EASE = [0.16, 1, 0.3, 1];
const SIZES = ['34', '36', '38', '40', '42'];
const BLOUSE = 1450;
const FINISH = 250;

function Piece({ n, thumb, label, name, price, slug, onAdd, added, children }) {
    const wish = useWish();
    return (
        <li className="flex gap-4 py-4">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-tn-surface">
                <img src={thumb} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-1 top-1 text-[10px] font-semibold text-tn-ink/70 tnum">{n}</span>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-tn-muted">{label}</p>
                {slug ? (
                    <Link to={u(`/saree/${slug}`)} className="mt-0.5 block text-[15px] font-medium leading-snug hover:underline">
                        {name}
                    </Link>
                ) : (
                    <p className="mt-0.5 text-[15px] font-medium leading-snug">{name}</p>
                )}
                <p className="text-[14px] text-tn-muted tnum">{price}</p>
                {children}
            </div>
            <div className="flex shrink-0 items-start gap-0.5 pt-5">
                {slug && (
                    <button type="button" aria-label={wish.has(slug) ? `Remove ${name} from wishlist` : `Save ${name}`} aria-pressed={wish.has(slug)} onClick={() => wish.toggle(slug)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-tn-surface">
                        <Heart className={`h-4 w-4 ${wish.has(slug) ? 'fill-tn-accent text-tn-accent' : ''}`} />
                    </button>
                )}
                {onAdd && (
                    <button type="button" aria-label={`Add ${name} to bag`} onClick={onAdd} className="grid h-9 w-9 place-items-center rounded-full hover:bg-tn-surface">
                        {added ? <Check className="h-4 w-4 text-tn-veg" /> : <Plus className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </li>
    );
}

export default function TryTheLook() {
    const { data } = useApi('/looks');
    const looks = data?.looks ?? [];
    const off = data?.lookOff ?? 10;
    const [at, setAt] = useState(0);
    const [size, setSize] = useState('');
    const [needSize, setNeedSize] = useState(false);
    const [added, setAdded] = useState({});
    const bag = useBag();
    const wish = useWish();
    const drag = useRef(null);
    const n = looks.length;
    useEffect(() => {
        setAdded({});
        setNeedSize(false);
    }, [at]);
    if (!n) return <section id="look" className="h-[90svh] bg-tn-card" aria-label="Loading the looks" />;

    const go = (d) => setAt((a) => (a + d + n) % n);
    const look = looks[at];
    const s = look.saree;
    const full = s.price + BLOUSE + FINISH + look.pieces.reduce((t, p) => t + p.price, 0);
    const deal = full - Math.round((full * off) / 100);
    const mark = (k) => setAdded((a) => ({ ...a, [k]: true }));

    const addWhole = () => {
        if (!size) return setNeedSize(true);
        bag.addMany([[s, { blouse: 'stitched', blouseSize: size, fallPico: true, look: look.id }], ...look.pieces.map((p) => [p, { look: look.id }])]);
        mark('all');
    };

    return (
        <section id="look" className="border-y border-tn-line bg-tn-card">
            <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_420px]">
                <div className="flex min-w-0 flex-col overflow-hidden px-5 pb-8 pt-20 sm:px-10 sm:pt-24">
                    <BlurFade inView>
                        <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-tn-muted">
                            <span className="h-px w-8 bg-tn-accent" /> Styled head to toe
                        </p>
                        <h2 className="mt-4 text-[clamp(2.8rem,6vw,5.4rem)] leading-none">
                            Try the <span className="text-tn-accent">look.</span>
                        </h2>
                        <p className="mt-4 max-w-lg text-[1.05rem] text-tn-muted">Eight looks, styled head to toe. Tap a look to see every piece in it.</p>
                    </BlurFade>

                    {/* the stage */}
                    <div
                        className="relative mt-6 h-[min(64svh,600px)] min-h-[380px] touch-pan-y select-none"
                        onPointerDown={(e) => (drag.current = e.clientX)}
                        onPointerUp={(e) => {
                            if (drag.current == null) return;
                            const dx = e.clientX - drag.current;
                            drag.current = null;
                            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                        }}
                        onWheel={(e) => {
                            if (Math.abs(e.deltaX) > 30 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) go(e.deltaX > 0 ? 1 : -1);
                        }}
                        aria-roledescription="carousel"
                        aria-label="Looks"
                    >
                        {looks.map((l, i) => {
                            let o = i - at;
                            if (o > n / 2) o -= n;
                            if (o < -n / 2) o += n;
                            const a = Math.abs(o);
                            return (
                                <motion.button
                                    type="button"
                                    key={l.id}
                                    aria-label={`Look ${i + 1}, ${l.saree.name}`}
                                    aria-current={o === 0}
                                    onClick={() => o !== 0 && go(o)}
                                    initial={false}
                                    animate={{ x: `calc(-50% + ${o * 78}%)`, y: a * 18, scale: 1 - Math.min(a, 3) * 0.17, opacity: a > 2 ? 0 : 1 - a * 0.22, filter: `blur(${Math.min(a, 2) * 2.5}px)`, zIndex: 10 - a }}
                                    transition={{ duration: 0.85, ease: EASE }}
                                    className="absolute bottom-0 left-1/2 h-full w-[min(56%,300px)] origin-bottom"
                                    style={{ pointerEvents: a > 2 ? 'none' : 'auto' }}
                                >
                                    <img src={img(l.photo, 620, 1000)} alt="" draggable={false} className="h-full w-full rounded-[26px] object-cover shadow-[0_40px_50px_-38px_rgba(28,23,20,0.7)]" />
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* counter and arrows */}
                    <div className="mt-8 flex items-center gap-4">
                        <button type="button" onClick={() => go(-1)} aria-label="Previous look" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-tn-surface">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="min-w-0 flex-1">
                            <div className="relative h-px bg-tn-line">
                                <motion.span className="absolute top-[-1px] h-[3px] rounded-full bg-tn-ink" animate={{ left: `${(at / n) * 100}%` }} style={{ width: `${100 / n}%` }} transition={{ duration: 0.6, ease: EASE }} />
                            </div>
                            <p className="mt-3 flex justify-between gap-4 text-[13px] text-tn-muted" aria-live="polite">
                                <span className="truncate">
                                    <span className="text-tn-ink tnum">
                                        {at + 1} of {n}
                                    </span>{' '}
                                    · {s.name}
                                </span>
                                <span className="hidden shrink-0 items-center gap-2 sm:flex">
                                    <span className="h-1.5 w-1.5 rounded-full bg-tn-accent" /> Swipe or drag
                                </span>
                            </p>
                        </div>
                        <button type="button" onClick={() => go(1)} aria-label="Next look" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-tn-surface">
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* in this look */}
                <aside className="border-t border-tn-line px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:py-14">
                    <p className="text-[15px] font-medium">In this look</p>
                    <AnimatePresence mode="wait">
                        <motion.div key={look.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                            <ul className="mt-3 divide-y divide-tn-line border-y border-tn-line">
                                <Piece n={1} thumb={img(s.images[0], 150, 150)} label={`Taana · ${s.weave} saree`} name={s.name} price={inr(s.price)} slug={s.slug} added={added.saree} onAdd={() => (bag.add(s, { blouse: size ? 'stitched' : 'unstitched', blouseSize: size || undefined, fallPico: true }), mark('saree'))} />
                                <Piece n={2} thumb={img(s.images[1] ?? s.images[0], 150, 150)} label="Taana · blouse" name="Blouse stitched to your size" price={`+ ${inr(BLOUSE)}, with fall and pico + ${inr(FINISH)}`}>
                                    <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Blouse size">
                                        {SIZES.map((z) => (
                                            <button key={z} type="button" aria-pressed={size === z} onClick={() => (setSize(z), setNeedSize(false))} className={`grid h-8 w-10 place-items-center rounded-full border text-[12px] tnum ${size === z ? 'border-tn-ink bg-tn-ink text-tn-bg' : needSize ? 'border-tn-accent' : 'border-tn-line hover:border-tn-ink'}`}>
                                                {z}
                                            </button>
                                        ))}
                                    </div>
                                    {needSize && <p className="mt-1.5 text-[12px] text-tn-accent">Pick a blouse size first.</p>}
                                </Piece>
                                {look.pieces.map((p, i) => (
                                    <Piece key={p.slug} n={i + 3} thumb={img(p.images[0], 150, 150)} label="Taana · jewellery" name={p.name} price={inr(p.price)} slug={p.slug} added={added[p.slug]} onAdd={() => (bag.add(p, {}), mark(p.slug))} />
                                ))}
                            </ul>
                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-[15px]">Complete the look</p>
                                    <p className="text-[13px] text-tn-muted">
                                        All {look.pieces.length + 2} pieces · save {off}%
                                    </p>
                                </div>
                                <p className="text-right">
                                    <span className="mr-2 text-[14px] text-tn-muted line-through tnum">{inr(full)}</span>
                                    <span className="text-2xl tnum">{inr(deal)}</span>
                                </p>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <button type="button" onClick={addWhole} disabled={s.stock === 0} className="flex h-14 flex-1 items-center justify-between rounded-full bg-tn-accent pl-7 pr-2 font-medium text-tn-on-accent disabled:opacity-40">
                                    {added.all ? 'Look added to your bag' : 'Add full look to bag'}
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-tn-on-accent text-tn-accent">{added.all ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}</span>
                                </button>
                                <button type="button" aria-label={wish.has(s.slug) ? 'Remove the saree from wishlist' : 'Save the saree'} aria-pressed={wish.has(s.slug)} onClick={() => wish.toggle(s.slug)} className="grid h-14 w-14 place-items-center rounded-full border border-tn-line">
                                    <Heart className={`h-5 w-5 ${wish.has(s.slug) ? 'fill-tn-accent text-tn-accent' : ''}`} />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </aside>
            </div>
        </section>
    );
}
