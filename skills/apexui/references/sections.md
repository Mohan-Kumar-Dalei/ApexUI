# Section blueprints

React + Tailwind CSS v4 with the tokens from `directions.md` (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `font-display`). Replace copy and images, keep the structure, spacing and responsive classes. Plain HTML works the same way (`className` becomes `class`).

Shared wrappers used below:
```jsx
const Container = ({ className = "", children }) => <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
const Section = ({ className = "", children, id }) => <section id={id} className={`py-20 sm:py-28 lg:py-36 ${className}`}>{children}</section>;
const Img = ({ src, alt, ratio = "aspect-[4/5]", className = "" }) => (
  <div className={`overflow-hidden bg-surface ${ratio} ${className}`}>
    <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]" />
  </div>
);
```
Unsplash image by id: `https://images.unsplash.com/<photo-id>?w=1600&q=80&auto=format&fit=crop`.

---

## N1. Nav: logo left, links right, menu on phones
```jsx
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["About", "#about"], ["Contact", "#contact"]];
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <a href="/" className="font-display text-xl tracking-tight">Halden</a>
        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          {links.map(([l, h]) => <a key={l} href={h} className="text-muted transition-colors hover:text-ink">{l}</a>)}
          <a href="#contact" className="bg-accent px-5 py-2.5 text-sm text-on-accent">Get in touch</a>
        </nav>
        <button className="grid h-11 w-11 place-items-center md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-full bg-ink transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-full bg-ink transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </Container>
      {open && (
        <nav className="border-t border-line bg-bg md:hidden">
          <Container className="flex flex-col py-4">
            {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-2xl">{l}</a>)}
          </Container>
        </nav>
      )}
    </header>
  );
}
```
**N2 (store)**: three columns on desktop: links left, logo centered (`justify-self-center`), icons right (Search, Account, Bag with count). On phones: menu button left, logo center, bag right.

## H1. Hero split: text left, image right
```jsx
<Section className="pt-10 sm:pt-16">
  <Container className="grid items-end gap-10 lg:grid-cols-12">
    <div className="lg:col-span-6">
      <h1 className="font-display text-[44px] leading-[1.02] sm:text-[64px] lg:text-[88px]">Fish from the morning boat</h1>
      <p className="mt-6 max-w-md text-lg text-muted">Cooked over charcoal in a small room by the harbour. Thirty seats, one menu that changes daily.</p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a href="#book" className="bg-accent px-7 py-4 text-sm text-on-accent">Book a table</a>
        <a href="#menu" className="text-sm underline decoration-line underline-offset-8 hover:decoration-ink">See the menu</a>
      </div>
    </div>
    <Img className="lg:col-span-6" ratio="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" src="..." alt="Grilled fish on a dark plate" />
  </Container>
</Section>
```

## H2. Hero full-bleed photo
```jsx
<section className="relative h-[88svh] min-h-[560px] overflow-hidden">
  <img src="..." alt="" className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0 bg-black/35" />
  <Container className="relative flex h-full flex-col justify-end pb-14 text-white sm:pb-20">
    <h1 className="max-w-3xl font-display text-[44px] leading-[1.02] sm:text-[72px] lg:text-[104px]">The winter edit</h1>
    <div className="mt-8 flex items-center gap-6">
      <a href="#shop" className="bg-white px-7 py-4 text-sm text-black">Shop the collection</a>
    </div>
  </Container>
</section>
```

## H3. Type-only statement
```jsx
<Section className="pt-16 sm:pt-24">
  <Container>
    <h1 className="font-display text-[48px] leading-[0.98] tracking-[-0.03em] sm:text-[84px] lg:text-[128px]">Landscape and architecture photography.</h1>
    <div className="mt-12 grid gap-6 border-t border-line pt-6 text-muted sm:grid-cols-3">
      <p>Based in Oslo</p><p>Working worldwide</p><p className="sm:text-right">Available from March</p>
    </div>
  </Container>
</Section>
```

## S1. Intro statement
```jsx
<Section><Container className="grid gap-8 lg:grid-cols-12">
  <p className="text-sm text-muted lg:col-span-3">About the studio</p>
  <p className="font-display text-[28px] leading-[1.25] sm:text-[40px] lg:col-span-9">We design small buildings with long lives: houses, studios and a few public rooms, mostly in timber and stone.</p>
</Container></Section>
```

## S2. Split (image + text), alternate sides with `lg:order-2`
```jsx
<Section><Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
  <Img className="lg:col-span-7" ratio="aspect-[3/2]" src="..." alt="Tailor cutting wool" />
  <div className="lg:col-span-5">
    <h2 className="font-display text-[36px] leading-[1.05] sm:text-[52px]">Cut in Porto</h2>
    <p className="mt-6 text-lg text-muted">Every coat is cut and sewn in a workshop of eleven people. We make small runs, so nothing sits in a warehouse.</p>
    <a href="#story" className="mt-8 inline-block text-sm underline underline-offset-8">Read the story</a>
  </div>
</Container></Section>
```

## S3. Full-bleed image band
```jsx
<section className="relative h-[70svh] min-h-[420px]"><img src="..." alt="Fjord at dawn" className="h-full w-full object-cover" /></section>
```

## S4. Product grid (store)
```jsx
<Section><Container>
  <div className="flex items-end justify-between gap-6">
    <h2 className="font-display text-[36px] sm:text-[52px]">New in</h2>
    <a href="#all" className="text-sm underline underline-offset-8">View all</a>
  </div>
  <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
    {products.map((p) => (
      <li key={p.name}><a href={p.href} className="group block">
        <Img src={p.img} alt={p.name} />
        <div className="mt-4 flex items-baseline justify-between gap-3 text-[15px]">
          <span>{p.name}</span><span className="tabular-nums text-muted">€{p.price}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{p.note}</p>
      </a></li>
    ))}
  </ul>
</Container></Section>
```

