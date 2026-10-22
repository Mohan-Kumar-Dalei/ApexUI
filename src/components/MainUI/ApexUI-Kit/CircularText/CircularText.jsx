import React, { useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

/*
 * Circular Text: a line of text wrapped around a circle that keeps turning.
 * On hover it can speed up, slow down, pause or spin wildly. Put anything in
 * the middle with children.
 */

const HOVER_SPEED = { speedUp: 4, slowDown: 0.25, pause: 0, goBonkers: 14, none: 1 };

const CircularText = ({ text = "APEX UI • MOTION • COMPONENTS • ", size = 11, duration = 18, onHover = "speedUp", color = "currentColor", children, className = "" }) => {
    const reduced = useReducedMotion();
    const ring = useRef(null);
    const angle = useRef(0);
    const speed = useRef(1);
    const target = useRef(1);
    const chars = Array.from(text);

    useAnimationFrame((_, delta) => {
        if (reduced || !ring.current) return;
        speed.current += (target.current - speed.current) * 0.06;
        angle.current = (angle.current + (360 / duration) * (delta / 1000) * speed.current) % 360;
        const s = onHover === "goBonkers" && target.current > 1 ? 1 + Math.min(0.12, (speed.current - 1) * 0.01) : 1;
        ring.current.style.transform = `rotate(${angle.current}deg) scale(${s})`;
    });

    return (
        <div
            className={`relative grid place-items-center rounded-full ${className}`}
            style={{ width: `${size}rem`, height: `${size}rem`, color }}
            onPointerEnter={() => (target.current = HOVER_SPEED[onHover] ?? 1)}
            onPointerLeave={() => (target.current = 1)}
            aria-label={text}
            role="img"
        >
            <div ref={ring} className="absolute inset-0" aria-hidden="true">
                {chars.map((c, i) => (
                    <span key={i} className="absolute left-1/2 top-0 h-1/2 origin-bottom text-[0.95rem] font-bold uppercase" style={{ transform: `translateX(-50%) rotate(${(i / chars.length) * 360}deg)` }}>
                        {c}
                    </span>
                ))}
            </div>
            {children && <div className="relative">{children}</div>}
        </div>
    );
};

export default CircularText;
