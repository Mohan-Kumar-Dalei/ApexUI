import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Shiny Text: a bright band of light sweeps across the text on a loop, like
 * light catching metal. The text keeps its own color between sweeps.
 */

const ShinyText = ({ text = "Shipping soon — join the waitlist", as = "span", speed = 2.8, color = "#71717a", shineColor = "#ffffff", spread = 22, disabled = false, className = "" }) => {
    const reduced = useReducedMotion();
    const Tag = motion[as] ?? motion.span;
    const still = disabled || reduced;
    return (
        <Tag
            className={`inline-block bg-clip-text text-transparent ${className}`}
            style={{
                backgroundImage: `linear-gradient(110deg, ${color} ${50 - spread}%, ${shineColor} 50%, ${color} ${50 + spread}%)`,
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
            }}
            initial={{ backgroundPosition: "100% 0" }}
            animate={still ? { backgroundPosition: "100% 0" } : { backgroundPosition: ["100% 0", "0% 0"] }}
            transition={still ? undefined : { duration: speed, ease: "linear", repeat: Infinity, repeatDelay: speed * 0.25 }}
        >
            {text}
        </Tag>
    );
};

export default ShinyText;
