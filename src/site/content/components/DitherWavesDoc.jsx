import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import DitherWaves from '../../../components/MainUI/ApexUI-Kit/DitherWaves/DitherWaves.jsx';

const props = [
    { prop: 'ink', type: 'string', def: '"#c8f560"', desc: 'Color of the lit pixels.' },
    { prop: 'paper', type: 'string', def: '"#0b0d0a"', desc: 'Background color.' },
    { prop: 'pixelSize', type: 'number', def: '3', desc: 'Size of each pixel in CSS px.' },
    { prop: 'matrix', type: '4 | 8', def: '8', desc: 'Bayer matrix: 4 is chunkier, 8 gives smoother tones.' },
    { prop: 'scale', type: 'number', def: '2.4', desc: 'Size of the waves (higher is busier).' },
    { prop: 'contrast', type: 'number', def: '1.35', desc: 'Pushes tones toward pure ink or paper.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Flow speed.' },
    { prop: 'ripple', type: 'number', def: '1', desc: 'Strength of the ripples the pointer drops.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Ripples and glow under the pointer; click or tap drops a ripple.' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content shown on top.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the single full-screen shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const PALETTES = {
    lime: ['#c8f560', '#0b0d0a'],
    amber: ['#ffb000', '#1a0f00'],
    ice: ['#9ad8ff', '#071320'],
    paper: ['#1c1c1c', '#f1ede4'],
};

export default function DitherWavesDoc() {
    const [palette, setPalette] = useState('lime');
    const [ink, setInk] = useState(PALETTES.lime[0]);
    const [paper, setPaper] = useState(PALETTES.lime[1]);
    const [pixelSize, setPixelSize] = useState(3);
    const [matrix, setMatrix] = useState(8);
    const [scale, setScale] = useState(2.4);
    const [interactive, setInteractive] = useState(true);
    const pick = (p) => {
        setPalette(p);
        setInk(PALETTES[p][0]);
        setPaper(PALETTES[p][1]);
    };

    return (
        <ComponentDoc
            title="Dither Waves"
            description="Slow flowing waves turned into crisp two-tone pixel art with ordered Bayer dithering, all in one WebGL shader. Moving the pointer drops ripples that spread through the pattern, and a click drops one where you tap."
            preview={
                <div className="absolute inset-0">
                    <DitherWaves ink={ink} paper={paper} pixelSize={pixelSize} matrix={matrix} scale={scale} interactive={interactive}>
                        <div className="pointer-events-none flex h-full flex-col items-center justify-center px-6 text-center">
                            <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.35em]" style={{ color: ink }}>
                                [ 1-bit ]
                            </p>
                            <h3 className="mt-2 rounded-md px-3 py-1 font-mono text-4xl font-black tracking-tight sm:text-6xl" style={{ color: ink, background: paper }}>
                                Dither Waves
                            </h3>
                        </div>
                    </DitherWaves>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Palette" value={palette} onChange={pick} options={[{ value: 'lime', label: 'Lime' }, { value: 'amber', label: 'Amber' }, { value: 'ice', label: 'Ice' }, { value: 'paper', label: 'Paper' }]} />
                    <ColorControl label="Ink" value={ink} onChange={setInk} />
                    <ColorControl label="Paper" value={paper} onChange={setPaper} />
                    <RangeControl label="Pixel size" value={pixelSize} onChange={setPixelSize} min={1} max={8} step={1} format={(v) => `${v}px`} />
                    <SelectControl label="Matrix" value={String(matrix)} onChange={(v) => setMatrix(Number(v))} options={[{ value: '8', label: 'Bayer 8x8' }, { value: '4', label: 'Bayer 4x4' }]} />
                    <RangeControl label="Scale" value={scale} onChange={setScale} min={0.8} max={6} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Interactive" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import DitherWaves from './ApexUI-Kit/DitherWaves/DitherWaves.jsx';

const App = () => (
  <section className="h-screen">
    <DitherWaves ink="${ink}" paper="${paper}" pixelSize={${pixelSize}} matrix={${matrix}} scale={${scale}}${interactive ? '' : ' interactive={false}'}>
      <h1 className="pt-40 text-center font-mono text-6xl font-black">Dither Waves</h1>
    </DitherWaves>
  </section>
);

export default App;`}
            cli="dither-waves"
            props={props}
            dependencies={dependencies}
        />
    );
}
