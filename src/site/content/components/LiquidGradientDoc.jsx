import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import LiquidGradient from '../../../components/MainUI/ApexUI-Kit/LiquidGradient/LiquidGradient.jsx';

const PRESETS = {
    dusk: { label: 'Dusk', colors: ['#1e1b4b', '#4f46e5', '#db2777', '#f97316'] },
    aurora: { label: 'Aurora', colors: ['#022c22', '#0d9488', '#22d3ee', '#a3e635'] },
    ocean: { label: 'Ocean', colors: ['#020617', '#1d4ed8', '#0ea5e9', '#e0f2fe'] },
    ember: { label: 'Ember', colors: ['#1c0a00', '#9a3412', '#f59e0b', '#fde68a'] },
    mono: { label: 'Mono', colors: ['#09090b', '#27272a', '#71717a', '#e4e4e7'] },
};

const props = [
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content rendered above the gradient.' },
    { prop: 'colors', type: '[string, string, string, string]', def: 'dusk palette', desc: 'Four hex colors, from the deepest base to the brightest highlight.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Flow speed multiplier.' },
    { prop: 'scale', type: 'number', def: '1.6', desc: 'Size of the folds, higher means smaller, busier shapes.' },
    { prop: 'grain', type: 'number', def: '0.06', desc: 'Film grain amount (0 turns it off).' },
    { prop: 'mouseInteractive', type: 'boolean', def: 'true', desc: 'Colors lean toward the pointer.' },
    { prop: 'quality', type: 'number', def: '1', desc: 'Render resolution scale (0.5 halves the pixels for weaker devices).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the content wrapper.' },
    { prop: 'containerClassName', type: 'string', def: '""', desc: 'Classes for the outer container (defaults to h-screen).' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'OGL', desc: 'A tiny WebGL library (~25 kB), one triangle, one shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function LiquidGradientDoc() {
    const [preset, setPreset] = useState('dusk');
    const [speed, setSpeed] = useState(1);
    const [scale, setScale] = useState(1.6);
    const [grain, setGrain] = useState(0.06);
    const [mouse, setMouse] = useState(true);
    const colors = PRESETS[preset].colors;

    const code = `import LiquidGradient from './ApexUI-Kit/LiquidGradient/LiquidGradient.jsx';

const App = () => (
  <LiquidGradient
    colors={${JSON.stringify(colors).replace(/,/g, ', ')}}
    speed={${speed}}
    scale={${scale}}
    grain={${grain}}${mouse ? '' : '\n    mouseInteractive={false}'}
  >
    {/* Your content here */}
  </LiquidGradient>
);

export default App;`;

    return (
        <ComponentDoc
            title="Liquid Gradient"
            description="A slow, flowing four-color mesh gradient with film grain, drawn by a single lightweight OGL shader, it leans toward the pointer and pauses off screen."
            preview={
                <BackgroundDemo title="Liquid Gradient">
                    <LiquidGradient containerClassName="!h-full" colors={colors} speed={speed} scale={scale} grain={grain} mouseInteractive={mouse} />
                </BackgroundDemo>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Palette" value={preset} onChange={setPreset} options={Object.entries(PRESETS).map(([value, p]) => ({ value, label: p.label }))} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.2} max={3} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                    <RangeControl label="Scale" value={scale} onChange={setScale} min={0.6} max={3.5} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Grain" value={grain} onChange={setGrain} min={0} max={0.2} step={0.01} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Pointer pull" value={mouse} onChange={setMouse} />
                </ControlGrid>
            }
            code={code}
            cli="liquid-gradient"
            props={props}
            dependencies={dependencies}
        />
    );
}
