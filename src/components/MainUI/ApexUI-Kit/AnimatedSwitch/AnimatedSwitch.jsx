import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { Check, Moon, Sun, X } from "lucide-react";

/*
 * Animated Switch: a toggle with personality. Variants:
 *  classic  – the familiar pill with a springy knob that stretches as it moves
 *  icon     – the knob shows a cross or a check
 *  daynight – a sun crosses into a starry night
 *  neon     – a glowing track that lights up when on
 * Works controlled (`checked` + `onChange`) or on its own (`defaultChecked`).
 */

const knobSpring = { type: "spring", stiffness: 520, damping: 32 };

const AnimatedSwitch = ({ variant = "classic", checked, defaultChecked = false, onChange, label, accentColor = "#a3e635", size = 1, disabled = false, className = "" }) => {
    const id = useId();
    const [inner, setInner] = useState(defaultChecked);
    const on = checked ?? inner;
    const toggle = () => {
        if (disabled) return;
        if (checked === undefined) setInner(!on);
        onChange?.(!on);
    };

    const W = 3.25 * size;
    const H = 1.85 * size;
    const K = H - 0.35 * size;
    const travel = W - K - 0.35 * size;

    const track = {
        classic: { background: on ? accentColor : "rgba(120,120,128,0.32)" },
        icon: { background: on ? accentColor : "rgba(120,120,128,0.32)" },
        daynight: { background: on ? "linear-gradient(135deg,#0f172a,#312e81)" : "linear-gradient(135deg,#7dd3fc,#38bdf8)" },
        neon: { background: "#0a0a0a", boxShadow: on ? `0 0 0 1.5px ${accentColor}, 0 0 18px ${accentColor}99, inset 0 0 12px ${accentColor}55` : "0 0 0 1.5px rgba(255,255,255,0.15)" },
    }[variant];

    return (
        <label htmlFor={id} className={`inline-flex select-none items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={on}
                disabled={disabled}
                onClick={toggle}
                className="relative shrink-0 overflow-hidden rounded-full outline-none transition-[background,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ width: `${W}rem`, height: `${H}rem`, ...track }}
            >
                {variant === "daynight" && (
                    <>
                        {[0.9, 1.6, 2.2, 1.2].map((x, i) => (
                            <motion.span
                                key={i}
                                className="absolute h-[0.14rem] w-[0.14rem] rounded-full bg-white"
                                style={{ left: `${x * size * 0.7}rem`, top: `${(0.35 + (i % 2) * 0.55) * size}rem` }}
                                animate={{ opacity: on ? [0.3, 1, 0.3] : 0, scale: on ? 1 : 0 }}
                                transition={{ duration: 1.6, repeat: on ? Infinity : 0, delay: i * 0.3 }}
                            />
                        ))}
                        <motion.span className="absolute rounded-full bg-white/80" style={{ width: `${0.9 * size}rem`, height: `${0.35 * size}rem`, top: `${1.05 * size}rem` }} animate={{ left: on ? `${-1.2 * size}rem` : `${1.7 * size}rem`, opacity: on ? 0 : 1 }} transition={{ duration: 0.4 }} />
                    </>
                )}
                <motion.span
                    className="absolute grid place-items-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                    style={{ left: `${0.175 * size}rem`, top: `${(H - K) / 2}rem`, height: `${K}rem`, background: variant === "daynight" ? (on ? "#e2e8f0" : "#fde047") : variant === "neon" ? (on ? accentColor : "#3f3f46") : "#ffffff" }}
                    initial={false}
                    animate={{ x: on ? `${travel}rem` : "0rem", width: on ? [`${K}rem`, `${K * 1.25}rem`, `${K}rem`] : [`${K}rem`, `${K * 1.24}rem`, `${K}rem`] }}
                    transition={{ x: knobSpring, width: { duration: 0.3 } }}
                >
                    {variant === "icon" && (on ? <Check className="h-3/5 w-3/5" style={{ color: accentColor }} strokeWidth={3} /> : <X className="h-3/5 w-3/5 text-neutral-400" strokeWidth={3} />)}
                    {variant === "daynight" && (on ? <Moon className="h-3/5 w-3/5 text-slate-500" fill="currentColor" /> : <Sun className="h-3/5 w-3/5 text-amber-600" />)}
                </motion.span>
            </button>
            {label && <span className="text-sm font-medium">{label}</span>}
        </label>
    );
};

export default AnimatedSwitch;
