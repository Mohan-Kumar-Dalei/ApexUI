import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { allDishes, cuisinesRow, findRestaurant, restaurants } from "../data";
import { qtyOf, rupees, useStore } from "../store";
import RestaurantCard from "../components/RestaurantCard";
import { Icon, Photo, Reveal, Stepper, VegMark } from "../components/ui";
import { href } from "../base.js";

function DishCard({ d }) {
  const { cart, add, remove } = useStore();
  const r = findRestaurant(d.restaurantId);
  return (
    <article className="flex flex-col rounded-xl border border-(--c-line) bg-(--c-card) p-4">
      <Link to={href(`/restaurant/${r.id}`)} className="flex items-center justify-between gap-3 border-b border-(--c-line) pb-3 text-[14px]">
        <span className="min-w-0">
          <span className="block truncate font-semibold">{r.name}</span>
          <span className="tnum text-(--c-muted)">{r.rating.toFixed(1)} rating, {r.time} min</span>
        </span>
        <Icon name="chevron" className="h-4 w-4 shrink-0 text-(--c-muted)" />
      </Link>
      <div className="mt-4 grid flex-1 grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          <VegMark veg={d.veg} />
          <h3 className="mt-1.5 ck-text text-[17px] font-bold leading-snug">{d.name}</h3>
          <p className="tnum mt-1 text-[15px] font-semibold">{rupees(d.price)}</p>
          <p className="mt-1.5 line-clamp-2 text-[14px] text-(--c-muted)">{d.desc}</p>
        </div>
        <div className="relative w-[104px]">
          {d.img && <Photo k={d.img} w={240} alt={d.name} className="aspect-square w-full rounded-lg" />}
          <div className={d.img ? "absolute -bottom-3 left-1/2 w-[96px] -translate-x-1/2" : "pt-6"}>
            <Stepper size="sm" qty={qtyOf(cart, d.id)} label={d.name} onAdd={() => add(r.id, d)} onRemove={() => remove(d.id)} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [tab, setTab] = useState("dishes");
  const needle = q.trim().toLowerCase();

  const { rs, ds } = useMemo(() => {
    if (!needle) return { rs: [], ds: [] };
    const rs = restaurants.filter(
      (r) => r.name.toLowerCase().includes(needle) || r.cuisines.some((c) => c.toLowerCase().includes(needle)) || r.tags.some((t) => t.toLowerCase().includes(needle))
    );
    const ds = allDishes.filter((d) => d.name.toLowerCase().includes(needle) || d.desc.toLowerCase().includes(needle) || rs.some((r) => r.id === d.restaurantId && r.tags.some((t) => t.toLowerCase() === needle)));
    return { rs, ds };
  }, [needle]);

  const setQ = (v) => setParams(v ? { q: v } : {}, { replace: true });
  const showTab = tab === "dishes" && ds.length === 0 && rs.length ? "restaurants" : tab === "restaurants" && rs.length === 0 && ds.length ? "dishes" : tab;

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-32 pt-8 sm:px-8">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 rounded-xl border border-(--c-line) bg-(--c-card) px-4 focus-within:border-(--c-ink)">
        <Icon name="search" className="h-5 w-5 text-(--c-muted)" />
        <label htmlFor="q" className="sr-only">Search for restaurants and food</label>
        <input
          id="q"
          autoFocus
          value={q}
          maxLength={60}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for restaurants and food"
          className="w-full bg-transparent py-4 text-[17px] outline-none"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid h-8 w-8 place-items-center rounded-full hover:bg-(--c-surface)">
            <Icon name="close" className="h-4 w-4" />
          </button>
        )}
      </form>

      {!needle && (
        <Reveal className="mt-12">
          <h1 className="text-[36px] sm:text-[44px]">Popular cuisines</h1>
          <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
            {cuisinesRow.map((c) => (
              <button key={c.name} onClick={() => setQ(c.name)} className="group flex flex-col items-center gap-3">
                <span className="block aspect-square w-full max-w-[110px] overflow-hidden rounded-full bg-(--c-surface)">
                  <Photo k={c.img} w={240} alt="" className="h-full w-full transition-transform duration-[1200ms] group-hover:scale-[1.08]" />
                </span>
                <span className="text-[15px] font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {needle && (
        <>
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Result type">
            {[
              ["dishes", `Dishes (${ds.length})`],
              ["restaurants", `Restaurants (${rs.length})`],
            ].map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={showTab === k}
                onClick={() => setTab(k)}
                className={`tnum rounded-full border px-5 py-2 text-[14px] font-semibold transition-colors ${showTab === k ? "border-(--c-ink) bg-(--c-ink) text-(--c-bg)" : "border-(--c-line) bg-(--c-card) hover:border-(--c-ink)"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {ds.length === 0 && rs.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-(--c-line) px-6 py-14 text-center">
              <p className="ck-display text-[26px]">Nothing called "{q}" near you yet.</p>
              <p className="mt-2 text-[15px] text-(--c-muted)">Try a dish like biryani or paneer, or a cuisine like Chinese.</p>
            </div>
          ) : showTab === "dishes" ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ds.map((d, i) => (
                <Reveal key={d.id} delay={(i % 3) * 0.05}>
                  <DishCard d={d} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rs.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.05}>
                  <RestaurantCard r={r} />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
