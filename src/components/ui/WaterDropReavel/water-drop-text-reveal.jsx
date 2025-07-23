import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const WaterDropTextReveal = ({ text = "Do you want Water Drop Reveal!" }) => {
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
            duration: 0.4,
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
                        duration: 0.4,
                        ease: "power3.out",
                    });
                }
            },
        });
    }, [mouse, hovered]);

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
            className="relative w-full h-full rounded-2xl bg-[#18181b] shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group border border-gray-800 transition-all duration-300"
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
                    <circle cx={cx} cy={cy} r={hovered ? 160 : 0} fill="#a855f7" fillOpacity={hovered ? 0.18 : 0} style={{ transition: "r 0.7s, fill-opacity 0.7s" }} />
                    <circle cx={cx} cy={cy} r={hovered ? 90 : 0} fill="#a855f7" fillOpacity={hovered ? 0.32 : 0} style={{ transition: "r 0.5s, fill-opacity 0.5s" }} />
                    <circle cx={cx} cy={cy} r={hovered ? 36 : 0} fill="#a855f7" fillOpacity={hovered ? 0.7 : 0} style={{ transition: "r 0.3s, fill-opacity 0.3s" }} />
                </svg>
            </div>

            {/* Text Reveal with 3D */}
            <span
                ref={textRef}
                className={`absolute left-1/2  z-20 text-2xl sm:text-3xl font-bold tracking-wide select-none transition-opacity duration-700 ${hovered ? "text-white blur-0 opacity-100" : "text-gray-400 blur-sm opacity-60"}`}
                style={{
                    left: "2rem", // or use Tailwind: left-8 sm:left-12
                    letterSpacing: 0,
                    willChange: "transform",
                    transformOrigin: "left center",
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

export default WaterDropTextReveal;
