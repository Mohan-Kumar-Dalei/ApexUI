import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { coupons, findRestaurant } from "../data";
import { qtyOf, rupees, useStore } from "../store";
import { EASE, Icon, Lines, Photo, Rating, Reveal, Stepper, VegMark } from "../components/ui";
import NotFound from "./NotFound";
import { href } from "../base.js";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function DishRow({ item, restaurantId }) {
  const { cart, add, remove } = useStore();
  const qty = qtyOf(cart, item.id);
  return (
    <article className="grid grid-cols-[1fr_auto] gap-5 border-b border-(--c-line) py-7 last:border-b-0 sm:gap-8">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <VegMark veg={item.veg} />
          {item.best && <span className="text-[13px] font-semibold text-(--c-accent)">Bestseller</span>}
        </div>
        <h3 className="mt-2 ck-text text-[18px] font-bold tracking-[-0.01em]">{item.name}</h3>
        <p className="tnum mt-1 text-[16px] font-semibold">{rupees(item.price)}</p>
        {item.rating && (
          <p className="mt-1.5 flex items-center gap-1 text-[14px] font-semibold text-(--c-leaf)">
            <Icon name="star" className="h-3.5 w-3.5" fill /> {item.rating.toFixed(1)}
          </p>
        )}
        <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-(--c-muted)">{item.desc}</p>
      </div>
      <div className="relative w-[128px] sm:w-[156px]">
        {item.img ? (
          <>
            <Photo k={item.img} w={320} alt={item.name} className="aspect-square w-full rounded-xl" />
            <div className="absolute -bottom-4 left-1/2 w-[110px] -translate-x-1/2">
              <Stepper qty={qty} label={item.name} onAdd={() => add(restaurantId, item)} onRemove={() => remove(item.id)} />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center">
            <div className="w-full">
              <Stepper qty={qty} label={item.name} onAdd={() => add(restaurantId, item)} onRemove={() => remove(item.id)} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Restaurant() {
  const { id } = useParams();
  const r = findRestaurant(id);
  const [vegOnly, setVegOnly] = useState(false);
  const [bestOnly, setBestOnly] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);
  const [sheet, setSheet] = useState(false);

  const menu = useMemo(() => {
    if (!r) return [];
    const needle = q.trim().toLowerCase();
    return r.menu
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => (!vegOnly || i.veg) && (!bestOnly || i.best) && (!needle || i.name.toLowerCase().includes(needle) || i.desc.toLowerCase().includes(needle))
        ),
      }))
      .filter((c) => c.items.length);
  }, [r, vegOnly, bestOnly, q]);

  useEffect(() => {
    const els = menu.map((c) => document.getElementById(`cat-${slug(c.category)}`)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.cat)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [menu]);

  if (!r) return <NotFound />;

  const jump = (cat) => {
    setSheet(false);
    const el = document.getElementById(`cat-${slug(cat)}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
  };
  const totalDishes = r.menu.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="pb-32">
      {/* Header */}
      <section className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-[14px] text-(--c-muted)">
          <Link to={href("/")} className="link-line hover:text-(--c-ink)">Home</Link>
          <span className="mx-2">/</span>
          <span>{r.area}</span>
          <span className="mx-2">/</span>
          <span className="text-(--c-ink)">{r.name}</span>
        </nav>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px] md:items-end">
          <div>
            <Lines as="h1" onMount text={r.name} className="text-[40px] sm:text-[56px]" />
            <Reveal delay={0.3}>
              <p className="mt-3 text-[17px] text-(--c-muted)">{r.cuisines.join(", ")}</p>
              <div className="tnum mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-semibold">
                <span className="flex items-center gap-2">
                  <Rating value={r.rating} /> <span className="font-normal text-(--c-muted)">{r.ratings} ratings</span>
                </span>
                <span className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4 text-(--c-muted)" /> {r.time}-{r.time + 8} min</span>
                <span>{rupees(r.costForTwo)} for two</span>
                <span className="font-normal text-(--c-muted)">{r.area}, {r.distance} km away</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
            <Photo k={r.img} w={640} alt={`Food from ${r.name}`} className="h-full w-full" />
          </Reveal>
        </div>

        {/* Offers */}
        <Reveal delay={0.35}>
          <h2 className="mt-12 ck-text text-[13px] font-semibold uppercase tracking-[0.14em] text-(--c-muted)">Deals for you</h2>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-(--c-accent)/40 bg-(--c-card) px-4 py-3">
              <Icon name="tag" className="h-5 w-5 text-(--c-accent)" />
              <div>
                <p className="text-[15px] font-bold">{r.offer}</p>
                <p className="text-[13px] text-(--c-muted)">Applied automatically by the kitchen</p>
              </div>
            </div>
            {coupons.slice(0, 3).map((c) => (
              <div key={c.code} className="flex shrink-0 items-center gap-3 rounded-xl border border-(--c-line) bg-(--c-card) px-4 py-3">
                <Icon name="tag" className="h-5 w-5 text-(--c-muted)" />
                <div>
                  <p className="text-[15px] font-bold">{c.title}</p>
                  <p className="text-[13px] text-(--c-muted)">Use {c.code}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Menu */}
      <section className="mx-auto mt-12 max-w-[1100px] px-4 sm:px-8">
        <div className="sticky top-[72px] z-20 -mx-4 border-y border-(--c-line) bg-(--c-bg)/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-(--c-line) bg-(--c-card) px-3 focus-within:border-(--c-ink)">
              <Icon name="search" className="h-4 w-4 text-(--c-muted)" />
              <span className="sr-only">Search this menu</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={40} placeholder={`Search ${totalDishes} dishes`} className="w-full bg-transparent py-2.5 text-[15px] outline-none" />
            </label>
            <button
              onClick={() => setVegOnly((v) => !v)}
              aria-pressed={vegOnly}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${vegOnly ? "border-(--c-veg) bg-(--c-veg)/10 text-(--c-veg)" : "border-(--c-line) bg-(--c-card) hover:border-(--c-ink)"}`}
            >
              <VegMark veg /> Veg only
            </button>
            <button
              onClick={() => setBestOnly((v) => !v)}
              aria-pressed={bestOnly}
              className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${bestOnly ? "border-(--c-ink) bg-(--c-ink) text-(--c-bg)" : "border-(--c-line) bg-(--c-card) hover:border-(--c-ink)"}`}
            >
              Bestsellers
            </button>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[200px_1fr]">
          <aside className="hidden md:block">
            <ul className="sticky top-[150px] mt-8 space-y-1 border-l border-(--c-line)">
              {menu.map((c) => (
                <li key={c.category}>
                  <button
                    onClick={() => jump(c.category)}
                    className={`-ml-px block w-full border-l-2 py-2 pl-4 text-left text-[15px] transition-colors ${
                      active === c.category ? "border-(--c-accent) font-semibold text-(--c-ink)" : "border-transparent text-(--c-muted) hover:text-(--c-ink)"
                    }`}
                  >
                    {c.category} <span className="tnum text-(--c-muted)">({c.items.length})</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            {menu.length === 0 && (
              <div className="mt-10 rounded-xl border border-dashed border-(--c-line) px-6 py-14 text-center">
                <p className="ck-display text-[26px]">Nothing on this menu matches.</p>
                <button
                  onClick={() => {
                    setQ("");
                    setVegOnly(false);
                    setBestOnly(false);
                  }}
                  className="link-line mt-3 text-[15px] font-semibold text-(--c-accent)"
                >
                  Show the full menu
                </button>
              </div>
            )}
            {menu.map((c) => (
              <section key={c.category} id={`cat-${slug(c.category)}`} data-cat={c.category} className="scroll-mt-40 pt-10" aria-label={c.category}>
                <h2 className="text-[30px]">
                  {c.category} <span className="tnum ck-text text-[17px] font-normal text-(--c-muted)">{c.items.length}</span>
                </h2>
                <div className="mt-2">
                  {c.items.map((i) => (
                    <DishRow key={i.id} item={i} restaurantId={r.id} />
                  ))}
                </div>
              </section>
            ))}
            <p className="mt-10 border-t border-(--c-line) pt-6 text-[14px] text-(--c-muted)">
              Prices are set by {r.name} and include their packaging. GST is added at checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Phone menu button and sheet */}
      <button
        onClick={() => setSheet(true)}
        className="fixed bottom-[148px] right-4 z-30 flex items-center gap-2 rounded-full bg-(--c-ink) px-5 py-3 text-[14px] font-semibold text-(--c-bg) shadow-[0_12px_30px_-10px_rgba(30,26,22,0.6)] md:hidden"
      >
        <Icon name="menu" className="h-4 w-4" /> Menu
      </button>
      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-50 flex items-end bg-black/40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)}>
            <motion.div
              role="dialog"
              aria-label="Menu sections"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="w-full rounded-t-2xl bg-(--c-card) px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-5"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-(--c-line)" />
              <ul>
                {menu.map((c) => (
                  <li key={c.category}>
                    <button onClick={() => jump(c.category)} className="flex w-full justify-between border-b border-(--c-line) py-3.5 text-[16px] font-medium last:border-0">
                      {c.category} <span className="tnum text-(--c-muted)">{c.items.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
