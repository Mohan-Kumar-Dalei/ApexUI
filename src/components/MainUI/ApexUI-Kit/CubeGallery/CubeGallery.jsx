import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Cube Gallery: four images on the sides of a 3D cube. Drag to spin it
 * freely; let go and it snaps to the nearest face. Arrows and the arrow keys
 * turn it a quarter at a time, and it can turn on its own.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const DEFAULT_FACES = [
    { image: `${IK}/spiderman.png?tr=f-auto,q-80,w-600`, title: "Spider-Man" },
    { image: `${IK}/black-panther.png?tr=f-auto,q-80,w-600`, title: "Black Panther" },
    { image: `${IK}/hulk.png?tr=f-auto,q-80,w-600`, title: "Hulk" },
    { image: `${IK}/thanos.png?tr=f-auto,q-80,w-600`, title: "Thanos" },
];

const CubeGallery = ({ faces = DEFAULT_FACES, size = 15, autoRotate = true, interval = 3000, tilt = -12, accentColor = "#a3e635", className = "" }) => {
    const reduced = useReducedMotion();
    const rotY = useMotionValue(0);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const drag = useRef(null);
    const sides = faces.slice(0, 4);
    const half = `${size / 2}rem`;

    const goTo = (target) => {
        animate(rotY, target * -90, { type: "spring", stiffness: 120, damping: 18 });
        setIndex(((target % 4) + 4) % 4);
    };
    const step = (dir) => goTo(Math.round(rotY.get() / -90) + dir);
    // Quarter turns from the current face to face i, the short way round.
    const shortest = (i) => {
        const d = (i - index + 4) % 4;
        return d === 3 ? -1 : d;
    };

    useEffect(() => {
        if (!autoRotate || paused || reduced) return undefined;
        const id = setInterval(() => step(1), interval);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRotate, paused, interval, reduced]);

    return (
        <div
            className={`flex flex-col items-center gap-8 outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") step(1);
                if (e.key === "ArrowLeft") step(-1);
            }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Cube gallery"
        >
            <div className="[perspective:1200px]" style={{ width: `${size}rem`, height: `${size}rem`, maxWidth: "72vw", maxHeight: "72vw" }}>
                <motion.div
                    className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing [transform-style:preserve-3d]"
                    style={{ rotateY: rotY, rotateX: tilt }}
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        rotY.stop();
                        drag.current = { x: e.clientX, start: rotY.get() };
                    }}
                    onPointerMove={(e) => drag.current && rotY.set(drag.current.start + (e.clientX - drag.current.x) * 0.45)}
                    onPointerUp={() => {
                        if (!drag.current) return;
                        drag.current = null;
                        goTo(Math.round(rotY.get() / -90));
                    }}
                >
                    {sides.map((f, i) => (
                        <figure
                            key={i}
                            className="absolute inset-0 m-0 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 [backface-visibility:hidden]"
                            style={{ transform: `rotateY(${i * 90}deg) translateZ(${half})` }}
                        >
                            <img src={f.image} alt={f.title} draggable="false" className="h-full w-full object-cover" />
                            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-sm font-semibold text-white">{f.title}</figcaption>
                        </figure>
                    ))}
                    {/* Top and bottom caps so the cube reads as solid. */}
                    <div className="absolute inset-0 rounded-2xl bg-neutral-800" style={{ transform: `rotateX(90deg) translateZ(${half})` }} />
                    <div className="absolute inset-0 rounded-2xl bg-neutral-950" style={{ transform: `rotateX(-90deg) translateZ(${half})`, boxShadow: "0 0 80px rgba(0,0,0,0.6)" }} />
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                <button type="button" aria-label="Previous face" onClick={() => step(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1.5">
                    {sides.map((_, i) => (
                        <button key={i} type="button" aria-label={`Show face ${i + 1}`} onClick={() => step(shortest(i))} className="h-2 rounded-full transition-all duration-300" style={{ width: i === index ? 22 : 8, background: i === index ? accentColor : "color-mix(in srgb, currentColor 25%, transparent)" }} />
                    ))}
                </div>
                <button type="button" aria-label="Next face" onClick={() => step(1)} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default CubeGallery;
