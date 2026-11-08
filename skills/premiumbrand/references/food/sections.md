# Food and snack playbook: sections

Reference build: **Lay's Crunch Lab** (demo at apex-ui.in/demos/lays). Use this playbook for chips, namkeen, biscuits, chocolate, drinks, sauces, spices, cereal, coffee, ice cream: anything sold in a pack, can, bottle or jar that comes in flavours.

The idea in one line: **the pack is the hero, and the flavour on show colours the whole page.** Every flavour has four colours (`colour`, `deep`, `glow`, `ink`); the hero carousel writes them to the root as CSS variables and every section reads them.

Working code for each section is in `templates/food/`. Copy it, then rename the brand, swap the catalogue and adjust the pack shape. Do not rebuild from scratch.

## Before you build
- **Real pack art only.** Ask the user for the front of every pack (PNG, straight on, about 600 x 960). If they point to their own site, save the images from it. Never draw a pack, a logo or a label yourself, and never use another brand's art for the user's brand.
- **Catalogue first.** Every flavour: `slug, name, category, short, colour, deep, glow, ink, text ('light'|'dark'), image, ingredient, note, fact, ingredients, sizes[{id, label, grams, price}]`. Pick `colour` from the pack itself; `deep` is the same hue much darker (ring background), `glow` a lighter warm version, `ink` the readable text colour on `colour`. Sample: `templates/food/server/catalogue.js`.
- **Fonts.** One very wide heavy display face with a width axis (Archivo `wdth 62..125`, `wght 400..900`) used two ways: `font-wide` (stretch 125%, weight 900, uppercase) for section titles and `font-cond` (stretch 68%, weight 800) for flavour names on cards. Inter for body, JetBrains Mono for the small spaced labels (`mono`). Utilities are in `templates/food/index.css`.

## The section kit (in this order)

### 0. Preloader (`components/Loader.jsx`)
A storm of chips crossing a canvas while the real work loads: fonts, the catalogue, every pack texture and every bag render. The big counter follows that work, not a timer. At 100 the centre chip gets seasoning, spins and bursts into crumbs, and the panel opens in a growing circle. Sets `document.documentElement.dataset.revealed = '1'` when gone.
**Prompt.** A storm of chips crossing the screen while everything really loads, with a big counter. At 100 the centre chip is seasoned, spins, bursts into crumbs and the panel opens in a circle.

### Frame and nav (`components/Nav.jsx`)
A thin frame round the viewport with plus marks in the corners (`Frame`). The real logo badge with the store name, a centred pill nav (Flavors, Inside, Shop, Range, Q&A, Join) whose current link fills, a sound toggle (WebAudio crunch, `lib/sound.js`), a basket with three dots that fill as packs go in, and a "First dibs" button. The pill turns light or dark with the section under it: every section has `data-tone="light|dark"` and the nav checks which section rect sits under y = 46 (never test the nav itself).

### 1. Hero carousel (`sections/Hero.jsx`, `three/ArcScene.jsx`)
All flavours as 3D bags on an arc: the middle one large, the rest stepping back and turned outwards. Behind them, concentric rings in the flavour's colours; on change the new rings sweep out from the centre with `clip-path: circle()` over the old ones and the page takes the new colour (`lib/theme.js` → `applyFlavor`). The flavour name in `font-wide` rises in line by line, an outlined index number sits bottom right with an autoplay toggle, round arrows under the middle bag, keyboard arrows, drag, and "Drag to browse · Click to zoom · Scroll to explore". Clicking the middle bag zooms it.
Notes: autoplay pauses while someone interacts and when the hero is off screen. ArcScene reads the active index from a ref (`live`) so it mounts on the current flavour after the loader, not on 0.

### 2. Inside, a pinned story (`sections/Inside.jsx`, `three/InsideScene.jsx`)
Pinned for four chapters (the bag, the potato, the fry, the seasoning; rename for the product). Chapter counter and bar, chapter label, a heavy two-line title and a paragraph. The bag turns and dollies with the scroll (`POSES`), three hotspots per chapter sit on the bag with lines to labels (`HOTSPOTS`, 3D points projected to DOM every frame), an icon rail on the right jumps to a chapter, a huge outlined word behind.

### 3. The storm (`Storm` in `sections/Inside.jsx`)
A sticky stage where chips fly across the screen with the scroll behind one big line ("Crunch time"). Sticky inner stage, not a GSAP pin, so it never jumps.

### 4. The Wall (`Wall` in `sections/Shop.jsx`)
"Grab a bag": a grid of tall cards in each flavour's colour with a dashed inner frame, the name in `font-cond`, the bag render, the price and a plus that adds the middle size. Cards tilt to the pointer and press down on click; chips pop up from behind the bag on hover. The bag pictures are renders of the same 3D bag (`three/shots.js`), made while the loader runs, so 2D and 3D always match.

### 5. Build your pack (`BuildBox` in `sections/Shop.jsx`)
"Build your 3 pack & save ₹12" on a dark ground: flavour tiles with counts, a round tray with three slots where bags drop in at an angle and a cross takes them out, drag a tile into the tray too, and "Add to basket" with the struck-through price once the tray is full. The server prices every full set of three at 20% off (`templates/food/server/pricing.js`, `PICK3`); the client never computes the discount. Put the button in `relative z-10` so the tray circle never covers it.

### 6. The Rack (`sections/Rack.jsx`, `three/RackScene.jsx`)
"Pick your crunch": every bag on a hook on one chrome rod with a number tag; under each, its number, name and "Taste it". Drag the rail or the ruler wheel underneath (major tick per flavour, numbers, an orange marker). Brushing the bags makes them swing like pendulums; tapping one spins it on its hook. Tags and captions are DOM, placed every frame from projected 3D points through a `tags` ref (`{ tag, cap }`).

### 7. Lifted detail (`components/LiftedDetail.jsx`, `three/LiftedView.jsx`)
"Taste it" lifts the bag into the centre over a blurred page: front and back toggle, pack sizes, ingredients, the note, add to basket, arrows to the next flavour, Escape to close.

### 8. Q&A, Join, footer (`sections/Closing.jsx`)
Honest answers (sizes, delivery, allergens, the pack offer), a monthly letter signup, a full footer. Both sections carry `id` and `data-tone`.

### Pages
Checkout with a server-priced bill, coupon, delivery check by pincode and COD or UPI; order confirmation; track an order by number and phone (POST, so the phone stays out of URLs). Templates: copy `pages/` from the reference build if you need them, the shapes are in `templates/food/server/routes.js`.

## Backend
Node + Express with zod (`templates/food/server/`): `GET /products` (with `pick3` and rules), `GET /delivery?pincode`, `POST /quote`, `POST /orders` (stock taken for every line or none), `POST /orders/lookup`, `POST /newsletter`. A JSON-file store is enough for a brand site; use MongoDB (`references/backend.md`) when the user needs accounts. For a static demo host, `templates/food/lib/mock.js` runs the same routes in the browser, reusing the server's own `catalogue.js` and `pricing.js`; `lib/api.js` switches to it when `VITE_DEMO=1`.

## Check
Puppeteer: wait for `data-revealed`, shoot every section at 1440 and 390, use the arrows, the Wall plus, a full 3 pack, "Taste it" and the basket (it must show the 3 pack saving), and check for console errors and horizontal scroll.

## Attribution
If the build uses a real brand's art for a portfolio piece, the README says so in one line ("Pack art and logo belong to X; used here only to show the design").
