import React, { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Volume1, Volume2 } from "lucide-react";

/*
 * Elastic Slider: drag past either end and the track stretches like rubber
 * (and the end icon gets pulled along), then springs back when you let go.
 * The track also thickens while you hold it. Arrow keys work too.
 */

const MAX_OVERFLOW = 60;
// Diminishing stretch: the further you pull, the less it gives.
const decay = (v, max) => {
    if (max === 0) return 0;
    const entry = v / max;
    const sig = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sig * max;
};

const ElasticSlider = ({ defaultValue = 50, min = 0, max = 100, step = 1, leftIcon = <Volume1 className="h-5 w-5" />, rightIcon = <Volume2 className="h-5 w-5" />, accentColor = "#a3e635", onChange, showValue = true, className = "" }) => {
    const [value, setValue] = useState(defaultValue);
    const [active, setActive] = useState(false);
    const track = useRef(null);
    const overflow = useMotionValue(0);
    const region = useRef("middle");
    const scale = useMotionValue(1);

    const scaleX = useTransform(() => {
        const w = track.current?.offsetWidth ?? 1;
        return 1 + overflow.get() / w;
    });
    const originX = useTransform(() => (region.current === "left" ? "100%" : "0%"));
    const leftX = useTransform(() => (region.current === "left" ? -overflow.get() / scale.get() : 0));
    const rightX = useTransform(() => (region.current === "right" ? overflow.get() / scale.get() : 0));
    const height = useTransform(scale, [1, 1.2], [6, 12]);

    const set = (v) => {
        const clamped = Math.min(max, Math.max(min, Math.round(v / step) * step));
        setValue(clamped);
        onChange?.(clamped);
    };
    const onMove = (e) => {
        if (e.buttons <= 0 && e.pointerType === "mouse") return;
        const r = track.current.getBoundingClientRect();
        const raw = min + ((e.clientX - r.left) / r.width) * (max - min);
        set(raw);
        const past = e.clientX < r.left ? r.left - e.clientX : e.clientX > r.right ? e.clientX - r.right : 0;
        region.current = e.clientX < r.left ? "left" : e.clientX > r.right ? "right" : "middle";
        overflow.jump(decay(past, MAX_OVERFLOW));
    };
    const release = () => {
        setActive(false);
        animate(overflow, 0, { type: "spring", bounce: 0.5 });
        animate(scale, 1, { duration: 0.25 });
    };
    const pct = ((value - min) / (max - min)) * 100;

    return (
        <div className={`flex w-full max-w-sm flex-col items-center gap-4 ${className}`}>
            <motion.div className="flex w-full touch-none select-none items-center gap-4" onHoverStart={() => animate(scale, 1.2)} onHoverEnd={() => !active && animate(scale, 1)} onTouchStart={() => animate(scale, 1.2)} onTouchEnd={() => animate(scale, 1)}>
                <motion.span style={{ x: leftX, scale }} className="opacity-70" animate={{ scale: value === min && active ? [1, 1.3, 1] : 1 }}>
                    {leftIcon}
                </motion.span>
                <div
                    ref={track}
                    role="slider"
                    tabIndex={0}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    aria-label="Value"
                    className="relative flex h-8 flex-1 cursor-grab items-center outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-current/30 rounded-full"
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setActive(true);
                        onMove(e);
                    }}
                    onPointerMove={(e) => active && onMove(e)}
                    onPointerUp={release}
                    onPointerCancel={release}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowUp") set(value + step);
                        if (e.key === "ArrowLeft" || e.key === "ArrowDown") set(value - step);
                    }}
                >
                    <motion.div className="relative w-full overflow-hidden rounded-full" style={{ scaleX, originX, height, background: "color-mix(in srgb, currentColor 18%, transparent)" }}>
                        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: accentColor }} />
                    </motion.div>
                </div>
                <motion.span style={{ x: rightX, scale }} className="opacity-70">
                    {rightIcon}
                </motion.span>
            </motion.div>
            {showValue && <p className="font-mono text-sm tabular-nums opacity-60">{Math.round(value)}</p>}
        </div>
    );
};

export default ElasticSlider;
