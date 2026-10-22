import React, { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/*
 * Magnetic Cursor: a dot + ring cursor for one area of the page. The ring
 * wraps around links and buttons it hovers, grows into a labelled bubble over
 * anything with data-cursor-text, and pulls data-magnetic elements toward the
 * pointer. Touch devices keep their normal behaviour.
 */

const TARGETS = "a, button, [role='button'], [data-cursor], [data-cursor-text], [data-magnetic]";

const MagneticCursor = ({
    children,
    color = "#a3e635",
    ringSize = 2.25,
    padding = 6,
    magnetStrength = 0.35,
    blend = false,
    className = "",
}) => {
    const ref = useRef(null);
    const magnet = useRef(null);
    const reduced = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const [label, setLabel] = useState("");
    const [pressed, setPressed] = useState(false);

    const springy = reduced ? { duration: 0 } : { stiffness: 420, damping: 34, mass: 0.6 };
    const dotX = useMotionValue(-100);
    const dotY = useMotionValue(-100);
    const x = useSpring(-100, springy);
    const y = useSpring(-100, springy);
    const w = useSpring(36, springy);
    const h = useSpring(36, springy);
    const radius = useSpring(18, springy);

    const ringPx = () => ringSize * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");

    const releaseMagnet = () => {
        if (magnet.current) {
            magnet.current.style.transform = "";
            magnet.current = null;
        }
    };

    const onMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const box = ref.current.getBoundingClientRect();
        const px = e.clientX - box.left;
        const py = e.clientY - box.top;
        dotX.set(px);
        dotY.set(py);
        setVisible(true);

        const target = e.target.closest?.(TARGETS);
        const inside = target && ref.current.contains(target) && target !== ref.current;
        const text = inside ? target.getAttribute("data-cursor-text") : null;

        if (inside && target.hasAttribute("data-magnetic")) {
            const r = target.getBoundingClientRect();
            const mx = (e.clientX - (r.left + r.width / 2)) * magnetStrength;
            const my = (e.clientY - (r.top + r.height / 2)) * magnetStrength;
            target.style.transition = "transform 0.2s ease-out";
            target.style.transform = `translate(${mx}px, ${my}px)`;
            if (magnet.current !== target) releaseMagnet();
            magnet.current = target;
        } else {
            releaseMagnet();
        }

        if (text) {
            // Big labelled bubble that follows the pointer.
            const size = ringPx() * 2.2;
            setLabel(text);
            x.set(px - size / 2);
            y.set(py - size / 2);
            w.set(size);
            h.set(size);
            radius.set(size / 2);
        } else if (inside) {
            // Wrap the hovered element (it may be shifted by the magnet).
            const r = target.getBoundingClientRect();
            const br = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 8;
            setLabel("");
            x.set(r.left - box.left - padding);
            y.set(r.top - box.top - padding);
            w.set(r.width + padding * 2);
            h.set(r.height + padding * 2);
            radius.set(Math.min(br + padding, (r.height + padding * 2) / 2));
        } else {
            const size = ringPx();
            setLabel("");
            x.set(px - size / 2);
            y.set(py - size / 2);
            w.set(size);
            h.set(size);
            radius.set(size / 2);
        }
    };

    const onLeave = () => {
        setVisible(false);
        setLabel("");
        releaseMagnet();
    };

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            onPointerDown={(e) => e.pointerType === "mouse" && setPressed(true)}
            onPointerUp={() => setPressed(false)}
            className={`relative ${visible ? "cursor-none [&_*]:cursor-none" : ""} ${className}`}
        >
            {children}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-50 flex items-center justify-center border-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                style={{
                    x,
                    y,
                    width: w,
                    height: h,
                    borderRadius: radius,
                    borderColor: color,
                    color: "#0a0a0a",
                    background: label ? color : `color-mix(in srgb, ${color} 12%, transparent)`,
                    mixBlendMode: blend ? "difference" : "normal",
                }}
                animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.88 : 1 }}
                transition={{ duration: 0.18 }}
            >
                {label}
            </motion.div>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-1 -top-1 z-50 h-2 w-2 rounded-full"
                style={{ x: dotX, y: dotY, background: color }}
                animate={{ opacity: visible && !label ? 1 : 0 }}
                transition={{ duration: 0.12 }}
            />
        </div>
    );
};

export default MagneticCursor;
