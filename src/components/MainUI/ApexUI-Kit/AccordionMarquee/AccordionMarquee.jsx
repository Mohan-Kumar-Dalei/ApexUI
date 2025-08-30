import React, { useLayoutEffect, useRef } from 'react';
// GSAP ko seedhe CDN se import kiya gaya hai taaki yeh browser mein chale
import gsap from "gsap";
import './AccordionMarquee.css'
// Accordion ka data
const accordionData = [
    {
        title: "Cybernetic Dreams",
        text: "Explore the Future",
    },
    {
        title: "Quantum Leap",
        text: "Journey Through Spacetime",
    },
    {
        title: "Neural Networks",
        text: "Unravel Complexity",
    },
    {
        title: "Digital Odyssey",
        text: "Voyage into the Digital World",
    },
];

const AccordionMarquee = ({bgColor='#bbf451', textColor='#27272a'}) => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const items = gsap.utils.toArray(".accordion-item");
        let activeItem = null;
        let activeMarquee = null;

        items.forEach((item) => {
            const marqueeText = item.querySelector(".marquee-text");
            const title = item.querySelector(".accordion-title");

            // Marquee text ko 2 baar duplicate karte hain for seamless loop
            const marqueeContent = marqueeText.innerText;
            const sparkleIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkle-icon lucide-sparkle"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" class="sparkle-icon"/></svg>`;
            marqueeText.innerHTML = [marqueeContent, sparkleIconSVG, marqueeContent, sparkleIconSVG, marqueeContent, sparkleIconSVG, marqueeContent, sparkleIconSVG].join("");

            // Seamless Marquee animation
            const marqueeWidth = marqueeText.scrollWidth / 2;
            const marqueeTl = gsap.to(marqueeText, {
                x: -marqueeWidth,
                duration: marqueeWidth / 30, // Speed ko consistent rakhta hai
                ease: "linear",
                repeat: -1,
            }).pause();

            item.addEventListener("mouseenter", () => {
                if (activeItem === item) return;

                if (activeItem) {
                    const oldTitle = activeItem.querySelector(".accordion-title");
                    const oldMarqueeWrapper = activeItem.querySelector(".marquee-wrapper");
                    gsap.to(oldTitle, { autoAlpha: 1, duration: 0.2, ease: "power3.inOut" });
                    gsap.to(oldMarqueeWrapper, { autoAlpha: 0, duration: 0.2, ease: "power3.inOut" });
                    if (activeMarquee) activeMarquee.pause();
                }

                activeItem = item;
                activeMarquee = marqueeTl;

                const marqueeWrapper = item.querySelector(".marquee-wrapper");
                gsap.to(title, { autoAlpha: 0, duration: 0.2, ease: "power3.inOut" });
                gsap.to(marqueeWrapper, { autoAlpha: 1, duration: 0.2, delay: 0.1, ease: "power3.inOut" });

                marqueeTl.play();
            });
        });

        containerRef.current.addEventListener("mouseleave", () => {
            if (!activeItem) return;

            const activeTitle = activeItem.querySelector(".accordion-title");
            const activeMarqueeWrapper = activeItem.querySelector(".marquee-wrapper");

            gsap.to(activeTitle, { autoAlpha: 1, duration: 0.2, delay: 0.1, ease: "power3.inOut" });
            gsap.to(activeMarqueeWrapper, { autoAlpha: 0, duration: 0.2, ease: "power3.inOut" });

            if (activeMarquee) {
                activeMarquee.pause();
            }
            activeItem = null;
            activeMarquee = null;
        });

    }, []);

    return (
        <>
            <style>
                {`
                @keyframes sparkle-pulse {
                    0%, 100% {
                        stroke: #000;
                        stroke-width: 0.5;
                    }
                    50% {
                        stroke: #444;
                        stroke-width: 1;
                    }
                }
                .sparkle-icon {
                    animation: sparkle-pulse 2.5s ease-in-out infinite;
                }
                `}
            </style>
            <div className="flex items-center justify-center w-screen bg-gray-900 text-white font-sans">
                <div ref={containerRef} className="flex flex-col w-full h-[80vh] md:h-[70vh]">
                    {accordionData.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="accordion-item relative w-full h-40 overflow-hidden cursor-pointer flex items-center justify-center bg-gray-800">
                                <div className="relative z-10 w-full text-center px-4">
                                    <h2 className="accordion-title text-2xl sm:text-3xl lg:text-5xl font-extrabold uppercase tracking-wider whitespace-nowrap" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                                        {item.title}
                                    </h2>
                                    <div className="marquee-wrapper absolute inset-0 w-full h-20 flex items-center overflow-hidden opacity-0" style={{backgroundColor: bgColor}}>
                                        <p className="marquee-text text-4xl sm:text-5xl md:text-6xl font-bold whitespace-nowrap flex items-center" 
                                        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)', fontFamily: "Righteous, sans-serif", color: textColor }}
                                        >
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {index < accordionData.length - 1 && (
                                <hr className="w-full border-t-2 border-gray-700 my-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AccordionMarquee;

