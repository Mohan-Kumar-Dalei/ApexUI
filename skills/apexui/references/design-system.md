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
