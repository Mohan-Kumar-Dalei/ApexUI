import { useRef, useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, ToggleControl } from '../../docs/controls.jsx';
import FloatingNavbar from '../../../components/MainUI/ApexUI-Kit/FloatingNavbar/FloatingNavbar.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'brand', type: 'string', def: '"Apex"', desc: 'Brand name (its first letter becomes the logo).' },
    { prop: 'links', type: '{ label, href }[]', def: '5 demo links', desc: 'Navigation links.' },
    { prop: 'cta', type: '{ label, href } | null', def: '"Get started"', desc: 'Call-to-action button; null hides it.' },
    { prop: 'active', type: 'string', def: 'first link', desc: 'Label of the link that starts active.' },
    { prop: 'onNavigate', type: '(link, event) => void', def: 'none', desc: 'Called when a link is clicked.' },
    { prop: 'hideOnScroll', type: 'boolean', def: 'true', desc: 'Tuck away when scrolling down, come back when scrolling up.' },
    { prop: 'scrollRoot', type: 'RefObject', def: 'window', desc: 'Scroll container to watch instead of the window.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Logo, dot and button color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Glass colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Hover pill, hide-on-scroll and menu motion.' },
    { name: 'Lucide React', desc: 'Arrow icon.' },
    { name: 'Tailwind CSS', desc: 'Container queries make it responsive to its own width.' },
];

export default function FloatingNavbarDoc() {
    const theme = useSiteTheme();
    const scrollRef = useRef(null);
    const [accent, setAccent] = useState('#a3e635');
    const [hide, setHide] = useState(true);
    const dark = theme === 'dark';

    return (
        <ComponentDoc
            title="Floating Navbar"
            description="A glassy floating navbar, a highlight follows the pointer, the active link keeps a dot, it tucks away on scroll down and turns into an animated hamburger menu on narrow widths."
            preview={
                <div ref={scrollRef} className={`relative h-[26rem] w-full overflow-y-auto rounded-2xl ${dark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
                    <FloatingNavbar theme={theme} accentColor={accent} hideOnScroll={hide} scrollRoot={scrollRef} />
                    <div className={`space-y-4 px-6 pb-10 pt-10 ${dark ? 'text-white' : 'text-neutral-900'}`}>
                        <h3 className="text-3xl font-bold tracking-tight">Scroll inside this box</h3>
                        <p className="max-w-md opacity-60">Scroll down and the bar tucks away; scroll up and it slides back. Narrow your window to see the hamburger menu.</p>
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className={`h-28 rounded-2xl ${dark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`} />
                        ))}
                    </div>
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <ToggleControl label="Hide on scroll" value={hide} onChange={setHide} />
                </ControlGrid>
            }
            code={`import FloatingNavbar from './ApexUI-Kit/FloatingNavbar/FloatingNavbar.jsx';

const links = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
];

const App = () => (
  <>
    <FloatingNavbar brand="Apex" links={links} accentColor="${accent}" theme="${theme}"${hide ? '' : ' hideOnScroll={false}'} />
    <main>…</main>
  </>
);

export default App;`}
            cli="floating-navbar"
            props={props}
            dependencies={dependencies}
        />
    );
}
