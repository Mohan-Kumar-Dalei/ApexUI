/* eslint-disable no-unused-vars */

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import bgHexa from '/assets/bg-hexa.jpg'
export default function GlareCardDemo() {
    return (
        <GlareCard className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-[#181825] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group group-hover:scale-100 transition-transform duration-300 ease-in-out">
            {/* Background Image */}
            <img
                src={bgHexa}
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none z-0"
                draggable="false"
            />
            <div className="flex items-center justify-center w-20 h-20 rounded-md bg-gradient-to-br from-[#23233a] to-[#181825] border-2 border-[#a855f7]/60 shadow-xl mb-4 z-10 group">
                <span className="text-5xl font-extrabold text-[#a855f7] drop-shadow-[0_2px_12px_#a855f7aa]">A</span>
            </div>
            <p className="text-slate-200 font-extrabold text-2xl mt-2 tracking-wide z-10">ApexUI</p>
        </GlareCard>
    );
}

export function GlareCard({
    children,
    className = "",
    backgroundImage = bgHexa,
    foilSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='26' height='26' fill='white'%3E%3Cpath d='M10 90 L40 10 L60 10 L90 90 L70 90 L62 70 H38 L30 90 Z M45 50 H55 L50 30 Z' fill='white'/%3E%3C/svg%3E")`
}) {
    const refElement = useRef(null);
    // Framer Motion values
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);
    const bgX = useMotionValue(50);
    const bgY = useMotionValue(50);
    const rX = useMotionValue(0);
    const rY = useMotionValue(0);
    // Springs for smoothness
    const springConfig = { stiffness: 120, damping: 18 };
    const sGlareX = useSpring(glareX, springConfig);
    const sGlareY = useSpring(glareY, springConfig);
    const sBgX = useSpring(bgX, springConfig);
    const sBgY = useSpring(bgY, springConfig);
    const sRX = useSpring(rX, springConfig);
    const sRY = useSpring(rY, springConfig);

    // CSS variable template
    const style = {
        "--m-x": useMotionTemplate`${sGlareX}%`,
        "--m-y": useMotionTemplate`${sGlareY}%`,
        "--r-x": useMotionTemplate`${sRX}deg`,
        "--r-y": useMotionTemplate`${sRY}deg`,
        "--bg-x": useMotionTemplate`${sBgX}%`,
        "--bg-y": useMotionTemplate`${sBgY}%`,
        "--duration": "300ms",
        "--foil-size": "100%",
        "--opacity": "0",
        "--radius": "10px",
        "--easing": "ease",
        "--transition": "var(--duration) var(--easing)"
    };
    const backgroundStyle = {
        "--step": "5%",
        "--foil-svg": foilSvg,
        "--pattern": "var(--foil-svg) center/100% no-repeat",
        "--rainbow":
            "repeating-linear-gradient( 0deg,rgb(255,119,115) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
        "--diagonal":
            "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        "--shade":
            "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
        backgroundBlendMode: "hue, hue, hue, overlay",
    };

    return (
        <motion.div
            style={style}
            className="relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-transform w-[320px] [aspect-ratio:17/21]"
            ref={refElement}
            onPointerMove={(event) => {
                const rotateFactor = 0.4;
                const rect = event.currentTarget.getBoundingClientRect();
                const position = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };
                const percentage = {
                    x: (100 / rect.width) * position.x,
                    y: (100 / rect.height) * position.y,
                };
                const delta = {
                    x: percentage.x - 50,
                    y: percentage.y - 50,
                };
                bgX.set(50 + percentage.x / 4 - 12.5);
                bgY.set(50 + percentage.y / 3 - 16.67);
                rX.set(-(delta.x / 3.5) * rotateFactor);
                rY.set(delta.y / 2 * rotateFactor);
                glareX.set(percentage.x);
                glareY.set(percentage.y);
            }}
            onPointerEnter={() => {
                if (refElement.current) {
                    setTimeout(() => {
                        refElement.current?.style.setProperty("--duration", "0s");
                    }, 300);
                }
            }}
            onPointerLeave={() => {
                if (refElement.current) {
                    refElement.current.style.removeProperty("--duration");
                    rX.set(0);
                    rY.set(0);
                }
            }}
        >
            <div
                className="h-full grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] rounded-[var(--radius)] border border-slate-800 hover:[--opacity:0.6] hover:[--duration:200ms] hover:[--easing:linear] hover:filter-none overflow-hidden"
            >
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clip-path:inset(0_0_0_0_round_var(--radius))]">
                    <div className={cn("h-full w-full bg-slate-950", className)}>
                        {/* Background Image Layer (if provided) */}
                        {backgroundImage && (
                            <img
                                src={backgroundImage}
                                alt="bg"
                                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none z-0"
                                draggable="false"
                            />
                        )}
                        {children}
                    </div>
                </div>
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light [clip-path:inset(0_0_1px_0_round_var(--radius))] opacity-[var(--opacity)] transition-opacity transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)]" />
                <div
                    className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-[var(--opacity)] will-change-background transition-opacity [clip-path:inset(0_0_1px_0_round_var(--radius))] [background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] relative after:content-[''] after:grid-area-[inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit] after:bg-[inherit] after:mix-blend-exclusion after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-blend-mode:soft-light,_hue,_hard-light]"
                    style={{ ...backgroundStyle }} />
            </div>
        </motion.div>
    );
}
