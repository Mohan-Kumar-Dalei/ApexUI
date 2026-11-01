---
name: apexui
description: Build premium, responsive, secure websites and mobile-first web apps in React with ApexUI animated components (Tailwind CSS, Framer Motion, GSAP, three.js). Use when the user asks for a landing page, marketing site, portfolio, SaaS or AI product site, dashboard, app screens, a redesign, or "make it look premium", or mentions ApexUI or apex-ui-kit.
---

# ApexUI: premium sites and apps with AI

You design and build like a senior product designer and front-end engineer. Every result must be:

1. **Premium**: one clear visual idea, a deliberate palette, real type hierarchy, generous space, motion with purpose.
2. **Responsive**: works from 320px phones to 2560px screens, touch and mouse, light and dark.
3. **Secure**: no secrets in the browser, no unsafe HTML, safe links, safe forms. Follow the "security" part below every time.
4. **Fast and accessible**: good Core Web Vitals, keyboard friendly, readable contrast, reduced motion respected.

ApexUI gives you 116 free animated React components that you add one by one with `npx apex-ui-kit add <name>`. The source lands in the project, so you can read and adapt it.

## Reference files (read only what the task needs)

| File | Read it when |
| --- | --- |
| the "components" part below | Choosing components. Every component, its CLI name and what it is for. |
| the "recipes" part below | Planning sections or screens (landing pages, dashboards, auth, mobile app screens). |
| the "design-system" part below | Picking palette, fonts, spacing, radius, shadows and motion tokens. |
| the "responsive-mobile" part below | Layout, breakpoints, touch, safe areas, PWA. |
| the "security" part below | Always, before you ship anything. |
| the "checklist" part below | Last step, before you say the work is done. |

## Workflow

### 1. Understand the brief (ask at most 3 short questions, only if the answer changes the build)
- What is it (product, audience, goal of the page or app)?
- Platform: website, mobile-first web app, or installable PWA?
- Brand: existing colours, logo, tone (playful, bold, calm, technical, luxury)?

If the user gives no brand, choose one direction from the "design-system" part below and say which one you chose.

### 2. Plan before code
Write a short plan: the sections (or screens) in order, the ApexUI component for each, the palette and font pair. Use the "recipes" part below. Prefer 1 hero effect plus 2 to 4 supporting effects per page. Too many effects look cheap.

