import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import Marquee3D from '../../../components/MainUI/ApexUI-Kit/Marquee3D/Marquee3D.jsx';

const props = [
    { prop: 'images', type: 'string[]', def: '16 ApexUI previews', desc: 'Images for the cards (screenshots, logos, photos).' },
    { prop: 'columns', type: 'number', def: '4', desc: 'Number of scrolling columns.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Scroll speed multiplier.' },
    { prop: 'tilt', type: 'number', def: '1', desc: '3D tilt amount; 0 is flat.' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'true', desc: 'Pause while hovered.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'CSS height of the section.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Seamless column loops.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function Marquee3DDoc() {
    const [columns, setColumns] = useState(4);
    const [speed, setSpeed] = useState(1);
    const [tilt, setTilt] = useState(1);
    const [pause, setPause] = useState(true);
    return (
        <ComponentDoc
            title="Marquee 3D"
            description="A wall of cards tilted back in 3D with columns that scroll in opposite directions forever. Perfect for showing off screenshots, logos or testimonials; the loop has no seam and hover pauses it."
            preview={
                <div className="absolute inset-0 bg-[#09090b]">
                    <Marquee3D key={columns} columns={columns} speed={speed} tilt={tilt} pauseOnHover={pause} />
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <RangeControl label="Columns" value={columns} onChange={setColumns} min={2} max={6} step={1} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.3} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={0} max={1.5} step={0.05} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Pause on hover" value={pause} onChange={setPause} />
                </ControlGrid>
            }
            code={`import Marquee3D from './ApexUI-Kit/Marquee3D/Marquee3D.jsx';

const shots = ["/shots/1.png", "/shots/2.png", "/shots/3.png", "/shots/4.png", "/shots/5.png", "/shots/6.png"];

const App = () => (
  <section className="h-[36rem] bg-black">
    <Marquee3D images={shots} columns={${columns}} speed={${speed}} tilt={${tilt}} />
  </section>
);

export default App;`}
            cli="marquee-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
