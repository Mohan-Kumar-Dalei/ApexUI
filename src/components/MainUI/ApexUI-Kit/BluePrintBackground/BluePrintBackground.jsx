import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const BOX = 40;

function BluePrintBackground({ color = '#9ae600', borderColor = 'rgb(98, 116, 142, 0.1)', bgColor, circleColor = 'rgb(154, 230, 0, 0.2)' }) {
    const rootRef = useRef(null);
    const gridRef = useRef(null);
    const [grid, setGrid] = useState({ cols: 0, rows: 0 });
    const colorRef = useRef(color);
    const lastHighlighted = useRef(-1);

    useEffect(() => { colorRef.current = color; }, [color]);

    // Size the grid to the component itself (not the window), and keep it in sync.
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const measure = () => {
            const cols = Math.ceil(root.clientWidth / BOX) + 1;
            // rows are doubled so the -50% loop is seamless
            const rows = (Math.ceil(root.clientHeight / BOX) + 1) * 2;
            setGrid((g) => (g.cols === cols && g.rows === rows ? g : { cols, rows }));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        const el = gridRef.current;
        if (!root || !el) return undefined;

        const scroll = gsap.fromTo(el, { yPercent: 0 }, { yPercent: -50, duration: 15, repeat: -1, ease: "none" });

        const fadeOut = (index) => {
            const box = el.children[index];
            if (box) gsap.to(box, { backgroundColor: "rgba(0,0,0,0)", boxShadow: "0 0 0px rgba(0,0,0,0)", duration: 0.35, overwrite: "auto" });
        };

        // The hovered cell is calculated from the pointer position and the grid's
        // current scroll offset, so it also works under overlaid content.
        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();
            const inside = e.clientX >= rootRect.left && e.clientX <= rootRect.right && e.clientY >= rootRect.top && e.clientY <= rootRect.bottom;
            const cols = Math.round(rect.width / BOX);
            const col = Math.floor((e.clientX - rect.left) / BOX);
            const row = Math.floor((e.clientY - rect.top) / BOX);
            const index = inside && col >= 0 && col < cols && row >= 0 ? row * cols + col : -1;

            if (index === lastHighlighted.current) return;
            if (lastHighlighted.current !== -1) fadeOut(lastHighlighted.current);
            const box = index !== -1 ? el.children[index] : null;
            if (box) {
                const c = colorRef.current || "#a3e635";
                gsap.to(box, { backgroundColor: c, boxShadow: `0 0 12px ${c}`, duration: 0.12, overwrite: "auto" });
            }
            lastHighlighted.current = box ? index : -1;
        };

        window.addEventListener("pointermove", handleMove, { passive: true });
        return () => {
            window.removeEventListener("pointermove", handleMove);
            scroll.kill();
            gsap.killTweensOf(el.children);
            lastHighlighted.current = -1;
        };
    }, [grid]);

    const total = grid.cols * grid.rows;

    return (
        <div ref={rootRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-slate-800" style={bgColor ? { backgroundColor: bgColor } : undefined}>
            <div
                ref={gridRef}
                className="grid will-change-transform"
                style={{
                    gridTemplateColumns: `repeat(${grid.cols}, ${BOX}px)`,
                    gridTemplateRows: `repeat(${grid.rows}, ${BOX}px)`,
                }}
            >
                {Array.from({ length: total }, (_, i) => (
                    <div key={i} className="border bg-transparent w-10 h-10" style={{ borderColor }} />
                ))}
            </div>
            <div
                className="absolute inset-0 z-10 pointer-events-none blur-3xl"
                style={{ background: `radial-gradient(circle, ${circleColor} 0%, rgba(0, 0, 255, 0.1) 100%)` }}
            />
        </div>
    );
}

export default BluePrintBackground;
