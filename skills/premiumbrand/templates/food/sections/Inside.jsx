import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flame, Package, Sparkles, Sprout } from 'lucide-react';
import { reduced, getLenis, useRevealed } from '../lib/motion.jsx';
import { currentFlavor } from '../lib/theme.js';

const InsideScene = lazy(() => import('../three/InsideScene.jsx'));

/*
 * Inside: a pinned scroll story in four chapters. The bag turns and dollies with the
 * scroll, its hotspots call out what each chapter is about, and a chapter bar and an icon
 * rail show where you are. After the story, a storm of chips crosses the screen.
 */
const CHAPTERS = [
    {
        k: 'The bag',
        word: 'BAG',
        title: ['Built to', 'protect'],
        text: 'A pillow of air cushions every chip, while a foil-lined film keeps out light and moisture until the moment you tear it open.',
        icon: Package,
        spots: [
            ['Foil-lined film', 'Blocks light and moisture'],
            ['Heat-sealed crimp', 'Locks the freshness in'],
            ['Air cushion', 'Keeps every chip whole'],
        ],
    },
    {
        k: 'The potato',
        word: 'POTATO',
        title: ['Real', 'potatoes'],
        text: 'Whole potatoes, washed, steam-peeled and sliced thinner than a coin. Nothing pressed, nothing reformed, just the slice.',
        icon: Sprout,
        spots: [
            ['Sliced thin', 'About 1.5 mm a chip'],
            ['Steam-peeled', 'Skin off, flavour in'],
            ['Farm grown', 'Picked for frying'],
        ],
    },
    {
        k: 'The fry',
        word: 'GOLD',
        title: ['Fried to', 'gold'],
        text: 'Each slice takes a few minutes in hot oil and comes out light, golden and loud. Then it is shaken dry before the seasoning.',
        icon: Flame,
        spots: [
            ['Hot oil', 'A few minutes, no more'],
            ['Golden edge', 'That is the crunch'],
            ['Shaken dry', 'So the seasoning sticks'],
        ],
    },
    {
        k: 'The seasoning',
        word: 'FLAVOR',
        title: ['Tumbled in', 'flavor'],
        text: 'The chips turn in a drum while the seasoning snows down on them, so every chip in the bag gets its share.',
        icon: Sparkles,
        spots: [
            ['Tumbled', 'In a turning drum'],
            ['Seasoned warm', 'It clings better'],
            ['Every chip', 'Coated, edge to edge'],
        ],
    },
];

