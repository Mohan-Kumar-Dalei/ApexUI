import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, EASE, Lines, Reveal, UNDERLINE } from "../lib/ui.jsx";
import { HERO } from "../data/site.js";
import RoastScale from "./RoastScale.jsx";

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const roast = HERO.roast;

  return (
    <section ref={ref} id="top" className="pt-28 sm:pt-32 lg:pt-36">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 lg:pt-6">
          <Reveal className="text-sm text-[var(--k-muted)]">Roastery and bar, Indiranagar, Bengaluru</Reveal>
          <Lines
            as="h1"
            onMount
            text="Coffee from two estates, roasted in Indiranagar."
            className="mt-6 font-display text-[40px] leading-[1.02] sm:text-[56px] lg:text-[80px]"
          />
          <Reveal delay={0.45} className="mt-8 max-w-md text-lg leading-relaxed text-[var(--k-muted)]">
            <p>
              Single-origin beans from Chikmagalur and Coorg, roasted in small batches and delivered across India. Or sit down at the bar.
            </p>
          </Reveal>
          <Reveal delay={0.6} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="#beans"
              className="inline-flex h-12 items-center gap-2 bg-[var(--k-accent)] px-7 text-[15px] text-[var(--k-on-accent)] transition-colors duration-300 hover:bg-[var(--k-ink)]"
            >
              Shop beans
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="#bar" className={`${UNDERLINE} text-[15px] text-[var(--k-ink)]`}>
              Visit the bar
            </a>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--k-surface)] sm:aspect-[5/4] lg:aspect-[4/5]">
            <motion.div className="absolute inset-x-0 -top-[8%] -bottom-[8%]" style={{ y: reduce ? 0 : y }}>
              <motion.img
                src={HERO.image}
                alt={HERO.alt}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
                initial={reduce ? false : { scale: 1.14 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.2, ease: EASE }}
              />
            </motion.div>
          </div>

          <Reveal
            delay={0.9}
            className="mt-4 bg-[var(--k-bg)] p-5 sm:mt-6 sm:p-6 lg:absolute lg:bottom-6 lg:left-6 lg:mt-0 lg:w-[19rem]"
          >
            <p className="text-sm text-[var(--k-muted)]">{roast.label}</p>
            <p className="mt-2 font-display text-[28px] leading-none">{roast.name}</p>
            <p className="mt-2 text-sm text-[var(--k-muted)]">{roast.origin}</p>
            <p className="mt-4 text-sm text-[var(--k-ink)]">{roast.notes}</p>
            <RoastScale level={roast.level} className="mt-5" />
            <a href={roast.anchor} className={`${UNDERLINE} mt-5 inline-block text-sm`}>
              See the beans
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
