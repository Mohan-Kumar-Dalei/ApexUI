---
name: simplepremium
description: Calm, simple premium UI for apps and dashboards. Light neutrals, one blue accent, one sans font, quiet motion. Run it as /simplepremium followed by what to build.
argument-hint: [what to build]
disable-model-invocation: true
---

# Simple premium

Build: $ARGUMENTS

This is **product UI** (apps, dashboards, admin panels, internal tools, forms), not a marketing page. It should feel like a well-made tool: calm, fast, obvious, and pleasant to use every day.

## Rules from other skills that do NOT apply here
If the `apexui` skill is also installed, ignore these parts of it for this build:
- No hero section, no landing sections, no "at least 4 content sections", no closing call to action.
- No 96px section padding, no display or serif fonts, no oversized headlines.
- No scroll animations, no reveals, no parallax, no intro curtain, no marquee, no signature motion moment.
- No ApexUI demo components dropped in. Build plain, accessible controls instead.
- No gradients, no glows, no glass effects.

## Tokens (Tailwind CSS v4 `@theme`; no raw CSS outside `@theme` and `@layer base`)
```css
@import "tailwindcss";

@theme {
  --color-bg: #f5f6f8;
  --color-surface: #ffffff;
  --color-sunken: #f0f1f4;
  --color-ink: #12141a;
  --color-muted: #626979;
  --color-line: #e6e8ec;
  --color-accent: #2f5bea;
  --color-accent-deep: #2449c7;
  --color-accent-soft: #edf2ff;
  --color-approved: #0e7f56;
  --color-approved-soft: #e6f6ef;
  --color-rejected: #c4362f;
  --color-rejected-soft: #fdeceb;
  --color-pending: #9a5b05;
  --color-pending-soft: #fef4e0;
  --shadow-card: 0 1px 2px rgb(18 20 26 / 0.04);
  --shadow-float: 0 12px 32px -12px rgb(18 20 26 / 0.18), 0 2px 6px rgb(18 20 26 / 0.06);
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html { background: var(--color-bg); color: var(--color-ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
}
```
Status colours are for status only (approved, rejected, pending). `shadow-float` only on popovers, menus and dialogs; everything else uses `shadow-card` or none.

## Type
- One self-hosted sans: Geist Variable (`npm i @fontsource-variable/geist`, then `import "@fontsource-variable/geist";`).
- Body 14 to 15px, line height 1.5. Labels 13px `text-muted`. Page titles 20 to 24px, section titles 16px.
- Headings weight 600 with tracking `-0.015em`. Never more than 3 sizes on one screen.
- Numbers, dates, money and IDs use `tabular-nums`.

## Shape and layout
- App shell: a left sidebar (240px, collapses to 64px icons) with a top bar for page title, search and the user menu. Under 1024px the sidebar becomes a drawer opened from a menu button.
- Content width up to 1280px, page padding 24px (16px on phones), gaps of 16 or 24px.
- Panels: white `bg-surface`, 1px `border-line`, `rounded-xl`, `shadow-card`, padding 20 to 24px.
- Controls: `rounded-lg`, at least 44px tall, 1px `border-line`, accent focus ring.
- One accent, on fewer than 5 things per screen (primary button, active nav item, selected tab, links, focus).
- Status always as a soft badge: soft background with strong text, 12 to 13px, `rounded-md px-2 py-0.5` (for example `bg-approved-soft text-approved`).

## Building blocks
- **Stat cards**: label, big tabular number, small change line in muted text. 2 to 4 in a row; 2 per row on phones.
- **Tables**: sticky header in `bg-sunken`, 52px rows, hairline row dividers, right-aligned numbers, row hover `bg-sunken/60`, a row menu at the end. Under 768px each row becomes a card with the key fields stacked.
- **Filters**: a toolbar above the table: search input, custom selects, a date range, "Clear" text button. Show the active filters as removable chips.
- **Forms**: labels above fields, helper text below, errors in `text-rejected` under the field, the primary action bottom right (full width on phones).
- **Tabs**: underline style in accent, not pills.
- **Empty states**: one line saying what will appear here, one primary action. **Error states**: what happened and what to do next. **Loading**: skeleton blocks in `bg-sunken`, never spinners for whole pages.
- **Toasts**: bottom right (top on phones), auto hide after 4s, an undo action where it makes sense.

## Motion
Only on sheets, dialogs, popovers, menus and toasts: 140 to 320ms, `cubic-bezier(0.16, 1, 0.3, 1)`, `transform` and `opacity` only. Hover and press states change colour in 120ms. Nothing animates on scroll or on page load. Respect `prefers-reduced-motion`.

## Must have
- A custom select (button plus listbox with keyboard support: arrows, Enter, Escape, type to jump), never the native dropdown look.
- A password field with an eye toggle (`aria-label` switches between "Show password" and "Hide password").
- Dialogs with the native `<dialog>` element (`showModal()`), a visible close button, Escape to close, focus returned to the opener.
- A visible focus ring in the accent on every interactive element.
- Empty, loading and error states for every list and every form.
- Works at 320px: no horizontal page scroll; wide tables scroll inside their own box or turn into cards.
- Keyboard: every action reachable, logical tab order, 44px targets.

## Copy
Short plain sentences. Buttons are verbs ("Approve", "Save changes", "Export CSV"). No em dashes, no emoji, no exclamation marks, no filler ("Seamlessly manage your..."). Dates as "7 Nov 2026", times as "14:30" or "2:30 pm" consistently.

## Done means
`npm run build` passes, every screen checked at 320, 768, 1024 and 1440px, no colours outside the tokens, no gradients, and every list has its empty state. Report what you built and anything you could not check.
