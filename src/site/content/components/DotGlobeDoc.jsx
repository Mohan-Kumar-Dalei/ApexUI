import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import DotGlobe from '../../../components/MainUI/ApexUI-Kit/DotGlobe/DotGlobe.jsx';

const props = [
    { prop: 'markers', type: '{ label, lat, lon }[]', def: '7 cities', desc: 'Pulsing city markers.' },
    { prop: 'arcs', type: '[fromIndex, toIndex][]', def: 'demo routes', desc: 'Flights between markers, by index.' },
    { prop: 'dotColor', type: 'string', def: '"#a1a1aa"', desc: 'Land dot color.' },
    { prop: 'markerColor', type: 'string', def: '"#a3e635"', desc: 'Marker color.' },
    { prop: 'arcColor', type: 'string', def: '"#a3e635"', desc: 'Arc and travelling head color.' },
    { prop: 'glowColor', type: 'string', def: '"#a3e635"', desc: 'Atmosphere glow (6-digit hex).' },
    { prop: 'labelColor', type: 'string', def: '"rgba(255,255,255,0.9)"', desc: 'Marker label color.' },
    { prop: 'autoRotateSpeed', type: 'number', def: '8', desc: 'Idle spin in degrees per second.' },
    { prop: 'tilt', type: 'number', def: '18', desc: 'Axis tilt toward the viewer, in degrees.' },
    { prop: 'maxSize', type: 'number', def: '30', desc: 'Largest globe size in rem (it shrinks to fit).' },
    { prop: 'showLabels', type: 'boolean', def: 'true', desc: 'Show city names on the front side.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Canvas 2D', desc: 'No map library and no WebGL — the land data is a 2 kB built-in mask.' },
];

export default function DotGlobeDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const [speed, setSpeed] = useState(8);
    const [tilt, setTilt] = useState(18);
    const [labels, setLabels] = useState(true);

    const code = `import DotGlobe from './ApexUI-Kit/DotGlobe/DotGlobe.jsx';

const markers = [
  { label: "Bhubaneswar", lat: 20.3, lon: 85.8 },
  { label: "London", lat: 51.5, lon: -0.1 },
  { label: "Tokyo", lat: 35.7, lon: 139.7 },
];

const App = () => (
  <DotGlobe
    markers={markers}
    arcs={[[0, 1], [0, 2]]}
    markerColor="${accent}"
    arcColor="${accent}"
    glowColor="${accent}"
    autoRotateSpeed={${speed}}
    tilt={${tilt}}${labels ? '' : '\n    showLabels={false}'}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Dot Globe"
            description="A 3D globe of land dots on a plain canvas — drag to spin it with inertia, cities pulse and flights arc between them."
            preview={
                <div className="flex w-full justify-center rounded-2xl bg-neutral-950 p-4">
                    <DotGlobe markerColor={accent} arcColor={accent} glowColor={accent} autoRotateSpeed={speed} tilt={tilt} showLabels={labels} />
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Spin speed" value={speed} onChange={setSpeed} min={0} max={40} step={1} format={(v) => `${v}°/s`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-30} max={45} step={1} format={(v) => `${v}°`} />
                    <ToggleControl label="City labels" value={labels} onChange={setLabels} />
                </ControlGrid>
            }
            code={code}
            cli="dot-globe"
            props={props}
            dependencies={dependencies}
        />
    );
}
