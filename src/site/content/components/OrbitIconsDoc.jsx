import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import OrbitIcons from '../../../components/MainUI/ApexUI-Kit/OrbitIcons/OrbitIcons.jsx';

const props = [
    { prop: 'rings', type: '{ speed: number, items: { icon, label?, color? }[] }[]', def: 'three demo rings', desc: 'Rings from the inside out. speed is degrees per second; negative turns the other way. icon is a component (e.g. a lucide icon) or any element.' },
    { prop: 'size', type: 'number', def: '28', desc: 'Largest size in rem (it shrinks to its container).' },
    { prop: 'tilt', type: 'number', def: '0.55', desc: 'How far the orbits tip back for depth (0 is flat).' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Multiplies every ring speed.' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'true', desc: 'Ease to a stop and show labels while hovered.' },
    { prop: 'showRings', type: 'boolean', def: 'true', desc: 'Draw the dashed orbit lines.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Glow of the center and the hover border.' },
    { prop: 'center', type: 'ReactNode', def: '"Apex"', desc: 'Content in the middle, e.g. your logo.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Lucide React', desc: 'Icons for the demo rings.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function OrbitIconsDoc() {
    const [tilt, setTilt] = useState(0.55);
    const [speed, setSpeed] = useState(1);
    const [accent, setAccent] = useState('#a3e635');
    const [showRings, setShowRings] = useState(true);

    return (
        <ComponentDoc
            title="Orbit Icons"
            description="Icons circling a center on a few rings, each at its own speed and direction. Tip the orbits back and icons on the far side shrink, dim and pass behind the near ones. Hovering eases the motion to a stop and shows labels, and the orbits lean toward the pointer. Great for integrations and tech stack sections."
            preview={<OrbitIcons tilt={tilt} speed={speed} accentColor={accent} showRings={showRings} className="text-[var(--stage-ink)]" />}
            controls={
                <ControlGrid>
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <ToggleControl label="Rings" value={showRings} onChange={setShowRings} />
                </ControlGrid>
            }
            code={`import { Github, Figma, Cloud, Database } from 'lucide-react';
import OrbitIcons from './ApexUI-Kit/OrbitIcons/OrbitIcons.jsx';

const rings = [
  { speed: 20, items: [{ icon: Github, label: 'GitHub' }, { icon: Figma, label: 'Figma' }] },
  { speed: -12, items: [{ icon: Cloud, label: 'Cloud' }, { icon: Database, label: 'Data' }] },
];

const App = () => <OrbitIcons rings={rings} tilt={${tilt}} speed={${speed}} accentColor="${accent}"${showRings ? '' : ' showRings={false}'} center={<img src="/logo.svg" alt="" />} />;

export default App;`}
            cli="orbit-icons"
            props={props}
            dependencies={dependencies}
        />
    );
}
