# Taste: what premium means

Premium is not more effects. It is fewer, better decisions made on purpose. Think of a good hotel, a fashion house, a watch brand: quiet surfaces, beautiful type, great photos, nothing extra.

## Do
- **Let type carry the design.** Large display headlines (56 to 120px on desktop, 40 to 56px on phones), tight leading (1.0 to 1.1), slightly negative tracking. Body text calm and readable.
- **Use a grid.** 12 columns on desktop, 4 on phones, generous gutters (24 to 32px). Align edges. Asymmetry is good when it is deliberate (text in columns 1 to 5, image in 7 to 12).
- **Hairlines over boxes.** Separate content with 1px rules in the line colour instead of cards with shadows. When you need cards, keep them flat: a border or a background shift, no heavy shadow.
- **Photography first.** Big, well-cropped images with one consistent mood. Crop with intent (`object-cover`, a set aspect ratio like 4:5 for products, 3:2 for scenes).
- **Small details that feel expensive.** Real numbers ("Made in Porto, 312 pieces"), a subtle grain-free surface, consistent 1px borders, perfect alignment, considered empty space.
- **One signature move.** Each site gets one memorable idea: an oversized wordmark in the footer, a full-bleed photo that scrolls slower, a large serif number list, a sticky product image. Only one.
- **Buttons that look tailored.** Solid fill in ink or accent, generous padding (14px by 28px), either square (radius 0 to 4px) or a full pill. Secondary buttons are text links with an underline that grows on hover.
- **Icons sparingly.** Thin line icons (1.5px stroke) only where they help scanning. Never an icon on every heading.

## Do not (the generic AI look)
- Gradients of any kind, glowing blobs, aurora backgrounds, gradient text.
- Purple, blue and pink "tech" palettes by default; neon accents on near-black.
- Glassmorphism everywhere, frosted cards on busy backgrounds.
- Three identical rounded cards with an icon, a title and two lines, repeated down the page.
- Everything centered. Use left alignment for most text; center only short statements.
- Tiny all-caps labels above every heading, middle dots between every word, arrows after every link.
- Big fake stats ("10x faster", "99.9% uptime") without context; fake logos; testimonials from "Sarah J., CEO".
- Default fonts used without thought (Inter, Roboto, Arial, Space Grotesk, Poppins) as the display face.
- Emoji, sparkles, rocket icons, "✨ New".
- Drop shadows on everything, radius 16px on everything, hover lift on every card.
- Stock photos of handshakes, people pointing at laptops, or 3D blobs.

## Colour rules
- Background is never pure white or pure black: use a warm or cool off-white (#F4F1EA, #FAFAF8) or a soft black (#0E0E0E, #111214).
- Text colour has enough contrast (4.5:1) and is a deep neutral, not pure black on white.
- Accent appears on: the primary button, active states, one or two small marks. That is all.
- Dark sections inside a light site (and the opposite) are a strong, premium rhythm: one per page is enough.

## Type rules
- Display: a characterful serif (Cormorant Garamond, Fraunces, Instrument Serif, Bodoni Moda, DM Serif Display, Newsreader, EB Garamond) or a refined grotesk (Schibsted Grotesk, Hanken Grotesk, Familjen Grotesk, Archivo, Syne for bold brands).
- Text: a quiet sans (Manrope, Figtree, Hanken Grotesk, Onest, Jost, Instrument Sans) or the same family as display.
- Scale: 14 / 16 / 18 / 22 / 28 / 40 / 56 / 80 / 112px. Pick from it, nothing in between.
- Weights: display 400 to 500 for serifs, 500 to 700 for grotesks. Body 400. Never more than three weights on a page.
- Numbers: use tabular figures for prices and stats (`font-variant-numeric: tabular-nums`).

## Layout rhythm
- Section padding: `py-24 md:py-32 lg:py-40`.
- Page gutter: `px-5 sm:px-8 lg:px-12`, max width 1280 to 1440px.
- Vertical spacing between heading and body: 16 to 24px; between body and button: 32px.
- Alternate section layouts (split, full-bleed, list, grid) so the page has rhythm; never repeat the same layout three times in a row.

## Motion rules
Premium sites move. A static page looks like a template. Follow `motion.md`:
- On load: the headline rises word by word out of a mask, then the subline and buttons, then the hero image settles from a slow zoom.
- On scroll: headings rise in, images uncover like a curtain or drift slower than the page, list rows arrive one after another, numbers count up.
- One signature moment per site (intro curtain, sticky lookbook, pinned gallery, floating preview...).
- Hover: underlines draw in, images scale 1.05 slowly, buttons invert or lift 2px. No bouncing, no spinning.
- Reduced motion: everything visible at rest.
