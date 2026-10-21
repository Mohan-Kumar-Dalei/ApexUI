import React, { useEffect, useRef } from "react";

/*
 * Dot Wave Background: a grid of dots on a canvas with a slow wave of color
 * rolling through it. Dots near the pointer swell, light up and lean away.
 * Pauses while off screen and stays still for reduced-motion users.
 */

const hexToRgb = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const POINTER_RADIUS = 150;

const DotWaveBackground = ({
    children,
    className = "",
    containerClassName = "",
    background = "#09090b",
    dotColor = "#ffffff",
    colors = ["#38bdf8", "#a78bfa"],
    gap = 22,
    dotSize = 1.2,
    waveStrength = 1,
    speed = 1,
    interactive = true,
    fade = true,
}) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const pointer = useRef({ x: -9999, y: -9999, active: false, strength: 0 });
    const redraw = useRef(() => {});
    const settings = useRef(null);
    settings.current = { dotColor, colors, gap, dotSize, waveStrength, speed, interactive };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext("2d");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let width = 0;
        let height = 0;
        let raf = 0;
        let t = 0;
        let last = performance.now();
        let visible = true;

        const draw = () => {
            const s = settings.current;
            const base = hexToRgb(s.dotColor);
            const ca = hexToRgb(s.colors[0]);
            const cb = hexToRgb(s.colors[1] ?? s.colors[0]);
            const p = pointer.current;
            p.strength += ((p.active && s.interactive && !reduced ? 1 : 0) - p.strength) * 0.08;

            ctx.clearRect(0, 0, width, height);
            const g = Math.max(8, s.gap);
            const cols = Math.ceil(width / g) + 1;
            const rows = Math.ceil(height / g) + 1;
            const ox = (width - (cols - 1) * g) / 2;
            const oy = (height - (rows - 1) * g) / 2;

            for (let i = 0; i < cols; i++) {
                const x0 = ox + i * g;
                // Highlight color drifts from the first to the second color left to right.
                const m = width ? Math.min(1, Math.max(0, x0 / width)) : 0;
                const hr = ca[0] + (cb[0] - ca[0]) * m;
                const hg = ca[1] + (cb[1] - ca[1]) * m;
                const hb = ca[2] + (cb[2] - ca[2]) * m;

                for (let j = 0; j < rows; j++) {
                    const y0 = oy + j * g;
                    // A diagonal band plus a ripple spreading from the centre.
                    const ripple = Math.hypot(x0 - width / 2, y0 - height / 2);
                    const wave = 0.55 * Math.sin(x0 * 0.009 + y0 * 0.005 - t * 1.3) + 0.45 * Math.sin(ripple * 0.018 - t * 1.6);
                    const lift = Math.min(1, Math.max(0, (wave + 0.3) / 0.95));
                    const v = Math.min(1, lift * lift * s.waveStrength);

                    let x = x0;
                    let y = y0;
                    let boost = 0;
                    if (p.strength > 0.01) {
                        const dx = x0 - p.x;
                        const dy = y0 - p.y;
                        const d = Math.hypot(dx, dy);
                        if (d < POINTER_RADIUS) {
                            boost = (1 - d / POINTER_RADIUS) ** 2 * p.strength;
                            const push = (boost * 9) / (d || 1);
                            x += dx * push;
                            y += dy * push;
                        }
                    }

                    const k = Math.min(1, v + boost);
                    const r = s.dotSize * (1 + v * 1.9 + boost * 1.8);
                    ctx.fillStyle = `rgba(${Math.round(base[0] + (hr - base[0]) * k)},${Math.round(base[1] + (hg - base[1]) * k)},${Math.round(base[2] + (hb - base[2]) * k)},${0.13 + k * 0.87})`;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };
        redraw.current = draw;

        const loop = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            t += dt * settings.current.speed;
            draw();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (reduced || raf || !visible) return;
            last = performance.now();
            raf = requestAnimationFrame(loop);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(container);
        resize();
        start();

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    // Reduced motion draws one still frame, so redraw when the props change.
    useEffect(() => {
        redraw.current();
    }, [dotColor, colors, gap, dotSize, waveStrength]);

    const onPointerMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        pointer.current.x = e.clientX - rect.left;
        pointer.current.y = e.clientY - rect.top;
        pointer.current.active = true;
    };
    const onPointerLeave = () => {
        pointer.current.active = false;
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={interactive ? onPointerMove : undefined}
            onPointerLeave={onPointerLeave}
            onPointerCancel={onPointerLeave}
            className={`relative h-screen w-full overflow-hidden ${containerClassName}`}
            style={{ background }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={fade ? { maskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, #000 35%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 50%, #000 35%, transparent 100%)" } : undefined}
            />
            {children && <div className={`relative z-10 h-full w-full ${className}`}>{children}</div>}
        </div>
    );
};

export default DotWaveBackground;
