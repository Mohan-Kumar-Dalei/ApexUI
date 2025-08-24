/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BeamBar = ({
    fromColor = "#a855f7",
    viaColor = "#38bdf8",
    toColor = "#06b6d4",
    barWidth: maxBarWidth = 320, // Prop ko maxBarWidth ki tarah use karenge
    barHeight = 8,
    duration = 1.2,
    pulseDuration = 2.5
}) => {
    const controls = useAnimation();
    const [pulse, setPulse] = useState(false);
    const [beamOpacity, setBeamOpacity] = useState(0.1);

    // Responsive width ke liye state
    const [dynamicBarWidth, setDynamicBarWidth] = useState(0);

    // Screen size change ko handle karne ke liye useEffect
    useEffect(() => {
        const updateWidth = () => {
            // Screen width ka 80% ya maxBarWidth, jo bhi kam ho
            const newWidth = Math.min(window.innerWidth * 0.8, maxBarWidth);
            setDynamicBarWidth(newWidth);
        };

        updateWidth(); // Pehli baar set karne ke liye
        window.addEventListener('resize', updateWidth); // Resize par update karne ke liye

        // Cleanup function
        return () => window.removeEventListener('resize', updateWidth);
    }, [maxBarWidth]);

    useEffect(() => {
        // Jab dynamicBarWidth set ho jaye tab animation start karein
        if (dynamicBarWidth > 0) {
            controls.start({
                width: dynamicBarWidth,
                transition: { duration, ease: "easeInOut" }
            });

            // Animate beam opacity gradually during width expansion
            let start = null;
            function animateBeam(ts) {
                if (!start) start = ts;
                const elapsed = (ts - start) / 1000;
                const progress = Math.min(elapsed / duration, 1);
                setBeamOpacity(0.2 + 0.8 * progress); // from 0.2 to 1.0
                if (progress < 1) {
                    requestAnimationFrame(animateBeam);
                } else {
                    setPulse(true);
                }
            }
            requestAnimationFrame(animateBeam);

            // Cleanup
            return () => {
                setBeamOpacity(0.2);
                setPulse(false);
            };
        }
    }, [dynamicBarWidth, duration, controls]);

    // Beam ka size ab bar ki width par depend karega
    const beamWidth = dynamicBarWidth * 1.25;
    const beamHeight = 800; // Ise bhi dynamic kar sakte hain agar zaroorat ho

    return (
        <div className="fixed top-10 left-0 w-full flex justify-center z-50 pointer-events-none">
            <motion.div
                initial={{ width: 0 }}
                animate={controls}
                // Class se 'hidden md:block' hataya gaya hai
                className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-md shadow-[0_0_10px_#fff,0_0_20px_#4f46e5,0_0_30px_#06b6d4] ${pulse ? 'animate-pulse' : ''}`}
                style={{
                    height: barHeight,
                    background: `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`,
                    animationDuration: pulse ? `${pulseDuration}s` : undefined,
                }}
            >
                {/* Beam from Bar using pseudo-element */}
                <div
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none z-0"
                    style={{
                        width: `${beamWidth}px`, // Dynamic width
                        height: `${beamHeight}px`, // Dynamic height (optional)
                        background: `linear-gradient(to bottom, rgba(111, 93, 245, 0.7), rgba(7, 7, 7, 0.3), transparent)`,
                        filter: "blur(100px)",
                        opacity: beamOpacity,
                        animation: pulse ? `glow ${pulseDuration}s infinite alternate` : undefined
                    }}
                ></div>
            </motion.div>
        </div>
    );
};

export default BeamBar;