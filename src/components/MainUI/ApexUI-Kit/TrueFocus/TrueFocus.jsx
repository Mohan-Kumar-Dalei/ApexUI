import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/*
 * True Focus: one word of a sentence is sharp while the rest are blurred,
 * and a set of corner brackets glides from word to word. Cycles on its
 * own, or follows the pointer in manual mode.
 */

const TrueFocus = ({ sentence = "Design Build Ship Repeat", manual = false, blur = 5, interval = 1600, borderColor = "#a3e635", className = "" }) => {
    const words = sentence.split(" ");
    const [active, setActive] = useState(0);
    const [box, setBox] = useState(null);
    const wrap = useRef(null);
    const refs = useRef([]);

    useEffect(() => {
        if (manual) return undefined;
        const id = setInterval(() => setActive((i) => (i + 1) % words.length), interval);
        return () => clearInterval(id);
    }, [manual, interval, words.length]);

    useLayoutEffect(() => {
        const measure = () => {
            const el = refs.current[active];
            const parent = wrap.current;
            if (!el || !parent) return;
            const a = el.getBoundingClientRect();
            const p = parent.getBoundingClientRect();
            setBox({ x: a.left - p.left, y: a.top - p.top, w: a.width, h: a.height });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(wrap.current);
        return () => ro.disconnect();
    }, [active, sentence]);

    const corner = "absolute h-[0.42em] w-[0.42em] border-[0.09em]";
    return (
        <div ref={wrap} className={`relative inline-flex flex-wrap justify-center gap-x-[0.45em] gap-y-2 font-black ${className}`}>
            {words.map((w, i) => (
                <span
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    onPointerEnter={() => manual && setActive(i)}
                    className="relative px-[0.12em] transition-[filter,opacity] duration-500"
                    style={{ filter: i === active ? "blur(0px)" : `blur(${blur}px)`, opacity: i === active ? 1 : 0.55 }}
                >
                    {w}
                </span>
            ))}
            {box && (
                <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0" initial={false} animate={{ x: box.x - 6, y: box.y - 4, width: box.w + 12, height: box.h + 8 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}>
                    <span className={`${corner} -left-0 -top-0 rounded-tl-[0.12em] border-b-0 border-r-0`} style={{ borderColor, filter: `drop-shadow(0 0 6px ${borderColor})` }} />
                    <span className={`${corner} -right-0 -top-0 rounded-tr-[0.12em] border-b-0 border-l-0`} style={{ borderColor, filter: `drop-shadow(0 0 6px ${borderColor})` }} />
                    <span className={`${corner} -bottom-0 -left-0 rounded-bl-[0.12em] border-r-0 border-t-0`} style={{ borderColor, filter: `drop-shadow(0 0 6px ${borderColor})` }} />
                    <span className={`${corner} -bottom-0 -right-0 rounded-br-[0.12em] border-l-0 border-t-0`} style={{ borderColor, filter: `drop-shadow(0 0 6px ${borderColor})` }} />
                </motion.div>
            )}
        </div>
    );
};

export default TrueFocus;
