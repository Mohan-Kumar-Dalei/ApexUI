import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useStore } from '../lib/store.jsx';
import { reduced, useRevealed } from '../lib/motion.jsx';
import { applyFlavor } from '../lib/theme.js';

const ArcScene = lazy(() => import('../three/ArcScene.jsx'));
const START = 'flamin-hot';
const AUTOPLAY_MS = 4800;

// Concentric rings in a flavour's colours, drawn as solid circles.
function Rings({ p, className = '', style }) {
    const steps = 9;
    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: p.deep, ...style }} aria-hidden="true">
            {Array.from({ length: steps }).map((_, i) => {
                const r = (steps - i) * 15; // vmax
                return <span key={i} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: `${r}vmax`, height: `${r}vmax`, background: i % 2 ? p.colour : mix(p.colour, p.deep, 0.35 + (i / steps) * 0.25) }} />;
            })}
            <span className="absolute left-1/2 top-[52%] h-[30vmax] w-[30vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: mix(p.colour, '#ffffff', 0.12) }} />
        </div>
    );
}

// blend two hex colours
function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

export default function Hero() {
    const { catalogue } = useStore();
    const products = catalogue.products;
    const n = products.length;
    const [active, setActive] = useState(() => Math.max(0, products.findIndex((p) => p.slug === START)));
    const [prev, setPrev] = useState(null);
    const [playing, setPlaying] = useState(() => !reduced());
    const [zoom, setZoom] = useState(false);
    const root = useRef(null);
    const title = useRef(null);
    const front = useRef(null);
    const idle = useRef(Date.now());
    const revealed = useRevealed();
    const p = products[active];

    const go = useCallback(
        (next) => {
            setActive((a) => {
                const to = (((typeof next === 'function' ? next(a) : next) % n) + n) % n;
                if (to !== a) setPrev(products[a]);
                return to;
            });
            setZoom(false);
        },
        [n, products],
    );
    const step = useCallback((d) => go((a) => a + d), [go]);
    const user = (fn) => (...args) => {
        idle.current = Date.now();
        fn(...args);
    };

    // the page wears the flavour on show
    useEffect(() => applyFlavor(p), [p]);

    // the new colours sweep out from the middle over the old ones; the name rises in
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            if (front.current) gsap.fromTo(front.current, { clipPath: 'circle(0% at 50% 52%)' }, { clipPath: 'circle(75% at 50% 52%)', duration: 1.1, ease: 'expo.inOut' });
            gsap.fromTo('[data-name-line]', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' });
            gsap.fromTo('[data-index]', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' });
        }, root);
        return () => ctx.revert();
    }, [active]);

    // autoplay, paused while someone is browsing or the hero is off screen
    useEffect(() => {
        if (!playing) return undefined;
        let onScreen = true;
        const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
        io.observe(root.current);
        const t = setInterval(() => {
            if (onScreen && Date.now() - idle.current > AUTOPLAY_MS && !zoom) step(1);
        }, AUTOPLAY_MS);
        return () => {
            clearInterval(t);
            io.disconnect();
        };
    }, [playing, step, zoom]);

    // keyboard arrows while the hero is in view
    useEffect(() => {
        const onKey = (e) => {
            if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (scrollY > innerHeight * 0.6) return;
            if (e.key === 'ArrowRight') user(step)(1);
            if (e.key === 'ArrowLeft') user(step)(-1);
        };
        addEventListener('keydown', onKey);
        return () => removeEventListener('keydown', onKey);
    });

    const words = p.name.toUpperCase().split(' ');
    const half = Math.ceil(words.length / 2);
    const lines = words.length > 2 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : words.length === 2 && p.name.length > 12 ? words : [words.join(' ')];

    return (
        <section ref={root} id="flavors" data-tone={p.text === 'dark' ? 'light' : 'dark'} className="relative h-[100svh] min-h-[620px] overflow-hidden" aria-roledescription="carousel" aria-label="Flavours">
            {prev && <Rings p={prev} />}
            <div ref={front} className="absolute inset-0">
                <Rings p={p} />
            </div>

            <div className="absolute inset-0">
                {revealed && (
                <Suspense fallback={null}>
                    <ArcScene products={products} active={active} zoom={zoom} onDrag={user(step)} onPick={user((i) => (i === active ? setZoom((z) => !z) : go(i)))} className="absolute inset-0" />
                </Suspense>
                )}
            </div>

            <p className="mono pointer-events-none absolute left-8 top-[124px] hidden sm:block" style={{ color: p.ink, opacity: 0.75 }}>
                Drag to browse · Click to zoom · Scroll to explore
            </p>

            {/* arrows under the middle bag */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[25%] flex justify-center gap-[min(26vw,340px)]">
                {[
                    [-1, ChevronLeft, 'Previous flavour'],
                    [1, ChevronRight, 'Next flavour'],
                ].map(([d, Icon, label]) => (
                    <button key={d} onClick={user(() => step(d))} aria-label={label} className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full border backdrop-blur-sm transition hover:scale-105" style={{ color: p.ink, borderColor: `${p.ink}55`, background: `${p.ink}12` }}>
                        <Icon size={22} />
                    </button>
                ))}
            </div>

            {/* the flavour name */}
            <div ref={title} className="pointer-events-none absolute inset-x-0 bottom-[6%] text-center" style={{ color: p.ink }} aria-live="polite">
                <h1 className="sr-only">Lay's flavours: {p.name}</h1>
                <p className="font-wide text-[clamp(40px,5.8vw,100px)] drop-shadow-[0_6px_24px_rgba(0,0,0,0.25)]" aria-hidden="true">
                    {lines.map((l) => (
                        <span key={l} className="block overflow-hidden pb-[0.04em]">
                            <span data-name-line className="block">
                                {l}
                            </span>
                        </span>
                    ))}
                </p>
            </div>

            {/* index and autoplay */}
            <div className="absolute bottom-[6%] right-8 hidden flex-col items-end gap-4 md:flex" style={{ color: p.ink }}>
                <span data-index className="outline-text font-wide text-[clamp(90px,9vw,150px)] opacity-60" aria-hidden="true">
                    {String(active + 1).padStart(2, '0')}
                </span>
                <button onClick={() => setPlaying((v) => !v)} aria-pressed={playing} className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full border" style={{ borderColor: `${p.ink}66` }}>
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                    </span>
                    <span className="mono">{playing ? 'Autoplay' : 'Paused'}</span>
                </button>
            </div>
            <p className="sr-only" aria-live="polite">
                {active + 1} of {n}: {p.name}. {p.note}
            </p>
        </section>
    );
}
