import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useStore } from '../lib/store.jsx';
import { reduced } from '../lib/motion.jsx';
import { applyFlavor } from '../lib/theme.js';
import { loadPackTextures } from '../three/kit.js';
import { renderBagShots } from '../three/shots.js';

/*
 * The preloader. A storm of chips blows across the screen while the store really loads
 * (fonts, the catalogue from the server, the pack art and the bag renders); the counter
 * follows that work. When everything is in, the chip in the middle gets its seasoning,
 * spins, bursts, and the panel opens on the hero.
 */
const INTRO_KEY = 'lays.lab.intro';

// a chip outline: an oval with a wobbly edge
const chipPath = (() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const k = 1 + 0.07 * Math.sin(a * 3 + 0.6) + 0.045 * Math.sin(a * 5 + 1.7) + 0.02 * Math.sin(a * 9);
        pts.push([100 + Math.cos(a) * 82 * k, 100 + Math.sin(a) * 64 * k]);
    }
    return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z';
})();

// The storm: chips fly diagonally across a canvas, spinning and flipping, at different depths.
function useStorm(canvas, on) {
    useEffect(() => {
        if (!on) return undefined;
        const c = canvas.current;
        const g = c.getContext('2d');
        const shape = new Path2D(chipPath);
        const dpr = Math.min(devicePixelRatio, 2);
        let W = 0;
        let H = 0;
        const size = () => {
            W = c.clientWidth;
            H = c.clientHeight;
            c.width = W * dpr;
            c.height = H * dpr;
        };
        size();
        addEventListener('resize', size);
        const N = innerWidth < 700 ? 26 : 46;
        const chips = Array.from({ length: N }, (_, i) => ({ x: Math.random(), y: Math.random(), z: 0.35 + Math.random() * 0.9, r: Math.random() * 6, vr: (Math.random() - 0.5) * 2.4, flip: Math.random() * 6, seed: i }));
        let raf = 0;
        let last = performance.now();
        const draw = (now) => {
            raf = requestAnimationFrame(draw);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            g.clearRect(0, 0, W, H);
            for (const ch of chips) {
                ch.x += dt * 0.22 * ch.z;
                ch.y += dt * 0.32 * ch.z;
                ch.r += dt * ch.vr;
                ch.flip += dt * 2.2;
                if (ch.x > 1.15 || ch.y > 1.15) {
                    ch.x = Math.random() * 0.8 - 0.3;
                    ch.y = -0.15;
                }
                const s = (0.22 + ch.z * 0.38) * Math.min(1, W / 900 + 0.35);
                g.save();
                g.translate(ch.x * W, ch.y * H);
                g.rotate(ch.r);
                g.scale(s, s * (0.1 + 0.9 * Math.abs(Math.cos(ch.flip))));
                g.translate(-100, -100);
                g.globalAlpha = 0.45 + ch.z * 0.45;
                g.fillStyle = '#F6D27A';
                g.fill(shape);
                g.strokeStyle = '#C98A25';
                g.lineWidth = 3;
                g.stroke(shape);
                g.fillStyle = 'rgba(201,120,37,0.45)';
                for (let k = 0; k < 4; k++) {
                    g.beginPath();
                    g.ellipse(60 + ((ch.seed * 37 + k * 29) % 80), 70 + ((ch.seed * 13 + k * 23) % 60), 6, 4, 0, 0, Math.PI * 2);
                    g.fill();
                }
                g.restore();
            }
        };
        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            removeEventListener('resize', size);
        };
    }, [canvas, on]);
}

