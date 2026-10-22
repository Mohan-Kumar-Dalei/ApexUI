import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import WarpTunnel from '../../../components/MainUI/ApexUI-Kit/WarpTunnel/WarpTunnel.jsx';

const PALETTES = { apex: ['#a3e635', '#8b5cf6'], ice: ['#22d3ee', '#e0f2fe'], ember: ['#f97316', '#f43f5e'] };

const props = [
    { prop: 'colors', type: '[string, string]', def: 'lime / violet', desc: 'The tunnel blends between these.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Travel speed.' },
    { prop: 'density', type: 'number', def: '1', desc: 'How many rings fill the tunnel.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Bend toward the pointer; hold to boost into warp.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'CSS height of the section.' },
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content shown on top, centered.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function WarpTunnelDoc() {
    const [palette, setPalette] = useState('apex');
    const [speed, setSpeed] = useState(1);
    const [density, setDensity] = useState(1);
    const [interactive, setInteractive] = useState(true);
    return (
        <ComponentDoc
            title="Warp Tunnel"
            description="A hyperspace tunnel drawn in a single WebGL shader: glowing rings and streaks rush toward you, the tunnel bends toward the pointer, and holding the mouse or a finger boosts into warp speed."
            preview={
                <div className="absolute inset-0">
                    <WarpTunnel colors={PALETTES[palette]} speed={speed} density={density} interactive={interactive}>
                        <div className="pointer-events-none px-6 text-center text-white">
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">Hold to boost</p>
                            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Ship at light speed</h3>
                        </div>
                    </WarpTunnel>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'ice', label: 'Ice' }, { value: 'ember', label: 'Ember' }]} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <RangeControl label="Density" value={density} onChange={setDensity} min={0.4} max={2.5} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Interactive" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import WarpTunnel from './ApexUI-Kit/WarpTunnel/WarpTunnel.jsx';

const App = () => (
  <WarpTunnel
    height="100vh"
    colors={${JSON.stringify(PALETTES[palette])}}
    speed={${speed}}
    density={${density}}${interactive ? '' : '\n    interactive={false}'}
  >
    <h1 className="text-6xl font-black text-white">Ship at light speed</h1>
  </WarpTunnel>
);

export default App;`}
            cli="warp-tunnel"
            props={props}
            dependencies={dependencies}
        />
    );
}
