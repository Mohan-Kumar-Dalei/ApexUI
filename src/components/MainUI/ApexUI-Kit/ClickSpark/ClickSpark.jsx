import React, { useEffect, useRef } from "react";

/*
 * Click Spark: wrap anything and every click throws out a ring of short
 * spark lines from the pointer that shoot out and fade. Drawn on a canvas
 * overlay so it never blocks clicks underneath.
 */

const ease = (t) => t * (2 - t);

const ClickSpark = ({ sparkColor = "#a3e635", sparkCount = 10, sparkRadius = 26, sparkSize = 12, duration = 450, children, className = "" }) => {
    const wrap = useRef(null);
    const canvas = useRef(null);
    const sparks = useRef([]);
    const raf = useRef(0);

    useEffect(() => {
        const c = canvas.current;
        const resize = () => {
            const r = wrap.current.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            c.width = r.width * dpr;
            c.height = r.height * dpr;
            c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(wrap.current);
        resize();
        return () => {
            ro.disconnect();
            cancelAnimationFrame(raf.current);
        };
    }, []);

    const draw = () => {
        const ctx = canvas.current.getContext("2d");
        const now = performance.now();
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        sparks.current = sparks.current.filter((s) => now - s.start < duration);
        for (const s of sparks.current) {
            const p = ease((now - s.start) / duration);
            const dist = p * sparkRadius;
            const len = sparkSize * (1 - p);
            ctx.strokeStyle = sparkColor;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(s.x + dist * Math.cos(s.a), s.y + dist * Math.sin(s.a));
            ctx.lineTo(s.x + (dist + len) * Math.cos(s.a), s.y + (dist + len) * Math.sin(s.a));
            ctx.stroke();
        }
        raf.current = sparks.current.length ? requestAnimationFrame(draw) : 0;
    };

    const onClick = (e) => {
        const r = wrap.current.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const start = performance.now();
        for (let i = 0; i < sparkCount; i++) sparks.current.push({ x, y, a: (Math.PI * 2 * i) / sparkCount, start });
        if (!raf.current) raf.current = requestAnimationFrame(draw);
    };

    return (
        <div ref={wrap} className={`relative ${className}`} onClick={onClick}>
            {children}
            <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
    );
};

export default ClickSpark;
