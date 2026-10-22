import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import Coverflow3D from '../../../components/MainUI/ApexUI-Kit/Coverflow3D/Coverflow3D.jsx';

const props = [
    { prop: 'items', type: "{ image, title }[]", def: "7 demo heroes", desc: "Covers." },
    { prop: 'initialIndex', type: "number", def: "2", desc: "Cover in front at start." },
    { prop: 'size', type: "number", def: "12", desc: "Cover size in rem." },
    { prop: 'angle', type: "number", def: "55", desc: "Side cover angle in degrees." },
    { prop: 'gap', type: "number", def: "0.42", desc: "Spacing of side covers." },
    { prop: 'reflection', type: "boolean", def: "true", desc: "Show reflections." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Next button color." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Cover springs.' },
    { name: 'Lucide React', desc: 'Arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function Coverflow3DDoc() {
    const [angle, setAngle] = useState(55);
    const [reflection, setReflection] = useState(true);
    return (
        <ComponentDoc
            title="Coverflow 3D"
            description="The classic album-flip view — the centre cover faces you while the rest stand angled on either side and slide back in depth, each with a soft reflection. Drag, click or use the arrow keys."
            preview={
                <Coverflow3D angle={angle} reflection={reflection} className="text-[var(--ink)]" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Angle" value={angle} onChange={setAngle} min={20} max={80} step={1} format={(v) => `${v}°`} />
                    <ToggleControl label="Reflection" value={reflection} onChange={setReflection} />
                </ControlGrid>
            }
            code={`import Coverflow3D from './ApexUI-Kit/Coverflow3D/Coverflow3D.jsx';

const App = () => (
  <div>
    <Coverflow3D
      angle={${angle}}${reflection ? '' : '\n      reflection={false}'}
      items={[
        { image: "/album-1.jpg", title: "Album one" },
        { image: "/album-2.jpg", title: "Album two" },
        { image: "/album-3.jpg", title: "Album three" },
      ]}
    />
  </div>
);

export default App;`}
            cli="coverflow-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
