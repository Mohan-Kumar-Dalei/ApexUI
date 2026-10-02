import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SWIPE_THRESHOLD = 50;

// Shortest signed distance between a slide and the active one, so the
// carousel wraps around in both directions.
const getOffset = (index, active, length) => {
    let offset = index - active;
    if (offset > length / 2) offset -= length;
    else if (offset < -length / 2) offset += length;
    return offset;
};

const Carousel = ({ slides = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const count = slides.length;

    const handleNext = useCallback(() => {
        if (count) setActiveIndex((i) => (i + 1) % count);
    }, [count]);
    const handlePrev = useCallback(() => {
        if (count) setActiveIndex((i) => (i - 1 + count) % count);
    }, [count]);

    useEffect(() => {
        if (activeIndex >= count) setActiveIndex(0);
    }, [count, activeIndex]);

    const onKeyDown = (e) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    };

    if (!count) return null;

    return (
        <div
            className="w-full flex flex-col items-center px-2 overflow-x-clip outline-none"
            tabIndex={0}
            onKeyDown={onKeyDown}
            role="region"
            aria-roledescription="carousel"
        >
            <motion.div
                className="relative w-full h-[440px] portrait:h-[480px] mb-8 touch-pan-y"
                style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                onPanEnd={(_, info) => {
                    if (info.offset.x < -SWIPE_THRESHOLD) handleNext();
                    else if (info.offset.x > SWIPE_THRESHOLD) handlePrev();
                }}
            >
                {slides.map((slide, index) => {
                    const offset = getOffset(index, activeIndex, count);
                    const distance = Math.abs(offset);
                    const isVisible = distance <= 2;

                    return (
                        <motion.div
                            key={slide.id ?? slide.title ?? index}
                            className="absolute w-full h-[440px] top-0 left-0 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 md:w-1/2 md:h-[450px] md:top-[50px] md:left-1/4 select-none"
                            initial={false}
                            animate={{
                                x: `${offset * 50}%`,
                                z: -distance * 250,
                                scale: 1 - distance * 0.15,
                                opacity: isVisible ? 1 - distance * 0.35 : 0,
                                zIndex: count - distance,
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 30, mass: 0.9 }}
                            style={{ transformStyle: 'preserve-3d', pointerEvents: offset === 0 ? 'auto' : 'none' }}
                            aria-hidden={offset !== 0}
                        >
                            <div className="absolute inset-0 w-full h-full">
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    draggable="false"
                                    className="w-full h-full object-cover opacity-50 pointer-events-none"
                                />
                            </div>
                            <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white" style={{ transform: 'translateZ(60px)' }}>
                                <h2 className="text-3xl font-bold">{slide.title}</h2>
                                <p className="text-lime-400 mt-1">{slide.subtitle}</p>
                                <p className="text-slate-300 mt-4 text-sm leading-relaxed">{slide.text}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="flex items-center justify-center gap-4 mt-10">
                <motion.button
                    type="button"
                    aria-label="Previous slide"
                    onClick={handlePrev}
                    className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors text-slate-400 hover:text-lime-400"
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowLeft size={24} />
                </motion.button>
                <motion.button
                    type="button"
                    aria-label="Next slide"
                    onClick={handleNext}
                    className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors text-slate-400 hover:text-lime-400"
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowRight size={24} />
                </motion.button>
            </div>
        </div>
    );
};

export default Carousel;
