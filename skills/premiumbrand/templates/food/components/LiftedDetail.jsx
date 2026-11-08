import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '../lib/store.jsx';
import { rupees } from '../lib/api.js';
import { reduced, useScrollLock } from '../lib/motion.jsx';
import { HeartButton } from './Brand.jsx';

const LiftedView = lazy(() => import('../three/LiftedView.jsx'));

export default function LiftedDetail({ product: p, onClose, onMove }) {
    const { add, wish, toggleWish } = useStore();
    const [side, setSide] = useState('front');
    const [size, setSize] = useState(null);
    const root = useRef(null);
    const closeBtn = useRef(null);
    useScrollLock(true);

    useEffect(() => {
        setSize(null);
        setSide('front');
    }, [p.slug]);

    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.from(root.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' });
            gsap.from('[data-lift-info]', { y: 24, autoAlpha: 0, duration: 0.8, delay: 0.2, ease: 'expo.out' });
        }, root);
        return () => ctx.revert();
    }, []);

    const cbs = useRef({ onClose, onMove });
    cbs.current = { onClose, onMove };
    useEffect(() => {
        const prev = document.activeElement;
        closeBtn.current?.focus();
        const onKey = (e) => {
            const { onClose: close, onMove: step } = cbs.current;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft' && step) step(-1);
            if (e.key === 'ArrowRight' && step) step(1);
            if (e.key === 'Tab') {
                // keep focus inside the dialog
                const f = root.current.querySelectorAll('button:not([disabled]), a[href]');
                const first = f[0];
                const last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
                else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
            }
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            prev?.focus?.();
        };
    }, []);

    const chosen = p.sizes.find((s) => s.id === size);
    const cta = () => {
        if (!chosen) return;
        add(p.slug, chosen.id);
        onClose();
    };

    return createPortal(
        <div ref={root} role="dialog" aria-modal="true" aria-label={`${p.name}, taken off the shelf`} className="fixed inset-0 z-[70] flex flex-col bg-bg/70 backdrop-blur-xl" data-lenis-prevent>
            <div className="flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
                <div className="flex rounded-full border border-line bg-card p-1" role="group" aria-label="Turn the pack">
                    {['front', 'back'].map((s) => (
                        <button key={s} onClick={() => setSide(s)} aria-pressed={side === s} className={`rounded-full px-4 py-2 text-[13px] font-bold capitalize transition-colors ${side === s ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <button ref={closeBtn} onClick={onClose} className="flex items-center gap-2 rounded-full border border-line bg-card py-2 pl-4 pr-3 text-[13px] font-bold">
                    Close <X size={16} />
                </button>
            </div>

            <div className="relative min-h-0 flex-1">
                <Suspense fallback={null}>
                    <LiftedView product={p} size={size ?? 'm'} side={side} className="absolute inset-0" />
                </Suspense>
                {onMove && (
                    <>
                        <button onClick={() => onMove(-1)} aria-label="Previous pack on the shelf" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-card sm:left-8">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => onMove(1)} aria-label="Next pack on the shelf" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-card sm:right-8">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            <div data-lift-info className="mx-auto w-full max-w-[560px] px-5 pb-6 text-center sm:pb-10">
                <p className="caps !text-[12px] !tracking-[0.3em]">{p.name}</p>
                <p className="mt-2 text-[14px] text-muted">
                    {chosen ? rupees(chosen.price) : `from ${rupees(Math.min(...p.sizes.map((s) => s.price)))}`} · {p.note}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Pack size">
                    {p.sizes.map((s) => (
                        <button key={s.id} disabled={!s.inStock} onClick={() => setSize(s.id)} aria-pressed={size === s.id} className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors disabled:line-through disabled:opacity-40 ${size === s.id ? 'border-ink bg-ink text-bg' : 'border-line bg-card hover:border-ink/40'}`}>
                            {s.label} · {rupees(s.price)}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <button onClick={cta} disabled={!chosen} className={`h-12 min-w-[230px] rounded-full px-6 text-[15px] font-bold transition-colors ${chosen ? 'bg-accent text-white hover:bg-accent-deep' : 'bg-ink/10 text-ink/60'}`}>
                        {chosen ? `Add to bag, ${chosen.label}` : 'Select a size'}
                    </button>
                    <HeartButton on={wish.includes(p.slug)} onClick={() => toggleWish(p.slug)} className="h-12 w-12 border border-line bg-card" />
                </div>
            </div>
        </div>,
        document.body,
    );
}
