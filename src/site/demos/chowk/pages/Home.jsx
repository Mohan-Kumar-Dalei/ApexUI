import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { coupons, cuisinesRow, restaurants } from "../data";
import { useStore } from "../store";
import RestaurantCard from "../components/RestaurantCard";
import { EASE, Icon, Lines, Photo, Reveal } from "../components/ui";
import { href } from "../base.js";

const Wrap = ({ className = "", children }) => <div className={`mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12 ${className}`}>{children}</div>;

/* ---------- Hero ---------- */

const trackSteps = [
  { label: "Order confirmed", note: "Meghna's has your order" },
  { label: "Being packed", note: "Biryani is on dum, 4 min to go" },
  { label: "Picked up", note: "Ravi is leaving the kitchen" },
  { label: "Almost there", note: "Ravi is 600 m away, on 12th Main" },
];

function LiveOrderCard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % trackSteps.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);
  const pct = (step / (trackSteps.length - 1)) * 100;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.9 }}
      className="w-[min(340px,calc(100vw-56px))] rounded-2xl border border-(--c-line) bg-(--c-card) p-5 shadow-[0_24px_50px_-24px_rgba(30,26,22,0.45)]"
      aria-label="Example of a live order"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-(--c-leaf)">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--c-leaf) opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-(--c-leaf)" />
          </span>
          Live order
        </span>
        <span className="tnum text-[13px] text-(--c-muted)">#48213</span>
      </div>
      <p className="mt-3 ck-display text-[22px] leading-tight">{trackSteps[step].label}</p>
      <p className="mt-1 h-[22px] text-[15px] text-(--c-muted)">{trackSteps[step].note}</p>

      <div className="relative mt-5 h-[3px] rounded-full bg-(--c-surface)">
        <div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-(--c-accent) transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `scaleX(${pct / 100})` }} />
        <div
          className="absolute -top-[13px] grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-(--c-line) bg-(--c-card) text-(--c-accent) transition-[left] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: `${pct}%` }}
        >
          <Icon name="bike" className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-(--c-line) pt-4">
        <div className="flex items-center gap-3">
          <Photo k="biryani" w={120} alt="" className="h-10 w-10 rounded-lg" />
          <div>
            <p className="text-[14px] font-semibold leading-tight">Chicken dum biryani x2</p>
            <p className="text-[13px] text-(--c-muted)">Meghna's Biryani House</p>
          </div>
        </div>
        <span className="tnum text-[14px] font-semibold">{[26, 19, 11, 4][step]} min</span>
      </div>
    </motion.div>
  );
}

