import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import Galaxy3D from '../../../components/MainUI/ApexUI-Kit/Galaxy3D/Galaxy3D.jsx';

const PALETTES = {
    milky: ['#fde68a', '#a78bfa', '#22d3ee'],
    apex: ['#ecfccb', '#a3e635', '#0ea5e9'],
    nebula: ['#fef3c7', '#f472b6', '#6366f1'],
};

const props = [
    { prop: 'count', type: 'number', def: '30000', desc: 'Number of stars.' },
    { prop: 'arms', type: 'number', def: '4', desc: 'Spiral arms.' },
    { prop: 'spin', type: 'number', def: '1.2', desc: 'How tightly the arms curl.' },
    { prop: 'colors', type: '[core, middle, edge]', def: 'gold / violet / cyan', desc: 'Star colors from the core outward.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Rotation speed.' },
    { prop: 'starSize', type: 'number', def: '1', desc: 'Star size multiplier.' },
    { prop: 'tilt', type: 'number', def: '0.9', desc: 'Tilt of the disc in radians.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'CSS height of the section.' },
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content shown on top, centered.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function Galaxy3DDoc() {
    const [palette, setPalette] = useState('milky');
    const [arms, setArms] = useState(4);
    const [speed, setSpeed] = useState(1);
    const [size, setSize] = useState(1);
    return (
        <ComponentDoc
            title="Galaxy 3D"
            description="A three.js spiral galaxy of glowing stars that slowly turns, tilted so you see its arms in depth, with a soft parallax that follows the pointer. The spin runs on the GPU, so it is a light hero background."
            preview={
                <div className="absolute inset-0">
                    <Galaxy3D key={`${palette}-${arms}`} colors={PALETTES[palette]} arms={arms} speed={speed} starSize={size}>
                        <div className="px-6 text-center text-white">
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">ApexUI</p>
                            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Build among the stars</h3>
                        </div>
                    </Galaxy3D>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'milky', label: 'Milky Way' }, { value: 'apex', label: 'Apex' }, { value: 'nebula', label: 'Nebula' }]} />
                    <RangeControl label="Arms" value={arms} onChange={setArms} min={2} max={7} step={1} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={4} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <RangeControl label="Star size" value={size} onChange={setSize} min={0.4} max={2.5} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                </ControlGrid>
            }
            code={`import Galaxy3D from './ApexUI-Kit/Galaxy3D/Galaxy3D.jsx';

const App = () => (
  <Galaxy3D
    height="100vh"
    arms={${arms}}
    speed={${speed}}
    colors={${JSON.stringify(PALETTES[palette])}}
  >
    <h1 className="text-6xl font-black text-white">Build among the stars</h1>
  </Galaxy3D>
);

export default App;`}
            cli="galaxy-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
