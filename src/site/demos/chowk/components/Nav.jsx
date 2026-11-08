import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { areas } from "../data";
import { useStore } from "../store";
import { EASE, Icon } from "./ui";
import { href } from "../base.js";

export function Wordmark({ className = "" }) {
  return (
    <span className={`ck-display text-[28px] font-semibold leading-none tracking-[-0.03em] ${className}`}>
      chowk<span className="text-(--c-accent)">.</span>
    </span>
  );
}

function AreaPicker() {
  const { area, setArea } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const [place, city] = area.split(", ");
  return (
    <div ref={ref} className="relative min-w-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="group flex min-w-0 items-center gap-1.5 text-left"
      >
        <Icon name="pin" className="h-[18px] w-[18px] shrink-0 text-(--c-accent)" />
        <span className="min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-(--c-muted)">Deliver to</span>
          <span className="flex items-center gap-1 text-[15px] font-semibold">
            <span className="truncate border-b border-(--c-ink)/30 group-hover:border-(--c-ink)">{place}</span>
            <span className="hidden truncate font-normal text-(--c-muted) sm:inline">{city}</span>
            <Icon name="chevronDown" className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Choose your area"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute left-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-xl border border-(--c-line) bg-(--c-card) py-2 shadow-[0_18px_40px_-20px_rgba(30,26,22,0.35)]"
          >
            <li className="px-4 pb-2 pt-1 text-[13px] text-(--c-muted)">We deliver across these areas</li>
            {areas.map((a) => (
              <li key={a}>
                <button
                  role="option"
                  aria-selected={a === area}
                  onClick={() => {
                    setArea(a);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[15px] hover:bg-(--c-surface)"
                >
                  {a}
                  {a === area && <Icon name="check" className="h-4 w-4 text-(--c-accent)" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const { count } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = ({ isActive }) =>
    `link-line flex items-center gap-2 text-[15px] font-medium transition-colors ${isActive ? "text-(--c-accent)" : "text-(--c-ink) hover:text-(--c-accent)"}`;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${scrolled ? "border-(--c-line) bg-(--c-bg)/95 backdrop-blur-md" : "border-transparent bg-(--c-bg)"}`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-5 px-4 sm:px-8 lg:gap-10 lg:px-12">
        <Link to={href("/")} aria-label="Chowk home" className="shrink-0">
          <Wordmark />
        </Link>
        <span aria-hidden="true" className="hidden h-8 w-px bg-(--c-line) sm:block" />
        <AreaPicker />
        <nav aria-label="Main" className="ml-auto hidden items-center gap-8 md:flex">
          <NavLink to={href("/search")} className={link}>
            <Icon name="search" className="h-[18px] w-[18px]" /> Search
          </NavLink>
          <NavLink to={href("/offers")} className={link}>
            <Icon name="tag" className="h-[18px] w-[18px]" /> Offers
          </NavLink>
          <Link
            to={href("/checkout")}
            className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300 ${
              count ? "bg-(--c-accent) text-(--c-on-accent) hover:bg-(--c-accent-ink)" : "border border-(--c-line) text-(--c-ink) hover:border-(--c-ink)"
            } ${pathname === href("/checkout") ? "ring-2 ring-(--c-accent)/30" : ""}`}
          >
            <Icon name="bag" className="h-[18px] w-[18px]" />
            Cart
            <span className={`tnum grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[13px] ${count ? "bg-(--c-on-accent) text-(--c-accent)" : "bg-(--c-surface)"}`}>{count}</span>
          </Link>
        </nav>
        <Link to={href("/search")} aria-label="Search" className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-(--c-line) md:hidden">
          <Icon name="search" className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}

/** Bottom tab bar on phones, the way people actually use a delivery app. */
export function TabBar() {
  const { count } = useStore();
  const item = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold tracking-wide ${isActive ? "text-(--c-accent)" : "text-(--c-muted)"}`;
  return (
    <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-40 border-t border-(--c-line) bg-(--c-card)/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="flex">
        <NavLink to={href("/")} end className={item}>
          <Icon name="home" /> Home
        </NavLink>
        <NavLink to={href("/search")} className={item}>
          <Icon name="search" /> Search
        </NavLink>
        <NavLink to={href("/offers")} className={item}>
          <Icon name="tag" /> Offers
        </NavLink>
        <NavLink to={href("/checkout")} className={item}>
          <span className="relative">
            <Icon name="bag" />
            {count > 0 && (
              <span className="tnum absolute -right-2.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-(--c-accent) px-1 text-[10px] text-(--c-on-accent)">
                {count}
              </span>
            )}
          </span>
          Cart
        </NavLink>
      </div>
    </nav>
  );
}
