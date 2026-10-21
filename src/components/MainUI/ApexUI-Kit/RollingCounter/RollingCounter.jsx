import React, { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useTransform } from "framer-motion";

/*
 * Rolling Counter: an odometer-style number. Every digit is a wheel that
 * rolls forward or back to its new value, carrying into the next wheel like a
 * real odometer. Formats with Intl (separators, decimals, currency).
 */

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const STEP = 1.15; // wheel height per digit, in em
const DEFAULT_SPRING = { stiffness: 70, damping: 18, mass: 1 };

function WheelDigit({ digit, position }) {
    // Place each digit on a loop around the wheel so the wheel can spin either way.
    const y = useTransform(position, (v) => {
        const off = (((digit - v) % 10) + 10) % 10;
        return `${(off > 5 ? off - 10 : off) * STEP}em`;
    });
    return (
        <motion.span className="absolute inset-0 flex items-center justify-center" style={{ y }}>
            {digit}
        </motion.span>
    );
}

function Wheel({ target, spring, moving }) {
    // New wheels start at 0 and roll in.
    const position = useSpring(moving ? 0 : target, spring);
    useEffect(() => {
        if (!moving) {
            position.jump(target);
            return;
        }
        // Big jumps skip ahead (keeping the same digit) so the wheel spins at most ~2 turns.
        const current = position.get();
        const gap = target - current;
        if (Math.abs(gap) > 20) position.jump(current + 10 * Math.round((gap - Math.sign(gap) * 20) / 10));
        position.set(target);
    }, [target, moving, position]);

    return (
        <span
            className="relative inline-block overflow-hidden"
            style={{
                width: "1ch",
                height: `${STEP}em`,
                maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
            }}
        >
            {DIGITS.map((d) => (
                <WheelDigit key={d} digit={d} position={position} />
            ))}
        </span>
    );
}

const RollingCounter = ({
    value = 0,
    locale = "en-US",
    decimals = 0,
    currency,
    prefix = "",
    suffix = "",
    fontSize = 4,
    fontWeight = 700,
    color = "currentColor",
    startOnView = true,
    spring = DEFAULT_SPRING,
    className = "",
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px" });
    const moving = !useReducedMotion();
    const shown = startOnView && !inView ? 0 : value;

    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                numberingSystem: "latn",
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
                ...(currency ? { style: "currency", currency } : {}),
            }),
        [locale, decimals, currency]
    );

    // Whole number of the smallest unit shown, e.g. 12.34 with 2 decimals -> 1234.
    const scaled = Math.round(Math.abs(shown) * 10 ** decimals);
    const text = formatter.format(shown);

    // Walk the formatted string from the right so each wheel keeps its place as
    // the number grows. Symbols before the first digit ($, -) keep a fixed key.
    const isDigit = (ch) => ch >= "0" && ch <= "9";
    const firstDigit = [...text].findIndex(isDigit);
    const parts = [];
    let place = 0;
    for (let i = text.length - 1; i >= 0; i--) {
        const ch = text[i];
        if (isDigit(ch)) {
            parts.unshift({ key: `d${place}`, place });
            place += 1;
        } else {
            parts.unshift({ key: i < firstDigit ? `lead${i}-${ch}` : `s${place}-${ch}`, char: ch });
        }
    }

    return (
        <span
            ref={ref}
            role="img"
            aria-label={`${prefix}${formatter.format(value)}${suffix}`}
            className={`inline-flex items-center whitespace-nowrap leading-none tabular-nums ${className}`}
            style={{ fontSize: `${fontSize}rem`, fontWeight, color, fontVariantNumeric: "tabular-nums" }}
        >
            {prefix && <span aria-hidden="true">{prefix}</span>}
            <AnimatePresence initial={false} mode="popLayout">
                {parts.map((part) => (
                    <motion.span
                        key={part.key}
                        layout="position"
                        aria-hidden="true"
                        className="inline-flex"
                        initial={{ opacity: 0, y: "-0.4em" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "0.4em" }}
                        transition={{ duration: moving ? 0.35 : 0 }}
                    >
                        {part.char !== undefined ? (
                            part.char === " " || part.char === " " || part.char === " " ? " " : part.char
                        ) : (
                            <Wheel target={Math.floor(scaled / 10 ** part.place)} spring={spring} moving={moving} />
                        )}
                    </motion.span>
                ))}
            </AnimatePresence>
            {suffix && <span aria-hidden="true">{suffix}</span>}
        </span>
    );
};

export default RollingCounter;
