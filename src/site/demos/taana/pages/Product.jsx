import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Truck, Video } from 'lucide-react';
import { ProductCard } from '../parts.jsx';
import { Reveal, img, inr, useApi, useBag } from '../lib.jsx';
import { u } from '../base.js';

const EASE = [0.16, 1, 0.3, 1];
const BLOUSE = [
    ['unstitched', 'Blouse piece, unstitched', 'Included'],
    ['stitched', 'Stitched to your size', '+ ₹1,450'],
    ['none', 'No blouse needed', ''],
];

function Skeleton() {
    return (
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-32" aria-hidden="true">
            <div className="bone aspect-[4/5]" />
            <div className="space-y-4 lg:pt-10">
                <div className="bone h-3 w-24" />
                <div className="bone h-14 w-4/5" />
                <div className="bone h-6 w-32" />
                <div className="bone mt-8 h-24 w-full" />
                <div className="bone h-14 w-full" />
                <div className="bone h-14 w-full" />
            </div>
        </div>
    );
}

// Delivery estimate for a pincode: metros sooner, the rest a few days more.
function DeliveryCheck() {
    const [pin, setPin] = useState('');
    const [msg, setMsg] = useState('');
    const check = (e) => {
        e.preventDefault();
        if (!/^[1-9]\d{5}$/.test(pin)) return setMsg('Enter a 6 digit pincode.');
        const metro = ['11', '40', '56', '60', '70', '50'].includes(pin.slice(0, 2));
        const d = new Date(Date.now() + (metro ? 4 : 7) * 86400000);
        setMsg(`Delivered by ${d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}.`);
    };
    return (
        <form onSubmit={check} className="mt-8">
            <label htmlFor="pin" className="flex items-center gap-2 text-[14px] font-medium">
                <Truck className="h-4 w-4" /> When will it reach me?
            </label>
            <div className="mt-2 flex gap-2">
                <input id="pin" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Pincode" className="h-11 w-36 rounded-full border border-tn-line bg-tn-card px-4 text-[16px] outline-none tnum placeholder:text-tn-muted focus:border-tn-ink" />
                <button className="h-11 rounded-full border border-tn-ink px-5 text-[15px] font-medium">Check</button>
            </div>
            <p role="status" className="mt-2 min-h-5 text-[14px] text-tn-muted">
                {msg}
            </p>
        </form>
    );
}

