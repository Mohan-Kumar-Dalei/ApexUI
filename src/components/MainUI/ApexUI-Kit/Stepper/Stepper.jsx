import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/*
 * Stepper: a multi-step flow. The indicators fill and tick as you move on,
 * the connector lines fill in between, and each step's content slides in
 * from the side you are heading while the panel height follows smoothly.
 */

const DEFAULT_STEPS = [
    { title: "Account", content: <p>Welcome! Pick a username to get started — you can change it later.</p> },
    { title: "Profile", content: <p>Add a photo and a short bio so people know who you are.</p> },
    { title: "Theme", content: <p>Choose light, dark or follow your system. Your choice syncs everywhere.</p> },
    { title: "Done", content: <p>All set. Press Complete to finish onboarding.</p> },
];

const variants = {
    enter: (dir) => ({ x: dir > 0 ? "40%" : "-40%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-40%" : "40%", opacity: 0 }),
};

const Stepper = ({ steps = DEFAULT_STEPS, initialStep = 0, onStepChange, onComplete, accentColor = "#a3e635", theme = "dark", className = "" }) => {
    const id = useId();
    const [step, setStep] = useState(initialStep);
    const [dir, setDir] = useState(1);
    const [done, setDone] = useState(false);
    const dark = theme !== "light";
    const last = step === steps.length - 1;

    const go = (to) => {
        if (to < 0 || to >= steps.length) return;
        setDir(to > step ? 1 : -1);
        setStep(to);
        onStepChange?.(to);
    };

    return (
        <div className={`w-full max-w-md rounded-[1.6rem] border p-6 ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"} ${className}`}>
            <div className="flex items-center">
                {steps.map((s, i) => {
                    const complete = done || i < step;
                    const current = !done && i === step;
                    return (
                        <React.Fragment key={i}>
                            <button type="button" onClick={() => !done && go(i)} aria-label={`Step ${i + 1}: ${s.title}`} aria-current={current ? "step" : undefined} className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold">
                                <motion.span
                                    className="absolute inset-0 rounded-full"
                                    initial={false}
                                    animate={{ backgroundColor: complete || current ? accentColor : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", scale: current ? 1.08 : 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                {current && <motion.span layoutId={`${id}-ring`} className="absolute -inset-1 rounded-full border-2" style={{ borderColor: `color-mix(in srgb, ${accentColor} 45%, transparent)` }} />}
                                <span className={`relative ${complete || current ? "text-black" : "opacity-60"}`}>
                                    {complete ? (
                                        <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="block">
                                            <Check className="h-4 w-4" strokeWidth={3} />
                                        </motion.span>
                                    ) : (
                                        i + 1
                                    )}
                                </span>
                            </button>
                            {i < steps.length - 1 && (
                                <div className={`mx-2 h-1 flex-1 overflow-hidden rounded-full ${dark ? "bg-white/[0.08]" : "bg-black/[0.06]"}`}>
                                    <motion.div className="h-full rounded-full" style={{ background: accentColor }} initial={false} animate={{ width: done || i < step ? "100%" : "0%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <motion.div layout className="relative mt-6 overflow-hidden" transition={{ type: "spring", stiffness: 300, damping: 32 }}>
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div key={done ? "done" : step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 32 }} className="pb-1">
                        {done ? (
                            <div className="py-4 text-center">
                                <p className="text-lg font-semibold">You are all set 🎉</p>
                                <p className={`mt-1 text-sm ${dark ? "text-white/55" : "text-neutral-500"}`}>Every step is complete.</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
                                    Step {step + 1} of {steps.length}
                                </p>
                                <h3 className="mt-1 text-xl font-semibold">{steps[step].title}</h3>
                                <div className={`mt-2 text-[0.92rem] leading-relaxed ${dark ? "text-white/65" : "text-neutral-600"}`}>{steps[step].content}</div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="mt-6 flex items-center justify-between">
                {done ? (
                    <button type="button" onClick={() => {
                            setDone(false);
                            go(0);
                        }} className={`rounded-full px-4 py-2 text-sm font-medium ${dark ? "bg-white/[0.06] hover:bg-white/10" : "bg-black/[0.05] hover:bg-black/[0.08]"}`}>
                        Start over
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-0 ${dark ? "text-white/70 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
                            Back
                        </button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => {
                                if (!last) return go(step + 1);
                                setDone(true);
                                onComplete?.();
                            }}
                            className="rounded-full px-5 py-2 text-sm font-semibold text-black"
                            style={{ background: accentColor }}
                        >
                            {last ? "Complete" : "Continue"}
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Stepper;
