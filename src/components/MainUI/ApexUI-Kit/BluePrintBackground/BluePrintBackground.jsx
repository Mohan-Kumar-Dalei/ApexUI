import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function BluePrintBackground({ color = '#9ae600', borderColor = 'rgb(98, 116, 142, 0.1)', bgColor, circleColor = 'rgb(154, 230, 0, 0.2)'}) {
    const gridRef = useRef(null);
    const [grid, setGrid] = useState({ cols: 0, rows: 0 });
    const boxSize = 40;
    const lastHighlighted = useRef(null);
    const colorRef = useRef(color);

    // Effect 1: calculate grid size and keep it updated on resize
    useEffect(() => {
        const calculateGrid = () => {
            const cols = Math.ceil(window.innerWidth / boxSize);
            const rows = Math.ceil(window.innerHeight / boxSize) * 2; // double rows for infinite scroll
            // kill any child tweens before we replace children to avoid visual flicker
            const el = gridRef.current;
            if (el) {
                try { gsap.killTweensOf(el); } catch { /* ignore */ }
                Array.from(el.children).forEach((c) => { try { gsap.killTweensOf(c); } catch { /* ignore */ } });
                lastHighlighted.current = null;
            }
            setGrid({ cols, rows });
        };

        calculateGrid();
        window.addEventListener("resize", calculateGrid);
        return () => window.removeEventListener("resize", calculateGrid);
    }, []);

    // keep colorRef up-to-date without forcing effect re-run
    useEffect(() => { colorRef.current = color; }, [color]);

    // Effect 2: initialize GSAP infinite scroll and mouse handlers once (do not recreate on grid changes)
    useEffect(() => {
        const el = gridRef.current;
        let scrollTween = null;

        if (el) {
            // make sure we start from current transform so GSAP doesn't jump
            // create a looping tween on the container only once
            scrollTween = gsap.to(el, {
                y: "-50%",
                duration: 15,
                repeat: -1,
                ease: "linear",
                overwrite: false,
            });
        }

        const handleMouseMove = (e) => {
            const el2 = gridRef.current;
            if (!el2) return;

            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (!target || !el2.contains(target)) {
                if (lastHighlighted.current !== null) {
                    const prev = el2.children[lastHighlighted.current];
                    if (prev) gsap.to(prev, { backgroundColor: "transparent", boxShadow: "none", duration: 0.18 });
                    lastHighlighted.current = null;
                }
                return;
            }

            const child = target.closest("div");
            const index = Array.prototype.indexOf.call(el2.children, child);
            if (index === -1) return;

            if (lastHighlighted.current !== index) {
                if (lastHighlighted.current !== null) {
                    const prevBox = el2.children[lastHighlighted.current];
                    if (prevBox) gsap.to(prevBox, { backgroundColor: "transparent", boxShadow: "none", duration: 0.18 });
                }

                const newBox = el2.children[index];
                if (newBox) {
                    const c = colorRef.current || "#a3e635";
                    gsap.to(newBox, { backgroundColor: c, boxShadow: `0 0 12px ${c}`, duration: 0.12 });
                }

                lastHighlighted.current = index;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (scrollTween && typeof scrollTween.kill === "function") {
                try { scrollTween.kill(); } catch { /* ignore */ }
            }
            if (el) {
                try { gsap.killTweensOf(el); } catch { /* ignore */ }
                Array.from(el.children).forEach((c) => { try { gsap.killTweensOf(c); } catch { /* ignore */ } });
            }
            lastHighlighted.current = null;
        };
    }, []);

    const total = grid.cols * grid.rows;

    return (
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-slate-800" style={{ backgroundColor: `${bgColor}` }}>
            <div
                ref={gridRef}
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${grid.cols}, ${boxSize}px)`,
                    gridTemplateRows: `repeat(${grid.rows}, ${boxSize}px)`,
                }}
            >
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`border bg-transparent w-10 h-10`}
                        style={{
                            borderColor: borderColor
                        }}
                    />
                ))}
            </div>
            {/* Spotlight overlay - positioned after grid to not interfere with scroll */}
            <div
                className="absolute inset-0 z-10 pointer-events-none blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${circleColor} 0%, rgba(0, 0, 255, 0.1) 100%)`
                }}
            />
        </div >
    );
}

export default BluePrintBackground;