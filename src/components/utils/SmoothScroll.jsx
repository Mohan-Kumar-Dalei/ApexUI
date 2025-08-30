// ...existing code...
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll = ({ children }) => {
    const smootherRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const init = () => {
            try {
                // ensure DOM/body available before creating ScrollSmoother
                if (!document.body) return;

                const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
                if (isDesktop && !smootherRef.current) {
                    smootherRef.current = ScrollSmoother.create({
                        wrapper: "#smooth-wrapper",
                        content: "#smooth-content",
                        smooth: 0.4,
                        normalizeScroll: true,
                    });
                    // ensure ScrollTrigger uses correct scroller
                    ScrollTrigger.refresh();
                }
            } catch (err) {
                console.warn("ScrollSmoother init failed, falling back to native scroll", err);
            }
        };

        // Defer init to next frame so body and layout are present
        rafRef.current = requestAnimationFrame(init);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (smootherRef.current) {
                try { smootherRef.current.kill(); } catch (e) { console.warn("ScrollSmoother kill failed", e); }
                smootherRef.current = null;
            }
        };
    }, []);

    return (
        <div id="smooth-wrapper" style={{ overflowX: "hidden", position: "relative" }}>
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
};

export default SmoothScroll;
// ...existing code...