## S5. Large image tiles (categories or gallery)
```jsx
<Section><Container className="grid gap-4 sm:gap-6 md:grid-cols-3">
  {tiles.map((t, i) => (
    <a key={t.label} href={t.href} className={`group relative block ${i === 0 ? "md:col-span-2" : ""}`}>
      <Img src={t.img} alt={t.label} ratio={i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[4/5]"} />
      <span className="absolute bottom-5 left-5 bg-bg px-4 py-2 text-sm">{t.label}</span>
    </a>
  ))}
</Container></Section>
```

## S6. Hairline list (services, facts, steps, hours)
```jsx
<Section><Container className="grid gap-10 lg:grid-cols-12">
  <h2 className="font-display text-[36px] sm:text-[52px] lg:col-span-4">How we work</h2>
  <ol className="lg:col-span-8">
    {items.map((it, i) => (
      <li key={it.title} className="grid gap-2 border-t border-line py-7 sm:grid-cols-[4rem_1fr_2fr] sm:gap-6">
        <span className="tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="text-lg">{it.title}</h3>
        <p className="text-muted">{it.body}</p>
      </li>
    ))}
  </ol>
</Container></Section>
```
Use numbers only when the order is real (steps). For facts and services, drop the number column.

## S7. One large quote
```jsx
<Section className="bg-surface"><Container className="max-w-4xl">
  <blockquote className="font-display text-[30px] leading-[1.25] sm:text-[44px]">"I have had this coat for six winters. The lining was repaired for free last year."</blockquote>
  <p className="mt-8 text-muted">Ana R., Lisbon</p>
</Container></Section>
```

## S8. Index list (portfolio)
```jsx
<Section id="work"><Container>
  {projects.map((p) => (
    <a key={p.title} href={p.href} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-line py-6 sm:py-8">
      <span className="font-display text-[32px] leading-none transition-colors group-hover:text-muted sm:text-[56px]">{p.title}</span>
      <span className="text-sm text-muted">{p.place}, {p.year}</span>
      <Img className="col-span-2 mt-4 sm:hidden" ratio="aspect-[3/2]" src={p.img} alt={p.title} />
    </a>
  ))}
</Container></Section>
```

## S9. Closing call to action
```jsx
<Section className="bg-ink text-bg"><Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
  <h2 className="font-display text-[44px] leading-[1.02] sm:text-[72px] lg:col-span-8">Tables open thirty days ahead.</h2>
  <div className="lg:col-span-4 lg:text-right">
    <a href="#book" className="inline-block bg-bg px-7 py-4 text-sm text-ink">Book a table</a>
    <p className="mt-4 text-sm opacity-70">Or call +351 21 000 0000</p>
  </div>
</Container></Section>
```

## S10. Newsletter
```jsx
<form className="flex max-w-md border-b border-ink" onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="email" className="sr-only">Email</label>
  <input id="email" type="email" required autoComplete="email" placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent py-4 outline-none placeholder:text-muted" />
  <button className="py-4 pl-4 text-sm">Subscribe</button>
</form>
```

## S11. Menu card (restaurant)
```jsx
<ul className="grid gap-x-16 md:grid-cols-2">
  {dishes.map((d) => (
    <li key={d.name} className="border-t border-line py-5">
      <div className="flex items-baseline gap-3">
        <span className="text-lg">{d.name}</span>
        <span className="flex-1 translate-y-[-4px] border-b border-dotted border-line" />
        <span className="tabular-nums">{d.price}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{d.note}</p>
    </li>
  ))}
</ul>
```

## S12. Logos or press (only real ones)
A single row of 4 to 6 names set in the text font at 15px, muted, separated by wide gaps. No fake logos.

## S13. Pricing (2 or 3 plans)
Plans side by side on desktop, stacked on phones. Each: name, price in large tabular figures, one line, 4 to 6 included items with hairlines, one button. Highlight one plan with a 1px ink border, not a gradient or a badge storm.

## S14. FAQ
```jsx
<div className="divide-y divide-line border-y border-line">
  {faqs.map((f) => (
    <details key={f.q} className="group py-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg">
        {f.q}<span className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-4 max-w-2xl text-muted">{f.a}</p>
    </details>
  ))}
</div>
```

## F1. Footer: columns
```jsx
<footer className="border-t border-line pt-16 pb-10"><Container>
  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
    <div className="lg:col-span-5"><p className="font-display text-2xl">Halden</p><p className="mt-3 max-w-xs text-muted">Landscape and architecture photography from Oslo.</p></div>
    {columns.map((c) => (
      <div key={c.title} className="lg:col-span-2">
        <p className="text-sm text-muted">{c.title}</p>
        <ul className="mt-4 space-y-3">{c.links.map((l) => <li key={l}><a href="#" className="hover:underline underline-offset-4">{l}</a></li>)}</ul>
      </div>
    ))}
  </div>
  <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row">
    <p>© 2026 Halden Studio</p><p>Privacy · Terms</p>
  </div>
</Container></footer>
```

## F2. Footer with oversized wordmark
F1 plus, at the very bottom: `<p className="mt-12 font-display text-[22vw] leading-[0.8] tracking-[-0.04em]" aria-hidden="true">Ivoire</p>` with `overflow-hidden` on the footer.
