import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const textVariants = {
    enter: (dir) => ({ opacity: 0, y: dir * 16, filter: "blur(6px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (dir) => ({ opacity: 0, y: dir * -16, filter: "blur(6px)" }),
};

const Testimonials = ({ testimonials = [] }) => {
    const [[activeIndex, direction], setState] = useState([0, 1]);
    const count = testimonials.length;

    const paginate = useCallback((dir) => {
        if (!count) return;
        setState(([i]) => [(i + dir + count) % count, dir]);
    }, [count]);

    if (!count) return null;
    const current = testimonials[activeIndex % count];

    return (
        <div
            className="w-full max-w-4xl mx-auto bg-slate-950 rounded-2xl p-8 md:p-12 border border-slate-800 grid md:grid-cols-2 gap-12 items-center overflow-hidden outline-none"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') paginate(1);
                if (e.key === 'ArrowLeft') paginate(-1);
            }}
        >
            <div className="flex flex-col justify-center h-full text-center md:text-left order-2 md:order-1">
                {/* Grid stacking keeps the height stable for any quote length. */}
                <div className="grid min-h-40">
                    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            variants={textVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="[grid-area:1/1]"
                        >
                            <h2 className="text-3xl font-bold text-white tracking-tight">{current.author}</h2>
                            <p className="mt-2 text-lime-400 font-medium">{current.title}</p>
                            <p className="mt-4 text-slate-400 text-sm leading-relaxed">&ldquo;{current.text}&rdquo;</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                    {[[-1, ArrowLeft, 'Previous'], [1, ArrowRight, 'Next']].map(([dir, Icon, label]) => (
                        <motion.button
                            key={label}
                            type="button"
                            aria-label={`${label} testimonial`}
                            onClick={() => paginate(dir)}
                            className="bg-slate-800/80 hover:bg-slate-800 rounded-full p-3 transition-colors duration-300 text-slate-400 hover:text-lime-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <Icon size={20} />
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="relative h-80 w-full flex items-center justify-center order-1 md:order-2">
                {testimonials.map((testimonial, index) => {
                    const position = (index - activeIndex + count) % count;
                    if (position > 3) return null;

                    return (
                        <motion.div
                            key={testimonial.id ?? index}
                            className="absolute w-64 h-80 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700 will-change-transform"
                            initial={false}
                            animate={{
                                // transforms instead of left/top keep the motion on the GPU
                                x: position * 20,
                                y: position * 10,
                                scale: 1 - position * 0.08,
                                rotate: -4 + position * 4,
                                zIndex: count - position,
                                opacity: position === 0 ? 1 : 0.5,
                            }}
                            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.author}
                                draggable="false"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://placehold.co/256x320/0f172a/a3e635?text=${encodeURIComponent(testimonial.author?.split(' ')[0] ?? '')}`;
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Testimonials;
