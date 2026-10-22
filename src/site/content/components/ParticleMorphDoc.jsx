import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import ParticleMorph from '../../../components/MainUI/ApexUI-Kit/ParticleMorph/ParticleMorph.jsx';

const PALETTES = { apex: ['#a3e635', '#22d3ee'], aurora: ['#a78bfa', '#f472b6'], fire: ['#facc15', '#f43f5e'] };

const props = [
    { prop: 'shapes', type: "('sphere' | 'cube' | 'torus' | 'helix' | 'wave')[]", def: 'all five', desc: 'Shapes to morph between, in order.' },
    { prop: 'count', type: 'number', def: '6000', desc: 'Number of particles.' },
    { prop: 'colors', type: '[string, string]', def: 'lime / cyan', desc: 'Particles blend between these two.' },
    { prop: 'interval', type: 'number', def: '3500', desc: 'Milliseconds per shape when auto playing.' },
    { prop: 'pointSize', type: 'number', def: '3', desc: 'Particle size.' },
    { prop: 'autoPlay', type: 'boolean', def: 'true', desc: 'Morph on a timer (clicks always morph).' },
    { prop: 'height', type: 'number', def: '26', desc: 'Canvas height in rem.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ParticleMorphDoc() {
    const [palette, setPalette] = useState('apex');
    const [count, setCount] = useState(6000);
    const [size, setSize] = useState(3);
    const [auto, setAuto] = useState(true);
    return (
        <ComponentDoc
            title="Particle Morph"
            description="Thousands of glowing three.js particles that swarm between a sphere, cube, torus, DNA helix and a wave. Morphs on a timer or on click, drifts with the pointer, all in a single draw call."
            preview={<ParticleMorph key={count} colors={PALETTES[palette]} count={count} pointSize={size} autoPlay={auto} className="text-[var(--ink)]" />}
            controls={
                <ControlGrid>
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'aurora', label: 'Aurora' }, { value: 'fire', label: 'Fire' }]} />
                    <RangeControl label="Particles" value={count} onChange={setCount} min={1000} max={12000} step={500} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={1} max={6} step={0.5} />
                    <ToggleControl label="Auto play" value={auto} onChange={setAuto} />
                </ControlGrid>
            }
            code={`import ParticleMorph from './ApexUI-Kit/ParticleMorph/ParticleMorph.jsx';

const App = () => (
  <ParticleMorph
    shapes={["sphere", "torus", "helix"]}
    count={${count}}
    colors={${JSON.stringify(PALETTES[palette])}}
    pointSize={${size}}${auto ? '' : '\n    autoPlay={false}'}
  />
);

export default App;`}
            cli="particle-morph"
            props={props}
            dependencies={dependencies}
        />
    );
}
