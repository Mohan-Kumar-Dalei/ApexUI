import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaArrowRight, FaGithub, FaRegImage } from "react-icons/fa";
// Cards scale from the bottom, so the offset must beat the shrink (6% of the height) to peek out.
const CARD_STACK_OFFSET = 40;
const CARD_SCALE_STEP = 0.06;
const AUTO_CYCLE_INTERVAL = 5000;
export default function CardStack({
    cards = [],
    autoCycle = true,
    cycleInterval = AUTO_CYCLE_INTERVAL,
}) {
    const [active, setActive] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const timeoutRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    useEffect(() => {
        if (!autoCycle || isHovered || isScrolling || cards.length < 2) return;
        timeoutRef.current = setTimeout(() => {
            setActive((prev) => (prev + 1) % cards.length);
        }, cycleInterval);
        return () => clearTimeout(timeoutRef.current);
    }, [active, isHovered, isScrolling, autoCycle, cycleInterval, cards.length]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeoutRef.current);
        };
    }, []);
    useEffect(() => {
        if (!containerRef.current) return;
        const cardElements = gsap.utils.toArray(".card-item", containerRef.current);
        const tl = gsap.timeline({
            defaults: { duration: 0.7, ease: "elastic.out(1, 0.45)" },
        });
        cardElements.forEach((card, i) => {
            tl.to(card, {
                y: -i * CARD_STACK_OFFSET,
                scale: 1 - i * CARD_SCALE_STEP,
                // Back cards are dimmed instead of blurred: cheaper, and the images stay crisp.
                filter: i === 0 ? "brightness(1)" : `brightness(${0.75 - i * 0.12})`,
                opacity: 1,
                zIndex: cards.length - i,
            }, 0);
        });
        return () => {
            tl.kill();
        };
    }, [active, cards.length]);

    const next = () => setActive((prev) => (prev + 1) % cards.length);
    const getCardIndex = (i) => (active + i) % cards.length;

    return (
        <div
            ref={containerRef}
            className="relative flex justify-center items-end h-[27.5rem] w-full max-w-lg mx-auto pb-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {cards.map((_, i) => {
                if (i >= 4) return null;

                const idx = getCardIndex(i);
                const isTop = i === 0;
                const card = cards[idx];

                return (
                    <div
                        key={idx}
                        onClick={isTop ? next : undefined}
                        className={`card-item group absolute bottom-2 left-0 right-0 mx-auto h-[22.5rem] w-[17.5rem] max-w-[calc(100%-1rem)] origin-bottom overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] select-none ${isTop ? "cursor-pointer" : "pointer-events-none"}`}
                        style={{ opacity: 0 }}
                    >
                        {/* Full-bleed image */}
                        {card.image ? (
                            <img src={card.image} alt={card.title} draggable="false" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900"><FaRegImage className="text-4xl text-white/30" /></div>
                        )}
                        {/* Card colour tint + readable bottom */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 mix-blend-soft-light`} />
                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/75 to-transparent" />

                        {/* Top row: subtitle chip + GitHub */}
                        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                            {card.subtitle && (
                                <span className="line-clamp-1 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">{card.subtitle}</span>
                            )}
                            {card.github && (
                                <a href={card.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label="GitHub" className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:text-white">
                                    <FaGithub className="text-base" />
                                </a>
                            )}
                        </div>

                        {/* Bottom content */}
                        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
                            <h2 className="text-xl font-bold leading-tight tracking-tight text-white">{card.title}</h2>
                            {card.desc && <p className="line-clamp-2 text-[13px] leading-relaxed text-white/70">{card.desc}</p>}
                            <div className="mt-2 flex items-center justify-between gap-3">
                                {card.link ? (
                                    <a href={card.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-white/85">
                                        Visit <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
                                    </a>
                                ) : <span />}
                                {/* Progress dots */}
                                <div className="flex items-center gap-1.5" aria-hidden="true">
                                    {cards.map((__, d) => (
                                        <span key={d} className={`h-1.5 rounded-full transition-all duration-300 ${d === idx ? "w-4 bg-white" : "w-1.5 bg-white/35"}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
