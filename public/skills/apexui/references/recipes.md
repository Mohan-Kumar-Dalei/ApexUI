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
