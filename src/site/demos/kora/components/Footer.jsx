import { motion, useReducedMotion } from "framer-motion";
import { Container, EASE, UNDERLINE } from "../lib/ui.jsx";
import { VISIT_DETAILS } from "../data/site.js";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Beans", href: "#beans" },
      { label: "From cherry to cup", href: "#process" },
      { label: "Delivery questions", href: "#faq" },
    ],
  },
  {
    title: "Bar",
    links: [
      { label: "Bar menu", href: "#bar" },
      { label: "Visit", href: "#visit" },
      { label: "Get directions", href: VISIT_DETAILS.directions, external: true },
    ],
  },
];

function LinkItem({ label, href, external }) {
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <li>
      <a href={href} className={`${UNDERLINE} text-[var(--k-ink)]`} {...extra}>
        {label}
      </a>
    </li>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="overflow-hidden border-t border-[var(--k-line)] pt-16 pb-10">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="font-display text-[28px] leading-none">Kora</p>
            <p className="mt-4 max-w-xs text-[var(--k-muted)]">Specialty coffee roasted in Indiranagar, Bengaluru. Beans delivered across India.</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2 lg:col-start-auto">
              <p className="text-sm text-[var(--k-muted)]">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <LinkItem key={link.label} {...link} />
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <p className="text-sm text-[var(--k-muted)]">Contact</p>
            <ul className="mt-4 space-y-3 text-[var(--k-ink)]">
              <li>{VISIT_DETAILS.address}</li>
              <li>
                <a href={`tel:${VISIT_DETAILS.phone.replace(/\s/g, "")}`} className={UNDERLINE}>
                  {VISIT_DETAILS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${VISIT_DETAILS.email}`} className={`${UNDERLINE} break-all`}>
                  {VISIT_DETAILS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--k-line)] pt-6 text-sm text-[var(--k-muted)] sm:flex-row sm:justify-between">
          <p>© 2026 Kora Coffee. Prices in rupees.</p>
          <p>Indiranagar, Bengaluru</p>
        </div>
      </Container>

      <motion.p
        aria-hidden="true"
        className="mt-10 select-none whitespace-nowrap text-center font-display leading-[0.8] tracking-[-0.03em] text-[var(--k-surface)] text-[min(46vw,40rem)]"
        initial={reduce ? false : { y: "30%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        Kora
      </motion.p>
    </footer>
  );
}
