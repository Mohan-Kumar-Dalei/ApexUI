import { MARQUEE } from "../data/site.js";

// A slow band of short facts. Each group carries its own right padding so the
// track loops exactly at half its width. Stops under reduced motion.
export default function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-[var(--k-line)] py-5" aria-hidden="true">
      <div className="marquee-track flex w-max whitespace-nowrap font-display text-[28px] leading-none sm:text-[40px]">
        {row.map((text, i) => (
          <span key={i} className="flex items-center pr-10">
            {text}
            <span className="ml-10 inline-block h-2 w-2 bg-[var(--k-accent)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
