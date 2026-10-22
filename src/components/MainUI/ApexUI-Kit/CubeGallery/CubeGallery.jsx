import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Cube Gallery: up to six images on a solid 3D cube seen from a corner, so
 * three faces show at once. It spins slowly on its own; drag in any
 * direction to throw it around, and it eases back to a corner view. Faces
 * are shaded by how much they turn away from you, which sells the depth.
 * Arrows / arrow keys turn it a quarter at a time.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n) => `${IK}/${n}.png?tr=f-auto,q-80,w-600`;
const DEFAULT_FACES = [
    { image: img("spiderman"), title: "Spider-Man" },
    { image: img("black-panther"), title: "Black Panther" },
    { image: img("hulk"), title: "Hulk" },
    { image: img("thanos"), title: "Thanos" },
    { image: img("captainamerica"), title: "Captain America" },
    { image: img("doctorStrange"), title: "Doctor Strange" },
];

// Side faces (around Y) then top and bottom.
const SIDES = [
    { yaw: 0, pitch: 0 },
    { yaw: 90, pitch: 0 },
    { yaw: 180, pitch: 0 },
    { yaw: 270, pitch: 0 },
    { yaw: 0, pitch: 90 },
    { yaw: 0, pitch: -90 },
];
const RAD = Math.PI / 180;

const CubeGallery = ({ faces = DEFAULT_FACES, size = 13, autoRotate = true, speed = 12, tilt = -24, accentColor = "#a3e635", className = "" }) => {
    const reduced = useReducedMotion();
    const rotY = useMotionValue(-35);
    const rotX = useMotionValue(tilt);
    const shades = useRef([]);
    const drag = useRef(null);
    const [hover, setHover] = useState(false);
    const [index, setIndex] = useState(0);
    const half = `${size / 2}rem`;

    // Darken each face by how far it turns from the viewer.
    const shade = () => {
        const y = rotY.get();
        const x = rotX.get();
        SIDES.forEach((s, i) => {
            const el = shades.current[i];
            if (!el) return;
            let facing;
            if (s.pitch === 0) facing = Math.cos((s.yaw + y) * RAD) * Math.cos(x * RAD);
            else facing = Math.sin((s.pitch > 0 ? -x : x) * RAD);
            el.style.opacity = String(0.08 + (1 - Math.max(0, facing)) * 0.62);
        });
    };
    useMotionValueEvent(rotY, "change", shade);
    useMotionValueEvent(rotX, "change", shade);
    useEffect(shade);

    useEffect(() => {
        rotX.set(tilt);
    }, [tilt, rotX]);

    // Slow continuous spin while idle.
    useEffect(() => {
        if (!autoRotate || hover || reduced) return undefined;
        let raf = 0;
        let last = performance.now();
        const tick = (now) => {
            if (!drag.current) rotY.set(rotY.get() - ((now - last) / 1000) * speed);
            last = now;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [autoRotate, hover, reduced, speed, rotY]);

    const turn = (dir) => {
        // Land on the next corner view, 90° along.
        const target = Math.round((rotY.get() + 35) / 90) * 90 - 35 - dir * 90;
        animate(rotY, target, { type: "spring", stiffness: 110, damping: 18 });
        animate(rotX, tilt, { type: "spring", stiffness: 110, damping: 18 });
        setIndex((i) => (((i + dir) % 4) + 4) % 4);
    };

    return (
        <div
            className={`flex flex-col items-center gap-12 outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") turn(1);
                if (e.key === "ArrowLeft") turn(-1);
            }}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            aria-roledescription="carousel"
            aria-label="Cube gallery"
        >
            <div className="relative [perspective:1100px]" style={{ width: `${size}rem`, height: `${size}rem`, maxWidth: "60vw", maxHeight: "60vw", margin: `${size * 0.16}rem 0` }}>
                {/* Soft floor shadow */}
                <div className="pointer-events-none absolute -bottom-[22%] left-1/2 h-[18%] w-[95%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-xl" />
                <motion.div
                    className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing [transform-style:preserve-3d]"
                    style={{ rotateX: rotX, rotateY: rotY }}
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        rotY.stop();
                        rotX.stop();
                        drag.current = { x: e.clientX, y: e.clientY, sx: rotY.get(), sy: rotX.get(), vx: 0, vy: 0, t: performance.now(), lx: e.clientX, ly: e.clientY };
                    }}
                    onPointerMove={(e) => {
                        const d = drag.current;
                        if (!d) return;
                        rotY.set(d.sx + (e.clientX - d.x) * 0.5);
                        rotX.set(Math.max(-70, Math.min(70, d.sy - (e.clientY - d.y) * 0.4)));
                        const now = performance.now();
                        const dt = Math.max(1, now - d.t);
                        d.vx = ((e.clientX - d.lx) / dt) * 0.5 * 1000;
                        d.vy = ((e.clientY - d.ly) / dt) * 0.4 * 1000;
                        d.t = now;
                        d.lx = e.clientX;
                        d.ly = e.clientY;
                    }}
                    onPointerUp={() => {
                        const d = drag.current;
                        if (!d) return;
                        drag.current = null;
                        // Throw with momentum, then settle back to the corner tilt.
                        animate(rotY, rotY.get() + d.vx * 0.35, { type: "spring", stiffness: 40, damping: 16 });
                        animate(rotX, tilt, { type: "spring", stiffness: 70, damping: 14 });
                    }}
                >
                    {SIDES.map((s, i) => {
                        const f = faces[i % faces.length];
                        const transform = s.pitch ? `rotateX(${s.pitch}deg) translateZ(${half})` : `rotateY(${s.yaw}deg) translateZ(${half})`;
                        return (
                            <figure key={i} className="absolute inset-0 m-0 overflow-hidden bg-neutral-900 [backface-visibility:hidden]" style={{ transform, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }}>
                                <img src={f.image} alt={f.title} draggable="false" className="h-full w-full select-none object-cover" />
                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 text-[0.8rem] font-semibold text-white">{f.title}</figcaption>
                                <span ref={(el) => (shades.current[i] = el)} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0.3 }} />
                            </figure>
                        );
                    })}
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                <button type="button" aria-label="Turn left" onClick={() => turn(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="h-2 rounded-full transition-all duration-300" style={{ width: i === index ? 22 : 8, background: i === index ? accentColor : "color-mix(in srgb, currentColor 25%, transparent)" }} />
                    ))}
                </div>
                <button type="button" aria-label="Turn right" onClick={() => turn(1)} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default CubeGallery;
