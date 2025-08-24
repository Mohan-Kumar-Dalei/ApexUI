import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import React, { useEffect, useRef, useMemo } from "react";

// ScrollReveal: Word-based scroll animation for headings
const ScrollReveal = ({
    children,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 8,
    stagger = 0.08,
    start = 'top 80%',
    end = 'top 40%',
    className = "",
    ...props
}) => {
    const headingRef = useRef(null);
    // Split text into words (preserve spaces)
    const splitWords = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split(/(\s+)/).map((word, i) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <span className="word" key={i}>{word}</span>
            );
        });
    }, [children]);

    useEffect(() => {
        // Debug: print gsap version and ScrollTrigger registration
        console.log('GSAP version:', gsap.version);
        console.log('ScrollTrigger registered:', gsap.core.globals().ScrollTrigger === ScrollTrigger);
        const el = headingRef.current;
        if (!el) return;
        const wordElements = el.querySelectorAll('.word');
        // Kill previous triggers to avoid duplicates
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // Wait for LocomotiveScroll to be ready
        function runGsap() {
            if (!window.locoScroll) {
                console.warn('LocomotiveScroll not found on window!');
                return;
            }
            if (!gsap || !ScrollTrigger) {
                console.warn('GSAP or ScrollTrigger not found!');
                return;
            }
            console.log('LocomotiveScroll and ScrollTrigger detected, running GSAP animation.');
            gsap.fromTo(
                wordElements,
                {
                    opacity: baseOpacity,
                    filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
                    rotate: baseRotation,
                    y: 40
                },
                {
                    opacity: 1,
                    filter: 'blur(0px)',
                    rotate: 0,
                    y: 0,
                    stagger,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        scroller: '[data-scroll-container]',
                        start,
                        end,
                        scrub: true,
                    }
                }
            );
            setTimeout(() => ScrollTrigger.refresh(), 200);
        }

        // Wait for LocomotiveScroll to emit a scroll event before running GSAP
        let ran = false;
        function onFirstScroll() {
            if (!ran) {
                runGsap();
                ran = true;
            }
        }
        if (window.locoScroll) {
            window.locoScroll.on('scroll', onFirstScroll);
        }
        // Fallback: run after 1s if no scroll event
        const fallback = setTimeout(() => {
            if (!ran) runGsap();
        }, 1000);

        // LocomotiveScroll integration: update ScrollTrigger on scroll
        if (window.locoScroll) {
            window.locoScroll.on('scroll', ScrollTrigger.update);
            ScrollTrigger.addEventListener('refresh', () => window.locoScroll && window.locoScroll.update && window.locoScroll.update());
        }

        // MutationObserver: re-run GSAP if heading changes
        const observer = new MutationObserver(() => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            runGsap();
        });
        observer.observe(el, { childList: true, subtree: true });

        // Cleanup listeners on unmount
        return () => {
            if (window.locoScroll) {
                window.locoScroll.off('scroll', onFirstScroll);
                window.locoScroll.off('scroll', ScrollTrigger.update);
                ScrollTrigger.removeEventListener('refresh', () => window.locoScroll && window.locoScroll.update && window.locoScroll.update());
            }
            clearTimeout(fallback);
            observer.disconnect();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [baseOpacity, enableBlur, baseRotation, blurStrength, stagger, start, end]);

    return (
        <h2 ref={headingRef} className={className} {...props}>
            {splitWords}
        </h2>
    );
};

export default ScrollReveal;
