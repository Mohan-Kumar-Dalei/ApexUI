import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../lib/ui.jsx";
import { ROAST_STEPS } from "../data/site.js";

// The roast scale: five hairline segments, filled up to the roast level.
// Only transform animates (scaleX), so it stays cheap on phones.
export default function RoastScale({ level, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      <div className="flex gap-1.5" role="img" aria-label={`Roast level: ${ROAST_STEPS[level]}`}>
        {ROAST_STEPS.map((step, i) => (
          <span key={step} className="relative h-[3px] flex-1 overflow-hidden bg-[var(--k-line)]">
            <motion.span
              className={`absolute inset-0 origin-left ${i === level ? "bg-[var(--k-accent)]" : "bg-[var(--k-ink)]"}`}
              initial={false}
              animate={{ scaleX: i <= level ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : i * 0.06 }}
            />
          </span>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-[var(--k-muted)]">
        <span>Light</span>
        <span className="text-[var(--k-ink)]">{ROAST_STEPS[level]}</span>
        <span>Dark</span>
      </div>
    </div>
  );
}
