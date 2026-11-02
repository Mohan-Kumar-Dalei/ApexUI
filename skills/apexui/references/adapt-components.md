# Adapting components to the site

ApexUI components are raw material, like a good hinge or a fabric sample. They arrive with demo colours (lime, slate, navy, white on black), demo fonts and demo content. **Shipping a component as it arrives is the main reason AI-built sites look like templates.** Every component you add must look like it was designed for this brand.

## The rule
After `npx apex-ui-kit add <name>`, open the file and make it yours before using it:

1. **Colours**: replace every hard-coded colour with your tokens.
2. **Type**: headings in the component use your display face; body uses your text face; sizes from your scale.
3. **Shape**: radius, borders and shadows match your direction (if your direction is radius 0, the component is radius 0).
4. **Content**: replace every default title, name, image, quote and number with real content for this site.
5. **Motion**: keep the component's interaction; tune durations and easing to `motion.md` (`cubic-bezier(0.16, 1, 0.3, 1)`).
6. **Fit**: give it a role in the layout (full width band, half of a split, inside a card). It should never look dropped in.

## Colour map (find and replace)
Search the component file for these and swap them for your tokens (`bg-[var(--surface)]` or the Tailwind theme names from `directions.md`):

| Demo value in components | Replace with |
| --- | --- |
| `bg-black`, `bg-neutral-950`, `bg-neutral-900`, `bg-slate-950`, `bg-zinc-950`, `#09090b`, `#0a0a0a` | `bg-bg` (dark directions) or `bg-surface` / `bg-ink` (light directions, for a dark band) |
| `bg-white`, `bg-neutral-50`, `bg-neutral-100` | `bg-bg` or `bg-surface` (light directions) |
| `text-white`, `text-neutral-100`, `text-neutral-900`, `text-black` | `text-ink` |
| `text-white/60`, `text-neutral-400`, `text-neutral-500`, `text-slate-400`, `text-gray-400` | `text-muted` |
| `border-white/10`, `border-black/10`, `border-neutral-800`, `ring-white/10` | `border-line` |
| `lime-*`, `#a3e635`, `emerald-*`, `cyan-*`, `violet-*`, `purple-*`, `sky-*` | `accent` (or remove the colour entirely) |
| `bg-gradient-*`, `from-*`, `via-*`, `to-*`, `radial-gradient(...)` | remove; use a flat token or a flat `bg-black/40` overlay on photos |
| `shadow-2xl`, `shadow-[0_0_...glow...]`, `blur-2xl` glow blobs | remove, or one soft shadow if your direction allows it |
| `rounded-2xl` / `rounded-3xl` | your radius token (0, 4 or 8px) |
| `font-semibold` headings in the system font | `font-display` with your display weight |

Many components take an `accentColor` or `color` prop and a `theme="light"|"dark"` prop: always pass your accent and your theme, then still check the file for leftovers.

**Final check**: search your whole `src` for `lime`, `#a3e635`, `slate-9`, `neutral-950`, `gradient`, `from-`, `rounded-2xl`. Each hit is either intended and token-based, or it goes.

## Examples

### Testimonials (demo: navy card, lime name, white text)
- Card `bg-slate-950 border-slate-800` becomes `bg-surface border-line`.
- Name `text-white text-3xl font-bold` becomes `font-display text-ink text-[28px]`.
- Role `text-lime-400` becomes `text-muted` (or `text-accent` if accent is used sparingly).
- Photos: the brand's own guests, products or clients; same crop and tone as the rest of the page.
- Arrow buttons: your button style (square outline in Atelier, round in Champagne).

### FAQ Accordion
- Panels lose their card backgrounds; use the hairline list (`divide-line border-y border-line`).
- The plus icon takes `text-ink`; question text in your text face 18px; answer `text-muted`.

### Image Accordion, Coverflow, Swipe Cards
- Remove gradient overlays; if text sits on images, use a flat `bg-black/35` overlay or put the caption under the image.
- Use the direction's image ratio (4:5 for fashion, 3:2 for scenes) and radius.
- Labels in your text face; no badges with neon colours.

### Pricing Cards, Spotlight Grid, Hyper Card
- Replace glow or spotlight colour with the accent at 10 to 15% opacity, or switch the effect off for luxury directions.
- Cards become flat surfaces with a 1px `border-line`; highlighted plan gets a 1px `border-ink`, not a glowing badge.

### Floating Navbar, Gooey Nav, Nav Menu
Do not ship them as they are. Use them as the starting point for a custom nav (see `navbar.md`): your logo, your links, your CTA style, your colours, your behaviour on scroll.

## When not to use a component
If you would have to remove most of it to fit the brand, build the section from `sections.md` instead. A plain, well-made section always beats a flashy component in the wrong style.
