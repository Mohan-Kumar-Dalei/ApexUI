/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from 'lucide-react';


// --- Testimonials Component ---
const Testimonials = ({ testimonials }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    // Animation variants for the text content
    const textVariants = {
        enter: { opacity: 0, y: 20, filter: "blur(5px)" },
        center: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -20, filter: "blur(5px)" },
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-950 rounded-2xl p-8 md:p-12 border border-slate-800 grid md:grid-cols-2 gap-12 items-center overflow-hidden">

            {/* Left Part: Text Content and Navigation */}
            <div className="flex flex-col justify-center h-full text-center md:text-left order-2 md:order-1">
                {/* Title and Subtitle with Animation */}
                <div className="relative h-32">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={activeIndex}
                            variants={textVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute w-full"
                        >
                            <h2 className="text-3xl font-bold text-white tracking-tight">{testimonials[activeIndex].author}</h2>
                            <p className="mt-2 text-lime-400 font-medium">{testimonials[activeIndex].title}</p>
                            <p className="mt-4 text-slate-400 text-sm leading-relaxed hidden md:block">"{testimonials[activeIndex].text}"</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons with Microinteractions */}
                <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                    <motion.button
                        onClick={handlePrev}
                        className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors duration-300 text-slate-400 hover:text-lime-400 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <motion.button
                        onClick={handleNext}
                        className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors duration-300 text-slate-400 hover:text-lime-400 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <ArrowRight size={20} />
                    </motion.button>
                </div>
            </div>

            {/* Right Part: Stacked Images */}
            <div className="relative h-80 w-full flex items-center justify-center order-1 md:order-2">
                {testimonials.map((testimonial, index) => {
                    // Determine the position of the card in the stack
                    const position = (index - activeIndex + testimonials.length) % testimonials.length;

                    // Only render the top 4 cards for performance and visual clarity
                    if (position > 3) return null;

                    return (
                        <motion.div
                            key={testimonial.id || index}
                            className="absolute w-64 h-80 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700"
                            initial={false}
                            animate={{
                                scale: 1 - position * 0.08,
                                rotate: -4 + position * 4, // Add a fanned rotation effect
                                left: `${position * 20}px`, // Fan out horizontally
                                top: `${position * 10}px`, // Stagger vertically
                                zIndex: testimonials.length - position,
                                opacity: position === 0 ? 1 : 0.5, // Only top image is fully opaque
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 25,
                            }}
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.author}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/256x320/0f172a/a3e635?text=${testimonial.author.split(' ')[0]}`; }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};



export default Testimonials;