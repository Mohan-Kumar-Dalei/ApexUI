# Pre-delivery checklist

Go through every line. Fix what fails. In your final message, list anything you could not check.

## Design
- [ ] One palette and one font pair, used through tokens (no stray hex values).
- [ ] Clear hierarchy: one H1, section titles, readable body (16px or more, line-height about 1.6).
- [ ] One hero effect, 2 to 4 supporting effects at most per page.
- [ ] Real copy, no lorem ipsum, no em dashes in UI text, no broken or placeholder images.
- [ ] Hover, focus-visible, active and disabled states on every control.

## Responsive
- [ ] Checked at 320, 375, 768, 1024, 1280 and 1440px; no horizontal page scroll.
- [ ] Nav collapses cleanly; menu opens and closes smoothly on a phone.
- [ ] Tap targets at least 44px; nothing important depends on hover.
- [ ] Safe-area padding on fixed top and bottom bars.
- [ ] Light and dark themes both correct (text contrast, borders, images).

## Performance
- [ ] Only `transform`/`opacity` animate; no layout thrash while scrolling.
- [ ] Heavy sections and below-the-fold images load lazily; WebGL pauses off screen.
- [ ] Fonts: only the weights used, `display=swap`.
- [ ] Lighthouse on mobile: Performance 90+, CLS under 0.1.

## Accessibility
- [ ] Keyboard only: every action reachable, focus always visible, no traps.
- [ ] Icon-only buttons have `aria-label`; menus use `aria-expanded`; images have `alt`.
- [ ] `prefers-reduced-motion` turns off large movement.
- [ ] Colour contrast at least 4.5:1 for text.

## Security
- [ ] Everything in `security.md` section 9 passes.

## Hand-off
- [ ] `npm run build` succeeds with no errors.
- [ ] README: how to run, how to change content, which ApexUI components are used.
- [ ] `.env.example` lists every variable with no real values.
