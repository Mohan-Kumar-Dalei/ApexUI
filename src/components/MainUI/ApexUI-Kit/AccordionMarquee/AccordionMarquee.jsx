import React, { useLayoutEffect, useRef } from 'react';
import gsap from "gsap";
import './AccordionMarquee.css';

const defaultItems = [
    { title: "Cybernetic Dreams", text: "Explore the Future" },
    { title: "Quantum Leap", text: "Journey Through Spacetime" },
    { title: "Neural Networks", text: "Unravel Complexity" },
    { title: "Digital Odyssey", text: "Voyage into the Digital World" },
];

const Sparkle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
        <path className="sparkle-icon" d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    </svg>
);

// Two identical halves make the -50% loop seamless.
const MarqueeContent = ({ text }) => (
    <>
        {[0, 1, 2, 3].map((i) => (
            <React.Fragment key={i}>
                <span className="px-4">{text}</span>
                <Sparkle />
            </React.Fragment>
        ))}
    </>
);

const AccordionMarquee = ({ bgColor = '#bbf451', textColor = '#27272a', items = defaultItems, className = 'h-[80vh] md:h-[70vh]' }) => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        // Everything is scoped to this instance and torn down on unmount.
        const ctx = gsap.context(() => {
            const rows = gsap.utils.toArray(".accordion-item", container);
            let active = null;

            const entries = rows.map((row) => {
                const title = row.querySelector(".accordion-title");
                const band = row.querySelector(".marquee-wrapper");
                const track = row.querySelector(".marquee-text");
                const loop = gsap.to(track, {
                    xPercent: -50,
                    duration: Math.max(track.scrollWidth / 2 / 60, 6),
                    ease: "none",
                    repeat: -1,
                    paused: true,
                });
                // One reversible timeline per row: the title and the band can never
                // both be visible, however fast the pointer moves between rows.
                gsap.set(band, { autoAlpha: 0, scaleY: 0 });
                const reveal = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } })
                    .to(title, { autoAlpha: 0, y: -12, duration: 0.22 }, 0)
                    .to(band, { autoAlpha: 1, scaleY: 1, duration: 0.32 }, 0.08);
                return { row, loop, reveal };
            });

            const deactivate = (entry) => {
                if (!entry) return;
                entry.reveal.timeScale(1.4).reverse();
                entry.loop.pause();
            };
            const activate = (entry) => {
                if (active === entry) return;
                deactivate(active);
                active = entry;
                entry.reveal.timeScale(1).play();
                entry.loop.play();
            };

            const cleanups = entries.map((entry) => {
                const onEnter = () => activate(entry);
                entry.row.addEventListener("pointerenter", onEnter);
                return () => entry.row.removeEventListener("pointerenter", onEnter);
            });
            const onLeave = () => {
                deactivate(active);
                active = null;
            };
            container.addEventListener("pointerleave", onLeave);

            return () => {
                cleanups.forEach((fn) => fn());
                container.removeEventListener("pointerleave", onLeave);
            };
        }, container);

        return () => ctx.revert();
    }, [items]);

    return (
        <>
            <style>{`
                @keyframes sparkle-pulse {
                    0%, 100% { stroke: #000; stroke-width: 0.5; }
                    50% { stroke: #444; stroke-width: 1; }
                }
                .sparkle-icon { animation: sparkle-pulse 2.5s ease-in-out infinite; }
            `}</style>
            <div className="flex items-center justify-center w-full bg-gray-900 text-white font-sans">
                <div ref={containerRef} className={`flex flex-col w-full min-h-[22rem] ${className}`}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.title ?? index}>
                            <div className="accordion-item relative w-full flex-1 min-h-20 overflow-hidden cursor-pointer flex items-center justify-center bg-gray-800">
                                <h2
                                    className="accordion-title relative z-10 px-4 text-center text-2xl sm:text-3xl lg:text-5xl font-extrabold uppercase tracking-wider whitespace-nowrap"
                                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                                >
                                    {item.title}
                                </h2>
                                <div
                                    className="marquee-wrapper absolute inset-x-0 top-1/2 -mt-8 sm:-mt-10 h-16 sm:h-20 flex items-center overflow-hidden origin-center"
                                    style={{ backgroundColor: bgColor, visibility: 'hidden' }}
                                >
                                    <p
                                        className="marquee-text text-3xl sm:text-5xl md:text-6xl font-bold whitespace-nowrap flex items-center will-change-transform"
                                        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)', fontFamily: "Righteous, sans-serif", color: textColor }}
                                    >
                                        <MarqueeContent text={item.text} />
                                        <MarqueeContent text={item.text} />
                                    </p>
                                </div>
                            </div>
                            {index < items.length - 1 && <hr className="w-full border-t-2 border-gray-700 my-0" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AccordionMarquee;
