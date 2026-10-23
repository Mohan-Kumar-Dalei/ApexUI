import React, { useEffect, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

/*
 * 3D Text Ring: letters stand on a ring in real 3D space and the ring
 * turns, so text sweeps around the back and comes forward again. Letters
 * fade and soften as they pass behind. Drag to spin it yourself. On narrow
 * screens the whole ring scales down to fit its container.
 */

const TextRing3D = ({ text = "APEX UI · 3D TYPE · ", radius = 9, speed = 30, tilt = -14, fontSize = 2, color = "currentColor", accentColor = "#a3e635", className = "" }) => {
    const reduced = useReducedMotion();
    const box = useRef(null);
    const ring = useRef(null);
    const fit = useRef(1);
    const letters = useRef([]);
    const angle = useRef(0);
    const vel = useRef(0);
    const drag = useRef(null);
    const chars = Array.from(text);
    const step = 360 / chars.length;

    useEffect(() => {
        const el = box.current;
        const ro = new ResizeObserver(() => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const want = radius * 2.4 * rem;
            fit.current = Math.min(1, el.getBoundingClientRect().width / want);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [radius]);

    useAnimationFrame((_, delta) => {
        const dt = Math.min(0.05, delta / 1000);
        if (!drag.current) {
            vel.current *= 0.95;
            angle.current += (reduced ? 0 : speed) * dt + vel.current * dt;
        }
        if (ring.current) ring.current.style.transform = `scale(${fit.current}) rotateX(${tilt}deg) rotateY(${-angle.current}deg)`;
        letters.current.forEach((el, i) => {
            if (!el) return;
            // How much this letter faces the viewer (1 front, -1 back).
            const facing = Math.cos(((i * step - angle.current) * Math.PI) / 180);
            el.style.opacity = String(0.18 + 0.82 * ((facing + 1) / 2));
            el.style.color = facing > 0.9 ? accentColor : "";
        });
    });

    return (
        <div
            ref={box}
            className={`grid cursor-grab touch-none select-none place-items-center active:cursor-grabbing [perspective:900px] ${className}`}
            style={{ width: `${radius * 2.4}rem`, maxWidth: "100%", height: `${fontSize * 3.2 + 4}rem`, color }}
            onPointerDown={(e) => {
                // Block text selection / native drag, which cancel the drag midway.
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                drag.current = { x: e.clientX, a: angle.current, t: performance.now() };
            }}
            onPointerMove={(e) => {
                const d = drag.current;
                if (!d) return;
                const now = performance.now();
                const next = d.a - (e.clientX - d.x) * 0.4;
                vel.current = ((next - angle.current) / Math.max(1, now - d.t)) * 1000;
                d.t = now;
                angle.current = next;
            }}
            onPointerUp={() => (drag.current = null)}
            aria-label={text}
            role="img"
        >
            <div ref={ring} className="relative h-0 w-0 [transform-style:preserve-3d]">
                {chars.map((c, i) => (
                    <span
                        key={i}
                        ref={(el) => (letters.current[i] = el)}
                        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-black leading-none transition-colors duration-300"
                        style={{ fontSize: `${fontSize}rem`, transform: `rotateY(${i * step}deg) translateZ(${radius}rem)` }}
                    >
                        {c === " " ? " " : c}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TextRing3D;
