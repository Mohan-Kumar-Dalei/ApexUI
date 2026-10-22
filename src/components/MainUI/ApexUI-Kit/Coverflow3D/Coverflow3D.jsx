import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Coverflow 3D: the classic album-flip view. The centre cover faces you,
 * the rest stand angled on either side and slide back in depth, each with a
 * soft reflection. Drag / swipe, click a cover, or use the arrow keys.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n) => `${IK}/${n}.png?tr=f-auto,q-80,w-500`;
const DEFAULT_ITEMS = [
    { image: img("spiderman"), title: "Spider-Man" },
    { image: img("black-panther"), title: "Black Panther" },
    { image: img("hulk"), title: "Hulk" },
    { image: img("captainamerica"), title: "Captain America" },
    { image: img("doctorStrange"), title: "Doctor Strange" },
    { image: img("thanos"), title: "Thanos" },
    { image: img("ironman"), title: "Iron Man" },
];

const Coverflow3D = ({ items = DEFAULT_ITEMS, initialIndex = 2, size = 12, angle = 55, gap = 0.42, reflection = true, accentColor = "#a3e635", className = "" }) => {
    const [index, setIndex] = useState(initialIndex);
    const drag = useRef(null);
    const clamp = (i) => Math.max(0, Math.min(items.length - 1, i));
    const go = (i) => setIndex(clamp(i));

    return (
        <div
            className={`flex w-full flex-col items-center gap-6 outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(index + 1);
                if (e.key === "ArrowLeft") go(index - 1);
            }}
            aria-roledescription="carousel"
            aria-label="Coverflow"
        >
            <div
                className="relative w-full touch-pan-y select-none overflow-hidden [perspective:1100px]"
                style={{ height: `${size * (reflection ? 1.55 : 1.15)}rem` }}
                onPointerDown={(e) => (drag.current = { x: e.clientX, start: index, moved: false })}
                onPointerMove={(e) => {
                    const d = drag.current;
                    if (!d) return;
                    const steps = Math.round((d.x - e.clientX) / 70);
                    if (steps !== 0) d.moved = true;
                    go(d.start + steps);
                }}
                onPointerUp={() => setTimeout(() => (drag.current = null))}
                onPointerLeave={() => (drag.current = null)}
            >
                {items.map((item, i) => {
                    const off = i - index;
                    const abs = Math.abs(off);
                    const side = Math.sign(off);
                    return (
                        <motion.button
                            key={i}
                            type="button"
                            aria-label={item.title}
                            aria-current={off === 0}
                            onClick={() => !drag.current?.moved && go(i)}
                            className="absolute left-1/2 top-[6%] [transform-style:preserve-3d]"
                            style={{ width: `${size}rem`, height: `${size}rem`, marginLeft: `-${size / 2}rem`, zIndex: 100 - abs }}
                            initial={false}
                            animate={{
                                x: off === 0 ? "0%" : `${side * (55 + (abs - 1) * gap * 100)}%`,
                                z: off === 0 ? 60 : -120 - abs * 20,
                                rotateY: off === 0 ? 0 : -side * angle,
                                opacity: abs > 4 ? 0 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 220, damping: 30 }}
                        >
                            <span className="relative block h-full w-full overflow-hidden rounded-xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                                <img src={item.image} alt="" draggable="false" className="h-full w-full bg-neutral-900 object-cover" />
                                <motion.span className="absolute inset-0 bg-black" initial={false} animate={{ opacity: off === 0 ? 0 : Math.min(0.55, 0.25 + abs * 0.1) }} />
                            </span>
                            {reflection && (
                                <span aria-hidden="true" className="pointer-events-none absolute left-0 top-full mt-1 block h-1/2 w-full overflow-hidden rounded-xl opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]">
                                    <img src={item.image} alt="" draggable="false" className="h-[200%] w-full -scale-y-100 object-cover" />
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <button type="button" aria-label="Previous" onClick={() => go(index - 1)} disabled={index === 0} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="min-w-[9rem] text-center text-sm font-semibold">
                    {items[index].title}
                    <span className="mt-0.5 block font-mono text-[0.7rem] font-normal opacity-50">
                        {index + 1} / {items.length}
                    </span>
                </p>
                <button type="button" aria-label="Next" onClick={() => go(index + 1)} disabled={index === items.length - 1} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30" style={{ color: index === items.length - 1 ? undefined : accentColor }}>
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Coverflow3D;
