import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const ToolTip = ({ items }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const tooltipRefs = useRef([]);
    const avatarRefs = useRef([]);
    const last = items.length - 1;

    useEffect(() => {
        // Lift the active avatar, dim the others
        items.forEach((_, idx) => {
            const isHovered = hoveredIndex === idx;
            gsap.to(avatarRefs.current[idx], {
                y: isHovered ? -6 : 0,
                scale: isHovered ? 1.12 : 1,
                opacity: hoveredIndex === null || isHovered ? 1 : 0.55,
                duration: 0.3,
                ease: "power3.out",
            });
        });

        // Pop the tooltip in
        if (hoveredIndex !== null && tooltipRefs.current[hoveredIndex]) {
            gsap.fromTo(
                tooltipRefs.current[hoveredIndex],
                { opacity: 0, y: 12, scale: 0.85, rotate: 0 },
                { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.8)" }
            );
        }
    }, [hoveredIndex, items]);

    // The tooltip swings toward the pointer while it moves across the avatar.
    const handlePointerMove = (e, idx) => {
        const tip = tooltipRefs.current[idx];
        if (!tip || e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const offset = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 … 1
        gsap.to(tip, { rotate: offset * 10, x: offset * 12, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    };

    // Keep the end tooltips inside small screens: align them to their outer edge.
    const placement = (idx) =>
        idx === 0 && last > 0 ? { box: "left-0", arrow: "left-6" }
            : idx === last && last > 0 ? { box: "right-0", arrow: "right-6" }
                : { box: "left-1/2 -translate-x-1/2", arrow: "left-1/2 -translate-x-1/2" };

    return (
        <div className="flex items-end -space-x-3 sm:-space-x-4">
            {items.map((item, idx) => {
                const { box, arrow } = placement(idx);
                return (
                    <div
                        key={item.id ?? item.name}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setHoveredIndex(idx)}
                        onPointerLeave={(e) => e.pointerType === "mouse" && setHoveredIndex(null)}
                        onPointerMove={(e) => handlePointerMove(e, idx)}
                        // Tap to toggle on touch screens
                        onClick={() => setHoveredIndex((cur) => (cur === idx ? null : idx))}
                        className="relative cursor-pointer"
                        style={{ zIndex: hoveredIndex === idx ? 50 : 10 + idx }}
                    >
                        {hoveredIndex === idx && (
                            <div className={`pointer-events-none absolute bottom-full mb-4 z-50 ${box}`}>
                                {/* The card and its arrow animate together, so the arrow follows every swing. */}
                                <div ref={(el) => (tooltipRefs.current[idx] = el)} className="relative origin-bottom">
                                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]">
                                        <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-lime-400 to-cyan-400" />
                                        <span className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-white">
                                            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
                                            {item.name}
                                        </span>
                                        <span className="mt-0.5 block whitespace-nowrap text-xs text-zinc-400">{item.designation}</span>
                                    </div>
                                    {/* Downward arrow: filled triangle that covers the card's bottom border, with the border on its two sides only */}
                                    <svg width="16" height="8" viewBox="0 0 16 8" className={`absolute top-full -mt-px ${arrow}`} aria-hidden="true">
                                        <path d="M0 0 L8 8 L16 0 Z" fill="#09090b" />
                                        <path d="M0.5 0 L8 7.5 L15.5 0" fill="none" stroke="rgba(255,255,255,0.1)" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div ref={(el) => (avatarRefs.current[idx] = el)} className="rounded-full bg-gradient-to-br from-lime-400 via-emerald-400 to-cyan-400 p-[2px] shadow-lg shadow-black/30">
                            <img
                                src={item.image}
                                alt={item.name}
                                draggable="false"
                                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-zinc-950 object-cover object-top"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function ToolTipInner({ items }) {
    return (
        <div className="flex flex-row items-center justify-center pt-24">
            <ToolTip items={items} />
        </div>
    );
}
