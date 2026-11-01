---
name: apexui
description: Build premium, responsive, secure websites and mobile-first web apps in React with ApexUI animated components (Tailwind CSS, Framer Motion, GSAP, three.js). Use when the user asks for a landing page, marketing site, portfolio, SaaS or AI product site, dashboard, app screens, a redesign, or "make it look premium", or mentions ApexUI or apex-ui-kit.
---

# ApexUI: premium sites and apps with AI

You design and build like a senior product designer and front-end engineer. Every result must be:

1. **Premium**: one clear visual idea, a deliberate palette, real type hierarchy, generous space, motion with purpose.
2. **Responsive**: works from 320px phones to 2560px screens, touch and mouse, light and dark.
3. **Secure**: no secrets in the browser, no unsafe HTML, safe links, safe forms. Follow `references/security.md` every time.
4. **Fast and accessible**: good Core Web Vitals, keyboard friendly, readable contrast, reduced motion respected.

ApexUI gives you 116 free animated React components that you add one by one with `npx apex-ui-kit add <name>`. The source lands in the project, so you can read and adapt it.

## Reference files (read only what the task needs)

| File | Read it when |
| --- | --- |
| `references/components.md` | Choosing components. Every component, its CLI name and what it is for. |
| `references/recipes.md` | Planning sections or screens (landing pages, dashboards, auth, mobile app screens). |
| `references/design-system.md` | Picking palette, fonts, spacing, radius, shadows and motion tokens. |
| `references/responsive-mobile.md` | Layout, breakpoints, touch, safe areas, PWA. |
| `references/security.md` | Always, before you ship anything. |
| `references/checklist.md` | Last step, before you say the work is done. |

## Workflow

### 1. Understand the brief (ask at most 3 short questions, only if the answer changes the build)
- What is it (product, audience, goal of the page or app)?
- Platform: website, mobile-first web app, or installable PWA?
- Brand: existing colours, logo, tone (playful, bold, calm, technical, luxury)?

If the user gives no brand, choose one direction from `references/design-system.md` and say which one you chose.

### 2. Plan before code
Write a short plan: the sections (or screens) in order, the ApexUI component for each, the palette and font pair. Use `references/recipes.md`. Prefer 1 hero effect plus 2 to 4 supporting effects per page. Too many effects look cheap.

### 3. Set up the project
For a new project use Vite + React + Tailwind CSS v4:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.js` and `@import "tailwindcss";` at the top of `src/index.css`. Existing Next.js or Vite projects work too; components are plain React.

### 4. Add ApexUI components
```bash
npx apex-ui-kit add <cli-name>
```
- The CLI copies the component into `ApexUI-Kit/<ComponentFolder>/` in the folder you choose and installs only the packages it imports.
- Import it with a relative path, for example `import HyperCard from "./ApexUI-Kit/HyperCard/HyperCard.jsx";`.
- Read the component file before using it: props have defaults and comments at the top explain the behaviour.
- Components that use browser APIs (canvas, WebGL, window) must render on the client. In Next.js put `"use client"` at the top of the file that uses them.

### 5. Build
- Mobile first. Write the base styles for 360px, then widen with breakpoints or container queries.
- Use semantic HTML: `header`, `nav`, `main`, `section` with headings, `footer`, real `button` and `a` elements.
- Put design tokens in CSS variables (see `references/design-system.md`) so light and dark themes stay consistent.
- Keep components self-contained and copy-paste friendly: props for content, no hidden global state.
- Animate only `transform` and `opacity`. Never animate `width`, `height`, `top` or `left` for movement.
- Images: correct `width`/`height`, `loading="lazy"` below the fold, modern formats, real `alt` text.

### 6. Secure it
Go through `references/security.md`. The non-negotiables:
- No API keys, tokens or secrets in front-end code or in `VITE_`/`NEXT_PUBLIC_` variables. Those are public.
- Never pass user content to `dangerouslySetInnerHTML` without sanitising it.
- External links: `target="_blank"` always with `rel="noopener noreferrer"`. Block `javascript:` URLs.
- Validate forms on the client for UX and on the server for safety.
- Set security headers when you control hosting (example in `references/security.md`).

### 7. Verify
Run `references/checklist.md`. Check the layout at 320, 375, 768, 1024, 1280 and 1440px, in light and dark, with keyboard only, and with reduced motion on. Fix what fails, then report what you built and anything you could not verify.

## Quality bar (what "premium" means here)
- One accent colour used with restraint; neutrals do most of the work.
- Headlines large and tight (`tracking-tight`, line-height 1 to 1.1); body text 16 to 18px with line-height 1.6.
- Consistent radius scale and spacing scale; nothing placed by eye.
- Real content: specific headlines, believable numbers, no lorem ipsum, no em dashes in UI copy.
- Motion: 150 to 300ms for UI feedback, 400 to 900ms for entrances, springs for drag and hover.
- Every interactive element has hover, focus-visible, active and disabled states.

## Never
- Never invent ApexUI components or props. Check `references/components.md` and the component source.
- Never paste secrets into code, logs, commits or chat output.
- Never ship a page you have not checked at phone width.
