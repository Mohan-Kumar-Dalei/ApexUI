import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, User } from 'lucide-react';

// Each layer moves by a different factor of the tilt to create depth.
const LAYER_DEPTH = [0.8, 1.5, 1.2, 1.1];

const ParallaxCardItem = ({ card, tiltEnable, glareEnable, scale, perspective }) => {
    const cardRef = useRef(null);
    const layerRefs = useRef([]);
    const glareRef = useRef(null);

    useEffect(() => {
        const cardEl = cardRef.current;
        if (!cardEl || !tiltEnable) return undefined;

        gsap.set(cardEl, { transformPerspective: perspective });
        const to = (el, prop, duration) => gsap.quickTo(el, prop, { duration, ease: 'power3.out' });
        const rotX = to(cardEl, 'rotationX', 0.8);
        const rotY = to(cardEl, 'rotationY', 0.8);
        const scl = to(cardEl, 'scale', 0.8);
        const layerEls = layerRefs.current.filter(Boolean);
        const layers = layerEls.map((el, i) => ({
            x: to(el, 'x', 0.7 + i * 0.1),
            y: to(el, 'y', 0.7 + i * 0.1),
            depth: LAYER_DEPTH[i] ?? 1,
        }));
        const glare = glareRef.current;

        const handleMove = (e) => {
            const { left, top, width, height } = cardEl.getBoundingClientRect();
            const px = (e.clientX - left) / width;
            const py = (e.clientY - top) / height;
            const rotateX = (py - 0.5) * -24;
            const rotateY = (px - 0.5) * 24;
            rotX(rotateX);
            rotY(rotateY);
            scl(scale);
            layers.forEach((l) => {
                l.x(rotateY * l.depth);
                l.y(-rotateX * l.depth);
            });
            if (glare) glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.18), transparent 55%)`;
        };

        const handleLeave = () => {
            rotX(0);
            rotY(0);
            scl(1);
            layers.forEach((l) => {
                l.x(0);
                l.y(0);
            });
        };

        cardEl.addEventListener('pointermove', handleMove);
        cardEl.addEventListener('pointerleave', handleLeave);
        return () => {
            cardEl.removeEventListener('pointermove', handleMove);
            cardEl.removeEventListener('pointerleave', handleLeave);
            gsap.killTweensOf([cardEl, ...layerEls]);
        };
    }, [tiltEnable, scale, perspective]);

    const layer = (i) => (el) => (layerRefs.current[i] = el);

    return (
        <div ref={cardRef} className="w-full max-w-md rounded-2xl will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            <div
                className="relative w-full h-full bg-stone-950 rounded-2xl p-8 border border-lime-500/20 shadow-2xl shadow-lime-900/40 overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {glareEnable && (
                    <div
                        ref={glareRef}
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-0"
                        style={{ transform: 'translateZ(100px)' }}
                    />
                )}

                <div className="relative z-10 flex flex-col h-full">
                    <div ref={layer(0)} className="text-start" style={{ transform: 'translateZ(40px)' }}>
                        <div className="flex items-center gap-3 text-white">
                            <User />
                            <h2 className="text-xl md:text-3xl font-bold">{card.title}</h2>
                        </div>
                        <p className="text-lime-400 mt-1">{card.subtitle}</p>
                    </div>

                    <div ref={layer(1)} className="my-6" style={{ transform: 'translateZ(80px)' }}>
                        <img src={card.imageUrl} alt={card.title} loading="lazy" draggable="false" className="w-full h-44 md:h-56 object-cover rounded-lg shadow-lg shadow-black/40" />
                    </div>

                    <div ref={layer(2)} className="text-start" style={{ transform: 'translateZ(30px)' }}>
                        <p className="text-slate-400 md:text-sm text-xs mb-6">{card.description}</p>
                    </div>
                    {card.link && (
                        <div ref={layer(3)} className="flex items-center justify-end" style={{ transform: 'translateZ(30px)' }}>
                            <a href={card.link} className="border border-lime-400 py-2 px-3 rounded-full flex items-center gap-2 font-medium text-white group hover:text-lime-400 transition-colors duration-300">
                                {card.buttonText ?? 'Learn More'}
                                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ParallaxCard = ({ cardData = [], tiltEnable = true, glareEnable = true, scale = 1.05, perspective = 1000 }) => (
    <div className="flex flex-wrap gap-8 justify-center w-full">
        {cardData.map((card, idx) => (
            <ParallaxCardItem
                key={card.id ?? card.title ?? idx}
                card={card}
                tiltEnable={tiltEnable}
                glareEnable={glareEnable}
                scale={scale}
                perspective={perspective}
            />
        ))}
    </div>
);

export default ParallaxCard;
