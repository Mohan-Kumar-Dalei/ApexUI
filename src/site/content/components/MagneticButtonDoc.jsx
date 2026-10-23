import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import { ArrowRight, Github } from 'lucide-react';
import MagneticButton from '../../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';

const props = [
    { prop: 'children', type: 'ReactNode', def: '"Get started"', desc: 'Button content.' },
    { prop: 'as', type: 'string', def: '"button"', desc: 'Element to render, e.g. "a" for links.' },
    { prop: 'strength', type: 'number', def: '0.35', desc: 'How hard the button is pulled toward the pointer.' },
    { prop: 'radius', type: 'number', def: '1.6', desc: 'Pull distance as a multiple of the button size.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Color of the glow that follows the pointer.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Button surface.' },
    { prop: '...rest', type: 'any', def: 'none', desc: 'Other props (onClick, href, aria-*) go to the element.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Springs for the pull and the label parallax.' },
    { name: 'Lucide React', desc: 'Icons in the demo.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function MagneticButtonDoc() {
    const theme = useSiteTheme();
    const [strength, setStrength] = useState(0.35);
    const [radius, setRadius] = useState(1.6);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Magnetic Button"
            description="A button that leans toward the pointer like a magnet, with its label following a little further for a layered parallax and a glow that tracks the pointer. Springs back when you leave."
            preview={
                <div className="flex flex-wrap items-center justify-center">
                    <MagneticButton strength={strength} radius={radius} accentColor={accent} theme={theme}>
                        Get started <ArrowRight className="h-4 w-4" />
                    </MagneticButton>
                    <MagneticButton strength={strength} radius={radius} accentColor={accent} theme={theme} as="a" href="#">
                        <Github className="h-4 w-4" /> Star on GitHub
                    </MagneticButton>
                </div>
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Strength" value={strength} onChange={setStrength} min={0.1} max={0.8} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Reach" value={radius} onChange={setRadius} min={1} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <ColorControl label="Glow" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import MagneticButton from './ApexUI-Kit/MagneticButton/MagneticButton.jsx';

const App = () => (
  <MagneticButton strength={${strength}} radius={${radius}} accentColor="${accent}" onClick={() => signUp()}>
    Get started
  </MagneticButton>
);

export default App;`}
            cli="magnetic-button"
            props={props}
            dependencies={dependencies}
        />
    );
}
