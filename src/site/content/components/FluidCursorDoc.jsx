import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import FluidCursor from '../../../components/MainUI/ApexUI-Kit/FluidCursor/FluidCursor.jsx';

const PALETTES = {
    rainbow: [],
    lime: ['#a3e635', '#22d3ee', '#4ade80'],
    sunset: ['#ff6a3d', '#f472b6', '#facc15'],
    ocean: ['#38bdf8', '#6366f1', '#22d3ee'],
};

const props = [
    { prop: 'colors', type: 'string[]', def: '[] (rainbow)', desc: 'Ink colours, used in turn. Leave empty for a slowly shifting rainbow.' },
    { prop: 'dissipation', type: 'number', def: '1.6', desc: 'How fast the ink fades (higher clears sooner).' },
    { prop: 'velocityDissipation', type: 'number', def: '1.2', desc: 'How fast the motion settles.' },
    { prop: 'curl', type: 'number', def: '18', desc: 'Strength of the swirls (vorticity).' },
    { prop: 'splatRadius', type: 'number', def: '0.22', desc: 'Size of the ink the cursor leaves.' },
    { prop: 'splatForce', type: 'number', def: '6000', desc: 'How hard the cursor pushes the fluid.' },
    { prop: 'idle', type: 'boolean', def: 'true', desc: 'Soft splashes when nobody has moved for a while.' },
    { prop: 'simResolution', type: 'number', def: '128', desc: 'Simulation grid size (higher is finer and heavier).' },
    { prop: 'dyeResolution', type: 'number', def: '1024', desc: 'Ink texture size.' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Optional content inside the layer.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes. The layer fills its nearest positioned parent.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the fluid simulation passes on the GPU.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function FluidCursorDoc() {
    const [palette, setPalette] = useState('rainbow');
    const [dissipation, setDissipation] = useState(1.6);
    const [curl, setCurl] = useState(18);
    const [radius, setRadius] = useState(0.22);
    const [idle, setIdle] = useState(true);

    return (
        <ComponentDoc
            title="Fluid Cursor"
            description="A real-time fluid simulation that trails the pointer, drawn in WebGL. Moving the cursor pushes coloured ink through the fluid: it swirls, spreads and slowly fades, and a click blows a burst. It sits over its parent as a transparent layer and never blocks clicks, so the content underneath stays usable."
            preview={
                <div className="absolute inset-0 bg-[#07070b]">
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/50">Move · Click</p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight @md:text-5xl @3xl:text-6xl">Paint with fluid</h3>
                    </div>
                    <FluidCursor colors={PALETTES[palette]} dissipation={dissipation} curl={curl} splatRadius={radius} idle={idle} />
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Colours" value={palette} onChange={setPalette} options={[{ value: 'rainbow', label: 'Rainbow' }, { value: 'lime', label: 'Lime' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                    <RangeControl label="Fade" value={dissipation} onChange={setDissipation} min={0.3} max={6} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Swirl" value={curl} onChange={setCurl} min={0} max={50} step={1} />
                    <RangeControl label="Ink size" value={radius} onChange={setRadius} min={0.05} max={0.8} step={0.01} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Idle splashes" value={idle} onChange={setIdle} />
                </ControlGrid>
            }
            code={`import FluidCursor from './ApexUI-Kit/FluidCursor/FluidCursor.jsx';

const App = () => (
  <section className="relative h-screen bg-black">
    <h1 className="pt-40 text-center text-6xl font-black text-white">Paint with fluid</h1>
    {/* Fills the section and never blocks clicks. */}
    <FluidCursor${palette === 'rainbow' ? '' : ` colors={${JSON.stringify(PALETTES[palette])}}`} dissipation={${dissipation}} curl={${curl}} splatRadius={${radius}}${idle ? '' : ' idle={false}'} />
  </section>
);

export default App;`}
            cli="fluid-cursor"
            props={props}
            dependencies={dependencies}
        />
    );
}
