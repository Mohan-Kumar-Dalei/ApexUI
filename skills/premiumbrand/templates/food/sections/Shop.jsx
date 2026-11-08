import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plus, X } from 'lucide-react';
import { useStore } from '../lib/store.jsx';
import { rupees } from '../lib/api.js';
import { reduced } from '../lib/motion.jsx';

/*
 * The shop, in two parts.
 * The Wall: a tall card per flavour in its own colour; tilt it, press it, and the chips
 * pop out from behind the bag. The plus drops a 52 g pack into the basket.
 * Build-a-Box: pick any three flavours into the tray (tap or drag), and the three are
 * priced as a set by the server.
 */

const chipPath = 'M18 50 C10 30 30 12 52 14 C74 15 92 28 88 50 C85 70 66 86 46 84 C26 82 22 66 18 50 Z';

function Chips({ seasoning }) {
    return (
        <span className="pointer-events-none absolute inset-0" aria-hidden="true">
            {[
                ['left-[8%] top-[34%]', -24],
                ['right-[6%] top-[28%]', 18],
                ['right-[12%] top-[58%]', 36],
            ].map(([pos, rot], i) => (
                <svg key={i} data-pop viewBox="0 0 100 100" className={`absolute w-[28%] opacity-0 ${pos}`} style={{ transform: `rotate(${rot}deg) scale(0.6)` }}>
                    <path d={chipPath} fill="#F6D27A" stroke="#C98A25" strokeWidth="2" />
                    {[
                        [40, 40],
                        [60, 55],
                        [45, 65],
                    ].map(([x, y]) => (
                        <circle key={x + y} cx={x} cy={y} r="3" fill={seasoning} opacity="0.75" />
                    ))}
                </svg>
            ))}
        </span>
    );
}

function WallCard({ p, shot, onAdd }) {
    const card = useRef(null);
    const enter = () => !reduced() && gsap.to(card.current.querySelectorAll('[data-pop]'), { opacity: 1, scale: 1, y: -18, duration: 0.5, stagger: 0.05, ease: 'back.out(2.4)' });
    const leave = () => {
        gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out' });
        gsap.to(card.current.querySelectorAll('[data-pop]'), { opacity: 0, scale: 0.6, y: 0, duration: 0.35 });
    };
    const move = (e) => {
        if (reduced()) return;
        const r = card.current.getBoundingClientRect();
        gsap.to(card.current, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 14, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 12, duration: 0.4, ease: 'power2.out' });
    };
    return (
        <li className="[perspective:1000px]">
            <div
                ref={card}
                onPointerEnter={enter}
                onPointerLeave={leave}
                onPointerMove={move}
                onPointerDown={() => !reduced() && gsap.to(card.current, { scale: 0.97, duration: 0.15 })}
                onPointerUp={() => !reduced() && gsap.to(card.current, { scale: 1, duration: 0.5, ease: 'back.out(3)' })}
                className="relative aspect-[3/4.3] overflow-hidden rounded-[22px] p-4 shadow-[0_24px_50px_-26px_rgba(0,0,0,0.55)]"
                style={{ background: p.colour, color: p.ink }}
            >
                <span className="pointer-events-none absolute inset-3 rounded-[16px] border border-dashed opacity-40" style={{ borderColor: p.ink }} aria-hidden="true" />
                <h3 className="relative z-10 text-center font-cond text-[clamp(26px,2.5vw,44px)] drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">{p.name}</h3>
                <Chips seasoning={p.deep} />
                {shot && <img src={shot} alt={`${p.name} bag`} className="absolute left-1/2 top-[52%] w-[72%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_24px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-expo" draggable={false} />}
                <p className="mono absolute bottom-6 left-6 z-10 !text-[11px] opacity-80">{rupees(p.sizes.find((s) => s.id === 'm')?.price ?? p.sizes[0].price)} · 52 g</p>
                <button onClick={onAdd} aria-label={`Add ${p.name}, 52 g, to the basket`} className="absolute bottom-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-coal text-white ring-4 ring-white/80 transition-transform active:scale-90">
                    <Plus size={20} />
                </button>
            </div>
        </li>
    );
}

