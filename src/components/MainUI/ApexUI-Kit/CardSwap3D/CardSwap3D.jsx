import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Code2, Layers, Sparkles, Zap } from "lucide-react";

/*
 * Card Swap 3D: thick cards stacked in real 3D, turned toward the viewer and
 * receding into the distance (cards further back sit deeper and darker). On a
 * timer the front card tips forward, falls away and comes back at the end of
 * the stack while the rest step forward. The whole stack leans toward the
 * pointer. Pauses while hovered; click to swap now. Scales down to fit
 * narrow containers.
 */

const DEFAULT_CARDS = [
    { icon: Sparkles, title: "Smooth", body: "Springs tuned to feel natural, never floaty." },
    { icon: Layers, title: "Composable", body: "Drop components in and style them with Tailwind." },
    { icon: Code2, title: "Yours", body: "Copy the source or add it with one CLI command." },
    { icon: Zap, title: "Fast", body: "Transforms and opacity only, 60fps on phones." },
];

const EDGE = 10; // card thickness in px

const CardSwap3D = ({ cards = DEFAULT_CARDS, delay = 3200, distanceX = 3.8, distanceY = 3.4, depth = 110, tilt = 22, skew = 0, pauseOnHover = true, accentColor = "#a3e635", theme = "dark", width = 18, className = "" }) => {
    // order[0] is the card in front.
    const [order, setOrder] = useState(() => cards.map((_, i) => i));
    const [dropping, setDropping] = useState(null);
    const [paused, setPaused] = useState(false);
    const [fit, setFit] = useState(1);
    const outer = useRef(null);
    const dark = theme !== "light";
    const n = cards.length;
    // Footprint of the whole stack in rem (card plus the steps behind it).
    // (+12: perspective makes the turned stack project wider than its flat size.)
    const footW = width + distanceX * (n - 1) + 12;
    const footH = width * 0.68 + distanceY * (n - 1) + 4;

    // Lean toward the pointer.
    const leanX = useMotionValue(0);
    const leanY = useMotionValue(0);
    const rotY = useSpring(leanX, { stiffness: 120, damping: 18 });
    const rotX = useSpring(leanY, { stiffness: 120, damping: 18 });

    const swap = () => {
        if (dropping !== null) return;
        setDropping(order[0]);
        setTimeout(() => {
            setOrder((o) => [...o.slice(1), o[0]]);
            setDropping(null);
        }, 560);
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

    const onMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        leanX.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        leanY.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const onLeave = () => {
        leanX.set(0);
        leanY.set(0);
        setPaused(false);
    };

    const face = dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900";
    const edge = dark ? "linear-gradient(#3f3f46, #232327)" : "linear-gradient(#d4d4d8, #a1a1aa)";

    return (
        <div ref={outer} className={`relative mx-auto ${className}`} style={{ width: `${footW * fit}rem`, height: `${footH * fit}rem` }}>
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{ width: `${footW}rem`, height: `${footH}rem`, transform: `scale(${fit})`, perspective: "900px", perspectiveOrigin: "35% 35%" }}
                onPointerEnter={() => pauseOnHover && setPaused(true)}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                onClick={swap}
            >
                <motion.div className="absolute [transform-style:preserve-3d]" style={{ left: "2.5rem", bottom: "1.5rem", width: `${width}rem`, height: `${width * 0.68}rem`, rotateY: rotY, rotateX: rotX }}>
                    <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `rotateY(${-tilt}deg) rotateX(${tilt * 0.25}deg)` }}>
                        {cards.map((card, i) => {
                            const slot = order.indexOf(i);
                            const isDropping = dropping === i;
                            const Icon = card.icon ?? Sparkles;
                            return (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 cursor-pointer [transform-style:preserve-3d]"
                                    style={{ zIndex: isDropping ? 60 : n - slot }}
                                    initial={false}
                                    animate={
                                        isDropping
                                            ? { x: "-1.5rem", y: "15rem", z: 160, rotateX: -32, rotateZ: -6, skewY: skew, opacity: 0 }
                                            : { x: `${slot * distanceX}rem`, y: `${-slot * distanceY}rem`, z: -slot * depth, rotateX: 0, rotateZ: 0, skewY: skew, opacity: slot > 4 ? 0 : 1 }
                                    }
                                    transition={isDropping ? { duration: 0.55, ease: [0.5, 0, 0.75, 0.2] } : { type: "spring", stiffness: 140, damping: 20 }}
                                >
                                    {/* Thickness: side and bottom edges (the face hides the ones behind it). */}
                                    <span aria-hidden="true" className="absolute left-0 top-[0.6rem] bottom-[0.6rem] origin-left" style={{ width: EDGE, background: edge, transform: "rotateY(90deg)" }} />
                                    <span aria-hidden="true" className="absolute right-0 top-[0.6rem] bottom-[0.6rem] origin-right" style={{ width: EDGE, background: edge, transform: "rotateY(-90deg)" }} />
                                    <span aria-hidden="true" className="absolute bottom-0 left-[0.6rem] right-[0.6rem] origin-bottom" style={{ height: EDGE, background: edge, transform: "rotateX(90deg)" }} />
                                    {/* Face */}
                                    <div
                                        className={`absolute inset-0 overflow-hidden rounded-2xl border p-6 ${dark ? "border-white/10" : "border-black/10"} ${face}`}
                                        style={{ boxShadow: "0 40px 70px -30px rgba(0,0,0,0.7)" }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="grid h-9 w-9 place-items-center rounded-xl text-black" style={{ background: accentColor }}>
                                                <Icon className="h-[18px] w-[18px]" />
                                            </span>
                                            <p className="text-lg font-semibold">{card.title}</p>
                                        </div>
                                        <p className={`mt-3 text-[0.92rem] leading-relaxed ${dark ? "text-white/60" : "text-neutral-500"}`}>{card.body}</p>
                                        {/* Sheen and accent glow give the face some light. */}
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.09] via-transparent to-transparent" />
                                        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-25 blur-2xl" style={{ background: accentColor }} />
                                        {/* Cards further back sit in shadow. */}
                                        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" initial={false} animate={{ opacity: isDropping ? 0 : Math.min(0.6, slot * (dark ? 0.2 : 0.12)) }} transition={{ duration: 0.4 }} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CardSwap3D;
