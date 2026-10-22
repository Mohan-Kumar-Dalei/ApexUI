import React from "react";

/*
 * Aurora Background: soft northern-light bands that drift and shimmer, built
 * from blurred CSS gradients only (no canvas, no WebGL). Works on light and
 * dark pages; reduced-motion visitors get the same picture without movement.
 */

const AuroraBackground = ({
    children,
    colors = ["#22d3ee", "#a3e635", "#a78bfa", "#38bdf8"],
    theme = "dark",
    speed = 1,
    intensity = 1,
    className = "",
    containerClassName = "",
}) => {
    const dark = theme !== "light";
    const stops = colors.map((c, i) => `${c} ${Math.round((i / colors.length) * 100)}%`).join(", ");
    const duration = `${60 / Math.max(0.1, speed)}s`;

    return (
        <div className={`relative h-screen w-full overflow-hidden ${dark ? "bg-[#05060a]" : "bg-[#f8fafc]"} ${containerClassName}`}>
            <style>{`
                @keyframes apex-aurora { from { background-position: 50% 50%, 50% 50%; } to { background-position: 350% 50%, 350% 50%; } }
                @media (prefers-reduced-motion: reduce) { .apex-aurora, .apex-aurora::after { animation: none !important; } }
            `}</style>
            <div
                aria-hidden="true"
                className="apex-aurora pointer-events-none absolute -inset-[10px] will-change-transform after:absolute after:inset-0 after:content-['']"
                style={{
                    opacity: Math.min(1, (dark ? 0.9 : 0.75) * intensity),
                    filter: `blur(${dark ? 12 : 10}px) ${dark ? "" : "invert(0)"}`,
                    backgroundImage: `repeating-linear-gradient(100deg, ${dark ? "#000" : "#fff"} 0%, ${dark ? "#000" : "#fff"} 7%, transparent 10%, transparent 12%, ${dark ? "#000" : "#fff"} 16%), repeating-linear-gradient(100deg, ${stops}, ${colors[0]} 100%)`,
                    backgroundSize: "300%, 200%",
                    backgroundPosition: "50% 50%, 50% 50%",
                    maskImage: "radial-gradient(ellipse 120% 95% at 70% 0%, black 25%, transparent 78%)",
                    WebkitMaskImage: "radial-gradient(ellipse 120% 95% at 70% 0%, black 25%, transparent 78%)",
                    animation: `apex-aurora ${duration} linear infinite`,
                    mixBlendMode: dark ? "normal" : "multiply",
                }}
            />
            {children && <div className={`relative z-10 h-full w-full ${className}`}>{children}</div>}
        </div>
    );
};

export default AuroraBackground;