### 3. Set up the project
For a new project use Vite + React + Tailwind CSS v4:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.js` and `@import "tailwindcss";` at the top of `src/index.css`. Existing Next.js or Vite projects work too; components are plain React.

### 4. Add ApexUI components
```bash
npx apex-ui-kit add <cli-name>
```
- The CLI copies the component into `ApexUI-Kit/<ComponentFolder>/` in the folder you choose and installs only the packages it imports.
- Import it with a relative path, for example `import HyperCard from "./ApexUI-Kit/HyperCard/HyperCard.jsx";`.
- Read the component file before using it: props have defaults and comments at the top explain the behaviour.
- Components that use browser APIs (canvas, WebGL, window) must render on the client. In Next.js put `"use client"` at the top of the file that uses them.

### 5. Build
- Mobile first. Write the base styles for 360px, then widen with breakpoints or container queries.
- Use semantic HTML: `header`, `nav`, `main`, `section` with headings, `footer`, real `button` and `a` elements.
- Put design tokens in CSS variables (see the "design-system" part below) so light and dark themes stay consistent.
- Keep components self-contained and copy-paste friendly: props for content, no hidden global state.
- Animate only `transform` and `opacity`. Never animate `width`, `height`, `top` or `left` for movement.
- Images: correct `width`/`height`, `loading="lazy"` below the fold, modern formats, real `alt` text.

### 6. Secure it
Go through the "security" part below. The non-negotiables:
- No API keys, tokens or secrets in front-end code or in `VITE_`/`NEXT_PUBLIC_` variables. Those are public.
- Never pass user content to `dangerouslySetInnerHTML` without sanitising it.
- External links: `target="_blank"` always with `rel="noopener noreferrer"`. Block `javascript:` URLs.
- Validate forms on the client for UX and on the server for safety.
- Set security headers when you control hosting (example in the "security" part below).

### 7. Verify
Run the "checklist" part below. Check the layout at 320, 375, 768, 1024, 1280 and 1440px, in light and dark, with keyboard only, and with reduced motion on. Fix what fails, then report what you built and anything you could not verify.

## Quality bar (what "premium" means here)
- One accent colour used with restraint; neutrals do most of the work.
- Headlines large and tight (`tracking-tight`, line-height 1 to 1.1); body text 16 to 18px with line-height 1.6.
- Consistent radius scale and spacing scale; nothing placed by eye.
- Real content: specific headlines, believable numbers, no lorem ipsum, no em dashes in UI copy.
- Motion: 150 to 300ms for UI feedback, 400 to 900ms for entrances, springs for drag and hover.
- Every interactive element has hover, focus-visible, active and disabled states.

## Never
- Never invent ApexUI components or props. Check the "components" part below and the component source.
- Never paste secrets into code, logs, commits or chat output.
- Never ship a page you have not checked at phone width.


---

<!-- checklist.md -->

# Pre-delivery checklist

Go through every line. Fix what fails. In your final message, list anything you could not check.

## Design
- [ ] One palette and one font pair, used through tokens (no stray hex values).
- [ ] Clear hierarchy: one H1, section titles, readable body (16px or more, line-height about 1.6).
- [ ] One hero effect, 2 to 4 supporting effects at most per page.
- [ ] Real copy, no lorem ipsum, no em dashes in UI text, no broken or placeholder images.
- [ ] Hover, focus-visible, active and disabled states on every control.

## Responsive
- [ ] Checked at 320, 375, 768, 1024, 1280 and 1440px; no horizontal page scroll.
- [ ] Nav collapses cleanly; menu opens and closes smoothly on a phone.
- [ ] Tap targets at least 44px; nothing important depends on hover.
- [ ] Safe-area padding on fixed top and bottom bars.
- [ ] Light and dark themes both correct (text contrast, borders, images).

## Performance
- [ ] Only `transform`/`opacity` animate; no layout thrash while scrolling.
- [ ] Heavy sections and below-the-fold images load lazily; WebGL pauses off screen.
- [ ] Fonts: only the weights used, `display=swap`.
- [ ] Lighthouse on mobile: Performance 90+, CLS under 0.1.

## Accessibility
- [ ] Keyboard only: every action reachable, focus always visible, no traps.
- [ ] Icon-only buttons have `aria-label`; menus use `aria-expanded`; images have `alt`.
- [ ] `prefers-reduced-motion` turns off large movement.
- [ ] Colour contrast at least 4.5:1 for text.

## Security
- [ ] Everything in `security.md` section 9 passes.

## Hand-off
- [ ] `npm run build` succeeds with no errors.
- [ ] README: how to run, how to change content, which ApexUI components are used.
- [ ] `.env.example` lists every variable with no real values.


---

<!-- components.md -->

# Components

116 ApexUI components. Add one with `npx apex-ui-kit add <cli-name>`; it lands in `ApexUI-Kit/<Folder>/`. Live demos and props: https://apex-ui.in/components/<page>.
Read the component source before using it: the props, their defaults and notes are at the top of the file.

## Backgrounds

| Component | CLI name | What it is |
| --- | --- | --- |
| BluePrint Background | `blueprint-background` | An animated blueprint-style grid background with interactive hover effects. |
| Kinetic Threads Background | `kinetic-threads-background` | A generative background of flowing, animated threads. |
| Lens Flare Background | `lens-flare-background` | An animated lens flare that adds a cinematic touch to any hero. |
| Luminous Particle Ocean | `luminous-particle-ocean` | A 3D ocean of glowing particles for immersive backgrounds. |
| Orbs Background | `orbs-background` | Floating orbs that drift and react to the pointer. |
| Rain Background | `rain-background` | Animated rainfall with collision detection. |
| Ripple Background | `ripple-background` | Soft, generative ripples that spread across the canvas. |
| Smoke Background | `smoke-background` | A WebGL smoke simulation with dynamic lighting. |
| Dot Wave Background | `dot-wave-background` | A grid of dots with a rolling wave of color that reacts to the pointer. |
| Liquid Gradient | `liquid-gradient` | A flowing four-color mesh gradient with film grain, drawn by one tiny OGL shader. |
| Aurora Background | `aurora-background` | Drifting northern-light curtains drawn by a light WebGL shader. |
| Retro Grid 3D | `retro-grid-3d` | A synthwave three.js landscape with scrolling hills and a striped sun. |
| Galaxy 3D | `galaxy-3d` | A turning three.js spiral galaxy with pointer parallax. |
| Warp Tunnel | `warp-tunnel` | A WebGL hyperspace tunnel that bends to the pointer; hold to boost. |
| Sunrise Background | `sunrise-background` | A WebGL sun rising between two mountain ranges, with rays, mist and rim light. |
| Horizon Glow | `horizon-glow` | A soft WebGL light rising from the bottom edge into a deep sky, for hero sections. |
| Dither Waves | `dither-waves` | Flowing waves as two-tone dithered pixel art in WebGL, with pointer ripples. |

## Text & Motion

| Component | CLI name | What it is |
| --- | --- | --- |
| Accordion Marquee | `accordion-marquee` | An interactive accordion with a smooth marquee effect on hover. |
| Beam Bar | `beam-bar` | An animated beam bar with a pulsing light for loading states and dashboards. |
| Hover Text | `hover-text` | Interactive text hover effects that bring headings to life. |
| Scroll Marquee | `scroll-marquee` | Text and card marquees whose speed follows the scroll. |
| Rolling Counter | `rolling-counter` | An odometer-style number whose digit wheels roll to every new value. |
| Scramble Text | `scramble-text` | Text that decrypts letter by letter on view, on hover or on a loop. |
| Blur Reveal Text | `blur-reveal-text` | Words rise out of a blur one after another as they scroll into view. |
| Flip Clock | `flip-clock` | Split-flap digits for countdowns, timers and clocks. |
| Typewriter Text | `typewriter-text` | Types, pauses and deletes rotating phrases with a blinking caret. |
| Extruded Text | `extruded-text` | Chunky 3D layered letters that tilt toward the pointer. |
| Mask View | `mask-view` | Reveal content through a mask: a text window onto an image, a spotlight, or glass you wipe clear. |
| Shiny Text | `shiny-text` | A band of light sweeps across the text on a loop, like light catching metal. |
| Glitch Text | `glitch-text` | Text that tears into shifted color slices like a broken signal. |
| Rotating Text | `rotating-text` | A headline whose last word swaps letter by letter inside a resizing pill. |
| Circular Text | `circular-text` | Text wrapped around a spinning circle that reacts to hover. |
| Proximity Text | `proximity-text` | Letters swell, lift and light up as the pointer gets close. |
| True Focus | `true-focus` | One sharp word at a time, framed by brackets that glide between words. |
| 3D Text Ring | `text-ring-3d` | Letters on a spinning ring in real 3D, drag to throw it around. |
| Particle Text | `particle-text` | Text built from canvas particles that fly in, dodge the pointer and burst on click. |
| Crossed Marquee | `crossed-marquee` | Two tilted tech-stack bands crossing like an X that react to page scroll. |

## Cards

| Component | CLI name | What it is |
| --- | --- | --- |
| Cards | `basic-card`, `meteor-card` | Basic and meteor-shower cards for showcasing content with motion. |
| Card Stack | `card-stack` | A stack of cards that cycles automatically and pauses on hover. |
| Glare Card | `glare-card` | A card with a reflective glare that follows the user's cursor. |
| Hyper Card | `hyper-card` | A futuristic card with a starfield background and warp-speed hover. |
| Parallax Card | `parallax-card` | A card with a layered 3D parallax effect. |
| Profile | `flip-profile`, `parallax-profile`, `profile-card` | Profile cards in four styles, flip, parallax, a tilting card and an ID badge on a ribbon. |
| Testimonials | `testimonials` | A testimonials section with smooth transitions between quotes. |
| Spotlight Grid | `spotlight-grid` | A bento grid of cards sharing one pointer spotlight across borders and surfaces. |
| Pricing Cards | `pricing-cards` | Plans with a monthly / yearly switch, sliding prices and a glowing featured plan. |
| Swipe Cards | `swipe-cards` | A deck you swipe left or right with tilt, LIKE / NOPE stamps and undo. |
| Holo Card | `holo-card` | A collectible card that tilts in 3D with a holographic foil and floating layers. |
| Iso Stack | `iso-stack` | Isometric 3D layers that fan open to show each label. |
| Pixel Transition | `pixel-transition` | A card that dissolves into pixels to reveal its other side. |
| Folder | `folder` | A folder that opens and fans its papers out toward the pointer. |
| Bounce Cards | `bounce-cards` | A fanned hand of photo cards that bounce in and make room on hover. |
| Distortion Image | `distortion-image` | A WebGL image that ripples and splits into RGB fringes under the pointer. |
| Scroll Stack | `scroll-stack` | Cards that pin and pile up as you scroll, shrinking and dimming into depth. |
| Image Accordion | `image-accordion` | Image panels that open wide on hover and stack vertically on phones. |

## Navigation

| Component | CLI name | What it is |
| --- | --- | --- |
| Nav DropDown | `nav-dropdown` | A floating navbar with one dropdown panel that morphs between menus. |
| Nav Menu | `nav-menu` | Navigation with an animated active indicator. |
| Theme Toggle | `theme-toggle` | A light/dark switch with view-transition reveal animations. |
| Magnify Dock | `magnify-dock` | A macOS-style glass dock whose icons swell toward the pointer. |
| Sidebar Nav | `sidebar-nav` | An app sidebar that collapses to an icon rail, with a sliding active pill and groups. |
| Animated Tabs | `animated-tabs` | Tabs with a sliding pill, underline or segmented indicator and sliding panels. |
| Floating Navbar | `floating-navbar` | A glassy responsive navbar with a hover pill, hide-on-scroll and an animated mobile menu. |
| Gooey Nav | `gooey-nav` | A liquid active pill that bursts droplets between links. |
| Radial Menu | `radial-menu` | A round button that fans its actions out in a circle or an arc. |
| Command Palette | `command-palette` | A ⌘K search palette with fuzzy matching and a sliding keyboard highlight. |
| Theme Switcher | `theme-switcher` | Eight colour themes with a circle reveal from the swatch you click. |

## Buttons

| Component | CLI name | What it is |
| --- | --- | --- |
| Animated Buttons | `animated-button`, `hold-to-confirm` | Seven button feels, shine, fill, border beam, 3D press, loading, ripple and arrow. |
| Animated Switches | `animated-switch` | Toggles with personality, classic, icon, day-to-night and neon. |
| Star Border | `star-border` | A button with points of light sliding along its edges. |
| Magnetic Button | `magnetic-button` | A button that leans toward the pointer with a layered label and a tracking glow. |

## Interactive

| Component | CLI name | What it is |
| --- | --- | --- |
| Avatar | `avatar` | Display user avatars on their own or as an animated, stacked group. |
| Carousel | `carousel`, `parallax-carousel`, `drag-carousel` | Smooth, customizable carousels for showcasing images or content. |
| Edge Glow Form | `edge-glow-form` | A form container that emits a soft gradient glow from its edges. |
| Pointer Follower | `pointer-follower` | A pointer that follows the cursor and reveals content as it moves. |
| ToolTip | `tooltip` | Animated tooltips with smooth, physics-based positioning. |
| Receipt Printer | `receipt-printer` | A thermal printer that processes a payment and feeds a receipt out line by line. |
| Dynamic Island | `dynamic-island` | A black capsule that morphs between music, calls, timers and notifications. |
| 3D Carousel | `3d-carousel`, `webgl-carousel` | Cards on a ring that spins in 3D, a light CSS ring or a full 360° WebGL ring. |
| Magnetic Cursor | `magnetic-cursor` | A dot-and-ring cursor that wraps buttons, labels images and pulls magnetic elements. |
| FAQ Accordion | `faq-accordion` | Questions that open smoothly with a plus that turns into a cross. |
| Toast Stack | `toast-stack` | Stacked notifications that fan out on hover and swipe away. |
| Cursor Trail | `cursor-trail` | A tail that follows the mouse, comet, rainbow, dots, ribbon, sparkles or ghost rings. |
| Image Compare | `image-compare` | A before / after slider you drag, click or move with the keyboard. |
| Cube Gallery | `cube-gallery` | Images on a 3D cube you drag, click or arrow-key around. |
| Flip Book | `flip-book` | A 3D book whose pages turn around the spine. |
| Click Spark | `click-spark` | Every click throws a ring of sparks from the pointer. |
| Elastic Slider | `elastic-slider` | A slider whose track stretches like rubber when pulled past the ends. |
| Stepper | `stepper` | A multi-step flow with filling indicators and sliding step content. |
| Coverflow 3D | `coverflow-3d` | The classic album-flip view with angled covers and reflections. |
| Magnet Lines | `magnet-lines` | A grid of lines that all swing to point at the pointer. |
| Liquid Blob 3D | `liquid-blob-3d` | A glossy three.js blob whose surface flows and ripples toward the pointer. |
| Particle Morph | `particle-morph` | Thousands of three.js particles that swarm between 3D shapes. |
| Marquee 3D | `marquee-3d` | A tilted 3D wall of cards with columns scrolling in opposite directions. |
| Wireframe Knot 3D | `wireframe-knot-3d` | A glowing three.js wireframe shape that turns toward the pointer. |
| Edge Blur | `edge-blur` | A progressive blur that melts content at the edge of a scrolling area. |
| Circular Carousel | `circular-carousel` | A WebGL ring of curved image cards you can drag, flick and click. |
| Arc Gallery | `arc-gallery` | An endless WebGL row of image cards bent along an arc, with drag and wheel. |
| Glass Lens | `glass-lens` | A WebGL drop of liquid glass that refracts and magnifies an image under the pointer. |
| Infinite Canvas | `infinite-canvas` | An endless wall of image cards you drag and fling in any direction. |
| Orbit Icons | `orbit-icons` | Icons circling a center on tilted rings, easing to a stop on hover. |
| Liquid Glass | `liquid-glass` | iOS style WebGL glass panels that bend, frost and melt together as you drag them. |
| Fluid Cursor | `fluid-cursor` | A real-time WebGL fluid simulation that trails the cursor with swirling ink. |
| Sketch Reveal | `sketch-reveal` | A photo turns into a glowing sketch, then burns away into the next one as you scroll. |

## AI

| Component | CLI name | What it is |
| --- | --- | --- |
| AI Chat | `ai-chat` | A chat window with streaming replies, typing dots and suggestion chips. |
| AI Prompt Box | `ai-prompt-box` | A prompt input with a glowing border, model picker, attachments and send / stop. |
| AI Thinking | `ai-thinking` | A shimmering Thinking state with a timer and steps that tick off. |
| AI Voice Orb | `ai-voice-orb` | A glass voice-assistant orb that reacts to idle, listening, thinking and speaking. |
| AI Voice Wave | `ai-voice-wave` | Glowing sine waves that swell and burst with the assistant's voice. |
| AI Voice Bars | `ai-voice-bars` | An equalizer pill of rounded bars for listening, thinking and speaking. |
| AI Voice Ring | `ai-voice-ring` | A circular audio visualiser with radial bars around a glowing core. |
| AI Voice Blob | `ai-voice-blob` | A gradient blob whose outline wobbles with the assistant's voice. |
| AI Response | `ai-response` | A streaming answer with code, sources and copy / regenerate / feedback actions. |
| AI Model Prompt | `ai-model-prompt` | A prompt composer with a model picker and per-model temperature, tokens and reasoning settings. |

## Loaders

| Component | CLI name | What it is |
| --- | --- | --- |
| Loading Screens | `loading-screen` | Six loaders, orbit, progress, blocks and three mini games (orb, runner, racing) to play while you wait. |

## Maps

| Component | CLI name | What it is |
| --- | --- | --- |
| Dot Globe | `dot-globe` | A draggable 3D globe of land dots with pulsing cities and flight arcs. |
| World Map | `world-map` | A dotted world map with flight connections, live pings or clickable office pins. |

## Picking well

- One hero effect per page (a background, a 3D piece or a big text effect). Support it with 2 to 4 quieter pieces.
- Backgrounds that use WebGL (Aurora, Galaxy 3D, Warp Tunnel, Liquid Gradient, Dither Waves, Horizon Glow, Sunrise) are the heaviest: use one per page, never stack two.
- Text effects work best on short strings: a headline, a word that rotates, a stat that counts.
- For product UI (dashboards, settings, forms) prefer calm pieces: Animated Tabs, Sidebar Nav, Stepper, FAQ Accordion, Toast Stack, Command Palette.
- For mobile app screens: Floating Navbar or Magnify Dock style bottom bars, Swipe Cards, Card Stack, Toast Stack, Animated Switches.
- AI products: AI Prompt Box or AI Model Prompt for input, AI Thinking and AI Response for output, an AI Voice piece for voice mode.


---

<!-- design-system.md -->

# Design system

Pick one palette and one font pair, put them in CSS variables, and use only those tokens. Consistency is what makes a page look premium.

## Palettes

Each palette has a dark and a light mode. `accent` is for primary buttons, links and highlights only; `on-accent` is the text colour on top of it. Contrast of `ink` on `bg` and `on-accent` on `accent` passes WCAG AA.

| Palette | Mood, best for | Mode | bg | surface | line | ink | muted | accent | on-accent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Volt | Bold, developer tools, SaaS | dark | #09090b | #131316 | #27272a | #fafafa | #a1a1aa | #a3e635 | #0a0a0a |
| Volt | | light | #fafafa | #ffffff | #e4e4e7 | #09090b | #52525b | #4d7c0f | #ffffff |
| Indigo Night | Trustworthy, AI products, fintech | dark | #0b0d17 | #12162a | #23284a | #eef0ff | #9aa3c7 | #818cf8 | #0b0d17 |
| Indigo Night | | light | #f7f8ff | #ffffff | #e3e6f8 | #0f1229 | #545b80 | #4f46e5 | #ffffff |
| Ember | Warm, creative studios, food, events | dark | #120c0a | #1c1411 | #33241e | #fff5ef | #c9a99a | #ff6a3d | #1a0d07 |
| Ember | | light | #fffaf6 | #ffffff | #f1e2d8 | #1f1410 | #7a5a4b | #e8501f | #ffffff |
| Glacier | Calm, health, productivity | dark | #071114 | #0d1b20 | #1d333a | #ecfbff | #93b4bd | #5eead4 | #04201b |
| Glacier | | light | #f5fbfc | #ffffff | #dcedf0 | #0b2228 | #4b6b73 | #0f766e | #ffffff |
| Rose Quartz | Soft luxury, beauty, lifestyle | dark | #140b10 | #1e1118 | #3a2230 | #fff1f6 | #c79bb0 | #f472b6 | #1d0612 |
| Rose Quartz | | light | #fff7fa | #ffffff | #f6dde8 | #2a1020 | #80586a | #be185d | #ffffff |
| Graphite Gold | Luxury, finance, architecture | dark | #0c0b09 | #15130f | #2c2820 | #f7f2e8 | #b3a88f | #d4af37 | #15110a |
| Graphite Gold | | light | #faf8f3 | #ffffff | #ebe5d6 | #1a1712 | #6b6250 | #8a6d12 | #ffffff |
| Ocean Signal | Clean, B2B, analytics | dark | #06101f | #0c1a30 | #1c2f4d | #eaf2ff | #8fa6c9 | #38bdf8 | #04121f |
| Ocean Signal | | light | #f6f9fe | #ffffff | #dde7f5 | #0a1a33 | #4e6283 | #0369a1 | #ffffff |
| Grape Soda | Playful, consumer apps, games | dark | #110a1c | #1a1029 | #33224d | #f6efff | #b3a0d1 | #c084fc | #170a26 |
| Grape Soda | | light | #fbf8ff | #ffffff | #ebe1f8 | #1d0f33 | #6b5a85 | #7e22ce | #ffffff |
| Forest | Natural, sustainability, outdoors | dark | #0a110c | #111c14 | #223627 | #eef8f0 | #9bb7a1 | #4ade80 | #06170b |
| Forest | | light | #f7fbf7 | #ffffff | #dfece2 | #0f2214 | #50685a | #15803d | #ffffff |
| Mono Paper | Editorial, portfolios, minimal | dark | #0e0e0e | #171717 | #2a2a2a | #f5f5f4 | #a8a29e | #f5f5f4 | #0e0e0e |
| Mono Paper | | light | #f5f4f0 | #ffffff | #e2e0d9 | #111111 | #5f5c55 | #111111 | #f5f4f0 |

### Using a palette with Tailwind CSS v4

```css
@import "tailwindcss";

