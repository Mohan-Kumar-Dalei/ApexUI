import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

/*
 * Pricing Cards: plans side by side with a monthly / yearly switch. Prices
 * slide to their new value, the featured plan glows, and every card lifts
 * on hover. Wraps to one column on small screens.
 */

const DEFAULT_PLANS = [
    { name: "Starter", monthly: 0, yearly: 0, description: "For side projects and trying things out.", features: ["10 components", "Community support", "MIT licence"], cta: "Start free" },
    { name: "Pro", monthly: 19, yearly: 15, description: "For freelancers shipping client work.", features: ["All 60+ components", "Figma kit", "Priority support", "Lifetime updates"], cta: "Go Pro", featured: true },
    { name: "Team", monthly: 49, yearly: 39, description: "For product teams that move fast.", features: ["Everything in Pro", "5 seats", "Private Slack", "Custom requests"], cta: "Contact sales" },
];

function Price({ value, currency }) {
    return (
        // Old and new numbers share one grid cell (no layout popping, no flicker);
        // an invisible copy of the current value sets the width.
        <span className="relative inline-grid h-[1.1em] overflow-hidden align-bottom tabular-nums">
            <span aria-hidden="true" className="invisible col-start-1 row-start-1">
                {currency}
                {value}
            </span>
            <AnimatePresence initial={false}>
                <motion.span
                    key={value}
                    className="col-start-1 row-start-1"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                    {currency}
                    {value}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

const PricingCards = ({ plans = DEFAULT_PLANS, currency = "$", yearlyNote = "Save 20%", accentColor = "#a3e635", theme = "dark", onSelect, className = "" }) => {
    const id = useId();
    const [yearly, setYearly] = useState(false);
    const dark = theme !== "light";

    return (
        <div className={`w-full ${dark ? "text-white" : "text-neutral-900"} ${className}`}>
            <div className="mb-8 flex items-center justify-center gap-3 text-sm font-medium">
                <div className={`relative flex rounded-full p-1 ${dark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`} role="radiogroup" aria-label="Billing period">
                    {[false, true].map((y) => (
                        <button
                            key={String(y)}
                            type="button"
                            role="radio"
                            aria-checked={yearly === y}
                            onClick={() => setYearly(y)}
                            className={`relative rounded-full px-4 py-1.5 transition-colors ${yearly === y ? "text-neutral-950" : dark ? "text-white/60 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                        >
                            {yearly === y && <motion.span layoutId={`${id}-period`} className="absolute inset-0 rounded-full" style={{ background: accentColor }} transition={{ type: "spring", stiffness: 480, damping: 36 }} />}
                            <span className="relative">{y ? "Yearly" : "Monthly"}</span>
                        </button>
                    ))}
                </div>
                <span className="rounded-full px-2 py-0.5 text-[0.72rem] font-semibold" style={{ background: `color-mix(in srgb, ${accentColor} 18%, transparent)`, color: dark ? accentColor : `color-mix(in srgb, ${accentColor} 55%, #000)` }}>
                    {yearlyNote}
                </span>
            </div>

            <div className="grid items-stretch gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
                {plans.map((plan) => {
                    const price = yearly ? plan.yearly : plan.monthly;
                    return (
                        <motion.article
                            key={plan.name}
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={`relative flex flex-col rounded-3xl border p-6 ${dark ? "bg-neutral-950" : "bg-white"} ${plan.featured ? "" : dark ? "border-white/10" : "border-black/10"}`}
                            style={plan.featured ? { borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}, 0 24px 60px -24px ${accentColor}88` } : undefined}
                        >
                            {plan.featured && (
                                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold text-neutral-950" style={{ background: accentColor }}>
                                    <Sparkles className="h-3 w-3" /> Most popular
                                </span>
                            )}
                            <h3 className="text-lg font-semibold">{plan.name}</h3>
                            <p className={`mt-1 text-[0.85rem] ${dark ? "text-white/55" : "text-neutral-500"}`}>{plan.description}</p>
                            <p className="mt-5 flex items-end gap-1.5">
                                <span className="text-4xl font-bold tracking-tight">
                                    <Price value={price} currency={currency} />
                                </span>
                                <span className={`mb-1 text-sm ${dark ? "text-white/45" : "text-neutral-400"}`}>/ month</span>
                            </p>
                            <p className={`h-5 text-[0.75rem] ${dark ? "text-white/40" : "text-neutral-400"}`}>{yearly && price > 0 ? `${currency}${price * 12} billed yearly` : ""}</p>
                            <ul className="mt-5 flex-1 space-y-2.5 text-[0.88rem]">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5">
                                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in srgb, ${accentColor} 22%, transparent)` }}>
                                            <Check className="h-3 w-3" style={{ color: dark ? accentColor : `color-mix(in srgb, ${accentColor} 50%, #000)` }} />
                                        </span>
                                        <span className={dark ? "text-white/80" : "text-neutral-700"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => onSelect?.(plan, yearly ? "yearly" : "monthly")}
                                className={`mt-6 h-11 rounded-full text-sm font-semibold transition-[transform,filter] duration-200 hover:brightness-105 active:scale-[0.97] ${plan.featured ? "text-neutral-950" : dark ? "bg-white/[0.08] text-white hover:bg-white/[0.12]" : "bg-black/[0.05] text-neutral-900 hover:bg-black/[0.08]"}`}
                                style={plan.featured ? { background: accentColor } : undefined}
                            >
                                {plan.cta}
                            </button>
                        </motion.article>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingCards;
