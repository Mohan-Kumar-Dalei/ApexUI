import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import ParticleText from '../../../components/MainUI/ApexUI-Kit/ParticleText/ParticleText.jsx';

const props = [
    { prop: 'text', type: 'string', def: '"ApexUI"', desc: 'The words built from particles (shrinks to fit the width).' },
    { prop: 'intro', type: "'assemble' | 'fall' | 'explode' | 'wave'", def: '"assemble"', desc: 'How the particles arrive.' },
    { prop: 'replayOn', type: "'none' | 'hover' | 'click'", def: '"none"', desc: 'Play the intro again on hover or click.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Color of particles while they move.' },
    { prop: 'color', type: 'string', def: '"currentColor"', desc: 'Color of settled particles; follows the text color by default.' },
    { prop: 'particleSize', type: 'number', def: '2', desc: 'Particle size in px.' },
    { prop: 'gap', type: 'number', def: '4', desc: 'Sampling step in px; lower means more particles.' },
    { prop: 'repelRadius', type: 'number', def: '90', desc: 'How close the pointer pushes particles away, in px.' },
    { prop: 'repelStrength', type: 'number', def: '1', desc: 'How hard the pointer pushes.' },
    { prop: 'clickBurst', type: 'boolean', def: 'true', desc: 'A click sends a shockwave; particles spring back.' },
    { prop: 'fontSize', type: 'number', def: '9', desc: 'Largest text size in rem.' },
    { prop: 'fontWeight', type: 'number', def: '800', desc: 'Font weight used to draw the text.' },
    { prop: 'fontFamily', type: 'string', def: 'inherited', desc: 'Font family; defaults to the surrounding font.' },
    { prop: 'height', type: 'string', def: '"20rem"', desc: 'CSS height of the canvas area.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Canvas 2D', desc: 'Built into the browser, no library needed.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ParticleTextDoc() {
    const [text, setText] = useState('ApexUI');
    const [intro, setIntro] = useState('assemble');
    const [replay, setReplay] = useState('hover');
    const [accent, setAccent] = useState('#a3e635');
    const [size, setSize] = useState(2);
    const [gap, setGap] = useState(4);
    const [burst, setBurst] = useState(true);
    return (
        <ComponentDoc
            title="Particle Text"
            description="Your text rebuilt from thousands of canvas particles. They fly in to form the words, move out of the pointer's way and light up while moving; a click sends a shockwave before they spring back. The loop sleeps once everything settles."
            preview={
                <ParticleText
                    key={`${intro}-${text}`}
                    text={text}
                    intro={intro}
                    replayOn={replay}
                    accentColor={accent}
                    particleSize={size}
                    gap={gap}
                    clickBurst={burst}
                    className="text-[var(--stage-ink)]"
                />
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Text" value={text} onChange={setText} options={['ApexUI', 'Launch', 'Hello', '2026']} />
                    <SelectControl label="Intro" value={intro} onChange={setIntro} options={['assemble', 'fall', 'explode', 'wave']} />
                    <SelectControl label="Replay on" value={replay} onChange={setReplay} options={['none', 'hover', 'click']} />
                    <RangeControl label="Particle size" value={size} onChange={setSize} min={1} max={4} step={0.5} format={(v) => `${v}px`} />
                    <RangeControl label="Gap" value={gap} onChange={setGap} min={3} max={8} step={1} format={(v) => `${v}px`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <ToggleControl label="Click burst" value={burst} onChange={setBurst} />
                </ControlGrid>
            }
            code={`import ParticleText from './ApexUI-Kit/ParticleText/ParticleText.jsx';

const App = () => (
  <ParticleText
    text="${text}"
    intro="${intro}"
    replayOn="${replay}"
    accentColor="${accent}"
    particleSize={${size}}
    gap={${gap}}${burst ? '' : '\n    clickBurst={false}'}
    height="24rem"
  />
);

export default App;`}
            cli="particle-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
