/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

// Hover underline that draws in from the left (transform only).
export const UNDERLINE =
  "relative inline-block after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:content-[''] after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

export function Container({ className = "", children }) {
  return <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

// Section index row: "02  Beans" on the left, meta on the right, hairline above.
export function SectionLabel({ index, name, meta }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-[var(--k-line)] pt-4 text-sm text-[var(--k-muted)]">
      <p>
        <span className="num text-[var(--k-ink)]">{index}</span>
        <span className="ml-4">{name}</span>
      </p>
      {meta && <p className="text-right">{meta}</p>}
    </div>
  );
}

// Fade and rise once, when the element is close to the viewport.
export function Reveal({ delay = 0, y = 28, className = "", children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Headline words rise out of a mask, one after another.
export function Lines({ text, as: Tag = "h2", className = "", delay = 0, onMount = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = onMount || inView;
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={reduce || show ? { y: "0%" } : undefined}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {word}
            {" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// Image uncovers from the bottom with a slow settle inside the frame.
export function Curtain({ src, alt, ratio = "aspect-[4/5]", className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative overflow-hidden bg-[var(--k-surface)] ${ratio} ${className}`}
      initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.16 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.8, ease: EASE }}
      />
    </motion.div>
  );
}

// Counts from 0 to a real number once it is in view.
export function CountUp({ to, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className={`num ${className}`}>
      {value}
    </span>
  );
}
