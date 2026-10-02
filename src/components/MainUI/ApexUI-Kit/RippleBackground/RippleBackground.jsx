import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

// --- RippleBackground Component (Optimized for Mobile) ---
const RippleBackground = ({
    children,
    className,
    containerClassName,
    colors,
    desktopGridSize = 20, // Grid size for desktop
    mobileGridSize = 10,  // Grid size for mobile
}) => {
    const containerRef = useRef(null);
    const shapesRef = useRef([]);
    const [gridSize, setGridSize] = useState(desktopGridSize);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size to determine if it's mobile
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileDevice = window.innerWidth < 768;
            setIsMobile(isMobileDevice);
            setGridSize(isMobileDevice ? mobileGridSize : desktopGridSize);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [mobileGridSize, desktopGridSize]);


    const shapeColors = colors ?? [
        "#10b981", // emerald-500
        "#06b6d4", // cyan-500
        "#6366f1", // indigo-500
        "#a855f7", // purple-500
    ];

    // Handles the ripple effect on click
    const handleClick = (e) => {
        const { clientX, clientY } = e;
        const shapes = shapesRef.current;

        shapes.forEach(shape => {
            if (!shape) return;
            const rect = shape.getBoundingClientRect();
            const dx = rect.left + rect.width / 2 - clientX;
            const dy = rect.top + rect.height / 2 - clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const delay = distance * 0.005; // Ripple delay based on distance

            gsap.timeline({ defaults: { overwrite: 'auto' } })
                .to(shape, {
                    scale: 2.5,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    delay: delay
                })
                .to(shape, {
                    scale: 1,
                    opacity: 0.5,
                    duration: 0.5,
                    ease: "power2.in"
                });
        });
    };

    // Handles micro-interaction on hover
    const handleMouseEnter = (shape) => {
        gsap.to(shape, {
            scale: 2,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    };

    const handleMouseLeave = (shape) => {
        // Returns the shape to its normal blinking state
        gsap.to(shape, {
            scale: 1,
            opacity: 0.3,
            duration: 2,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    };

    // Continuous blinking animation
    useLayoutEffect(() => {
        const shapes = shapesRef.current.filter(s => s);
        if (shapes.length === 0) return;

        // On mobile, we disable the heavy continuous animation for better performance
        if (isMobile) {
            // Set a default static state for mobile
            gsap.set(shapes, { scale: 1, opacity: 0.3 });
            return;
        }

        const masterTl = gsap.timeline({ repeat: -1, yoyo: true });

        shapes.forEach(shape => {
            masterTl.to(shape, {
                scale: () => Math.random() * 1.5 + 0.5,
                opacity: () => Math.random() * 0.7 + 0.3,
                duration: 2,
                ease: "sine.inOut",
            }, Math.random() * 2); // Random start time for each shape
        });

        return () => {
            masterTl.kill(); // Cleanup the timeline
        };
    }, [gridSize, isMobile]); // Rerun effect if grid size or mobile status changes

    return (
        <div
            className={`relative h-[60vh] lg:h-[80vh] w-screen flex flex-col items-center justify-center overflow-hidden ${containerClassName}`}
            onClick={handleClick} // Click event listener on the main container
        >
            {/* Shapes Grid Container */}
            <div
                ref={containerRef}
                className="absolute inset-0 z-0 w-full h-full grid"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex items-center justify-center"
                        onMouseEnter={() => handleMouseEnter(shapesRef.current[index])}
                        onMouseLeave={() => handleMouseLeave(shapesRef.current[index])}
                    >
                        <div
                            ref={el => shapesRef.current[index] = el}
                            className="w-2 h-2 rounded-full pointer-events-none"
                            style={{
                                backgroundColor: shapeColors[index % shapeColors.length],
                                // Performance optimization for animations
                                willChange: 'transform, opacity',
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className={`relative z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default RippleBackground;