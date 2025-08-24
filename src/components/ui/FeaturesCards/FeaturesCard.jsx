import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP ko ScrollTrigger plugin ke saath register karna zaroori hai
gsap.registerPlugin(ScrollTrigger);

// --- Naye SVG Icons ---
const Icon1 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4l-1.188-.648 1.188-.648a2.25 2.25 0 011.4-1.4l.648-1.188.648 1.188a2.25 2.25 0 011.4 1.4l1.188.648-1.188.648a2.25 2.25 0 01-1.4 1.4z" />
    </svg>
);
const Icon2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008z" />
    </svg>
);
const Icon3 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);
const Icon4 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);


const features = [
    {
        icon: <Icon1 />,
        accentColor: "text-purple-400",
        title: "Smooth Experience",
        desc: "Built with GSAP for a buttery smooth UI journey and delightful micro-interactions."
    },
    {
        icon: <Icon2 />,
        accentColor: "text-sky-400",
        title: "Dark First Design",
        desc: "Every component is crafted to look elegant and professional in dark mode by default."
    },
    {
        icon: <Icon3 />,
        accentColor: "text-green-400",
        title: "Developer Focused",
        desc: "No complexity — just clean React, Tailwind CSS, and powerful, easy-to-use animations."
    },
    {
        icon: <Icon4 />,
        accentColor: "text-yellow-400",
        title: "Rapid Setup",
        desc: "Start building in seconds with a clean, component-ready structure. Just copy, paste, and go!"
    }
];

const FeaturesCard = () => {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".timeline-item");
            const timelineBar = ".timeline-bar";

            // Horizontal line animation
            gsap.from(timelineBar, {
                scaleX: 0,
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                }
            });

            // Staggered reveal for each item
            items.forEach(item => {
                gsap.from(item, {
                    opacity: 0,
                    y: 100,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        end: "top 60%",
                        scrub: 1,
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert(); // Cleanup
    }, []);

    return (
        <section ref={sectionRef} className="bg-gray-950 py-24 w-full overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Why Choose ApexUI?</h2>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                        We focus on what matters: performance, developer experience, and beautiful design.
                    </p>
                </div>

                {/* Timeline Container */}
                <div ref={timelineRef} className="relative w-full">
                    {/* Horizontal Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800">
                        <div className="timeline-bar h-full bg-lime-400 origin-left" />
                    </div>

                    {/* Feature Items */}
                    <div className="relative flex justify-between">
                        {features.map((feature, index) => (
                            <div key={index} className="timeline-item w-1/4 px-4">
                                <div className={`flex flex-col items-center ${index % 2 === 0 ? 'mb-24' : 'mt-24'}`}>
                                    {/* Card Content (Top for even, bottom for odd) */}
                                    <div className={`w-full max-w-xs bg-gray-900 border border-gray-800 rounded-xl p-6 text-center ${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                                        <div className={`inline-block p-3 rounded-full bg-gray-800 mb-4 ${feature.accentColor}`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-base text-gray-400">{feature.desc}</p>
                                    </div>

                                    {/* Connecting Line and Node */}
                                    <div className={`w-0.5 h-12 bg-gray-800 ${index % 2 === 0 ? 'order-1' : 'order-2'}`} />
                                    <div className={`w-4 h-4 rounded-full bg-lime-400 border-4 border-gray-950 ${index % 2 === 0 ? 'order-0 -mb-2' : 'order-3 -mt-2'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesCard;
