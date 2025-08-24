import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ModernLoader({ onFinish }) {
    const containerRef = useRef(null);
    const statusRef = useRef(null);
    const versionRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressContainerRef = useRef(null);
    const helloRef = useRef(null);

    // Naye rolling counter ke liye refs
    const counterContainerRef = useRef(null);
    const counter1Ref = useRef(null);
    const counter2Ref = useRef(null);
    const counter3Ref = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        const helloChars = gsap.utils.toArray(helloRef.current.children);

        // --- Counter ke liye dynamic numbers add karein ---
        const counter3 = counter3Ref.current;
        if (counter3) {
            // Pehle se maujood numbers ko clear karein taaki multiple renders par add na ho
            counter3.innerHTML = '<div class="num">0</div><div class="num">1</div><div class="num">2</div><div class="num">3</div><div class="num">4</div><div class="num">5</div><div class="num">6</div><div class="num">7</div><div class="num">8</div><div class="num">9</div>';
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 10; j++) {
                    const div = document.createElement("div");
                    div.className = "num";
                    div.textContent = j;
                    counter3.appendChild(div);
                }
            }
            const finalDiv = document.createElement("div");
            finalDiv.className = "num";
            finalDiv.textContent = "0";
            counter3.appendChild(finalDiv);
        }

        // --- ANIMATION SEQUENCE ---

        // 1. Reveal corner texts
        tl.fromTo([statusRef.current, versionRef.current],
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }
        );

        // 2. Reveal progress bar and counter containers
        tl.fromTo([progressContainerRef.current, counterContainerRef.current],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5 },
            0.5
        );

        // 3. Progress Bar aur Rolling Counter ka animation
        const loadingDuration = 4; // Dono ka duration same rakha hai
        tl.to(progressBarRef.current, {
            width: "100%",
            duration: loadingDuration,
            ease: "power1.inOut"
        }, 1);

        // Rolling counter animation function
        const animateCounter = (counter, duration, delay = 0) => {
            if (!counter) return;
            const numHeight = counter.querySelector(".num").clientHeight;
            const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;
            tl.to(counter, {
                y: -totalDistance,
                duration: duration,
                ease: "power2.inOut",
            }, 1 + delay); // Main timeline ke hisaab se start karein
        }

        // Alag-alag digits ko animate karein
        animateCounter(counter3Ref.current, loadingDuration * 0.85); // 0-99
        animateCounter(counter2Ref.current, loadingDuration * 0.9); // 0-9
        animateCounter(counter1Ref.current, loadingDuration * 0.2, loadingDuration * 0.7); // 100 par 1 dikhega


        tl.fromTo(helloChars,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 3, stagger: 0.5, ease: "power2.out" },
            1.5
        );

        // --- EXIT ANIMATION ---
        // 5. Sirf poora page upar lift hokar fade out hoga
        tl.to(containerRef.current, {
            yPercent: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.in",
            onComplete: () => onFinish?.(),
        }, "+=1");
        return () => tl.kill();
    }, [onFinish]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-[#0A0A0A] z-[999] font-mono text-sm text-slate-400 overflow-hidden"
        >
            {/* CSS ko yahan component ke andar daal diya hai */}
            <style>{`
                .counter {
                    display: flex;
                    height: 32px; /* h-8 */
                    font-size: 32px; /* text-3xl */
                    line-height: 34px;
                    clip-path: polygon(0 0, 100% 0, 100% 32px, 0 32px);
                    font-weight: 600; /* font-semibold */
                    color: #a3e635; /* text-lime-400 */
                    overflow: hidden;
                }
                .counter-1, .counter-2, .counter-3 {
                    position: relative;
                }
                .num1offset1 {
                    position: relative;
                }
            `}</style>

            {/* Corner Elements */}
            <div ref={statusRef} className="absolute top-4 left-4">
                <span className="text-green-400">[OK]</span> System Status: Nominal
            </div>
            <div ref={versionRef} className="absolute top-4 right-4">
                Version: 2.0.4
            </div>

            {/* Main Center Content */}
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 ref={helloRef} className="text-8xl md:text-[25rem] font-bold text-white tracking-wider flex" style={{ fontFamily: "Righteous, sans-serif" }}>
                    <span className="inline-block">A</span>
                    <span className="inline-block">P</span>
                    <span className="inline-block">E</span>
                    <span className="inline-block">X</span>
                    <span className="inline-block">U</span>
                    <span className="inline-block">I</span>
                </h1>
            </div>

            {/* Animated Rolling Counter (Bottom Left) */}
            <div ref={counterContainerRef} className="absolute bottom-4 left-4 flex items-center gap-2 text-3xl text-slate-400">
                <div className="counter">
                    <div ref={counter1Ref} className="counter-1 digit">
                        <div className="num">0</div>
                        <div className="num num1offset1">1</div>
                    </div>
                    <div ref={counter2Ref} className="counter-2 digit">
                        <div className="num">0</div>
                        <div className="num">1</div><div className="num">2</div><div className="num">3</div><div className="num">4</div><div className="num">5</div><div className="num">6</div><div className="num">7</div><div className="num">8</div><div className="num">9</div><div className="num">0</div>
                    </div>
                    <div ref={counter3Ref} className="counter-3 digit">
                        {/* Numbers will be added dynamically here by useEffect */}
                    </div>
                </div>
                <span className="text-lime-400 font-semibold">%</span>
            </div>

            {/* Progress Bar (Bottom Right) */}
            <div ref={progressContainerRef} className="absolute bottom-6 right-4 w-48">
                <div className="w-full bg-slate-800 h-1.5 rounded-full">
                    <div ref={progressBarRef} className="w-0 h-1.5 bg-lime-400 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}