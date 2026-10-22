import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Shiny Text: a bright band of light sweeps across the text on a loop, like
 * light catching metal. The band starts and ends fully outside the text, so
 * the loop is seamless — it never pauses on the last letters or jumps back.
 */

const ShinyText = ({ text = "Shipping soon, join the waitlist", as = "span", speed = 2.8, color = "#71717a", shineColor = "#ffffff", spread = 10, pause = 0.6, disabled = false, className = "" }) => {
    const reduced = useReducedMotion();
    const Tag = motion[as] ?? motion.span;
    const still = disabled || reduced;
    // The gradient is 3× the text width with the band in its middle. Moving the
    // background from 100% to 0% carries the band from fully left of the text
    // to fully right of it, so both ends of the loop look identical.
    const band = Math.min(16, Math.max(4, spread));
    return (
        <Tag
            className={`inline-block bg-clip-text text-transparent ${className}`}
            style={{
                backgroundImage: `linear-gradient(100deg, ${color} ${50 - band}%, ${shineColor} 50%, ${color} ${50 + band}%)`,
                backgroundSize: "300% 100%",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundPosition: "100% 0",
            }}
            animate={still ? { backgroundPosition: "100% 0" } : { backgroundPosition: ["100% 0", "0% 0"] }}
            transition={still ? undefined : { duration: speed, ease: "linear", repeat: Infinity, repeatDelay: pause }}
        >
            {text}
        </Tag>
    );
};

export default ShinyText;
