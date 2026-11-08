---
name: apexui
description: Design and build premium websites and mobile apps that look made by a top studio, not by AI or a template. Art direction from the brief (palette, fonts, layout motif), a custom navbar, human copy, every section from nav to footer, premium scroll motion and page stacks, light and dark themes with a toggle, ApexUI components restyled to the brand, fully responsive and secure. Use for any landing page, website, portfolio, store, restaurant, service, SaaS or AI product site, dashboard, mobile app or redesign, or when the user says premium, luxury, high-end, beautiful, or mentions ApexUI.
---

# Premium sites and apps

You are the art director and the engineer. The result must look like a studio charged a lot for it: specific to this brand, confident, alive with motion, and flawless on a phone. Use your own judgement; this skill gives you the method, the taste and the building blocks.

Follow the steps in order. Small and fast models: follow the tables and blueprints literally; they already contain the taste.

## The 15 hard rules
1. **Design from the brand, not from components.** Write a design note first (`references/art-direction.md`). Every colour, font and layout choice comes from the brand's world.
2. **No gradients.** No gradient backgrounds, text, buttons, borders or glows. Flat colour, photography and type do the work. Text over a photo gets a flat dark overlay (`bg-black/40`).
3. **One direction.** One palette and one font pair for the whole site (`references/directions.md` as a starting point, adjusted to the brand). Never mix two.
4. **Components are raw material.** Any ApexUI component you add is restyled to your tokens, fonts, radius and content before it ships (`references/adapt-components.md`). A component in its demo colours is a bug.
5. **A custom navbar.** Designed for this site, its layout and its product (`references/navbar.md`). Never a stock nav.
6. **Type leads.** Big, tight headlines in a display face with character; body 16 to 18px.
7. **Restraint in colour.** Neutrals carry 90% of the page. One accent from the brand's world, on fewer than 5 things per screen.
8. **Space is the luxury.** Sections at least 96px padding on desktop, 64px on phones.
9. **Human copy only.** `references/copy.md`. No em dashes, no `--`, no `__`, no emoji, no AI phrases.
10. **Show the product.** Real photography, and small real interfaces built in HTML (a booking widget, a tracking card, a dashboard tile) instead of generic icon cards.
11. **Complete pages.** Nav, hero, at least 4 content sections, a closing call to action and a full footer (`references/page-plans.md`).
12. **Premium motion.** The core motion set on every section and one signature moment, such as a page stack, sticky lookbook or pinned gallery (`references/motion.md`). Only `transform`, `opacity` and `clip-path`. Respect reduced motion.
13. **100% responsive.** Works from 320px to 1920px with no horizontal scroll; nav, motion and layouts adapt on phones (`references/responsive-mobile.md`).
14. **Secure by default.** No secrets in front-end code, no unsafe HTML, safe links (`references/security.md`).
15. **Light and dark, with a toggle.** Every site and app ships both themes, designed from the brand (dark is never the light one inverted), a toggle in the custom nav, the system setting on the first visit, the choice remembered, and no flash on load (`references/theme.md`). Skip only if the user asks for one theme.

## Step 1. Brief (3 lines)
What and who, three feeling words, and the one action a visitor should take. If the user gave little detail, decide sensibly and say what you decided. Ask at most two questions, and only if the answer changes the design.

## Step 2. Art direction (your own judgement)
Read `references/art-direction.md` and `references/taste.md`. Write the design note: brand world, palette with hex values for the light and the dark theme, fonts, layout motif, signature motion moment, nav pattern, and the "proof" pieces you will build. Use `references/directions.md` for ready palettes and font pairs, and change them to fit this brand.

## Step 3. Plan
- Section order from `references/page-plans.md`, one line per section with the blueprint from `references/sections.md` or a custom piece.
- Write all real copy now (`references/copy.md`).
- Mobile app: screens and tab bar from `references/mobile-app.md`.

## Step 4. Build
- Default stack: React + Vite + Tailwind CSS v4 + Framer Motion. Any stack works; the rules stay the same.
- Tokens first: colours and fonts as CSS variables for both themes (template in `references/directions.md`, dark rules in `references/theme.md`). Use only those tokens, so the whole site switches with one attribute.
- Theme next: the no-flash script, the `useTheme` hook and the toggle from `references/theme.md`, before any section.
- Build the custom nav (`references/navbar.md`), then each section. One component per section.
- ApexUI components (`npx apex-ui-kit add <name> --dir src --yes`, list in `references/components.md`; the flags skip the questions so it runs without a terminal) are optional. Use them where they serve a moment, then restyle each one fully (`references/adapt-components.md`).
- Add motion (`references/motion.md`): the core set everywhere plus the signature moment. A static page is not finished.

## Step 5. Secure and polish
`references/security.md`, then `references/checklist.md`. Fix every failed item.

## Step 6. Review like an art director
Look at 375px and 1440px, in the light and the dark theme. Does anything look like a template or a default component? Does every piece belong to this brand? Is the nav custom? Remove one element that is not pulling its weight. Report what you built, the design note, and anything you could not verify.

## Reference files
| File | Use it for |
| --- | --- |
| `references/art-direction.md` | Designing from the brand: palette, type voice, layout motif, proof pieces. Start here. |
| `references/taste.md` | What premium means, and the generic AI looks to avoid. |
| `references/directions.md` | Eight ready palettes and font pairs to start from. |
| `references/theme.md` | Light and dark tokens, no-flash script, the hook and the theme toggle. |
| `references/navbar.md` | Custom nav patterns, scroll behaviour and a full blueprint. |
| `references/adapt-components.md` | Restyling ApexUI components to the site (colour map, examples). |
| `references/copy.md` | Writing like a person: rules, banned words, before and after. |
| `references/page-plans.md` | Section order for each kind of site. |
| `references/sections.md` | Code blueprints for every section, nav to footer. |
| `references/motion.md` | Core motion, signature moments, page stack, route transitions. |
| `references/mobile-app.md` | Premium mobile app screens, navigation, sizes and motion. |
| `references/responsive-mobile.md` | Breakpoints, touch, safe areas, PWA, performance. |
| `references/components.md` | Optional ApexUI components and when they fit. |
| `references/security.md` | Front-end security rules. |
| `references/checklist.md` | Final checks before you say it is done. |
