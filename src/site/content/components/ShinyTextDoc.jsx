import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import ShinyText from '../../../components/MainUI/ApexUI-Kit/ShinyText/ShinyText.jsx';

const props = [
    { prop: 'text', type: "string", def: "\"Shipping soon, join the waitlist\"", desc: "The text." },
    { prop: 'as', type: "string", def: "\"span\"", desc: "Element to render (span, h1, p…)." },
    { prop: 'speed', type: "number", def: "2.8", desc: "Seconds per sweep." },
    { prop: 'color', type: "string", def: "\"#71717a\"", desc: "Base text color." },
    { prop: 'shineColor', type: "string", def: "\"#ffffff\"", desc: "Color of the light band." },
    { prop: 'spread', type: "number", def: "10", desc: "Band width (4 to 16)." },
    { prop: 'pause', type: "number", def: "0.6", desc: "Seconds between sweeps." },
    { prop: 'disabled', type: "boolean", def: "false", desc: "Stop the sweep." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Looping background sweep.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ShinyTextDoc() {
    const [speed, setSpeed] = useState(2.8);
    const [shine, setShine] = useState('#ffffff');
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Shiny Text"
            description="A bright band of light sweeps across the text on a loop, like light catching metal, great for badges, waitlist lines and subtle headings."
            preview={
                <ShinyText text="✨ Shipping soon, join the waitlist" speed={speed} shineColor={theme === 'light' ? '#18181b' : shine} color={theme === 'light' ? '#a1a1aa' : '#71717a'} className="text-3xl font-semibold tracking-tight sm:text-4xl" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={1} max={6} step={0.1} format={(v) => `${v}s`} />
                    <ColorControl label="Shine" value={shine} onChange={setShine} />
                </ControlGrid>
            }
            code={`import ShinyText from './ApexUI-Kit/ShinyText/ShinyText.jsx';

const App = () => (
  <div>
    <ShinyText text="Shipping soon, join the waitlist" speed={${speed}} shineColor="${shine}" className="text-4xl font-semibold" />
  </div>
);

export default App;`}
            cli="shiny-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
