import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, X } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade.jsx';
import { inr, useBag, useScrollLock, useWish } from '../lib.jsx';
import { u } from '../base.js';

/*
 * "Every saree, on the rail": a 3D shop rail (three/RackScene) with weave filters.
 * Hover a saree to bring it forward, click to take it off the rail and see it up close.
 */
const RackScene = lazy(() => import('../three/RackScene.jsx'));
const HangerView = lazy(() => import('../three/HangerView.jsx'));
const EASE = [0.16, 1, 0.3, 1];

function Detail({ list, index, setIndex, onClose }) {
    const p = list[index];
    const bag = useBag();
    const wish = useWish();
    const [side, setSide] = useState('front');
    const [size, setSize] = useState('');
    const [added, setAdded] = useState(false);
    useScrollLock(true);
    useEffect(() => {
        setSide('front');
        setAdded(false);
    }, [index]);
    useEffect(() => {
        const key = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIndex((index + 1) % list.length);
            if (e.key === 'ArrowLeft') setIndex((index - 1 + list.length) % list.length);
        };
        addEventListener('keydown', key);
        return () => removeEventListener('keydown', key);
    }, [index, list.length, onClose, setIndex]);

    const add = () => {
        bag.add(p, { blouse: 'stitched', blouseSize: size, fallPico: true });
        setAdded(true);
    };

    return (
        <motion.div role="dialog" aria-modal="true" aria-label={p.name} className="fixed inset-0 z-[75] overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} data-lenis-prevent>
            {/* the rest of the page, rail included, goes soft behind the saree */}
            <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-tn-bg/70 backdrop-blur-xl" />
            <button type="button" onClick={onClose} className="fixed right-4 top-4 z-10 flex h-11 items-center gap-2 px-3 text-[12px] font-semibold uppercase tracking-[0.2em] sm:right-8 sm:top-6">
                Close <X className="h-4 w-4" />
            </button>
            {[
                [-1, 'left-2 sm:left-10', ArrowLeft, 'Previous saree'],
                [1, 'right-2 sm:right-10', ArrowRight, 'Next saree'],
            ].map(([d, pos, Icon, label]) => (
                <button key={d} type="button" aria-label={label} onClick={() => setIndex((index + d + list.length) % list.length)} className={`fixed top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-tn-ink/20 bg-tn-bg/80 hover:border-tn-ink ${pos}`}>
                    <Icon className="h-5 w-5" />
                </button>
            ))}
            <div className="pointer-events-none relative mx-auto flex min-h-full max-w-md flex-col items-center px-16 pb-10 pt-12 text-center">
                <Suspense fallback={<div className="h-[52svh] w-full" />}>
                    <HangerView key={p.slug} swatch={p.swatch} side={side} className="h-[52svh] min-h-[320px] w-full" />
                </Suspense>
                <div className="pointer-events-auto mt-2 w-full">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.2em]">{p.name}</p>
                    <p className="mt-1 text-[14px] text-tn-muted tnum">
                        {inr(p.price)} · {p.weave}, {p.loomDays} days on the loom
                    </p>
                    <div className="mt-5 inline-flex rounded-full border border-tn-line bg-tn-card p-1 text-[12px] font-semibold uppercase tracking-[0.14em]">
                        {['front', 'back'].map((v) => (
                            <button key={v} type="button" aria-pressed={side === v} onClick={() => setSide(v)} className={`h-8 rounded-full px-4 ${side === v ? 'bg-tn-ink text-tn-bg' : 'text-tn-muted'}`}>
                                {v}
                            </button>
                        ))}
                    </div>
                    <p className="mt-5 text-[12px] text-tn-muted">Blouse size, stitched with fall and pico</p>
                    <div className="mt-2 flex justify-center gap-2" role="group" aria-label="Blouse size">
                        {['34', '36', '38', '40', '42'].map((z) => (
                            <button key={z} type="button" aria-pressed={size === z} onClick={() => (setSize(z), setAdded(false))} className={`grid h-9 w-11 place-items-center rounded-full border text-[13px] tnum ${size === z ? 'border-tn-ink bg-tn-ink text-tn-bg' : 'border-tn-line bg-tn-card hover:border-tn-ink'}`}>
                                {z}
                            </button>
                        ))}
                    </div>
                    <div className="mt-5 flex justify-center gap-2">
                        <button type="button" disabled={!size || p.stock === 0} onClick={add} className="h-12 w-60 rounded-full bg-tn-ink text-[13px] font-semibold uppercase tracking-[0.16em] text-tn-bg transition-colors disabled:bg-tn-line disabled:text-tn-muted">
                            {p.stock === 0 ? 'Sold out' : added ? 'In your bag' : size ? `Add to bag, size ${size}` : 'Select a size'}
                        </button>
                        <button type="button" aria-pressed={wish.has(p.slug)} aria-label={wish.has(p.slug) ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => wish.toggle(p.slug)} className="grid h-12 w-12 place-items-center rounded-full border border-tn-line bg-tn-card">
                            <Heart className={`h-5 w-5 ${wish.has(p.slug) ? 'fill-tn-accent text-tn-accent' : ''}`} />
                        </button>
                    </div>
                    <Link to={u(`/saree/${p.slug}`)} onClick={onClose} className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4">
                        See it worn and delivery dates
                    </Link>
                    <p className="mt-3 text-[12px] text-tn-muted tnum">
                        {index + 1} of {list.length} on the rail
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function Rail({ products }) {
    const [weave, setWeave] = useState('All');
    const [hover, setHover] = useState(null);
    const [open, setOpen] = useState(-1);
    const [pan, setPan] = useState({ canLeft: false, canRight: false });
    const scene = useRef(null);
    const weaves = useMemo(() => {
        const m = new Map();
        products.forEach((p) => m.set(p.weave, (m.get(p.weave) || 0) + 1));
        return [['All', products.length], ...[...m].sort((a, b) => b[1] - a[1])];
    }, [products]);
    const shown = useMemo(() => products.filter((p) => weave === 'All' || p.weave === weave), [products, weave]);
    const visible = useMemo(() => shown.map((p) => p.slug), [shown]);

    return (
        <section id="rail" className="bg-tn-card py-24 sm:py-32">
            <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8">
                <BlurFade inView>
                    <p className="label">The collection</p>
                    <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">Every saree, on the rail.</h2>
                </BlurFade>
                <div className="no-bar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" data-lenis-prevent>
                    {weaves.map(([w, n]) => (
                        <button key={w} type="button" aria-pressed={weave === w} onClick={() => setWeave(w)} className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors ${weave === w ? 'border-tn-accent bg-tn-accent text-tn-on-accent' : 'border-tn-line bg-tn-card hover:border-tn-ink'}`}>
                            {w === 'All' ? 'All sarees' : w}
                            <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[12px] ${weave === w ? 'bg-tn-on-accent text-tn-accent' : 'bg-tn-surface'}`}>{n}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative mx-auto mt-6 h-[62svh] min-h-[420px] max-w-[1600px] sm:h-[70svh]">
                <Suspense fallback={<div className="bone h-full w-full" />}>
                    <RackScene ref={scene} products={products} visible={visible} onHover={setHover} onPan={setPan} onSelect={(p) => setOpen(shown.indexOf(p))} className="absolute inset-0" />
                </Suspense>
                {/* walk along the rail */}
                {[
                    [-1, 'left-3 sm:left-8', pan.canLeft, ArrowLeft, 'Earlier on the rail'],
                    [1, 'right-3 sm:right-8', pan.canRight, ArrowRight, 'Further along the rail'],
                ].map(([dir, pos, on, Icon, label]) => (
                    <button key={dir} type="button" aria-label={label} disabled={!on} onClick={() => scene.current?.pan(dir)} className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-tn-line bg-tn-bg/90 shadow-sm transition-opacity disabled:pointer-events-none disabled:opacity-0 ${pos}`}>
                        <Icon className="h-5 w-5" />
                    </button>
                ))}
            </div>
            <p className="mt-2 min-h-6 text-center text-[13px] font-medium uppercase tracking-[0.16em]" aria-live="polite">
                {hover ? `${hover.name} · ${inr(hover.price)}` : <span className="text-tn-muted">Point at a saree, tap to take it off the rail. Drag to walk along.</span>}
            </p>
            <div className="mx-auto mt-8 flex max-w-[1400px] justify-between px-5 text-[12px] uppercase tracking-[0.14em] text-tn-muted sm:px-8">
                <span>
                    {shown.length} {shown.length === 1 ? 'saree' : 'sarees'} on the rail
                </span>
                <span className="hidden sm:inline">Modelled in 3D, painted in each saree&apos;s colour</span>
            </div>
            <AnimatePresence>{open >= 0 && shown[open] && <Detail list={shown} index={open} setIndex={setOpen} onClose={() => setOpen(-1)} />}</AnimatePresence>
        </section>
    );
}
