import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import TypewriterText from '../../../components/MainUI/ApexUI-Kit/TypewriterText/TypewriterText.jsx';

const props = [
    { prop: 'words', type: 'string[]', def: '4 demo phrases', desc: 'Phrases typed one after another.' },
    { prop: 'prefix', type: 'string', def: '"We build "', desc: 'Static text before the typed part.' },
    { prop: 'suffix', type: 'string', def: '""', desc: 'Static text after the typed part.' },
    { prop: 'typeSpeed', type: 'number', def: '70', desc: 'Milliseconds per typed letter (with a little human jitter).' },
    { prop: 'deleteSpeed', type: 'number', def: '40', desc: 'Milliseconds per deleted letter.' },
    { prop: 'pause', type: 'number', def: '1600', desc: 'How long a finished phrase stays, in ms.' },
    { prop: 'loop', type: 'boolean', def: 'true', desc: 'Start over after the last phrase.' },
    { prop: 'caret', type: "'bar' | 'block' | 'underscore' | 'none'", def: '"bar"', desc: 'Caret style.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Typed text and caret color.' },
    { prop: 'as', type: 'string', def: '"p"', desc: 'Element to render.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the text.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Only for the reduced-motion check.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function TypewriterTextDoc() {
    const [speed, setSpeed] = useState(70);
    const [caret, setCaret] = useState('bar');
    const [accent, setAccent] = useState('#a3e635');

    const code = `import TypewriterText from './ApexUI-Kit/TypewriterText/TypewriterText.jsx';

const App = () => (
  <TypewriterText
    as="h1"
    prefix="We build "
    words={["beautiful interfaces.", "smooth animations.", "faster launches."]}
    typeSpeed={${speed}}
    caret="${caret}"
    accentColor="${accent}"
    className="text-5xl font-bold"
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Typewriter Text"
            description="Types a phrase, pauses, deletes it and moves on to the next, with a blinking caret and a natural, slightly uneven rhythm."
            preview={
                <TypewriterText
                    key={`${speed}-${caret}`}
                    as="h2"
                    typeSpeed={speed}
                    caret={caret}
                    accentColor={accent}
                    className="text-center text-[clamp(1.8rem,5vw,3.25rem)] font-bold leading-tight tracking-tight text-[var(--ink)]"
                />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Typing speed" value={speed} onChange={setSpeed} min={25} max={200} step={5} format={(v) => `${v}ms`} />
                    <SelectControl label="Caret" value={caret} onChange={setCaret} options={[{ value: 'bar', label: 'Bar' }, { value: 'block', label: 'Block' }, { value: 'underscore', label: 'Underscore' }, { value: 'none', label: 'None' }]} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="typewriter-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
