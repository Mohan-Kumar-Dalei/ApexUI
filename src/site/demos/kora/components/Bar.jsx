import { MENU, photo } from "../data/site.js";
import { Container, Curtain, Lines, Reveal, SectionLabel } from "../lib/ui.jsx";

const PHOTO_POUR = "photo-1495474472287-4d71bcdd2085";

export default function Bar() {
  return (
    <section id="bar" className="bg-[var(--k-surface)] py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="04" name="The bar" meta="Counter seats and a few tables" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-6">
            <Lines as="h2" text="A slow bar, one cup at a time." className="font-display text-[40px] leading-[1.02] sm:text-[56px]" />
            <Reveal className="mt-6 max-w-md text-lg leading-relaxed text-[var(--k-muted)]">
              <p>
                Filter coffee is brewed to order, and pour-overs take a few minutes. We would rather you wait a little than rush the cup.
              </p>
            </Reveal>
            <Curtain src={photo(PHOTO_POUR)} alt="Coffee being poured at the bar" ratio="aspect-[4/3]" className="mt-12" />
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="bg-[var(--k-bg)] p-6 sm:p-10">
              <p className="font-display text-[40px] leading-none">Bar menu</p>
              <p className="mt-3 text-sm text-[var(--k-muted)]">Brewed to order. Prices in rupees.</p>
              <ul className="mt-8">
                {MENU.map((item) => (
                  <li key={item.name} className="border-t border-[var(--k-line)] py-5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[26px] leading-none">{item.name}</span>
                      <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-[var(--k-muted)]" />
                      <span className="num text-[15px]">₹{item.price}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--k-muted)]">{item.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
