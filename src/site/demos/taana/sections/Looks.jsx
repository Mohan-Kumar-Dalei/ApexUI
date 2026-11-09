import { Link } from 'react-router-dom';
import CardFan from '../../../../components/MainUI/ApexUI-Kit/CardFan/CardFan.jsx';
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

/* ======================= pick a silk: the ApexUI Card Fan ======================= */
export function PickASilk({ products }) {
    const bag = useBag();
    const wish = useWish();
    const list = products.slice(0, 8);
    const items = list.map((p) => ({ id: p.slug, title: p.name.split(' ').slice(0, 2).join(' '), image: img(p.images[0], 460, 600), alt: p.name, price: inr(p.price), color: p.swatch, product: p }));
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
            <CardFan
                className="mx-auto mt-10 max-w-[1800px]"
                items={items}
                liked={wish.list}
                likeLabel="your wishlist"
                onLike={(it) => wish.toggle(it.id)}
                onAdd={(it) => bag.add(it.product, { blouse: 'unstitched', fallPico: false })}
            />
        </section>
    );
}
