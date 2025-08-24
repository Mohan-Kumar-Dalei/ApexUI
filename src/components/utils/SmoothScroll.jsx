import { useEffect } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll = ({ children }) => {
    useEffect(() => {
        let smoother;
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (isDesktop && !smoother) {
            smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 0.7,
                // normalizeScroll: true, // Uncomment if needed
            });
        }

        return () => {
            if (smoother) {
                smoother.kill();
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