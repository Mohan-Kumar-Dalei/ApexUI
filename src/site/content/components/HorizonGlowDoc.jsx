import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import HorizonGlow from '../../../components/MainUI/ApexUI-Kit/HorizonGlow/HorizonGlow.jsx';

const props = [
    { prop: 'preset', type: "'lilac' | 'ocean' | 'ember' | 'mint' | 'mono'", def: '"lilac"', desc: 'Color set for the sky, mid tone and glow core.' },
    { prop: 'skyColor', type: 'string', def: 'from preset', desc: 'Color at the top and corners.' },
    { prop: 'midColor', type: 'string', def: 'from preset', desc: 'Tone between the core and the sky.' },
    { prop: 'coreColor', type: 'string', def: 'from preset', desc: 'Brightest color, at the bottom center.' },
    { prop: 'spread', type: 'number', def: '1.3', desc: 'How far up the glow reaches, in screen heights.' },
    { prop: 'intensity', type: 'number', def: '1', desc: 'Brightness of the glow.' },
    { prop: 'duration', type: 'number', def: '2.4', desc: 'Seconds the glow takes to rise in.' },
    { prop: 'autoRise', type: 'boolean', def: 'true', desc: 'Rise on mount. When false the glow is already up.' },
    { prop: 'breathe', type: 'number', def: '1', desc: 'Strength of the slow pulse (0 holds it still).' },
    { prop: 'shimmer', type: 'number', def: '1', desc: 'Strength of the drifting shimmer inside the glow.' },
    { prop: 'accentColor', type: 'string', def: 'from preset', desc: 'Tint of the band between the core and the mid tone, the arc and the rays.' },
    { prop: 'arc', type: 'number', def: '0.7', desc: 'Brightness of the thin horizon arc at the source (0 hides it).' },
    { prop: 'rays', type: 'number', def: '1', desc: 'Strength of the light rays climbing out of the glow.' },
    { prop: 'dust', type: 'number', def: '1', desc: 'Specks of dust drifting up through the light.' },
    { prop: 'grain', type: 'number', def: '0.4', desc: 'Film grain (a little always stays on to stop banding).' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Speed of the pulse and shimmer.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Glow leans toward the pointer.' },
    { prop: 'replay', type: 'number', def: '0', desc: 'Change this value to play the rise again.' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content shown on top, e.g. your hero.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the single full-screen shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function HorizonGlowDoc() {
    const [preset, setPreset] = useState('lilac');
    const [spread, setSpread] = useState(1.3);
    const [intensity, setIntensity] = useState(1);
    const [shimmer, setShimmer] = useState(1);
    const [arc, setArc] = useState(0.7);
    const [rays, setRays] = useState(1);
    const [dust, setDust] = useState(1);
    const [interactive, setInteractive] = useState(true);

    return (
        <ComponentDoc
            title="Horizon Glow"
            description="A soft, wide light rising from below the bottom edge, fading from a pale core through an accent band and a mid tone into a deep sky. Drawn in one WebGL shader: a thin luminous arc marks the horizon, faint rays climb out of it and dust drifts up through the light. It rises in on mount, breathes slowly and leans toward the pointer, with a filmic curve and dithering so the gradient stays silky."
            preview={
                <div className="absolute inset-0">
                    <HorizonGlow preset={preset} spread={spread} intensity={intensity} shimmer={shimmer} arc={arc} rays={rays} dust={dust} interactive={interactive}>
                        <div className="pointer-events-none flex h-full flex-col items-center justify-center px-6 text-center text-white">
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">First light</p>
                            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Glow from below</h3>
                        </div>
                    </HorizonGlow>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Preset" value={preset} onChange={setPreset} options={[{ value: 'lilac', label: 'Lilac' }, { value: 'ocean', label: 'Ocean' }, { value: 'ember', label: 'Ember' }, { value: 'mint', label: 'Mint' }, { value: 'mono', label: 'Mono' }]} />
                    <RangeControl label="Spread" value={spread} onChange={setSpread} min={0.5} max={2} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Intensity" value={intensity} onChange={setIntensity} min={0.3} max={1.4} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Shimmer" value={shimmer} onChange={setShimmer} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Horizon arc" value={arc} onChange={setArc} min={0} max={1.5} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Rays" value={rays} onChange={setRays} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Dust" value={dust} onChange={setDust} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Follow pointer" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import HorizonGlow from './ApexUI-Kit/HorizonGlow/HorizonGlow.jsx';

const App = () => (
  <section className="h-screen">
    <HorizonGlow preset="${preset}" spread={${spread}} intensity={${intensity}} shimmer={${shimmer}} arc={${arc}} rays={${rays}} dust={${dust}}${interactive ? '' : ' interactive={false}'}>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h1 className="text-7xl font-black text-white">Glow from below</h1>
      </div>
    </HorizonGlow>
  </section>
);

export default App;`}
            cli="horizon-glow"
            props={props}
            dependencies={dependencies}
        />
    );
}
