import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CHAPTERS } from "../data/site.js";
import { Container, EASE, Lines, SectionLabel } from "../lib/ui.jsx";

// Signature: "From cherry to cup". On desktop the photo is sticky on the left and
// crossfades as each chapter reaches the middle of the screen. On phones each
// chapter carries its own photo inline.
export default function Process() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const chapterRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    chapterRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="03" name="Process" meta="Cherry to cup" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Lines as="h2" text="From cherry to cup." className="font-display text-[40px] leading-[1.02] sm:text-[56px]" />
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-[var(--k-muted)]">
              Four stages, most of them slow and many of them done by hand. We roast and brew, and the first two are printed on every bag.
            </p>

            <div className="hidden lg:sticky lg:top-28 lg:mt-12 lg:block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--k-surface)]">
                {CHAPTERS.map((c, i) => (
                  <motion.img
                    key={c.n}
                    src={c.image}
                    alt={active === i ? c.alt : ""}
                    aria-hidden={active !== i}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={false}
                    animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.06 }}
                    transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
                  />
                ))}
              </div>
              <p className="num mt-4 text-sm text-[var(--k-muted)]">
                {CHAPTERS[active].n} / {String(CHAPTERS.length).padStart(2, "0")}, {CHAPTERS[active].title}
              </p>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {CHAPTERS.map((c, i) => (
              <li
                key={c.n}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                data-index={i}
                className="flex flex-col justify-center border-t border-[var(--k-line)] py-12 lg:min-h-[75svh]"
              >
                <span className="num text-sm text-[var(--k-muted)]">{c.n}</span>
                <h3 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">{c.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--k-muted)]">{c.body}</p>
                <div className="mt-8 aspect-[4/3] overflow-hidden bg-[var(--k-surface)] lg:hidden">
                  <img src={c.image} alt={c.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
