import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Top = () => {
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const hoverTimeline = useRef();

    useLayoutEffect(() => {
        const container = containerRef.current;
        const ripples = gsap.utils.toArray('.ripple');

        const ctx = gsap.context(() => {
            // Animation for button visibility
            ScrollTrigger.create({
                trigger: document.body,
                start: "300px top",
                onEnter: () => gsap.to(container, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }),
                onLeaveBack: () => gsap.to(container, { autoAlpha: 0, scale: 0, duration: 0.3, ease: "power2.in" }),
            });

            // Timeline for the looping ripple animation on hover
            hoverTimeline.current = gsap.timeline({ paused: true, repeat: -1 })
                .fromTo(ripples, {
                    scale: 0,
                    opacity: 1,
                }, {
                    scale: 4,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.out",
                    stagger: 0.5, // Creates the delayed ripple effect
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleMouseEnter = () => {
        hoverTimeline.current.play(0);
        gsap.to(iconRef.current, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        hoverTimeline.current.pause();
        gsap.to('.ripple', { opacity: 0, duration: 0.3 }); // Instantly fade out ripples
        gsap.to(iconRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const scrollToTop = () => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: 0,
            ease: 'power4.inOut'
        });
    };

    return (
        <button
            ref={containerRef}
            onClick={scrollToTop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900"
            style={{ visibility: 'hidden', transform: 'scale(0)' }}
            aria-label="Scroll to top"
        >
            {/* Ripple effect elements */}
            <div className="ripple absolute h-full w-full rounded-full border-2 border-lime-500"></div>
            <div className="ripple absolute h-full w-full rounded-full border-2 border-lime-500"></div>

            {/* Central Icon */}
            <div ref={iconRef}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20V4" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 10L12 4L18 10" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </button>
    );
};

export default Top;