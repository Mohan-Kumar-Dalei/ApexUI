import FaqAccordion from "../ApexUI-Kit/FaqAccordion/FaqAccordion.jsx";
import { FAQS } from "../data/site.js";
import { Container, Lines, SectionLabel } from "../lib/ui.jsx";

export default function Faq() {
  return (
    <section id="faq" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="06" name="Questions" meta="Delivery, freshness and the bar" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Lines as="h2" text="Questions before you order." className="font-display text-[40px] leading-[1.02] sm:text-[56px] lg:col-span-5" />
          <div className="lg:col-span-6 lg:col-start-7">
            <FaqAccordion items={FAQS} defaultOpen={[0]} />
          </div>
        </div>
      </Container>
    </section>
  );
}
