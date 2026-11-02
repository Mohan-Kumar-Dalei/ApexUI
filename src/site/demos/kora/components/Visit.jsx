import ImageAccordion from "../ApexUI-Kit/ImageAccordion/ImageAccordion.jsx";
import { VISIT_DETAILS, VISIT_PANELS } from "../data/site.js";
import { Container, Lines, Reveal, SectionLabel, UNDERLINE } from "../lib/ui.jsx";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-[var(--k-line)] py-5 text-[15px] sm:grid-cols-[7.5rem_1fr]">
      <dt className="text-[var(--k-muted)]">{label}</dt>
      <dd className="text-[var(--k-ink)]">{children}</dd>
    </div>
  );
}

export default function Visit() {
  return (
    <section id="visit" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionLabel index="05" name="Visit" meta="Indiranagar, Bengaluru" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <ImageAccordion items={VISIT_PANELS} height="32rem" />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Lines as="h2" text="Come in for a cup." className="font-display text-[40px] leading-[1.02] sm:text-[56px]" />
            <Reveal>
              <dl className="mt-10 border-t border-[var(--k-line)]">
                <Row label="Address">{VISIT_DETAILS.address}</Row>
                <Row label="Hours">{VISIT_DETAILS.hours}</Row>
                <Row label="Phone">
                  <a href={`tel:${VISIT_DETAILS.phone.replace(/\s/g, "")}`} className={UNDERLINE}>
                    {VISIT_DETAILS.phone}
                  </a>
                </Row>
                <Row label="Email">
                  <a href={`mailto:${VISIT_DETAILS.email}`} className={`${UNDERLINE} break-all`}>
                    {VISIT_DETAILS.email}
                  </a>
                </Row>
              </dl>
              <a
                href={VISIT_DETAILS.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`${UNDERLINE} mt-8 inline-flex text-[15px]`}
              >
                Get directions
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
