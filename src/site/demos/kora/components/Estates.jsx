import { ESTATES } from "../data/site.js";
import { Container, CountUp, Curtain, Lines, Reveal, SectionLabel, UNDERLINE } from "../lib/ui.jsx";

export default function Estates() {
  return (
    <section id="estates" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="01" name="Estates" meta="Two estates in Karnataka" />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Lines
            as="h2"
            text="Two estates. One roast for each."
            className="font-display text-[40px] leading-[1.02] sm:text-[56px] lg:col-span-8"
          />
          <Reveal className="max-w-md text-lg leading-relaxed text-[var(--k-muted)] lg:col-span-4 lg:self-end">
            <p>Each estate gets its own roast profile, so the cup tastes like the hill it came from.</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--k-line)] pt-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-[56px] leading-none sm:text-[80px]">
              <CountUp to={2} />
            </p>
            <p className="mt-3 text-sm text-[var(--k-muted)]">Estates, both in Karnataka</p>
          </div>
          <div>
            <p className="font-display text-[56px] leading-none sm:text-[80px]">
              <CountUp to={3} />
            </p>
            <p className="mt-3 text-sm text-[var(--k-muted)]">Beans on the shelf this week</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-[28px] leading-tight sm:text-[40px]">Indiranagar</p>
            <p className="mt-3 text-sm text-[var(--k-muted)]">Roastery and bar under one name</p>
          </div>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Curtain
            src={ESTATES[0].image}
            alt={ESTATES[0].alt}
            ratio="aspect-[4/5] lg:aspect-[4/3]"
            className="lg:col-span-7"
          />
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <h3 className="font-display text-[40px] leading-none sm:text-[56px]">{ESTATES[0].name}</h3>
            <p className="mt-6 text-lg leading-relaxed text-[var(--k-muted)]">{ESTATES[0].body}</p>
            <a href="#beans" className={`${UNDERLINE} mt-8 inline-block text-[15px]`}>
              {ESTATES[0].link}
            </a>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Curtain
            src={ESTATES[1].image}
            alt={ESTATES[1].alt}
            ratio="aspect-[4/5] lg:aspect-[4/3]"
            className="lg:order-2 lg:col-span-7"
          />
          <Reveal className="lg:order-1 lg:col-span-4">
            <h3 className="font-display text-[40px] leading-none sm:text-[56px]">{ESTATES[1].name}</h3>
            <p className="mt-6 text-lg leading-relaxed text-[var(--k-muted)]">{ESTATES[1].body}</p>
            <a href="#beans" className={`${UNDERLINE} mt-8 inline-block text-[15px]`}>
              {ESTATES[1].link}
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
