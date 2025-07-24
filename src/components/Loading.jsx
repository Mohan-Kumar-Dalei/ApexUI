import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const phrases = [
    "Loading Apex UI stack...",
];

export default function ModernLoader({ onFinish }) {
    const container = useRef(null);
    const ringRef = useRef(null);
    const logoRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Spinning neon ring
        gsap.to(ringRef.current, {
            rotate: 360,
            duration: 4,
            ease: "linear",
            repeat: -1,
            transformOrigin: "50% 50%",
        });

        // Logo bounce fade-in
        tl.fromTo(
            logoRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2 }
        );

        // Phrase animations
        phrases.forEach((text,) => {
            tl.to(textRef.current, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    textRef.current.innerText = text;
                },
            });
            tl.to(textRef.current, {
                opacity: 1,
                duration: 0.6,
            });
            tl.to(textRef.current, { delay: 0.6 }); // hold before next
        });

        // Exit animation
        tl.to(container.current, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => onFinish?.(),
        });

        return () => tl.kill();
    }, [onFinish]);

    return (
        <div
            ref={container}
            className="fixed inset-0 bg-black flex items-center justify-center"
        >
            <div className="relative flex flex-col items-center space-y-4">
                {/* Glowing spinning ring */}
                <div className="relative w-28 h-28">
                    <div
                        ref={ringRef}
                        className="absolute w-full h-full rounded-full border-t-4 border-pink-500 opacity-80"
                    />
                    <div className="absolute inset-2 rounded-full bg-black shadow-inner flex items-center justify-center">
                        <div
                            ref={logoRef}
                            className="text-white text-2xl font-bold tracking-widest"
                        >
                            ApexUI
                        </div>
                    </div>
                </div>

                {/* Text reveal */}
                <div
                    ref={textRef}
                    className="text-sm text-gray-300 font-mono tracking-wide text-center"
                >
                    {phrases[0]}
                </div>
            </div>
        </div>
    );
}
