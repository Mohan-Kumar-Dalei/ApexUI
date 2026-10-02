import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_COLORS = [
    "#10b981", "#06b6d4", "#6366f1", "#a855f7",
    "#d946ef", "#ec4899", "#f43f5e", "#f97316",
];

const rand = (min, max) => Math.random() * (max - min) + min;

const FloatingOrbsBackground = ({
    children,
    className = "",
    containerClassName = "",
    colors,
    desktopOrbs = 20,
    mobileOrbs = 10,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const numberOfOrbs = isMobile ? mobileOrbs : desktopOrbs;

    // Each orb gets its path once; re-renders no longer re-randomise (and jump) them.
    const orbs = useMemo(
        () => Array.from({ length: numberOfOrbs }, () => ({
            size: rand(100, 300),
            left: `${rand(0, 100)}%`,
            top: `${rand(0, 100)}%`,
            duration: rand(18, 34),
            x: [0, rand(-30, 30), rand(-30, 30)].map((v) => `${v}vw`),
            y: [0, rand(-25, 25), rand(-25, 25)].map((v) => `${v}vh`),
        })),
        [numberOfOrbs]
    );

    const orbColors = colors?.length ? colors : DEFAULT_COLORS;
    const blur = isMobile ? 60 : 80;

    return (
        <div className={`relative h-[60vh] lg:h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 ${containerClassName}`}>
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
                {orbs.map((orb, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full"
                        style={{
                            width: orb.size,
                            height: orb.size,
                            left: orb.left,
                            top: orb.top,
                            marginLeft: -orb.size / 2,
                            marginTop: -orb.size / 2,
                            backgroundColor: orbColors[index % orbColors.length],
                            filter: `blur(${blur}px)`,
                            opacity: 0.4,
                            willChange: 'transform',
                        }}
                        animate={{ x: orb.x, y: orb.y, scale: [1, 1.2, 1] }}
                        transition={{
                            duration: orb.duration,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            <div className={`relative z-10 ${className}`}>{children}</div>
        </div>
    );
};

export default FloatingOrbsBackground;
