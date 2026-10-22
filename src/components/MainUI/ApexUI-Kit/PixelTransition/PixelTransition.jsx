import React, { useEffect, useMemo, useRef, useState } from "react";

/*
 * Pixel Transition: hover (or tap) the card and it dissolves into a grid of
 * pixels that pop in at random, the content swaps underneath, then the
 * pixels clear away to reveal the second side.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";

const DefaultFirst = () => <img src={`${IK}/black-panther.png?tr=f-auto,q-80,w-600`} alt="Black Panther" draggable="false" className="h-full w-full bg-neutral-900 object-cover" />;
const DefaultSecond = () => (
    <div className="grid h-full w-full place-items-center bg-neutral-950 p-6 text-center text-white">
        <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/50">Wakanda</p>
            <p className="mt-2 text-3xl font-black">Black Panther</p>
            <p className="mt-2 text-sm text-white/60">King T&apos;Challa, protector of his people.</p>
        </div>
    </div>
);

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const PixelTransition = ({ first = <DefaultFirst />, second = <DefaultSecond />, gridSize = 10, pixelColor = "#a3e635", duration = 0.45, aspectRatio = "4 / 5", width = 16, className = "" }) => {
    const [showSecond, setShowSecond] = useState(false);
    const pixels = useRef([]);
    const timers = useRef([]);
    const target = useRef(false);
    const cells = useMemo(() => Array.from({ length: gridSize * gridSize }, (_, i) => i), [gridSize]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const run = (toSecond) => {
        if (target.current === toSecond) return;
        target.current = toSecond;
        timers.current.forEach(clearTimeout);
        timers.current = [];
        const half = (duration * 1000) / 2;
        const order = shuffle(cells);
        const per = half / order.length;
        order.forEach((c, k) => timers.current.push(setTimeout(() => pixels.current[c] && (pixels.current[c].style.opacity = "1"), k * per)));
        timers.current.push(
            setTimeout(() => {
                setShowSecond(toSecond);
                shuffle(cells).forEach((c, k) => timers.current.push(setTimeout(() => pixels.current[c] && (pixels.current[c].style.opacity = "0"), k * per)));
            }, half + 30),
        );
    };

    return (
        <div
            className={`relative cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10 ${className}`}
            style={{ aspectRatio, width: `min(${width}rem, 80vw)` }}
            onPointerEnter={(e) => e.pointerType === "mouse" && run(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && run(false)}
            onClick={() => run(!target.current)}
        >
            <div className="absolute inset-0">{showSecond ? second : first}</div>
            <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }} aria-hidden="true">
                {cells.map((c) => (
                    <span key={c} ref={(el) => (pixels.current[c] = el)} style={{ background: pixelColor, opacity: 0 }} />
                ))}
            </div>
        </div>
    );
};

export default PixelTransition;
