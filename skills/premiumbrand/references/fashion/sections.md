# The section kit

Each section has a prompt (what to build, in plain sentences) and notes from the reference build. Replace the saree words with the brand's products: a rail of garments can be a shelf of shoes, a tray of rings or a row of chairs.

## Phase 01 worksheet
- Style sentence: "a [direction] [what it sells] house where [the signature moment]".
- Direction (pick one): Minimal luxury, Modern product, Vintage editorial, Dark futuristic.
- Palette: bg (off-white or soft black), surface, card, ink, muted, line, one accent from the brand's world (kumkum red, indigo, olive, oxblood), one metal tone (zari gold, brass, silver) for small marks.
- Fonts: a display serif with character (Gloock, Fraunces, Instrument Serif, Bodoni Moda, Cormorant) plus a calm sans (Instrument Sans, Manrope, Figtree, Hanken Grotesk).
- References: 5 to 8, one line each on the idea you keep.

## 1. Hero
**Prompt.** Full-bleed photo of the product being worn or used in a place that says the brand's world, with a flat dark overlay (`bg-black/35`, plus `bg-black/20` on the text half). The photo settles from a slow zoom (scale 1.12 to 1 over 2.6s) and drifts down on scroll. A glass pill navbar floats on top: wordmark with a small spaced subtitle, section links with the current one in a gold pill, wishlist and bag circles with counts, and an accent pill CTA with a white arrow circle; it becomes ivory glass once the page scrolls past the hero. A small glass label ("Town · Material · Craft"), the headline in very large white serif (max 15 characters a line), one line of copy, two pill buttons (accent, white) each with an arrow in a circle that turns 45 degrees on hover. A ticker strip at the bottom runs gold section names, each with a short line.

**Notes.** Hide the first word of the label on phones so it fits one line. The hero photo should not repeat as the first item of any carousel on the page. The nav hides on scroll down and returns on scroll up.

## 2. Collections in arch windows
**Prompt.** "Six moods, one [workshop]." with the second half in accent italic. Six photos inside tall arches (`rounded-t-full`), each with a thin accent outer frame (`p-1.5 border`), a small diamond finial above, the mood in spaced capitals and the category under it. Arches lift 8px on hover and the photo zooms slowly. Link each to the filtered shop.

## 3. Try the look
**Prompt.** "Try the look." Eight styled looks on a light stage. The centre look is tall and sharp; the others step back (translate 78% per step, scale down 17% per step, blur 2.5px per step, fade) and are clickable. Drag, swipe, horizontal wheel and round arrows move it. Under the stage: a thin progress line with a moving segment, "3 of 8 · Product name", "Swipe or drag". On the right an "In this look" panel: every piece with a thumbnail, a small "BRAND · TYPE" label, name, price, heart and plus to buy it alone; the main product's options (sizes 34 to 42 for a stitched blouse, or shoe sizes, ring sizes) as chips. At the bottom "Complete the look, all N pieces · save 10%" with the full price struck through, and "Add full look to bag".

**Notes.** Looks live on the server (`GET /api/looks`) as `{ id, photo, product, pieces[] }`. The bag sends `look: id` on each piece; the server gives the bundle discount only when every piece of that look is present (see `templates/fashion/pricing.js`). Ask for the size before adding the whole look.

## 4. Pick a [product]
**Prompt.** A fan of tall cards (270 by 430px), each in the product's own colour, fanned with `rotate((i - mid) * 5deg) translateY((i - mid)^2 * 7px)` on desktop and a snap swipe row on phones. The product name in the serif at the top, the photo in an arched window, the price bottom left, a heart top right, and a round ink plus bottom right that adds to the bag and turns into a tick. Cards tilt toward the cursor (rotateX/Y up to 7 degrees, spring) and press down on click. Use dark text on light colours and light text on dark ones.

## 5. Inside the workshop (3D)
**Prompt.** A pinned 3D room where the product is made (a loom, a cobbler's bench, a goldsmith's table, a kitchen). The section is N screens tall; the canvas is `sticky top-0 h-svh`; N chapter cards scroll over it. GSAP ScrollTrigger scrubs a progress value from 0 to N-1 and the camera glides along a CatmullRom path through N stations, easing toward it every frame, with a small breath and pointer parallax. Chapter cards rise in as they arrive.

**Notes.** Lazy load the scene. Warm window light (directional with soft shadows plus hemisphere). Check every station: no camera inside furniture.

## 6. Numbers
Four honest numbers (looms, towns, days, hours to dispatch) with Magic UI Number Ticker, Indian digit grouping where relevant.

## 7. Everything on the rail (3D)
**Prompt.** "Every [product], on the rail." A thin chrome rod with ball ends; every product on its own fixture (wide wooden hanger with sloping shoulders and a chrome hook for garments; a shelf for shoes; a velvet tray for jewellery; plinths for objects), painted in its own colour. Space them apart; the one nearest the middle of the view, or under the pointer, steps forward and grows 12%, and its name and price show under the rail in spaced capitals. Filter chips with counts slide items off the end and resize the rod. Drag to walk along; round arrows at the sides; on phones about two show at once.

**Notes.** One template mesh per fixture, cloned per product; colour from a canvas texture per product (`templates/fashion/textures.js`). Hit-test with a Raycaster on the product meshes only. Only one WebGL renderer per scene; pause rendering when off screen. Template: `templates/fashion/RailScene.jsx`.

## 8. Lifted detail
**Prompt.** Clicking a product lifts it off the rail: it drops into the centre on its fixture, larger, and settles with a small swing while the whole page blurs (`fixed inset-0 bg-bg/70 backdrop-blur-xl`). Below: the name in spaced capitals, price and one fact, a Front / Back toggle that turns it in 3D, size chips, a "Select a size" button that becomes "Add to bag, size 36", a heart and a link to the full page. Arrows move along the rail; Close and Escape put it back. Template: `templates/fashion/LiftedView.jsx`.

## 9. Worn, not posed
**Prompt.** "Feel the [material]." A 16:9 slideshow inside a thin frame with accent corner brackets; each photo settles from a slow zoom and cross-fades, with a caption of where it was worn, progress dots and a Pause pill. Two columns of photos run vertically in opposite directions on each side (Magic UI Marquee, vertical, hidden on phones). A "Shop the collection" button below.

## 10. The feature edit
**Prompt.** On the ink band: arch-topped cards on a curved carousel (rotateY -24 degrees per step, translateZ back, fade). The centre card stands upright in a gold frame; scarce ones carry "Only 2 left". Under it the name, material, one fact and the price in gold; previous, Add to bag, heart, next.

## 11. Before you buy, questions, letter, footer
A booking band (video call or visit) with a photo that opens like a curtain and a floating "Next free slot" card. Care and questions as hairline accordion rows. A monthly letter signup that posts to the API and shows a plain success line. A full footer on the ink band: brand line, contact, three link columns, legal line saying the products are sample data if it is a demo.

## Other pages
- **Shop**: filters (category, colour swatches, price ranges) kept in the URL, search with a 350ms pause, sort, skeleton cards while loading, an honest empty state, a filter sheet on phones.
- **Product**: gallery with thumbnails, the story, facts, option cards, size chips that appear when needed, a pincode or postcode delivery check, related products.
- **Checkout**: delivery fields with the same validation as the server, payment choice, a server-priced bill (subtotal, services, look discount, coupon, shipping), clear errors.
- **Account**: sign in or create account in one tabbed form, orders with a status bar, track an order by number and phone (POST, never in the URL).
- **Booking**: day chips for the next 14 days, time slots from the server that cannot be double booked, a confirmation in place.
