import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import AuroraBackground from '../../../components/MainUI/ApexUI-Kit/AuroraBackground/AuroraBackground.jsx';

const PALETTES = {
    polar: { label: 'Polar', colors: ['#22d3ee', '#a3e635', '#a78bfa', '#38bdf8'] },
    sunset: { label: 'Sunset', colors: ['#f97316', '#f43f5e', '#a855f7', '#facc15'] },
    ocean: { label: 'Ocean', colors: ['#0ea5e9', '#2563eb', '#14b8a6', '#6366f1'] },
    forest: { label: 'Forest', colors: ['#22c55e', '#84cc16', '#10b981', '#a3e635'] },
};

const props = [
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content above the aurora.' },
    { prop: 'colors', type: 'string[]', def: 'polar palette', desc: 'Colors of the light bands.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Night sky or a light page.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Drift speed multiplier.' },
    { prop: 'intensity', type: 'number', def: '1', desc: 'How strong the light is.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the content wrapper.' },
    { prop: 'containerClassName', type: 'string', def: '""', desc: 'Classes for the outer container (defaults to h-screen).' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'CSS only', desc: 'Blurred, masked gradients with a keyframe drift, no canvas or WebGL.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AuroraBackgroundDoc() {
    const [palette, setPalette] = useState('polar');
    const [speed, setSpeed] = useState(1);
    const [intensity, setIntensity] = useState(1);
    const colors = PALETTES[palette].colors;

    const code = `import AuroraBackground from './ApexUI-Kit/AuroraBackground/AuroraBackground.jsx';

const App = () => (
  <AuroraBackground colors={${JSON.stringify(colors).replace(/,/g, ', ')}} speed={${speed}} intensity={${intensity}}>
    {/* Your content here */}
  </AuroraBackground>
);

export default App;`;

    return (
        <ComponentDoc
            title="Aurora Background"
            description="Soft northern-light bands that drift and shimmer, made only of blurred CSS gradients, tiny, smooth and friendly to light and dark pages."
            preview={
                <BackgroundDemo title="Aurora Background">
                    <AuroraBackground containerClassName="!h-full" colors={colors} speed={speed} intensity={intensity} />
                </BackgroundDemo>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Palette" value={palette} onChange={setPalette} options={Object.entries(PALETTES).map(([value, p]) => ({ value, label: p.label }))} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.2} max={4} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                    <RangeControl label="Intensity" value={intensity} onChange={setIntensity} min={0.3} max={1.6} step={0.05} format={(v) => v.toFixed(2)} />
                </ControlGrid>
            }
            code={code}
            cli="aurora-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
