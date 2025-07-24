import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
    const scrollRef = useRef(null);
    const locoScrollRef = useRef(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        // Only run LocomotiveScroll on Home route
        if (window.location.pathname !== "/") return;

        locoScrollRef.current = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            tablet: { smooth: false },
            smartphone: { smooth: false },
            lerp: 0.1
        });
        // Make LocomotiveScroll globally available for GSAP/ScrollTrigger integration
        window.locoScroll = locoScrollRef.current;

        locoScrollRef.current.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(scrollRef.current, {
            scrollTop(value) {
                if (!locoScrollRef.current || !locoScrollRef.current.scroll || !locoScrollRef.current.scroll.instance) return 0;
                return arguments.length
                    ? locoScrollRef.current.scrollTo(value, 0, 0)
                    : locoScrollRef.current.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: scrollRef.current.style.transform ? 'transform' : 'fixed'
        });

        const updateLoco = () => locoScrollRef.current && locoScrollRef.current.update();
        ScrollTrigger.addEventListener('refresh', updateLoco);
        setTimeout(() => ScrollTrigger.refresh(), 100);

        return () => {
            if (locoScrollRef.current) {
                locoScrollRef.current.destroy();
                locoScrollRef.current = null;
            }
            ScrollTrigger.removeEventListener('refresh', updateLoco);
        };
    }, []);

    return (
        <div ref={scrollRef} className="smooth-scroll" data-scroll-container style={{ minHeight: '100vh', width: '100vw' }}>
            {children}
        </div>
    );
};

export default SmoothScroll;




