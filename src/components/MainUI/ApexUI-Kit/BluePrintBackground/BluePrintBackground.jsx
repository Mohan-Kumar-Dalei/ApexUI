import React, { useEffect, useRef } from "react";

/*
 * Blueprint Background: a drafting grid that drifts upward, with the cell
 * under the pointer lighting up and fading out behind it like a trail. Drawn
 * on one canvas (no per-cell elements), so it stays smooth on phones. Fills
 * its nearest positioned parent; put content on top as children.
 */

const BluePrintBackground = ({ color = "#9ae600", borderColor = "rgba(98, 116, 142, 0.22)", bgColor = "#1e293b", circleColor = "rgba(154, 230, 0, 0.2)", cellSize = 40, speed = 1, children, className = "" }) => {
    const wrap = useRef(null);
    const canvas = useRef(null);
    const live = useRef({});
    live.current = { color, borderColor, cellSize, speed };

    useEffect(() => {
        const el = wrap.current;
        const cv = canvas.current;
        const ctx = cv.getContext("2d");
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const lit = new Map(); // "col,row" -> glow 0..1
        const pointer = { x: -1, y: -1, in: false };
        let w = 0;
        let h = 0;
        let dpr = 1;
        let total = 0; // how far the grid has scrolled, in px
        let raf = 0;
        let last = 0;
        let visible = true;

        const fit = () => {
            const r = el.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width;
            h = r.height;
            cv.width = Math.round(w * dpr);
            cv.height = Math.round(h * dpr);
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const size = Math.max(12, o.cellSize);
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            if (!reduced) total += dt * 24 * o.speed;
            const offset = total % size;

            // Light the cell under the pointer (in grid space, so it scrolls with the grid).
            if (pointer.in) {
                lit.set(`${Math.floor(pointer.x / size)},${Math.floor((pointer.y + total) / size)}`, 1);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // Glowing cells, fading out.
            ctx.shadowColor = o.color;
            for (const [key, a] of lit) {
                const [c, row] = key.split(",").map(Number);
                const y = row * size - total;
                if (a <= 0.02 || y < -size || y > h + size) {
                    lit.delete(key);
                    continue;
                }
                ctx.globalAlpha = a;
                ctx.shadowBlur = 14 * a;
                ctx.fillStyle = o.color;
                ctx.fillRect(c * size + 1, y + 1, size - 2, size - 2);
                lit.set(key, a - dt * 1.6);
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Grid lines.
            ctx.strokeStyle = o.borderColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= w; x += size) {
                ctx.moveTo(Math.round(x) + 0.5, 0);
                ctx.lineTo(Math.round(x) + 0.5, h);
            }
            for (let y = -offset; y <= h; y += size) {
                ctx.moveTo(0, Math.round(y) + 0.5);
                ctx.lineTo(w, Math.round(y) + 0.5);
            }
            ctx.stroke();

            if (visible && (!reduced || lit.size)) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        const start = () => {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        };

        // Listen on the window so content placed on top doesn't block the effect.
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
            pointer.in = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
            if (pointer.in) start();
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        const ro = new ResizeObserver(() => {
            fit();
            start();
        });
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        fit();
        start();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", onMove);
        };
    }, []);

    return (
        <div ref={wrap} className={`absolute inset-0 z-0 h-full w-full overflow-hidden ${className}`} style={{ backgroundColor: bgColor }}>
            <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
            {/* Soft spotlight in the middle. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 blur-3xl" style={{ background: `radial-gradient(circle, ${circleColor} 0%, transparent 70%)` }} />
            {children && <div className="relative z-10 h-full w-full">{children}</div>}
        </div>
    );
};

export default BluePrintBackground;
