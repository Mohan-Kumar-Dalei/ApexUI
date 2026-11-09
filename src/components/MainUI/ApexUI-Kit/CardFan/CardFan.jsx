import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Plus } from "lucide-react";

/*
 * Card Fan: a hand of tall product cards in their own colours, fanned out on a curve.
 *  - fan: how many degrees each card turns away from the middle
 *  - spread: how far apart the cards sit (1 = edge to edge, lower overlaps them)
 *  - tilt: how far a card leans toward the mouse when you hover it
 * Each card lifts on hover, presses in on click, and has a heart and a plus. The fan
 * shrinks to fit (overlapping more in tight spaces); on phones it becomes a swipe row.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n, w = 460) => `${IK}/${n}.png?tr=f-auto,q-80,w-${w}`;
const DEFAULT_ITEMS = [
    { title: "Iron Man", image: img("ironman"), price: "₹2,499", color: "#A3141E" },
    { title: "Captain America", image: img("captainamerica"), price: "₹2,299", color: "#24317A" },
    { title: "Spider-Man", image: img("spiderman"), price: "₹1,999", color: "#C62828" },
    { title: "Hulk", image: img("hulk"), price: "₹2,799", color: "#3E7B27" },
    { title: "Doctor Strange", image: img("doctorStrange"), price: "₹2,399", color: "#E3A21A" },
    { title: "Black Panther", image: img("black-panther"), price: "₹2,199", color: "#2B2233" },
    { title: "Thanos", image: img("thanos"), price: "₹3,199", color: "#5B2A86" },
];

// light or dark text for a card colour
const isDark = (hex = "#000000") => {
    const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
    return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) < 150;
};

function Card({ item, index, offset, fanned, width, spread, tilt, onAdd, liked, onLike, likeLabel }) {
    const [rot, setRot] = useState({ x: 0, y: 0 });
    const [hover, setHover] = useState(false);
    const [done, setDone] = useState(false);
    const timer = useRef(0);
    useEffect(() => () => clearTimeout(timer.current), []);
    const ink = item.textColor ?? (isDark(item.color) ? "#F8F1E7" : "#1C1714");
    // buttons and gaps scale with the card so small cards stay readable
    const heart = Math.max(2, width * 0.15);
    const plus = Math.max(2.3, width * 0.18);

    return (
        <div
            className="relative shrink-0 snap-center [perspective:40rem]"
            style={fanned ? { transform: `rotate(${offset.r}deg) translateY(${offset.y}rem)`, margin: `0 ${(width * (spread - 1)) / 2}rem`, zIndex: hover ? 30 : undefined } : undefined}
        >
            <motion.div
                onPointerMove={(e) => {
                    if (e.pointerType !== "mouse") return;
                    const r = e.currentTarget.getBoundingClientRect();
                    // -1 at one edge, 1 at the other: the card leans the full tilt at its edges
                    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
                    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
                    setRot({ x: -py * tilt, y: px * tilt });
                }}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => (setRot({ x: 0, y: 0 }), setHover(false))}
                whileHover={fanned ? { y: "-1rem" } : undefined}
                whileTap={{ scale: 0.97 }}
                animate={{ rotateX: rot.x, rotateY: rot.y }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative overflow-hidden rounded-[1.4rem] shadow-[0_1.9rem_3.75rem_-1.9rem_rgba(28,23,20,0.55)]"
                style={{ width: `${width}rem`, height: `${width * 1.6}rem`, background: item.color, color: ink, padding: `${width * 0.06}rem` }}
            >
                <div className="pointer-events-none absolute rounded-[1rem] border border-dashed opacity-40" style={{ inset: `${width * 0.037}rem`, borderColor: "currentColor" }} />
                <h3 className="relative leading-[0.9]" style={{ fontSize: `${width * 0.15}rem`, paddingTop: `${width * 0.03}rem`, paddingRight: `${heart + 0.4}rem` }}>
                    {item.title}
                </h3>
                <div className="absolute overflow-hidden rounded-t-[999px]" style={{ left: `${width * 0.09}rem`, right: `${width * 0.09}rem`, top: `${width * 0.44}rem`, bottom: `${width * 0.24}rem` }}>
                    <img src={item.image} alt={item.alt ?? item.title ?? ""} loading="lazy" draggable={false} className="h-full w-full object-cover" />
                </div>
                {onLike && (
                    <button
                        type="button"
                        aria-label={liked ? `Remove ${item.title} from ${likeLabel}` : `Save ${item.title} to ${likeLabel}`}
                        aria-pressed={liked}
                        onClick={() => onLike(item, index)}
                        className="absolute z-10 grid place-items-center rounded-full"
                        style={{ background: "#F5EFE6", color: "#1C1714", width: `${heart}rem`, height: `${heart}rem`, top: `${width * 0.055}rem`, right: `${width * 0.055}rem` }}
                    >
                        <Heart className="h-[45%] w-[45%]" style={liked ? { fill: "#C0392B", color: "#C0392B" } : undefined} />
                    </button>
                )}
                {item.price && (
                    <p className="absolute font-medium tabular-nums" style={{ left: `${width * 0.075}rem`, bottom: `${width * 0.075}rem`, fontSize: `${Math.max(0.8, width * 0.058)}rem` }}>
                        {item.price}
                    </p>
                )}
                {onAdd && (
                    <button
                        type="button"
                        aria-label={`Add ${item.title} to bag`}
                        onClick={() => {
                            onAdd(item, index);
                            setDone(true);
                            clearTimeout(timer.current);
                            timer.current = setTimeout(() => setDone(false), 1400);
                        }}
                        className="absolute grid place-items-center rounded-full bg-[#1C1714] text-[#F5EFE6] ring-4 ring-white/70 transition-transform active:scale-90"
                        style={{ width: `${plus}rem`, height: `${plus}rem`, bottom: `${width * 0.045}rem`, right: `${width * 0.045}rem` }}
                    >
                        {done ? <Check className="h-[42%] w-[42%]" /> : <Plus className="h-[42%] w-[42%]" />}
                    </button>
                )}
            </motion.div>
        </div>
    );
}

const CardFan = ({
    items = DEFAULT_ITEMS,
    cardWidth = 16.9,
    minCardWidth = 8.5,
    fan = 5,
    spread = 0.88,
    curve = 0.44,
    tilt = 16,
    onAdd,
    onLike,
    liked = [],
    likeLabel = "your list",
    className = "",
}) => {
    const root = useRef(null);
    const [width, setWidth] = useState(cardWidth);
    const [fanned, setFanned] = useState(true);
    const [gap, setGap] = useState(spread);
    const mid = (items.length - 1) / 2;

    // Fit the fan to the container: shrink the cards first, then overlap them more,
    // and only when that is not enough (phones) turn it into a swipe row.
    useEffect(() => {
        const el = root.current;
        if (!el) return undefined;
        const n = Math.max(1, items.length);
        const fit = () => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const avail = el.clientWidth / rem - 2;
            // a fan of n cards is (n - 1) * spread + 1 cards wide, plus room for the outer ones to turn
            const span = (s) => (n - 1) * s + 1.4;
            let w = Math.min(cardWidth, avail / span(spread));
            let s = spread;
            if (w < minCardWidth && n > 1) {
                s = Math.max(0.55, (avail / minCardWidth - 1.4) / (n - 1));
                w = Math.min(cardWidth, avail / span(s));
            }
            const ok = w >= minCardWidth;
            setFanned(ok);
            setGap(s);
            setWidth(ok ? w : Math.min(cardWidth, 13));
        };
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        fit();
        return () => ro.disconnect();
    }, [cardWidth, minCardWidth, spread, items.length]);

    return (
        <div ref={root} className={`w-full ${className}`}>
            <div
                className={fanned ? "flex justify-center pb-[4rem] pt-[1.5rem]" : "flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-10 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
                data-lenis-prevent-touch
            >
                {items.map((item, i) => {
                    const o = i - mid;
                    return (
                        <Card
                            key={item.id ?? item.title ?? i}
                            item={item}
                            index={i}
                            offset={{ r: o * fan, y: o * o * curve * (width / cardWidth) }}
                            fanned={fanned}
                            width={width}
                            spread={gap}
                            tilt={tilt}
                            onAdd={onAdd}
                            onLike={onLike}
                            liked={liked.includes(item.id ?? item.title)}
                            likeLabel={likeLabel}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CardFan;
