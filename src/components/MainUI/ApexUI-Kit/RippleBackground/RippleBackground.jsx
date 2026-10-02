import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

const DEFAULT_COLORS = ["#10b981", "#06b6d4", "#6366f1", "#a855f7"];

const RippleBackground = ({
    children,
    className = "",
    containerClassName = "",
    colors,
    desktopGridSize = 20,
    mobileGridSize = 10,
}) => {
    const rootRef = useRef(null);
    // Each cell has two layers: the outer one reacts to hover / click, the inner
    // dot keeps blinking. Separate elements mean hovering no longer cancels the blink.
    const cellsRef = useRef([]);
    const dotsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const gridSize = isMobile ? mobileGridSize : desktopGridSize;
    const shapeColors = colors?.length ? colors : DEFAULT_COLORS;

    useLayoutEffect(() => {
        const dots = dotsRef.current.slice(0, gridSize * gridSize).filter(Boolean);
        if (!dots.length) return undefined;
        if (isMobile) {
            gsap.set(dots, { scale: 1, opacity: 0.3 });
            return undefined;
        }
        const ctx = gsap.context(() => {
            dots.forEach((dot) => {
                gsap.to(dot, {
                    scale: () => gsap.utils.random(0.5, 2),
                    opacity: () => gsap.utils.random(0.3, 1),
                    duration: 2,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    repeatRefresh: true,
                    delay: Math.random() * 2,
                });
            });
        });
        return () => ctx.revert();
    }, [gridSize, isMobile]);

    const handleClick = (e) => {
        const { clientX, clientY } = e;
        cellsRef.current.slice(0, gridSize * gridSize).forEach((cell) => {
            if (!cell) return;
            const rect = cell.getBoundingClientRect();
            const distance = Math.hypot(rect.left + rect.width / 2 - clientX, rect.top + rect.height / 2 - clientY);
            gsap.timeline({ delay: distance * 0.0025 })
                .to(cell, { scale: 2.5, duration: 0.3, ease: "power2.out", overwrite: "auto" })
                .to(cell, { scale: 1, duration: 0.6, ease: "power2.inOut" });
        });
    };

    const hover = (i, on) => {
        const cell = cellsRef.current[i];
        if (cell) gsap.to(cell, { scale: on ? 2 : 1, duration: on ? 0.3 : 1.2, ease: 'power2.out', overwrite: 'auto' });
    };

    return (
        <div
            ref={rootRef}
            className={`relative h-[60vh] lg:h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden ${containerClassName}`}
            onClick={handleClick}
        >
            <div
                className="absolute inset-0 z-0 w-full h-full grid"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}
            >
                {Array.from({ length: gridSize * gridSize }, (_, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex items-center justify-center"
                        onMouseEnter={() => hover(index, true)}
                        onMouseLeave={() => hover(index, false)}
                    >
                        <div ref={(el) => (cellsRef.current[index] = el)} className="pointer-events-none will-change-transform">
                            <div
                                ref={(el) => (dotsRef.current[index] = el)}
                                className="w-2 h-2 rounded-full will-change-transform"
                                style={{ backgroundColor: shapeColors[index % shapeColors.length], opacity: 0.3 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={`relative z-10 ${className}`}>{children}</div>
        </div>
    );
};

export default RippleBackground;