export default function Loader({ onDone }) {
    const { fetchCatalogue, setShots, error } = useStore();
    const root = useRef(null);
    const storm = useRef(null);
    const [shown, setShown] = useState(0);
    const target = useRef({ v: 0 });
    const full = useRef(true);
    const [failed, setFailed] = useState(false);
    useStorm(storm, !reduced());

    useEffect(() => {
        let alive = true;
        let seen = false;
        try {
            seen = sessionStorage.getItem(INTRO_KEY) === '1' && !location.search.includes('intro');
        } catch {
            /* storage blocked: play the full intro */
        }
        full.current = !seen && !reduced();
        const parts = { fonts: 0, cat: 0, packs: 0, shots: 0 };
        const bump = () => {
            const v = parts.fonts * 0.1 + parts.cat * 0.1 + parts.packs * 0.3 + parts.shots * 0.5;
            gsap.to(target.current, { v, duration: 0.5, ease: 'power2.out', onUpdate: () => alive && setShown(Math.round(target.current.v * 100)) });
        };
        const fonts = Promise.all([document.fonts.load('900 80px Archivo'), document.fonts.load('600 16px Inter'), document.fonts.load('700 12px "JetBrains Mono"')])
            .catch(() => {})
            .then(() => {
                parts.fonts = 1;
                bump();
            });
        const start = performance.now();
        const finish = () => {
            try {
                sessionStorage.setItem(INTRO_KEY, '1');
            } catch {
                /* fine */
            }
            gsap.killTweensOf(target.current);
            setShown(100);
            const el = root.current;
            if (reduced()) return onDone();
            const tl = gsap.timeline({ onComplete: onDone });
            const chip = el.querySelector('[data-chip]');
            // the seasoning lands on the chip, it spins and bursts, the panel opens
            tl.to(el.querySelectorAll('[data-season]'), { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.015, ease: 'power2.in' }, 0)
                .to(chip, { rotate: 380, scale: 1.18, duration: 0.7, ease: 'power2.inOut' }, 0.15)
                .to(el.querySelector('[data-count]'), { yPercent: -110, duration: 0.45, ease: 'expo.in' }, 0.2)
                .to(chip, { scale: 7, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, 0.85)
                .fromTo(el.querySelectorAll('[data-crumb]'), { x: 0, y: 0, autoAlpha: 1 }, { x: (i) => Math.cos(i * 0.7) * (260 + (i % 5) * 60), y: (i) => Math.sin(i * 0.7) * (200 + (i % 4) * 50), rotate: (i) => i * 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out' }, 0.9)
                .to(el, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' }, 1.1);
            tl.call(() => window.dispatchEvent(new Event('lays:revealed')), null, 1.3);
        };
        Promise.all([fonts, fetchCatalogue()])
            .then(([, cat]) => {
                parts.cat = 1;
                bump();
                // the hero opens on Flamin' Hot, as in the store window
                applyFlavor(cat.products.find((p) => p.slug === 'flamin-hot') ?? cat.products[0]);
                return loadPackTextures(cat.products, (n) => {
                    parts.packs = n / cat.products.length;
                    bump();
                }).then(() => cat);
            })
            .then((cat) =>
                renderBagShots(cat.products, {
                    onProgress: (p) => {
                        parts.shots = p;
                        bump();
                    },
                }),
            )
            .then((shots) => {
                if (!alive) return;
                setShots(shots);
                const min = full.current ? 1800 : 500;
                const wait = Math.max(0, min - (performance.now() - start));
                setTimeout(() => alive && finish(), wait);
            })
            .catch(() => alive && setFailed(true));
        return () => {
            alive = false;
            gsap.killTweensOf(target.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // the centre chip bobs while it waits
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.to('[data-chip]', { rotate: 10, y: -8, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={root} className="fixed inset-0 z-[100] overflow-hidden bg-flavor text-white" style={{ clipPath: 'circle(150% at 50% 50%)' }} role="status" aria-live="polite" aria-label={`Loading the crunch lab, ${shown} percent`}>
            <canvas ref={storm} className="absolute inset-0 h-full w-full" aria-hidden="true" />
            <div className="relative grid h-full place-items-center">
                <div className="flex flex-col items-center">
                    <div className="relative h-[220px] w-[260px]">
                        <svg data-chip viewBox="0 0 200 200" className="absolute inset-0 m-auto h-[220px] w-[220px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]" aria-hidden="true">
                            <path d={chipPath} fill="#F6D27A" />
                            <path d={chipPath} fill="none" stroke="#C98A25" strokeWidth="3" opacity="0.6" transform="translate(100 100) scale(0.86) translate(-100 -100)" />
                            {[
                                [70, 82, 7],
                                [118, 74, 5],
                                [132, 112, 8],
                                [88, 126, 6],
                                [104, 100, 4],
                            ].map(([x, y, r], i) => (
                                <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#D99A35" opacity="0.6" />
                            ))}
                            {Array.from({ length: 26 }).map((_, i) => (
                                <rect data-season key={i} x={46 + ((i * 41) % 108)} y={58 + ((i * 29) % 84)} width="5" height="5" rx="1" fill="#B8361C" style={{ opacity: 0, transform: 'translateY(-140px)' }} />
                            ))}
                        </svg>
                        {Array.from({ length: 18 }).map((_, i) => (
                            <span data-crumb key={i} className="absolute left-1/2 top-1/2 -ml-2.5 -mt-2 block h-4 w-5 rounded-[40%] bg-[#F6D27A] opacity-0" aria-hidden="true" />
                        ))}
                    </div>
                    <div className="mt-4 h-[1em] overflow-hidden font-wide text-[clamp(72px,13vw,150px)] tabular-nums">
                        <span data-count className="block">
                            {String(shown).padStart(2, '0')}
                        </span>
                    </div>
                    <p className="mono mt-4 text-white/80">{failed || error ? 'The store did not answer' : shown < 100 ? 'Seasoning the chips' : 'Ready'}</p>
                    {(failed || error) && (
                        <div className="mt-4 max-w-sm text-center text-sm text-white/90">
                            <p>Start the API with npm run dev in the project folder, then try again.</p>
                            <button className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-coal" onClick={() => location.reload()}>
                                Try again
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="mono absolute bottom-6 left-0 right-0 text-center text-white/60">Crunch Lab · fan-made concept store</p>
        </div>
    );
}