:root {
  --bg: #09090b; --surface: #131316; --line: #27272a;
  --ink: #fafafa; --muted: #a1a1aa; --accent: #a3e635; --on-accent: #0a0a0a;
}
:root[data-theme="light"] {
  --bg: #fafafa; --surface: #ffffff; --line: #e4e4e7;
  --ink: #09090b; --muted: #52525b; --accent: #4d7c0f; --on-accent: #ffffff;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-on-accent: var(--on-accent);
}

body { background: var(--bg); color: var(--ink); }
```

Now `bg-surface`, `text-muted`, `border-line`, `bg-accent text-on-accent` work everywhere. Most ApexUI components take an `accentColor` prop: pass the same accent hex.

## Font pairs (Google Fonts)

| Pair | Display (headings) | Text (body) | Feel |
| --- | --- | --- | --- |
| Modern tech | Space Grotesk 600 | Inter 400/500 | Developer, SaaS |
| Sharp editorial | Instrument Serif 400 | Inter 400 | Portfolios, studios |
| Friendly product | Plus Jakarta Sans 700 | Plus Jakarta Sans 400 | Consumer apps |
| Bold startup | Sora 700 | DM Sans 400 | AI startups, launches |
| Luxury | Cormorant Garamond 600 | Manrope 400 | Fashion, hospitality |
| Geometric clean | Outfit 600 | Outfit 400 | Dashboards, fintech |
| Playful | Bricolage Grotesque 700 | Nunito Sans 400 | Games, kids, community |
| Mono accent | Geist 600 | Geist 400 + Geist Mono for labels | Dev tools, docs |

Load only the weights you use, with `display=swap`. Use the mono font for small uppercase labels (`text-xs tracking-[0.2em] uppercase`).

## Type scale (fluid)

| Role | Size | Line height | Tracking |
| --- | --- | --- | --- |
| Hero headline | `clamp(2.5rem, 6vw + 1rem, 5.5rem)` | 1.0 | -0.03em |
| Section title | `clamp(1.9rem, 3.2vw + 0.8rem, 3.25rem)` | 1.05 | -0.02em |
| Card title | 1.125 to 1.375rem | 1.25 | -0.01em |
| Body | 1rem to 1.125rem | 1.6 | 0 |
| Small, labels | 0.75 to 0.875rem | 1.4 | 0.02em (uppercase: 0.18em) |

Keep body text to 60 to 72 characters per line (`max-w-prose` or `max-w-[65ch]`).

## Space, radius, depth

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px. Section padding: `py-[clamp(4rem,10vw,8rem)]`. Page gutter: `px-[clamp(1rem,4vw,3rem)]`.
- Radius scale: 8px (inputs, chips), 12 to 16px (buttons, small cards), 20 to 28px (cards, panels), full (pills, avatars). Pick 3 and reuse them.
- Shadows on dark: rely on borders (`border-line`) and a soft glow of the accent at 10 to 20% opacity. On light: `0 1px 2px rgb(0 0 0 / .05), 0 12px 32px -12px rgb(0 0 0 / .15)`.
- Max content width: 72 to 80rem for marketing pages, 90rem for dashboards.

## Motion

| Use | Duration | Easing |
| --- | --- | --- |
| Hover, press, toggles | 150 to 220ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Menus, popovers, tabs | 200 to 300ms | same, or spring stiffness 400, damping 32 |
| Section entrances | 500 to 900ms, stagger 60 to 90ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Drag, swipe, magnetic | spring stiffness 150 to 300, damping 18 to 26 | |

Respect `prefers-reduced-motion: reduce`: turn off parallax, auto-play and large movement; keep fades.


---

<!-- recipes.md -->

# Recipes

Proven section orders for common products, with the ApexUI components that fit each part. Component names match `components.md` (look up the CLI name there). Swap pieces to fit the brand; keep the structure.

## Page skeleton (every marketing page)

1. **Nav**: logo left, 3 to 6 links, one primary CTA right. Floating Navbar (switches to a burger by its own width) or Gooey Nav for a playful brand.
2. **Hero**: one promise in 4 to 9 words, one supporting line, one primary and one secondary CTA, proof under it (logos, rating, user count). One hero effect only.
3. **Proof**: logo strip (Scroll Marquee, Crossed Marquee) or numbers (Rolling Counter).
4. **Features**: 3 to 6 benefits, each with a title that states the outcome. Spotlight Grid, Hyper Card, Iso Stack for "how it fits together".
5. **How it works**: 3 steps. Stepper, Scroll Stack, or numbered cards.
6. **Showcase**: product shots or work. Image Accordion, Coverflow 3D, Arc Gallery, Image Compare (before/after).
7. **Testimonials**: Testimonials, Card Stack, Swipe Cards.
8. **Pricing**: Pricing Cards (monthly/yearly toggle, one highlighted plan).
9. **FAQ**: FAQ Accordion with 5 to 8 real questions.
10. **Final CTA**: repeat the promise, one button. Star Border or Magnetic Button.
11. **Footer**: links in 3 to 4 columns, legal, socials, theme toggle.

## SaaS / developer tool
- Palette: Volt or Ocean Signal. Fonts: Modern tech or Mono accent.
- Hero: Blueprint Background or Dot Wave Background, headline with Blur Reveal Text, CLI install line in a mono chip.
- Features: Spotlight Grid; code samples in cards; Command Palette demo for power users.
- Extras: Animated Tabs to switch between "Code / Preview / Docs".

## AI startup
- Palette: Indigo Night or Grape Soda. Fonts: Bold startup.
- Hero: Galaxy 3D, Aurora Background or Horizon Glow; headline with Scramble Text or Rotating Text.
- Product: AI Prompt Box (input), AI Thinking + AI Response (output), AI Voice Orb for voice mode.
- Trust: security and privacy section with plain-language bullets.

## Portfolio / creative studio
- Palette: Mono Paper or Ember. Fonts: Sharp editorial.
- Hero: big name with Extruded Text, Mask View or Proximity Text; Fluid Cursor or Magnetic Cursor for character.
- Work: Image Accordion, Infinite Canvas or Arc Gallery; each project opens a case study page.
- Contact: Edge Glow Form, plus a direct email link.

## E-commerce / product store
- Palette: Ember, Rose Quartz or Graphite Gold. Fonts: Friendly product or Luxury.
- Hero: product on Glass Lens or Liquid Glass; price and "Add to bag" visible without scrolling on phones.
- Browse: Coverflow 3D or Carousel for collections, Swipe Cards for "find your style".
- Feedback: Toast Stack for "Added to bag"; Folder or Receipt Printer for order summary flourishes.

## App launch / mobile app marketing
- Palette: Grape Soda, Glacier or Volt. Fonts: Friendly product.
- Hero: phone mockup with real screens, Liquid Glass accents, store badges.
- Features: Bounce Cards or Card Stack for screens; Flip Clock or Rolling Counter for launch countdown.

## Event / conference
- Palette: Ember or Grape Soda. Hero: Warp Tunnel or Retro Grid 3D with Flip Clock countdown. Schedule in Animated Tabs (by day), speakers in Profile cards.

## Dashboard / admin
- Layout: Sidebar Nav (collapses to an icon rail), top bar with search (Command Palette, Ctrl/Cmd K), Theme Switcher.
- Content: KPI cards with Rolling Counter, tables with sticky headers, Animated Tabs for views, Toast Stack for results, Stepper for multi-step forms.
- Keep motion quiet: no background effects behind data.

## Auth screens (sign in, sign up, reset)
- Split layout on desktop (form left, brand panel right with a background effect), single column on phones.
- One form per screen, labels above inputs, show/hide password, clear inline errors, "Continue with" providers below.
- Never store tokens in localStorage; see `security.md`.

## Mobile app screens (mobile-first web app or PWA)
- **Onboarding**: 3 slides max (Swipe Cards or a Carousel), skip button, progress dots, final CTA.
- **Home / feed**: sticky top bar (title + 1 action), content cards (Cards, Card Stack), pull-to-refresh optional.
- **Bottom tab bar**: 3 to 5 tabs, icons with labels, 56 to 64px tall plus safe-area inset, active state clear. Magnify Dock or Gooey Nav styled as a bottom bar.
- **Detail**: large media, title, primary action in a sticky bottom bar.
- **Profile / settings**: grouped lists, Animated Switches for toggles, Theme Switcher.
- **Feedback**: Toast Stack at the top on phones (bottom bars cover the bottom), Dynamic Island style status for long tasks.
- Touch: every target at least 44 by 44px, swipe actions also available as buttons.


---

<!-- responsive-mobile.md -->

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


---

<!-- security.md -->

# Security (front end)

No app is "100% secure", but these rules close the holes that real front ends ship with. Treat every item as required unless it clearly does not apply, and say so when you skip one.

## 1. Secrets
- Anything in the browser bundle is public. That includes every `VITE_*`, `NEXT_PUBLIC_*` and `REACT_APP_*` variable.
- Never put API keys with write or billing access, database URLs, JWT secrets, SMTP passwords or service-account files in front-end code. Call your own server (or a serverless function) and keep the secret there.
- Publishable keys that are designed to be public (Stripe publishable key, Firebase web config, Maps keys) are fine, but restrict them by domain in the provider's dashboard.
- Add `.env*` to `.gitignore` (keep a committed `.env.example` with empty values). Never print secrets in logs, errors or chat replies.

## 2. Cross-site scripting (XSS)
- React escapes text by default. Do not undo it: avoid `dangerouslySetInnerHTML`. If you must render HTML (CMS content, markdown), sanitise it first with DOMPurify.
- Never build `href`/`src` from user input without checking the protocol. Allow only `https:`, `http:`, `mailto:`, `tel:` and relative paths; block `javascript:` and `data:`.
- Never `eval`, `new Function` or `setTimeout("string")`.

```js
export function safeUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}
```

## 3. Links and embeds
- `target="_blank"` always with `rel="noopener noreferrer"`.
- Third-party iframes: `sandbox` with the fewest permissions, `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`.
- Load third-party scripts only from trusted CDNs, pinned to an exact version, with Subresource Integrity (`integrity` + `crossorigin`) when the CDN supports it.

## 4. Auth on the client
- Keep session tokens in `httpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies set by the server. Do not store JWTs or refresh tokens in `localStorage` or `sessionStorage` (any XSS can read them).
- Hiding a button is not access control. The server must check permission on every request.
- Log out clears the server session; on 401 responses redirect to sign in.

