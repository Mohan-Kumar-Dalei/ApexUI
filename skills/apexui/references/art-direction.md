# Art direction: thinking like a designer

The directions in `directions.md` are starting points, not templates. Premium sites look like they could only belong to one brand. Use your own judgement with this process before you write any code.

## 1. Build the brand world (5 minutes of thinking, written as notes)
List what the brand is made of in the real world:
- **Materials and places**: wool and stone, charcoal and river light, steel and blueprints, WhatsApp chats and toolboxes.
- **The people**: who uses it, what they worry about, what would make them trust it.
- **The proof**: what can the page show instead of claim? A live tracking card, a real menu, a code snippet, a before and after, prices.

## 2. Take the palette from that world
- Background: the colour of the place (warm paper for a bakery, deep navy for a night service, off-white for a studio).
- Accent: one colour that already exists in the brand world (the WhatsApp green of a service that books on WhatsApp, the olive of an olive oil, the brass of a watch). Use it on fewer than five things per screen.
- Check contrast. Write the tokens (`bg`, `surface`, `ink`, `muted`, `line`, `accent`, `on-accent`).

## 3. Give it a voice in type
- Serif for heritage, food, fashion, editorial. Grotesk for tools, services, tech. Mono only as a small accent (labels, numbers, code) for developer or technical brands.
- One display face with character, one quiet text face.

## 4. Choose a layout motif (the thing people remember)
| Motif | Feels | How |
| --- | --- | --- |
| **Grid rails** | Precise, crafted, technical | The page sits inside visible 1px rails (`border-x border-line`), sections separated by full-width rules, small crosshair marks (`+`) at rule crossings, section index labels ("02 Experience" left, "Since 2024" right). |
| **Editorial index** | Calm, confident | Big serif titles in a numbered list with year or place on the right; images appear on hover or inline on phones. |
| **Stacked panels** | Process, service, story | Sticky cards that pile up as you scroll, big numerals (see `motion.md`, page stack). |
| **Product in the page** | Apps, services, SaaS | Small real interfaces built in HTML: a tracking card, a booking widget, a chat bubble, a dashboard tile, a now-playing card. They prove the product better than icons. |
| **Full-bleed story** | Hospitality, fashion, travel | Photography edge to edge, short lines of type over flat overlays, sticky image chapters. |
| **Big type** | Agencies, events | Headlines that run edge to edge, thick rules, very few images. |

## 5. Design the moments
- The hero: what is the one sentence and the one image or interface that make someone stay?
- The signature motion moment (see `motion.md`).
- The custom nav (see `navbar.md`).
- The footer: something to remember (a giant wordmark, a map line, opening hours, a sign-off).

## 6. Write it down before coding
A design note of 8 to 10 lines: brand world, palette with hex values, fonts, layout motif, signature moment, nav pattern, the "proof" pieces you will build. Then build exactly that.

## Patterns worth borrowing (examples of the level to aim for)
- **A local repair service, dark navy with WhatsApp green**: hero with a real team photo and a short honest headline; a live "your engineer is on the way" card built in HTML; services in tabs with an icon list of faults; process as stacked cards with big numbers; a band of plain numbers (4 services, 25 km, 0 rupees call-out); nav with a location picker and a "Book on WhatsApp" button.
- **A developer portfolio, warm off-white with a deep green dot**: grid rails and crosshairs; a profile card with live local time and availability; numbered sections with right-aligned meta; projects as image cards with stack tags in mono; a small "now playing" widget; testimonials as three quiet columns; a writing list with dates.
- **A fashion label, ivory and black**: full-bleed campaign hero, marquee of facts, product grid without borders, sticky lookbook, giant wordmark footer.

Never copy a real site. Borrow the level of care: every piece of the page belongs to this brand.

## Using ApexUI components inside this
Pick components only after the design note exists, only where they serve a moment, and always restyle them (`adapt-components.md`). If nothing fits, build it from `sections.md`.
