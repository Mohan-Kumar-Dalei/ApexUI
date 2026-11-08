---
name: luxurypremium
description: Luxury premium websites. Warm neutrals (ivory, charcoal), a serif display face with one sans, generous space, big type, slow considered motion. Run it as /luxurypremium followed by what to build.
argument-hint: [what to build]
disable-model-invocation: true
---

# Luxury premium

Build: $ARGUMENTS

This is the luxury mode of the `apexui` skill: a marketing website or brand site that should feel like a fashion house, a boutique hotel or a watchmaker. Every apexui website rule applies (design note, custom navbar, hero, full pages, signature motion, human copy, restyled components, 100% responsive). This file sets the luxury recipe on top of it.

## Read first
The full method lives in the `apexui` skill installed next to this one. Read its `SKILL.md`, then these references from its `references/` folder (in Claude Code: `.claude/skills/apexui/references/`; in Antigravity: `.agents/skills/apexui/references/`):
`art-direction.md`, `taste.md`, `theme.md`, `navbar.md`, `motion.md`, `sections.md`, `copy.md`, `adapt-components.md`, `responsive-mobile.md`, `checklist.md`.
If the apexui skill is missing, install it with `npx apex-ui-kit skill apexui`.

## The luxury recipe
**Palette (warm neutrals, flat, no gradients).** Start from this and adjust to the brand's world:
| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#F4F0E8` ivory | page |
| `surface` | `#EBE5D9` | alternate bands, image placeholders |
| `ink` | `#1C1A17` charcoal | text, primary button |
| `muted` | `#6E675C` | secondary text |
| `line` | `#D9D1C2` | hairlines |
| `accent` | one quiet colour from the brand (oxblood `#5B1A18`, bronze `#8A6A3F`, deep green `#2F3B2F`) | fewer than 5 uses per screen |
One dark band per page in `ink` with `bg` text gives rhythm.

**Dark theme (required, never inverted).** Night version of the same house: bg `#14120F`, surface `#1D1A16`, ink `#EDE7DC`, muted `#A39A8C`, line `#2E2A24`, accent lifted so it reads on dark (oxblood to `#B4544C`, bronze to `#C29A63`, green to `#7F9A7C`). The dark band becomes a `surface` band. Photos unchanged. A quiet theme toggle sits in the nav (an icon button in ink, no pill), the first visit follows the system, and there is no flash on load. Script, hook and toggle: `theme.md` in the apexui references.

**Type.** A serif display face (Bodoni Moda, Cormorant Garamond, Instrument Serif, Fraunces, Italiana) with one quiet sans (Hanken Grotesk, Manrope, Jost, Figtree). Headlines 64 to 128px on desktop, 44 to 56px on phones, weight 400, tracking `-0.02em`, line height 1.0. Body 17 to 18px, line height 1.65. Small uppercase labels only as a consistent system, tracked `0.14em`.

**Space.** More than feels necessary: sections `py-28 md:py-40 lg:py-48`, text columns no wider than 34 to 38rem, wide margins, one idea per screen.

**Images.** Large, calm, one colour temperature, 4:5 portraits or full-bleed. Text over images only with a flat `bg-black/30` overlay.

**Shape.** Radius 0 for images and buttons (or full pills for a softer brand, never in between). Hairlines instead of cards. No shadows except one soft one on floating elements.

**Motion (slow and considered).** Reveals 700ms, image curtains and settles 1.1 to 1.6s, hovers 400 to 600ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`. Use the full core set from `motion.md` and one signature moment that fits luxury: intro curtain, sticky lookbook, slow parallax full-bleed, or a pinned gallery. Nothing fast, nothing bouncy.

**Navbar.** Store bar (logo centered) for retail, editorial line or minimal plus overlay menu for houses and hotels (see `navbar.md`). Thin, quiet, with a filled CTA in ink.

**Copy.** Few words, exact details (materials, places, hours, prices). No superlatives, no "luxury" or "premium" in the copy; let the page prove it.

## Done means
The apexui checklist passes (both themes), plus: serif display face on every heading, warm neutral palette with a single accent, at least 112px section padding on desktop, no reveal shorter than 600ms, and the site works from 320px up.
