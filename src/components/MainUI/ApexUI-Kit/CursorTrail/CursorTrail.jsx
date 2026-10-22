import React, { useEffect, useRef } from "react";

/*
 * Cursor Trail: a tail that follows the mouse — comet, rainbow, dots, ribbon,
 * sparkles or ghost rings. Wrap an area with it, or pass `global` to follow
 * the pointer across the whole page. Everything is drawn on one canvas and
 * the loop sleeps as soon as the tail has faded. Touch input is ignored.
 */

const hexToRgb = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const CursorTrail = ({ children, variant = "comet", color = "#a3e635", size = 1, length = 1, global = false, className = "" }) => {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const target = global ? window : wrapRef.current;
        if (!canvas || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
        const ctx = canvas.getContext("2d");
        const rgb = hexToRgb(color);
        const s = { points: [], chain: [], parts: [], rings: [], last: null, raf: 0, spawn: 0 };
        const life = 320 * length;

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

        // Points that each ease toward the one ahead: used by dots and ribbon.
        const follow = (count, ease) => {
            if (!s.last) return false;
            if (s.chain.length !== count) s.chain = Array.from({ length: count }, () => ({ x: s.last.x, y: s.last.y }));
            let tx = s.last.x;
            let ty = s.last.y;
            for (const p of s.chain) {
                p.x += (tx - p.x) * ease;
                p.y += (ty - p.y) * ease;
                tx = p.x;
                ty = p.y;
            }
            const tail = s.chain[s.chain.length - 1];
            return Math.hypot(tail.x - s.last.x, tail.y - s.last.y) > 0.4;
        };

        const frame = () => {
            const now = performance.now();
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);
            let alive = false;

            if (variant === "comet" || variant === "rainbow") {
                s.points = s.points.filter((p) => now - p.t < life);
                const n = s.points.length;
                alive = n > 1;
                ctx.lineCap = "round";
                for (let i = 1; i < n; i++) {
                    const k = i / n;
                    const c = variant === "rainbow" ? `hsla(${(now / 6 + i * 9) % 360},90%,62%,${k})` : `rgba(${rgb},${k * 0.9})`;
                    ctx.strokeStyle = c;
                    ctx.shadowColor = c;
                    ctx.shadowBlur = 12 * size;
                    ctx.lineWidth = (1 + k * 7) * size;
                    ctx.beginPath();
                    ctx.moveTo(s.points[i - 1].x, s.points[i - 1].y);
                    ctx.lineTo(s.points[i].x, s.points[i].y);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            }

            if (variant === "dots") {
                alive = follow(Math.round(14 * length), 0.38);
                s.chain.forEach((d, i) => {
                    const k = 1 - i / s.chain.length;
                    ctx.fillStyle = `rgba(${rgb},${k * 0.85})`;
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, (1.5 + k * 4) * size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            if (variant === "ribbon") {
                alive = follow(Math.round(22 * length), 0.42);
                const pts = s.last ? [s.last, ...s.chain] : [];
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                for (let i = 1; i < pts.length - 1; i++) {
                    const k = 1 - i / pts.length;
                    const mx1 = (pts[i - 1].x + pts[i].x) / 2;
                    const my1 = (pts[i - 1].y + pts[i].y) / 2;
                    const mx2 = (pts[i].x + pts[i + 1].x) / 2;
                    const my2 = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.strokeStyle = `rgba(${rgb},${0.15 + k * 0.85})`;
                    ctx.lineWidth = (2 + k * 12) * size;
                    ctx.beginPath();
                    ctx.moveTo(mx1, my1);
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx2, my2);
                    ctx.stroke();
                }
            }

            if (variant === "sparkles") {
                s.parts = s.parts.filter((p) => now - p.born < p.life);
                for (const p of s.parts) {
                    const k = 1 - (now - p.born) / p.life;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05;
                    p.vx *= 0.97;
                    const r = p.size * k * size;
                    ctx.strokeStyle = p.white ? `rgba(255,255,255,${k})` : `rgba(${rgb},${k})`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(p.x - r, p.y);
                    ctx.lineTo(p.x + r, p.y);
                    ctx.moveTo(p.x, p.y - r);
                    ctx.lineTo(p.x, p.y + r);
                    ctx.stroke();
                }
                alive = s.parts.length > 0;
            }

            if (variant === "ghost") {
                const span = 650 * length;
                s.rings = s.rings.filter((r) => now - r.born < span);
                for (const r of s.rings) {
                    const k = (now - r.born) / span;
                    ctx.strokeStyle = `rgba(${rgb},${(1 - k) * 0.7})`;
                    ctx.lineWidth = (2 * (1 - k) + 0.5) * size;
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, (6 + k * 22) * size, 0, Math.PI * 2);
                    ctx.stroke();
                }
                alive = s.rings.length > 0;
            }

            s.raf = alive ? requestAnimationFrame(frame) : 0;
        };

        const onMove = (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;
            const r = canvas.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const now = performance.now();
            const prev = s.last;
            s.last = { x, y };
            if (variant === "comet" || variant === "rainbow") s.points.push({ x, y, t: now });
            if (variant === "sparkles" && prev) {
                const speed = Math.hypot(x - prev.x, y - prev.y);
                for (let i = 0; i < Math.min(4, Math.ceil(speed / 8)); i++) {
                    s.parts.push({ x, y, vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.7) * 2.4, size: 2 + Math.random() * 3, life: (500 + Math.random() * 400) * length, born: now, white: Math.random() < 0.3 });
                }
            }
            if (variant === "ghost" && now - s.spawn > 70) {
                s.spawn = now;
                s.rings.push({ x, y, born: now });
            }
            if (!s.raf) s.raf = requestAnimationFrame(frame);
        };

        target.addEventListener("pointermove", onMove);
        return () => {
            target.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(s.raf);
            ro.disconnect();
        };
    }, [variant, color, size, length, global]);

    const canvas = <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${global ? "fixed inset-0 z-[9999]" : "absolute inset-0 z-40"} h-full w-full`} />;

    if (global) {
        return (
            <>
                {children}
                {canvas}
            </>
        );
    }
    return (
        <div ref={wrapRef} className={`relative ${className}`}>
            {children}
            {canvas}
        </div>
    );
};

export default CursorTrail;
