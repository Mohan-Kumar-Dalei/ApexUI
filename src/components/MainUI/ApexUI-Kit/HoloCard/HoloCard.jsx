import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/*
 * Holo Card: a collectible-style card that tilts in 3D under the pointer.
 * A rainbow foil and a glare follow the light, and the artwork, title and
 * badge float at different depths so the card feels thick.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";

const HoloCard = ({
    image = `${IK}/doctorStrange.png?tr=f-auto,q-80,w-600`,
    title = "Doctor Strange",
    subtitle = "Sorcerer Supreme",
    badge = "Legendary",
    stat = "98",
    accentColor = "#a3e635",
    maxTilt = 16,
    width = 17,
    className = "",
}) => {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const spring = { stiffness: 180, damping: 18, mass: 0.6 };
    const sx = useSpring(px, spring);
    const sy = useSpring(py, spring);
    const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
    const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
    const glareX = useTransform(sx, (v) => `${v * 100}%`);
    const glareY = useTransform(sy, (v) => `${v * 100}%`);
    const foilPos = useTransform([sx, sy], ([x, y]) => `${x * 100}% ${y * 100}%`);
    const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)`;
    const shadow = useTransform([sx, sy], ([x, y]) => `${(0.5 - x) * 40}px ${(0.5 - y) * 40 + 30}px 60px -20px rgba(0,0,0,0.6)`);

    const onMove = (e) => {
        if (reduced) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
        px.set(0.5);
        py.set(0.5);
    };

    return (
        <div className={`[perspective:1100px] ${className}`}>
            <motion.article
                ref={ref}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                className="relative aspect-[5/7] cursor-pointer select-none rounded-[1.4rem] bg-neutral-900 [transform-style:preserve-3d]"
                style={{ width: `min(${width}rem, 80vw)`, rotateX, rotateY, boxShadow: shadow }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className="absolute inset-0 overflow-hidden rounded-[1.4rem] ring-1 ring-white/15">
                    <img src={image} alt="" draggable="false" className="h-full w-full object-cover" />
                    {/* Holographic foil: a rainbow that slides with the light. */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.22] mix-blend-color-dodge"
                        style={{
                            backgroundImage: "linear-gradient(115deg, transparent 20%, #ff7ad9 30%, #7afcff 40%, #fdff7a 50%, #7aff9b 60%, #b57aff 70%, transparent 80%)",
                            backgroundSize: "260% 260%",
                            backgroundPosition: foilPos,
                        }}
                    />
                    <motion.div aria-hidden="true" className="absolute inset-0 mix-blend-overlay" style={{ background: glare }} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                </div>

                {/* Layers that float above the card. */}
                <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between [transform:translateZ(40px)]">
                    <span className="rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-black shadow-lg" style={{ background: accentColor }}>
                        {badge}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/50 font-mono text-sm font-bold text-white backdrop-blur">{stat}</span>
                </div>
                <div className="pointer-events-none absolute inset-x-5 bottom-5 text-white [transform:translateZ(60px)]">
                    <p className="text-[1.35rem] font-bold leading-tight drop-shadow-lg">{title}</p>
                    <p className="text-[0.82rem] text-white/70">{subtitle}</p>
                </div>
            </motion.article>
        </div>
    );
};

export default HoloCard;
