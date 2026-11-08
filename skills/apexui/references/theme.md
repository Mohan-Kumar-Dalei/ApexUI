# Light and dark theme, with a toggle

Every site and app ships with both a light and a dark theme, plus a toggle a visitor can find. On the first visit it follows the system setting. Once the visitor picks a theme, that choice is remembered. Skip this only when the user asks for a single theme; say so in the final report.

## 1. Design both themes (never invert)
Dark is a second palette from the same brand world, not the light one flipped.

| Token | Light | Dark |
| --- | --- | --- |
| `bg` | off-white from the direction | soft black tinted toward the brand (warm `#15130F`, cool `#0E1013`, green `#0F1411`), never `#000` |
| `surface` | 3 to 5% darker than bg | 4 to 7% lighter than bg (raised things get lighter in the dark) |
| `ink` | near black | off-white, about 90% light (`#ECE7DE`), never pure `#FFF` for body text |
| `muted` | about 55% ink into bg | about 60% ink into bg, still 4.5:1 on bg |
| `line` | about 15% mix | about 12 to 14% mix; borders do the work shadows did |
| `accent` | the brand colour | the same hue, lighter and a little less saturated so it reads on dark and keeps 4.5:1 with its text |
| `on-accent` | text on accent | recheck: often flips to the dark bg colour |

Rules:
- Same hue family, same fonts, same radius, same layout. Only tone changes.
- Shadows almost disappear in dark; separate things with `surface` and `line` instead.
- The light theme's one dark band becomes a `surface` band in dark (or a light band, if the brand is bold). Give it its own tokens (`band`, `on-band`) so it is set once.
- Photos stay the same. Text on photos keeps the flat `bg-black/40` overlay in both themes. Product shots on pure white get a `surface` frame in dark so they do not glow.
- Logos and icons use `currentColor` (or a light and a dark file).
- Status colours (veg, success, error) get dark versions with 4.5:1 contrast.
- Check contrast for every pair in both themes: ink on bg, ink on surface, muted on bg, on-accent on accent.

## 2. Tokens (Tailwind CSS v4)
```css
@import "tailwindcss";

/* `dark:` follows the data-theme attribute on <html>, not only the system setting */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  color-scheme: light;
  --bg: #F3F0EA; --surface: #E9E4DA; --ink: #161513; --muted: #6F6A61;
  --line: #D8D1C4; --accent: #8A4B2A; --on-accent: #F3F0EA;
  --band: #161513; --on-band: #F3F0EA;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #15130F; --surface: #1F1C17; --ink: #ECE7DE; --muted: #A69E92;
  --line: #2F2B25; --accent: #D08A62; --on-accent: #15130F;
  --band: #1F1C17; --on-band: #ECE7DE;
}

@theme inline {
  --color-bg: var(--bg); --color-surface: var(--surface); --color-ink: var(--ink);
  --color-muted: var(--muted); --color-line: var(--line);
  --color-accent: var(--accent); --color-on-accent: var(--on-accent);
  --color-band: var(--band); --color-on-band: var(--on-band);
}
```
Because every class reads a token (`bg-bg`, `text-ink`, `border-line`), the whole page switches with one attribute. Use `dark:` only for the few things a token cannot express (swapping a logo file, hiding a light-only image). A hard-coded colour anywhere is a bug: it will not switch.

## 3. No flash on load
The theme must be set before the first paint, or the page flashes light before going dark. Put a tiny blocking script in `public/theme-init.js` and load it in `<head>` after the `theme-color` meta and before the CSS. It is a file, not inline, so it passes a strict `script-src 'self'` CSP.

```js
// public/theme-init.js
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    // Match the browser bar to the theme (your two bg tokens).
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#15130F" : "#F3F0EA";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
```
```html
<head>
  <meta name="theme-color" content="#F3F0EA" />
  <script src="/theme-init.js"></script>
  ...
</head>
```

## 4. The hook
```jsx
import { useCallback, useEffect, useState } from "react";

const BG = { light: "#F3F0EA", dark: "#15130F" }; // your two bg tokens

export function useTheme() {
  const [theme, setThemeState] = useState(() => document.documentElement.dataset.theme || "light");

  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BG[t]);
    setThemeState(t);
  };

  // Follow the system until the visitor makes a choice.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      try { if (localStorage.getItem("theme")) return; } catch { /* storage blocked */ }
      apply(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    // Keep every toggle on the page in sync (nav and phone menu).
    const html = document.documentElement;
    const mo = new MutationObserver(() => setThemeState(html.dataset.theme || "light"));
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener("change", onChange); mo.disconnect(); };
  }, []);

  const setTheme = useCallback((t) => {
    try { localStorage.setItem("theme", t); } catch { /* still switches for this visit */ }
    apply(t);
  }, []);

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
```

## 5. The toggle
- **Where**: in the custom navbar on desktop (next to the CTA, before the menu button), and reachable on phones without opening anything when there is room; otherwise as the first row of the phone menu. In a mobile app: in settings or profile, as Light, Dark and System.
- **Look**: designed for this nav, in its tokens. An icon button (sun and moon in the site's icon set, 44px target) or a small two-state pill. Never a stock iOS switch dropped in.
- **Accessible**: a real `<button>`, `aria-label` that says what will happen ("Switch to dark theme"), visible focus ring, works with Enter and Space.
- **Motion**: the icon turns and swaps (rotate 90deg plus fade, 300 to 400ms). The page itself can switch with a circle reveal from the button using the View Transitions API, which only animates `clip-path`. Without support, or with reduced motion, it switches instantly.
- The ApexUI `theme-toggle` component (`npx apex-ui-kit add theme-toggle --dir src --yes`) has these reveals built in; restyle it fully (`adapt-components.md`) and wire it to the hook above instead of its own storage.

```jsx
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";

export function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const next = theme === "dark" ? "light" : "dark";

  const onClick = (e) => {
    if (reduce || !document.startViewTransition) return toggle();
    const x = e.clientX || innerWidth / 2;
    const y = e.clientY || 0;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(toggle).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button type="button" onClick={onClick} aria-label={`Switch to ${next} theme`} className={`grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-surface ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
```
```css
/* Let the clip-path reveal run instead of the default cross-fade */
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
```
More than one toggle on the page (nav and phone menu) is fine: they share the `<html>` attribute and the hook keeps their icons in sync.

## 6. Check before you say it is done
- Reload in dark: no light flash.
- Every section, card, skeleton, form field, dialog, toast and footer looks designed in both themes. Search for hard-coded colours (`#fff`, `bg-white`, `text-black`, `bg-neutral-`, `rgb(`) and replace them with tokens.
- Restyled ApexUI components switch too (pass `theme` props from the hook where they take one).
- Contrast 4.5:1 for text in both themes. Focus ring visible in both.
- Screenshots at 375 and 1440px in both themes.
