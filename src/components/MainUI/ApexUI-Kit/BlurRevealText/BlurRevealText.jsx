import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Blur Reveal Text: words (or letters) rise out of a blur one after another
 * when the text scrolls into view. An optional highlight word gets the accent.
 */

const BlurRevealText = ({
    text = "Design that moves people, built in minutes.",
    as: Tag = "p",
    by = "word",
    stagger = 0.06,
    duration = 0.7,
    blur = 12,
    highlight = [],
    accentColor = "#a3e635",
    once = true,
    className = "",
}) => {
    const reduced = useReducedMotion();
    const words = text.split(" ");
    let index = 0;
    const MotionTag = motion[Tag] ?? motion.p;

    const piece = (content, key, accent) => {
        const delay = index++ * stagger;
        return (
            <motion.span
                key={key}
                className="inline-block will-change-[filter,transform]"
                style={accent ? { color: accentColor } : undefined}
                variants={{
                    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: "0.35em", filter: `blur(${blur}px)` },
                    shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration, delay, ease: [0.22, 1, 0.36, 1] } },
                }}
            >
                {content}
            </motion.span>
        );
    };

    return (
        <MotionTag aria-label={text} className={className} initial="hidden" whileInView="shown" viewport={{ once, amount: 0.4 }}>
            {words.map((word, w) => {
                const accent = highlight.some((h) => h.toLowerCase() === word.replace(/[^\p{L}\p{N}'-]/gu, "").toLowerCase());
                return (
                    <React.Fragment key={w}>
                        <span aria-hidden="true" className="inline-block whitespace-nowrap">
                            {by === "letter" ? [...word].map((ch, c) => piece(ch, c, accent)) : piece(word, 0, accent)}
                        </span>
                        {w < words.length - 1 && " "}
                    </React.Fragment>
                );
            })}
        </MotionTag>
    );
};

export default BlurRevealText;
