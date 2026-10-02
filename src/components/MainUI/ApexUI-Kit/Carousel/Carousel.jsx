import React, { useState } from 'react';

// To use Framer Motion in this environment, we'll import it from a CDN.
// In a local project, you would typically use: `npm install framer-motion`
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// --- Custom Parallax Carousel Component ---
const ParallaxCarousel = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };


    return (
        <div className="w-full flex flex-col items-center px-2">
            {/* 3D Carousel Container without drag/grab */}
            <motion.div
                className="relative w-full h-[440px] portrait:h-[480px] mb-8"
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
                            className={`absolute w-full h-[440px] portrait:w-full portrait:h-[480px] top-0 left-0 portrait:left-0 portrait:top-0 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 md:w-[50%] md:h-[450px] md:top-[50px] md:left-[25%]`}
                            initial={false}
                            animate={{
                                translateX: `${positionOffset * 50}%`,
                                translateZ: -Math.abs(positionOffset) * 250,
                                scale: 1 - Math.abs(positionOffset) * 0.15,
                                opacity: isVisible ? (1 - Math.abs(positionOffset) * 0.35) : 0,
                                zIndex: slides.length - Math.abs(positionOffset),
                            }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Slide Content */}
                            <div className="absolute inset-0 w-full h-full">
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-50 pointer-events-none"
                                />
                            </div>
                            <div
                                className="relative z-10 flex flex-col justify-end h-full p-8 text-white"
                                style={{ transform: 'translateZ(60px)' }} // Content ko 3D space mein aage rakhta hai
                            >
                                <h2 className="text-3xl font-bold">{slide.title}</h2>
                                <p className="text-lime-400 mt-1">{slide.subtitle}</p>
                                <p className="text-slate-300 mt-4 text-sm leading-relaxed">{slide.text}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Navigation Buttons at the bottom */}
            <div className="flex items-center justify-center gap-4 mt-10">
                <motion.button
                    onClick={handlePrev}
                    className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors text-slate-400 hover:text-lime-400"
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowLeft size={24} />
                </motion.button>
                <motion.button
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

export default ParallaxCarousel;