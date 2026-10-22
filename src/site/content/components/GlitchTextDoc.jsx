import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import GlitchText from '../../../components/MainUI/ApexUI-Kit/GlitchText/GlitchText.jsx';

const props = [
    { prop: 'text', type: "string", def: "\"GLITCH\"", desc: "The text." },
    { prop: 'colors', type: "[string, string]", def: "cyan / rose", desc: "Colors of the two split layers." },
    { prop: 'speed', type: "number", def: "90", desc: "Milliseconds between glitch frames." },
    { prop: 'hoverOnly', type: "boolean", def: "false", desc: "Only glitch while hovered." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function GlitchTextDoc() {
    const [hover, setHover] = useState(false);
    const [speed, setSpeed] = useState(90);
    return (
        <ComponentDoc
            title="Glitch Text"
            description="Two colored copies of the text jump around in random horizontal slices over it, like a broken signal. Run it all the time or only on hover."
            preview={
                <GlitchText text="APEX UI" speed={speed} hoverOnly={hover} className="text-6xl text-[var(--ink)] sm:text-7xl" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Frame time" value={speed} onChange={setSpeed} min={40} max={250} step={10} format={(v) => `${v}ms`} />
                    <ToggleControl label="Hover only" value={hover} onChange={setHover} />
                </ControlGrid>
            }
            code={`import GlitchText from './ApexUI-Kit/GlitchText/GlitchText.jsx';

const App = () => (
  <div>
    <GlitchText text="APEX UI" speed={${speed}}${hover ? ' hoverOnly' : ''} className="text-7xl" />
  </div>
);

export default App;`}
            cli="glitch-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