## 5. Forms
- Validate on the client for UX (required, format, length) and again on the server for safety. Share the schema (for example Zod) when you can.
- Limit lengths (`maxLength`), use correct `type`/`autocomplete`, never echo raw errors from the server that reveal internals.
- Bot protection on public forms (sign up, contact): a honeypot field plus server-side rate limiting, or a CAPTCHA provider.
- File inputs: restrict `accept`, check size before upload, and let the server re-check type and size.

## 6. Security headers (set by the host)
Example for Vercel (`vercel.json`); adapt the CSP to the domains you actually use, then test that nothing breaks.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://api.yourdomain.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```
Netlify uses `_headers`; Nginx uses `add_header`. WebGL components need `script-src 'self'` only; Google Fonts needs the two font domains above.

## 7. Dependencies and build
- Install packages only from npm with exact names (watch for typosquats). Prefer well-maintained packages.
- Run `npm audit` and fix high and critical issues; turn on Dependabot or Renovate.
- Commit the lockfile. Do not ship source maps with secrets in them; production builds should not expose `.env` or internal URLs.

## 8. Privacy
- Ask before using camera, microphone, location or notifications, and only when the user acts.
- Cookie and analytics consent where the law requires it (EU, UK, India DPDP). Load analytics after consent.
- Do not log personal data to the console or third-party error trackers; scrub emails and tokens.

## 9. Before you ship
- [ ] No secrets in the bundle (search the build output for `sk_`, `secret`, `password`, `mongodb+srv`, `BEGIN PRIVATE KEY`).
- [ ] No `dangerouslySetInnerHTML` with unsanitised input; all user URLs pass `safeUrl`.
- [ ] Every `target="_blank"` has `rel="noopener noreferrer"`.
- [ ] Tokens live in httpOnly cookies, not web storage.
- [ ] Security headers set and checked (for example with securityheaders.com).
- [ ] `npm audit` clean of high and critical issues.
