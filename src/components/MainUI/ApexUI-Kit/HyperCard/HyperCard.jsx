import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import {
    faCube,
    faChevronRight, // Changed icon for a better look with the new button
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HyperCard = ({
    // Content props remain unchanged
    text = "Introducing Hyper Card",
    LastText = "Effect",
    LastTextColor = "#9AE600", // Green color from your original code
    SubText = "Fully animated lightning effect card with customizable props, built with Apex UI.",
    title = "Apex UI Hyper Card",
    description = "Experience futuristic animations with customizable props like glow, beam, star count, and hover interactions.",
    buttonText = "Get Started",

    // Animation props remain unchanged
    starColor = "#9AE600", // Green stars
    starCount = 250,
    glow = true,
    baseSpeed = 0.5,
    warpSpeed = 8.5,
    circlePosition = "bottom",
}) => {
    const canvasRef = useRef(null);
    const contentRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const stars = useRef([]);
    const speedRef = useRef({ value: baseSpeed });

    // 🎇 Particle logic remains exactly the same
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrame;
        let w, h;

        const init = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            stars.current = Array.from({ length: starCount }, () => {
                const z = Math.random() * w;
                return {
                    x: Math.random() * w, y: Math.random() * h,
                    z, baseZ: z, brightness: Math.random() * 0.5 + 0.5,
                };
            });
        };

        const draw = () => {
            // Updated to draw on a transparent background
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = starColor;

            stars.current.forEach((star) => {
                star.z -= speedRef.current.value;
                if (star.z <= 1) star.z = star.baseZ;
                const sx = (star.x - w / 2) * (w / star.z) + w / 2;
                const sy = (star.y - h / 2) * (h / star.z) + h / 2;
                const size = (1 - star.z / w) * 2;
                ctx.beginPath();
                ctx.globalAlpha = star.brightness;
                if (speedRef.current.value > baseSpeed + 0.3) {
                    const tailLength = speedRef.current.value * 3;
                    const dx = sx - w / 2, dy = sy - h / 2;
                    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(sx + (dx / mag) * tailLength, sy + (dy / mag) * tailLength);
                    ctx.strokeStyle = starColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    ctx.arc(sx, sy, size > 0 ? size : 0.1, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            });

            animationFrame = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener("resize", init);
        return () => { cancelAnimationFrame(animationFrame); window.removeEventListener("resize", init); };
    }, [starColor, starCount, baseSpeed]);

    // GSAP animations for speed and jiggle remain the same
    useEffect(() => {
        gsap.to(speedRef.current, { value: hovered ? warpSpeed : baseSpeed, duration: 1.5, ease: "power4.inOut" });
    }, [hovered, warpSpeed, baseSpeed]);

    useEffect(() => {
        const el = contentRef.current;
        if (hovered) {
            gsap.to(el, { scale: 0.95, duration: 0.5, ease: "power1.out" });
            gsap.to(el, { x: "+=1", y: "-=1", duration: 0.05, repeat: -1, yoyo: true, ease: "sine.inOut" });
        } else {
            gsap.killTweensOf(el);
            gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
        }
    }, [hovered]);

    return (
        <div
            className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden text-white 
                    border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50"
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '2rem 2rem'
            }}
        >
            {/* Top animated HyperCard */}
            <div
                className="relative w-full h-50 overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

                {/* Glow effect from your original code */}
                {glow && (
                    <div
                        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                        style={{
                            mixBlendMode: "soft-light",
                            opacity: 0.8,
                            background: `radial-gradient(circle at ${circlePosition}, ${starColor} 0%, transparent 70%)`,
                        }}
                    />
                )}

                {/* Glowing separator line */}
                <div className="absolute bottom-0 w-full h-[2px] bg-purple-500/50 blur-sm"></div>

                <div ref={contentRef} className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 py-2">
                    <h2 className="text-lg sm:text-xl font-normal text-center text-white">
                        {text}{" "}
                        {/* Fixed color issue by using inline style */}
                        <span className="font-bold ml-1" style={{ color: LastTextColor }}>
                            {LastText}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-300 text-center max-w-sm mt-1">{SubText}</p>
                </div>
            </div>

            {/* Bottom content section */}
            <div className="px-6 pt-5 pb-6 w-full text-left flex flex-col items-start">
                <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faCube} style={{ color: starColor }} className="text-2xl" />
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{title}</h3>
                </div>
                <p className="text-gray-400 text-base mb-5 max-w-xs leading-relaxed">{description}</p>

                {/* --- NEW BUTTON WITH ANIMATION --- */}
                <button
                    className="group relative flex items-center gap-2 px-6 py-2.5 
                               border-2 border-[#9AE600] rounded-lg 
                               font-semibold text-white overflow-hidden transition-all duration-300"
                >
                    {/* Fill-up background effect */}
                    <span
                        className="absolute inset-0 h-full w-0  bg-[#4c6d0a] 
                                   transition-all duration-300 ease-in-out group-hover:w-full"
                        style={{ transformOrigin: 'bottom' }}
                    ></span>

                    {/* Button text and icon */}
                    <span className="relative z-10 flex items-center gap-2">
                        {buttonText}
                        <FontAwesomeIcon icon={faChevronRight} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HyperCard;