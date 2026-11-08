# Motion: Lenis + GSAP

Lenis makes the page move as one weighted surface; GSAP ScrollTrigger drives reveals and the 3D scrub. Animate `transform`, `opacity` and `clip-path`. Keep it subtle: too much motion reads as messy. Full helpers: `templates/motion.jsx`.

## Wiring Lenis to GSAP (once, at the app root)
```jsx
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
- On route change: `lenis.scrollTo(0, { immediate: true })`, then `ScrollTrigger.refresh()`.
- Drawers and dialogs: `lenis.stop()` while open; mark inner scroll areas `data-lenis-prevent`.
- Reduced motion: do not create Lenis; skip reveals; jump instead of scrub.

## The core set
- **Reveal**: children rise 32px and fade in once at `top 88%`, expo out, 1.1s, optional stagger.
- **Lines**: headline words rise out of a mask one after another (`yPercent: 110`, stagger 0.06).
- **Curtain**: images open with `clip-path: inset(100% 0 0 0)` to `inset(0)` while the photo settles from scale 1.18.
- **Blur Fade** (Magic UI, restyled): section headings, 0.9s, expo, 18px offset, 8px blur.
- **Ticker** (Magic UI Marquee): 40 to 46s per loop, gold labels on the ink band.

## Signature moments
- Hero photo: scale 1.12 to 1 over 2.6s, then yPercent 12 on scroll.
- Pinned 3D story: scrub 0.8, camera eased every frame.
- Rail: items slide in with a 30ms stagger; the focused one steps forward 0.34 m and grows 12%.
- Lifted detail: drops 0.45 m into place with an elastic swing; Front / Back turns 180 degrees, expo in-out, 1s.
- Carousels: 0.85s expo; side items blur and shrink by step.

## Page loader
Once per visit (sessionStorage), under 2s: a short brand moment (warp threads drawing, then a weft line crossing, then the wordmark), then the panel lifts with a clip-path. Skip it with reduced motion.
