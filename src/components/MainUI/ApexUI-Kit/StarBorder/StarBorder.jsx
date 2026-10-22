import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Star Border: two soft points of light travel along the top and bottom
 * edges of a button in opposite directions, like stars sliding around its
 * rim. Renders a <button> by default; pass `as="a"` for a link.
 */

const StarBorder = ({ as = "button", color = "#a3e635", speed = 5, thickness = 1.5, theme = "dark", children = "Get started", className = "", ...rest }) => {
    const reduced = useReducedMotion();
    const Tag = as;
    const dark = theme !== "light";
    const star = (dir) => ({
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animate: reduced ? undefined : { x: dir > 0 ? ["-35%", "35%"] : ["35%", "-35%"], opacity: [0, 1, 1, 0] },
        transition: { duration: speed, ease: "linear", repeat: Infinity, times: [0, 0.15, 0.85, 1] },
    });
    // Keyed on speed below: a looping animation keeps its old duration otherwise.
    const top = star(-1);
    const bottom = star(1);

    return (
        <Tag className={`group relative inline-block overflow-hidden rounded-[1.1rem] ${className}`} style={{ padding: `${thickness}px 0` }} {...(as === "button" ? { type: "button" } : {})} {...rest}>
            <motion.span key={`b-${speed}`} aria-hidden="true" className="pointer-events-none absolute -bottom-[11px] left-[-100%] h-1/2 w-[300%] opacity-70" style={{ background: bottom.background }} animate={bottom.animate} transition={bottom.transition} />
            <motion.span key={`t-${speed}`} aria-hidden="true" className="pointer-events-none absolute -top-[10px] left-[-100%] h-1/2 w-[300%] opacity-70" style={{ background: top.background }} animate={top.animate} transition={top.transition} />
            <span className={`relative z-[1] block rounded-[1.1rem] border px-7 py-3.5 text-center text-[0.95rem] font-semibold transition-colors ${dark ? "border-white/10 bg-gradient-to-b from-neutral-900 to-black text-white group-hover:border-white/20" : "border-black/10 bg-gradient-to-b from-white to-neutral-100 text-neutral-900 group-hover:border-black/20"}`}>
                {children}
            </span>
        </Tag>
    );
};

export default StarBorder;
