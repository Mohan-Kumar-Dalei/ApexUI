# Premium motion

Motion is what turns a clean page into a premium one. Not more animation: the right few moments, done smoothly. Every premium site gets the **core set**, plus **one signature moment** chosen for the brand.

Rules that never change:
- Animate only `transform`, `opacity` and `clip-path`. Never `width`, `height`, `top`, `left` or `filter` on large elements.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (calm and expensive). Durations 0.8 to 1.3s for reveals, 0.4 to 0.6s for hovers.
- Play reveals **once**, when the element is about 10% into the viewport. Never re-animate on scroll back.
- Respect reduced motion: show everything at rest, keep simple fades at most.
- No bounce, no spin, no shake, no rainbow, no gradients.

The snippets use Framer Motion (`npm i framer-motion`) in React. Plain HTML: the same ideas work with an IntersectionObserver that adds a class, plus CSS transitions.

## Core set (use on every site)

### 1. Reveal: fade and rise
```jsx
import { motion, useReducedMotion } from "framer-motion";
const EASE = [0.16, 1, 0.3, 1];
export function Reveal({ delay = 0, y = 28, className = "", children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}
```
Use on paragraphs, buttons, list rows (stagger rows by 0.05 to 0.08s).

### 2. Headline lines: words rise out of a mask
```jsx
export function Lines({ text, as: Tag = "h2", className = "", delay = 0, onMount = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" initial={reduce ? false : { y: "110%" }}
            animate={onMount || inView ? { y: "0%" } : undefined}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}>
            {w}{" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
```
Use on every H1 and H2. Hero headline: `onMount`. Long quotes: stagger 0.025.

### 3. Image curtain: clip reveal plus settle
```jsx
<motion.div className="overflow-hidden aspect-[4/5]"
  initial={{ clipPath: "inset(100% 0% 0% 0%)" }} whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
  viewport={{ once: true }} transition={{ duration: 1.3, ease: EASE }}>
  <motion.img src={src} alt={alt} className="h-full w-full object-cover"
    initial={{ scale: 1.18 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE }} />
</motion.div>
```
Use on feature images and tiles. Not on every small thumbnail.

### 4. Parallax image: slower than the page
```jsx
const ref = useRef(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
<div ref={ref} className="relative overflow-hidden h-[75svh]">
  <motion.img src={src} alt="" style={{ y, scale: 1.25 }} className="absolute inset-0 h-full w-full object-cover" />
</div>
```
Use on the hero image and full-bleed bands. Strength 6 to 12%.

### 5. Hover details
- Links: an underline that draws from the left (`scale-x-0` to `scale-x-100`, origin-left, 500ms).
- Images in cards: `scale-[1.05]` over 1.2s.
- Buttons: lift 2px or invert colours over 300 to 500ms. Card actions slide up into view on hover (desktop), always visible on touch.

### 6. Numbers that count up
Animate from 0 to the value once in view, 1.6s, tabular figures. Only real numbers.

## Signature moments (pick ONE per site)

| Signature | Best for | How |
| --- | --- | --- |
| **Intro curtain** | Fashion, studios, restaurants | Full-screen panel in the ink colour, brand name rises in, panel lifts away after ~1s. Once per visit (sessionStorage). Delay the hero entrance until it lifts. |
| **Sticky lookbook** | Products, case studies | Image sticky on one side (`lg:sticky lg:top-24`), details scroll past on the other. On phones: image first, then details. |
| **Story by the hour / chapters** | Restaurants, brands with a process | Image sticky; chapters scroll; an IntersectionObserver (`rootMargin: "-45% 0px -45% 0px"`) sets the active chapter and the image crossfades. |
| **Pinned sideways gallery** | Photographers, travel, portfolios | Section `h-[300vh]`, inner `sticky top-0 h-svh`, row translates `x` from 0 to -60% with scroll progress. Phones: a swipe row with snap. |
| **Floating preview** | Index lists, menus | On hover (fine pointers), a small image follows the pointer with a soft spring (stiffness ~150). |
| **Custom cursor** | Creative portfolios | A 10px dot that grows to a labelled circle ("View") over work. Only on `(hover: hover) and (pointer: fine)`. Never hide the real cursor on forms. |
| **Marquee band** | Stores, events, studios | One line of short facts moving slowly (30 to 40s per loop), separated by small shapes, never by dashes. |
| **Breathing or live element** | Wellness, apps | A circle scaling 1 to 1.5 over 4s and back; or the real app running inside a phone frame. |

## Pages: where motion goes
- **Hero**: headline lines on load, subline and buttons reveal 0.4 to 0.6s later, image settles or drifts (parallax).
- **Every section**: heading = Lines, body = Reveal, images = curtain or parallax, rows staggered.
- **Footer**: the oversized wordmark rises in once.
- **Mobile**: keep reveals and the signature (adapted), drop cursor effects and hover-only previews. Never pin long sections on phones.

## Mobile apps
Screen pushes slide 100% (300 to 350ms), sheets spring up, list items fade in, buttons scale to 0.97 on press. The phone frame in a landing page can rise on load, float gently (y ±10px over 6s) and tilt toward the pointer on desktop.
