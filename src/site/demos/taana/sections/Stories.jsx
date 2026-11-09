import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Pause, Play } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade.jsx';
import PortalCarousel from '../../../../components/MainUI/ApexUI-Kit/PortalCarousel/PortalCarousel.jsx';
import { Marquee } from '../components/ui/marquee.jsx';
import { img, inr, reduced, useBag, useWish } from '../lib.jsx';
import { u } from '../base.js';

const EASE = [0.16, 1, 0.3, 1];

/* ======================= feel the drape: a framed slideshow between moving photo columns ======================= */
const FRAMES = [
    ['photo-1787295779676-181b3d5b55dd', 'Kasavu at a morning puja, Thrissur'],
    ['photo-1758797315311-07c928608c04', 'Three sisters before a hill wedding'],
    ['photo-1772887438776-28a6f8b2e29d', 'Chanderi in the sea wind, Kovalam'],
    ['photo-1654764746242-7592b9c6ce2e', 'A bridal Banarasi under a palace arch'],
    ['photo-1758797315269-719cbb1b619d', 'Green silks on a bridge, Rishikesh'],
];
const LEFT = ['photo-1619516388835-2b60acc4049e', 'photo-1692992193981-d3d92fabd9cb', 'photo-1607647735186-f3c200aa175a', 'photo-1610189013429-a703f4b245cf'];
const RIGHT = ['photo-1756483571456-6fa86cb1ae53', 'photo-1679006831648-7c9ea12e5807', 'photo-1617627143750-d86bc21e42bb', 'photo-1641699862936-be9f49b1c38d'];

function Column({ photos, reverse }) {
    return (
        <Marquee vertical reverse={reverse} repeat={3} className="h-full p-0 [--duration:38s] [--gap:1rem]">
            {photos.map((id) => (
                <img key={id} src={img(id, 360, 480)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover" />
            ))}
        </Marquee>
    );
}

export function FeelTheDrape() {
    const [at, setAt] = useState(0);
    const [playing, setPlaying] = useState(() => !reduced());
    useEffect(() => {
        if (!playing) return undefined;
        const t = setInterval(() => setAt((a) => (a + 1) % FRAMES.length), 5200);
        return () => clearInterval(t);
    }, [playing]);

    return (
        <section className="bg-tn-surface py-24 sm:py-32">
            <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
                <BlurFade inView className="text-center">
                    <p className="label">Worn, not posed</p>
                    <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">
                        Feel the <em className="text-tn-accent">drape.</em>
                    </h2>
                </BlurFade>
                <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[180px_1fr_180px]">
                    <div className="hidden h-[min(56vw,560px)] overflow-hidden lg:block" aria-hidden="true">
                        <Column photos={LEFT} />
                    </div>
                    {/* the frame: thin border with corner brackets */}
                    <figure className="relative self-center p-3 sm:p-4">
                        {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
                            <span key={c} aria-hidden="true" className={`absolute h-6 w-6 border-tn-accent ${c}`} />
                        ))}
                        <div className="relative aspect-video overflow-hidden border border-tn-accent/30 bg-tn-ink">
                            <AnimatePresence initial={false}>
                                <motion.img
                                    key={FRAMES[at][0]}
                                    src={img(FRAMES[at][0], 1600, 900)}
                                    alt={FRAMES[at][1]}
                                    initial={{ opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ opacity: { duration: 1.2 }, scale: { duration: 6.5, ease: 'linear' } }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </AnimatePresence>
                            <button type="button" onClick={() => setPlaying((p) => !p)} className="absolute right-3 top-3 flex h-9 items-center gap-1.5 rounded-full bg-tn-bg/90 px-3 text-[13px] font-medium text-tn-ink" aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'}>
                                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? 'Pause' : 'Play'}
                            </button>
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-black/40 px-4 py-3 text-[14px] text-white sm:px-5">
                                <span>{FRAMES[at][1]}</span>
                                <span className="flex gap-1.5" aria-hidden="true">
                                    {FRAMES.map((f, i) => (
                                        <span key={f[0]} className={`h-1 rounded-full transition-all duration-500 ${i === at ? 'w-6 bg-white' : 'w-2 bg-white/50'}`} />
                                    ))}
                                </span>
                            </div>
                        </div>
                    </figure>
                    <div className="hidden h-[min(56vw,560px)] overflow-hidden lg:block" aria-hidden="true">
                        <Column photos={RIGHT} reverse />
                    </div>
                </div>
                <div className="mt-10 text-center">
                    <Link to={u('/sarees')} className="inline-flex h-14 items-center gap-2 rounded-full bg-tn-accent px-8 font-medium text-tn-on-accent">
                        Shop the collection <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ======================= the bridal edit: arch cards on a curve ======================= */
const BRIDAL = ['ruby-kadhwa-banarasi', 'temple-red-kanjivaram', 'gulabi-bridal-banarasi', 'peacock-kanjivaram', 'rani-pink-paithani', 'aubergine-tissue-banarasi', 'green-patola'];

export function Bridal({ bySlug }) {
    const list = useMemo(() => BRIDAL.map((s) => bySlug[s]).filter(Boolean), [bySlug]);
    const [added, setAdded] = useState('');
    const bag = useBag();
    const wish = useWish();
    const items = useMemo(
        () =>
            list.map((b) => ({
                id: b.slug,
                image: img(b.images[0], 640, 1100),
                title: b.name,
                subtitle: [b.fabric, b.loomDays && `${b.loomDays} days on the loom`].filter(Boolean).join('. ') + '.',
                meta: inr(b.price),
                badge: b.stock > 0 && b.stock <= 2 ? `Only ${b.stock} left` : b.stock === 0 ? 'Sold out' : null,
                product: b,
            })),
        [list],
    );
    if (!list.length) return null;

    return (
        <section id="bridal" className="overflow-hidden bg-tn-band py-24 text-tn-on-band sm:py-32">
            <BlurFade inView className="px-5 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tn-band-muted">For the muhurtham, and every year after</p>
                <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.6rem)]">The bridal edit.</h2>
            </BlurFade>
            <PortalCarousel
                className="mx-auto mt-12 max-w-[1200px]"
                items={items}
                variant="curve"
                theme="dark"
                frameColor="#C9A253"
                startIndex={1}
                height="clamp(19rem, min(54svh, 112vw), 34rem)"
                label="Bridal sarees"
                renderActions={(it) => {
                    const p = it.product;
                    return (
                        <>
                            <button type="button" disabled={p.stock === 0} onClick={() => (bag.add(p, { blouse: 'unstitched', fallPico: true }), setAdded(p.slug))} className="h-11 rounded-full bg-tn-on-band px-6 font-medium text-tn-band disabled:opacity-40">
                                {added === p.slug ? 'In your bag' : 'Add to bag'}
                            </button>
                            <button type="button" aria-label={wish.has(p.slug) ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wish.has(p.slug)} onClick={() => wish.toggle(p.slug)} className="grid h-11 w-11 place-items-center rounded-full border border-tn-on-band/25 hover:border-tn-on-band">
                                <Heart className={`h-5 w-5 ${wish.has(p.slug) ? 'fill-[#E2C47E] text-[#E2C47E]' : ''}`} />
                            </button>
                        </>
                    );
                }}
            />
            <p className="mx-auto mt-4 max-w-xl px-5 text-center text-[13px] text-tn-band-muted">
                Bridal sarees come with a blouse piece and fall and pico done; pick a size on the saree page to have it stitched. Want to see it first? <Link to={u('/video-call')} className="underline underline-offset-4">Book a video call</Link>.
            </p>
        </section>
    );
}
