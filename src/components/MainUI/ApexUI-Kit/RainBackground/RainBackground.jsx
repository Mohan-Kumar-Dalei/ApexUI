import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const dropBackground = (dropColor, collisionColor, dropGradient) =>
    dropGradient || `linear-gradient(to bottom, ${dropColor} 60%, ${collisionColor} 100%)`;

function createSplash(x, y, container, collisionColor, collisionGradient) {
    const fill = collisionGradient || collisionColor;
    const splash = document.createElement("div");
    splash.className = "absolute z-50 h-2 w-2 pointer-events-none";
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.transform = "translate(-50%, 0)";

    const bar = document.createElement("div");
    Object.assign(bar.style, {
        position: "absolute", left: "-0.7rem", top: "0", width: "1.4rem", height: "0.18rem",
        borderRadius: "1rem", background: fill, filter: "blur(2px)", opacity: "0",
    });
    splash.appendChild(bar);

    const parts = [];
    for (let i = 0; i < 6; i++) {
        const span = document.createElement("span");
        Object.assign(span.style, {
            position: "absolute", height: "0.18rem", width: "0.18rem", borderRadius: "50%", background: fill,
        });
        splash.appendChild(span);
        parts.push(span);
    }
    container.appendChild(splash);

    const tl = gsap.timeline({ onComplete: () => splash.remove() });
    tl.to(bar, { opacity: 1, duration: 0.12, yoyo: true, repeat: 1 }, 0);
    parts.forEach((span) => {
        tl.to(span, {
            x: gsap.utils.random(-8, 8),
            y: gsap.utils.random(-12, -2),
            opacity: 0,
            duration: gsap.utils.random(0.2, 0.7),
            ease: "power2.out",
        }, 0);
    });
}

const RainBackground = ({ dropCount = 32, dropColor = '#fff', collisionColor = '#e0e7ff', dropGradient, collisionGradient }) => {
    const rainRef = useRef(null);

    useEffect(() => {
        const container = rainRef.current;
        if (!container) return undefined;

        let height = container.offsetHeight;
        const ro = new ResizeObserver(() => { height = container.offsetHeight; });
        ro.observe(container);

        // Drops re-schedule themselves, so an `alive` flag plus killing every
        // tween on unmount stops them instead of leaving them running forever.
        let alive = true;
        const ctx = gsap.context(() => {
            const fall = (drop) => {
                if (!alive) return;
                const dropHeight = gsap.utils.random(16, 48);
                Object.assign(drop.style, {
                    left: `${gsap.utils.random(0, 98)}%`,
                    height: `${dropHeight}px`,
                    background: dropBackground(dropColor, collisionColor, dropGradient),
                });
                gsap.set(drop, { y: 0, opacity: gsap.utils.random(0.3, 0.6) });

                const distance = Math.max(height, 1) + 40;
                gsap.to(drop, {
                    y: distance,
                    duration: gsap.utils.random(0.8, 2),
                    ease: 'power1.in',
                    onComplete: () => {
                        if (!alive) return;
                        // Splash where the drop meets the bottom edge.
                        const x = (parseFloat(drop.style.left) / 100) * container.offsetWidth;
                        createSplash(x, height - 8, container, collisionColor, collisionGradient);
                        fall(drop);
                    },
                });
            };

            for (let i = 0; i < dropCount; i++) {
                const drop = document.createElement('div');
                drop.className = 'pointer-events-none';
                Object.assign(drop.style, {
                    position: 'absolute',
                    top: `${gsap.utils.random(-120, -20)}px`,
                    width: '2px',
                    borderRadius: '1px',
                    zIndex: 1,
                    willChange: 'transform',
                });
                container.appendChild(drop);
                gsap.delayedCall(gsap.utils.random(0, 1.5), () => fall(drop));
            }
        }, container);

        return () => {
            alive = false;
            ctx.revert();
            gsap.killTweensOf(container.querySelectorAll('*'));
            ro.disconnect();
            container.innerHTML = '';
        };
    }, [dropCount, dropColor, collisionColor, dropGradient, collisionGradient]);

    return (
        <div ref={rainRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" />
    );
};

export default RainBackground;
