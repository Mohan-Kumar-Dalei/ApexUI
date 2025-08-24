/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaRegImage } from "react-icons/fa";
const CARD_STACK_OFFSET = 32; 
const CARD_SCALE_STEP = 0.08; 
const AUTO_CYCLE_INTERVAL = 5000;
export default function GlassCardStack({
    cards = [],
    autoCycle = true,
    cycleInterval = AUTO_CYCLE_INTERVAL,
}) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        if (!autoCycle || paused) return;
        timeoutRef.current = setTimeout(() => {
            setActive((prev) => (prev + 1) % cards.length);
        }, cycleInterval);
        return () => clearTimeout(timeoutRef.current);
    }, [active, paused, autoCycle, cycleInterval, cards.length]);

    // For cycling animation
    const getCardIndex = (i) => (active + i) % cards.length;

    return (
        <div
            className="relative flex justify-center items-center h-[340px] md:h-[400px] w-full max-w-lg mx-auto select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {cards.map((_, i) => {
                // Stack order: 0 is top, 1 is next, etc.
                const idx = getCardIndex(i);
                const isTop = i === 0;
                const z = cards.length - i;
                const offset = i * CARD_STACK_OFFSET;
                const scale = 1 - i * CARD_SCALE_STEP;
                const card = cards[idx];
                return (
                    <AnimatePresence key={idx}>
                        <motion.div
                            key={idx}
                            initial={{
                                y: 60,
                                opacity: 0,
                                scale: scale * 0.95,
                            }}
                            animate={{
                                y: -offset,
                                opacity: 1,
                                scale,
                                zIndex: z,
                                filter: isTop ? "none" : "blur(2px)",
                            }}
                            exit={{
                                y: -100,
                                opacity: 0,
                                scale: scale * 0.95,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`absolute left-0 right-0 mx-auto w-11/12 md:w-96 h-48 md:h-60 rounded-3xl shadow-xl bg-gradient-to-br ${card.color} backdrop-blur-lg border border-white/20 flex flex-row items-center px-3 md:px-6 py-4 cursor-pointer select-none ${isTop ? "" : "pointer-events-none"}`}
                            style={{ zIndex: z }}
                        >
                            {/* Left: Responsive Image */}
                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-white/10 border border-white/20 mr-3 md:mr-6">
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <FaRegImage className="text-3xl text-white/40" />
                                )}
                            </div>
                            {/* Right: Info */}
                            <div className="flex-1 flex flex-col justify-center gap-1 md:gap-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base md:text-xl font-bold text-white drop-shadow">
                                        {card.title}
                                    </h2>
                                    {card.github && (
                                        <a href={card.github} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white ml-1">
                                            <FaGithub className="inline-block align-middle text-lg md:text-xl" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-xs md:text-sm text-white/60 mb-1">{card.subtitle}</p>
                                <p className="text-xs md:text-base text-white/80 mb-1 line-clamp-2">{card.desc}</p>
                                {card.link && (
                                    <a
                                        href={card.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs md:text-sm px-2 py-1 rounded bg-blue-500/80 hover:bg-blue-600/90 text-white font-semibold shadow transition w-fit mt-1"
                                    >
                                        <FaExternalLinkAlt className="inline-block mr-1 text-xs md:text-sm" />
                                        Visit
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                );
            })}
        </div>
    );
}