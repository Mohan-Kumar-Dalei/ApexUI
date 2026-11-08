import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../lib/store.jsx';
import { reduced, useRevealed } from '../lib/motion.jsx';
import LiftedDetail from '../components/LiftedDetail.jsx';

const RackScene = lazy(() => import('../three/RackScene.jsx'));

/*
 * The Rack: every flavour on a hook. Drag the rail (or the wheel underneath) to browse,
 * run the pointer through the bags to make them swing, tap a bag to spin it on its hook,
 * and "Taste it" takes the one in front off the rail to pick a size.
 */
export default function Rack() {
    const { catalogue } = useStore();
    const products = catalogue.products;
    const n = products.length;
    const pos = useRef(Math.floor(n / 2) - 1);
    const tags = useRef([]);
    const scene = useRef(null);
    const wheel = useRef(null);
    const root = useRef(null);
    const [at, setAt] = useState(pos.current);
    const [open, setOpen] = useState(-1);
    const revealed = useRevealed();

    const setPos = (v, snap = false) => {
        const c = Math.max(0, Math.min(n - 1, v));
        pos.current = snap ? Math.round(c) : c;
        setAt(Math.round(c));
    };

    // drag anywhere on the stage, or on the wheel
    const drag = (scale) => {
        let start = null;
        return {
            onPointerDown: (e) => {
                start = { x: e.clientX, p: pos.current };
                e.currentTarget.setPointerCapture?.(e.pointerId);
            },
            onPointerMove: (e) => {
                if (!start || !e.buttons) return;
                setPos(start.p - (e.clientX - start.x) / scale());
            },
            onPointerUp: () => {
                if (start) setPos(pos.current, true);
                start = null;
            },
        };
    };
    const stageDrag = drag(() => Math.max(160, innerWidth / 5));
    const wheelDrag = drag(() => -(wheel.current?.clientWidth ?? 800) / (n + 1));

    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.from('[data-rack-title] span', { yPercent: 105, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
        }, root);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (!root.current) return;
            const r = root.current.getBoundingClientRect();
            if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5 || open >= 0) return;
            if (e.key === 'ArrowRight') setPos(pos.current + 1, true);
            if (e.key === 'ArrowLeft') setPos(pos.current - 1, true);
        };
        addEventListener('keydown', onKey);
        return () => removeEventListener('keydown', onKey);
    });

    return (
        <section ref={root} id="range" data-tone="light" className="relative overflow-hidden bg-stone pb-10 pt-32 text-coal md:pt-36" aria-label="The rack">
            <p className="outline-text pointer-events-none absolute inset-x-0 top-[24%] select-none text-center font-wide text-[clamp(160px,30vw,560px)] text-coal/[0.07]" aria-hidden="true">
                Rack
            </p>
            <div className="relative mx-auto flex max-w-[1760px] flex-wrap items-start justify-between gap-6 px-5 sm:px-10">
                <div>
                    <p className="mono text-coal/60">
                        The rack · {String(n).padStart(2, '0')} flavors
                    </p>
                    <h2 data-rack-title className="mt-3 font-wide text-[clamp(52px,7.4vw,128px)]">
                        <span className="block overflow-hidden pb-[0.04em]">
                            <span className="block">Pick your</span>
                        </span>
                        <span className="block overflow-hidden pb-[0.04em]">
                            <span className="block">crunch</span>
                        </span>
                    </h2>
                </div>
                <p className="max-w-[22rem] text-right text-[17px] text-coal/70">Drag the rail to browse. Run your cursor through the bags. Tap one to spin it on its hook.</p>
            </div>

            {/* the stage */}
            <div className="relative mt-4 h-[min(64svh,620px)] min-h-[440px] cursor-grab touch-pan-y select-none active:cursor-grabbing" {...stageDrag}>
                {revealed && (
                <Suspense fallback={null}>
                    <RackScene ref={scene} products={products} pos={pos} tags={tags} onTap={(i) => scene.current?.spin(i)} className="absolute inset-0" />
                </Suspense>
                )}
                <div className="pointer-events-none absolute inset-0">
                    {products.map((p, i) => (
                        <div key={p.slug}>
                            <span ref={(node) => ((tags.current[i] ??= {}).tag = node)} className="absolute left-0 top-0" style={{ opacity: 'var(--dim, 1)' }}>
                                <span className="absolute -left-2 top-0 block -translate-y-1/2 rounded-md bg-white px-2 py-1.5 font-wide text-[15px] shadow-[0_6px_14px_rgba(0,0,0,0.12)]">
                                    {String(i + 1).padStart(2, '0')}
                                    <span className="mt-1 block h-[3px] rounded-full" style={{ background: p.colour }} />
                                </span>
                            </span>
                            <div ref={(node) => ((tags.current[i] ??= {}).cap = node)} className="absolute left-0 top-0" style={{ opacity: 'var(--dim, 1)' }}>
                                <div className="flex w-[210px] -translate-x-1/2 flex-col items-center text-center">
                                    <span className="mono !text-[11px] text-coal/50">
                                        {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                                    </span>
                                    <span className="mt-1 font-wide text-[clamp(16px,1.4vw,22px)] leading-[0.95]">{p.name}</span>
                                    <button onClick={() => setOpen(i)} onPointerDown={(e) => e.stopPropagation()} className="mono pointer-events-auto mt-3 flex items-center gap-2 rounded-full border border-coal/15 bg-white/60 px-4 py-2 !text-[11px] hover:bg-white">
                                        Taste it <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* the wheel */}
            <div className="relative mx-auto mt-4 flex max-w-[1760px] items-center gap-6 px-5 sm:px-10">
                <span className="mono shrink-0 tabular-nums">
                    {String(at + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </span>
                <div ref={wheel} className="relative h-14 flex-1 cursor-ew-resize touch-none select-none" {...wheelDrag} role="slider" aria-label="Rack position" aria-valuemin={1} aria-valuemax={n} aria-valuenow={at + 1} tabIndex={0} onKeyDown={(e) => (e.key === 'ArrowRight' ? setPos(pos.current + 1, true) : e.key === 'ArrowLeft' ? setPos(pos.current - 1, true) : null)}>
                    <div className="absolute inset-x-0 top-1/2 h-px bg-coal/15" />
                    {Array.from({ length: (n - 1) * 5 + 1 }).map((_, k) => {
                        const major = k % 5 === 0;
                        return <span key={k} className={`absolute top-1/2 w-px -translate-y-1/2 ${major ? 'h-7 bg-coal/60' : 'h-3 bg-coal/25'}`} style={{ left: `${(k / ((n - 1) * 5)) * 100}%` }} />;
                    })}
                    {products.map((p, i) => (
                        <button key={p.slug} onClick={() => setPos(i, true)} className="mono absolute top-[calc(50%+18px)] -translate-x-1/2 !text-[10px] text-coal/50 hover:text-coal" style={{ left: `${(i / (n - 1)) * 100}%` }} aria-label={`Go to ${p.name}`}>
                            {String(i + 1).padStart(2, '0')}
                        </button>
                    ))}
                    <span className="pointer-events-none absolute top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6A2B] transition-[left] duration-300" style={{ left: `${(at / (n - 1)) * 100}%` }} />
                </div>
                <span className="mono hidden shrink-0 sm:block">Drag the wheel</span>
            </div>

            {open >= 0 && <LiftedDetail product={products[open]} onClose={() => setOpen(-1)} onMove={(d) => setOpen((o) => (o + d + n) % n)} />}
        </section>
    );
}
