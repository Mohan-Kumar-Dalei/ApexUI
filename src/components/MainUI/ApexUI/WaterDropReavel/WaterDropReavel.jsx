import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const WaterDropReveal = ({
    text = "Discover the Water Drop Reveal Effect!\nMake your UI interactive, modern, and magical.\nHover to experience the reveal.",
    dropCount = 3,
    dropColor = "#a855f7",
    animationSpeed = 0.4,
}) => {
    // Limit dropCount to max 10
    const safeDropCount = Math.min(Math.max(1, dropCount), 10);
    const [hovered, setHovered] = useState(false);
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
    const dropRef = useRef(null);
    const textRef = useRef(null);
    const mouseAnim = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!hovered) return;
        gsap.to(mouseAnim.current, {
            x: mouse.x,
            y: mouse.y,
            duration: animationSpeed,
            ease: "power2.out",
            onUpdate: () => {
                if (dropRef.current) {
                    dropRef.current.setAttribute("data-x", mouseAnim.current.x);
                    dropRef.current.setAttribute("data-y", mouseAnim.current.y);
                }
                if (textRef.current) {
                    const xShift = (mouseAnim.current.x - 0.5) * 20;
                    const yShift = (mouseAnim.current.y - 0.5) * 10;
                    const rotateX = -(mouseAnim.current.y - 0.5) * 10;
                    const rotateY = (mouseAnim.current.x - 0.5) * 15;
                    gsap.to(textRef.current, {
                        x: xShift,
                        y: yShift,
                        rotateX,
                        rotateY,
                        scale: 1.08,
                        transformPerspective: 600,
                        transformOrigin: "center",
                        duration: animationSpeed,
                        ease: "power3.out",
                    });
                }
            },
        });
    }, [mouse, hovered, animationSpeed]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMouse({ x, y });
    };

    const animX = hovered ? mouseAnim.current.x : 0.5;
    const animY = hovered ? mouseAnim.current.y : 0.5;
    const cx = 200 + (animX - 0.5) * 40;
    const cy = 80 + (animY - 0.5) * 20;

    return (
        <div
            className="relative w-full h-full rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group border border-gray-800 transition-all duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                gsap.to(textRef.current, {
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                });
            }}
            onMouseMove={handleMouseMove}
            style={{ minHeight: 260 }}
        >
            {/* Water Drop Layer */}
            <div
                ref={dropRef}
                className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
                style={{ width: "100%", height: "100%" }}
            >
                <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <filter id="drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="6" stdDeviation="18" flood-color="black" flood-opacity="60" />
                        </filter>
                    </defs>
                    {(() => {
                        // Dynamic radii and opacities for unique drops
                        const maxRadius = 160;
                        const minRadius = 36;
                        const maxOpacity = 0.7;
                        const minOpacity = 0.18;
                        const step = safeDropCount > 1 ? (maxRadius - minRadius) / (safeDropCount - 1) : 0;
                        const opacityStep = safeDropCount > 1 ? (maxOpacity - minOpacity) / (safeDropCount - 1) : 0;
                        return [...Array(safeDropCount)].map((_, i) => {
                            const r = Math.round(maxRadius - i * step);
                            const opacity = +(maxOpacity - i * opacityStep).toFixed(2);
                            return (
                                <circle
                                    key={i}
                                    cx={cx}
                                    cy={cy}
                                    r={hovered ? r : 0}
                                    fill={dropColor}
                                    fillOpacity={hovered ? opacity : 0}
                                    style={{ transition: `r 0.7s, fill-opacity 0.7s` }}
                                    filter="url(#drop-shadow)"
                                />
                            );
                        });
                    })()}
                </svg>
            </div>

            {/* Text Reveal with 3D */}
            <span
                ref={textRef}
                className={`absolute whitespace-break-spaces z-20 max-sm:text-xl text-4xl font-semibold tracking-wide select-none transition-opacity duration-700 text-center w-full px-4 ${hovered ? "blur-0 opacity-100" : "text-gray-400 blur-sm opacity-60"}`}
                style={{
                    left: 0,
                    letterSpacing: 0,
                    willChange: "transform",
                    background: hovered ? "linear-gradient(90deg, #fff, #38bdf8, #fff)" : undefined,
                    WebkitBackgroundClip: hovered ? "text" : undefined,
                    WebkitTextFillColor: hovered ? "transparent" : undefined,
                    backgroundClip: hovered ? "text" : undefined,
                    color: hovered ? undefined : undefined,
                    fontFamily: "Bitcount Prop Double, system-ui",
                }}
            >
                {text}
            </span>

            {/* Hover Hint */}
            {!hovered && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm text-white bg-black/40 px-3 py-1 rounded-full shadow-md animate-pulse pointer-events-none select-none">
                    Hover to reveal
                </span>
            )}
        </div>
    );
};

export default WaterDropReveal;
