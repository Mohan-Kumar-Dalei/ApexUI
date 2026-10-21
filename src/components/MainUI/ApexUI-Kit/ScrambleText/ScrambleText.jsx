import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/*
 * Scramble Text: letters cycle through random characters and lock into place
 * one by one, like text being decrypted. Runs when it scrolls into view, on
 * hover, or on a loop. Every letter keeps its real width, so nothing jumps.
 */

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*@$/<>";

// Random character, lowercased for lowercase letters so widths stay close.
const pick = (chars, ch = "") => {
    const c = chars[Math.floor(Math.random() * chars.length)];
    return ch !== ch.toUpperCase() ? c.toLowerCase() : c;
};

// Order in which the letters lock in.
function revealOrder(text, direction) {
    const chars = [...text];
    const idx = chars.map((_, i) => i).filter((i) => chars[i] !== " ");
    if (direction === "end") return idx.reverse();
    if (direction === "center") {
        const mid = (chars.length - 1) / 2;
        return idx.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    }
    if (direction === "random") {
        for (let i = idx.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idx[i], idx[j]] = [idx[j], idx[i]];
        }
    }
    return idx;
}

const scrambleAll = (text, chars) => [...text].map((ch) => (ch === " " ? " " : pick(chars, ch)));

const ScrambleText = ({
    text = "Decrypting the future",
    as: Tag = "span",
    trigger = "view",
    speed = 40,
    revealRate = 2,
    direction = "start",
    characters = DEFAULT_CHARS,
    accentColor = "#a3e635",
    loopDelay = 2400,
    className = "",
    ...rest
}) => {
    const ref = useRef(null);
    const timers = useRef({ tick: 0, wait: 0 });
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: trigger === "view", margin: "-10% 0px" });
    // null means "show the real text"; an array means scrambled letters, with locked ones in `locked`.
    const [output, setOutput] = useState(() => (trigger === "view" && !reduced ? scrambleAll(text, characters) : null));
    const [locked, setLocked] = useState(() => new Set());
    const running = useRef(false);

    const stop = useCallback(() => {
        clearInterval(timers.current.tick);
        clearTimeout(timers.current.wait);
        running.current = false;
    }, []);

    const run = useCallback(() => {
        if (reduced || running.current) return;
        running.current = true;
        const order = revealOrder(text, direction);
        let tick = 0;
        timers.current.tick = setInterval(() => {
            tick += 1;
            const count = Math.floor(tick / Math.max(1, revealRate));
            const done = new Set(order.slice(0, count));
            if (count >= order.length) {
                clearInterval(timers.current.tick);
                running.current = false;
                setOutput(null);
                setLocked(new Set());
                if (trigger === "loop") timers.current.wait = setTimeout(run, loopDelay);
                return;
            }
            setLocked(done);
            setOutput([...text].map((ch, i) => (ch === " " || done.has(i) ? ch : pick(characters, ch))));
        }, speed);
    }, [reduced, text, direction, revealRate, speed, characters, trigger, loopDelay]);

    // Start on view / loop; restart cleanly when the settings change.
    useEffect(() => {
        if (reduced) {
            setOutput(null);
            return undefined;
        }
        if ((trigger === "view" || trigger === "loop") && inView) run();
        return stop;
    }, [trigger, inView, run, stop, reduced]);

    const hoverProps = trigger === "hover" ? { onPointerEnter: run, onFocus: run } : {};

    // Group letters by word so lines only wrap between words.
    let index = 0;
    const words = text.split(" ").map((word, w) => {
        const letters = [...word].map((ch) => {
            const i = index++;
            const shown = output ? output[i] : ch;
            const scrambling = output && !locked.has(i);
            return (
                <span key={i} className="relative inline-block">
                    <span className="invisible">{ch}</span>
                    <span className="absolute inset-0 text-center" style={scrambling ? { color: accentColor } : undefined}>
                        {shown}
                    </span>
                </span>
            );
        });
        index += 1; // the space
        return (
            <React.Fragment key={w}>
                {w > 0 && " "}
                <span className="inline-block whitespace-nowrap">{letters}</span>
            </React.Fragment>
        );
    });

    return (
        <Tag ref={ref} aria-label={text} className={className} {...rest} {...hoverProps}>
            <span aria-hidden="true">{words}</span>
        </Tag>
    );
};

export default ScrambleText;