export default function Inside() {
    const root = useRef(null);
    const progress = useRef(0);
    const labels = useRef([]);
    const [ch, setCh] = useState(0);
    const [product, setProduct] = useState(currentFlavor);
    const revealed = useRevealed();

    useEffect(() => {
        const on = (e) => setProduct(e.detail);
        addEventListener('lays:flavor', on);
        return () => removeEventListener('lays:flavor', on);
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(progress, {
                current: 4,
                ease: 'none',
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: reduced() ? true : 0.6,
                    onUpdate: (s) => setCh(Math.min(3, Math.floor(s.progress * 4))),
                },
            });
        }, root);
        return () => ctx.revert();
    }, []);

    // the chapter text slides in on each change
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.fromTo('[data-ch-line]', { yPercent: 105 }, { yPercent: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' });
            gsap.fromTo('[data-ch-text]', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.15, ease: 'expo.out' });
            gsap.fromTo('[data-ch-word]', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'expo.out' });
        }, root);
        return () => ctx.revert();
    }, [ch]);

    const jump = (i) => {
        const top = root.current.getBoundingClientRect().top + scrollY;
        const y = top + (root.current.offsetHeight - innerHeight) * ((i + 0.5) / 4);
        const l = getLenis();
        if (l) l.scrollTo(y, { duration: 1.2 });
        else scrollTo({ top: y, behavior: 'smooth' });
    };
    const c = CHAPTERS[ch];

    return (
        <section ref={root} id="inside" data-tone="dark" className="relative bg-flavor-deep text-white" style={{ height: '420svh' }} aria-label="Inside the bag">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                {/* flat backdrop with the chapter word in outline */}
                <div className="absolute inset-0 bg-flavor-deep" aria-hidden="true" />
                <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
                <p data-ch-word className="outline-text pointer-events-none absolute right-[-2vw] top-1/2 -translate-y-1/2 select-none font-wide text-[clamp(120px,22vw,380px)] text-white/10" aria-hidden="true">
                    {c.word}
                </p>

                <div className="absolute inset-0">
                    {revealed && (
                        <Suspense fallback={null}>
                            <InsideScene product={product} progress={progress} labels={labels} className="absolute inset-0" />
                        </Suspense>
                    )}
                </div>

                {/* hotspot labels, placed by the scene every frame */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {CHAPTERS.flatMap((cc, ci) =>
                        cc.spots.map(([h, s], k) => (
                            <div key={`${ci}-${k}`} ref={(n) => (labels.current[ci * 3 + k] = n)} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500" style={{ willChange: 'transform' }}>
                                <span className="absolute -left-2 -top-2 block h-4 w-4 rounded-full border-2 border-white bg-white/30 shadow-[0_0_0_6px_rgba(255,255,255,0.15)]" />
                                <span className={`absolute top-0 block h-px w-14 bg-white/70 ${k % 2 ? 'left-2' : 'right-2'}`} />
                                <span className={`absolute -top-6 block w-max max-w-[220px] rounded-xl border border-white/15 bg-black/45 px-4 py-2.5 backdrop-blur-md ${k % 2 ? 'left-16' : 'right-16 text-right'}`}>
                                    <span className="mono block !text-[11px] text-white">{h}</span>
                                    <span className="mt-1 block text-[14px] text-white/85">{s}</span>
                                </span>
                            </div>
                        )),
                    )}
                </div>

                {/* the chapter copy */}
                <div className="relative z-10 flex h-full max-w-[720px] flex-col justify-center px-8 pt-16 sm:px-14 max-lg:justify-end max-lg:pb-16">
                    <div className="flex items-center gap-4">
                        <span className="mono rounded-md bg-white px-2.5 py-1.5 !text-[12px] text-coal">0{ch + 1}</span>
                        <span className="relative h-[2px] w-40 bg-white/20">
                            <span className="absolute inset-y-0 left-0 bg-white transition-[width] duration-500" style={{ width: `${((ch + 1) / 4) * 100}%` }} />
                        </span>
                        <span className="mono !text-[12px] text-white/60">04</span>
                    </div>
                    <p className="mono mt-10 flex items-center gap-3 text-white/80">
                        <span className="h-px w-8 bg-white/60" /> Chapter 0{ch + 1} · {c.k}
                    </p>
                    <h2 className="mt-5 font-wide text-[clamp(44px,5.4vw,92px)]">
                        {c.title.map((t) => (
                            <span key={t} className="block overflow-hidden pb-[0.04em]">
                                <span data-ch-line className="block">
                                    {t}
                                </span>
                            </span>
                        ))}
                    </h2>
                    <p data-ch-text className="mt-6 max-w-[34rem] text-[clamp(16px,1.3vw,20px)] leading-relaxed text-white/90">
                        {c.text}
                    </p>
                    <ul className="mt-6 space-y-1 text-[14px] text-white/80 lg:hidden">
                        {c.spots.map(([h, s]) => (
                            <li key={h}>
                                <b className="font-semibold text-white">{h}.</b> {s}.
                            </li>
                        ))}
                    </ul>
                </div>

                {/* the chapter rail */}
                <nav aria-label="Chapters" className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
                    {CHAPTERS.map((cc, i) => {
                        const Icon = cc.icon;
                        const on = i === ch;
                        return (
                            <button key={cc.k} onClick={() => jump(i)} aria-label={`Chapter ${i + 1}, ${cc.k}`} aria-current={on ? 'step' : undefined} className={`grid place-items-center rounded-full transition-all duration-500 ${on ? 'h-16 w-16 bg-white text-coal shadow-[0_0_0_10px_rgba(255,255,255,0.12)]' : 'h-12 w-12 border border-white/25 bg-white/10 text-white hover:bg-white/20'}`}>
                                <Icon size={on ? 22 : 18} />
                            </button>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
}

/* ---------- the chip storm: chips cross the screen as you scroll past ---------- */
const chipPath = (() => {
    const pts = [];
    for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const k = 1 + 0.07 * Math.sin(a * 3 + 0.6) + 0.045 * Math.sin(a * 5 + 1.7);
        pts.push([100 + Math.cos(a) * 82 * k, 100 + Math.sin(a) * 64 * k]);
    }
    return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z';
})();

export function Storm() {
    const root = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
            root.current.querySelectorAll('[data-storm]').forEach((el, i) => {
                const row = (i % 7) / 7;
                tl.fromTo(el, { x: () => -300 - (i % 5) * 160, y: `${row * 90}vh`, rotate: i * 37 }, { x: () => innerWidth + 200 + (i % 4) * 200, y: `${row * 90 + 12 - (i % 3) * 10}vh`, rotate: i * 37 + 540, ease: 'none' }, (i % 6) * 0.05);
            });
            tl.fromTo('[data-storm-word]', { scale: 0.8, autoAlpha: 0 }, { scale: 1.05, autoAlpha: 1, ease: 'none', duration: 0.5 }, 0).to('[data-storm-word]', { scale: 1.2, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0.5);
        }, root);
        return () => ctx.revert();
    }, []);
    return (
        <section ref={root} data-tone="dark" className="relative h-[180svh] bg-flavor text-white" aria-label="Chip storm">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
            <p data-storm-word className="absolute inset-0 grid place-content-center text-center font-wide text-[clamp(64px,13vw,220px)]" aria-hidden="true">
                Crunch
                <br />
                <span className="outline-text">time</span>
            </p>
            {Array.from({ length: 28 }).map((_, i) => (
                <svg data-storm key={i} viewBox="0 0 200 200" className="absolute left-0 top-0" style={{ width: `${70 + (i % 5) * 34}px` }} aria-hidden="true">
                    <path d={chipPath} fill="#F6D27A" stroke="#C98A25" strokeWidth="3" />
                    <ellipse cx={80 + (i % 4) * 12} cy={90} rx="7" ry="5" fill="#D99A35" opacity="0.6" />
                    <ellipse cx={120} cy={110 + (i % 3) * 8} rx="6" ry="4" fill="#D99A35" opacity="0.6" />
                </svg>
            ))}
            </div>
        </section>
    );
}
