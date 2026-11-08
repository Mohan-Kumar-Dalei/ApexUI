---
name: premiumbrand
description: A premium brand store with a 3D showroom, built from a playbook for the brand's category (fashion and sarees like Taana, food and snacks like Lay's Crunch Lab), with a real Node.js + Express backend and a README, PROMPTS, HOW-WE-MADE and screenshots. Run it as /premiumbrand followed by the brand and what it sells.
argument-hint: [brand and what it sells]
disable-model-invocation: true
---

# Premium brand store

Build: $ARGUMENTS

This skill builds the kind of site a premium label would commission: a brand store where the products are the show. It follows a fixed workflow (references, stack, visuals and 3D, three build rounds, borrowed components, backend, ship) and a proven section kit per category.

## Step zero: pick the playbook
Read the brand and what it sells, then follow exactly one playbook. Each one is a complete site that has been built and checked; swap the products and keep the method.

| The brand sells | Playbook | Reference build | Read |
| --- | --- | --- | --- |
| Sarees, clothing, fabric, jewellery, bags, shoes, anything worn | **Fashion** | Taana, a handwoven saree house (apex-ui.in/demos/taana) | `references/fashion/sections.md`, `references/fashion/three-d.md`, `templates/fashion/` |
| Chips, snacks, biscuits, chocolate, drinks, sauces, spices, coffee, anything in a pack with flavours | **Food** | Lay's Crunch Lab (apex-ui.in/demos/lays) | `references/food/sections.md`, `references/food/three-d.md`, `templates/food/` |

If the category fits neither, use the closer one and say which you picked and why. New playbooks are added as `references/<category>/` and `templates/<category>/`; when one exists for the brand's category, use it. The phases and rules below apply to every playbook; the section kit below is the Fashion one, and the Food kit is in `references/food/sections.md`.

## Rules
1. **Brand first.** Write one sentence of style before anything else (Phase 01). Pick one direction: Minimal luxury, Modern product, Vintage editorial or Dark futuristic. Never mix two.
2. **One palette, one font pair.** Neutrals carry the page, one accent from the brand's world, one gold or metal tone for small marks only. A display serif with character plus a calm sans.
3. **The products are the show.** Real photography and the brand's real pack art where they exist (ask the user for them; never draw a logo or a label yourself), and 3D where photography cannot do it (a rail of garments, a shelf of shoes, a tray of rings, a room of furniture).
4. **Everything you sell can be bought.** Every card, look piece and 3D item has an add to bag. Prices always come from the server.
5. **Human copy.** Plain sentences with real details (towns, days, materials, sizes). No em dashes, no "--", no emoji, no buzzwords, no fake reviews or "built by" people.
6. **Motion is quiet.** Lenis smooth scroll, GSAP ScrollTrigger reveals, one pinned 3D moment. Respect reduced motion.
7. **100% responsive.** 320px to 1920px with no horizontal scroll. 3D scenes reframe on phones; carousels become swipe rows.
8. **Secure by default.** Server-side prices and stock, validated input, httpOnly session cookies, rate limits, no secrets in the client.
9. **Original work.** Take only the interaction idea from any reference. Never copy another site's code, brand, images or text.

## Phase 01. References (do not skip)
Write the brand in one sentence ("a minimal luxury saree house where the hero is a temple photograph and the collection hangs on a 3D rail"). Collect 5 to 8 references and keep only the idea from each: mood, type, layout, interaction. Record them in HOW-WE-MADE.md.

## Phase 02. Stack
- Frontend: **React + Vite**, Tailwind CSS v4, **Lenis**, **GSAP + ScrollTrigger**, **Three.js**, framer-motion for small UI motion, lucide-react icons.
- Components: 2 or 3 **Magic UI** pieces (Marquee, Number Ticker, Blur Fade) installed with the shadcn CLI and restyled to the brand. More than three styles makes a site feel inconsistent.
- Backend: **Node.js + Express + MongoDB** (Mongoose, zod, bcryptjs, jsonwebtoken, helmet, express-rate-limit). Local development can run MongoDB through mongodb-memory-server when no MONGO_URI is set.
- Layout: `client/` and `server/`; Vite proxies `/api` to the server so cookies stay same-site.

