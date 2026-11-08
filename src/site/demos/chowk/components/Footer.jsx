import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { restaurants } from "../data";
import { EASE } from "./ui";
import { href } from "../base.js";

const cols = [
  { title: "Chowk", links: [["Offers", href("/offers")], ["Search", href("/search")], ["Your cart", href("/checkout")]] },
  {
    title: "Popular kitchens",
    links: restaurants.slice(0, 5).map((r) => [r.name, href(`/restaurant/${r.id}`)]),
  },
  {
    title: "We deliver in",
    links: [["Indiranagar"], ["Koramangala"], ["HSR Layout"], ["Jayanagar"], ["Whitefield"]],
  },
];

export default function Footer() {
  const reduce = useReducedMotion();
  return (
    <footer className="overflow-hidden bg-(--c-ink) pb-24 pt-20 text-(--c-bg) md:pb-10">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="max-w-xs ck-display text-[28px] leading-tight">Hungry at midnight? Most kitchens here cook till 1 am.</p>
            <p className="mt-5 text-[15px] text-(--c-bg)/60">Help with an order: help@chowk.example, or call 080 4000 1234, 7 am to 2 am.</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 md:col-span-7 md:col-start-6">
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="ck-text text-[13px] font-semibold uppercase tracking-[0.14em] text-(--c-bg)/50">{c.title}</h3>
              <ul className="mt-5 space-y-3 text-[15px]">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="link-line text-(--c-bg)/85 hover:text-(--c-bg)">
                        {label}
                      </Link>
                    ) : (
                      <span className="text-(--c-bg)/85">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
        <motion.p
          aria-hidden="true"
          initial={reduce ? false : { y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="select-none pt-8 ck-display text-[27vw] font-semibold leading-[0.8] tracking-[-0.05em] text-(--c-bg)/[0.07] lg:text-[22vw]"
        >
          chowk
        </motion.p>
        <div className="mt-6 flex flex-col gap-2 text-[13px] text-(--c-bg)/50 sm:flex-row sm:justify-between">
          <span>Chowk is a demo food delivery site. Restaurants, prices and orders are sample data.</span>
          <Link to="/demos" className="link-line w-fit text-(--c-bg)/80 hover:text-(--c-bg)">
            Built with the ApexUI skill. See all demos
          </Link>
        </div>
      </div>
    </footer>
  );
}
