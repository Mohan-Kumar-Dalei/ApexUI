import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * 3D Carousel: cards stand on a ring that turns in 3D. Drag (or swipe) to
 * spin it, let go and it settles on the nearest card. It turns slowly on its
 * own, and a click on a card or the arrows brings that card to the front.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (name) => `${IK}/${name}?tr=f-auto,q-80,w-480`;

const DEFAULT_ITEMS = [
    { image: img("ironman.png"), title: "Iron Man", subtitle: "Genius, billionaire" },
    { image: img("spiderman.png"), title: "Spider-Man", subtitle: "Friendly neighbour" },
    { image: img("captainamerica.png"), title: "Captain America", subtitle: "The first avenger" },
    { image: img("hulk.png"), title: "Hulk", subtitle: "Always angry" },
    { image: img("black-panther.png"), title: "Black Panther", subtitle: "King of Wakanda" },
    { image: img("doctorStrange.png"), title: "Doctor Strange", subtitle: "Sorcerer supreme" },
    { image: img("thanos.png"), title: "Thanos", subtitle: "Inevitable" },
];

const settle = { type: "spring", stiffness: 140, damping: 22, mass: 1 };
const mod = (n, m) => ((n % m) + m) % m;

function Card({ item, index, step, radius, rotation, onSelect }) {
    // Cards turned away from the viewer get darker.
    const brightness = useTransform(rotation, (r) => {
        const facing = Math.cos(((index * step + r) * Math.PI) / 180);
        return `brightness(${0.35 + 0.65 * Math.max(0, facing)})`;
    });

    return (
        <motion.button
            type="button"
            aria-label={item.title}
            onClick={() => onSelect(index)}
            className="absolute inset-0 overflow-hidden rounded-[1.1rem] bg-neutral-900 text-left text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] outline-none [backface-visibility:hidden] focus-visible:ring-2 focus-visible:ring-white/70"
            style={{ transform: `rotateY(${index * step}deg) translateZ(${radius}px)`, filter: brightness }}
        >
            <img src={item.image} alt="" draggable="false" className="pointer-events-none h-full w-full select-none object-cover" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3.5 pb-3 pt-10">
                <span className="block truncate text-[0.95rem] font-semibold">{item.title}</span>
                {item.subtitle && <span className="block truncate text-[0.75rem] text-white/65">{item.subtitle}</span>}
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-[1.1rem] ring-1 ring-inset ring-white/10" />
        </motion.button>
    );
}

const Carousel3D = ({
    items = DEFAULT_ITEMS,
    cardWidth = 11,
    aspectRatio = "3 / 4",
    gap = 1,
    tilt = -6,
    perspective = 1400,
    autoRotate = true,
    autoRotateSpeed = 10,
    pauseOnHover = true,
    showControls = true,
    onActiveChange,
    className = "",
}) => {
    const count = Math.max(items.length, 1);
    const step = 360 / count;
    const rotation = useMotionValue(0);
    const reduced = useReducedMotion();
    const cardRef = useRef(null);
    const drag = useRef(null);
    const dragged = useRef(false);
    const busy = useRef(false);
    const [radius, setRadius] = useState(300);
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(0);
    const onActiveRef = useRef(onActiveChange);
    onActiveRef.current = onActiveChange;

    // Ring radius that fits the cards side by side, from their real width.
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return undefined;
        const measure = () => {
            const w = el.offsetWidth;
            const gapPx = gap * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
            setRadius(Math.round(w / 2 / Math.tan(Math.PI / count) + gapPx));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [count, gap]);

    useMotionValueEvent(rotation, "change", (r) => {
        const next = mod(Math.round(-r / step), count);
        setActive((prev) => {
            if (prev !== next) onActiveRef.current?.(next, items[next]);
            return next;
        });
    });

    // Slow idle spin.
    useAnimationFrame((_, delta) => {
        if (!autoRotate || reduced || drag.current || busy.current || (pauseOnHover && hovered)) return;
        rotation.set(rotation.get() - (autoRotateSpeed * Math.min(delta, 64)) / 1000);
    });

    const spinTo = (target, velocity = 0) => {
        busy.current = true;
        animate(rotation, target, { ...settle, velocity, onComplete: () => (busy.current = false) });
    };

    const goTo = (index) => {
        const current = rotation.get();
        const diff = mod(-index * step - current + 180, 360) - 180;
        spinTo(current + diff);
    };

    const onPointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        rotation.stop();
        busy.current = false;
        drag.current = { x: e.clientX, start: rotation.get(), moved: false, id: e.pointerId };
    };
    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.moved && Math.abs(dx) > 5) {
            d.moved = true;
            e.currentTarget.setPointerCapture?.(d.id);
        }
        if (d.moved) rotation.set(d.start + dx * (180 / (Math.PI * radius)));
    };
    const onPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        dragged.current = Boolean(d?.moved);
        if (!d?.moved) return;
        setTimeout(() => (dragged.current = false), 0);
        const velocity = rotation.getVelocity();
        const projected = rotation.get() + velocity * 0.25;
        spinTo(Math.round(projected / step) * step, velocity);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") goTo(active + 1);
        if (e.key === "ArrowLeft") goTo(active - 1);
    };

    const current = items[active];
    const roundBtn = "grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition hover:scale-105 active:scale-95";
    const btnStyle = { borderColor: "color-mix(in srgb, currentColor 18%, transparent)", background: "color-mix(in srgb, currentColor 6%, transparent)" };

    return (
        <section
            aria-roledescription="carousel"
            aria-label="3D carousel"
            className={`flex w-full flex-col items-center ${className}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <div
                tabIndex={0}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClickCapture={(e) => {
                    // A drag should not count as a click on the card under the pointer.
                    if (dragged.current) e.stopPropagation();
                }}
                className="relative flex w-full cursor-grab touch-pan-y select-none items-center justify-center rounded-2xl py-8 outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-current/30"
                style={{ perspective: `${perspective}px` }}
            >
                {/* Push the ring back by its radius so the front card sits at its real size. */}
                <div style={{ transformStyle: "preserve-3d", transform: `translateZ(-${radius}px) rotateX(${tilt}deg)` }}>
                    <motion.div
                        ref={cardRef}
                        className="relative"
                        style={{ width: `min(${cardWidth}rem, 40vw)`, aspectRatio, transformStyle: "preserve-3d", rotateY: rotation }}
                    >
                        {items.map((item, i) => (
                            <Card key={i} item={item} index={i} step={step} radius={radius} rotation={rotation} onSelect={goTo} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {showControls && (
                <div className="mt-2 flex items-center gap-5">
                    <button type="button" aria-label="Previous" onClick={() => goTo(active - 1)} className={roundBtn} style={btnStyle}>
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="min-w-[9rem] text-center" aria-live="polite">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                            >
                                <p className="text-[0.95rem] font-semibold">{current?.title}</p>
                                <p className="text-[0.75rem] opacity-60">
                                    {active + 1} / {count}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <button type="button" aria-label="Next" onClick={() => goTo(active + 1)} className={roundBtn} style={btnStyle}>
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default Carousel3D;
