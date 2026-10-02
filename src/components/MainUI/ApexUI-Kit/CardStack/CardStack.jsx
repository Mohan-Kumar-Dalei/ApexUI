import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaExternalLinkAlt, FaGithub, FaRegImage } from "react-icons/fa";

const CARD_STACK_OFFSET = 32;
const CARD_SCALE_STEP = 0.08;
const AUTO_CYCLE_INTERVAL = 5000;
const VISIBLE_CARDS = 4;

export default function CardStack({
    cards = [],
    autoCycle = true,
    cycleInterval = AUTO_CYCLE_INTERVAL,
}) {
    const [active, setActive] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const count = cards.length;

    const next = () => count && setActive((prev) => (prev + 1) % count);

    // Auto-cycle, paused on hover and while the tab is hidden.
    useEffect(() => {
        if (!autoCycle || isHovered || count < 2) return undefined;
        const id = setTimeout(() => {
            if (!document.hidden) next();
        }, cycleInterval);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, isHovered, autoCycle, cycleInterval, count]);

    useEffect(() => {
        if (active >= count) setActive(0);
    }, [active, count]);

    useLayoutEffect(() => {
        if (!containerRef.current) return undefined;
        const ctx = gsap.context(() => {
            gsap.utils.toArray(".card-item", containerRef.current).forEach((card, i) => {
                gsap.to(card, {
                    y: -i * CARD_STACK_OFFSET,
                    scale: 1 - i * CARD_SCALE_STEP,
                    filter: i === 0 ? "blur(0px)" : "blur(1px)",
                    opacity: 1,
                    zIndex: count - i,
                    duration: 0.7,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });
        }, containerRef);
        // kill (not revert) so the next transition starts from the current pose
        return () => ctx.kill();
    }, [active, count]);

    if (!count) return null;

    return (
        <div
            ref={containerRef}
            className="relative flex justify-center items-center h-[340px] md:h-[400px] w-full max-w-lg mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {Array.from({ length: Math.min(VISIBLE_CARDS, count) }, (_, i) => {
                const idx = (active + i) % count;
                const isTop = i === 0;
                const card = cards[idx];

                return (
                    <div
                        key={idx}
                        onClick={isTop ? next : undefined}
                        className={`card-item absolute left-0 right-0 mx-auto w-11/12 md:w-96 h-48 md:h-60 rounded-3xl shadow-xl bg-gradient-to-br ${card.color ?? ''} bg-slate-950 border border-white/20 flex flex-row items-center px-3 md:px-6 py-4 cursor-pointer select-none will-change-transform ${isTop ? "" : "pointer-events-none"}`}
                        style={{ opacity: 0 }}
                    >
                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-white/10 border border-white/20 mr-3 md:mr-6">
                            {card.image ? (<img src={card.image} alt={card.title} loading="lazy" draggable="false" className="object-cover w-full h-full" />) : (<FaRegImage className="text-3xl text-white/40" />)}
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-1 md:gap-2 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base md:text-xl font-bold text-white drop-shadow truncate">{card.title}</h2>
                                {card.github && (<a href={card.github} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-white/70 hover:text-white ml-1 flex-shrink-0"><FaGithub className="inline-block align-middle text-lg md:text-xl" /></a>)}
                            </div>
                            <p className="text-xs md:text-sm text-white/60 mb-1 truncate">{card.subtitle}</p>
                            <p className="text-xs md:text-base text-white/80 mb-1 line-clamp-2">{card.desc}</p>
                            {card.link && (<a href={card.link} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs md:text-sm px-2 py-1 rounded bg-blue-500/80 hover:bg-blue-600/90 text-white font-semibold shadow transition w-fit mt-1"><FaExternalLinkAlt className="inline-block mr-1 text-xs md:text-sm" />Visit</a>)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
