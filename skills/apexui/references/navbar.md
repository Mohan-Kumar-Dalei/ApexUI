# The navbar

The nav is the first thing people touch, so it has to belong to the brand. Never ship a generic nav or a component nav as it arrives. Design one for this site: its shape, its contents and its behaviour come from the layout and the product.

## Step 1. Decide what it must hold
- Logo or wordmark (in the display face, or the real logo).
- 3 to 5 links, named in plain words.
- One primary action that matches the goal (Book a table, Shop, Get the app, Book on WhatsApp, Let's talk).
- A theme toggle, always: an icon button next to the CTA on desktop, in the bar or the first row of the menu on phones (`theme.md`).
- Product-specific extras only if they help: a location picker for a local service, a cart count for a store, a search (Ctrl K) for docs, opening status for a restaurant.

## Step 2. Pick the pattern that fits the layout
| Pattern | Fits | Shape |
| --- | --- | --- |
| **Floating pill** | Products, apps, SaaS, dark sites | Centered capsule (`max-w-3xl rounded-full border`), 12 to 16px from the top, logo left, links center, CTA right. |
| **Store bar** | Fashion, retail | Full width, three columns: links left, logo centered, search, account and bag right. Announcement strip above. |
| **Editorial line** | Portfolios, studios, magazines | Full width, hairline bottom border, name left, links right, small and calm. |
| **Split** | Restaurants, hotels | Name left, hours or "Open today" in the middle, booking button right. |
| **Grid rails** | Developer portfolios, docs | Sits inside the page's visible grid (border-x rails), mono labels, search and theme toggle on the right. |
| **Minimal plus overlay** | Agencies, creative brands | Only logo and a "Menu" button; the menu opens as a full-screen overlay with huge links. |
| **Tab bar** | Mobile apps | Bottom bar, 3 to 5 tabs (see `mobile-app.md`). |

## Step 3. Behaviour (all patterns)
- **On load**: fades and slides down 12px after the hero headline starts.
- **On scroll**: after 24px, gets a background (`bg-bg/85 backdrop-blur-sm`) and a hairline border, and gets slightly shorter. Optional: hide when scrolling down, show when scrolling up.
- **Active link**: the section in view is marked (underline, dot or filled pill) using an IntersectionObserver.
- **Phones**: links collapse into a menu button. The menu opens as a panel or full-screen overlay; links are large (28 to 40px display face) and arrive one after another; the page behind does not scroll; Escape and a tap outside close it.
- **Accessible**: `nav aria-label`, `aria-expanded` on the button, focus visible, 44px targets.

## Step 4. Style it with your tokens
Same colours, fonts and radius as the page. The CTA uses the page's primary button style. If you start from an ApexUI nav (Floating Navbar, Gooey Nav, Nav Menu, Magnify Dock), restyle it fully as described in `adapt-components.md`.

## Blueprint: scroll-aware nav with active section and overlay menu
```jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [["Work", "work"], ["Studio", "studio"], ["Journal", "journal"], ["Contact", "contact"]];
const EASE = [0.16, 1, 0.3, 1];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    LINKS.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden && !open ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? "border-b border-line bg-bg/85 backdrop-blur-sm" : ""}`}
      >
        <nav aria-label="Main" className={`mx-auto flex max-w-[1360px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${scrolled ? "h-16" : "h-20"}`}>
          <a href="#top" className="font-display text-2xl">Halden</a>
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map(([label, id]) => (
              <li key={id}>
                <a href={`#${id}`} className={`relative py-1 text-[15px] transition-colors ${active === id ? "text-ink" : "text-muted hover:text-ink"}`}>
                  {label}
                  {active === id && <motion.span layoutId="nav-active" className="absolute -bottom-0.5 left-0 h-px w-full bg-ink" />}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden bg-accent px-5 py-2.5 text-sm text-on-accent sm:inline-block">Start a project</a>
            <button className="grid h-11 w-11 place-items-center md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 bg-bg pt-24 md:hidden" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.6, ease: EASE }}>
            <ul className="px-5">
              {LINKS.map(([label, id], i) => (
                <motion.li key={id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }} className="border-b border-line">
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="block py-5 font-display text-[40px] leading-none">{label}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```
Because the header is `fixed`, give the first section top padding equal to the nav height (`pt-24`).

## Variations in a few lines
- **Floating pill**: wrap the `<nav>` in `mx-auto mt-3 max-w-3xl rounded-full border border-line bg-bg/80 px-2 backdrop-blur-sm` and drop the full-width border.
- **Store bar**: `grid grid-cols-[1fr_auto_1fr]`; bag button shows a count badge in `bg-ink text-bg`.
- **Grid rails**: put the nav inside the same `max-w` container as the page with `border-x border-line`, labels in the mono face at 12px.
- **Local service**: add a compact location select before the CTA; on phones it moves into the menu panel.
