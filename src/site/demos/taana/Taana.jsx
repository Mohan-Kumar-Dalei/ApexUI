import { BackPill, useFonts } from '../shared.jsx';
import App from './App.jsx';

/*
 * Taana, a handwoven saree house, built with the ApexUI Pro brand playbook.
 * Direction: minimal luxury. Unbleached ivory, ink, one kumkum red, zari gold for small marks; Gloock with Instrument Sans.
 * Layout: full-bleed photo hero with a glass pill nav, a pinned 3D loom room, a 3D rail of sarees on wooden hangers.
 * Architecture: pages and sections as in the full React + Express project; the API runs in the browser here (mock.js).
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Gloock&family=Instrument+Sans:wght@400;500;600&display=swap';

const vars = {
    '--tn-bg': '#F5EFE6',
    '--tn-surface': '#ECE3D5',
    '--tn-card': '#FBF7F1',
    '--tn-ink': '#1C1714',
    '--tn-muted': '#6B5F55',
    '--tn-line': '#DCCFBE',
    '--tn-accent': '#8E1B1B',
    '--tn-on-accent': '#F8F1E7',
    '--tn-band': '#1C1714',
    '--tn-on-band': '#F5EFE6',
    '--tn-band-muted': '#B9AC9E',
    '--tn-veg': '#2E6B3F',
};

// Base rules sit in the base layer so utilities still win; helpers sit in utilities.
const CSS = `
@layer base {
  .taana { font-family: "Instrument Sans", system-ui, sans-serif; color: var(--tn-ink); background: var(--tn-bg); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  .taana h1, .taana h2, .taana h3 { font-family: "Gloock", Georgia, serif; font-weight: 400; letter-spacing: -0.02em; line-height: 1.02; }
  .taana ::selection { background: var(--tn-accent); color: var(--tn-on-accent); }
  .taana :focus-visible { outline: 2px solid var(--tn-accent); outline-offset: 3px; }
  .taana button { cursor: pointer; }
  .taana img { display: block; }
}
@layer utilities {
  .taana .tnum { font-variant-numeric: tabular-nums; }
  .taana .no-bar { scrollbar-width: none; }
  .taana .no-bar::-webkit-scrollbar { display: none; }
  .taana .bone { position: relative; overflow: hidden; background: var(--tn-surface); }
  .taana .bone::after { content: ""; position: absolute; inset: 0; width: 40%; background: var(--tn-card); opacity: .55; transform: translateX(-120%); animation: tn-sweep 1.3s cubic-bezier(.45,0,.2,1) infinite; }
  .taana .label { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; color: var(--tn-muted); }
}
@keyframes tn-sweep { to { transform: translateX(320%); } }
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: clip; }
@media (prefers-reduced-motion: reduce) {
  .taana *, .taana *::before, .taana *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`;

export default function Taana() {
    useFonts(FONTS);
    return (
        <div className="taana min-h-dvh" style={vars}>
            <style>{CSS}</style>
            <App />
            <BackPill />
        </div>
    );
}
