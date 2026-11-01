# Art directions

Pick one. Copy it exactly: palette, fonts, radius, image style, signature move. Every palette is flat (no gradients) and passes contrast for body text.

| Token | Meaning |
| --- | --- |
| `bg` | Page background |
| `surface` | Cards, panels, alternate sections |
| `ink` | Headings and body text |
| `muted` | Secondary text, captions |
| `line` | 1px borders and rules |
| `accent` | Primary button and one or two marks |
| `on-accent` | Text on the accent |

## 1. Atelier
Best for: fashion, clothing, leather goods, perfume, luxury retail.
- Palette: bg `#F3F0EA`, surface `#E9E4DA`, ink `#161513`, muted `#6F6A61`, line `#D8D1C4`, accent `#161513`, on-accent `#F3F0EA`.
- Fonts: display **Bodoni Moda** 400 (italic allowed for one word only in the whole page), text **Hanken Grotesk** 400/500.
- Radius 0. Buttons: square, black fill, uppercase small text with 0.12em tracking.
- Images: soft daylight, neutral clothes on plain walls, 4:5 portrait crops.
- Signature: a giant wordmark (15vw) across the footer; product grid with no borders, just image, name and price.

## 2. Noir Gallery
Best for: photographers, artists, film, architecture portfolios.
- Palette: bg `#0F0F0E`, surface `#181816`, ink `#ECE8E1`, muted `#8E8A82`, line `#2B2A27`, accent `#ECE8E1`, on-accent `#0F0F0E`.
- Fonts: display **Instrument Serif** 400, text **Familjen Grotesk** 400/500.
- Radius 0 to 2px. Buttons: outlined ink, fill on hover.
- Images: full-bleed, edge to edge, captions in small text under the image.
- Signature: an index list of projects with large serif titles and year on the right; image appears on hover (desktop) or inline (phone).

## 3. Stone and Linen
Best for: architects, interior designers, hotels, real estate, furniture.
- Palette: bg `#ECE9E2`, surface `#E2DED4`, ink `#23211D`, muted `#6C675E`, line `#CEC8BB`, accent `#4C5A3B`, on-accent `#F4F2EC`.
- Fonts: display **Cormorant Garamond** 500, text **Manrope** 400/500.
- Radius 2px. Buttons: moss fill, small caps text.
- Images: interiors in natural light, materials close up, 3:2 crops.
- Signature: large split sections, image 7 columns and text 5, alternating sides.

## 4. Harbour
Best for: restaurants, seafood, wine bars, wellness retreats, travel.
- Palette: bg `#F1EFEA`, surface `#E6E3DC`, ink `#14212A`, muted `#5B6870`, line `#D2D2CC`, accent `#163E4E`, on-accent `#F1EFEA`.
- Fonts: display **Fraunces** 400 (optical size on), text **Figtree** 400/500.
- Radius 4px. Buttons: deep teal fill.
- Images: warm food on dark tables, candle light, people at a distance.
- Signature: a menu set like a printed card (two columns, dotted leaders between dish and price).

## 5. Swiss Precision
Best for: fintech, software, developer tools, B2B, consultancies.
- Palette: bg `#F7F7F5`, surface `#FFFFFF`, ink `#0C0C0D`, muted `#5E5E64`, line `#E2E2DF`, accent `#2142D9`, on-accent `#FFFFFF`.
- Fonts: **Schibsted Grotesk** for everything (500 display, 400 text).
- Radius 6px. Buttons: blue fill, compact.
- Images: real product screenshots in thin device frames, or none.
- Signature: a strict 12 column grid made visible by hairline rules; numbers set large in tabular figures.

## 6. Midnight Ink
Best for: premium AI products, audio, automotive, night brands.
- Palette: bg `#0D1014`, surface `#141920`, ink `#E7EBEF`, muted `#8B95A1`, line `#232A33`, accent `#C8B27A` (muted brass), on-accent `#0D1014`.
- Fonts: display **Newsreader** 400, text **Instrument Sans** 400/500.
- Radius 8px. Buttons: brass fill, small.
- Images: product in low light, strong single light source.
- Signature: one slow full-screen product image section; everything else minimal.

## 7. Bold Editorial
Best for: agencies, studios, magazines, events, music.
- Palette: bg `#F2F0EB`, surface `#E7E4DD`, ink `#111111`, muted `#5F5C57`, line `#111111`, accent `#D3321F`, on-accent `#FFFFFF`.
- Fonts: display **Archivo** 800 (condensed width if available), text **Archivo** 400.
- Radius 0. Buttons: red fill, heavy text.
- Images: black and white photography with one colour image as contrast.
- Signature: oversized headlines that run edge to edge, thick 2px black rules between sections.

## 8. Champagne
Best for: jewellery, beauty, skincare, weddings, boutique hotels.
- Palette: bg `#FAF7F2`, surface `#F2ECE3`, ink `#1E1A17`, muted `#7A7068`, line `#E6DDD1`, accent `#9C7E4F`, on-accent `#FFFFFF`.
- Fonts: display **Italiana** 400 (or **Cormorant Garamond** 400), text **Jost** 300/400.
- Radius: pills for buttons, 0 for images.
- Images: close-ups of product and skin, soft shadows, lots of negative space.
- Signature: centered, slow vertical rhythm with narrow text columns (max 34rem) and very large margins.

## Making your own direction
1. Choose a background off-white or soft black. Choose an ink 85 to 90% darker or lighter than it.
2. Derive `surface` (3 to 5% darker or lighter than bg), `muted` (about 55% mix of ink and bg) and `line` (about 15% mix).
3. Pick one accent from the brand's world (a leather brown, a sea teal, an olive, a lacquer red). Avoid default purple and electric blue.
4. Pick one display face and one text face from the lists in `taste.md`.
5. Decide radius (0, 4 or 8px) and keep it everywhere. Decide the one signature move.
6. Check contrast: ink on bg and on-accent on accent must be 4.5:1 or more.

## Tokens template (Tailwind CSS v4)
```css
@import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;1,400&family=Hanken+Grotesk:wght@400;500&display=swap");
@import "tailwindcss";

:root {
  --bg: #F3F0EA; --surface: #E9E4DA; --ink: #161513; --muted: #6F6A61;
  --line: #D8D1C4; --accent: #161513; --on-accent: #F3F0EA;
  --font-display: "Bodoni Moda", Georgia, serif;
  --font-text: "Hanken Grotesk", system-ui, sans-serif;
}

@theme inline {
  --color-bg: var(--bg); --color-surface: var(--surface); --color-ink: var(--ink);
  --color-muted: var(--muted); --color-line: var(--line);
  --color-accent: var(--accent); --color-on-accent: var(--on-accent);
  --font-display: var(--font-display); --font-text: var(--font-text);
}

html { background: var(--bg); color: var(--ink); font-family: var(--font-text); -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; }
```
Now use `bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-accent text-on-accent`, `font-display`.
