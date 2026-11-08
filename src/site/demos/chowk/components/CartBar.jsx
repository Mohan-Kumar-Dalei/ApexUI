import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { findRestaurant } from "../data";
import { rupees, useStore } from "../store";
import { EASE, Icon } from "./ui";
import { href } from "../base.js";

/** Floating "items added" bar, shown on restaurant and search pages. */
export function CartBar() {
  const { count, subtotal, restaurant } = useStore();
  const { pathname } = useLocation();
  const show = count > 0 && (pathname.startsWith(href("/restaurant")) || pathname === href("/search"));
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed inset-x-0 bottom-[68px] z-30 px-3 md:bottom-6"
        >
          <Link
            to={href("/checkout")}
            className="mx-auto flex max-w-[720px] items-center justify-between gap-4 rounded-xl bg-(--c-leaf) px-5 py-3.5 text-white shadow-[0_18px_40px_-16px_rgba(30,26,22,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="min-w-0">
              <span className="tnum block text-[15px] font-semibold">
                {count} item{count > 1 ? "s" : ""} added, {rupees(subtotal)}
              </span>
              <span className="block truncate text-[13px] text-white/75">From {restaurant?.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[15px] font-bold">
              View cart <Icon name="chevron" className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Asked when someone adds a dish from a second restaurant. */
export function ReplaceCartModal() {
  const { pending, setPending, confirmReplace, restaurant } = useStore();
  const next = pending ? findRestaurant(pending.restaurantId) : null;
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!pending) return;
    confirmRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setPending(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pending, setPending]);

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPending(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="replace-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="w-full max-w-md rounded-2xl bg-(--c-card) p-6 sm:p-8"
          >
            <h2 id="replace-title" className="text-[28px]">Start a new cart?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-(--c-muted)">
              Your cart has dishes from <strong className="font-semibold text-(--c-ink)">{restaurant?.name}</strong>. One order comes from one kitchen, so adding{" "}
              <strong className="font-semibold text-(--c-ink)">{pending.item.name}</strong> from {next?.name} will clear it.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={() => setPending(null)} className="rounded-lg border border-(--c-line) py-3 text-[15px] font-semibold hover:border-(--c-ink)">
                Keep my cart
              </button>
              <button ref={confirmRef} onClick={confirmReplace} className="rounded-lg bg-(--c-accent) py-3 text-[15px] font-semibold text-(--c-on-accent) hover:bg-(--c-accent-ink)">
                Start fresh
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
