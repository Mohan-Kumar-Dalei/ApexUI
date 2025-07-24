import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
function createRainEffectWithCollision(container, dropCount = 36, dropColor, collisionColor, dropGradient, collisionGradient) {
    if (!container) return;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop pointer-events-none';
        drop.style.position = 'absolute';
        drop.style.left = Math.random() * 98 + '%';
        drop.style.top = Math.random() * -100 - 20 + 'px';
        drop.style.width = '2px';
        drop.style.height = Math.random() * 32 + 16 + 'px';
        drop.style.background = dropGradient ? dropGradient : `linear-gradient(to bottom, ${dropColor} 60%, ${collisionColor} 100%)`;
        drop.style.opacity = Math.random() * 0.3 + 0.15;
        drop.style.borderRadius = '1px';
        drop.style.zIndex = 1;
        container.appendChild(drop);
        animateRainDropWithCollision(drop, container, collisionColor, dropGradient, collisionGradient, dropColor);
    }
}

function animateRainDropWithCollision(drop, container, collisionColor, dropGradient, collisionGradient, dropColor) {
    const duration = Math.random() * 1.2 + 0.8;
    gsap.fromTo(drop, {
        y: 0,
        opacity: drop.style.opacity
    }, {
        y: container.offsetHeight + 40,
        opacity: 0.05,
        duration,
        ease: 'power1.in',
        onUpdate: function () {
            const rect = drop.getBoundingClientRect();
            const parentRect = container.getBoundingClientRect();
            if (!drop._collided && rect.bottom >= parentRect.bottom - 8) {
                drop._collided = true;
                drop.style.background = collisionGradient ? collisionGradient : collisionColor;
                const relX = rect.left - parentRect.left + rect.width / 2;
                createRainCollisionExplosion(relX, container.offsetHeight - 8, container, collisionColor, collisionGradient);
            }
        },
        onStart: function () {
            drop._collided = false;
            drop.style.background = dropGradient ? dropGradient : `linear-gradient(to bottom, ${dropColor} 60%, ${collisionColor} 100%)`;
        },
        onComplete: () => {
            drop.style.left = Math.random() * 98 + '%';
            drop.style.height = Math.random() * 32 + 16 + 'px';
            drop.style.opacity = Math.random() * 0.3 + 0.15;
            drop.style.background = dropGradient ? dropGradient : `linear-gradient(to bottom, ${dropColor} 60%, ${collisionColor} 100%)`;
            gsap.set(drop, { y: 0, opacity: drop.style.opacity });
            animateRainDropWithCollision(drop, container, collisionColor, dropGradient, collisionGradient, dropColor);
        }
    });
}

function createRainCollisionExplosion(x, y, container, collisionColor = '#e0e7ff', collisionGradient) {
    const explosion = document.createElement("div");
    explosion.className = "absolute z-50 h-2 w-2 pointer-events-none";
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    explosion.style.transform = "translate(-50%, 0)";
    const blurBar = document.createElement("div");
    blurBar.style.position = "absolute";
    blurBar.style.left = "-0.7rem";
    blurBar.style.top = "0";
    blurBar.style.width = "1.4rem";
    blurBar.style.height = "0.18rem";
    blurBar.style.borderRadius = "1rem";
    blurBar.style.background = collisionGradient ? collisionGradient : `${collisionColor}`;
    blurBar.style.filter = "blur(2px)";
    explosion.appendChild(blurBar);
    for (let i = 0; i < 6; i++) {
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.height = "0.18rem";
        span.style.width = "0.18rem";
        span.style.borderRadius = "50%";
        span.style.background = collisionGradient ? collisionGradient : `${collisionColor}`;
        explosion.appendChild(span);
        const dx = Math.floor(Math.random() * 16 - 8);
        const dy = Math.floor(Math.random() * -10 - 2);
        gsap.fromTo(span, { x: 0, y: 0, opacity: 1 }, {
            x: dx,
            y: dy,
            opacity: 0,
            duration: Math.random() * 0.5 + 0.2,
            ease: "power2.out",
            onComplete: () => { span.remove(); }
        });
    }
    gsap.fromTo(blurBar, { opacity: 0 }, { opacity: 1, duration: 0.12, yoyo: true, repeat: 1, onComplete: () => blurBar.remove() });
    setTimeout(() => explosion.remove(), 500);
    container.appendChild(explosion);
}

const RainBackground = ({ dropCount = 32, dropColor = '#fff', collisionColor = '#e0e7ff', dropGradient, collisionGradient }) => {
    const rainRef = useRef(null);
    useEffect(() => {
        const container = rainRef.current;
        if (!container) return;
        createRainEffectWithCollision(container, dropCount, dropColor, collisionColor, dropGradient, collisionGradient);
        return () => { container.innerHTML = ''; };
    }, [dropCount, dropColor, collisionColor, dropGradient, collisionGradient]);
    return (
        <div ref={rainRef} id="beams-collision-container" className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'hidden' }} />
    );
};

export default RainBackground;