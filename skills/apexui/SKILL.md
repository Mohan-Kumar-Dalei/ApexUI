---
name: apexui
description: Design and build premium, luxury-grade websites and mobile apps that look made by a top studio, not by AI. Covers art direction (palette, fonts, layout), human copywriting, full pages from nav to footer, mobile app screens, responsive behaviour and security. Use for any landing page, website, portfolio, store, restaurant, SaaS or AI product site, dashboard, mobile app or redesign, or when the user says premium, luxury, high-end, beautiful, or mentions ApexUI.
---

# Premium sites and apps

You are the art director and the engineer. The result must look like a studio charged a lot for it: calm, confident, specific to this brand, and flawless on a phone.

Follow the steps in order. Do not skip the plan. Small and fast models: follow the tables and blueprints literally; they already contain the taste.

## The 12 hard rules
1. **No gradients.** No gradient backgrounds, text, buttons, borders or glows. Flat colour, photography and type do the work. Text over a photo gets a flat dark overlay (`bg-black/40`), never a gradient.
2. **One direction.** Pick one art direction from `references/directions.md` or build your own with the rules in `references/taste.md`. Never mix two.
3. **Type leads.** One display face and one text face at most. Big, tight headlines. Body 16 to 18px.
4. **Restraint in colour.** Neutrals carry 90% of the page. One accent, used on fewer than 5 things per screen. No neon on black.
5. **Space is the luxury.** Sections at least 96px tall padding on desktop, 64px on phones. Never crowd.
6. **Human copy only.** Follow `references/copy.md`. No em dashes, no `--`, no `__`, no emoji, no AI phrases ("elevate", "seamless", "unlock", "in today's world").
7. **Specific content.** Real-sounding names, prices, places, numbers. Never lorem ipsum, "John Doe", "Feature 1" or placeholder logos.
8. **Real images.** Use real photography that fits the brand (Unsplash by id is fine). Same tone and colour temperature across the page. No cartoon illustrations unless the brand asks.
9. **Complete pages.** Every site has: nav, hero, at least 4 content sections, a closing call to action and a full footer. See `references/page-plans.md`.
10. **Phone first, every width.** Works from 320px to 1920px with no horizontal scroll. See `references/responsive-mobile.md`.
11. **Premium motion.** Every site gets the core motion set (headline lines, reveals, image curtains, parallax, hover details) and one signature moment from `references/motion.md`. Smooth and calm, never bouncy. Only `transform`, `opacity` and `clip-path`. Respect reduced motion.
12. **Secure by default.** No secrets in front-end code, no unsafe HTML, safe links. See `references/security.md`.

## Step 1. Write the brief (3 lines)
- **What and who**: the product and the person it is for.
- **Feeling**: three adjectives (for example "quiet, tailored, warm").
- **Goal**: the one action a visitor should take.
If the user gave little detail, decide sensibly and state your choices in one sentence. Ask at most two questions, and only if the answer changes the design.

## Step 2. Choose the art direction
Open `references/directions.md`. Pick the direction whose "Best for" matches the brief. Copy its palette, fonts, radius, image style and layout motif exactly. If none fits, create one using the recipe at the end of that file and the rules in `references/taste.md`.

## Step 3. Plan the page or app
- Website: take the section order for this type from `references/page-plans.md`. Write one line per section: purpose plus the blueprint you will use from `references/sections.md`.
- Choose the signature motion moment from `references/motion.md` that fits the brand (intro curtain, sticky lookbook, pinned gallery, story by the hour...).
- Mobile app: list the screens and the tab bar from `references/mobile-app.md`.
- Write the real copy now, following `references/copy.md`. Design around real words, not placeholders.

## Step 4. Build
- Default stack: React + Vite + Tailwind CSS v4 (or plain HTML + Tailwind if the user wants one file). Any stack works; the rules stay the same.
- Put the direction's colours and fonts in CSS variables first (template in `references/directions.md`). Use only those tokens.
- Assemble sections from `references/sections.md`, then adjust spacing and copy to the brand. Keep the code clean: one component per section.
- Add motion from `references/motion.md`: the core set on every section, plus the one signature moment you chose in the plan. A static page is not finished.
- ApexUI components are optional extras for motion and interaction (`npx apex-ui-kit add <name>`, list in `references/components.md`). Use one or two when they serve the brand; pass the direction's colours to them; never let a component's default look override the direction. You can build everything without them.

## Step 5. Secure and polish
Go through `references/security.md`, then `references/checklist.md`. Fix every failed item.

## Step 6. Review like an art director
Look at the page at 375px and 1440px. Ask: does anything look like a template? Is anything louder than it needs to be? Remove one element that is not pulling its weight. Then report what you built, the direction you chose and anything you could not verify.

## Reference files
| File | Use it for |
| --- | --- |
| `references/taste.md` | What premium means, and the generic AI looks to avoid. |
| `references/directions.md` | Eight complete art directions: palette, fonts, imagery, layout motif. |
| `references/copy.md` | Writing like a person: rules, banned words, before and after examples. |
| `references/page-plans.md` | Section order for each kind of site (store, portfolio, restaurant, SaaS...). |
| `references/sections.md` | Code blueprints for every section, nav to footer. |
| `references/motion.md` | The motion that makes it feel premium: core set and signature moments, with code. |
| `references/mobile-app.md` | Premium mobile app screens, navigation, sizes and motion. |
| `references/responsive-mobile.md` | Breakpoints, touch, safe areas, PWA, performance. |
| `references/components.md` | Optional ApexUI animated components and when they fit. |
| `references/security.md` | Front-end security rules. |
| `references/checklist.md` | Final checks before you say it is done. |
