# Pre-delivery checklist

Go through every line. Fix what fails. In your final message, say which direction you used and list anything you could not check.

## Taste
- [ ] One art direction, used through tokens. No stray colours, no second accent.
- [ ] Zero gradients anywhere (search the code for `gradient`, `from-`, `via-`, `to-`, `bg-clip-text`).
- [ ] At most two font families and three weights. Display face on headings only.
- [ ] No identical card grids repeated down the page; sections alternate layout.
- [ ] Images share one mood and colour temperature; every image has a purpose and `alt` text.
- [ ] One signature move, and nothing louder than it.

## Copy
- [ ] No `—`, `–` used as a pause, `--`, `__`, emoji or exclamation marks in headlines.
- [ ] None of the banned phrases from `copy.md`.
- [ ] Real names, prices, places and honest numbers; no lorem ipsum or "John Doe".
- [ ] Every button says its action.

## Completeness
- [ ] Nav, hero, at least four content sections, closing call to action, full footer.
- [ ] Footer has contact or address, useful links, legal line.
- [ ] Forms have labels, validation and a success state.

## Responsive
- [ ] Checked at 320, 375, 768, 1024, 1280 and 1440px; no horizontal scroll at any width.
- [ ] Nav collapses to a working menu on phones; tap targets at least 44px.
- [ ] Headline sizes step down on phones (no word broken mid-way, no overflow).
- [ ] Safe-area padding on fixed bars (mobile apps).

## Performance and accessibility
- [ ] Core motion on every section (headline lines, reveals, image curtains or parallax) and exactly one signature moment.
- [ ] Only `transform`, `opacity` and `clip-path` animate; reveals play once; reduced motion respected.
- [ ] Images lazy-loaded below the fold with fixed aspect ratios (no layout shift).
- [ ] Keyboard: every action reachable, focus visible. Contrast 4.5:1 for text.
- [ ] Fonts loaded with `display=swap`, only the weights used.

## Security
- [ ] Everything in `security.md` section 9 passes.

## Hand-off
- [ ] `npm run build` succeeds.
- [ ] README: how to run, where to change copy, colours and images.
