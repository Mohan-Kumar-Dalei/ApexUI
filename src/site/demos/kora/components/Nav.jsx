import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { EASE } from "../lib/ui.jsx";
import { NAV_LINKS } from "../data/site.js";

// Editorial line: a full-width bar with a hairline, the wordmark on the left,
// section links in the middle and the bag on the right. Phones get a full-screen menu.
export default function Nav({ bagCount }) {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > last && y > 480);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV_LINKS.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: "-100%", opacity: 0 }}
        animate={{ y: hidden && !open ? "-100%" : "0%", opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled || open ? "border-[var(--k-line)] bg-[var(--k-bg)]/95" : "border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Main" className={`mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${scrolled ? "h-16" : "h-20"}`}>
          <a href="#top" className="font-display text-[28px] leading-none tracking-tight" aria-label="Kora, back to the top">
            Kora
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map(([label, id]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`relative inline-block py-1 text-[15px] transition-colors duration-300 ${active === id ? "text-[var(--k-ink)]" : "text-[var(--k-muted)] hover:text-[var(--k-ink)]"}`}
                >
                  {label}
                  {active === id && <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-0 h-px w-full bg-[var(--k-accent)]" transition={{ duration: 0.6, ease: EASE }} />}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#beans"
              aria-label={`Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}
              className="inline-flex h-11 items-center gap-2 bg-[var(--k-ink)] px-4 text-sm text-[var(--k-bg)] transition-colors duration-300 hover:bg-[var(--k-accent)]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span>Bag</span>
              <span className="num min-w-[1ch] text-[var(--k-soft)]">{bagCount}</span>
            </a>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-px w-full bg-[var(--k-ink)] transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-[var(--k-ink)] transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-[var(--k-bg)] px-5 pt-24 md:hidden"
            initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul>
              {NAV_LINKS.map(([label, id], i) => (
                <motion.li
                  key={id}
                  initial={reduce ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
                  className="border-b border-[var(--k-line)]"
                >
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="block py-4 font-display text-[40px] leading-none">
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto pb-10 text-sm text-[var(--k-muted)]">Roastery and bar in Indiranagar, Bengaluru. Beans delivered across India.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
