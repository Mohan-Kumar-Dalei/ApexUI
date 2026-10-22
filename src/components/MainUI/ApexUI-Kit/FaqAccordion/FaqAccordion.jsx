import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

/*
 * FAQ Accordion: questions that open with a smooth height animation, a plus
 * that turns into a cross, and a soft highlight on the open item. One or many
 * items can be open at once.
 */

const DEFAULT_ITEMS = [
    { q: "Is ApexUI free to use?", a: "Yes. Every component is free and open source — copy it into your project or add it with one CLI command." },
    { q: "Does it work with Next.js?", a: "Yes. The components are plain React with Tailwind CSS, so they work in Vite, Next.js, Remix and anything else that runs React." },
    { q: "Can I change the colors?", a: "Every component takes props for its accent colors, and the Tailwind classes are right there in the code if you want to go further." },
    { q: "Do the animations respect reduced motion?", a: "Yes. Components check the visitor's reduced-motion setting and tone their movement down or switch it off." },
];

const FaqAccordion = ({ items = DEFAULT_ITEMS, multiple = false, defaultOpen = [0], accentColor = "#a3e635", theme = "dark", className = "" }) => {
    const id = useId();
    const [open, setOpen] = useState(() => new Set(defaultOpen));
    const dark = theme !== "light";

    const toggle = (i) =>
        setOpen((prev) => {
            const next = new Set(multiple ? prev : prev.has(i) ? [i] : []);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });

    return (
        <div className={`w-full max-w-2xl space-y-2 ${className}`}>
            {items.map((item, i) => {
                const on = open.has(i);
                return (
                    <div
                        key={i}
                        className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${dark ? "text-white" : "text-neutral-900"} ${
                            on ? (dark ? "border-white/15 bg-white/[0.05]" : "border-black/10 bg-black/[0.03]") : dark ? "border-white/10 bg-transparent hover:bg-white/[0.03]" : "border-black/10 bg-transparent hover:bg-black/[0.02]"
                        }`}
                    >
                        <button
                            type="button"
                            id={`${id}-q-${i}`}
                            aria-expanded={on}
                            aria-controls={`${id}-a-${i}`}
                            onClick={() => toggle(i)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current/30"
                        >
                            {item.q}
                            <motion.span
                                animate={{ rotate: on ? 45 : 0, backgroundColor: on ? accentColor : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: on ? "#0a0a0a" : dark ? "#fff" : "#111" }}
                                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                            >
                                <Plus className="h-4 w-4" />
                            </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                            {on && (
                                <motion.div
                                    id={`${id}-a-${i}`}
                                    role="region"
                                    aria-labelledby={`${id}-q-${i}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                                >
                                    <motion.p
                                        initial={{ y: -6 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: -6 }}
                                        className={`px-5 pb-5 text-[0.9rem] leading-relaxed ${dark ? "text-white/65" : "text-neutral-600"}`}
                                    >
                                        {item.a}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default FaqAccordion;
