import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const BeamBar = ({
    fromColor = "#a855f7",
    viaColor = "#38bdf8",
    toColor = "#06b6d4",
    barWidth: maxBarWidth = 320,
    barHeight = 8,
    duration = 1.2,
    pulseDuration = 2.5,
    fixed = true, // pin to the top of the viewport; pass false to place it inside a relative parent
}) => {
    const wrapperRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [expanded, setExpanded] = useState(false);

    // Size from the space actually available (the parent when not fixed).
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return undefined;
        const update = () => {
            const available = fixed ? window.innerWidth : el.clientWidth || window.innerWidth;
            setWidth(Math.min(available * 0.8, maxBarWidth));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(fixed ? document.documentElement : el);
        return () => ro.disconnect();
    }, [maxBarWidth, fixed]);

    const beamWidth = width * 1.25;

    return (
        <div
            ref={wrapperRef}
            className={`${fixed ? 'fixed top-10' : 'absolute top-0'} left-0 w-full flex justify-center z-50 pointer-events-none`}
        >
            <motion.div
                initial={{ width: 0 }}
                animate={width ? { width } : undefined}
                transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
                onAnimationComplete={() => setExpanded(true)}
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-md shadow-[0_0_10px_#fff,0_0_20px_#4f46e5,0_0_30px_#06b6d4]"
                style={{
                    height: barHeight,
                    background: `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`,
                }}
            >
                <motion.div
                    className="absolute inset-0 rounded-md bg-white mix-blend-overlay"
                    animate={expanded ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
                    transition={expanded ? { duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' } : undefined}
                />
                {/* Light cone below the bar */}
                <motion.div
                    className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                    style={{
                        width: beamWidth,
                        height: 800,
                        background: 'linear-gradient(to bottom, rgba(111, 93, 245, 0.7), rgba(7, 7, 7, 0.3), transparent)',
                        filter: 'blur(100px)',
                    }}
                    initial={{ opacity: 0.2 }}
                    animate={expanded ? { opacity: [0.75, 1, 0.75] } : { opacity: 1 }}
                    transition={expanded ? { duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' } : { duration, ease: 'easeOut' }}
                />
            </motion.div>
        </div>
    );
};

export default BeamBar;
