import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
function BluePrintBackground() {
    const gridRef = useRef(null);
    const [grid, setGrid] = useState({ cols: 0, rows: 0 });
    const boxSize = 40;
    const lastHighlighted = useRef(null);
    const scrollY = useRef(0); // grid ka scroll offset track karne ke liye

    useEffect(() => {
        // Responsive grid calculation
        const calculateGrid = () => {
            const cols = Math.ceil(window.innerWidth / boxSize);
            const rows = Math.ceil(window.innerHeight / boxSize) * 2; // double rows for infinite scroll
            setGrid({ cols, rows });
        };

        calculateGrid();
        window.addEventListener("resize", calculateGrid);

        // store references so cleanup can access the right elements
        let scrollTween = null;
        const gridEl = gridRef.current;

        // Infinite scroll with onUpdate offset tracking
        if (gridEl) {
            scrollTween = gsap.to(gridEl, {
                y: "-50%",
                duration: 15,
                repeat: -1,
                ease: "linear",
                onUpdate: function () {
                    // Guard the ref; it might be null during unmount
                    const el = gridRef.current;
                    if (!el) return;

                    // GSAP ke animation ke hisaab se grid ka actual offset nikal lo
                    const matrix = window.getComputedStyle(el).transform;
                    if (matrix && matrix !== "none") {
                        const MatrixClass = window.WebKitCSSMatrix ? window.WebKitCSSMatrix : window.DOMMatrix;
                        try {
                            const m = new MatrixClass(matrix);
                            scrollY.current = m.m42;
                        } catch {
                            /* ignore parsing errors */
                        }
                    }
                },
            });
        }

        // Mouse hover exact highlight
        const handleMouseMove = (e) => {
            const el = gridRef.current;
            if (!el) return;

            // Mouse position ke saath grid scroll offset adjust karna hoga
            const adjustedY = e.clientY - scrollY.current;

            const col = Math.floor(e.clientX / boxSize);
            const row = Math.floor(adjustedY / boxSize);

            if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return;

            const index = row * grid.cols + col;

            if (lastHighlighted.current !== index) {
                // Purana box reset
                if (lastHighlighted.current !== null) {
                    const prevBox = el.children[lastHighlighted.current];
                    if (prevBox) {
                        prevBox.style.backgroundColor = "transparent";
                        prevBox.style.boxShadow = "none";
                        gsap.to(prevBox, {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            duration: 0.3,
                        });
                    }
                }

                // Naya box highlight
                const newBox = el.children[index];
                if (newBox) {
                    gsap.to(newBox, {
                        backgroundColor: "#a3e635",
                        boxShadow: "0 0 12px #a3e635",
                        duration: 0.2,
                    });
                }

                lastHighlighted.current = index;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", calculateGrid);

            // kill the main scroll tween and any tweens on the grid/children to avoid GSAP touching removed nodes
            if (scrollTween && typeof scrollTween.kill === "function") {
                try {
                    scrollTween.kill();
                } catch {
                    /* ignore */
                }
            }

            const finalEl = gridEl;
            if (finalEl) {
                try {
                    gsap.killTweensOf(finalEl);
                } catch {
                    /* ignore */
                }
                Array.from(finalEl.children).forEach((c) => {
                    if (c) {
                        try {
                            gsap.killTweensOf(c);
                        } catch {
                            /* ignore */
                        }
                    }
                });
            }

            lastHighlighted.current = null;
        };
    }, [grid.cols, grid.rows]);

    const total = grid.cols * grid.rows;

    return (
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
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
                        className="border border-slate-700/30 bg-transparent w-10 h-10"
                    />
                ))}
            </div>
        </div>
    );
}

export default BluePrintBackground;