function Hero({ ready }) {
  const { area } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();
  const submit = (e) => {
    e.preventDefault();
    navigate(href(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"));
  };
  const place = area.split(",")[0];

  return (
    <section className="pb-16 pt-8 md:pb-24 md:pt-14">
      <Wrap className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex items-center gap-2 text-[15px] font-medium text-(--c-muted)"
          >
            <span className="h-2 w-2 rounded-full bg-(--c-leaf)" /> {restaurants.length} kitchens open near {place} right now
          </motion.p>
          <Lines
            as="h1"
            onMount={ready}
            hold={!ready}
            delay={0.1}
            text="Dinner from the kitchens down your road."
            className="mt-5 max-w-[12ch] text-[48px] sm:text-[64px] lg:text-[84px]"
          />
          <Reveal delay={0.5}>
            <p className="mt-6 max-w-[34rem] text-[18px] leading-relaxed text-(--c-muted)">
              Dum biryani from the old city, dosa from the corner Udupi, momos from the hill cafe. Order in a minute and watch it come to you.
            </p>
          </Reveal>
          <Reveal delay={0.65}>
            <form onSubmit={submit} role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-(--c-line) bg-(--c-card) p-2 focus-within:border-(--c-ink)">
              <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-(--c-muted)" />
              <label htmlFor="hero-search" className="sr-only">Search for a dish or restaurant</label>
              <input
                id="hero-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={60}
                placeholder="Biryani, dosa, momos"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[16px] outline-none placeholder:text-(--c-muted)/80"
              />
              <button className="shrink-0 rounded-lg bg-(--c-accent) px-5 py-3 text-[15px] font-semibold text-(--c-on-accent) transition-colors duration-300 hover:bg-(--c-accent-ink)">
                Find food
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
              <span className="text-(--c-muted)">People near you are ordering</span>
              {["Biryani", "Masala dosa", "Momos", "Butter chicken"].map((t) => (
                <Link key={t} to={href(`/search?q=${encodeURIComponent(t)}`)} className="rounded-full border border-(--c-line) px-3 py-1 font-medium hover:border-(--c-ink)">
                  {t}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            className="aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]"
          >
            <motion.div
              initial={reduce ? false : { scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
              className="h-full w-full"
            >
              <Photo k="biryani" w={1000} alt="Chicken dum biryani with salan and raita" className="h-full w-full" />
            </motion.div>
          </motion.div>
          <div className="absolute -bottom-10 left-3 sm:left-auto sm:right-6 lg:-left-16 lg:right-auto">
            <LiveOrderCard />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- Cuisines row ---------- */

function Cravings() {
  const row = useRef(null);
  const scroll = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.7, behavior: "smooth" });
  return (
    <section className="border-t border-(--c-line) pt-24 md:pt-28" aria-labelledby="crave">
      <Wrap>
        <div className="flex items-end justify-between gap-6">
          <Lines as="h2" text="What are you craving?" className="text-[36px] sm:text-[44px]" />
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Scroll back" className="grid h-10 w-10 place-items-center rounded-full border border-(--c-line) hover:border-(--c-ink)">
              <Icon name="chevron" className="h-4 w-4 rotate-180" />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll forward" className="grid h-10 w-10 place-items-center rounded-full border border-(--c-line) hover:border-(--c-ink)">
              <Icon name="chevron" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Wrap>
      <div ref={row} className="no-scrollbar mt-10 overflow-x-auto scroll-smooth">
        <ul className="flex w-max gap-5 px-4 sm:gap-8 sm:px-8 lg:px-12 xl:pl-[calc((100vw-1320px)/2+3rem)]">
          {cuisinesRow.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.04}>
              <Link to={href(`/search?q=${encodeURIComponent(c.name)}`)} className="group flex w-[92px] flex-col items-center gap-3 sm:w-[120px]">
                <span className="block h-[92px] w-[92px] overflow-hidden rounded-full bg-(--c-surface) sm:h-[120px] sm:w-[120px]">
                  <Photo k={c.img} w={260} alt="" className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]" />
                </span>
                <span className="text-center text-[15px] font-semibold">{c.name}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Offers ---------- */

function OfferStrip() {
  return (
    <section className="pt-24 md:pt-28" aria-labelledby="offers-h">
      <Wrap>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Lines as="h2" text="Codes that work today" className="text-[36px] sm:text-[44px]" />
            <Reveal>
              <p className="mt-3 text-[17px] text-(--c-muted)">Apply any of them at checkout. One code per order.</p>
            </Reveal>
          </div>
          <Link to={href("/offers")} className="link-line hidden shrink-0 text-[15px] font-semibold text-(--c-accent) sm:block">
            See all offers
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coupons.map((c, i) => (
            <Reveal key={c.code} delay={i * 0.06}>
              <div className={`coupon flex h-full flex-col justify-between rounded-xl border border-(--c-line) p-5 ${i === 0 ? "bg-(--c-accent) text-(--c-on-accent)" : "bg-(--c-card)"}`}>
                <p className="ck-display text-[26px] leading-tight">{c.title}</p>
                <div className={`mt-6 flex items-center justify-between border-t border-dashed pt-4 ${i === 0 ? "border-(--c-on-accent)/40" : "border-(--c-line)"}`}>
                  <span className={`text-[14px] ${i === 0 ? "text-(--c-on-accent)/80" : "text-(--c-muted)"}`}>{c.note}</span>
                  <span className="tnum ml-3 rounded-md border border-current px-2 py-0.5 text-[13px] font-bold tracking-[0.08em]">{c.code}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- Top picks ---------- */

function TopPicks() {
  const picks = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
  return (
    <section className="pt-24 md:pt-28" aria-labelledby="picks">
      <Wrap>
        <Lines as="h2" text="The ones regulars swear by" className="max-w-[24ch] text-[36px] sm:text-[44px]" />
        <Reveal>
          <p className="mt-3 text-[17px] text-(--c-muted)">Rated 4.4 and above by people who order here every week.</p>
        </Reveal>
      </Wrap>
      <div className="no-scrollbar mt-10 overflow-x-auto">
        <div className="flex w-max snap-x snap-mandatory gap-5 px-4 sm:px-8 lg:px-12 xl:pl-[calc((100vw-1320px)/2+3rem)]">
          {picks.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05} className="w-[260px] shrink-0 snap-start sm:w-[290px]">
              <RestaurantCard r={r} size="lg" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- All restaurants with filters ---------- */

const filters = [
  { id: "fast", label: "Under 25 min", test: (r) => r.time < 25 },
  { id: "top", label: "Rated 4.4+", test: (r) => r.rating >= 4.4 },
  { id: "veg", label: "Pure veg", test: (r) => r.veg },
  { id: "cheap", label: "Under ₹400 for two", test: (r) => r.costForTwo < 400 },
  { id: "near", label: "Within 2 km", test: (r) => r.distance <= 2 },
];
const sorts = {
  relevance: { label: "Relevance", fn: () => 0 },
  time: { label: "Delivery time", fn: (a, b) => a.time - b.time },
  rating: { label: "Rating", fn: (a, b) => b.rating - a.rating },
  cost: { label: "Cost, low to high", fn: (a, b) => a.costForTwo - b.costForTwo },
};

function SkeletonCard() {
  return (
    <div aria-hidden="true">
      <div className="ck-bone aspect-[4/3] rounded-xl" />
      <div className="ck-bone mt-4 h-5 w-3/4 rounded-md" />
      <div className="ck-bone mt-2.5 h-4 w-1/2 rounded-md" />
      <div className="ck-bone mt-2.5 h-4 w-2/3 rounded-md" />
    </div>
  );
}

function AllRestaurants({ ready }) {
  const { area } = useStore();
  const [active, setActive] = useState([]);
  const [sort, setSort] = useState("relevance");
  // Kitchens "load" for the chosen area: skeleton cards first, again whenever the area changes.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!ready) return undefined;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [area, ready]);
  const list = useMemo(() => {
    const fs = filters.filter((f) => active.includes(f.id));
    return restaurants.filter((r) => fs.every((f) => f.test(r))).sort(sorts[sort].fn);
  }, [active, sort]);
  const toggle = (id) => setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <section className="py-24 md:py-28" aria-labelledby="all">
      <Wrap>
        <Lines as="h2" text={`Everything that delivers to ${area.split(",")[0]}`} className="max-w-[20ch] text-[36px] sm:text-[44px]" />
        <div className="sticky top-[72px] z-20 -mx-4 mt-8 border-b border-(--c-line) bg-(--c-bg)/95 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <label className="relative shrink-0">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-(--c-line) bg-(--c-card) py-2 pl-4 pr-9 text-[14px] font-semibold hover:border-(--c-ink)"
              >
                {Object.entries(sorts).map(([k, s]) => (
                  <option key={k} value={k}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </label>
            {filters.map((f) => {
              const on = active.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors duration-300 ${
                    on ? "border-(--c-ink) bg-(--c-ink) text-(--c-bg)" : "border-(--c-line) bg-(--c-card) hover:border-(--c-ink)"
                  }`}
                >
                  {f.label}
                  {on && <Icon name="close" className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
        <p className="tnum mt-6 text-[15px] text-(--c-muted)" aria-live="polite">
          {loading ? `Checking which kitchens are open near ${area.split(",")[0]}` : `${list.length} ${list.length === 1 ? "kitchen" : "kitchens"}`}
        </p>
        {loading ? (
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : list.length ? (
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.05}>
                <RestaurantCard r={r} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-(--c-line) px-6 py-14 text-center">
            <p className="ck-display text-[26px]">No kitchen matches all of those.</p>
            <button onClick={() => setActive([])} className="link-line mt-3 text-[15px] font-semibold text-(--c-accent)">
              Clear filters
            </button>
          </div>
        )}
      </Wrap>
    </section>
  );
}

/* ---------- Dark band: how an order moves ---------- */

const moves = [
  { t: "8:02 pm", title: "You order", body: "Pick dishes from one kitchen, pay by UPI, card or cash." },
  { t: "8:03 pm", title: "The kitchen confirms", body: "They start cooking the moment they accept. You see it happen." },
  { t: "8:21 pm", title: "A rider picks it up", body: "You get their name and a number to call, masked for both of you." },
  { t: "8:33 pm", title: "It reaches your door", body: "Hot, sealed, and with the extra chutney you asked for." },
];

function HowItMoves() {
  return (
    <section className="bg-(--c-ink) py-24 text-(--c-bg) md:py-32" aria-labelledby="moves">
      <Wrap className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Lines as="h2" text="31 minutes, kitchen to door." className="max-w-[14ch] text-[40px] sm:text-[56px]" />
          <Reveal>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-(--c-bg)/65">
              A real Tuesday order from Meghna's to Indiranagar. Most orders within 3 km land in under 35 minutes.
            </p>
          </Reveal>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {moves.map((m, i) => (
            <Reveal as="li" key={m.t} delay={i * 0.08} className="grid grid-cols-[88px_1fr] gap-4 border-t border-white/12 py-7 sm:grid-cols-[120px_1fr]">
              <span className="tnum pt-1 text-[15px] text-(--c-bg)/50">{m.t}</span>
              <div>
                <h3 className="text-[26px] sm:text-[30px]">{m.title}</h3>
                <p className="mt-2 text-[16px] text-(--c-bg)/65">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ---------- Closing CTA ---------- */

function Closing() {
  return (
    <section className="py-24 md:py-32">
      <Wrap className="grid items-center gap-12 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Lines as="h2" text="Hungry already? Start with a dosa." className="max-w-[14ch] text-[40px] sm:text-[56px]" />
          <Reveal>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-(--c-muted)">
              Udupi Ananda Bhavan is 1.1 km away and their masala dosa costs ₹129. It will be with you before the coffee cools.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link to={href("/restaurant/udupi-ananda-bhavan")} className="rounded-lg bg-(--c-accent) px-7 py-3.5 text-[15px] font-semibold text-(--c-on-accent) transition-transform duration-300 hover:-translate-y-0.5 hover:bg-(--c-accent-ink)">
                Order from Udupi Ananda Bhavan
              </Link>
              <Link to={href("/search")} className="link-line text-[15px] font-semibold">
                Browse every dish
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="order-1 grid grid-cols-5 gap-4 lg:order-2 lg:col-span-6">
          <Reveal className="col-span-3 aspect-[4/5] overflow-hidden rounded-2xl">
            <Photo k="dosa" w={700} alt="Masala dosa with chutneys and sambar" className="h-full w-full" />
          </Reveal>
          <div className="col-span-2 flex flex-col gap-4 pt-12">
            <Reveal delay={0.1} className="aspect-square overflow-hidden rounded-2xl">
              <Photo k="idliVada" w={400} alt="Idli and vada with sambar" className="h-full w-full" />
            </Reveal>
            <Reveal delay={0.2} className="aspect-square overflow-hidden rounded-2xl">
              <Photo k="bananaLeaf" w={400} alt="Meals served on a banana leaf" className="h-full w-full" />
            </Reveal>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export default function Home({ ready = true }) {
  return (
    <>
      <Hero ready={ready} />
      <Cravings />
      <OfferStrip />
      <TopPicks />
      <AllRestaurants ready={ready} />
      <HowItMoves />
      <Closing />
    </>
  );
}
