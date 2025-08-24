import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const ToolTip = ({ items }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const tooltipRefs = useRef([]);
    const avatarRefs = useRef([]);

    useEffect(() => {
        // Animate all avatars based on hover state
        items.forEach((_, idx) => {
            const isHovered = hoveredIndex === idx;

            // Animate the avatar image
            gsap.to(avatarRefs.current[idx], {
                scale: isHovered ? 1.15 : 1,
                filter: isHovered ? "blur(0px)" : hoveredIndex !== null ? "blur(1.5px)" : "blur(0px)",
                duration: 0.25,
                ease: "power2.inOut",
            });
        });

        // Animate the tooltip for the hovered item
        if (hoveredIndex !== null && tooltipRefs.current[hoveredIndex]) {
            gsap.fromTo(
                tooltipRefs.current[hoveredIndex],
                { opacity: 0, y: 10, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power3.out",
                }
            );
        }
    }, [hoveredIndex, items]);

    return (
        <div className="flex items-end -space-x-4">
            {items.map((item, idx) => (
                <div
                    key={item.name}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative group cursor-pointer"
                    style={{ zIndex: hoveredIndex === idx ? 50 : 10 }}
                >
                    {hoveredIndex === idx && (
                        <div
                            ref={(el) => (tooltipRefs.current[idx] = el)}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 flex flex-col items-center justify-center rounded-lg border border-teal-500/50 bg-gradient-to-br from-black/90 to-zinc-900/80 px-4 py-2 shadow-2xl backdrop-blur-md"
                        >
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-t-[8px] border-l-[8px] border-r-[8px] border-t-teal-500/40 border-l-transparent border-r-transparent" />
                            <span className="text-sm font-bold text-teal-300 drop-shadow-sm whitespace-nowrap">
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
                        className="h-14 w-14 object-cover object-center rounded-full border-2 border-white shadow-lg transition-transform"
                        style={{
                            zIndex: hoveredIndex === idx ? 50 : 10,
                            transition: "all 0.25s ease-in-out",
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default function ToolTipInner({ items }) {
    return (
        <div className="flex flex-row items-center justify-center">
            <ToolTip items={items} />
        </div>
    );
}