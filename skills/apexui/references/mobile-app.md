# Premium mobile apps

The same taste rules apply, scaled to a hand. A premium app feels calm, fast and certain: big clear titles, one main action per screen, generous touch targets, motion that explains what changed.

Works for a mobile web app or PWA (React + Tailwind) and for native apps (React Native / Expo, Flutter, SwiftUI): the numbers below are the same.

## The system
- **Grid**: 4pt base. Screen margin 20px (16px on very small phones). Gaps 8, 12, 16, 24, 32.
- **Type** (sizes in px): large title 34 (bold or display face), title 22 to 28, headline 17 semibold, body 16 to 17, secondary 14 to 15, caption 12 to 13. Line height 1.3 to 1.4. Never below 12.
- **Colour**: the same direction tokens as the website. Light and dark mode both designed, not inverted, following the system by default with a Light, Dark and System choice in settings (`theme.md`). Surfaces separate by a small tone shift, not shadows.
- **Radius**: pick one: 12px (cards), 16 to 20px (sheets), full (buttons and chips) and keep it.
- **Icons**: one icon set, 24px, 1.5 to 2px stroke, filled version only for the active tab.
- **Touch**: every target at least 44 by 44px (48 on Android). 8px between targets.

## Navigation
- **Tab bar**: 3 to 5 tabs, icon + short label, 56px plus the bottom safe area. Active tab in ink or accent, others muted. No floating gradient pills.
- **Top bar**: large title that collapses to a small centered title on scroll; back button on the left; at most two actions on the right.
- **Sheets**: for secondary tasks (filters, sharing, quick add). Grab handle, rounded top corners, dim the page behind with flat `bg-black/40`.
- **Primary action**: a full-width button pinned above the tab bar or at the bottom of the sheet, 52 to 56px tall.

## Screen blueprints
1. **Onboarding**: 3 screens max. Big image or simple illustration, one headline, one sentence, progress dots, "Continue" button, "Skip" text button. Ask for permissions only when the feature needs them, never on screen one.
2. **Sign in**: logo, one sentence, Sign in with Apple / Google buttons, email option below. Large inputs (52px), clear errors under the field.
3. **Home**: large title with a greeting or date, one hero card (today's thing), then a list or horizontal row of items. No more than three blocks above the fold.
4. **List**: rows 64 to 72px with leading image or icon, title, secondary line, trailing value or chevron. Hairline separators inset to the text. Swipe actions also available as buttons in the detail screen.
5. **Detail**: big media at the top (edge to edge), title, key facts as a short list, sticky bottom bar with the main action.
6. **Search**: field at the top that gets focus, recent searches, results grouped by type.
7. **Profile and settings**: grouped lists with section headers, toggles on the right, destructive actions last and in red text.
8. **Empty states**: a short line saying what will appear here and one button to start.

## Motion
- Screen pushes: slide 100% with a slight parallax of the previous screen, 300 to 350ms.
- Sheets: spring up (stiffness about 400, damping about 34); dismiss by dragging down.
- Press feedback: scale to 0.97 in 100ms, back on release. Light haptic on toggles and success (native).
- Lists: new items fade in, removed items collapse. No bouncing cards.
- Respect reduced motion: crossfades only.

## Mobile web app specifics
- `viewport-fit=cover` and safe-area padding on top and bottom bars (see `responsive-mobile.md`).
- Use `100dvh` for full-height screens; disable overscroll glow where it breaks the app feel (`overscroll-behavior: none` on the app shell).
- Inputs 16px or larger so iOS does not zoom. Correct `inputmode` and `autocomplete`.
- Make it installable: manifest with icons and `display: standalone`, theme colour matching the top bar.

## Tab bar blueprint (React + Tailwind)
```jsx
const tabs = [["Today", HomeIcon], ["Explore", CompassIcon], ["Library", BookIcon], ["Profile", UserIcon]];
<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
  <ul className="mx-auto grid max-w-md grid-cols-4">
    {tabs.map(([label, Icon]) => {
      const on = label === active;
      return (
        <li key={label}>
          <button onClick={() => setActive(label)} aria-current={on ? "page" : undefined} className={`flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px] ${on ? "text-ink" : "text-muted"}`}>
            <Icon className="h-6 w-6" strokeWidth={on ? 2 : 1.5} />
            {label}
          </button>
        </li>
      );
    })}
  </ul>
</nav>
```

## App copy
Same rules as `copy.md`, shorter: titles of 1 to 3 words, buttons as verbs ("Start session", "Save", "Done"), confirmations that say what happened ("Saved to Library").
