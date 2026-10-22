import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import TextRing3D from '../../../components/MainUI/ApexUI-Kit/TextRing3D/TextRing3D.jsx';

const props = [
    { prop: 'text', type: "string", def: "\"APEX UI · 3D TYPE · \"", desc: "Text on the ring." },
    { prop: 'radius', type: "number", def: "9", desc: "Ring radius in rem." },
    { prop: 'speed', type: "number", def: "30", desc: "Degrees per second." },
    { prop: 'tilt', type: "number", def: "-14", desc: "Camera tilt in degrees." },
    { prop: 'fontSize', type: "number", def: "2", desc: "Letter size in rem." },
    { prop: 'color', type: "string", def: "\"currentColor\"", desc: "Letter color." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Color of the letters facing you." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Frame loop for the spin.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function TextRing3DDoc() {
    const [speed, setSpeed] = useState(30);
    const [tilt, setTilt] = useState(-14);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="3D Text Ring"
            description="Letters stand on a ring in real 3D space and the ring turns, so text sweeps around the back and comes forward again. Letters fade behind; drag to spin it yourself."
            preview={
                <TextRing3D speed={speed} tilt={tilt} accentColor={accent} radius={10} fontSize={2.6} text="APEX UI • 3D TYPE • MOTION • " className="text-[var(--ink)]" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={120} step={5} format={(v) => `${v}°/s`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-40} max={20} step={1} format={(v) => `${v}°`} />
                    <ColorControl label="Front" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import TextRing3D from './ApexUI-Kit/TextRing3D/TextRing3D.jsx';

const App = () => (
  <div>
    <TextRing3D text="APEX UI · 3D TYPE · " speed={${speed}} tilt={${tilt}} accentColor="${accent}" />
  </div>
);

export default App;`}
            cli="text-ring-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
