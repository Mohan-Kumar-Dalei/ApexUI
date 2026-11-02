import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BEANS, GRINDS, WEIGHTS, formatINR } from "../data/site.js";
import { Container, EASE, Lines, Reveal, SectionLabel } from "../lib/ui.jsx";
import RoastScale from "./RoastScale.jsx";

const segment = (on) =>
  `h-11 border px-5 text-sm transition-colors duration-300 ${on ? "border-[var(--k-ink)] bg-[var(--k-ink)] text-[var(--k-bg)]" : "border-[var(--k-line)] text-[var(--k-ink)] hover:border-[var(--k-ink)]"}`;

export default function Beans({ bag, onAdd }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [weight, setWeight] = useState(WEIGHTS[0]);
  const [grind, setGrind] = useState(GRINDS[1]);
  const [lastAdded, setLastAdded] = useState("");

  const bean = BEANS[selected];
  const price = weight.id === "250" ? bean.price250 : bean.price1000;
  const total = bag.reduce((sum, line) => sum + line.price, 0);

  const pick = (i) => {
    setSelected(i);
    setLastAdded("");
  };

  const add = () => {
    onAdd({ id: bean.id, name: bean.name, weight: weight.label, grind, price });
    setLastAdded(`${bean.name}, ${weight.label}, ${grind.toLowerCase()}, added to your bag.`);
  };

  const bagLine = bag.length
    ? `In your bag: ${bag.length} ${bag.length === 1 ? "item" : "items"}, ${formatINR(total)}.`
    : "Your bag is empty.";

  return (
    <section id="beans" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="02" name="Beans" meta="Roasted this week" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Lines as="h2" text="Three beans on the shelf." className="font-display text-[40px] leading-[1.02] sm:text-[56px]" />
            <Reveal className="mt-6 max-w-md text-lg leading-relaxed text-[var(--k-muted)]">
              <p>Every bag shows its estate, its roast date and its roast level. Pick a bean, a weight and a grind.</p>
            </Reveal>

            <ul className="mt-12 border-t border-[var(--k-line)]">
              {BEANS.map((b, i) => (
                <li key={b.id} className="border-b border-[var(--k-line)]">
                  <button
                    type="button"
                    aria-pressed={i === selected}
                    onClick={() => pick(i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-6 text-left sm:grid-cols-[3.5rem_1fr_auto]"
                  >
                    <span className="num text-sm text-[var(--k-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span
                        className={`block font-display text-[34px] leading-none transition-colors duration-500 sm:text-[44px] ${
                          i === selected ? "text-[var(--k-ink)]" : "text-[var(--k-muted)] group-hover:text-[var(--k-ink)]"
                        }`}
                      >
                        {b.name}
                      </span>
                      <span className="mt-2 block text-sm text-[var(--k-muted)]">{b.origin}</span>
                    </span>
                    <span className="num text-sm text-[var(--k-ink)]">{formatINR(b.price250)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={bean.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--k-surface)]">
                  <img src={bean.image} alt={bean.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>

                <div className="mt-8">
                  <p className="text-sm text-[var(--k-muted)]">{bean.origin}</p>
                  <p className="mt-2 font-display text-[32px] leading-tight sm:text-[40px]">{bean.name}</p>
                  <p className="mt-3 text-[var(--k-muted)]">Tasting notes: {bean.notes}.</p>
                  <RoastScale level={bean.roast} className="mt-7" />
                </div>

                <fieldset className="mt-8 min-w-0 border-0 p-0">
                  <legend className="mb-3 p-0 text-sm text-[var(--k-muted)]">Weight</legend>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHTS.map((w) => (
                      <button key={w.id} type="button" aria-pressed={weight.id === w.id} onClick={() => setWeight(w)} className={segment(weight.id === w.id)}>
                        {w.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-6 min-w-0 border-0 p-0">
                  <legend className="mb-3 p-0 text-sm text-[var(--k-muted)]">Grind</legend>
                  <div className="flex flex-wrap gap-2">
                    {GRINDS.map((g) => (
                      <button key={g} type="button" aria-pressed={grind === g} onClick={() => setGrind(g)} className={segment(grind === g)}>
                        {g}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--k-line)] pt-8">
                  <div>
                    <p className="text-sm text-[var(--k-muted)]">Price</p>
                    <p className="num mt-1 font-display text-[40px] leading-none">{formatINR(price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={add}
                    className="h-12 w-full bg-[var(--k-accent)] px-8 text-[15px] text-[var(--k-on-accent)] transition-colors duration-300 hover:bg-[var(--k-ink)] sm:w-auto"
                  >
                    Add to bag
                  </button>
                </div>
                <p aria-live="polite" className="mt-4 min-h-[1.5em] text-sm text-[var(--k-muted)]">
                  {lastAdded || bagLine}
                </p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