export default function Product() {
    const { slug } = useParams();
    const { data, error, loading } = useApi(`/products/${slug}`, { minDelay: 450 });
    const bag = useBag();
    const [shown, setShown] = useState(0);
    const [blouse, setBlouse] = useState('unstitched');
    const [size, setSize] = useState('');
    const [need, setNeed] = useState(false);
    const [fallPico, setFallPico] = useState(true);
    const [added, setAdded] = useState(false);
    const p = data?.product;

    useEffect(() => {
        setShown(0);
        setAdded(false);
    }, [slug]);
    useEffect(() => {
        if (p) document.title = `${p.name} | Taana`;
    }, [p]);

    if (loading && !p) return <Skeleton />;
    if (error)
        return (
            <div className="mx-auto max-w-xl px-5 pb-32 pt-40 sm:px-8">
                <h1 className="text-5xl">This saree has left the shelf.</h1>
                <p className="mt-4 text-tn-muted">{error.message}</p>
                <Link to={u('/sarees')} className="mt-8 inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                    See what is in stock
                </Link>
            </div>
        );

    const saree = p.kind !== 'jewellery';
    const add = () => {
        // a stitched blouse is made to a size, so ask for it first
        if (saree && blouse === 'stitched' && !size) return setNeed(true);
        bag.add(p, { blouse, blouseSize: blouse === 'stitched' ? size : undefined, fallPico });
        setAdded(true);
        setTimeout(() => bag.setOpen(true), 450);
    };

    return (
        <article>
            <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-20 pt-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-28">
                {/* gallery: big picture with thumbnails; stacked on desktop scroll */}
                <div className="min-w-0">
                    <div className="relative aspect-[4/5] overflow-hidden bg-tn-surface">
                        {p.images.map((id, i) => (
                            <motion.img key={id} src={img(id, 1100, 1375)} alt={i === 0 ? p.name : `${p.name}, view ${i + 1}`} initial={false} animate={{ opacity: shown === i ? 1 : 0, scale: shown === i ? 1 : 1.04 }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-0 h-full w-full object-cover" />
                        ))}
                    </div>
                    {p.images.length > 1 && (
                        <div className="mt-3 flex gap-3">
                            {p.images.map((id, i) => (
                                <button key={id} type="button" aria-label={`Show photo ${i + 1}`} aria-pressed={shown === i} onClick={() => setShown(i)} className={`h-24 w-20 overflow-hidden bg-tn-surface ring-offset-2 ring-offset-tn-bg transition ${shown === i ? 'ring-2 ring-tn-ink' : 'opacity-70 hover:opacity-100'}`}>
                                    <img src={img(id, 160, 200)} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:pt-6">
                    <p className="label">
                        {p.weave} · {p.region}
                    </p>
                    <h1 className="mt-3 text-[clamp(2.6rem,5vw,4.4rem)]">{p.name}</h1>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="text-2xl tnum">{inr(p.price)}</span>
                        <span className="text-[14px] text-tn-muted">Includes GST. Free shipping.</span>
                    </div>
                    <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-tn-muted">{p.story}</p>
                    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
                        {saree && (
                            <span>
                                <strong className="font-semibold">{p.loomDays} days</strong> on the loom
                            </span>
                        )}
                        <span>{p.fabric}</span>
                        <span className={p.stock <= 2 ? 'font-semibold text-tn-accent' : 'text-tn-muted'}>{p.stock === 0 ? 'Sold out' : p.stock <= 2 ? `Only ${p.stock} left` : 'In stock'}</span>
                    </p>

                    {saree && (
                    <>
                    <fieldset className="mt-8 min-w-0">
                        <legend className="text-[14px] font-medium">Blouse</legend>
                        <div className="mt-3 grid gap-2">
                            {BLOUSE.map(([v, label, extra]) => (
                                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${blouse === v ? 'border-tn-ink bg-tn-card' : 'border-tn-line hover:border-tn-muted'}`}>
                                    <input type="radio" name="blouse" value={v} checked={blouse === v} onChange={() => setBlouse(v)} className="sr-only" />
                                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${blouse === v ? 'border-tn-accent' : 'border-tn-line'}`}>{blouse === v && <span className="h-2.5 w-2.5 rounded-full bg-tn-accent" />}</span>
                                    <span className="flex-1 text-[15px]">{label}</span>
                                    <span className="text-[14px] text-tn-muted">{extra}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    {blouse === 'stitched' && (
                        <fieldset className="mt-4 min-w-0">
                            <legend className="text-[14px] font-medium">Blouse size</legend>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {['34', '36', '38', '40', '42'].map((s) => (
                                    <button key={s} type="button" aria-pressed={size === s} onClick={() => (setSize(s), setNeed(false))} className={`grid h-11 w-12 place-items-center rounded-full border text-[14px] tnum ${size === s ? 'border-tn-ink bg-tn-ink text-tn-bg' : 'border-tn-line hover:border-tn-ink'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {need && <p className="mt-2 text-[13px] text-tn-accent">Pick a size so we can stitch the blouse.</p>}
                        </fieldset>
                    )}
                    <label className="mt-3 flex cursor-pointer items-center gap-3 px-1 py-2 text-[15px]">
                        <input type="checkbox" checked={fallPico} onChange={(e) => setFallPico(e.target.checked)} className="h-5 w-5 accent-[var(--tn-accent)]" />
                        Fall and pico done, ready to wear <span className="text-tn-muted">+ ₹250</span>
                    </label>
                    </>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button type="button" disabled={p.stock === 0} onClick={add} className="relative h-14 flex-1 overflow-hidden rounded-full bg-tn-accent text-[16px] font-medium text-tn-on-accent disabled:opacity-40">
                            <motion.span key={added ? 'a' : 'b'} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }} className="flex items-center justify-center gap-2">
                                {added ? (
                                    <>
                                        <Check className="h-4 w-4" /> In your bag
                                    </>
                                ) : p.stock === 0 ? (
                                    'Sold out'
                                ) : (
                                    'Add to bag'
                                )}
                            </motion.span>
                        </button>
                        <Link to={u(`/video-call?saree=${p.slug}`)} className="flex h-14 items-center justify-center gap-2 rounded-full border border-tn-ink px-6 text-[16px] font-medium">
                            <Video className="h-4 w-4" /> See it on video
                        </Link>
                    </div>

                    <DeliveryCheck />

                    <ul className="mt-4 divide-y divide-tn-line border-y border-tn-line text-[15px]">
                        {p.details.map((d) => (
                            <li key={d} className="py-3">
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {data.related.length > 0 && (
                <section className="mx-auto max-w-[1400px] px-5 pb-28 sm:px-8">
                    <h2 className="text-[clamp(2rem,4vw,3.2rem)]">More {p.weave}</h2>
                    <Reveal stagger={0.08} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
                        {data.related.map((r) => (
                            <ProductCard key={r.slug} p={r} />
                        ))}
                    </Reveal>
                </section>
            )}
        </article>
    );
}
