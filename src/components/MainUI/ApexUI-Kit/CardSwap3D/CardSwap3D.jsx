import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Sparkles, Zap } from "lucide-react";

/*
 * Card Swap 3D: cards stacked diagonally into the distance in 3D. On a
 * timer the front card drops away and slides to the back of the stack
 * while the rest step forward. Pauses while hovered; click to swap now.
 */

const DEFAULT_CARDS = [
    { icon: Sparkles, title: "Smooth", body: "Springs tuned to feel natural, never floaty." },
    { icon: Layers, title: "Composable", body: "Drop components in and style them with Tailwind." },
    { icon: Code2, title: "Yours", body: "Copy the source or add it with one CLI command." },
    { icon: Zap, title: "Fast", body: "Transforms and opacity only — 60fps on phones." },
];

const CardSwap3D = ({ cards = DEFAULT_CARDS, delay = 3200, distanceX = 3.6, distanceY = 3.2, skew = 5, pauseOnHover = true, accentColor = "#a3e635", theme = "dark", width = 18, className = "" }) => {
    // order[0] is the card in front.
    const [order, setOrder] = useState(() => cards.map((_, i) => i));
    const [dropping, setDropping] = useState(null);
    const [paused, setPaused] = useState(false);
    const dark = theme !== "light";

    const swap = () => {
        if (dropping !== null) return;
        setDropping(order[0]);
        setTimeout(() => {
            setOrder((o) => [...o.slice(1), o[0]]);
            setDropping(null);
        }, 520);
    };

    useEffect(() => {
        if (paused) return undefined;
        const id = setInterval(swap, delay);
        return () => clearInterval(id);
    });

    return (
        <div
            className={`relative [perspective:1000px] ${className}`}
            style={{ width: `min(${width}rem, 70vw)`, height: `${width * 0.68}rem`, marginTop: `${distanceY * (cards.length - 1)}rem`, marginRight: `${distanceX * (cards.length - 1)}rem` }}
            onPointerEnter={() => pauseOnHover && setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onClick={swap}
        >
            {cards.map((card, i) => {
                const slot = order.indexOf(i);
                const isDropping = dropping === i;
                const Icon = card.icon ?? Sparkles;
                return (
                    <motion.div
                        key={i}
                        className={`absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border p-6 [backface-visibility:hidden] ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"}`}
                        style={{ zIndex: isDropping ? 60 : cards.length - slot, transformStyle: "preserve-3d", boxShadow: "0 25px 50px -25px rgba(0,0,0,0.6)" }}
                        initial={false}
                        animate={
                            isDropping
                                ? { x: "0rem", y: "14rem", z: 0, skewY: skew, opacity: 0.0 }
                                : { x: `${slot * distanceX}rem`, y: `${-slot * distanceY}rem`, z: -slot * 60, skewY: skew, opacity: slot > 4 ? 0 : 1 }
                        }
                        transition={isDropping ? { duration: 0.5, ease: [0.55, 0, 0.8, 0.2] } : { type: "spring", stiffness: 140, damping: 20 }}
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="grid h-9 w-9 place-items-center rounded-xl text-black" style={{ background: accentColor }}>
                                <Icon className="h-4.5 w-4.5" />
                            </span>
                            <p className="text-lg font-semibold">{card.title}</p>
                        </div>
                        <p className={`mt-3 text-[0.92rem] leading-relaxed ${dark ? "text-white/60" : "text-neutral-500"}`}>{card.body}</p>
                        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-2xl" style={{ background: accentColor }} />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CardSwap3D;
