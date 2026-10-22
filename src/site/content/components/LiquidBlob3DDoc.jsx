import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import LiquidBlob3D from '../../../components/MainUI/ApexUI-Kit/LiquidBlob3D/LiquidBlob3D.jsx';

const PALETTES = {
    apex: ['#a3e635', '#22d3ee', '#a78bfa'],
    sunset: ['#f97316', '#f43f5e', '#facc15'],
    ocean: ['#0ea5e9', '#6366f1', '#5eead4'],
    chrome: ['#52525b', '#e4e4e7', '#ffffff'],
};

const props = [
    { prop: 'colors', type: 'string[]', def: 'lime / cyan / violet', desc: 'Two surface colors and a rim color.' },
    { prop: 'size', type: 'number', def: '22', desc: 'Canvas size in rem (shrinks on small screens).' },
    { prop: 'speed', type: 'number', def: '1', desc: 'How fast the surface flows.' },
    { prop: 'distortion', type: 'number', def: '0.24', desc: 'How far the surface bulges.' },
    { prop: 'detail', type: 'number', def: '48', desc: 'Mesh detail; lower is lighter.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Lean toward the pointer and ripple harder on hover.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function LiquidBlob3DDoc() {
    const [palette, setPalette] = useState('apex');
    const [speed, setSpeed] = useState(1);
    const [distortion, setDistortion] = useState(0.24);
    const [interactive, setInteractive] = useState(true);
    return (
        <ComponentDoc
            title="Liquid Blob 3D"
            description="A glossy three.js blob whose surface flows with 3D noise and an iridescent rim. It leans toward the pointer and ripples harder on hover. One mesh and one shader, so it stays light."
            preview={<LiquidBlob3D colors={PALETTES[palette]} speed={speed} distortion={distortion} interactive={interactive} />}
            controls={
                <ControlGrid>
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }, { value: 'chrome', label: 'Chrome' }]} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.2} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <RangeControl label="Distortion" value={distortion} onChange={setDistortion} min={0.05} max={0.6} step={0.01} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Follow pointer" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import LiquidBlob3D from './ApexUI-Kit/LiquidBlob3D/LiquidBlob3D.jsx';

const App = () => (
  <LiquidBlob3D
    colors={${JSON.stringify(PALETTES[palette])}}
    speed={${speed}}
    distortion={${distortion}}${interactive ? '' : '\n    interactive={false}'}
  />
);

export default App;`}
            cli="liquid-blob-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
