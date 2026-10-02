/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- FloatingOrbsBackground Component (Optimized for Mobile) ---
const FloatingOrbsBackground = ({
    children,
    className,
    containerClassName,
    colors,
    desktopOrbs = 20, // Orbs for desktop
    mobileOrbs = 10,   // Orbs for mobile
}) => {
    const [numberOfOrbs, setNumberOfOrbs] = useState(desktopOrbs);
    const [isMobile, setIsMobile] = useState(false);

    // Screen size check karne ke liye
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileDevice = window.innerWidth < 768;
            setIsMobile(isMobileDevice);
            setNumberOfOrbs(isMobileDevice ? mobileOrbs : desktopOrbs);
        };

        checkScreenSize(); // Pehli baar check karein
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [desktopOrbs, mobileOrbs]);

    const orbColors = colors ?? [
        "#10b981", "#06b6d4", "#6366f1", "#a855f7",
        "#d946ef", "#ec4899", "#f43f5e", "#f97316",
    ];

    return (
        <div
            className={`relative h-[60vh] lg:h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 ${containerClassName}`}
        >
            {/* Orbs Container */}
            <div className="absolute inset-0 z-0 w-full h-full">
                {Array.from({ length: numberOfOrbs }).map((_, index) => {
                    const size = Math.random() * 200 + 100;
                    const duration = Math.random() * 20 + 15;
                    // Mobile ke liye blur kam kar diya hai
                    const blur = isMobile ? '60px' : '80px';

                    return (
                        <motion.div
                            key={index}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: orbColors[index % orbColors.length],
                                filter: `blur(${blur})`,
                                opacity: 0.4,
                                // Performance behtar karne ke liye browser ko hint dena
                                willChange: 'transform, opacity',
                            }}
                            animate={{
                                x: [
                                    // Movement range ko badha diya hai taaki yeh poori screen cover kare
                                    `${Math.random() * 150 - 75}vw`,
                                    `${Math.random() * 150 - 75}vw`,
                                    `${Math.random() * 150 - 75}vw`,
                                ],
                                y: [
                                    // Movement range ko badha diya hai taaki yeh poori screen cover kare
                                    `${Math.random() * 150 - 75}vh`,
                                    `${Math.random() * 150 - 75}vh`,
                                    `${Math.random() * 150 - 75}vh`,
                                ],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                repeatType: 'mirror',
                            }}
                        />
                    );
                })}
            </div>

            <div className={`relative z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
};


export default FloatingOrbsBackground;