/* eslint-disable no-unused-vars */
import { useRef, useLayoutEffect, useState } from "react";
import { motion, useTransform, useMotionValue, useAnimationFrame } from "framer-motion";

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

export const ScrollVelocity = ({
    texts = ['Apex UI', 'Apex UI'],
    speed = 50,
    direction, // Optional global override
    className = "ApexUI-scroll-textVelocity",
    numCopies = 10,
    parallaxClassName = "ApexUI-scroll-parallax",
    scrollerClassName = "ApexUI-scroll-scroller",
    parallaxStyle,
    scrollerStyle,
    textStroke = true,
    textStrokeColor = '#C27AFF',
    textFillColor = '#1E2637',
}) => {
    function VelocityText({
        children,
        baseSpeed = speed,
        direction = "left",
    }) {
        const baseX = useMotionValue(0);
        const copyRef = useRef(null);
        const copyWidth = useElementWidth(copyRef);

        function wrap(min, max, v) {
            const range = max - min;
            const mod = (((v - min) % range) + range) % range;
            return mod + min;
        }

        const x = useTransform(baseX, (v) => {
            if (copyWidth === 0) return "0px";
            return `${wrap(-copyWidth, 0, v)}px`;
        });

        useAnimationFrame((t, delta) => {
            const directionFactor = direction === "left" ? -1 : 1;
            const moveBy = directionFactor * baseSpeed * (delta / 1000);
            baseX.set(baseX.get() + moveBy);
        });

        const spans = [];
        for (let i = 0; i < numCopies; i++) {
            spans.push(
                <span
                    className={`flex-shrink-0 ${className}`}
                    key={i}
                    ref={i === 0 ? copyRef : null}
                    style={
                        textStroke ? {
                            WebkitTextStroke: `1px ${textStrokeColor}`,
                            WebkitTextFillColor: textFillColor,
                            fontWeight: 'bold',
                        } : undefined
                    }
                >
                    {children}
                </span>
            );
        }

        return (
            <div className={`${parallaxClassName} relative overflow-hidden`} style={parallaxStyle}>
                <motion.div
                    className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
                    style={{ x, ...scrollerStyle }}
                >
                    {spans}
                </motion.div>
            </div>
        );
    }

    return (
        <section>
            {texts.map((text, index) => {
                const finalDirection = direction || (index % 2 === 0 ? "left" : "right");
                return (
                    <VelocityText
                        key={index}
                        baseSpeed={speed}
                        direction={finalDirection}
                    >
                        {text}&nbsp;
                    </VelocityText>
                );
            })}
        </section>
    );
};

export default ScrollVelocity;
