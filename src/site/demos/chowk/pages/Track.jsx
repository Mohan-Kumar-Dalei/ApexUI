import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { findRestaurant } from "../data";
import { rupees, useStore } from "../store";
import { EASE, Icon, Lines, Reveal, VegMark } from "../components/ui";
import { href } from "../base.js";

// Demo timing: each stage lasts a few seconds so the whole order plays out in about half a minute.
const STAGES = [
  { key: "placed", label: "Order placed", note: (r) => `${r.name} has received it` },
  { key: "cooking", label: "Being cooked", note: () => "The kitchen started on your order" },
  { key: "picked", label: "Picked up", note: () => "Ravi K. is on his way with it" },
  { key: "near", label: "Almost there", note: () => "Ravi is a couple of streets away" },
  { key: "done", label: "Delivered", note: () => "Enjoy your food" },
];
const STAGE_MS = 7000;

const ROUTE = "M60 260 L60 200 Q60 180 80 180 L220 180 Q240 180 240 160 L240 90 Q240 70 260 70 L420 70 Q440 70 440 90 L440 120";

function MapCard({ progress }) {
  const pathRef = useRef(null);
  const [pt, setPt] = useState({ x: 60, y: 260 });
  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const at = p.getPointAtLength(len * progress);
    setPt({ x: at.x, y: at.y });
  }, [progress]);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--c-line) bg-(--c-surface)">
      <svg viewBox="0 0 500 300" className="block h-auto w-full" role="img" aria-label="Map showing the rider moving from the kitchen to your home">
        {/* city blocks */}
        {[
          [20, 20, 180, 130], [270, 100, 150, 60], [100, 210, 120, 70], [280, 190, 200, 90], [470, 20, 60, 120], [20, 210, 20, 70],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="var(--c-card)" />
        ))}
        <rect x="290" y="200" width="70" height="50" rx="8" fill="#d9e6d2" />
        {/* streets */}
        <path d="M0 180 H500 M240 0 V300 M0 70 H500 M60 0 V300 M440 0 V300" stroke="var(--c-bg)" strokeWidth="18" fill="none" />
        {/* route */}
        <path ref={pathRef} d={ROUTE} stroke="var(--c-line)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <motion.path d={ROUTE} stroke="var(--c-accent)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: Math.max(progress, 0.001) }} transition={{ duration: 1.2, ease: EASE }} />
        {/* kitchen */}
        <g transform="translate(60 260)">
          <circle r="13" fill="var(--c-ink)" />
          <path d="M-5 -4 v8 M0 -4 v8 M5 -4 v8 M-6 -4 h12" stroke="var(--c-bg)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        {/* home */}
        <g transform="translate(440 120)">
          <circle r="14" fill="var(--c-accent)" />
          <path d="M-6 1 L0 -5 L6 1 V6 H-6 Z" fill="var(--c-on-accent)" />
        </g>
        {/* rider */}
        <g style={{ transform: `translate(${pt.x}px, ${pt.y}px)`, transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <circle r="16" fill="var(--c-card)" stroke="var(--c-accent)" strokeWidth="2" />
          <g transform="translate(-9 -9) scale(0.75)" stroke="var(--c-accent)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17h5l3-7h3m-6 7-2-5H6m9-5h2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Track() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);
  const reduce = useReducedMotion();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-28 sm:px-8">
        <h1 className="text-[44px]">We could not find that order.</h1>
        <p className="mt-4 text-[17px] text-(--c-muted)">Orders are kept on this device. If you placed it on another phone, open it there.</p>
        <Link to={href("/")} className="mt-8 inline-block rounded-lg bg-(--c-accent) px-6 py-3 text-[15px] font-semibold text-(--c-on-accent)">Back to kitchens</Link>
      </div>
    );
  }

  const r = findRestaurant(order.restaurantId);
  const elapsed = now - order.placedAt;
  const stage = Math.min(STAGES.length - 1, Math.floor(elapsed / STAGE_MS));
  const routeProgress = stage < 2 ? 0 : stage >= 4 ? 1 : Math.min(1, (elapsed - 2 * STAGE_MS) / (2 * STAGE_MS));
  const minsLeft = Math.max(0, Math.round(r.time * (1 - elapsed / (STAGE_MS * 4))));
  const delivered = stage === STAGES.length - 1;

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-32 pt-10 sm:px-8">
      <p className="tnum text-[15px] text-(--c-muted)">Order #{order.id}, from {r.name}</p>
      <Lines as="h1" onMount key={stage} text={delivered ? "Delivered. Enjoy it hot." : STAGES[stage].label + "."} className="mt-3 text-[44px] sm:text-[64px]" />
      <p className="tnum mt-3 text-[18px] text-(--c-muted)" aria-live="polite">
        {delivered ? `Reached ${order.address.split(",")[0]} at ${new Date(order.placedAt + STAGE_MS * 4).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : `Arriving in about ${minsLeft} min`}
      </p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Reveal>
            <MapCard progress={reduce ? (stage >= 4 ? 1 : stage >= 2 ? 0.5 : 0) : routeProgress} />
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="rounded-2xl border border-(--c-line) bg-(--c-card) p-6">
              {STAGES.map((s, i) => {
                const done = i < stage || delivered;
                const current = i === stage && !delivered;
                return (
                  <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < STAGES.length - 1 && <span className={`absolute left-[13px] top-8 h-[calc(100%-28px)] w-px ${i < stage ? "bg-(--c-leaf)" : "bg-(--c-line)"}`} aria-hidden="true" />}
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                        done ? "border-(--c-leaf) bg-(--c-leaf) text-white" : current ? "border-(--c-accent) bg-(--c-accent)/10 text-(--c-accent)" : "border-(--c-line) text-(--c-muted)"
                      }`}
                    >
                      {done ? <Icon name="check" className="h-4 w-4" /> : <span className={`h-2 w-2 rounded-full ${current ? "animate-pulse bg-(--c-accent)" : "bg-(--c-line)"}`} />}
                    </span>
                    <div>
                      <p className={`text-[16px] font-bold ${i > stage ? "text-(--c-muted)" : ""}`}>{s.label}</p>
                      {i <= stage && <p className="text-[14px] text-(--c-muted)">{s.note(r)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="space-y-6 lg:sticky lg:top-[96px]">
          {stage >= 2 && !delivered && (
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-(--c-ink) p-5 text-(--c-bg)">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-(--c-bg)/10 ck-display text-[18px]">RK</span>
                <div>
                  <p className="text-[16px] font-bold">Ravi K.</p>
                  <p className="text-[14px] text-(--c-bg)/60">Your rider, 4.9 rating, 2,140 deliveries</p>
                </div>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-(--c-bg)/20" title="Calling works in the app">
                <Icon name="phone" className="h-4 w-4" />
              </span>
            </div>
          )}
          <aside className="rounded-2xl border border-(--c-line) bg-(--c-card) p-5" aria-label="Order details">
            <h2 className="text-[24px]">Your order</h2>
            <ul className="mt-4 space-y-3">
              {order.lines.map((l) => (
                <li key={l.id} className="tnum flex items-start justify-between gap-3 text-[15px]">
                  <span className="flex items-start gap-2">
                    <VegMark veg={l.veg} className="mt-1" />
                    {l.name} x {l.qty}
                  </span>
                  <span>{rupees(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="tnum mt-4 space-y-2 border-t border-(--c-line) pt-4 text-[15px]">
              <div className="flex justify-between font-bold"><dt>Paid</dt><dd>{rupees(order.bill.total)}</dd></div>
              <div className="flex justify-between text-(--c-muted)"><dt>Payment</dt><dd>{order.payment}</dd></div>
            </dl>
            <div className="mt-4 border-t border-(--c-line) pt-4 text-[14px] leading-relaxed text-(--c-muted)">
              <p className="font-semibold text-(--c-ink)">Delivering to</p>
              <p>{order.address}</p>
              {order.notes?.length > 0 && <p className="mt-2">Rider note: {order.notes.join(", ")}</p>}
              {order.kitchenNote && <p className="mt-1">Kitchen note: {order.kitchenNote}</p>}
            </div>
          </aside>
          {delivered && (
            <Link to={href(`/restaurant/${r.id}`)} className="block rounded-xl bg-(--c-accent) py-4 text-center text-[16px] font-bold text-(--c-on-accent) hover:bg-(--c-accent-ink)">
              Order from {r.name} again
            </Link>
          )}
        </Reveal>
      </div>
    </div>
  );
}
