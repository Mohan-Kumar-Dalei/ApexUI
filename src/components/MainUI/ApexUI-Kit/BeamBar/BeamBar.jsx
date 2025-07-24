/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BeamBar = ({
    fromColor = "#a855f7",
    viaColor = "#38bdf8",
    toColor = "#06b6d4",
    barWidth = 320,
    barHeight = 8,
    duration = 1.2,
    pulseDuration = 2.5 // slower pulse
}) => {
    const controls = useAnimation();
    const [pulse, setPulse] = useState(false);
    const [beamOpacity, setBeamOpacity] = useState(0.1);

    useEffect(() => {
        controls.start({
            width: barWidth,
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
    }, [barWidth, duration, controls]);

    return (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
            <motion.div
                initial={{ width: 0 }}
                animate={controls}
                className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-md shadow-[0_0_10px_#fff,0_0_20px_#4f46e5,0_0_30px_#06b6d4] hidden md:block ${pulse ? 'animate-pulse' : ''}`}
                style={{
                    height: barHeight,
                    background: `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`,
                    animationDuration: pulse ? `${pulseDuration}s` : undefined,
                }}
            >
                {/* Beam from Bar using pseudo-element */}
                <div
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[400px] h-[800px] pointer-events-none z-0"
                    style={{
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
