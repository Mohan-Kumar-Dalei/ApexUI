import React, { useState } from "react";

// Modern dark card with glitter wavy text reveal on hover
const HoverTextReveal = ({ text = "Glitter Weavey Reveal!" }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative w-full h-40 rounded-2xl bg-[#18181b] shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group border border-gray-800 transition-all duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ minHeight: 160 }}
        >
            {/* Glitter Overlay */}
            <div
                className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"
                    }`}
            >
                <svg width="100%" height="100%" viewBox="0 0 400 160" className="w-full h-full">
                    <defs>
                        <linearGradient id="glitterGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
                        </linearGradient>
                        <filter id="glitter" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="turb" seed="7" />
                            <feDisplacementMap in2="turb" in="SourceGraphic" scale="12" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                    <rect x="0" y="0" width="400" height="160" fill="url(#glitterGradient)" filter="url(#glitter)" />
                </svg>
            </div>
            {/* Wavy Blur Text */}
            <span
                className={`relative z-20 text-2xl sm:text-3xl font-bold tracking-wide select-none transition-all duration-700 ${hovered
                        ? "text-white drop-shadow-[0_2px_16px_#a855f7]"
                        : "text-gray-400 blur-sm"
                    }`}
                style={{
                    display: "inline-block",
                    animation: hovered
                        ? "wavy-glitter 1.2s cubic-bezier(.4,0,.2,1) forwards"
                        : "none",
                }}
            >
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            transition: "transform 0.5s, filter 0.5s, color 0.5s",
                            transform: hovered
                                ? `translateY(${Math.sin(i / 2) * 6}px)`
                                : "translateY(0)",
                            filter: hovered ? "blur(0px)" : "blur(6px)",
                            color: hovered ? "#fff" : "#a3a3a3",
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </span>
            <style>{`
        @keyframes wavy-glitter {
          0% { filter: blur(8px); opacity: 0.2; }
          40% { filter: blur(2px); opacity: 0.7; }
          100% { filter: blur(0px); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default HoverTextReveal;
