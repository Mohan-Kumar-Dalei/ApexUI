/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const CarouselCard = ({ slide, isCenter, isScrolling }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-200, 200], [15, -15]);
    const rotateY = useTransform(x, [-200, 200], [-15, 15]);

    const handleMouseMove = (event) => {
        if (!cardRef.current || !isCenter || isScrolling) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        if (isScrolling) {
            x.set(0);
            y.set(0);
        }
    }, [isScrolling, x, y]);

    return (
        <motion.div
            ref={cardRef}
            className="w-full h-full bg-slate-900 rounded-2xl group"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1500px',
                rotateX: isCenter ? rotateX : 0,
                rotateY: isCenter ? rotateY : 0,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Slide Content */}
            <div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d', perspective: '1500px' }}>
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover group-hover:opacity-30 transition-all duration-300 ease-in-out rounded-2xl" />
                <img src={slide.pngUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover group-hover:translate-z-15 transition-all duration-300 ease-in-out rounded-2xl" />
            </div>
            <div className="relative flex flex-col justify-end h-full text-white p-8" style={{ transformStyle: 'preserve-3d', perspective: '1500px' }}>
                <h2 className="text-3xl font-bold group-hover:translate-z-18 transition-all duration-300 ease-in-out">{slide.title}</h2>
                <p className="text-lime-400 mt-1 group-hover:translate-z-18 transition-all duration-300 ease-in-out">{slide.subtitle}</p>
                <p className="text-slate-300 mt-4 text-sm leading-relaxed group-hover:translate-z-18 transition-all duration-300 ease-in-out">{slide.text}</p>
            </div>
        </motion.div>
    );
};


// --- Custom Parallax Carousel Component ---
const ParallaxCarousel = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const animatingRef = useRef(false);
    const animTimeoutRef = useRef(null);

    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);

    // ✅ REMOVED: isHovered state hata diya gaya hai.

    const NAV_ANIM_MS = 600;
    const handleNext = () => {
        if (animatingRef.current) return;
        animatingRef.current = true;
        clearTimeout(animTimeoutRef.current);
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
        animTimeoutRef.current = setTimeout(() => {
            animatingRef.current = false;
        }, NAV_ANIM_MS);
    };

    const handlePrev = () => {
        if (animatingRef.current) return;
        animatingRef.current = true;
        clearTimeout(animTimeoutRef.current);
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
        animTimeoutRef.current = setTimeout(() => {
            animatingRef.current = false;
        }, NAV_ANIM_MS);
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeoutRef.current);
        };
    }, []);


    return (
        <div className="relative w-full flex flex-col items-center px-2">
            <div
                className="relative w-full h-[480px] portrait:h-[480px] portrait:px-0"
                style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
                {slides.map((slide, index) => {
                    let positionOffset = index - activeIndex;
                    if (positionOffset > slides.length / 2) {
                        positionOffset -= slides.length;
                    } else if (positionOffset < -slides.length / 2) {
                        positionOffset += slides.length;
                    }

                    const isVisible = Math.abs(positionOffset) <= 2;

                    return (
                        <motion.div
                            key={index}
                            className={`absolute w-full h-[340px] portrait:w-full portrait:h-[480px] top-0 left-0 portrait:left-0 portrait:top-0 ${positionOffset === 0 ? '' : ' pointer-events-none'} md:w-[50%] md:h-[400px] md:top-[50px] md:left-1/2 lg:-translate-x-1/2`}
                            initial={false}
                            style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
                            animate={{
                                transform: `translateX(${positionOffset * 50}%) translateZ(${-Math.abs(positionOffset) * 250}px) scale(${1 - Math.abs(positionOffset) * 0.15})`,
                                opacity: isVisible ? (1 - Math.abs(positionOffset) * 0.45) : 0,
                                zIndex: slides.length - Math.abs(positionOffset),
                            }}
                            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                        >
                            <CarouselCard slide={slide} isCenter={positionOffset === 0} isScrolling={isScrolling} />
                        </motion.div>
                    );
                })}
            </div>

            <motion.button onClick={handlePrev} className="absolute -left-10 lg:left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-slate-400 hover:text-lime-400 transition-colors" whileTap={{ scale: 0.9 }}>
                <ArrowLeft size={32} />
            </motion.button>
            <motion.button onClick={handleNext} className="absolute -right-10 lg:right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-slate-400 hover:text-lime-400 transition-colors" whileTap={{ scale: 0.9 }}>
                <ArrowRight size={32} />
            </motion.button>
        </div>
    );
};

export default ParallaxCarousel;