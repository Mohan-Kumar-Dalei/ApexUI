import React, { useState, useRef, useEffect, useId } from "react";
import gsap from "gsap";

const VIEW_W = 400;
const VIEW_H = 160;

const WaterDropReveal = ({
    text = "Discover the Water Drop Reveal Effect!\nMake your UI interactive, modern, and magical.\nHover to experience the reveal.",
    dropCount = 3,
    dropColor = "#a855f7",
    animationSpeed = 0.4,
}) => {
    const safeDropCount = Math.min(Math.max(1, dropCount), 10);
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef(null);
    const textRef = useRef(null);
    const movers = useRef(null);
    const filterId = `drop-shadow-${useId().replace(/:/g, "")}`;

    // quickTo animators are created once and reused for every pointer move,
    // instead of starting new tweens on each event.
    useEffect(() => {
        const group = groupRef.current;
        const textEl = textRef.current;
        if (!group || !textEl) return undefined;
        const opts = { duration: animationSpeed, ease: "power3.out" };
        gsap.set(textEl, { transformPerspective: 600, transformOrigin: "center" });
        movers.current = {
            dropX: gsap.quickTo(group, "x", opts),
            dropY: gsap.quickTo(group, "y", opts),
            textX: gsap.quickTo(textEl, "x", opts),
            textY: gsap.quickTo(textEl, "y", opts),
            rotX: gsap.quickTo(textEl, "rotationX", opts),
            rotY: gsap.quickTo(textEl, "rotationY", opts),
            scale: gsap.quickTo(textEl, "scale", opts),
        };
        return () => gsap.killTweensOf([group, textEl]);
    }, [animationSpeed]);

    const handleMouseMove = (e) => {
        const m = movers.current;
        if (!m) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        m.dropX(nx * 40);
        m.dropY(ny * 20);
        m.textX(nx * 20);
        m.textY(ny * 10);
        m.rotX(-ny * 10);
        m.rotY(nx * 15);
        m.scale(1.08);
    };

    const handleLeave = () => {
        setHovered(false);
        const m = movers.current;
        if (!m) return;
        [m.dropX, m.dropY, m.textX, m.textY, m.rotX, m.rotY].forEach((fn) => fn(0));
        m.scale(1);
    };

    const maxRadius = 160;
    const minRadius = 36;
    const maxOpacity = 0.7;
    const minOpacity = 0.18;
    const step = safeDropCount > 1 ? (maxRadius - minRadius) / (safeDropCount - 1) : 0;
    const opacityStep = safeDropCount > 1 ? (maxOpacity - minOpacity) / (safeDropCount - 1) : 0;

    return (
        <div
            className="relative w-full h-full rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group border border-gray-800"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={handleLeave}
            onPointerMove={handleMouseMove}
            style={{ minHeight: 260 }}
        >
            <div
                className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
            >
                <svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="6" stdDeviation="18" floodColor="black" floodOpacity={0.6} />
                        </filter>
                    </defs>
                    <g ref={groupRef}>
                        {Array.from({ length: safeDropCount }, (_, i) => (
                            <circle
                                key={i}
                                cx={VIEW_W / 2}
                                cy={VIEW_H / 2}
                                r={hovered ? Math.round(maxRadius - i * step) : 0}
                                fill={dropColor}
                                fillOpacity={hovered ? +(maxOpacity - i * opacityStep).toFixed(2) : 0}
                                style={{ transition: `r 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s, fill-opacity 0.7s ease` }}
                                filter={`url(#${filterId})`}
                            />
                        ))}
                    </g>
                </svg>
            </div>

            <span
                ref={textRef}
                className={`absolute whitespace-break-spaces z-20 max-sm:text-xl text-4xl font-semibold tracking-wide select-none transition-[opacity,filter,color] duration-700 text-center w-full px-4 will-change-transform ${hovered ? "blur-0 opacity-100" : "text-gray-400 blur-sm opacity-60"}`}
                style={{
                    left: 0,
                    letterSpacing: 0,
                    background: hovered ? "linear-gradient(90deg, #fff, #38bdf8, #fff)" : undefined,
                    WebkitBackgroundClip: hovered ? "text" : undefined,
                    WebkitTextFillColor: hovered ? "transparent" : undefined,
                    backgroundClip: hovered ? "text" : undefined,
                    fontFamily: "'Bitcount Prop Double', system-ui",
                }}
            >
                {text}
            </span>

            <span
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm text-white bg-black/40 px-3 py-1 rounded-full shadow-md pointer-events-none select-none transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100 animate-pulse"}`}
            >
                Hover to reveal
            </span>
        </div>
    );
};

export default WaterDropReveal;
