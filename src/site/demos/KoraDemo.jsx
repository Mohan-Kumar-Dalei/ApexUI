import { useCallback, useState } from 'react';
import { BackPill, useFonts } from './shared.jsx';
import Nav from './kora/components/Nav.jsx';
import Hero from './kora/components/Hero.jsx';
import Marquee from './kora/components/Marquee.jsx';
import Estates from './kora/components/Estates.jsx';
import Beans from './kora/components/Beans.jsx';
import Process from './kora/components/Process.jsx';
import Bar from './kora/components/Bar.jsx';
import Visit from './kora/components/Visit.jsx';
import Faq from './kora/components/Faq.jsx';
import Closing from './kora/components/Closing.jsx';
import Footer from './kora/components/Footer.jsx';

/*
 * Kora: a coffee roastery and cafe. Built by a small, fast AI model that was
 * given only the ApexUI skill (installed with `npx apex-ui-kit skill`) and a
 * one-paragraph brief. Its design tokens are scoped to this wrapper.
 */

const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500&display=swap';
const vars = {
    '--k-bg': '#F1EBE0',
    '--k-surface': '#E6DCCB',
    '--k-ink': '#1E1712',
    '--k-muted': '#6B5C4E',
    '--k-line': '#CFC2AE',
    '--k-accent': '#7B2D1E',
    '--k-on-accent': '#F1EBE0',
    '--k-soft': '#B3A390',
    '--k-night-line': '#3A2F26',
    '--k-font-text': '"Hanken Grotesk", system-ui, sans-serif',
    '--font-display': '"Instrument Serif", Georgia, serif',
    fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
};

const css = `
.kora h1, .kora h2, .kora h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.015em; line-height: 1.02; }
.kora img { display: block; max-width: 100%; }
.kora section[id] { scroll-margin-top: 4.5rem; }
.kora ::selection { background: var(--k-accent); color: var(--k-on-accent); }
.kora :focus-visible { outline: 2px solid var(--k-accent); outline-offset: 3px; }
.kora .marquee-track { animation: kora-marquee 40s linear infinite; }
@keyframes kora-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .kora *, .kora *::before, .kora *::after { transition-duration: 0.01ms !important; }
  .kora .marquee-track { animation: none; }
}
`;

export default function KoraDemo() {
    useFonts(FONTS);
    const [bag, setBag] = useState([]);
    const addToBag = useCallback((line) => setBag((prev) => [...prev, line]), []);

    return (
        <div style={vars} className="kora min-h-dvh overflow-x-clip bg-[var(--k-bg)] text-[var(--k-ink)] antialiased">
            <style>{css}</style>
            <Nav bagCount={bag.length} />
            <main>
                <Hero />
                <Marquee />
                <Estates />
                <Beans bag={bag} onAdd={addToBag} />
                <Process />
                <Bar />
                <Visit />
                <Faq />
                <Closing />
            </main>
            <Footer />
            <BackPill />
        </div>
    );
}
