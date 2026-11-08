/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { photo } from "../data";

export const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ delay = 0, y = 24, className = "", children, as = "div" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

export function Lines({ text, as: Tag = "h2", className = "", delay = 0, onMount = false, hold = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={!hold && (onMount || inView) ? { y: "0%" } : undefined}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Photo with a calm fallback block when an image fails or is missing. */
export function Photo({ k, w = 600, alt = "", className = "", label }) {
  const [failed, setFailed] = useState(false);
  const src = photo(k, w);
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-(--c-surface) text-(--c-muted) ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <span className="ck-display text-2xl">{(label || alt || "Chowk").slice(0, 1)}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export function VegMark({ veg, className = "" }) {
  const c = veg ? "var(--c-veg)" : "var(--c-nonveg)";
  return (
    <span
      className={`inline-grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[3px] border-[1.5px] ${className}`}
      style={{ borderColor: c }}
      title={veg ? "Vegetarian" : "Non vegetarian"}
      aria-label={veg ? "Vegetarian" : "Non vegetarian"}
      role="img"
    >
      {veg ? (
        <span className="h-[7px] w-[7px] rounded-full" style={{ background: c }} />
      ) : (
        <span className="h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent" style={{ borderBottomColor: c }} />
      )}
    </span>
  );
}

export function Rating({ value, className = "" }) {
  return (
    <span className={`tnum inline-flex items-center gap-1 rounded-full bg-(--c-leaf) px-2 py-0.5 text-[13px] font-semibold text-white ${className}`}>
      <Icon name="star" className="h-3 w-3" fill />
      {value.toFixed(1)}
    </span>
  );
}

const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  bag: <><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  tag: <><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1.3" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bike: <><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17h5l3-7h3m-6 7-2-5H6m9-5h2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
  menu: <><path d="M5 7h14M5 12h14M5 17h9" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
};

export function Icon({ name, className = "h-5 w-5", fill = false }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Stepper({ qty, onAdd, onRemove, size = "md", label }) {
  const h = size === "sm" ? "h-8" : "h-10";
  const minW = size === "sm" ? "min-w-[84px]" : "min-w-[96px]";
  if (!qty) {
    return (
      <button
        onClick={onAdd}
        aria-label={label ? `Add ${label}` : "Add"}
        className={`${h} w-full ${minW} rounded-lg border border-(--c-line) bg-(--c-card) px-5 text-[15px] font-bold tracking-wide text-(--c-accent) shadow-[0_2px_0_rgba(30,26,22,0.06)] transition-colors duration-300 hover:bg-(--c-accent) hover:text-(--c-on-accent)`}
      >
        ADD
      </button>
    );
  }
  return (
    <div className={`${h} flex w-full ${minW} items-center justify-between rounded-lg bg-(--c-accent) text-(--c-on-accent)`}>
      <button onClick={onRemove} aria-label={label ? `Remove one ${label}` : "Remove one"} className="grid h-full w-9 place-items-center">
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <span className="tnum text-[15px] font-bold" aria-live="polite">{qty}</span>
      <button onClick={onAdd} aria-label={label ? `Add one more ${label}` : "Add one more"} className="grid h-full w-9 place-items-center">
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
