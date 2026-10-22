import React, { useEffect, useRef } from "react";

/*
 * Proximity Text: letters swell, lift and light up as the pointer gets
 * close, falling off smoothly with distance — like a magnifier sliding
 * over the line. Works on touch too (drag a finger across).
 */

const ProximityText = ({ text = "Hover over these letters", radius = 110, maxScale = 1.6, lift = 0.18, color = "currentColor", activeColor = "#a3e635", className = "" }) => {
    const wrap = useRef(null);
    const letters = useRef([]);
    const pointer = useRef(null);

    useEffect(() => {
        let raf = 0;
        const amounts = letters.current.map(() => 0);
        const tick = () => {
            const p = pointer.current;
            letters.current.forEach((el, i) => {
                if (!el) return;
                let target = 0;
                if (p) {
                    const r = el.getBoundingClientRect();
                    const d = Math.hypot(p.x - (r.left + r.width / 2), p.y - (r.top + r.height / 2));
                    target = Math.max(0, 1 - d / radius);
                    target = target * target * (3 - 2 * target); // smoothstep
                }
                amounts[i] += (target - amounts[i]) * 0.2;
                const a = amounts[i];
                el.style.transform = `translateY(${-a * lift}em) scale(${1 + a * (maxScale - 1)})`;
                el.style.color = a > 0.02 ? `color-mix(in srgb, ${activeColor} ${Math.round(a * 100)}%, ${color})` : "";
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [radius, maxScale, lift, color, activeColor]);

    const words = text.split(" ");
    let n = 0;
    return (
        <span
            ref={wrap}
            className={`inline-flex touch-none flex-wrap justify-center gap-x-[0.3em] font-bold ${className}`}
            style={{ color }}
            onPointerMove={(e) => (pointer.current = { x: e.clientX, y: e.clientY })}
            onPointerLeave={() => (pointer.current = null)}
            aria-label={text}
        >
            {words.map((w, wi) => (
                <span key={wi} className="inline-flex" aria-hidden="true">
                    {Array.from(w).map((c) => {
                        const k = n++;
                        return (
                            <span key={k} ref={(el) => (letters.current[k] = el)} className="inline-block origin-bottom will-change-transform">
                                {c}
                            </span>
                        );
                    })}
                </span>
            ))}
        </span>
    );
};

export default ProximityText;
