import React, { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/*
 * Image Compare: a before / after slider. Drag the handle (or click anywhere,
 * or use the arrow keys) to wipe between the two images. Give one `image` and
 * the "before" side is drawn with a CSS filter, or pass both `before` and `after`.
 */

const ImageCompare = ({
    before,
    after,
    image = "https://ik.imagekit.io/ny6yinyut/apexui/assets/thanos.png?tr=f-auto,q-80,w-1200",
    beforeFilter = "grayscale(1) contrast(1.05) brightness(0.9)",
    beforeLabel = "Before",
    afterLabel = "After",
    defaultPosition = 50,
    vertical = false,
    accentColor = "#a3e635",
    aspectRatio = "16 / 10",
    className = "",
}) => {
    const ref = useRef(null);
    const [pos, setPos] = useState(defaultPosition);
    const [held, setHeld] = useState(false);
    const beforeSrc = before ?? image;
    const afterSrc = after ?? image;

    const fromPointer = (e) => {
        const r = ref.current.getBoundingClientRect();
        const p = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
        setPos(Math.min(100, Math.max(0, p * 100)));
    };
    const onKeyDown = (e) => {
        const step = e.shiftKey ? 10 : 2;
        const delta = { ArrowLeft: -step, ArrowDown: vertical ? step : -step, ArrowRight: step, ArrowUp: vertical ? -step : step }[e.key];
        if (delta === undefined) return;
        e.preventDefault();
        setPos((p) => Math.min(100, Math.max(0, p + delta)));
    };

    const clip = vertical ? `inset(0 0 ${100 - pos}% 0)` : `inset(0 ${100 - pos}% 0 0)`;

    return (
        <div
            ref={ref}
            onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setHeld(true);
                fromPointer(e);
            }}
            onPointerMove={(e) => held && fromPointer(e)}
            onPointerUp={() => setHeld(false)}
            onPointerCancel={() => setHeld(false)}
            className={`group relative w-full select-none overflow-hidden rounded-2xl bg-neutral-900 ${vertical ? "cursor-row-resize touch-none" : "cursor-col-resize touch-pan-y"} ${className}`}
            style={{ aspectRatio }}
        >
            <img src={afterSrc} alt={afterLabel} draggable="false" className="absolute inset-0 h-full w-full object-cover" />
            <img
                src={beforeSrc}
                alt={beforeLabel}
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: clip, filter: before ? undefined : beforeFilter, transition: held ? "none" : "clip-path 200ms ease-out" }}
            />

            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white backdrop-blur">{beforeLabel}</span>
            <span className={`pointer-events-none absolute rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white backdrop-blur ${vertical ? "bottom-3 left-3" : "right-3 top-3"}`}>{afterLabel}</span>

            {/* Divider and handle */}
            <div
                className="pointer-events-none absolute"
                style={vertical ? { left: 0, right: 0, top: `${pos}%`, height: 2, marginTop: -1, background: accentColor, transition: held ? "none" : "top 200ms ease-out" } : { top: 0, bottom: 0, left: `${pos}%`, width: 2, marginLeft: -1, background: accentColor, transition: held ? "none" : "left 200ms ease-out" }}
            >
                <button
                    type="button"
                    role="slider"
                    aria-label="Comparison position"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pos)}
                    aria-orientation={vertical ? "vertical" : "horizontal"}
                    onKeyDown={onKeyDown}
                    className={`pointer-events-auto absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-black shadow-[0_6px_20px_-4px_rgba(0,0,0,0.6)] outline-none transition-transform duration-200 focus-visible:ring-4 focus-visible:ring-white/50 ${held ? "scale-110" : "group-hover:scale-105"}`}
                    style={{ background: accentColor }}
                >
                    <ChevronsLeftRight className={`h-5 w-5 ${vertical ? "rotate-90" : ""}`} />
                </button>
            </div>
        </div>
    );
};

export default ImageCompare;
