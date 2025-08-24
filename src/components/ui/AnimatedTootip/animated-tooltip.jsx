import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export const AnimatedTooltip = ({ items }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const tooltipRefs = useRef([]);
    const avatarRefs = useRef([]);
    const containerRefs = useRef([]);

    useEffect(() => {
        items.forEach((_, idx) => {
            const isHovered = hoveredIndex === idx;

            if (avatarRefs.current[idx]) {
                gsap.to(avatarRefs.current[idx], {
                    scale: isHovered ? 1.15 : 1,
                    width: isHovered ? 96 : 56,
                    height: 56,
                    filter: isHovered ? "blur(0px)" : hoveredIndex !== null ? "blur(1.5px)" : "blur(0px)",
                    duration: 0.10,
                    ease: "power4.inOut",
                    borderRadius: "0.75rem",
                });
            }
        });

        if (hoveredIndex !== null && tooltipRefs.current[hoveredIndex]) {
            gsap.fromTo(
                tooltipRefs.current[hoveredIndex],
                { opacity: 0, y: 20, scale: 0.92 },
                { opacity: 1, y: -8, scale: 1, duration: 0.4, ease: "power4.out" }
            );
        }
    }, [hoveredIndex]);

    return (
        <div className="flex items-end -space-x-4">
            {items.map((item, idx) => (
                <div
                    key={item.name}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative group z-10"
                    style={{ zIndex: hoveredIndex === idx ? 50 : 10 }}
                    ref={(el) => (containerRefs.current[idx] = el)}
                >
                    {hoveredIndex === idx && (
                        <div
                            ref={(el) => (tooltipRefs.current[idx] = el)}
                            className="absolute bottom-[calc(100%+4px)] z-50 flex flex-col items-center rounded-xl border border-purple-500/50 bg-gradient-to-br from-black/90 to-zinc-900/80 px-4 py-2 shadow-2xl backdrop-blur-md"
                            style={{ pointerEvents: "none", transition: "all 0.3s ease-in-out" }}
                        >
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-[10px] border-t-purple-500/40 border-l-transparent border-r-transparent absolute -bottom-2" />
                            <span className="text-sm font-bold text-purple-300 drop-shadow-sm whitespace-nowrap">
                                {item.name}
                            </span>
                            <span className="text-xs text-zinc-300 italic whitespace-nowrap">
                                {item.designation}
                            </span>
                        </div>
                    )}

                    <img
                        ref={(el) => (avatarRefs.current[idx] = el)}
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 object-cover object-center rounded-full border-2 border-white shadow-lg transition-transform duration-500"
                        style={{
                            aspectRatio: "1 / 1",
                            transition: "all 0.25s ease-in-out",
                        }}
                    />
                </div>
            ))}
        </div>
    );
};