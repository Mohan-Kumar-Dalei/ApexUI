import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Volume1, Volume2 } from "lucide-react";

/*
 * Elastic Slider: a volume-style slider with a knob. Grab anywhere on the
 * track and drag; pull past either end and the track stretches like rubber
 * (the end icon gets dragged along), then springs back when you let go.
 * The fill follows the pointer every frame — no React render in the loop.
 * Arrow keys, Page Up/Down, Home and End work too.
 */

const MAX_OVERFLOW = 56;
// Diminishing stretch: the further you pull, the less it gives.
const decay = (v, max) => (2 / (1 + Math.exp(-v / max)) - 1) * max;

const ElasticSlider = ({
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    leftIcon = <Volume1 className="h-5 w-5" />,
    rightIcon = <Volume2 className="h-5 w-5" />,
    accentColor = "#a3e635",
    onChange,
    showValue = true,
    className = "",
}) => {
    const clamp = (v) => Math.min(max, Math.max(min, v));
    const [value, setValue] = useState(clamp(defaultValue));
    const [dragging, setDragging] = useState(false);
    const [hover, setHover] = useState(false);
    const track = useRef(null);
    const drag = useRef(false);
    // Latest value, readable synchronously from pointer handlers (state lags a render).
    const valueRef = useRef(clamp(defaultValue));

    const pct = useMotionValue(((clamp(defaultValue) - min) / (max - min)) * 100);
    const overflow = useMotionValue(0); // px past an end, negative = left
    const fillWidth = useTransform(pct, (p) => `${p}%`);
    const knobLeft = useTransform(pct, (p) => `${p}%`);
    const scaleX = useTransform(overflow, (o) => 1 + Math.abs(o) / (track.current?.offsetWidth || 240));
    const originX = useTransform(overflow, (o) => (o < 0 ? 1 : 0));
    const leftX = useTransform(overflow, (o) => (o < 0 ? o : 0));
    const rightX = useTransform(overflow, (o) => (o > 0 ? o : 0));

    const commit = (raw) => {
        const v = clamp(Math.round(raw / step) * step);
        if (v !== valueRef.current) {
            valueRef.current = v;
            setValue(v);
            onChange?.(v);
        }
        return v;
    };

    const fromPointer = (clientX) => {
        const r = track.current.getBoundingClientRect();
        const ratio = (clientX - r.left) / r.width;
        pct.set(Math.min(1, Math.max(0, ratio)) * 100);
        commit(min + Math.min(1, Math.max(0, ratio)) * (max - min));
        const past = clientX < r.left ? clientX - r.left : clientX > r.right ? clientX - r.right : 0;
        overflow.set(Math.sign(past) * decay(Math.abs(past), MAX_OVERFLOW));
    };

    const end = () => {
        if (!drag.current) return;
        drag.current = false;
        setDragging(false);
        animate(overflow, 0, { type: "spring", stiffness: 380, damping: 12 });
        // Snap the fill to the stepped value.
        animate(pct, ((valueRef.current - min) / (max - min)) * 100, { duration: 0.12 });
    };

    // Keep the fill in sync for keyboard changes.
    useEffect(() => {
        if (!drag.current) animate(pct, ((value - min) / (max - min)) * 100, { type: "spring", stiffness: 500, damping: 40 });
    }, [value, min, max, pct]);

    const nudge = (delta) => commit(valueRef.current + delta);
    const big = Math.max(step, (max - min) / 10);
    const thick = dragging || hover;

    return (
        <div className={`flex w-full max-w-sm flex-col items-center gap-3 ${className}`}>
            <div className="flex w-full touch-none select-none items-center gap-4">
                <motion.button type="button" aria-label="Decrease" onClick={() => nudge(-big)} style={{ x: leftX }} className="shrink-0 opacity-70 transition-opacity hover:opacity-100">
                    {leftIcon}
                </motion.button>

                <div
                    ref={track}
                    role="slider"
                    tabIndex={0}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    aria-label="Value"
                    className="relative flex h-10 flex-1 cursor-grab items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current/30 active:cursor-grabbing"
                    onPointerEnter={() => setHover(true)}
                    onPointerLeave={() => setHover(false)}
                    onPointerDown={(e) => {
                        if (e.button !== 0) return;
                        // No text selection / native drag: those fire pointercancel mid-drag.
                        e.preventDefault();
                        e.currentTarget.focus({ preventScroll: true });
                        e.currentTarget.setPointerCapture(e.pointerId);
                        // Stop any spring still settling from the last drag.
                        pct.stop();
                        overflow.stop();
                        drag.current = true;
                        setDragging(true);
                        fromPointer(e.clientX);
                    }}
                    onPointerMove={(e) => drag.current && fromPointer(e.clientX)}
                    onPointerUp={end}
                    onPointerCancel={end}
                    onLostPointerCapture={end}
                    onKeyDown={(e) => {
                        const map = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big };
                        if (e.key in map) nudge(map[e.key]);
                        else if (e.key === "Home") commit(min);
                        else if (e.key === "End") commit(max);
                        else return;
                        e.preventDefault();
                    }}
                >
                    <motion.div className="relative w-full rounded-full" style={{ scaleX, originX }} animate={{ height: thick ? 12 : 7 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
                        <div className="absolute inset-0 overflow-hidden rounded-full" style={{ background: "color-mix(in srgb, currentColor 16%, transparent)" }}>
                            <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ width: fillWidth, background: accentColor }} />
                        </div>
                        {/* Knob */}
                        <motion.span
                            className="absolute top-1/2 block rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
                            style={{ left: knobLeft, x: "-50%", y: "-50%" }}
                            animate={{ width: dragging ? 22 : thick ? 18 : 14, height: dragging ? 22 : thick ? 18 : 14 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                        {/* Value bubble while dragging */}
                        <motion.span
                            className="pointer-events-none absolute bottom-full mb-3 rounded-md px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold text-black"
                            style={{ left: knobLeft, x: "-50%", background: accentColor }}
                            initial={false}
                            animate={{ opacity: dragging ? 1 : 0, y: dragging ? 0 : 4 }}
                            transition={{ duration: 0.15 }}
                        >
                            {value}
                        </motion.span>
                    </motion.div>
                </div>

                <motion.button type="button" aria-label="Increase" onClick={() => nudge(big)} style={{ x: rightX }} className="shrink-0 opacity-70 transition-opacity hover:opacity-100">
                    {rightIcon}
                </motion.button>
            </div>
            {showValue && <p className="font-mono text-sm tabular-nums opacity-60">{value}</p>}
        </div>
    );
};

export default ElasticSlider;
