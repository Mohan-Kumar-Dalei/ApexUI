import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, RotateCcw, X } from "lucide-react";

/*
 * Swipe Cards: a deck you swipe left or right. The top card tilts with the
 * drag and shows a LIKE / NOPE stamp; let go past the threshold and it flies
 * off, or use the buttons and arrow keys. The deck refills when it runs out.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const DEFAULT_CARDS = [
    { image: `${IK}/spiderman.png?tr=f-auto,q-80,w-600`, title: "Spider-Man", subtitle: "Queens · 2.3 km away" },
    { image: `${IK}/hulk.png?tr=f-auto,q-80,w-600`, title: "Hulk", subtitle: "New York · 5 km away" },
    { image: `${IK}/black-panther.png?tr=f-auto,q-80,w-600`, title: "Black Panther", subtitle: "Wakanda · 8,412 km away" },
    { image: `${IK}/doctorStrange.png?tr=f-auto,q-80,w-600`, title: "Doctor Strange", subtitle: "Sanctum · 3 km away" },
    { image: `${IK}/captainamerica.png?tr=f-auto,q-80,w-600`, title: "Captain America", subtitle: "Brooklyn · 1 km away" },
];

function TopCard({ card, onSwipe, threshold, likeColor, nopeColor }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-240, 240], [-18, 18]);
    const likeOpacity = useTransform(x, [20, threshold], [0, 1]);
    const nopeOpacity = useTransform(x, [-threshold, -20], [1, 0]);

    return (
        <motion.div
            className="absolute inset-0 z-10 cursor-grab touch-none overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] active:cursor-grabbing"
            style={{ x, rotate }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.9}
            onDragEnd={(_, info) => {
                if (info.offset.x > threshold || info.velocity.x > 700) onSwipe("right");
                else if (info.offset.x < -threshold || info.velocity.x < -700) onSwipe("left");
            }}
            exit={(dir) => ({ x: dir === "right" ? 520 : -520, rotate: dir === "right" ? 26 : -26, opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } })}
        >
            <img src={card.image} alt="" draggable="false" className="pointer-events-none h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 pt-16 text-white">
                <p className="text-xl font-bold">{card.title}</p>
                {card.subtitle && <p className="text-sm text-white/70">{card.subtitle}</p>}
            </div>
            <motion.span className="pointer-events-none absolute left-5 top-6 -rotate-12 rounded-lg border-[3px] px-3 py-1 text-2xl font-black tracking-widest" style={{ opacity: likeOpacity, color: likeColor, borderColor: likeColor }}>
                LIKE
            </motion.span>
            <motion.span className="pointer-events-none absolute right-5 top-6 rotate-12 rounded-lg border-[3px] px-3 py-1 text-2xl font-black tracking-widest" style={{ opacity: nopeOpacity, color: nopeColor, borderColor: nopeColor }}>
                NOPE
            </motion.span>
        </motion.div>
    );
}

const SwipeCards = ({ cards = DEFAULT_CARDS, threshold = 110, likeColor = "#a3e635", nopeColor = "#f43f5e", onSwipe, className = "" }) => {
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState("right");
    const [history, setHistory] = useState([]);
    const visible = [0, 1, 2].map((o) => cards[(index + o) % cards.length]);

    const swipe = (direction) => {
        const card = cards[index % cards.length];
        setDir(direction);
        setHistory((h) => [...h, { card, direction }]);
        onSwipe?.(card, direction);
        setIndex((i) => i + 1);
    };
    const undo = () => {
        if (!history.length) return;
        setDir("left");
        setHistory((h) => h.slice(0, -1));
        setIndex((i) => Math.max(0, i - 1));
    };

    return (
        <div
            className={`flex flex-col items-center outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") swipe("right");
                if (e.key === "ArrowLeft") swipe("left");
            }}
            aria-label="Card deck: use the arrow keys or the buttons to swipe"
        >
            <div className="relative aspect-[3/4] w-[min(18rem,78vw)]">
                {/* Cards waiting underneath, slightly smaller and lower. */}
                {visible
                    .slice(1)
                    .reverse()
                    .map((card, i, arr) => {
                        const depth = arr.length - i;
                        return (
                            <motion.div
                                key={`${index + depth}-${card.title}`}
                                className="absolute inset-0 overflow-hidden rounded-3xl bg-neutral-900"
                                initial={false}
                                animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: 1 - depth * 0.25 }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            >
                                <img src={card.image} alt="" draggable="false" className="h-full w-full object-cover" />
                            </motion.div>
                        );
                    })}
                <AnimatePresence custom={dir} initial={false}>
                    <TopCard key={`${index}-${visible[0].title}`} card={visible[0]} onSwipe={swipe} threshold={threshold} likeColor={likeColor} nopeColor={nopeColor} />
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <motion.button whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }} type="button" aria-label="Nope" onClick={() => swipe("left")} className="grid h-14 w-14 place-items-center rounded-full border-2 bg-black/5 shadow-lg" style={{ borderColor: nopeColor, color: nopeColor }}>
                    <X className="h-6 w-6" strokeWidth={3} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }} type="button" aria-label="Undo" onClick={undo} disabled={!history.length} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 opacity-70 disabled:opacity-30">
                    <RotateCcw className="h-4 w-4" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }} type="button" aria-label="Like" onClick={() => swipe("right")} className="grid h-14 w-14 place-items-center rounded-full border-2 bg-black/5 shadow-lg" style={{ borderColor: likeColor, color: likeColor }}>
                    <Heart className="h-6 w-6" fill="currentColor" />
                </motion.button>
            </div>
        </div>
    );
};

export default SwipeCards;
