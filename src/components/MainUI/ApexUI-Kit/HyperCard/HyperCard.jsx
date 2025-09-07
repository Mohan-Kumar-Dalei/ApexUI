// ...existing code...
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import {
    faCube,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HyperCard = ({
    text = "Introducing Hyper Card",
    LastText = "Effect",
    LastTextColor = "#9AE600",
    SubText = "Fully animated lightning effect card with customizable props, built with Apex UI.",
    title = "Apex UI Hyper Card",
    description = "Experience futuristic animations with customizable props like glow, beam, star count, and hover interactions.",
    buttonText = "Get Started",

    starColor = "#9AE600",
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

    // Particle canvas (kept same logic; responsive CSS classes control visual size)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrame;
        let w, h;

        const init = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            stars.current = Array.from({ length: starCount }, () => {
                const z = Math.random() * Math.max(w, 1);
                return {
                    x: Math.random() * w, y: Math.random() * h,
                    z, baseZ: z, brightness: Math.random() * 0.5 + 0.5,
                };
            });
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = starColor;

            stars.current.forEach((star) => {
                star.z -= speedRef.current.value;
                if (star.z <= 1) star.z = star.baseZ || Math.max(w, 1);
                const sx = (star.x - w / 2) * (w / star.z) + w / 2;
                const sy = (star.y - h / 2) * (h / star.z) + h / 2;
                const size = (1 - star.z / Math.max(w, 1)) * 2;
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

    // GSAP speed tween (cleaned up)
    useEffect(() => {
        const tween = gsap.to(speedRef.current, { value: hovered ? warpSpeed : baseSpeed, duration: 1.2, ease: "power4.inOut" });
        return () => tween.kill();
    }, [hovered, warpSpeed, baseSpeed]);

    // Hover jiggle with cleanup
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        let jiggle;
        if (hovered) {
            gsap.to(el, { scale: 0.95, duration: 0.45, ease: "power1.out" });
            jiggle = gsap.to(el, { x: "+=1", y: "-=1", duration: 0.06, repeat: -1, yoyo: true, ease: "sine.inOut" });
        } else {
            gsap.killTweensOf(el);
            gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
        }
        return () => jiggle?.kill();
    }, [hovered]);

    return (
        <div
            className="w-full mx-auto rounded-2xl overflow-hidden text-white
                       border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50
                       max-w-[13rem] sm:max-w-[16rem] md:max-w-[20rem] lg:max-w-xs"
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '2rem 2rem'
            }}
        >
            {/* Top animated HyperCard */}
            <div
                className="relative w-full overflow-hidden group cursor-pointer
                           h-36 sm:h-40 md:h-48 lg:h-50"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

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

                <div className="absolute bottom-0 w-full h-[2px] bg-purple-500/50 blur-sm pointer-events-none"></div>

                <div ref={contentRef} className="relative z-20 flex flex-col items-center justify-center w-full h-full px-3 py-2">
                    <h2 className="text-sm sm:text-base md:text-lg lg:text-lg font-normal text-center text-white leading-tight">
                        {text}{" "}
                        <span className="font-bold ml-1" style={{ color: LastTextColor }}>
                            {LastText}
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 text-center max-w-xs mt-1 px-2">{SubText}</p>
                </div>
            </div>

            {/* Bottom content section */}
            <div className="px-4 sm:px-5 pt-4 pb-5 w-full text-left flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCube} style={{ color: starColor }} className="text-lg sm:text-xl" />
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-extrabold text-white tracking-tight">{title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 max-w-full leading-relaxed">{description}</p>

                <button
                    className="group relative flex items-center justify-center gap-2 px-4 py-2 
                               border-2 border-[#9AE600] rounded-lg 
                               font-semibold text-white overflow-hidden transition-all duration-300
                               w-full sm:w-auto"
                    aria-label={buttonText}
                >
                    <span
                        className="absolute inset-0 h-full w-0 bg-[#4c6d0a] 
                                   transition-all duration-300 ease-in-out group-hover:w-full"
                        style={{ transformOrigin: 'bottom' }}
                        aria-hidden="true"
                    ></span>

                    <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                        {buttonText}
                        <FontAwesomeIcon icon={faChevronRight} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HyperCard;
// ...existing code...