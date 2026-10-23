import { useRef } from 'react';
import { RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import GlassLens from '../../components/MainUI/ApexUI-Kit/GlassLens/GlassLens.jsx';
import ToastStack from '../../components/MainUI/ApexUI-Kit/ToastStack/ToastStack.jsx';
import Coverflow3D from '../../components/MainUI/ApexUI-Kit/Coverflow3D/Coverflow3D.jsx';
import SwipeCards from '../../components/MainUI/ApexUI-Kit/SwipeCards/SwipeCards.jsx';
import CardSwap3D from '../../components/MainUI/ApexUI-Kit/CardSwap3D/CardSwap3D.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { photo } from './photos.js';

const INK = '#141210';
const ACCENT = '#ff6a3d';

const PRODUCTS = [
    { name: 'Velo Runner', price: 129, tag: 'New', img: 'photo-1542291026-7eec264c27ff' },
    { name: 'Orbit Watch', price: 249, tag: 'Bestseller', img: 'photo-1523275335684-37898b6baf30' },
    { name: 'Hush Headphones', price: 199, tag: '', img: 'photo-1505740420928-5e560c06d30e' },
    { name: 'Frame Camera', price: 549, tag: 'Limited', img: 'photo-1526170375885-4d8ecf77b99f' },
    { name: 'Pulse Band', price: 149, tag: '', img: 'photo-1546868871-7041f2a55e12' },
    { name: 'Shade Sunglasses', price: 89, tag: 'New', img: 'photo-1572635196237-14b3f281503f' },
];

const PERKS = [
    { icon: Truck, title: 'Free shipping', body: 'On every order over $50, delivered in 2 to 4 days.' },
    { icon: RotateCcw, title: '60 day returns', body: 'Changed your mind? Send it back, no questions.' },
    { icon: ShieldCheck, title: '2 year warranty', body: 'If it breaks, we fix or replace it.' },
];

/* Bloom: a product store with a glass lens hero and an add to bag toast. */
export default function BloomTemplate() {
    const toast = useRef(null);
    const add = (p) => toast.current?.show({ type: 'success', title: `${p.name} added to bag`, description: `$${p.price} · Free shipping` });

    return (
        <div className="bg-[#f6f3ee]" style={{ color: INK }}>
            <header className="flex items-center justify-between px-[clamp(1rem,4vw,3rem)] py-5">
                <span className="text-xl font-black tracking-tight">bloom.</span>
                <nav className="hidden gap-6 text-sm text-black/60 md:flex">
                    <span>New in</span>
                    <span>Audio</span>
                    <span>Wearables</span>
                    <span>Sale</span>
                </nav>
                <span className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                    <ShoppingBag className="h-4 w-4" /> Bag
                </span>
            </header>

            <section className="px-[clamp(0.75rem,3vw,2rem)]">
                <div className="overflow-hidden rounded-[2rem]">
                    <GlassLens image={photo('photo-1542291026-7eec264c27ff', 2000)} size={8} refraction={0.6} dispersion={0.6} height="min(78svh, 40rem)">
                        <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/45 via-transparent to-transparent p-[clamp(1.25rem,4vw,3rem)] text-white">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/80">Spring drop · 2026</p>
                            <h1 className="mt-2 max-w-2xl text-[clamp(2.4rem,7vw,5.6rem)] font-black leading-[0.92] tracking-tight">Made to move with you</h1>
                            <p className="mt-3 max-w-md text-white/85">Move your cursor over the photo to look closer.</p>
                        </div>
                    </GlassLens>
                </div>
            </section>

            <section className="px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,8vw,6rem)]">
                <div className="mx-auto flex max-w-6xl items-end justify-between">
                    <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight">New arrivals</h2>
                    <span className="text-sm text-black/50">{PRODUCTS.length} products</span>
                </div>
                <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
                    {PRODUCTS.map((p) => (
                        <article key={p.name} className="group">
                            <div className="relative overflow-hidden rounded-3xl bg-white">
                                <img src={photo(p.img, 800)} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                                {p.tag && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold">{p.tag}</span>}
                                <button
                                    type="button"
                                    onClick={() => add(p)}
                                    className="absolute bottom-3 left-3 right-3 translate-y-0 rounded-full bg-black py-2.5 text-sm font-semibold text-white transition-all duration-300 sm:translate-y-[150%] sm:group-hover:translate-y-0"
                                >
                                    Add to bag
                                </button>
                            </div>
                            <div className="mt-3 flex justify-between text-sm">
                                <span className="font-semibold">{p.name}</span>
                                <span className="text-black/60">${p.price}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="overflow-hidden bg-[#141210] px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,8vw,6rem)] text-white">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Lookbook</p>
                    <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight">Flip through the season</h2>
                </div>
                <div className="mt-10 flex justify-center">
                    <Coverflow3D items={PRODUCTS.map((p) => ({ image: photo(p.img, 700), title: p.name }))} accentColor={ACCENT} />
                </div>
            </section>

            <section className="px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,8vw,6rem)]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-black/50">Find your style</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Swipe right on what you love</h2>
                        <p className="mt-4 text-black/60">We learn your taste in a few swipes and build a shortlist just for you.</p>
                        <div className="mt-8">
                            <MagneticButton accentColor={ACCENT} theme="light">
                                See my picks
                            </MagneticButton>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <SwipeCards cards={PRODUCTS.slice(0, 4).map((p) => ({ image: photo(p.img, 700), title: p.name, subtitle: `$${p.price}` }))} likeColor="#16a34a" />
                    </div>
                </div>
            </section>

            <section className="px-[clamp(1rem,4vw,3rem)] pb-[clamp(4rem,8vw,6rem)]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 rounded-[2rem] bg-white p-[clamp(1.5rem,4vw,3rem)] md:grid-cols-2">
                    <div>
                        <h2 className="text-[clamp(1.6rem,3.4vw,2.6rem)] font-black leading-[1.05] tracking-tight">Shopping that feels easy</h2>
                        <p className="mt-3 text-black/60">Every order comes with the same promises, wherever you are.</p>
                    </div>
                    <div className="flex justify-center">
                        <CardSwap3D cards={PERKS} accentColor={ACCENT} theme="light" />
                    </div>
                </div>
            </section>

            <footer className="flex flex-col justify-between gap-2 border-t border-black/10 px-[clamp(1rem,4vw,3rem)] py-8 text-sm text-black/50 sm:flex-row">
                <span className="font-black text-black">bloom.</span>
                <span>© Bloom Goods · Free returns · Secure checkout</span>
            </footer>
            <ToastStack ref={toast} position="bottom-right" theme="light" />
        </div>
    );
}
