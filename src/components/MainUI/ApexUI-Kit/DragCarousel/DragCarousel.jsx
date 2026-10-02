import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const DRAG_THRESHOLD = 40;

const getOffset = (i, active, length) => {
    let offset = i - active;
    if (offset > length / 2) offset -= length;
    if (offset < -length / 2) offset += length;
    return offset;
};

// Cards are centred with left: 50% + negative margin, so translateX only
// carries the carousel offset.
const cardTransform = (offset, shift = 0) => {
    const distance = Math.abs(offset + shift / 50);
    return `translateX(${offset * 50 + shift}%) translateZ(${-distance * 250}px) scale(${1 - Math.min(distance, 3) * 0.12})`;
};

const DragCarousel = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);
    const cardsRef = useRef([]);
    const proxyRef = useRef(null);
    const activeRef = useRef(0);
    const count = images.length;

    const go = useCallback((dir) => {
        if (count) setActiveIndex((i) => (i + dir + count) % count);
    }, [count]);

    useEffect(() => {
        activeRef.current = activeIndex;
        const cards = cardsRef.current.slice(0, count).filter(Boolean);
        gsap.to(cards, {
            duration: 0.6,
            ease: 'power3.out',
            overwrite: true,
            transform: (i) => cardTransform(getOffset(i, activeIndex, count)),
            zIndex: (i) => count - Math.abs(getOffset(i, activeIndex, count)),
            opacity: (i) => (Math.abs(getOffset(i, activeIndex, count)) > 2 ? 0 : 1),
        });
    }, [activeIndex, count]);

    // One Draggable for the component's lifetime; it reads the active index from a ref.
    useEffect(() => {
        if (!proxyRef.current || !count) return undefined;
        const [drag] = Draggable.create(proxyRef.current, {
            type: 'x',
            trigger: carouselRef.current,
            cursor: 'grab',
            activeCursor: 'grabbing',
            onDrag() {
                const w = carouselRef.current?.clientWidth || window.innerWidth;
                const shift = (this.x / w) * 100;
                cardsRef.current.slice(0, count).forEach((c, i) => {
                    if (!c) return;
                    const offset = getOffset(i, activeRef.current, count);
                    gsap.set(c, {
                        transform: cardTransform(offset, shift),
                        opacity: Math.abs(offset + shift / 50) > 2.5 ? 0 : 1,
                    });
                });
            },
            onDragEnd() {
                const moved = this.x;
                gsap.set(this.target, { x: 0 });
                if (moved < -DRAG_THRESHOLD) go(1);
                else if (moved > DRAG_THRESHOLD) go(-1);
                else {
                    // Not far enough: snap back to the current slide.
                    gsap.to(cardsRef.current.slice(0, count).filter(Boolean), {
                        duration: 0.5,
                        ease: 'power3.out',
                        transform: (i) => cardTransform(getOffset(i, activeRef.current, count)),
                        opacity: (i) => (Math.abs(getOffset(i, activeRef.current, count)) > 2 ? 0 : 1),
                    });
                }
            },
        });
        return () => drag.kill();
    }, [count, go]);

    if (!count) return null;

    return (
        <div
            ref={carouselRef}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') go(1);
                if (e.key === 'ArrowLeft') go(-1);
            }}
            className="relative w-full h-[490px] lg:h-[590px] cursor-grab overflow-x-clip outline-none select-none touch-pan-y"
            style={{ perspective: '1200px' }}
        >
            <div ref={proxyRef} className="absolute inset-0 z-20" />
            {images.map((src, index) => (
                <div
                    key={`${src}-${index}`}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="absolute top-[25px] left-1/2 h-[440px] w-[280px] -ml-[140px] sm:h-[480px] sm:w-[300px] sm:-ml-[150px] lg:h-[550px] lg:w-[350px] lg:-ml-[175px] rounded-xl overflow-hidden shadow-2xl will-change-transform"
                    style={{ transform: cardTransform(getOffset(index, 0, count)), opacity: Math.abs(getOffset(index, 0, count)) > 2 ? 0 : 1 }}
                >
                    <img src={src} alt={`Slide ${index + 1}`} draggable="false" className="w-full h-full object-cover pointer-events-none" />
                </div>
            ))}
        </div>
    );
};

export default DragCarousel;
