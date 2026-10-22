import React, { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/*
 * Extruded Text: chunky 3D letters built from stacked copies of the text,
 * each pushed a little deeper. The whole block tilts toward the pointer so
 * you can see the sides, and the face can carry a gradient.
 */

const ExtrudedText = ({
    text = "APEX",
    depth = 14,
    faceColor = "#a3e635",
    sideColor = "#3f6212",
    gradient = "",
    maxTilt = 22,
    fontSize = 7,
    className = "",
}) => {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    // Rest a little turned so the depth shows before the pointer arrives.
    const REST = { x: -0.55, y: 0.5 };
    const px = useMotionValue(REST.x);
    const py = useMotionValue(REST.y);
    const rotateY = useSpring(useTransform(px, [-1, 1], [-maxTilt, maxTilt]), { stiffness: 140, damping: 16 });
    const rotateX = useSpring(useTransform(py, [-1, 1], [maxTilt * 0.7, -maxTilt * 0.7]), { stiffness: 140, damping: 16 });

    const onMove = (e) => {
        if (reduced) return;
        const r = ref.current.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };

    const layers = Array.from({ length: depth }, (_, i) => depth - i);

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={() => {
                px.set(REST.x);
                py.set(REST.y);
            }}
            className={`flex w-full items-center justify-center py-10 [perspective:900px] ${className}`}
            aria-label={text}
            role="img"
        >
            <motion.div className="relative font-black leading-none tracking-tight [transform-style:preserve-3d]" style={{ rotateX, rotateY, fontSize: `clamp(2.5rem, 14vw, ${fontSize}rem)` }}>
                {/* Back layers form the sides, darker the deeper they go. */}
                {layers.map((z) => (
                    <span
                        key={z}
                        aria-hidden="true"
                        className="absolute inset-0 select-none"
                        style={{ transform: `translateZ(${-z * 3}px)`, color: sideColor, filter: `brightness(${1 - (z / depth) * 0.55})` }}
                    >
                        {text}
                    </span>
                ))}
                <span
                    aria-hidden="true"
                    className="relative block select-none"
                    style={
                        gradient
                            ? { backgroundImage: gradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                            : { color: faceColor, textShadow: "0 1px 0 rgba(255,255,255,0.35)" }
                    }
                >
                    {text}
                </span>
            </motion.div>
        </div>
    );
};

export default ExtrudedText;
