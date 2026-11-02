import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

/*
 * FAQ Accordion, restyled for Kora: a hairline list, square plus marks, the
 * question in the text face and the answer in the muted token. Answers open
 * with a height and opacity move. One or many items can be open at once.
 */

const EASE = [0.16, 1, 0.3, 1];

const FaqAccordion = ({ items = [], multiple = false, defaultOpen = [0], className = "" }) => {
  const id = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(() => new Set(defaultOpen));

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : prev.has(i) ? [i] : []);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={`w-full divide-y divide-[var(--k-line)] border-y border-[var(--k-line)] ${className}`}>
      {items.map((item, i) => {
        const on = open.has(i);
        return (
          <h3 key={item.q} className="font-[family-name:var(--k-font-text)] font-normal">
            <button
              type="button"
              id={`${id}-q-${i}`}
              aria-expanded={on}
              aria-controls={`${id}-a-${i}`}
              onClick={() => toggle(i)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg text-[var(--k-ink)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--k-accent)]"
            >
              <span className={`transition-colors duration-300 ${on ? "text-[var(--k-accent)]" : ""}`}>{item.q}</span>
              <motion.span
                animate={{ rotate: on ? 45 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                className={`grid h-9 w-9 shrink-0 place-items-center border transition-colors duration-300 ${
                  on ? "border-[var(--k-accent)] bg-[var(--k-accent)] text-[var(--k-on-accent)]" : "border-[var(--k-line)] text-[var(--k-ink)] group-hover:border-[var(--k-ink)]"
                }`}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
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
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 leading-relaxed text-[var(--k-muted)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </h3>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
