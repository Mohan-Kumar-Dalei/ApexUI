import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { User } from 'lucide-react';

// --- Multi-Layered 3D Parallax Card Component ---
const ParallaxCard = ({ cardData = [], tiltEnable, glareEnable, scale, perspective }) => {
    // Helper for per-card refs
    const cardRefs = useRef([]);
    const titleRefs = useRef([]);
    const imageRefs = useRef([]);
    const descRefs = useRef([]);
    const buttonRefs = useRef([]);
    const linkRefs = useRef([]);

    useEffect(() => {
        cardData.forEach((_, idx) => {
            const cardElement = cardRefs.current[idx];
            const titleElement = titleRefs.current[idx];
            const imageElement = imageRefs.current[idx];
            const descElement = descRefs.current[idx];
            const buttonElement = buttonRefs.current[idx];
            const linkElement = linkRefs.current[idx];

            if (!cardElement) return;

            const handleMouseMove = (e) => {
                if (!tiltEnable) return;
                const { left, top, width, height } = cardElement.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                const rotateX = (y / height - 0.5) * -30;
                const rotateY = (x / width - 0.5) * 30;

                gsap.to(cardElement, {
                    duration: 1,
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: scale,
                    ease: "power3.out",
                });

                gsap.to(titleElement, { duration: 0.7, x: rotateY * 0.8, y: -rotateX * 0.8 });
                gsap.to(imageElement, { duration: 0.8, x: rotateY * 1.5, y: -rotateX * 1.5 });
                gsap.to(descElement, { duration: 0.9, x: rotateY * 1.2, y: -rotateX * 1.2 });
                gsap.to(buttonElement, { duration: 1, x: rotateY * 1.1, y: -rotateX * 1.1 });
                gsap.to(linkElement, { duration: 1, x: rotateY * 1.1, y: -rotateX * 1.1 });
            };

            const handleMouseLeave = () => {
                if (tiltEnable) {
                    gsap.to(cardElement, {
                        duration: 1.2,
                        rotationX: 0,
                        rotationY: 0,
                        scale: 1,
                        ease: "elastic.out(1, 0.5)",
                    });
                    gsap.to([titleElement, imageElement, descElement, buttonElement, linkElement], {
                        duration: 1.2,
                        x: 0,
                        y: 0,
                        ease: "elastic.out(1, 0.5)",
                    });
                }
            };

            cardElement.addEventListener("mousemove", handleMouseMove);
            cardElement.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                cardElement.removeEventListener("mousemove", handleMouseMove);
                cardElement.removeEventListener("mouseleave", handleMouseLeave);
            };
        });
    }, [cardData, tiltEnable, scale]);

    return (
        <div className="flex flex-wrap gap-8 justify-center">
            {cardData.map((card, idx) => (
                <div
                    key={idx}
                    ref={el => cardRefs.current[idx] = el}
                    className="w-full max-w-md rounded-2xl"
                    style={{ transformStyle: 'preserve-3d', perspective: `${perspective}px` }}
                >
                    <div className="relative md:w-full w-70 h-[50vh] md:h-full  bg-stone-950 rounded-2xl p-8 border border-lime-500/20 shadow-2 shadow-lime-900/40 overflow-hidden"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {glareEnable && (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none z-0" style={{ transform: 'translateZ(100px)' }}></div>
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            <div ref={el => titleRefs.current[idx] = el} className="text-start" style={{ transform: 'translateZ(40px)' }}>
                                <div className='flex items-center gap-3'>
                                    <User /> <h2 className="md:text-3xl font-bold text-white">{card.title}</h2>

                                </div>
                                <p className="text-lime-400 mt-1">{card.subtitle}</p>
                            </div>

                            <div ref={el => imageRefs.current[idx] = el} className="my-6" style={{ transform: 'translateZ(80px)' }}>
                                <img
                                    src={card.imageUrl}
                                    alt={card.title}
                                    className="w-full md:h-56 object-cover rounded-lg shadow-lg shadow-black/40"
                                />
                            </div>

                            <div ref={el => descRefs.current[idx] = el} className="text-start" style={{ transform: 'translateZ(30px)' }}>
                                <p className="text-slate-400 md:text-sm text-xs mb-6">{card.description}</p>
                            </div>
                            <div ref={el => buttonRefs.current[idx] = el} className="text-center flex items-center justify-end" style={{ transform: 'translateZ(30px)' }}>
                                <a href={card.link} className="border border-lime-400 py-2 px-3 rounded-full flex items-center gap-2 font-medium text-white group hover:text-lime-400 transition-colors duration-300">
                                    Learn More <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ParallaxCard;