import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function textSlideGsap(scrollerEl) {
    // Pin text-slide-section once, animate both lines in a timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".text-slide-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            scroller: scrollerEl,
            duration: 6.5 // slower scroll speed
        },
    });
    // Animate text-slide-1 with blur reveal
    tl.fromTo(
        ".text-slide-1",
        { xPercent: -140 },
        { xPercent: 140, ease: "none" },
        0
    );
    // Animate dust trail and SVG stars for text-slide-1
    // Sparkle animation for SVG stars (text-slide-1)
    gsap.to(".text-slide-star-1", {
        scale: 1.2,
        opacity: 1,
        rotate: 20,
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: "power1.inOut"
    });
    gsap.to(".text-slide-star-2", {
        scale: 1.1,
        opacity: 0.7,
        rotate: -15,
        yoyo: true,
        repeat: -1,
        duration: 1.4,
        ease: "power1.inOut"
    });
    // Animate text-slide-2 with blur reveal
    tl.fromTo(
        ".text-slide-2",
        { xPercent: 150, },
        { xPercent: -150, ease: "none" },
        0
    );
    // Sparkle animation for SVG stars (text-slide-2)
    gsap.to(".text-slide-star-3", {
        scale: 1.2,
        opacity: 1,
        rotate: -20,
        yoyo: true,
        repeat: -1,
        duration: 1.2,
        ease: "power1.inOut"
    });
    gsap.to(".text-slide-star-4", {
        scale: 1.1,
        opacity: 0.7,
        rotate: 15,
        yoyo: true,
        repeat: -1,
        duration: 1.4,
        ease: "power1.inOut"
    });
}
