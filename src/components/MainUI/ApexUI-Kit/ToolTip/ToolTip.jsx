import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const ToolTip = ({ items = [] }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const tooltipRefs = useRef([]);
    const avatarRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            items.forEach((_, idx) => {
                const isHovered = hoveredIndex === idx;
                const avatar = avatarRefs.current[idx];
                if (avatar) {
                    gsap.to(avatar, {
                        scale: isHovered ? 1.15 : 1,
                        y: isHovered ? -4 : 0,
                        filter: !isHovered && hoveredIndex !== null ? "blur(1.5px)" : "blur(0px)",
                        duration: 0.3,
                        ease: "power3.out",
                        overwrite: "auto",
                    });
                }

                // Tooltips stay mounted so they can animate out as well as in.
                const tip = tooltipRefs.current[idx];
                if (tip) {
                    gsap.to(tip, {
                        autoAlpha: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 8,
                        scale: isHovered ? 1 : 0.85,
                        duration: isHovered ? 0.35 : 0.2,
                        ease: isHovered ? "back.out(1.8)" : "power2.in",
                        overwrite: "auto",
                    });
                }
            });
        });
        return () => ctx.kill();
    }, [hoveredIndex, items]);

    return (
        <div className="flex items-end -space-x-4" onMouseLeave={() => setHoveredIndex(null)}>
            {items.map((item, idx) => (
                <div
                    key={item.id ?? item.name ?? idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onFocus={() => setHoveredIndex(idx)}
                    onBlur={() => setHoveredIndex(null)}
                    tabIndex={0}
                    className="relative group cursor-pointer outline-none"
                    style={{ zIndex: hoveredIndex === idx ? 50 : 10 }}
                >
                    {/* Outer element centres the tooltip, inner one is animated. */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50">
                        <div
                            ref={(el) => (tooltipRefs.current[idx] = el)}
                            style={{ visibility: "hidden", opacity: 0, transformOrigin: "bottom center" }}
                            className="relative flex flex-col items-center justify-center rounded-lg border border-teal-500/50 bg-gradient-to-br from-black/90 to-zinc-900/80 px-4 py-2 shadow-2xl backdrop-blur-md"
                        >
                            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-t-[8px] border-l-[8px] border-r-[8px] border-t-teal-500/40 border-l-transparent border-r-transparent" />
                            <span className="text-sm font-bold text-teal-300 drop-shadow-sm whitespace-nowrap">
                                {item.name}
                            </span>
                            <span className="text-xs text-zinc-300 italic whitespace-nowrap">
                                {item.designation}
                            </span>
                        </div>
                    </div>
                    <img
                        ref={(el) => (avatarRefs.current[idx] = el)}
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        draggable="false"
                        className="h-14 w-14 object-cover object-center rounded-full border-2 border-white shadow-lg will-change-transform"
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