export function Wall() {
    const { catalogue, shots, add } = useStore();
    const root = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.from('[data-wall-title] span', { yPercent: 105, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
            gsap.from('li', { y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '[data-wall-grid]', start: 'top 85%', once: true } });
        }, root);
        return () => ctx.revert();
    }, []);
    return (
        <section ref={root} id="shop" data-tone="light" className="bg-stone px-5 pb-24 pt-32 text-coal sm:px-10 md:pt-40">
            <div className="mx-auto max-w-[1760px]">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="mono text-coal/60">The wall · Pick a bag, any bag</p>
                        <h2 data-wall-title className="mt-3 font-wide text-[clamp(56px,9vw,156px)]">
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span className="block">Grab</span>
                            </span>
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span className="block">a bag</span>
                            </span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-right text-[17px] text-coal/75">
                        Tilt a card, press it, poke the bag. Hit <span className="inline-grid h-6 w-6 translate-y-1 place-items-center rounded-full bg-coal text-white"><Plus size={14} /></span> to drop a flavor into your basket.
                    </p>
                </div>
                <ul data-wall-grid className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
                    {catalogue.products.map((p) => (
                        <WallCard key={p.slug} p={p} shot={shots[p.slug]} onAdd={() => add(p.slug, 'm')} />
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ---------------- build your 3 pack ---------------- */
export function BuildBox() {
    const { catalogue, shots, addPick3 } = useStore();
    const rule = catalogue.pick3 ?? { count: 3, off: 20, size: 'm' };
    const [tray, setTray] = useState([]);
    const [over, setOver] = useState(false);
    const root = useRef(null);
    const bySlug = Object.fromEntries(catalogue.products.map((p) => [p.slug, p]));
    const price = (slug) => bySlug[slug].sizes.find((s) => s.id === rule.size)?.price ?? 0;
    const unit = price(catalogue.products[0].slug);
    const save = Math.round((unit * rule.count * rule.off) / 100);
    const full = tray.reduce((s, x) => s + price(x), 0);
    const deal = tray.length === rule.count ? full - Math.round((full * rule.off) / 100) : full;

    const put = (slug) => {
        if (tray.length >= rule.count || !bySlug[slug]?.sizes.some((s) => s.id === rule.size && s.inStock)) return;
        setTray((t) => [...t, slug]);
        requestAnimationFrame(() => {
            const el = root.current?.querySelector(`[data-slot="${tray.length}"] img`);
            if (el && !reduced()) gsap.fromTo(el, { y: -160, rotate: -18, autoAlpha: 0 }, { y: 0, rotate: [-9, 0, 9][tray.length] ?? 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)' });
        });
    };
    const take = (i) => setTray((t) => t.filter((_, j) => j !== i));
    const count = (slug) => tray.filter((s) => s === slug).length;

    return (
        <section ref={root} data-tone="dark" className="bg-coal px-5 py-24 text-[#F5E9D3] sm:px-10 md:py-32" aria-label="Build your 3 pack">
            <div className="mx-auto grid max-w-[1760px] items-center gap-14 xl:grid-cols-[1fr_0.9fr]">
                <div>
                    <p className="mono text-[#F5E9D3]/55">Build-a-box · pick any three</p>
                    <h2 className="mt-4 font-cond text-[clamp(52px,6.6vw,118px)]">
                        Build your <span className="inline-grid min-w-[1.1em] place-items-center rounded-xl bg-[#F5E9D3] px-2 text-coal">3</span> pack &amp;
                        <br />
                        <span className="outline-text">save {rupees(save)}</span>
                    </h2>
                    <ul className="mt-10 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
                        {catalogue.products.map((p) => {
                            const n = count(p.slug);
                            const out = !p.sizes.some((s) => s.id === rule.size && s.inStock);
                            return (
                                <li key={p.slug}>
                                    <p className="mb-2 flex h-[2.2em] items-end justify-center text-center font-cond text-[clamp(14px,1.15vw,19px)] leading-[1]">{p.name}</p>
                                    <button
                                        draggable={!out}
                                        onDragStart={(e) => e.dataTransfer.setData('text/plain', p.slug)}
                                        onClick={() => put(p.slug)}
                                        disabled={out}
                                        aria-label={`Put ${p.name} in the tray${n ? `, ${n} in it` : ''}`}
                                        className={`relative block aspect-square w-full overflow-visible rounded-2xl border-2 transition-all duration-300 disabled:opacity-30 ${n ? 'border-[#F5E9D3]' : 'border-transparent hover:-translate-y-1'}`}
                                        style={{ background: n ? p.colour : `${p.deep}AA` }}
                                    >
                                        {shots[p.slug] && <img src={shots[p.slug]} alt="" className={`absolute inset-x-[16%] top-[8%] w-[68%] transition ${n ? '' : 'opacity-70 saturate-50'}`} draggable={false} />}
                                        <span className={`absolute -bottom-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-[15px] font-bold ${n ? 'bg-[#F5E9D3] text-coal' : 'bg-white/15 text-[#F5E9D3]'}`}>{n || <Plus size={16} />}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mono mt-12 text-[#F5E9D3]/45">Tap a bag, or drag it into the tray</p>
                </div>

                <div className="flex flex-col items-center">
                    <div
                        onDragOver={(e) => (e.preventDefault(), setOver(true))}
                        onDragLeave={() => setOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setOver(false);
                            put(e.dataTransfer.getData('text/plain'));
                        }}
                        className={`relative grid aspect-square w-full max-w-[620px] place-items-center rounded-full transition-colors duration-500 ${over ? 'bg-[#2C5A3D]' : 'bg-[#1F3A2A]'}`}
                        aria-label="The tray"
                    >
                        <span className="absolute inset-[8%] rounded-full border border-[#F5E9D3]/10" aria-hidden="true" />
                        <span className="absolute inset-[20%] rounded-full border border-[#F5E9D3]/10" aria-hidden="true" />
                        <div className="relative flex w-[86%] items-center justify-center">
                            {Array.from({ length: rule.count }).map((_, i) => {
                                const slug = tray[i];
                                return (
                                    <div key={i} data-slot={i} className={`relative -mx-[3%] aspect-[3/4.4] w-1/3 ${i === 1 ? 'z-10 -translate-y-4' : ''}`}>
                                        {slug ? (
                                            <>
                                                <img src={shots[slug]} alt={bySlug[slug].name} className="h-full w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.5)]" style={{ transform: `rotate(${[-9, 0, 9][i]}deg)` }} draggable={false} />
                                                <button onClick={() => take(i)} aria-label={`Take ${bySlug[slug].name} out`} className="absolute left-1/2 top-2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-coal text-[#F5E9D3] ring-2 ring-[#F5E9D3]/60">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="grid h-full w-full place-items-center rounded-2xl border-2 border-dashed border-[#F5E9D3]/25 text-[#F5E9D3]/40">
                                                <Plus size={28} />
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            addPick3(tray);
                            setTray([]);
                        }}
                        disabled={tray.length < rule.count}
                        className="relative z-10 -mt-10 flex w-full max-w-[560px] items-center justify-center gap-5 rounded-2xl bg-[#F5E9D3] px-8 py-6 text-coal shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="font-cond text-[clamp(26px,2.4vw,40px)]">{tray.length < rule.count ? `Pick ${rule.count - tray.length} more` : 'Add to basket'}</span>
                        {tray.length === rule.count && (
                            <span className="flex items-baseline gap-2 font-cond text-[clamp(24px,2.2vw,36px)]">
                                <s className="text-[0.7em] opacity-60">{rupees(full)}</s>
                                {rupees(deal)}
                            </span>
                        )}
                    </button>
                    <p className="mono mt-5 text-[#F5E9D3]/45">
                        {rule.off}% off every full set of {rule.count} · priced by the store
                    </p>
                </div>
            </div>
        </section>
    );
}
