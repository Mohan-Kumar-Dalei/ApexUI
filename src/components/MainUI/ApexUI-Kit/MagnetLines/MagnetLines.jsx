import React, { useEffect, useRef } from "react";

/*
 * Magnet Lines: a grid of short lines that all swing to point at the
 * pointer, like iron filings around a magnet. Lines near the pointer glow
 * and stretch a little. When the pointer leaves they drift back to a slow
 * wave.
 */

const MagnetLines = ({ rows = 9, columns = 9, size = 22, lineColor = "currentColor", activeColor = "#a3e635", lineWidth = 0.22, lineHeight = 1.6, baseAngle = -10, className = "" }) => {
    const wrap = useRef(null);
    const lines = useRef([]);
    const pointer = useRef(null);

    useEffect(() => {
        let raf = 0;
        const angles = lines.current.map(() => baseAngle);
        const tick = (now) => {
            const p = pointer.current;
            const t = now / 1000;
            lines.current.forEach((el, i) => {
                if (!el) return;
                const r = el.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                let target;
                let near = 0;
                if (p) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
                    near = Math.max(0, 1 - Math.hypot(dx, dy) / 220);
                } else {
                    const col = i % columns;
                    const row = Math.floor(i / columns);
                    target = baseAngle + Math.sin(t * 1.2 + col * 0.5 + row * 0.3) * 25;
                }
                // Turn the short way round.
                const diff = ((target - angles[i] + 540) % 360) - 180;
                angles[i] += diff * 0.18;
                el.style.transform = `rotate(${angles[i]}deg) scaleY(${1 + near * 0.35})`;
                el.style.background = near > 0.05 ? `color-mix(in srgb, ${activeColor} ${Math.round(near * 100)}%, ${lineColor})` : lineColor;
                el.style.opacity = String(0.35 + 0.65 * Math.max(near, p ? 0.25 : 0.4));
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [baseAngle, columns, lineColor, activeColor]);

    return (
        <div
            ref={wrap}
            className={`grid touch-none place-items-center ${className}`}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, width: `min(${size}rem, 90vw)`, aspectRatio: `${columns} / ${rows}` }}
            onPointerMove={(e) => (pointer.current = { x: e.clientX, y: e.clientY })}
            onPointerLeave={() => (pointer.current = null)}
            aria-hidden="true"
        >
            {Array.from({ length: rows * columns }, (_, i) => (
                <span key={i} ref={(el) => (lines.current[i] = el)} className="block rounded-full will-change-transform" style={{ width: `${lineWidth}rem`, height: `${lineHeight}rem`, background: lineColor }} />
            ))}
        </div>
    );
};

export default MagnetLines;
