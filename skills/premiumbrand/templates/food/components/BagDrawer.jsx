import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useQuote, useStore } from '../lib/store.jsx';
import { rupees } from '../lib/api.js';
import { useScrollLock } from '../lib/motion.jsx';
import { ArrowPill } from './Brand.jsx';

// One bag line, used in the drawer and at checkout. Prices come from the server quote.
export function BagLine({ line, index, priced, compact = false }) {
    const { shots, bySlug, setQty, remove, catalogue } = useStore();
    const p = bySlug.get(line.slug);
    const s = p?.sizes.find((x) => x.id === line.size);
    const box = line.box === 'pick3' ? { name: '3 pack' } : line.box ? catalogue?.boxes.find((b) => b.id === line.box) : null;
    if (!p || !s) return null;
    return (
        <li className="flex gap-3 py-4">
            <span className="grid h-20 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: p.colour + '24' }}>
                {shots[p.slug] && <img src={shots[p.slug]} alt="" className="h-[72px] w-auto" />}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold">{p.name}</p>
                        <p className="text-[13px] text-muted">
                            {s.label}
                            {box && <span className="ml-2 rounded-full bg-sun/40 px-2 py-0.5 text-[11px] font-bold text-ink">{box.name}</span>}
                        </p>
                    </div>
                    <div className="text-right tabular-nums">
                        <p className="text-[15px] font-bold">{priced ? rupees(priced.lineTotal - priced.boxOff) : '...'}</p>
                        {priced?.boxOff > 0 && <p className="text-[12px] text-muted line-through">{rupees(priced.lineTotal)}</p>}
                    </div>
                </div>
                {!compact && (
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-line">
                            <button onClick={() => setQty(index, line.qty - 1)} aria-label={`One fewer ${p.name}`} className="grid h-8 w-8 place-items-center">
                                <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-[14px] font-bold tabular-nums" aria-label={`${line.qty} packs`}>
                                {line.qty}
                            </span>
                            <button onClick={() => setQty(index, line.qty + 1)} disabled={line.qty >= 24} aria-label={`One more ${p.name}`} className="grid h-8 w-8 place-items-center disabled:opacity-30">
                                <Plus size={14} />
                            </button>
                        </div>
                        <button onClick={() => remove(index)} aria-label={`Remove ${p.name} from bag`} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-accent">
                            <Trash2 size={15} />
                        </button>
                    </div>
                )}
                {compact && <p className="mt-1 text-[13px] text-muted">Qty {line.qty}</p>}
            </div>
        </li>
    );
}

export function priceFor(quote, line) {
    return quote.data?.lines.find((l) => l.slug === line.slug && l.size === line.size && (l.box || null) === (line.box || null));
}

export function Totals({ t, compact = false }) {
    if (!t) return null;
    const rows = [
        ['Subtotal', rupees(t.subtotal)],
        t.boxDiscount > 0 && ['3 pack savings', '−' + rupees(t.boxDiscount)],
        t.discount > 0 && [`Code ${t.coupon.code}`, '−' + rupees(t.discount)],
        ['Delivery', t.shipping ? rupees(t.shipping) : 'Free'],
    ].filter(Boolean);
    return (
        <dl className="space-y-2 text-[14px]">
            {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold tabular-nums">{v}</dd>
                </div>
            ))}
            <div className={`flex items-baseline justify-between border-t border-line pt-3 ${compact ? '' : 'mt-1'}`}>
                <dt className="font-bold">Total</dt>
                <dd className="font-display text-[28px] font-black tabular-nums">{rupees(t.total)}</dd>
            </div>
        </dl>
    );
}

export default function BagDrawer() {
    const { bag, bagOpen, setBagOpen, count } = useStore();
    const quote = useQuote(bag, '', bagOpen && bag.length > 0);
    const navigate = useNavigate();
    const closeBtn = useRef(null);
    useScrollLock(bagOpen);

    useEffect(() => {
        if (!bagOpen) return undefined;
        closeBtn.current?.focus();
        const onKey = (e) => e.key === 'Escape' && setBagOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [bagOpen, setBagOpen]);

    const t = quote.data?.totals;
    const left = t ? Math.max(0, t.freeShippingFrom - (t.subtotal - t.boxDiscount - t.discount)) : 0;

    return createPortal(
        <div className={`fixed inset-0 z-[80] ${bagOpen ? '' : 'pointer-events-none'}`} aria-hidden={!bagOpen}>
            <div onClick={() => setBagOpen(false)} className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ${bagOpen ? 'opacity-100' : 'opacity-0'}`} />
            <aside role="dialog" aria-modal="true" aria-label="Your bag" className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-bg transition-[transform,visibility] duration-700 ease-expo ${bagOpen ? 'visible translate-x-0 shadow-2xl' : 'invisible translate-x-full'}`}>
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <p className="font-display text-[26px] font-black">
                        Your bag <span className="font-sans text-[15px] font-semibold text-muted">{count} packs</span>
                    </p>
                    <button ref={closeBtn} tabIndex={bagOpen ? 0 : -1} onClick={() => setBagOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Close bag">
                        <X size={18} />
                    </button>
                </div>
                {bag.length === 0 ? (
                    <div className="grid flex-1 place-items-center px-8 text-center">
                        <div>
                            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sun">
                                <ShoppingBag size={26} />
                            </span>
                            <p className="mt-5 font-display text-[26px] font-black">Nothing here yet.</p>
                            <p className="mt-2 text-[15px] text-muted">Grab a bag off the wall or build a 3 pack.</p>
                            <button
                                tabIndex={bagOpen ? 0 : -1}
                                onClick={() => {
                                    setBagOpen(false);
                                    navigate('/#shelf');
                                }}
                                className="mt-6 rounded-full bg-ink px-6 py-3 text-[14px] font-bold text-bg"
                            >
                                Go to the shelf
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {t && (
                            <div className="border-b border-line px-5 py-3">
                                <p className="text-[13px] font-semibold">{left > 0 ? `Add ${rupees(left)} more for free delivery.` : 'Delivery is free on this order.'}</p>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                                    <div className="h-full rounded-full bg-accent transition-all duration-700 ease-expo" style={{ width: `${Math.min(100, ((t.freeShippingFrom - left) / t.freeShippingFrom) * 100)}%` }} />
                                </div>
                            </div>
                        )}
                        <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5" data-lenis-prevent>
                            {bag.map((l, i) => (
                                <BagLine key={`${l.slug}-${l.size}-${l.box}`} line={l} index={i} priced={priceFor(quote, l)} />
                            ))}
                        </ul>
                        <div className="border-t border-line px-5 pb-6 pt-4">
                            {quote.error ? <p className="text-[14px] text-accent">{quote.error}</p> : <Totals t={t} />}
                            <ArrowPill
                                tone="accent"
                                className="mt-4 w-full justify-between"
                                tabIndex={bagOpen ? 0 : -1}
                                disabled={!t}
                                onClick={() => {
                                    setBagOpen(false);
                                    navigate('/checkout');
                                }}
                            >
                                Checkout
                            </ArrowPill>
                            <p className="mt-3 text-center text-[12px] text-muted">Codes and delivery are checked at the next step.</p>
                        </div>
                    </>
                )}
            </aside>
        </div>,
        document.body,
    );
}
