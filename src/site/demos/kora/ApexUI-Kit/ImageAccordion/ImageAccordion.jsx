import { useEffect, useRef, useState } from "react";

/*
 * Image Accordion, restyled for Kora: square panels, a flat ink overlay for
 * legibility (no gradient), the index in tabular figures and the titles in the
 * display face. The active panel opens wide; the rest fold into slim strips.
 * Below 520px of width it stacks vertically. Pass your own `items`.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const ImageAccordion = ({ items = [], defaultActive = 0, autoPlay = 0, openRatio = 4, radius = 0, gap = 0.5, duration = 800, height = "30rem", onChange, className = "" }) => {
  const list = items;
  const [active, setActive] = useState(() => Math.min(defaultActive, Math.max(list.length - 1, 0)));
  const [vertical, setVertical] = useState(false);
  const [panelW, setPanelW] = useState(416);
  const root = useRef(null);
  const hovering = useRef(false);

  const open = (i) => {
    setActive((cur) => {
      if (cur !== i) onChange?.(i);
      return i;
    });
  };

  // Stack vertically when the box is narrow (a container check, not the viewport),
  // and work out how wide the open panel ends up so its text never overflows it.
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const stacked = w < 520;
      setVertical(stacked);
      setPanelW(stacked ? w : ((w - gap * rem * (list.length - 1)) * openRatio) / (openRatio + list.length - 1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [gap, openRatio, list.length]);

  useEffect(() => {
    if (!autoPlay || list.length < 2) return undefined;
    const id = setInterval(() => {
      if (!hovering.current) setActive((cur) => (cur + 1) % list.length);
    }, autoPlay * 1000);
    return () => clearInterval(id);
  }, [autoPlay, list.length]);

  return (
    <div
      ref={root}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      className={`flex w-full ${vertical ? "flex-col" : "flex-row"} ${className}`}
      style={{ height: vertical ? `max(${height}, ${list.length * 3.4 + openRatio * 3}rem)` : height, gap: `${gap}rem` }}
    >
      {list.map((item, i) => {
        const on = i === active;
        return (
          <button
            key={item.title}
            type="button"
            aria-pressed={on}
            aria-label={item.title}
            onPointerEnter={(e) => e.pointerType === "mouse" && open(i)}
            onFocus={() => open(i)}
            onClick={() => open(i)}
            className="group relative min-h-0 min-w-0 overflow-hidden bg-[var(--k-surface)] text-left text-[var(--k-bg)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--k-accent)]"
            style={{ flexGrow: on ? openRatio : 1, flexBasis: 0, borderRadius: `${radius}rem`, transition: `flex-grow ${duration}ms ${EASE}` }}
          >
            <img
              src={item.image}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ transform: on ? "scale(1)" : "scale(1.12)", transition: `transform ${duration * 1.4}ms ${EASE}`, willChange: "transform" }}
            />
            {/* Flat ink overlay for legibility. Folded panels get a deeper one. */}
            <span aria-hidden="true" className="absolute inset-0 bg-[var(--k-ink)]" style={{ opacity: on ? 0.4 : 0.6, transition: `opacity ${duration}ms ${EASE}` }} />

            {/* Folded: the title runs along the strip. */}
            <span
              aria-hidden="true"
              className="absolute whitespace-nowrap text-sm font-medium tracking-wide [backface-visibility:hidden]"
              style={{
                ...(vertical ? { left: "1rem", top: "50%", transform: "translateY(-50%)" } : { left: "50%", bottom: "1.25rem", transform: "translateX(-50%) rotate(-90deg)", transformOrigin: "center", translate: "0 -2.5rem" }),
                opacity: on ? 0 : 0.9,
                transition: `opacity ${duration * 0.5}ms ease`,
              }}
            >
              {item.title}
            </span>

            {/* Open: index, title and text rise in once the panel has room. */}
            <span
              className="absolute bottom-0 left-0 block p-[clamp(1rem,3cqw,1.75rem)] [backface-visibility:hidden]"
              style={{ width: `min(26rem, ${Math.round(panelW)}px)`, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(0.75rem)", transition: `opacity ${duration * 0.6}ms ${EASE} ${on ? duration * 0.35 : 0}ms, transform ${duration * 0.8}ms ${EASE} ${on ? duration * 0.3 : 0}ms` }}
            >
              <span className="num block text-[0.8rem] tracking-[0.12em] text-[var(--k-bg)]/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 block truncate font-display text-[2.25rem] leading-none">{item.title}</span>
              {item.description && <span className="mt-2 block max-w-[20rem] text-sm leading-relaxed text-[var(--k-bg)]/85">{item.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ImageAccordion;
