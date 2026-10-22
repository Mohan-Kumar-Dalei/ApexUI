import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import RetroGrid3D from '../../../components/MainUI/ApexUI-Kit/RetroGrid3D/RetroGrid3D.jsx';

const THEMES = {
    synthwave: { lineColor: '#e879f9', sunColors: ['#fde047', '#f43f5e'], skyColors: ['#1e0b3a', '#05020d'], groundColor: '#0b0618' },
    apex: { lineColor: '#a3e635', sunColors: ['#d9f99d', '#22d3ee'], skyColors: ['#052e2b', '#020617'], groundColor: '#030712' },
    ocean: { lineColor: '#38bdf8', sunColors: ['#fef08a', '#fb7185'], skyColors: ['#0c1e46', '#020617'], groundColor: '#020617' },
};

const props = [
    { prop: 'lineColor', type: 'string', def: '"#e879f9"', desc: 'Grid line color.' },
    { prop: 'groundColor', type: 'string', def: '"#0b0618"', desc: 'Ground fill.' },
    { prop: 'sunColors', type: '[top, bottom]', def: 'yellow / rose', desc: 'Sun gradient.' },
    { prop: 'skyColors', type: '[horizon, top]', def: 'purple / black', desc: 'Sky gradient behind the scene.' },
    { prop: 'speed', type: 'number', def: '1.2', desc: 'How fast the ground scrolls toward you.' },
    { prop: 'hills', type: 'number', def: '1.4', desc: 'Hill height; 0 is a flat grid.' },
    { prop: 'showSun', type: 'boolean', def: 'true', desc: 'Show the striped sun.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'CSS height of the section.' },
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content shown on top, centered.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function RetroGrid3DDoc() {
    const [theme, setTheme] = useState('synthwave');
    const [speed, setSpeed] = useState(1.2);
    const [hills, setHills] = useState(1.4);
    const [sun, setSun] = useState(true);
    const t = THEMES[theme];
    return (
        <ComponentDoc
            title="Retro Grid 3D"
            description="A three.js synthwave landscape: glowing grid lines over rolling hills that scroll toward you, a flat road down the middle and a striped sun on the horizon. Cheap enough for a hero background."
            preview={
                <div className="absolute inset-0">
                <RetroGrid3D {...t} speed={speed} hills={hills} showSun={sun}>
                    <div className="px-6 pb-[22%] text-center text-white">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">ApexUI</p>
                        <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Drive into 3D</h3>
                    </div>
                </RetroGrid3D>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={[{ value: 'synthwave', label: 'Synthwave' }, { value: 'apex', label: 'Apex' }, { value: 'ocean', label: 'Ocean' }]} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={4} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <RangeControl label="Hills" value={hills} onChange={setHills} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Sun" value={sun} onChange={setSun} />
                </ControlGrid>
            }
            code={`import RetroGrid3D from './ApexUI-Kit/RetroGrid3D/RetroGrid3D.jsx';

const App = () => (
  <RetroGrid3D
    height="100vh"
    lineColor="${t.lineColor}"
    sunColors={${JSON.stringify(t.sunColors)}}
    speed={${speed}}
    hills={${hills}}${sun ? '' : '\n    showSun={false}'}
  >
    <h1 className="text-6xl font-black text-white">Drive into 3D</h1>
  </RetroGrid3D>
);

export default App;`}
            cli="retro-grid-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
