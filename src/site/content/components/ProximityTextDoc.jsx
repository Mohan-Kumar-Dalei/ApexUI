import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import ProximityText from '../../../components/MainUI/ApexUI-Kit/ProximityText/ProximityText.jsx';

const props = [
    { prop: 'text', type: "string", def: "\"Hover over these letters\"", desc: "The text." },
    { prop: 'radius', type: "number", def: "110", desc: "Reach of the effect in px." },
    { prop: 'maxScale', type: "number", def: "1.6", desc: "Scale of the closest letter." },
    { prop: 'lift', type: "number", def: "0.18", desc: "How far letters rise, in em." },
    { prop: 'color', type: "string", def: "\"currentColor\"", desc: "Resting color." },
    { prop: 'activeColor', type: "string", def: "\"#a3e635\"", desc: "Color near the pointer." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ProximityTextDoc() {
    const [radius, setRadius] = useState(110);
    const [scale, setScale] = useState(1.6);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Proximity Text"
            description="Letters swell, lift and light up as the pointer gets close, falling off smoothly with distance, like a magnifier sliding along the line."
            preview={
                <ProximityText radius={radius} maxScale={scale} activeColor={accent} className="max-w-3xl px-6 py-10 text-center text-4xl leading-[1.5] text-[var(--ink)] sm:text-5xl" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Radius" value={radius} onChange={setRadius} min={50} max={250} step={10} format={(v) => `${v}px`} />
                    <RangeControl label="Max scale" value={scale} onChange={setScale} min={1.1} max={2.2} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                    <ColorControl label="Active" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import ProximityText from './ApexUI-Kit/ProximityText/ProximityText.jsx';

const App = () => (
  <div>
    <ProximityText text="Hover over these letters" radius={${radius}} maxScale={${scale}} activeColor="${accent}" className="text-5xl" />
  </div>
);

export default App;`}
            cli="proximity-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
