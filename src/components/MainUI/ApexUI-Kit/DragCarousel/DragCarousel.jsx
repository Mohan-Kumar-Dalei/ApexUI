import React, { useState, useEffect, useRef } from 'react';

// To use GSAP in this environment, we'll import it from a CDN.
// In a local project: `npm install gsap`
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

// GSAP Draggable plugin ko register karna zaroori hai
gsap.registerPlugin(Draggable);

// --- GSAP Drag Carousel Component ---
const DragCarousel = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);
    const cardsRef = useRef([]);
    const dragProxyRef = useRef(null);
    useEffect(() => {
        const cards = cardsRef.current;
        gsap.to(cards, {
            duration: 0.4,
            ease: 'power4.Out',
            stagger: 0.05,
            // Har card ke liye naya transform calculate karta hai
            transform: (i) => {
                let positionOffset = i - activeIndex;
                if (positionOffset > images.length / 2) {
                    positionOffset -= images.length;
                } else if (positionOffset < -images.length / 2) {
                    positionOffset += images.length;
                }

                const translateX = positionOffset * 50;
                const translateZ = -Math.abs(positionOffset) * 250;
                const scale = 1 - Math.abs(positionOffset) * 0.15;

                return `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`;
            },
            zIndex: (i) => {
                let positionOffset = i - activeIndex;
                if (positionOffset > images.length / 2) positionOffset -= images.length;
                if (positionOffset < -images.length / 2) positionOffset += images.length;
                return images.length - Math.abs(positionOffset);
            },
            opacity: (i) => {
                let positionOffset = i - activeIndex;
                if (positionOffset > images.length / 2) positionOffset -= images.length;
                if (positionOffset < -images.length / 2) positionOffset += images.length;
                return Math.abs(positionOffset) > 2 ? 0 : 1;
            }
        });
    }, [activeIndex, images.length]);

    // GSAP Draggable ko setup karta hai
    useEffect(() => {
        // BUG FIX: Draggable ab proxy element par lagaya gaya hai
        const draggableInstance = Draggable.create(dragProxyRef.current, {
            type: "x",
            trigger: carouselRef.current,
            inertia: true,
            cursor: 'grab',
            activeCursor: 'grabbing',
            onDragEnd: function () {
                gsap.to(this.target, { x: 0, duration: 0.3 });
                if (this.getDirection("start") === "left") {
                    setActiveIndex(prev => (prev + 1) % images.length);
                } else if (this.getDirection("start") === "right") {
                    setActiveIndex(prev => (prev - 1 + images.length) % images.length);
                }
            }
        });

        // Cleanup function
        return () => {
            if (draggableInstance && draggableInstance[0]) {
                draggableInstance[0].kill();
            }
        };
    }, [images.length]);

    return (
        <div
            ref={carouselRef}
            className="relative w-full h-[490px] lg:h-[590px] cursor-grab"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
            <div ref={dragProxyRef} className="absolute inset-0 z-20"></div>

            {images.map((src, index) => (
                <div
                    key={index}
                    ref={el => cardsRef.current[index] = el}
                    className="card-item absolute h-[480px] w-[300px] lg:h-[550px] lg:w-[350px] rounded-xl overflow-hidden shadow-2xl top-[25px] -left-4 md:left-36 lg:left-70"
                >
                    <img
                        src={src}
                        alt={`carousel-item-${index}`}
                        className="w-full h-full object-cover pointer-events-none"
                    />
                </div>
            ))}
        </div>
    );
};

export default DragCarousel;
