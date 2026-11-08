import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addresses, coupons } from "../data";
import { bill, rupees, useStore } from "../store";
import { Icon, Lines, Photo, Reveal, Stepper, VegMark } from "../components/ui";
import { href } from "../base.js";

const payments = [
  { id: "upi", title: "UPI", note: "Pay with any UPI app when you place the order" },
  { id: "card", title: "Credit or debit card", note: "Saved securely by the payment partner" },
  { id: "cod", title: "Cash on delivery", note: "Keep change ready if you can" },
];
const instructions = ["Leave at the door", "Avoid calling", "Ring the bell", "Call when nearby"];

function Block({ n, title, children, done }) {
  return (
    <section className="rounded-2xl border border-(--c-line) bg-(--c-card) p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className={`tnum grid h-8 w-8 place-items-center rounded-full text-[14px] font-bold ${done ? "bg-(--c-leaf) text-white" : "bg-(--c-surface)"}`}>
          {done ? <Icon name="check" className="h-4 w-4" /> : n}
        </span>
        <h2 className="text-[26px]">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Checkout() {
  const { lines, subtotal, restaurant, add, remove, placeOrder, orders } = useStore();
  const navigate = useNavigate();
  const [addr, setAddr] = useState("home");
  const [newAddr, setNewAddr] = useState({ flat: "", street: "" });
  const [showNew, setShowNew] = useState(false);
  const [pay, setPay] = useState("upi");
  const [notes, setNotes] = useState([]);
  const [kitchenNote, setKitchenNote] = useState("");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [codeMsg, setCodeMsg] = useState("");
  const [placing, setPlacing] = useState(false);

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-28 sm:px-8">
        <Lines as="h1" onMount text="Your cart is empty." className="text-[44px] sm:text-[56px]" />
        <Reveal delay={0.2}>
          <p className="mt-4 text-[17px] text-(--c-muted)">Add a few dishes from any one kitchen and they will show up here.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link to={href("/")} className="rounded-lg bg-(--c-accent) px-6 py-3 text-[15px] font-semibold text-(--c-on-accent) hover:bg-(--c-accent-ink)">
              See kitchens near you
            </Link>
            {orders[0] && (
              <Link to={href(`/order/${orders[0].id}`)} className="link-line text-[15px] font-semibold">
                Track your last order
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    );
  }

  const b = bill(subtotal, restaurant?.distance, applied);
  const newAddrValid = newAddr.flat.trim().length > 2 && newAddr.street.trim().length > 4;
  const addressLine =
    addr === "new" ? `${newAddr.flat.trim()}, ${newAddr.street.trim()}` : addresses.find((a) => a.id === addr)?.line;
  const canPlace = addr !== "new" || newAddrValid;

  const apply = (c) => {
    const coupon = coupons.find((x) => x.code === c.trim().toUpperCase());
    if (!coupon) {
      setApplied(null);
      setCodeMsg("That code does not exist. Check the spelling or pick one below.");
      return;
    }
    if (subtotal < coupon.min) {
      setApplied(null);
      setCodeMsg(`Add ${rupees(coupon.min - subtotal)} more to use ${coupon.code}.`);
      return;
    }
    setApplied(coupon.code);
    setCode(coupon.code);
    setCodeMsg("");
  };

  const submit = () => {
    if (!canPlace || placing) return;
    setPlacing(true);
    setTimeout(() => {
      const id = placeOrder({
        address: addressLine,
        payment: payments.find((p) => p.id === pay).title,
        notes,
        kitchenNote: kitchenNote.trim().slice(0, 140),
        bill: b,
        subtotal,
      });
      navigate(href(`/order/${id}`));
    }, 700);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-32 pt-10 sm:px-8">
      <Lines as="h1" onMount text="Almost there." className="text-[44px] sm:text-[56px]" />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Reveal>
            <Block n={1} title="Where should it go?" done={canPlace}>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${addr === a.id ? "border-(--c-ink) bg-(--c-bg)" : "border-(--c-line) hover:border-(--c-ink)/50"}`}
                  >
                    <input type="radio" name="addr" value={a.id} checked={addr === a.id} onChange={() => setAddr(a.id)} className="mt-1 accent-[var(--c-accent)]" />
                    <span>
                      <span className="block text-[16px] font-bold">{a.label}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-(--c-muted)">{a.line}</span>
                    </span>
                  </label>
                ))}
              </div>
              {!showNew ? (
                <button onClick={() => { setShowNew(true); setAddr("new"); }} className="link-line mt-5 flex items-center gap-1.5 text-[15px] font-semibold text-(--c-accent)">
                  <Icon name="plus" className="h-4 w-4" /> Deliver somewhere else
                </button>
              ) : (
                <div className={`mt-4 rounded-xl border p-4 ${addr === "new" ? "border-(--c-ink) bg-(--c-bg)" : "border-(--c-line)"}`}>
                  <label className="flex items-center gap-3 text-[16px] font-bold">
                    <input type="radio" name="addr" value="new" checked={addr === "new"} onChange={() => setAddr("new")} className="accent-[var(--c-accent)]" />
                    New address
                  </label>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="text-[14px] font-semibold">
                      Flat, house or floor
                      <input
                        value={newAddr.flat}
                        maxLength={80}
                        onFocus={() => setAddr("new")}
                        onChange={(e) => setNewAddr((s) => ({ ...s, flat: e.target.value }))}
                        placeholder="Flat 4B, Sunrise Residency"
                        className="mt-1.5 w-full rounded-lg border border-(--c-line) bg-(--c-card) px-3 py-2.5 text-[15px] font-normal outline-none focus:border-(--c-ink)"
                      />
                    </label>
                    <label className="text-[14px] font-semibold">
                      Street and area
                      <input
                        value={newAddr.street}
                        maxLength={120}
                        onFocus={() => setAddr("new")}
                        onChange={(e) => setNewAddr((s) => ({ ...s, street: e.target.value }))}
                        placeholder="80 Feet Road, Koramangala"
                        className="mt-1.5 w-full rounded-lg border border-(--c-line) bg-(--c-card) px-3 py-2.5 text-[15px] font-normal outline-none focus:border-(--c-ink)"
                      />
                    </label>
                  </div>
                  {addr === "new" && !newAddrValid && <p className="mt-3 text-[14px] text-(--c-nonveg)">Add your flat number and street so the rider can find you.</p>}
                </div>
              )}
              <p className="mt-6 text-[14px] font-semibold">Instructions for the rider</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {instructions.map((t) => {
                  const on = notes.includes(t);
                  return (
                    <button
                      key={t}
                      aria-pressed={on}
                      onClick={() => setNotes((n) => (on ? n.filter((x) => x !== t) : [...n, t]))}
                      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${on ? "border-(--c-ink) bg-(--c-ink) text-(--c-bg)" : "border-(--c-line) hover:border-(--c-ink)"}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </Block>
          </Reveal>

          <Reveal delay={0.08}>
            <Block n={2} title="How will you pay?" done>
              <div className="divide-y divide-(--c-line) rounded-xl border border-(--c-line)">
                {payments.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-4 px-4 py-4">
                    <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} className="accent-[var(--c-accent)]" />
                    <span className="flex-1">
                      <span className="block text-[16px] font-bold">{p.title}</span>
                      <span className="block text-[14px] text-(--c-muted)">{p.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-(--c-muted)">This is a demo. No money moves and no card details are asked for.</p>
            </Block>
          </Reveal>
        </div>

        {/* Order summary */}
        <Reveal delay={0.12} className="lg:sticky lg:top-[96px]">
          <aside className="rounded-2xl border border-(--c-line) bg-(--c-card)" aria-label="Order summary">
            <Link to={href(`/restaurant/${restaurant.id}`)} className="flex items-center gap-3 border-b border-(--c-line) p-5">
              <Photo k={restaurant.img} w={140} alt="" className="h-12 w-12 rounded-lg" />
              <span className="min-w-0">
                <span className="block truncate text-[17px] font-bold">{restaurant.name}</span>
                <span className="block text-[14px] text-(--c-muted)">{restaurant.area}, {restaurant.time} min</span>
              </span>
            </Link>
            <ul className="max-h-[320px] space-y-4 overflow-y-auto p-5">
              {lines.map((l) => (
                <li key={l.id} className="grid grid-cols-[minmax(0,1fr)_88px_60px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_96px_64px] sm:gap-3">
                  <span className="flex min-w-0 items-start gap-2">
                    <VegMark veg={l.veg} className="mt-1" />
                    <span className="text-[15px] font-medium leading-snug">{l.name}</span>
                  </span>
                  <Stepper size="sm" qty={l.qty} label={l.name} onAdd={() => add(restaurant.id, l)} onRemove={() => remove(l.id)} />
                  <span className="tnum text-right text-[15px]">{rupees(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-(--c-line) p-5">
              <label htmlFor="kn" className="text-[14px] font-semibold">A note for the kitchen</label>
              <textarea
                id="kn"
                rows={2}
                maxLength={140}
                value={kitchenNote}
                onChange={(e) => setKitchenNote(e.target.value)}
                placeholder="Less spicy, no onion, extra chutney"
                className="mt-2 w-full resize-none rounded-lg border border-(--c-line) bg-(--c-bg) px-3 py-2.5 text-[15px] outline-none focus:border-(--c-ink)"
              />
            </div>
            <div className="border-t border-(--c-line) p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  apply(code);
                }}
                className="flex gap-2"
              >
                <label htmlFor="code" className="sr-only">Coupon code</label>
                <input
                  id="code"
                  value={code}
                  maxLength={16}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="tnum min-w-0 flex-1 rounded-lg border border-(--c-line) bg-(--c-bg) px-3 py-2.5 text-[15px] font-semibold tracking-[0.06em] outline-none focus:border-(--c-ink)"
                />
                {applied ? (
                  <button type="button" onClick={() => { setApplied(null); setCode(""); }} className="rounded-lg border border-(--c-line) px-4 text-[14px] font-semibold hover:border-(--c-ink)">
                    Remove
                  </button>
                ) : (
                  <button className="rounded-lg bg-(--c-ink) px-4 text-[14px] font-semibold text-(--c-bg)">Apply</button>
                )}
              </form>
              {codeMsg && <p className="mt-2 text-[14px] text-(--c-nonveg)" role="alert">{codeMsg}</p>}
              {applied && <p className="mt-2 text-[14px] font-semibold text-(--c-leaf)">{applied} applied. {b.coupon.type === "delivery" ? "Delivery is on us." : `You save ${rupees(b.discount)}.`}</p>}
              {!applied && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {coupons.map((c) => (
                    <button key={c.code} onClick={() => apply(c.code)} className={`tnum rounded-md border border-dashed px-2 py-1 text-[12px] font-bold tracking-[0.06em] ${subtotal >= c.min ? "border-(--c-accent) text-(--c-accent)" : "border-(--c-line) text-(--c-muted)"}`}>
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <dl className="tnum space-y-2.5 border-t border-(--c-line) p-5 text-[15px]">
              <div className="flex justify-between"><dt className="text-(--c-muted)">Item total</dt><dd>{rupees(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-(--c-muted)">Delivery, {restaurant.distance} km</dt><dd>{b.delivery ? rupees(b.delivery) : "Free"}</dd></div>
              {b.discount > 0 && <div className="flex justify-between text-(--c-leaf)"><dt>Coupon {applied}</dt><dd>-{rupees(b.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-(--c-muted)">Platform fee</dt><dd>{rupees(b.platform)}</dd></div>
              <div className="flex justify-between"><dt className="text-(--c-muted)">GST, 5%</dt><dd>{rupees(b.gst)}</dd></div>
              <div className="flex justify-between border-t border-(--c-line) pt-3 text-[18px] font-bold"><dt>To pay</dt><dd>{rupees(b.total)}</dd></div>
            </dl>
            <div className="p-5 pt-0">
              <button
                onClick={submit}
                disabled={!canPlace || placing}
                className="w-full rounded-xl bg-(--c-accent) py-4 text-[16px] font-bold text-(--c-on-accent) transition-colors duration-300 hover:bg-(--c-accent-ink) disabled:bg-(--c-muted)"
              >
                {placing ? "Placing your order" : `Place order, ${rupees(b.total)}`}
              </button>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