## Phase 03. Visuals and 3D
- Hero: one full-bleed photograph with a flat dark overlay. Product photos: one mood and colour temperature.
- 3D: models are written in code at real-world scale (metres) with **named parts**, exported to GLB and compressed with **meshopt**. If the user has Tripo AI or Blender assets, use them through the same loader. Fashion: `templates/fashion/gltf-kit.mjs` and `templates/fashion/build-rail.mjs`, method in `references/fashion/three-d.md`. Food: packs modelled in code with the brand's real pack art as the texture, `templates/food/three/kit.js`, method in `references/food/three-d.md`.
- Textures that change per product (cloth colour, leather, metal) are painted on a canvas at runtime and applied by part name.

## Phase 04. Build in three rounds
1. **Structure**: every section, spacing, grid and type. No animation. Screenshot it.
2. **Motion**: the 3D scenes, Lenis + GSAP scroll, section reveals, carousels (`references/motion.md`).
3. **Polish**: buttons, contrast, hover states, micro-interactions, empty and error states.
Do not restart when something looks wrong; say what is wrong and fix that part.

## Fashion section kit (home page, in this order)
Full blueprints and the one-paragraph prompt for each are in `references/fashion/sections.md`. For food brands, use `references/food/sections.md` instead.
1. **Hero**: full-bleed photo, glass pill nav floating on top, small glass label, huge headline, two pill buttons with arrow circles, a running ticker strip of section names at the bottom.
2. **Collections in arch windows**: six moods or categories, each in a framed arch with a small finial.
3. **Try the look**: styled looks on a stage (centre sharp, sides stepping back and blurred) with an "In this look" panel where each piece can be bought alone, or the whole look at a bundle discount the server checks.
4. **Pick a [product]**: a fan of tall cards in each product's own colour that tilt to the cursor, with a plus that drops the item into the bag.
5. **Inside the workshop (3D)**: the place where it is made, pinned, the camera gliding through it in chapters as you scroll.
6. **Numbers**: four honest numbers with a ticker count.
7. **Everything on the rail (3D)**: every product on a 3D rail, shelf or plinth row with filter chips and counts; hover brings one forward; drag to walk along.
8. **Lifted detail**: clicking a product lifts it off the rail into the centre over a blurred page, with Front/Back, sizes, "Select a size" and a heart.
9. **Worn, not posed**: a framed slideshow with corner brackets between two columns of photos moving in opposite directions.
10. **The feature edit** (bridal, festive, limited): arch cards on a curved carousel with the centre one framed in gold.
11. **Before you buy**: a video call or visit booking band. Then care questions, a letter signup, a full footer.
Other pages: shop with filters in the URL and skeletons, product page (gallery, options with sizes, delivery check), checkout with server-priced bill and coupons, order confirmation, account (sign in, orders, track an order), booking page.

## Phase 06. Backend
Only as much as the project needs (`references/backend.md`): a brand site with a contact form needs one route; a store needs catalogue, filters, quote, orders with stock, accounts, bookings and a newsletter. Pricing templates: `templates/fashion/pricing.js` (look bundles) and `templates/food/server/pricing.js` (build-your-3-pack).

## Phase 07. Ship like a case study
Deliver the site plus the package in `references/deliverables.md`: README with a screenshot grid and run steps, PROMPTS.md (one plain prompt per section), HOW-WE-MADE.md (the phases as they happened, tools, what was replaced and why), and `screenshots/` of every section at 1440px and the phone view.

## Done means
- Both servers start; the full order flow works end to end (sign up, filter, add with size, look bundle, coupon, checkout errors, order, my orders, booking) with no console errors.
- No horizontal scroll at 320, 390, 768, 1024 and 1440px; 3D scenes keep the products in frame on phones.
- No prices computed only in the browser; every input validated on the server.
- README, PROMPTS, HOW-WE-MADE and screenshots are in the project. Report what you built and anything you could not check.
