import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from 'lucide-react';


// --- Testimonials Component ---
const Testimonials = ({ testimonials }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // The layout follows the card's own width (not the screen), so it also
    // fits sidebars, preview frames and narrow columns.
    const root = useRef(null);
    const [size, setSize] = useState("lg");

    useLayoutEffect(() => {
        const el = root.current;
        if (!el) return undefined;
        const ro = new ResizeObserver(() => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const w = el.clientWidth / rem;
            setSize(w < 26 ? "sm" : w < 44 ? "md" : "lg");
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const wide = size === "lg";
    const small = size === "sm";

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
        <div ref={root} className={`w-full max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 grid items-center overflow-hidden ${wide ? "grid-cols-2 gap-12 p-12" : small ? "gap-6 p-5" : "gap-8 p-8"}`}>

            {/* Left Part: Text Content and Navigation */}
            <div className={`flex flex-col justify-center h-full ${wide ? "text-left order-1" : "text-center order-2"}`}>
                {/* Title, subtitle and quote with animation; the min height keeps the buttons from jumping. */}
                <div className={`relative ${small ? "min-h-[15rem]" : "min-h-[12rem]"}`}>
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={activeIndex}
                            variants={textVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <h2 className={`${small ? "text-2xl" : "text-3xl"} font-bold text-white tracking-tight`}>{testimonials[activeIndex].author}</h2>
                            <p className="mt-2 text-lime-400 font-medium">{testimonials[activeIndex].title}</p>
                            <p className="mt-4 text-slate-400 text-sm leading-relaxed">"{testimonials[activeIndex].text}"</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons with Microinteractions */}
                <div className={`flex items-center gap-4 ${wide ? "justify-start mt-8" : "justify-center mt-5"}`}>
                    <motion.button
                        onClick={handlePrev}
                        aria-label="Previous testimonial"
                        className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors duration-300 text-slate-400 hover:text-lime-400 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <motion.button
                        onClick={handleNext}
                        aria-label="Next testimonial"
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
            <div className={`flex w-full items-center justify-center ${wide ? "order-2" : "order-1"}`}>
                {/* Sized to the card plus the fan, so the stack stays centred and inside the panel. */}
                <div className={`relative ${small ? "h-[calc(14rem+30px)] w-[calc(10.5rem+60px)]" : "h-[calc(20rem+30px)] w-[calc(16rem+60px)]"}`}>
                {testimonials.map((testimonial, index) => {
                    // Determine the position of the card in the stack
                    const position = (index - activeIndex + testimonials.length) % testimonials.length;

                    // Only render the top 4 cards for performance and visual clarity
                    if (position > 3) return null;

                    return (
                        <motion.div
                            key={testimonial.id || index}
                            className={`absolute ${small ? "w-[10.5rem] h-56" : "w-64 h-80"} bg-slate-800 rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700`}
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
        </div>
    );
};



export default Testimonials;
