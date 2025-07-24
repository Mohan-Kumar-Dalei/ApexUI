import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * useGsapLocoReveal - Custom hook to run GSAP/ScrollTrigger animations with LocomotiveScroll integration.
 * @param {Function} runGsap - Function that receives the scroller element and runs GSAP animations.
 */
export default function useGsapLocoReveal(runGsap) {
    useEffect(() => {
        let ran = false;
        let gsapCtx;
        // Only run LocomotiveScroll on Home route
        if (window.location.pathname !== "/") return;
        function getScrollerEl() {
            if (window.locoScroll && window.locoScroll.scroll && window.locoScroll.scroll.container) {
                if (!ran) {
                    console.log('[GSAP] Using LocomotiveScroll container for scroller:', window.locoScroll.scroll.container);
                }
                return window.locoScroll.scroll.container;
            }
            const el = document.querySelector('[data-scroll-container]');
            if (el && !ran) {
                console.log('[GSAP] Using [data-scroll-container] for scroller:', el);
            } else if (!el && !ran) {
                console.warn('[GSAP] No scroller element found! Animations may not sync with LocomotiveScroll.');
            }
            return el;
        }
        function runOnce() {
            if (!ran) {
                const scrollerEl = getScrollerEl();
                if (scrollerEl) {
                    gsapCtx = gsap.context(() => runGsap(scrollerEl));
                }
                ran = true;
            }
        }
        if (window.locoScroll) {
            window.locoScroll.once('scroll', runOnce);
        } else {
            // Fallback: run after timeout if locoScroll not available
            setTimeout(runOnce, 1000);
        }
        return () => {
            if (window.locoScroll) {
                window.locoScroll.off('scroll', runOnce);
            }
            if (gsapCtx) gsapCtx.revert();
        };
    }, []); // Only run on mount
}
