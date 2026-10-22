import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import Folder from '../../../components/MainUI/ApexUI-Kit/Folder/Folder.jsx';

const props = [
    { prop: 'color', type: "string", def: "\"#a3e635\"", desc: "Folder color." },
    { prop: 'size', type: "number", def: "1", desc: "Scale (1 = default)." },
    { prop: 'items', type: "ReactNode[]", def: "3 demo papers", desc: "Up to three papers." },
    { prop: 'label', type: "string", def: "\"Projects\"", desc: "Label under the folder." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Flap and paper springs.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function FolderDoc() {
    const [color, setColor] = useState('#a3e635');
    const [size, setSize] = useState(1.6);
    return (
        <ComponentDoc
            title="Folder"
            description="A little folder that opens on click, the front flap tilts down and up to three papers fan out, each leaning toward the pointer. Click again to tuck them back in."
            preview={
                <Folder color={color} size={size} className="pt-20 text-[var(--ink)]" />
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={0.8} max={2.4} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                </ControlGrid>
            }
            code={`import Folder from './ApexUI-Kit/Folder/Folder.jsx';

const App = () => (
  <div>
    <Folder
      color="${color}"
      size={${size}}
      label="Invoices"
      items={[<p key="1">Jan.pdf</p>, <p key="2">Feb.pdf</p>, <p key="3">Mar.pdf</p>]}
    />
  </div>
);

export default App;`}
            cli="folder"
            props={props}
            dependencies={dependencies}
        />
    );
}
