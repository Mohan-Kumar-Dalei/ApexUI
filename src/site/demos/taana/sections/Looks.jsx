import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Heart, Plus } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade.jsx';
import { Reveal, img, inr, useBag, useWish } from '../lib.jsx';
import { u } from '../base.js';

/* ======================= six moods, in arch windows ======================= */
const MOODS = [
    ['Wedding reds', 'Banarasi', 'photo-1727430228383-aa1fb59db8bf'],
    ['Temple silks', 'Kanjivaram', 'photo-1679006831648-7c9ea12e5807'],
    ['Parrots and lotus', 'Paithani', 'photo-1617627143750-d86bc21e42bb'],
    ['Ivory and gold', 'Kasavu', 'photo-1787295779612-b3182bea0a81'],
    ['Light as air', 'Chanderi', 'photo-1609748340041-f5d61e061ebc'],
    ['Tied and dyed', 'Bandhani', 'photo-1769275061202-cf3ef67d7279'],
];

export function Moods() {
    return (
        <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <BlurFade inView>
                    <p className="label">The Taana archive</p>
                    <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">
                        Six moods, <em className="text-tn-accent">one loom room.</em>
                    </h2>
                </BlurFade>
                <p className="max-w-xs text-[15px] text-tn-muted">Pick a feeling first. The weave follows.</p>
            </div>
            <Reveal stagger={0.08} className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-6">
                {MOODS.map(([mood, weave, photo]) => (
                    <Link key={mood} to={u(`/sarees?weave=${weave}`)} className="group block min-w-0 text-center">
                        {/* a temple arch: rounded top, a thin second frame that lifts on hover */}
                        <div className="relative rounded-t-full border border-tn-accent/40 p-1.5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                            <span aria-hidden="true" className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-tn-accent/60" />
                            <span aria-hidden="true" className="absolute -top-[18px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-tn-accent" />
                            <div className="aspect-[3/5] overflow-hidden rounded-t-full bg-tn-surface">
                                <img src={img(photo, 420, 700)} alt={`${weave} saree`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                            </div>
                        </div>
                        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.2em]">{mood}</p>
                        <p className="mt-1 text-[13px] text-tn-muted">{weave}</p>
                    </Link>
                ))}
            </Reveal>
        </section>
    );
}

/* ======================= pick a silk: a fan of cards that tilt to the cursor ======================= */
const dark = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) < 150;
};

function SilkCard({ p, i, mid }) {
    const bag = useBag();
    const wish = useWish();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [pop, setPop] = useState(false);
    const o = i - mid;
    const onDark = dark(p.swatch);
    return (
        <div className="shrink-0 snap-center [perspective:900px] lg:-mx-4 lg:[transform:rotate(var(--r))_translateY(var(--y))]" style={{ '--r': `${o * 5}deg`, '--y': `${o * o * 7}px` }}>
            <motion.div
                onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -14, y: ((e.clientX - r.left) / r.width - 0.5) * 14 });
                }}
                onPointerLeave={() => setTilt({ x: 0, y: 0 })}
                whileTap={{ scale: 0.97 }}
                animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative h-[430px] w-[270px] overflow-hidden rounded-[22px] p-4 shadow-[0_30px_60px_-30px_rgba(28,23,20,0.55)]"
                style={{ background: p.swatch, color: onDark ? '#F8F1E7' : '#1C1714' }}
            >
                <div className="pointer-events-none absolute inset-2.5 rounded-[16px] border border-dashed opacity-40" style={{ borderColor: 'currentColor' }} />
                <h3 className="relative z-0 px-1 pt-2 text-[2.6rem] leading-[0.9]">{p.name.split(' ').slice(0, 2).join(' ')}</h3>
                <div className="absolute inset-x-6 bottom-16 top-[118px] overflow-hidden rounded-t-full">
                    <img src={img(p.images[0], 460, 600)} alt={p.name} loading="lazy" draggable={false} className="h-full w-full object-cover" />
                </div>
                <button type="button" aria-label={wish.has(p.slug) ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wish.has(p.slug)} onClick={() => wish.toggle(p.slug)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-tn-bg text-tn-ink">
                    <Heart className={`h-[18px] w-[18px] ${wish.has(p.slug) ? 'fill-tn-accent text-tn-accent' : ''}`} />
                </button>
                <p className="absolute bottom-5 left-5 font-medium tnum">{inr(p.price)}</p>
                <button
                    type="button"
                    aria-label={`Add ${p.name} to bag`}
                    onClick={() => {
                        bag.add(p, { blouse: 'unstitched', fallPico: false });
                        setPop(true);
                        setTimeout(() => setPop(false), 1400);
                    }}
                    className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-tn-ink text-tn-bg ring-4 ring-tn-bg/80 transition-transform active:scale-90"
                >
                    {pop ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </button>
            </motion.div>
        </div>
    );
}

export function PickASilk({ products }) {
    const list = products.slice(0, 8);
    const mid = (list.length - 1) / 2;
    return (
        <section id="silk" className="overflow-hidden py-24 sm:py-32">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
                <BlurFade inView>
                    <p className="label">Quick pick</p>
                    <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">
                        Pick a <em className="text-tn-accent">silk.</em>
                    </h2>
                </BlurFade>
                <p className="max-w-xs text-[15px] text-tn-muted">Tilt a card, press it. The plus drops the saree into your bag with an unstitched blouse piece.</p>
            </div>
            <div className="no-bar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-16 pt-6 sm:px-8 lg:justify-center lg:overflow-visible lg:px-0" data-lenis-prevent-touch>
                {list.map((p, i) => (
                    <SilkCard key={p.slug} p={p} i={i} mid={mid} />
                ))}
            </div>
        </section>
    );
}
