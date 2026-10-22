import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import ClickSpark from '../../../components/MainUI/ApexUI-Kit/ClickSpark/ClickSpark.jsx';

const props = [
    { prop: 'sparkColor', type: "string", def: "\"#a3e635\"", desc: "Spark color." },
    { prop: 'sparkCount', type: "number", def: "10", desc: "Sparks per click." },
    { prop: 'sparkRadius', type: "number", def: "26", desc: "How far sparks fly in px." },
    { prop: 'sparkSize', type: "number", def: "12", desc: "Spark length in px." },
    { prop: 'duration', type: "number", def: "450", desc: "Lifetime in ms." },
    { prop: 'children', type: "ReactNode", def: "—", desc: "The area that sparks." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ClickSparkDoc() {
    const [color, setColor] = useState('#a3e635');
    const [count, setCount] = useState(10);
    const [radius, setRadius] = useState(26);
    return (
        <ComponentDoc
            title="Click Spark"
            description="Wrap any area and every click throws a ring of short spark lines out from the pointer. Drawn on a canvas overlay, so it never blocks clicks underneath."
            preview={
                <ClickSpark sparkColor={color} sparkCount={count} sparkRadius={radius} className="grid h-[22rem] w-full max-w-xl cursor-crosshair select-none place-items-center rounded-2xl border border-dashed border-[var(--line)] text-[var(--ink-3)]">
                    <span className="font-mono text-sm">click anywhere</span>
                </ClickSpark>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <RangeControl label="Sparks" value={count} onChange={setCount} min={4} max={24} step={1} />
                    <RangeControl label="Radius" value={radius} onChange={setRadius} min={10} max={80} step={2} format={(v) => `${v}px`} />
                </ControlGrid>
            }
            code={`import ClickSpark from './ApexUI-Kit/ClickSpark/ClickSpark.jsx';

const App = () => (
  <div>
    <ClickSpark sparkColor="${color}" sparkCount={${count}} sparkRadius={${radius}}>
      <main>…your page…</main>
    </ClickSpark>
  </div>
);

export default App;`}
            cli="click-spark"
            props={props}
            dependencies={dependencies}
        />
    );
}
