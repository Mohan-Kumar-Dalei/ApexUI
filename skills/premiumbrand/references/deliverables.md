# Ship like a case study

The site is half the delivery. The other half shows how it was made, so the work can be judged and repeated.

## README.md
```markdown
# BRAND · What it sells

<p>
<img src="screenshots/01-hero.png" width="49%">
<img src="screenshots/02-....png" width="49%">
...
</p>

Prompts: [PROMPTS.md](PROMPTS.md) · Process: [HOW-WE-MADE.md](HOW-WE-MADE.md)

## Run it
(server and client commands, ports, .env, how to rebuild the 3D models)
```

## PROMPTS.md
One section per page section, each a short plain paragraph: what it shows, how it moves, what happens on click. Write them after the build so they describe what really shipped. Include one for the backend.

## HOW-WE-MADE.md
Numbered, one bold label and two sentences each: brand idea, references, stack, 3D assets (what was generated or modelled and how it was compressed), prompting section by section in three rounds, house style, images, backend, check and polish. Then a **Tools** line. Say plainly what was replaced and why (for example, "Tripo AI needs an account, so the rail was modelled in code").

## screenshots/
Numbered by order on the page: `01-hero.png`, `02-...` at 1440 by 900, one per section, plus the detail views (the lifted product, the bag with a coupon) and two phone shots at 390 wide. Take them with a script (Puppeteer) after the loader has finished and each section has settled, so they can be retaken after every change.

## Checklist before you hand over
- [ ] Style sentence and direction written; one palette, one font pair, no gradients unless the direction demands them.
- [ ] Every section in the kit adapted to the products; nothing left with saree words if the brand sells something else.
- [ ] 3D: named parts, UVs kept, meshopt, lazy loaded, paused off screen, framed on phones.
- [ ] Bag, quote, checkout and orders priced on the server; bundles and sizes enforced there.
- [ ] Full order flow run end to end; no console errors; no horizontal scroll at 320 to 1440.
- [ ] Copy: no em dashes, no "--", no emoji, no invented reviews or people.
- [ ] README, PROMPTS, HOW-WE-MADE and screenshots in the project.
