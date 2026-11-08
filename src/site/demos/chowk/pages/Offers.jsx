import { useState } from "react";
import { Link } from "react-router-dom";
import { coupons, restaurants } from "../data";
import { rupees } from "../store";
import { Icon, Lines, Photo, Reveal } from "../components/ui";
import { href } from "../base.js";

export default function Offers() {
  const [copied, setCopied] = useState(null);
  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard can be blocked; the code is still visible */
    }
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-32 pt-10 sm:px-8">
      <Lines as="h1" onMount text="Offers near you" className="text-[44px] sm:text-[64px]" />
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-lg text-[17px] text-(--c-muted)">Copy a code and paste it at checkout. Kitchen deals below apply on their own.</p>
      </Reveal>

      <h2 className="mt-14 ck-text text-[13px] font-semibold uppercase tracking-[0.14em] text-(--c-muted)">Chowk codes</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {coupons.map((c, i) => (
          <Reveal key={c.code} delay={i * 0.05}>
            <div className="coupon flex items-center justify-between gap-4 rounded-xl border border-(--c-line) bg-(--c-card) px-6 py-5">
              <div>
                <p className="ck-display text-[26px] leading-tight">{c.title}</p>
                <p className="mt-1 text-[15px] text-(--c-muted)">
                  {c.note}. Minimum order {rupees(c.min)}.
                </p>
              </div>
              <button
                onClick={() => copy(c.code)}
                className="tnum flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-(--c-accent) px-3 py-2 text-[14px] font-bold tracking-[0.08em] text-(--c-accent) hover:bg-(--c-accent) hover:text-(--c-on-accent)"
                aria-label={`Copy code ${c.code}`}
              >
                {copied === c.code ? "Copied" : c.code}
                <Icon name={copied === c.code ? "check" : "copy"} className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      <h2 className="mt-16 ck-text text-[13px] font-semibold uppercase tracking-[0.14em] text-(--c-muted)">Kitchen deals</h2>
      <ul className="mt-5 border-t border-(--c-line)">
        {restaurants.map((r, i) => (
          <Reveal as="li" key={r.id} delay={(i % 6) * 0.04} className="border-b border-(--c-line)">
            <Link to={href(`/restaurant/${r.id}`)} className="group flex items-center gap-4 py-4">
              <Photo k={r.img} w={160} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-bold">{r.name}</p>
                <p className="truncate text-[14px] text-(--c-muted)">{r.cuisines.slice(0, 2).join(", ")}, {r.time} min</p>
              </div>
              <span className="hidden text-right text-[15px] font-semibold text-(--c-accent) sm:block">{r.offer}</span>
              <Icon name="chevron" className="h-4 w-4 shrink-0 text-(--c-muted) transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <p className="-mt-2 pb-4 pl-[72px] text-[14px] font-semibold text-(--c-accent) sm:hidden">{r.offer}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
