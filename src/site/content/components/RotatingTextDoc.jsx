import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import RotatingText from '../../../components/MainUI/ApexUI-Kit/RotatingText/RotatingText.jsx';

const props = [
    { prop: 'prefix', type: "string", def: "\"Build\"", desc: "Fixed words before the rotating one." },
    { prop: 'words', type: "string[]", def: "4 words", desc: "Words to rotate through." },
    { prop: 'interval', type: "number", def: "2200", desc: "Milliseconds per word." },
    { prop: 'stagger', type: "number", def: "0.025", desc: "Delay between letters in seconds." },
    { prop: 'from', type: "'first' | 'last' | 'center'", def: "\"first\"", desc: "Which letter moves first." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Pill color." },
    { prop: 'textColor', type: "string", def: "\"#0a0a0a\"", desc: "Text color inside the pill." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Letter springs and pill resizing.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function RotatingTextDoc() {
    const [from, setFrom] = useState('first');
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Rotating Text"
            description="A headline whose last word swaps on a timer, letters spring up one by one while the highlight pill resizes to fit."
            preview={
                <RotatingText from={from} accentColor={accent} className="text-4xl text-[var(--ink)] sm:text-5xl" />
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Stagger from" value={from} onChange={setFrom} options={['first', 'last', 'center']} />
                    <ColorControl label="Pill" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import RotatingText from './ApexUI-Kit/RotatingText/RotatingText.jsx';

const App = () => (
  <div>
    <RotatingText prefix="Build" words={["faster", "smarter", "together"]} from="${from}" accentColor="${accent}" className="text-5xl" />
  </div>
);

export default App;`}
            cli="rotating-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
