# Responsive and mobile

## Principles
- Mobile first: base styles for about 360px, then add space and columns as the screen widens.
- Size components by their container, not the screen, when they can sit in different places (cards in a sidebar, a widget in a grid). Use container queries (`@container` and `@sm:`/`@md:` in Tailwind v4) or a ResizeObserver.
- Fluid everything: `clamp()` for type, padding and gaps, so there are fewer breakpoints to manage.
- No horizontal scroll on the page, ever. Wide content (tables, code) scrolls inside its own box.

## Breakpoints to test
320 (small Android), 375 and 390 (iPhone), 430 (large phones), 768 (tablet portrait), 1024 (tablet landscape, small laptop), 1280, 1440, 1920.
Laptops at 125% or 150% Windows scaling report about 1100 to 1280px wide and 600 to 720px tall: check that the hero and nav still fit.

## Layout patterns
- Grids: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` instead of fixed column counts.
- Navs: links collapse into a menu when the bar runs out of room; the menu panel animates with transform and opacity only.
- Heroes: stack text over media on phones; keep the CTA visible in the first screen (`min-height: 100svh` minus the nav).
- Use `100svh` / `100dvh` instead of `100vh` for full-height mobile sections (the browser bar changes height).
- Long text: `max-width: 65ch`; avoid text over busy backgrounds without a scrim.

## Touch and input
- Targets at least 44 by 44px with 8px between them.
- Hover effects need a touch alternative (tap to reveal, always-visible actions).
- Use `pointer` media features: `@media (hover: hover) and (pointer: fine)` for hover-only flourishes like magnetic or cursor effects; switch them off on touch.
- Inputs: correct `type` and `inputmode` (`email`, `tel`, `numeric`), `autocomplete` values, font size 16px or more (iOS zooms below that).

## Safe areas (notches, home indicator)
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
```css
.bottom-bar { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
.top-bar { padding-top: max(0.75rem, env(safe-area-inset-top)); }
```

## Installable web app (PWA)
- `manifest.webmanifest` with `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color`, icons 192 and 512 (plus a maskable icon).
- A service worker for offline caching (for Vite: `vite-plugin-pwa`). Cache static assets; never cache API responses that contain private data.
- `theme-color` meta for light and dark: `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b">`.
- Native app needed later? Wrap the same web app with Capacitor; keep the code web-standard so that stays easy.

## Performance on phones
- Animate `transform` and `opacity` only; avoid big `backdrop-filter` blurs on elements that move or resize.
- WebGL and canvas: cap device pixel ratio at 1.5 to 2, pause when off screen (IntersectionObserver), stop when the tab is hidden.
- Lazy-load heavy sections (`React.lazy`, dynamic import) and images below the fold.
- Budget: LCP under 2.5s, CLS under 0.1, INP under 200ms on a mid-range phone.

## Reduced motion and accessibility
- `@media (prefers-reduced-motion: reduce)`: stop parallax, auto-play, large movement; keep simple fades.
- Visible focus rings (`focus-visible:ring-2`), logical tab order, `aria-label` on icon-only buttons, `aria-expanded` on menus.
- Text contrast at least 4.5:1 (3:1 for large text and UI borders).
