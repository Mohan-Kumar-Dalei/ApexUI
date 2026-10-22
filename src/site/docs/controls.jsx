import { useEffect, useId, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

/* Small, consistent inputs for the live "playground" panels under previews. */

export function ControlGrid({ children }) {
    return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export default function ColorControl({ label, value, onChange }) {
    return (
        <label className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--ink-2)]">{label}</span>
            <span className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] py-1 pl-1 pr-2.5">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                />
                <span className="font-mono text-xs uppercase text-[var(--ink-2)]">{value}</span>
            </span>
        </label>
    );
}

const decimalsOf = (n) => (String(n).split('.')[1] || '').length;

/*
 * Custom elastic slider: a lime fill and a thumb that grows while held. Drag
 * past either end and the track stretches like rubber (the thumb rides the
 * stretched end), then springs back on release. Full keyboard support.
 */
const MAX_PULL = 36;
const pull = (px) => Math.sign(px) * (2 / (1 + Math.exp(-Math.abs(px) / MAX_PULL)) - 1) * MAX_PULL;

export function RangeControl({ label, value, onChange, min, max, step = 1, format = (v) => v }) {
    const trackRef = useRef(null);
    const labelId = useId();
    const [held, setHeld] = useState(false);
    const [hover, setHover] = useState(false);
    // Refs, not state, inside the pointer handlers: state lags a render, which
    // made a quick second drag compare against a stale value and stop short.
    const dragging = useRef(false);
    const last = useRef(value);
    last.current = dragging.current ? last.current : value;
    const overflow = useMotionValue(0);
    const scaleX = useTransform(overflow, (o) => 1 + Math.abs(o) / (trackRef.current?.offsetWidth || 200));
    const originX = useTransform(overflow, (o) => (o < 0 ? 1 : 0));
    const pct = ((value - min) / (max - min)) * 100;

    const snap = (v) => {
        const stepped = Math.round((v - min) / step) * step + min;
        return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimalsOf(step)));
    };
    const fromPointer = (e) => {
        const r = trackRef.current.getBoundingClientRect();
        const next = snap(min + ((e.clientX - r.left) / r.width) * (max - min));
        if (next !== last.current) {
            last.current = next;
            onChange(next);
        }
        overflow.set(pull(e.clientX < r.left ? e.clientX - r.left : e.clientX > r.right ? e.clientX - r.right : 0));
    };
    const release = () => {
        if (!dragging.current) return;
        dragging.current = false;
        setHeld(false);
        animate(overflow, 0, { type: 'spring', stiffness: 420, damping: 14 });
    };
    const onKeyDown = (e) => {
        const big = (max - min) / 10;
        const next = { ArrowRight: value + step, ArrowUp: value + step, ArrowLeft: value - step, ArrowDown: value - step, PageUp: value + big, PageDown: value - big, Home: min, End: max }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        onChange(snap(next));
    };
    const thick = held || hover;

    return (
        <div className="block">
            <span className="mb-2.5 flex items-center justify-between text-sm">
                <span id={labelId} className="text-[var(--ink-2)]">{label}</span>
                <span className="rounded-md bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-xs tabular-nums text-[var(--ink)]">{format(value)}</span>
            </span>
            <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-labelledby={labelId}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={String(format(value))}
                onKeyDown={onKeyDown}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    // No text selection / native drag: those fire pointercancel mid-drag.
                    e.preventDefault();
                    e.currentTarget.focus({ preventScroll: true });
                    e.currentTarget.setPointerCapture(e.pointerId);
                    overflow.stop();
                    dragging.current = true;
                    setHeld(true);
                    fromPointer(e);
                }}
                onPointerMove={(e) => dragging.current && fromPointer(e)}
                onPointerUp={release}
                onPointerCancel={release}
                onLostPointerCapture={release}
                className="relative flex h-6 cursor-grab touch-none select-none items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime-line)] active:cursor-grabbing"
            >
                <motion.span className="absolute inset-x-0 overflow-hidden rounded-full bg-[var(--panel-3)]" style={{ scaleX, originX }} animate={{ height: thick ? 8 : 6 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}>
                    <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--lime)]" style={{ width: `${pct}%`, transition: held ? 'none' : 'width 160ms ease-out' }} />
                </motion.span>
                <motion.span
                    className="absolute h-4 w-4 rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
                    style={{ left: `${pct}%`, marginLeft: '-0.5rem', x: overflow, transition: held ? 'none' : 'left 160ms ease-out' }}
                    animate={{ scale: held ? 1.3 : hover ? 1.12 : 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                />
            </div>
        </div>
    );
}

/* Custom dropdown: a button and an animated listbox with arrow-key, Enter and Escape support. */
export function SelectControl({ label, value, onChange, options }) {
    const items = options.map((o) => ({ value: o.value ?? o, label: o.label ?? o }));
    const [open, setOpen] = useState(false);
    const [hi, setHi] = useState(0);
    const rootRef = useRef(null);
    const listId = useId();
    const current = items.find((o) => o.value === value) ?? items[0];

    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, [open]);

    const choose = (o) => {
        onChange(o.value);
        setOpen(false);
    };
    const onKeyDown = (e) => {
        if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            setHi(Math.max(0, items.indexOf(current)));
            setOpen(true);
            return;
        }
        if (!open) return;
        if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHi((i) => (i + 1) % items.length);
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHi((i) => (i - 1 + items.length) % items.length);
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            choose(items[hi]);
        }
    };

    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--ink-2)]">{label}</span>
            <div ref={rootRef} className="relative">
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-label={`${label}: ${current?.label}`}
                    onClick={() => {
                        setHi(Math.max(0, items.indexOf(current)));
                        setOpen((o) => !o);
                    }}
                    onKeyDown={onKeyDown}
                    className={`flex h-8 min-w-[7.5rem] items-center justify-between gap-2 rounded-lg border bg-[var(--bg)] pl-2.5 pr-2 text-sm text-[var(--ink)] outline-none transition-colors hover:border-[var(--line-strong)] focus-visible:ring-2 focus-visible:ring-[var(--lime-line)] ${open ? 'border-[var(--lime-line)]' : 'border-[var(--line)]'}`}
                >
                    <span className="truncate">{current?.label}</span>
                    <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-[var(--ink-3)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.ul
                            id={listId}
                            role="listbox"
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute right-0 top-full z-40 mt-1.5 max-h-64 min-w-full origin-top-right overflow-auto rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1 shadow-[var(--shadow)]"
                        >
                            {items.map((o, i) => {
                                const selected = o.value === current?.value;
                                return (
                                    <li
                                        key={String(o.value)}
                                        role="option"
                                        aria-selected={selected}
                                        onPointerEnter={() => setHi(i)}
                                        onClick={() => choose(o)}
                                        className={`flex cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm transition-colors ${i === hi ? 'bg-[var(--panel-2)] text-[var(--ink)]' : 'text-[var(--ink-2)]'}`}
                                    >
                                        {o.label}
                                        {selected && <Check className="h-3.5 w-3.5 text-[var(--lime-text)]" />}
                                    </li>
                                );
                            })}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export function ToggleControl({ label, value, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--ink-2)]">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={value}
                onClick={() => onChange(!value)}
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${value ? 'justify-end bg-[var(--lime)]' : 'justify-start bg-[var(--panel-3)]'}`}
            >
                <span className="h-4 w-4 rounded-full bg-white shadow" />
            </button>
        </label>
    );
}
