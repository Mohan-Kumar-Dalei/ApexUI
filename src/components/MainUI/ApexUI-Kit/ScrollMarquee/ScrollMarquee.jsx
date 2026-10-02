import { useRef, useLayoutEffect, useState } from "react";
import { motion, useTransform, useMotionValue, useAnimationFrame, useScroll, useVelocity, useSpring } from "framer-motion";

// Width of one copy, kept up to date when fonts load or the container resizes.
function useElementWidth(ref) {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const update = () => setWidth(el.offsetWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return width;
}

function wrapValue(min, max, v) {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
}

// Velocity below this is treated as "not scrolling" so tiny spring wobbles
// around zero no longer flip the direction back and forth.
const DIRECTION_THRESHOLD = 0.05;

// Defined at module level: a component declared inside another component is
// a new type on every render, which remounted the rows each time.
function MarqueeRow({ children, baseSpeed, direction, repeat, className, containerClass, scrollerClass, containerStyle, scrollerStyle, textColor, scrollRef }) {
    const baseX = useMotionValue(0);
    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    const { scrollY } = useScroll(scrollRef ? { container: scrollRef } : {});
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], { clamp: false });

    const x = useTransform(baseX, (v) => (copyWidth ? `${wrapValue(-copyWidth, 0, v)}px` : "0px"));
    const hue = useTransform(velocityFactor, (v) => Math.max(-40, Math.min(40, v * 30)));
    const gradientOpacity = useTransform(velocityFactor, (v) => Math.min(1, Math.abs(v) * 0.7));
    const filter = useTransform(hue, (h) => `hue-rotate(${h}deg)`);

    const directionFactor = useRef(direction === "left" ? -1 : 1);
    useAnimationFrame((_, delta) => {
        const v = velocityFactor.get();
        if (v < -DIRECTION_THRESHOLD) directionFactor.current = -1;
        else if (v > DIRECTION_THRESHOLD) directionFactor.current = 1;
        const moveBy = directionFactor.current * (baseSpeed + Math.abs(v * 100)) * (Math.min(delta, 64) / 1000);
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={`${containerClass} relative overflow-hidden`} style={containerStyle}>
            <motion.div
                className={`${scrollerClass} flex whitespace-nowrap text-center will-change-transform`}
                style={{ x, ...scrollerStyle }}
            >
                {Array.from({ length: repeat }, (_, i) => (
                    <span
                        key={i}
                        ref={i === 0 ? copyRef : null}
                        className={`apexui-marquee-span relative inline-block flex-shrink-0 font-semibold tracking-tighter cursor-default ${className}`}
                        style={{ fontFamily: "helvetica, Arial, sans-serif", color: textColor, fontSize: "clamp(3rem, 9vw, 6.8rem)", lineHeight: 1.1 }}
                    >
                        <span className="relative z-[1]">{children}</span>
                        <motion.span
                            className="apexui-marquee-gradient absolute left-0 top-0 w-full h-full bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent z-[2] pointer-events-none"
                            style={{ filter, opacity: gradientOpacity, WebkitTextFillColor: "transparent" }}
                            aria-hidden="true"
                        >
                            {children}
                        </motion.span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

export function ScrollMarquee({
    items = ['ApexUI', 'apexui'],
    speed = 50,
    direction,
    className = "apexui-marquee-text",
    repeat = 10,
    containerClass = "apexui-marquee-container",
    scrollerClass = "apexui-marquee-track",
    containerStyle,
    scrollerStyle,
    textStroke = true,
    textStrokeColor = '#C27AFF',
    textFillColor = '#1E2637',
    textColor = '#fff',
    scrollRef,
}) {
    return (
        <section>
            {/* One style block for all rows; the hover stroke can be turned off with textStroke={false}. */}
            <style>{`
                .apexui-marquee-span { transition: color .45s cubic-bezier(.22,1,.36,1), -webkit-text-stroke-color .45s, filter .45s; }
                ${textStroke ? `
                .apexui-marquee-span:hover {
                    -webkit-text-stroke: 2px ${textStrokeColor};
                    -webkit-text-fill-color: ${textFillColor};
                    color: ${textFillColor};
                    filter: drop-shadow(0 2px 12px ${textStrokeColor}55);
                }
                .apexui-marquee-span:hover .apexui-marquee-gradient { opacity: 0 !important; }` : ''}
            `}</style>
            {items.map((item, idx) => (
                <MarqueeRow
                    key={`${item}-${idx}`}
                    baseSpeed={speed}
                    direction={direction || (idx % 2 === 0 ? "left" : "right")}
                    repeat={repeat}
                    className={className}
                    containerClass={containerClass}
                    scrollerClass={scrollerClass}
                    containerStyle={containerStyle}
                    scrollerStyle={scrollerStyle}
                    textColor={textColor}
                    scrollRef={scrollRef}
                >
                    {item}&nbsp;
                </MarqueeRow>
            ))}
        </section>
    );
}

export default ScrollMarquee;
