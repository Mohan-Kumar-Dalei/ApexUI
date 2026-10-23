import React, { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/*
 * Magnetic Button: when the pointer comes near, the button leans toward it
 * like a magnet, and its label follows a little further for a layered
 * parallax. A soft glow tracks the pointer across the surface. Springs back
 * when the pointer leaves. Renders a <button>, or a link with `as="a"`.
 */

const MagneticButton = ({ as = "button", children = "Get started", strength = 0.35, radius = 1.6, accentColor = "#a3e635", theme = "dark", className = "", ...rest }) => {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const gx = useMotionValue(50);
    const gy = useMotionValue(50);
    const spring = { stiffness: 220, damping: 18, mass: 0.6 };
    const x = useSpring(mx, spring);
    const y = useSpring(my, spring);
    // The label travels a bit further than the button: layered parallax.
    const lx = useTransform(x, (v) => v * 0.45);
    const ly = useTransform(y, (v) => v * 0.45);
    const glow = useTransform([gx, gy], ([a, b]) => `radial-gradient(120px circle at ${a}% ${b}%, ${accentColor}55, transparent 70%)`);
    const Tag = motion[as] ?? motion.button;
    const dark = theme !== "light";

    const onMove = (e) => {
        const el = ref.current;
        if (!el || reduced) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        // Only pull while the pointer is within `radius` × the button size.
        const reach = Math.max(r.width, r.height) * radius;
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
        mx.set(dx * strength * pull * 1.6);
        my.set(dy * strength * pull * 1.6);
        gx.set(((e.clientX - r.left) / r.width) * 100);
        gy.set(((e.clientY - r.top) / r.height) * 100);
    };
    const reset = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        // The wrapper is larger than the button so the pull starts before you touch it.
        <span className="inline-block p-6" onPointerMove={onMove} onPointerLeave={reset}>
            <Tag
                ref={ref}
                {...(as === "button" ? { type: "button" } : {})}
                {...rest}
                style={{ x, y }}
                whileTap={{ scale: 0.96 }}
                className={`group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full px-8 py-4 text-[0.95rem] font-semibold outline-none ring-1 transition-shadow focus-visible:ring-2 ${dark ? "bg-neutral-950 text-white ring-white/15 focus-visible:ring-white/40" : "bg-white text-neutral-900 ring-black/10 focus-visible:ring-black/30"} ${className}`}
            >
                <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
                <motion.span className="relative inline-flex items-center gap-2" style={{ x: lx, y: ly }}>
                    {children}
                </motion.span>
            </Tag>
        </span>
    );
};

export default MagneticButton;
