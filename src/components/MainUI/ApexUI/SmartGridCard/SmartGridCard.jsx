"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
    Box,
    Settings,
    Lock,
    Sparkles,
    Search,
    LaptopMinimal,
} from "lucide-react";

const CARD_HEIGHT = 250;
const CARD_EXPANDED_HEIGHT = 510;

const SmartGridCard = ({
    cards = defaultCards(),
    mergeMap = {}, // Example: { 5: 2 }
    borderColor = "cyan"
}) => {
    // Track screen width for responsive mergeMap logic
    const [screenWidth, setScreenWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isLargeScreen = screenWidth >= 1080;
    const isThreeCol = screenWidth >= 1024;
    const isTwoCol = screenWidth >= 768 && screenWidth < 1024;
    const cardRefs = useRef({});
    const [mousePos, setMousePos] = useState({});

    useEffect(() => {
        if (!isLargeScreen) return; // Only run mergeMap effect on large screens
        // Defensive: never trigger a reload, only animate
        if (Object.keys(mergeMap).length === 0) return; // No merges to process
        // Animate cards based on mergeMap
        Object.entries(mergeMap).forEach(([sourceId, targetId]) => {
            const sourceEl = cardRefs.current[sourceId];
            const targetEl = cardRefs.current[targetId];

            if (targetEl) {
                gsap.to(targetEl, {
                    height: CARD_EXPANDED_HEIGHT,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }

            if (sourceEl) {
                gsap.to(sourceEl, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    onComplete: () => {
                        if (sourceEl) sourceEl.style.display = "none";
                    },
                });
            }
        });
        // No reload, no navigation, no window.location
        return () => { };
    }, [mergeMap, isLargeScreen]);

    const handleMouseMove = (e, id) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        setMousePos((prev) => ({
            ...prev,
            [id]: { x, y },
        }));
    };

    const getCardStyle = (id) => {
        // <768px: 1 column
        if (screenWidth < 768) {
            return {
                display: 'block',
                height: CARD_HEIGHT,
                gridColumnStart: 'auto',
                gridRowStart: 'auto',
            };
        }
        // 768px - 1023px: 2 columns
        if (isTwoCol) {
            const col = ((id - 1) % 2) + 1;
            const row = Math.floor((id - 1) / 2) + 1;
            return {
                display: 'block',
                height: CARD_HEIGHT,
                gridColumnStart: col,
                gridRowStart: row,
            };
        }
        // 1024px and above: 3 columns (mergeMap only for >=1080px)
        if (isThreeCol) {
            if (screenWidth < 1080) {
                const col = ((id - 1) % 3) + 1;
                const row = Math.floor((id - 1) / 3) + 1;
                return {
                    display: 'block',
                    height: CARD_HEIGHT,
                    gridColumnStart: col,
                    gridRowStart: row,
                };
            }
            // >=1080px: 3 columns, merging enabled
            const isMerged = mergeMap[id];
            const isTarget = Object.values(mergeMap).includes(id);
            if (isMerged) return { display: "none" };
            const col = ((id - 1) % 3) + 1;
            const row = Math.floor((id - 1) / 3) + 1;
            return {
                gridColumnStart: col,
                gridRowStart: row,
                height: isTarget ? CARD_EXPANDED_HEIGHT : CARD_HEIGHT,
            };
        }
    };

    return (
        <div
            className={`grid gap-2 justify-center p-4 w-full ${screenWidth >= 1024 ? 'grid-cols-3' : screenWidth >= 768 ? 'grid-cols-2' : 'grid-cols-1'}`}
            style={screenWidth >= 1024 ? {
                gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
                gridTemplateRows: `repeat(2, ${CARD_HEIGHT}px)`
            } : screenWidth >= 768 ? {
                gridTemplateColumns: "repeat(2, minmax(300px, 1fr))",
                gridTemplateRows: `repeat(3, ${CARD_HEIGHT}px)`
            } : {}}
        >
            {cards.map((card) => {
                const style = getCardStyle(card.id);
                if (style.display === "none") return null;

                const pos = mousePos[card.id] || { x: 0, y: 0 };

                return (
                    <div
                        key={card.id}
                        ref={(el) => (cardRefs.current[card.id] = el)}
                        style={style}
                        onMouseMove={(e) => handleMouseMove(e, card.id)}
                        className="group relative overflow-hidden p-[1px] rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl transition-all duration-500"
                    >
                        {/* Mouse Glow Border */}
                        <div
                            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
                            style={{
                                maskImage: `radial-gradient(circle at ${pos.x}px ${pos.y}px, white 40%, transparent 80%)`,
                                WebkitMaskImage: `radial-gradient(circle at ${pos.x}px ${pos.y}px, white 40%, transparent 80%)`,
                                background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, ${borderColor}, transparent 80%)`,
                                borderRadius: "1rem",
                            }}
                        />

                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col items-start justify-between h-full w-full p-6 rounded-2xl bg-zinc-900 text-white space-y-4">
                            <div className="text-4xl border border-dashed p-2 rounded-lg border-purple-600">{card.icon}</div>
                            <div>
                                <h3 className="text-xl md:text-xl font-bold mb-2 break-words leading-tight">{card.title}</h3>
                                <p className="text-sm md:text-base w-full text-white/70 break-words">{card.description}</p>
                            </div>
                            <button
                                type="button"
                                className="mt-auto relative overflow-hidden px-5 py-3 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-black/20 group flex items-center gap-2 text-xs md:text-base"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {card.buttonText}
                                    <span className="arrow-icon transition-transform duration-200 group-hover:translate-x-2 flex items-center">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </span>
                                </span>
                                <span
                                    className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-lg"
                                    style={{
                                        background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                                        mixBlendMode: "screen",
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Default Cards
function defaultCards() {
    return [
        {
            id: 1,
            icon: <LaptopMinimal className="w-6 h-6 text-white" />,
            title: "Responsive Layout",
            description: "Works across all screen sizes with smooth animation.",
            buttonText: "Learn More",
        },
        {
            id: 2,
            icon: <Box className="w-6 h-6 text-white" />,
            title: "Composable Components",
            description: "Each card is modular and easy to customize.",
            buttonText: "Explore",
        },
        {
            id: 3,
            icon: <Settings className="w-6 h-6 text-white" />,
            title: "Easy Config",
            description: "Use props like mergeMap to control logic.",
            buttonText: "Settings",
        },
        {
            id: 4,
            icon: <Lock className="w-6 h-6 text-white" />,
            title: "Secure UI",
            description: "Perfect for dashboards and secure apps.",
            buttonText: "Secure Now",
        },
        {
            id: 5,
            icon: <Sparkles className="w-6 h-6 text-white" />,
            title: "Edge Effects",
            description: "Glowing borders that follow your mouse.",
            buttonText: "Try It",
        },
        {
            id: 6,
            icon: <Search className="w-6 h-6 text-white" />,
            title: "Fast Search",
            description: "Lightning-fast component navigation.",
            buttonText: "Search",
        },
    ];
}

export default SmartGridCard;
