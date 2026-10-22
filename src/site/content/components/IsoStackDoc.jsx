import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import IsoStack from '../../../components/MainUI/ApexUI-Kit/IsoStack/IsoStack.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'layers', type: '{ label, note, icon, color }[]', def: '5 demo layers', desc: 'Layers from top to bottom.' },
    { prop: 'size', type: 'number', def: '13', desc: 'Layer size in rem.' },
    { prop: 'gap', type: 'number', def: '1.6', desc: 'Space between layers when the stack opens.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Layer and label colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Layer lift springs.' },
    { name: 'Lucide React', desc: 'Demo icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function IsoStackDoc() {
    const theme = useSiteTheme();
    const [gap, setGap] = useState(1.6);
    return (
        <ComponentDoc
            title="Iso Stack"
            description="Layers drawn in isometric 3D, stacked like a sandwich, hover or tap and the stack fans open to show each label; hover a layer to lift it out."
            preview={<IsoStack theme={theme} gap={gap} />}
            controls={
                <ControlGrid>
                    <RangeControl label="Open gap" value={gap} onChange={setGap} min={0.8} max={2.6} step={0.1} format={(v) => v.toFixed(1)} />
                </ControlGrid>
            }
            code={`import { Layout, Server, Database } from 'lucide-react';
import IsoStack from './ApexUI-Kit/IsoStack/IsoStack.jsx';

const layers = [
  { label: "Interface", note: "React", icon: Layout, color: "#a3e635" },
  { label: "API", note: "Node", icon: Server, color: "#f59e0b" },
  { label: "Data", note: "Postgres", icon: Database, color: "#f43f5e" },
];

const App = () => <IsoStack layers={layers} gap={${gap}} theme="${theme}" />;

export default App;`}
            cli="iso-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
