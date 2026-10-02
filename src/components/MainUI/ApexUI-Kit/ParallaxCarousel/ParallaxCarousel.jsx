import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SWIPE_THRESHOLD = 50;
const NAV_COOLDOWN_MS = 450;

const getOffset = (index, active, length) => {
    let offset = index - active;
    if (offset > length / 2) offset -= length;
    else if (offset < -length / 2) offset += length;
    return offset;
};

const CarouselCard = ({ slide, isCenter }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // Springs make the tilt follow the pointer smoothly instead of jumping.
    const sx = useSpring(x, { stiffness: 200, damping: 22 });
    const sy = useSpring(y, { stiffness: 200, damping: 22 });
    const rotateX = useTransform(sy, [-200, 200], [12, -12]);
    const rotateY = useTransform(sx, [-200, 200], [-12, 12]);

    useEffect(() => {
        if (!isCenter) {
            x.set(0);
            y.set(0);
        }
    }, [isCenter, x, y]);

    const handleMove = (event) => {
        if (!cardRef.current || !isCenter || event.pointerType === 'touch') return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className="relative w-full h-full bg-slate-900 rounded-2xl group"
            style={{ transformStyle: 'preserve-3d', transformPerspective: 1500, rotateX, rotateY }}
            onPointerMove={handleMove}
            onPointerLeave={reset}
        >
            <div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                <img src={slide.imageUrl} alt={slide.title} draggable="false" className="w-full h-full object-cover group-hover:opacity-30 transition-opacity duration-500 ease-out rounded-2xl" />
                {slide.pngUrl && (
                    <img src={slide.pngUrl} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 w-full h-full object-cover group-hover:translate-z-15 transition-transform duration-500 ease-out rounded-2xl" />
                )}
            </div>
            <div className="relative flex flex-col justify-end h-full text-white p-8" style={{ transformStyle: 'preserve-3d' }}>
                <h2 className="text-3xl font-bold group-hover:translate-z-18 transition-transform duration-500 ease-out">{slide.title}</h2>
                <p className="text-lime-400 mt-1 group-hover:translate-z-18 transition-transform duration-500 ease-out">{slide.subtitle}</p>
                <p className="text-slate-300 mt-4 text-sm leading-relaxed group-hover:translate-z-18 transition-transform duration-500 ease-out">{slide.text}</p>
            </div>
        </motion.div>
    );
};

const ParallaxCarousel = ({ slides = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const lastNav = useRef(0);
    const count = slides.length;

    const paginate = useCallback((dir) => {
        const now = Date.now();
        if (!count || now - lastNav.current < NAV_COOLDOWN_MS) return;
        lastNav.current = now;
        setActiveIndex((i) => (i + dir + count) % count);
    }, [count]);

    if (!count) return null;

    return (
        <div
            className="relative w-full flex flex-col items-center px-2 overflow-x-clip outline-none"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') paginate(1);
                if (e.key === 'ArrowLeft') paginate(-1);
            }}
        >
            <motion.div
                className="relative w-full h-[480px] touch-pan-y"
                style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                onPanEnd={(_, info) => {
                    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
                    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
                }}
            >
                {slides.map((slide, index) => {
                    const offset = getOffset(index, activeIndex, count);
                    const distance = Math.abs(offset);
                    const isVisible = distance <= 2;

                    return (
                        <motion.div
                            key={slide.id ?? slide.title ?? index}
                            className="absolute top-0 left-0 w-full h-[340px] portrait:h-[480px] md:w-1/2 md:h-[400px] md:top-[50px] md:left-1/4"
                            initial={false}
                            style={{ transformStyle: 'preserve-3d', pointerEvents: offset === 0 ? 'auto' : 'none' }}
                            animate={{
                                x: `${offset * 50}%`,
                                z: -distance * 250,
                                scale: 1 - distance * 0.15,
                                opacity: isVisible ? 1 - distance * 0.45 : 0,
                                zIndex: count - distance,
                            }}
                            transition={{ type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }}
                            aria-hidden={offset !== 0}
                        >
                            <CarouselCard slide={slide} isCenter={offset === 0} />
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.button type="button" aria-label="Previous slide" onClick={() => paginate(-1)} className="absolute left-1 lg:left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur text-slate-300 hover:text-lime-400 transition-colors" whileTap={{ scale: 0.9 }}>
                <ArrowLeft size={28} />
            </motion.button>
            <motion.button type="button" aria-label="Next slide" onClick={() => paginate(1)} className="absolute right-1 lg:right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur text-slate-300 hover:text-lime-400 transition-colors" whileTap={{ scale: 0.9 }}>
                <ArrowRight size={28} />
            </motion.button>
        </div>
    );
};

export default ParallaxCarousel;
