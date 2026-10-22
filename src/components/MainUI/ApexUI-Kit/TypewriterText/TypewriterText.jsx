import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Typewriter Text: types a phrase, pauses, deletes it and moves on to the
 * next, with a blinking caret. Put static text before or after with
 * `prefix` / `suffix`; only the rotating words are typed.
 */

const TypewriterText = ({
    words = ["beautiful interfaces.", "smooth animations.", "accessible components.", "faster launches."],
    prefix = "We build ",
    suffix = "",
    typeSpeed = 70,
    deleteSpeed = 40,
    pause = 1600,
    loop = true,
    caret = "bar",
    accentColor = "#a3e635",
    as: Tag = "p",
    className = "",
}) => {
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);
    const word = words[index % words.length] ?? "";

    useEffect(() => {
        if (reduced) return undefined;
        let delay = deleting ? deleteSpeed : typeSpeed + Math.random() * 40;
        if (!deleting && text === word) {
            if (!loop && index === words.length - 1) return undefined;
            delay = pause;
        } else if (deleting && text === "") delay = 300;

        const id = setTimeout(() => {
            if (!deleting && text === word) setDeleting(true);
            else if (deleting && text === "") {
                setDeleting(false);
                setIndex((i) => (i + 1) % words.length);
            } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
        }, delay);
        return () => clearTimeout(id);
    }, [text, deleting, word, index, words.length, typeSpeed, deleteSpeed, pause, loop, reduced]);

    const shown = reduced ? word : text;
    const caretEl =
        caret === "none" ? null : (
            <span
                aria-hidden="true"
                className={`ml-[0.06em] inline-block animate-[apex-caret_1s_steps(1)_infinite] align-baseline ${caret === "block" ? "h-[1em] w-[0.55em] translate-y-[0.12em]" : caret === "underscore" ? "h-[0.12em] w-[0.6em]" : "h-[1em] w-[0.08em] translate-y-[0.12em]"}`}
                style={{ background: accentColor }}
            />
        );

    return (
        <Tag className={className} aria-label={`${prefix}${words.join(", ")}${suffix}`}>
            <style>{"@keyframes apex-caret{0%,100%{opacity:1}50%{opacity:0}}"}</style>
            <span aria-hidden="true">
                {prefix}
                <span style={{ color: accentColor }}>{shown}</span>
                {caretEl}
                {suffix}
            </span>
        </Tag>
    );
};

export default TypewriterText;
