import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import BlurRevealText from '../../../components/MainUI/ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';

const props = [
    { prop: 'text', type: 'string', def: 'demo sentence', desc: 'The text to reveal.' },
    { prop: 'as', type: 'string', def: '"p"', desc: 'Element to render, e.g. "h1".' },
    { prop: 'by', type: "'word' | 'letter'", def: '"word"', desc: 'Reveal word by word or letter by letter.' },
    { prop: 'stagger', type: 'number', def: '0.06', desc: 'Seconds between pieces.' },
    { prop: 'duration', type: 'number', def: '0.7', desc: 'Seconds each piece takes.' },
    { prop: 'blur', type: 'number', def: '12', desc: 'Starting blur in px.' },
    { prop: 'highlight', type: 'string[]', def: '[]', desc: 'Words shown in the accent color.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Highlight color.' },
    { prop: 'once', type: 'boolean', def: 'true', desc: 'Play only the first time it enters the view.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the text element.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'In-view trigger and staggered blur.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function BlurRevealTextDoc() {
    const [by, setBy] = useState('word');
    const [stagger, setStagger] = useState(0.06);
    const [blur, setBlur] = useState(12);
    const [accent, setAccent] = useState('#a3e635');
    const key = `${by}-${stagger}-${blur}-${accent}`;

    const code = `import BlurRevealText from './ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';

const App = () => (
  <BlurRevealText
    as="h1"
    text="Design that moves people, built in minutes."
    by="${by}"
    stagger={${stagger}}
    blur={${blur}}
    highlight={["moves", "minutes."]}
    accentColor="${accent}"
    className="text-5xl font-bold tracking-tight"
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Blur Reveal Text"
            description="Words or letters rise out of a blur one after another as the text scrolls into view, with optional highlighted words."
            preview={
                <div className="max-w-2xl text-center">
                    <BlurRevealText key={key} as="h2" by={by} stagger={stagger} blur={blur} accentColor={accent} highlight={['moves', 'minutes.']} once={false} className="text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight" />
                    <BlurRevealText key={`sub-${key}`} by="word" stagger={0.025} blur={6} once={false} text="Copy-paste animated components for React and Tailwind CSS, free, fast and accessible." className="mx-auto mt-5 max-w-lg text-[1rem] text-[var(--ink-2)]" />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Reveal by" value={by} onChange={setBy} options={[{ value: 'word', label: 'Word' }, { value: 'letter', label: 'Letter' }]} />
                    <RangeControl label="Stagger" value={stagger} onChange={setStagger} min={0.01} max={0.2} step={0.01} format={(v) => `${v.toFixed(2)}s`} />
                    <RangeControl label="Blur" value={blur} onChange={setBlur} min={0} max={30} step={1} format={(v) => `${v}px`} />
                    <ColorControl label="Highlight" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="blur-reveal-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
