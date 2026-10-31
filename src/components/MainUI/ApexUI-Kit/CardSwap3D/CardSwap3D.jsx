import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Sparkles, Zap } from "lucide-react";

/*
 * Card Swap 3D: cards stacked in real 3D, turned toward the viewer and
 * receding into the distance. On a timer the front card drops away and
 * returns to the back while the rest step forward. Pauses while hovered;
 * click to swap now. The whole stack scales down to fit narrow containers.
 */

const DEFAULT_CARDS = [
    { icon: Sparkles, title: "Smooth", body: "Springs tuned to feel natural, never floaty." },
    { icon: Layers, title: "Composable", body: "Drop components in and style them with Tailwind." },
    { icon: Code2, title: "Yours", body: "Copy the source or add it with one CLI command." },
    { icon: Zap, title: "Fast", body: "Transforms and opacity only, 60fps on phones." },
];

const CardSwap3D = ({ cards = DEFAULT_CARDS, delay = 3200, distanceX = 3.6, distanceY = 3.2, depth = 70, tilt = 18, skew = 0, pauseOnHover = true, accentColor = "#a3e635", theme = "dark", width = 18, className = "" }) => {
    // order[0] is the card in front.
    const [order, setOrder] = useState(() => cards.map((_, i) => i));
    const [dropping, setDropping] = useState(null);
    const [paused, setPaused] = useState(false);
    const [fit, setFit] = useState(1);
    const outer = useRef(null);
    const dark = theme !== "light";
    const n = cards.length;
    // Footprint of the whole stack in rem (card plus the steps behind it).
    // (+5: the 3D turn makes the cards project a little wider than they are.)
    const footW = width + distanceX * (n - 1) + 5;
    const footH = width * 0.68 + distanceY * (n - 1) + 2;

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

    // Scale the stack down when its container is narrower than its footprint.
    useLayoutEffect(() => {
        const el = outer.current?.parentElement;
        if (!el) return undefined;
        const ro = new ResizeObserver(() => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            setFit(Math.min(1, el.clientWidth / (footW * rem)));
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [footW]);

    return (
        <div ref={outer} className={`relative mx-auto ${className}`} style={{ width: `${footW * fit}rem`, height: `${footH * fit}rem` }}>
            <div
                className="absolute left-0 top-0 origin-top-left [perspective:1200px]"
                style={{ width: `${footW}rem`, height: `${footH}rem`, transform: `scale(${fit})` }}
                onPointerEnter={() => pauseOnHover && setPaused(true)}
                onPointerLeave={() => setPaused(false)}
                onClick={swap}
            >
                <div className="absolute [transform-style:preserve-3d]" style={{ left: "2.5rem", bottom: "1rem", width: `${width}rem`, height: `${width * 0.68}rem`, transform: `rotateY(${-tilt}deg) rotateX(${tilt * 0.35}deg)` }}>
                    {cards.map((card, i) => {
                        const slot = order.indexOf(i);
                        const isDropping = dropping === i;
                        const Icon = card.icon ?? Sparkles;
                        return (
                            <motion.div
                                key={i}
                                className={`absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border p-6 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"}`}
                                style={{ zIndex: isDropping ? 60 : n - slot, boxShadow: "0 30px 60px -28px rgba(0,0,0,0.65)" }}
                                initial={false}
                                animate={
                                    isDropping
                                        ? { x: "-2rem", y: "16rem", z: 120, rotateZ: -8, skewY: skew, opacity: 0 }
                                        : { x: `${slot * distanceX}rem`, y: `${-slot * distanceY}rem`, z: -slot * depth, rotateZ: 0, skewY: skew, opacity: slot > 4 ? 0 : 1 - slot * 0.12 }
                                }
                                transition={isDropping ? { duration: 0.5, ease: [0.55, 0, 0.8, 0.2] } : { type: "spring", stiffness: 150, damping: 21 }}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="grid h-9 w-9 place-items-center rounded-xl text-black" style={{ background: accentColor }}>
                                        <Icon className="h-[18px] w-[18px]" />
                                    </span>
                                    <p className="text-lg font-semibold">{card.title}</p>
                                </div>
                                <p className={`mt-3 text-[0.92rem] leading-relaxed ${dark ? "text-white/60" : "text-neutral-500"}`}>{card.body}</p>
                                <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-2xl" style={{ background: accentColor }} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CardSwap3D;
