import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Rotating Text: a phrase whose last word swaps on a timer. Each letter of
 * the new word springs up from below while the old one slides out, and the
 * highlight pill resizes smoothly to fit.
 */

const RotatingText = ({ prefix = "Build", words = ["faster", "smarter", "together", "with ApexUI"], interval = 2200, stagger = 0.025, from = "first", accentColor = "#a3e635", textColor = "#0a0a0a", className = "" }) => {
    const [i, setI] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
        return () => clearInterval(id);
    }, [words.length, interval]);

    const word = words[i];
    const chars = Array.from(word);
    const delayFor = (k) => {
        const n = chars.length - 1;
        const order = from === "last" ? n - k : from === "center" ? Math.abs(k - n / 2) : k;
        return order * stagger;
    };

    return (
        <span className={`inline-flex flex-wrap items-center gap-x-[0.3em] font-bold ${className}`}>
            {prefix && <span>{prefix}</span>}
            <motion.span layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative inline-flex overflow-hidden rounded-[0.35em] px-[0.35em] py-[0.08em]" style={{ background: accentColor, color: textColor }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={word} className="inline-flex whitespace-pre" aria-label={word}>
                        {chars.map((c, k) => (
                            <motion.span
                                key={k}
                                aria-hidden="true"
                                className="inline-block"
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 30, delay: delayFor(k) } }}
                                exit={{ y: "-120%", opacity: 0, transition: { duration: 0.22, ease: "easeIn", delay: delayFor(k) * 0.6 } }}
                            >
                                {c}
                            </motion.span>
                        ))}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        </span>
    );
};

export default RotatingText;
