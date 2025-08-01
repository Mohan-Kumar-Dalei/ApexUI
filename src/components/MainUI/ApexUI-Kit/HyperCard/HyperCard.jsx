import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import {
    faCube,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HyperCard = ({
    text = "Introducing Hyper Card",
    LastText = "Effect",
    LastTextColor = "purple",
    SubText = "Fully animated lightning effect card with customizable props, built with Apex UI.",
    starColor = "#9f7aea",
    starCount = 250,
    glow = true,
    baseSpeed = 0.5,
    warpSpeed = 8.5,
    circlePosition = "bottom",
    title = "Apex UI Hyper Card",
    description = "Experience futuristic animations with customizable props like glow, beam, star count, and hover interactions.",
    buttonText = "Get Started",
}) => {
    const canvasRef = useRef(null);
    const contentRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const stars = useRef([]);
    const speedRef = useRef({ value: baseSpeed });

    // 🎇 Particle logic
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
                    x: Math.random() * w,
                    y: Math.random() * h,
                    z,
                    baseZ: z,
                    brightness: Math.random() * 0.5 + 0.5,
                };
            });
        };

        const draw = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, w, h);
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
                    const dx = sx - w / 2;
                    const dy = sy - h / 2;
                    const mag = Math.sqrt(dx * dx + dy * dy) || 1;

                    ctx.moveTo(sx, sy);
                    ctx.lineTo(
                        sx + (dx / mag) * tailLength,
                        sy + (dy / mag) * tailLength
                    );

                    ctx.strokeStyle = starColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = 1;
            });

            animationFrame = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener("resize", init);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", init);
        };
    }, [starColor, starCount, baseSpeed]);

    useEffect(() => {
        gsap.to(speedRef.current, {
            value: hovered ? warpSpeed : baseSpeed,
            duration: 1.5,
            ease: "power4.inOut",
        });
    }, [hovered]);

    useEffect(() => {
        const el = contentRef.current;
        if (hovered) {
            gsap.to(el, { scale: 0.95, duration: 0.5, ease: "power1.out" });
            gsap.to(el, {
                x: "+=1",
                y: "-=1",
                duration: 0.05,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        } else {
            gsap.killTweensOf(el);
            gsap.to(el, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });
        }
    }, [hovered]);

    return (
        <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black text-white">
            {/* Top animated HyperCard */}
            <div
                className="relative w-full h-60 overflow-hidden group cursor-pointer border-b border-white/10"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

                {glow && (
                    <div
                        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                        style={{
                            mixBlendMode: "screen",
                            opacity: 0.5,
                            background: `radial-gradient(circle at ${circlePosition}, ${starColor} 0%, transparent 70%)`,
                        }}
                    />
                )}

                <div
                    ref={contentRef}
                    className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 py-2"
                >
                    <h2 className="text-lg sm:text-xl font-normal text-center text-white">
                        {text}
                        <span className={`font-bold text-${LastTextColor}-400 ml-1`}>
                            {LastText}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-300 text-center max-w-sm mt-1">
                        {SubText}
                    </p>
                </div>
            </div>

            {/* Bottom content section */}
            <div className="px-6 pt-4 pb-7 w-full text-left flex flex-col items-start">
                <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faCube} className="text-purple-400 text-2xl" />
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{title}</h3>
                </div>
                <p className="text-gray-400 text-base mb-5 max-w-xs leading-relaxed">
                    {description}
                </p>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition font-semibold shadow-lg mt-2 focus:outline-none group">
                    {buttonText}
                    <span className="inline-block transition-transform duration-300 will-change-transform group-hover:translate-x-2">
                        <FontAwesomeIcon icon={faChevronDown} className="text-white/80 rotate-[-90deg]" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HyperCard;
