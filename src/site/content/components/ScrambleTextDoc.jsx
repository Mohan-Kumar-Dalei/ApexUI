import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import ScrambleText from '../../../components/MainUI/ApexUI-Kit/ScrambleText/ScrambleText.jsx';

const props = [
    { prop: 'text', type: 'string', def: '"Decrypting the future"', desc: 'The text to reveal.' },
    { prop: 'as', type: 'string', def: '"span"', desc: 'Element to render, e.g. "h1" or "a".' },
    { prop: 'trigger', type: "'view' | 'hover' | 'loop'", def: '"view"', desc: 'Scramble once when it scrolls into view, every time it is hovered, or on repeat.' },
    { prop: 'speed', type: 'number', def: '40', desc: 'Milliseconds between scramble ticks.' },
    { prop: 'revealRate', type: 'number', def: '2', desc: 'Ticks before the next letter locks in (higher is slower).' },
    { prop: 'direction', type: "'start' | 'end' | 'center' | 'random'", def: '"start"', desc: 'Order in which letters lock in.' },
    { prop: 'characters', type: 'string', def: 'A to Z, 0 to 9, symbols', desc: 'Characters used while scrambling.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Color of letters that are still scrambling.' },
    { prop: 'loopDelay', type: 'number', def: '2400', desc: 'Pause between runs when trigger is "loop", in ms.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the text element.' },
    { prop: '...rest', type: 'any', def: 'none', desc: 'Other props (href, onClick…) go to the element.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'useInView to start when visible.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const opts = (list) => list.map(([value, label]) => ({ value, label }));

export default function ScrambleTextDoc() {
    const [trigger, setTrigger] = useState('loop');
    const [direction, setDirection] = useState('start');
    const [speed, setSpeed] = useState(40);
    const [revealRate, setRevealRate] = useState(2);
    const [accent, setAccent] = useState('#a3e635');

    const settings = { trigger, direction, speed, revealRate, accentColor: accent };

    const code = `import ScrambleText from './ApexUI-Kit/ScrambleText/ScrambleText.jsx';

const App = () => (
  <ScrambleText
    as="h1"
    text="Decrypting the future"
    trigger="${trigger}"
    direction="${direction}"
    speed={${speed}}
    revealRate={${revealRate}}
    accentColor="${accent}"
    className="text-6xl font-bold tracking-tight"
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Scramble Text"
            description="Letters cycle through random characters and lock in one by one, like text being decrypted, on view, on hover or on a loop, without any layout shift."
            preview={
                <div key={JSON.stringify(settings)} className="flex w-full flex-col items-center gap-6 text-center">
                    <ScrambleText as="h2" text="Decrypting the future" {...settings} className="text-[clamp(2rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight" />
                    <ScrambleText text="SYSTEM ONLINE · ACCESS GRANTED" {...settings} className="font-mono text-[0.8rem] tracking-[0.2em] text-[var(--ink-3)]" />
                    <div className="mt-2 flex flex-wrap justify-center gap-5 text-[0.95rem] font-medium">
                        {['Projects', 'About', 'Contact'].map((label) => (
                            <ScrambleText key={label} as="a" href="#" onClick={(e) => e.preventDefault()} text={label} trigger="hover" accentColor={accent} className="cursor-pointer underline-offset-4 hover:underline" />
                        ))}
                    </div>
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Trigger" value={trigger} onChange={setTrigger} options={opts([['loop', 'Loop'], ['view', 'On view'], ['hover', 'On hover']])} />
                    <SelectControl label="Direction" value={direction} onChange={setDirection} options={opts([['start', 'Start'], ['end', 'End'], ['center', 'Center'], ['random', 'Random']])} />
                    <RangeControl label="Tick speed" value={speed} onChange={setSpeed} min={20} max={100} step={5} format={(v) => `${v}ms`} />
                    <RangeControl label="Reveal rate" value={revealRate} onChange={setRevealRate} min={1} max={6} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="scramble-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
