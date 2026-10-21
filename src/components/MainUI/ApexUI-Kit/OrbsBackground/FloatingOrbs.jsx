/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

// --- FloatingOrbsBackground Component (Optimized for Mobile) ---
// Orbs start together in the centre and drift outwards inside the container, then glide back.
const FloatingOrbsBackground = ({
    children,
    className,
    containerClassName,
    colors,
    desktopOrbs = 20, // Orbs for desktop
    mobileOrbs = 10,   // Orbs for mobile
}) => {
    const boxRef = useRef(null);
    const [box, setBox] = useState({ w: 0, h: 0 });
    const isMobile = box.w > 0 && box.w < 768;
    const numberOfOrbs = isMobile ? mobileOrbs : desktopOrbs;

    // Measure the container so the orbs roam inside it (not the whole window).
    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const measure = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const orbColors = colors ?? [
        "#10b981", "#06b6d4", "#6366f1", "#a855f7",
        "#d946ef", "#ec4899", "#f43f5e", "#f97316",
    ];

    // Random paths are picked once per size change, so re-renders don't make the orbs jump.
    const orbs = useMemo(() => {
        const rangeX = box.w * 0.42;
        const rangeY = box.h * 0.38;
        const rand = (range) => Math.round((Math.random() * 2 - 1) * range);
        return Array.from({ length: numberOfOrbs }, () => ({
            size: Math.random() * 160 + (isMobile ? 90 : 130),
            duration: Math.random() * 14 + 12,
            x: [0, rand(rangeX), rand(rangeX), rand(rangeX)],
            y: [0, rand(rangeY), rand(rangeY), rand(rangeY)],
        }));
    }, [numberOfOrbs, box.w, box.h, isMobile]);

    return (
        <div
            ref={boxRef}
            className={`relative h-[60vh] lg:h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 ${containerClassName}`}
        >
            {/* Orbs Container */}
            <div className="absolute inset-0 z-0 w-full h-full">
                {box.w > 0 && orbs.map((orb, index) => (
                    <motion.div
                        key={index}
                        className="absolute left-1/2 top-1/2 rounded-full"
                        style={{
                            width: orb.size,
                            height: orb.size,
                            marginLeft: -orb.size / 2,
                            marginTop: -orb.size / 2,
                            backgroundColor: orbColors[index % orbColors.length],
                            filter: `blur(${isMobile ? 45 : 60}px)`,
                            mixBlendMode: 'screen',
                            // Performance behtar karne ke liye browser ko hint dena
                            willChange: 'transform, opacity',
                        }}
                        initial={{ x: 0, y: 0, scale: 0.6, opacity: 0 }}
                        animate={{
                            x: orb.x,
                            y: orb.y,
                            scale: [0.8, 1.15, 0.95, 1.1],
                            opacity: [0.85, 0.7, 0.8, 0.7],
                        }}
                        transition={{
                            duration: orb.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            repeatType: 'mirror',
                        }}
                    />
                ))}
            </div>

            <div className={`relative z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
};


export default FloatingOrbsBackground;