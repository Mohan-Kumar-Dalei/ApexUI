/* eslint-disable no-unused-vars */
import { useRef, useLayoutEffect, useState } from "react";
import { motion, useTransform, useMotionValue, useAnimationFrame, useScroll, useVelocity, useSpring } from "framer-motion";

function useElementWidth(ref) {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        function updateWidth() {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [ref]);

    return width;
}

// Utility for seamless wrap
function wrapValue(min, max, v) {
    const range = max - min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
}

// Main Marquee Component
export function ApexUIMarquee({
    items = ['ApexUI', 'apexui'],
    speed = 50,
    direction,
    className = "apexui-marquee-text",
    repeat = 10,
    containerClass = "apexui-marquee-container",
    scrollerClass = "apexui-marquee-track",
    containerStyle,
    scrollerStyle,
    textStroke = false,
    textStrokeColor = '#C27AFF',
    textFillColor = '#1E2637',
    textColor = '#fff',
    scrollRef,
}) {
    // Single scrolling row
    function MarqueeRow({ children, baseSpeed = speed, direction = "left" }) {
        const baseX = useMotionValue(0);
        const copyRef = useRef(null);
        const copyWidth = useElementWidth(copyRef);

        // Scroll tracking (window or custom container)
        const scrollOptions = scrollRef ? { container: scrollRef } : {};
        const { scrollY } = useScroll(scrollOptions);
        const scrollVelocity = useVelocity(scrollY);
        const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
        const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], { clamp: false });

        const x = useTransform(baseX, (v) => {
            if (copyWidth === 0) return "0px";
            return `${wrapValue(-copyWidth, 0, v)}px`;
        });

        // Unique scroll-based animation: gradient appears on scroll, white by default
        // Animate gradient opacity and hue-rotate based on velocity
        const hue = useTransform(velocityFactor, v => Math.max(-40, Math.min(40, v * 30)));
        const gradientOpacity = useTransform(velocityFactor, v => Math.min(1, Math.abs(v) * 0.7));
        const filter = useTransform(hue, h => `hue-rotate(${h}deg)`);

        // Alternate direction, flip on scroll
        const directionFactor = useRef(direction === "left" ? -1 : 1);
        const lastVelocity = useRef(0);
        useAnimationFrame((t, delta) => {
            const v = velocityFactor.get();
            if (v !== 0 && Math.sign(v) !== Math.sign(lastVelocity.current)) {
                directionFactor.current *= -1;
            }
            lastVelocity.current = v;
            let moveBy = directionFactor.current * (baseSpeed + Math.abs(v * 100)) * (delta / 1000);
            baseX.set(baseX.get() + moveBy);
        });

        // Modern font and gradient color, with color/stroke props
        // Use Google font 'Barlow Condensed', fallback to 'Montserrat', then sans-serif
        const spans = [];
        for (let i = 0; i < repeat; i++) {
            spans.push(
                <span
                    className={`flex-shrink-0 ${className} tracking-tighter font-semibold custom-marquee-span`}
                    key={i}
                    ref={i === 0 ? copyRef : null}
                    style={{
                        fontFamily: "helvetica, Arial, sans-serif",
                        cursor: "default",
                        fontOpticalSizing: 'auto',
                        color: !textStroke ? textColor : '#fff',
                        WebkitTextStroke: undefined,
                        WebkitTextFillColor: undefined,
                        fontSize: '6.8rem',
                        transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                        position: 'relative',
                        display: 'inline-block',
                    }}
                >
                    <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
                    <motion.span
                        className={"marquee-gradient-overlay absolute left-0 top-0 w-full h-full bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent drop-shadow-lg"}
                        style={{
                            filter,
                            opacity: gradientOpacity,
                            WebkitTextFillColor: 'transparent',
                            mixBlendMode: 'normal',
                            zIndex: 2,
                        }}
                        aria-hidden="true"
                    >
                        {children}
                    </motion.span>
                </span>
            );
        }

        // Add hover effect via inline style and a custom class
        // The hover will show a stroke and fill color
        // Add a <style> tag for the custom class
        // This is safe in component scope in React
        return (
            <div className={`${containerClass} relative overflow-hidden`} style={containerStyle}>
                <style>{`
                    .custom-marquee-span {
                        transition: all 0.5s cubic-bezier(.4,2,.6,1);
                    }
                    .custom-marquee-span:hover {
                        -webkit-text-stroke: 2px ${textStrokeColor};
                        -webkit-text-fill-color: ${textFillColor};
                        color: ${textFillColor};
                        filter: drop-shadow(0 2px 12px ${textStrokeColor}55);
                        transition: all 0.5s cubic-bezier(.4,2,.6,1);
                    }
                    .custom-marquee-span:hover .marquee-gradient-overlay {
                        opacity: 0 !important;
                    }
                `}</style>
                <motion.div
                    className={`${scrollerClass} flex h-28 whitespace-nowrap text-center font-barlow text-5xl md:text-[5.5rem] tracking-[0.08em] md:leading-[6rem]`}
                    style={{ x, ...scrollerStyle }}
                >
                    {spans}
                </motion.div>
            </div>
        );
    }

    // Render all marquee rows
    return (
        <section>
            {items.map((item, idx) => {
                // Alternate direction: even left, odd right
                const rowDirection = direction ? direction : (idx % 2 === 0 ? "left" : "right");
                return (
                    <MarqueeRow
                        key={idx}
                        baseSpeed={speed}
                        direction={rowDirection}
                    >
                        {item}&nbsp;
                    </MarqueeRow>
                );
            })}
        </section>
    );
}

export default ApexUIMarquee;
