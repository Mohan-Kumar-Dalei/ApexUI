import { useState } from 'react';
import ComponentDoc, { DocSection } from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import SketchReveal from '../../../components/MainUI/ApexUI-Kit/SketchReveal/SketchReveal.jsx';

const photo = (id) => `https://images.unsplash.com/${id}?w=1800&q=80&auto=format&fit=crop`;
const PAIRS = {
    peaks: [photo('photo-1464822759023-fed622ff2c3b'), photo('photo-1506905925346-21bda4d32df4')],
    city: [photo('photo-1477959858617-67f85cf4f1df'), photo('photo-1480714378408-67cf0d13bc1b')],
    sea: [photo('photo-1505144808419-1957a94ca61e'), photo('photo-1518837695005-2083093ee35b')],
};

const props = [
    { prop: 'from', type: 'string', def: 'demo photo', desc: 'The picture that turns into a sketch (needs CORS from another domain).' },
    { prop: 'to', type: 'string', def: 'demo photo', desc: 'The picture revealed by the burning circle.' },
    { prop: 'mode', type: "'scroll' | 'hover' | 'auto' | 'manual'", def: '"scroll"', desc: 'What drives it: the page scroll (the section pins), hover, a loop, or your progress value.' },
    { prop: 'progress', type: 'number', def: '0', desc: 'Progress from 0 to 1 when mode is manual.' },
    { prop: 'scrollLength', type: 'number', def: '150', desc: 'Extra scroll distance in vh the reveal plays over (scroll mode).' },
    { prop: 'stickyTop', type: 'number', def: '0', desc: 'Pixels to pin below the top, e.g. your sticky header height (scroll mode).' },
    { prop: 'edgeColor', type: 'string', def: '"#fff4d6"', desc: 'Colour of the sketch lines and the burning edge.' },
    { prop: 'sparkle', type: 'number', def: '1', desc: 'How much the burning edge flickers (0 is a clean glow).' },
    { prop: 'center', type: '[number, number]', def: '[0.5, 0.5]', desc: 'Where the circle starts, as 0..1 of the width and height.' },
    { prop: 'duration', type: 'number', def: '6', desc: 'Seconds per loop in auto mode.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'Height outside scroll mode (scroll mode fills the screen).' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content shown on top, e.g. a headline.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the edge detection and dissolve shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function SketchRevealDoc() {
    const [pair, setPair] = useState('peaks');
    const [mode, setMode] = useState('auto');
    const [progress, setProgress] = useState(0.5);
    const [edge, setEdge] = useState('#fff4d6');
    const [sparkle, setSparkle] = useState(1);
    const [from, to] = PAIRS[pair];

    return (
        <ComponentDoc
            title="Sketch Reveal"
            description="One picture turns into a glowing line sketch, then a ragged, pixelated circle burns outward from the centre and reveals a second picture, with sparks along the burning edge. One WebGL shader does the edge detection and the dissolve. Drive it with the page scroll (the section pins while it plays), with hover, on a loop or with your own progress."
            preview={
                <div className="absolute inset-0">
                    <SketchReveal key={pair} from={from} to={to} mode={mode} progress={progress} edgeColor={edge} sparkle={sparkle}>
                        <div className="flex h-full flex-col items-center justify-end px-6 pb-10 text-center text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
                            <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/75">{mode === 'hover' ? 'Hover me' : mode === 'manual' ? 'Drag the progress slider' : 'Plays on a loop'}</p>
                            <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">From sketch to light</h3>
                        </div>
                    </SketchReveal>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Pictures" value={pair} onChange={setPair} options={[{ value: 'peaks', label: 'Peaks' }, { value: 'city', label: 'City' }, { value: 'sea', label: 'Sea' }]} />
                    <SelectControl label="Mode" value={mode} onChange={setMode} options={[{ value: 'auto', label: 'Auto loop' }, { value: 'hover', label: 'Hover' }, { value: 'manual', label: 'Manual' }]} />
                    <RangeControl label="Progress" value={progress} onChange={(v) => (setProgress(v), setMode('manual'))} min={0} max={1} step={0.01} format={(v) => v.toFixed(2)} />
                    <ColorControl label="Edge" value={edge} onChange={setEdge} />
                    <RangeControl label="Sparkle" value={sparkle} onChange={setSparkle} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                </ControlGrid>
            }
            extraToc={[{ id: 'scroll-demo', label: 'On a real page' }]}
            extra={
                <DocSection id="scroll-demo" title="On a real page" description="The normal use: scroll down and the section pins while the picture turns into a sketch and burns away into the next one.">
                    <div className="overflow-clip rounded-2xl">
                        <SketchReveal from={from} to={to} mode="scroll" stickyTop={64} scrollLength={120} edgeColor={edge} sparkle={sparkle}>
                            <div className="flex h-full items-end p-8 text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
                                <h3 className="text-3xl font-black tracking-tight sm:text-5xl">Keep scrolling</h3>
                            </div>
                        </SketchReveal>
                    </div>
                </DocSection>
            }
            code={`import SketchReveal from './ApexUI-Kit/SketchReveal/SketchReveal.jsx';

const App = () => (
  <>
    {/* Pins while you scroll and plays the reveal. */}
    <SketchReveal from="/before.jpg" to="/after.jpg" edgeColor="${edge}" sparkle={${sparkle}}>
      <h2 className="p-10 text-6xl font-black text-white">From sketch to light</h2>
    </SketchReveal>

    {/* Or on hover inside a card */}
    <div className="h-96">
      <SketchReveal from="/before.jpg" to="/after.jpg" mode="hover" />
    </div>
  </>
);

export default App;`}
            cli="sketch-reveal"
            props={props}
            dependencies={dependencies}
        />
    );
}
