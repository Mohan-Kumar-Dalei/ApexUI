import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/*
 * Magnetic Cursor: a dot + ring cursor for one area of the page. The ring
 * wraps around links and buttons it hovers, grows into a labelled bubble over
 * anything with data-cursor-text, and pulls data-magnetic elements toward the
 * pointer. An optional tail follows it: comet, dots, sparkles or ghost rings.
 * Touch devices keep their normal behaviour.
 */

const TARGETS = "a, button, [role='button'], [data-cursor], [data-cursor-text], [data-magnetic]";

const hexToRgb = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/*
 * The tail lives on one canvas. `feed` gets every pointer position; the loop
 * only runs while something is still visible, then sleeps.
 */
function useTrail(canvasRef, style, color, enabled) {
    const state = useRef({ points: [], dots: [], parts: [], rings: [], last: null, raf: 0, lastSpawn: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !enabled || style === "none") return undefined;
        const ctx = canvas.getContext("2d");
        const s = state.current;
        const rgb = hexToRgb(color);
        const resize = () => {
            const r = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(r.width * dpr);
            canvas.height = Math.round(r.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const frame = () => {
            const now = performance.now();
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            if (style === "comet") {
                s.points = s.points.filter((p) => now - p.t < 320);
                const n = s.points.length;
                if (n > 1) {
                    alive = true;
                    ctx.lineCap = "round";
                    ctx.shadowColor = `rgba(${rgb},0.8)`;
                    ctx.shadowBlur = 12;
                    for (let i = 1; i < n; i++) {
                        const k = i / n;
                        ctx.strokeStyle = `rgba(${rgb},${k * 0.9})`;
                        ctx.lineWidth = 1 + k * 7;
                        ctx.beginPath();
                        ctx.moveTo(s.points[i - 1].x, s.points[i - 1].y);
                        ctx.lineTo(s.points[i].x, s.points[i].y);
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;
                }
            }

            if (style === "dots" && s.last) {
                // Each dot eases toward the one ahead of it.
                if (!s.dots.length) s.dots = Array.from({ length: 14 }, () => ({ x: s.last.x, y: s.last.y }));
                let tx = s.last.x;
                let ty = s.last.y;
                s.dots.forEach((d, i) => {
                    d.x += (tx - d.x) * 0.38;
                    d.y += (ty - d.y) * 0.38;
                    tx = d.x;
                    ty = d.y;
                    const k = 1 - i / s.dots.length;
                    ctx.fillStyle = `rgba(${rgb},${k * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, 1.5 + k * 4, 0, Math.PI * 2);
                    ctx.fill();
                });
                const tail = s.dots[s.dots.length - 1];
                alive = Math.hypot(tail.x - s.last.x, tail.y - s.last.y) > 0.5;
            }

            if (style === "sparkles") {
                s.parts = s.parts.filter((p) => now - p.born < p.life);
                s.parts.forEach((p) => {
                    const k = 1 - (now - p.born) / p.life;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05;
                    p.vx *= 0.97;
                    const size = p.size * k;
                    ctx.strokeStyle = p.white ? `rgba(255,255,255,${k})` : `rgba(${rgb},${k})`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(p.x - size, p.y);
                    ctx.lineTo(p.x + size, p.y);
                    ctx.moveTo(p.x, p.y - size);
                    ctx.lineTo(p.x, p.y + size);
                    ctx.stroke();
                });
                alive = s.parts.length > 0;
            }

            if (style === "ghost") {
                s.rings = s.rings.filter((r) => now - r.born < 650);
                s.rings.forEach((r) => {
                    const k = (now - r.born) / 650;
                    ctx.strokeStyle = `rgba(${rgb},${(1 - k) * 0.7})`;
                    ctx.lineWidth = 2 * (1 - k) + 0.5;
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, 6 + k * 22, 0, Math.PI * 2);
                    ctx.stroke();
                });
                alive = s.rings.length > 0;
            }

            s.raf = alive ? requestAnimationFrame(frame) : 0;
        };

        s.wake = () => {
            if (!s.raf) s.raf = requestAnimationFrame(frame);
        };
        return () => {
            cancelAnimationFrame(s.raf);
            s.raf = 0;
            s.wake = null;
            ro.disconnect();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            s.points = [];
            s.dots = [];
            s.parts = [];
            s.rings = [];
        };
    }, [canvasRef, style, color, enabled]);

    // Called on every pointer move with coordinates inside the area.
    return (x, y) => {
        const s = state.current;
        const now = performance.now();
        const prev = s.last;
        s.last = { x, y };
        if (style === "comet") s.points.push({ x, y, t: now });
        if (style === "sparkles" && prev) {
            const speed = Math.hypot(x - prev.x, y - prev.y);
            for (let i = 0; i < Math.min(4, Math.ceil(speed / 8)); i++) {
                s.parts.push({ x, y, vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.7) * 2.4, size: 2 + Math.random() * 3, life: 500 + Math.random() * 400, born: now, white: Math.random() < 0.3 });
            }
        }
        if (style === "ghost" && now - s.lastSpawn > 70) {
            s.lastSpawn = now;
            s.rings.push({ x, y, born: now });
        }
        s.wake?.();
    };
}

const MagneticCursor = ({
    children,
    color = "#a3e635",
    ringSize = 2.25,
    padding = 6,
    magnetStrength = 0.35,
    blend = false,
    trail = "none",
    className = "",
}) => {
    const ref = useRef(null);
    const trailRef = useRef(null);
    const magnet = useRef(null);
    const reduced = useReducedMotion();
    const feedTrail = useTrail(trailRef, trail, color, !reduced);
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
        feedTrail(px, py);

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
            {trail !== "none" && <canvas ref={trailRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 h-full w-full" />}
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
