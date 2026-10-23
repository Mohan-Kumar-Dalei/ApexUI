import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import SunriseBackground from '../../../components/MainUI/ApexUI-Kit/SunriseBackground/SunriseBackground.jsx';

const props = [
    { prop: 'preset', type: "'dawn' | 'golden' | 'dusk' | 'arctic'", def: '"dawn"', desc: 'Color set for the sun, sky and mountains.' },
    { prop: 'sunColor', type: 'string', def: 'from preset', desc: 'Sun, glow and rim light color.' },
    { prop: 'skyTop', type: 'string', def: 'from preset', desc: 'Sky color at the top.' },
    { prop: 'skyHorizon', type: 'string', def: 'from preset', desc: 'Sky color near the horizon once the sun is up.' },
    { prop: 'mountainColor', type: 'string', def: 'from preset', desc: 'Color of the nearest mountains (farther ranges fade into the haze).' },
    { prop: 'duration', type: 'number', def: '6', desc: 'Seconds the sun takes to rise.' },
    { prop: 'autoRise', type: 'boolean', def: 'true', desc: 'Rise on mount. When false the sun is already up.' },
    { prop: 'sunHeight', type: 'number', def: '0.28', desc: 'Where the sun stops, as a fraction of the height.' },
    { prop: 'trees', type: 'boolean', def: 'true', desc: 'Pine silhouettes on the ridges and in the foreground corners.' },
    { prop: 'birds', type: 'number', def: '1', desc: 'Size of the flock crossing the sky, 0 to 1 (0 hides it).' },
    { prop: 'sunSize', type: 'number', def: '0.075', desc: 'Sun radius, as a fraction of the height.' },
    { prop: 'rays', type: 'number', def: '1', desc: 'Strength of the light rays (0 turns them off).' },
    { prop: 'stars', type: 'number', def: '1', desc: 'Brightness of the stars before dawn.' },
    { prop: 'haze', type: 'number', def: '1', desc: 'Valley mist and how much the far ranges fade.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Speed of the rays and twinkle.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Mountains drift with the pointer for depth.' },
    { prop: 'replay', type: 'number', def: '0', desc: 'Change this value to play the sunrise again.' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content shown on top, e.g. your hero.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the single full-screen shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function SunriseBackgroundDoc() {
    const [preset, setPreset] = useState('dawn');
    const [duration, setDuration] = useState(6);
    const [sunHeight, setSunHeight] = useState(0.28);
    const [rays, setRays] = useState(1);
    const [haze, setHaze] = useState(1);
    const [trees, setTrees] = useState(true);
    const [birds, setBirds] = useState(1);
    const [interactive, setInteractive] = useState(true);
    const [replay, setReplay] = useState(0);

    return (
        <ComponentDoc
            title="Sunrise Background"
            description="A sun rising out of the valley between two mountain ranges, drawn in a single WebGL shader. The sky warms from night to dawn as it climbs, rays fan out, the ridges catch a rim of light, pines line the hills, a flock of birds crosses the sky and the stars fade. The ranges drift with the pointer for depth."
            preview={
                <div className="absolute inset-0">
                    <SunriseBackground preset={preset} duration={duration} sunHeight={sunHeight} rays={rays} haze={haze} trees={trees} birds={birds} interactive={interactive} replay={replay}>
                        <div className="flex h-full flex-col items-center px-6 pt-[12%] text-center text-white">
                            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">A new day</p>
                            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">Rise and build</h3>
                            <button type="button" onClick={() => setReplay((r) => r + 1)} className="mt-5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/20">
                                Play again
                            </button>
                        </div>
                    </SunriseBackground>
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Preset" value={preset} onChange={setPreset} options={[{ value: 'dawn', label: 'Dawn' }, { value: 'golden', label: 'Golden' }, { value: 'dusk', label: 'Dusk' }, { value: 'arctic', label: 'Arctic' }]} />
                    <RangeControl label="Rise time" value={duration} onChange={setDuration} min={1} max={15} step={0.5} format={(v) => `${v}s`} />
                    <RangeControl label="Sun height" value={sunHeight} onChange={setSunHeight} min={0.1} max={0.55} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Rays" value={rays} onChange={setRays} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Haze" value={haze} onChange={setHaze} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Trees" value={trees} onChange={setTrees} />
                    <RangeControl label="Birds" value={birds} onChange={setBirds} min={0} max={1} step={0.15} format={(v) => (v ? `${Math.max(1, Math.round(v * 7))}` : 'Off')} />
                    <ToggleControl label="Follow pointer" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import SunriseBackground from './ApexUI-Kit/SunriseBackground/SunriseBackground.jsx';

const App = () => (
  <section className="h-screen">
    <SunriseBackground preset="${preset}" duration={${duration}} sunHeight={${sunHeight}} rays={${rays}} haze={${haze}}${trees ? '' : ' trees={false}'}${birds === 1 ? '' : ` birds={${birds}}`}${interactive ? '' : ' interactive={false}'}>
      <h1 className="pt-32 text-center text-6xl font-black text-white">Rise and build</h1>
    </SunriseBackground>
  </section>
);

export default App;`}
            cli="sunrise-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
