import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import MagnetLines from '../../../components/MainUI/ApexUI-Kit/MagnetLines/MagnetLines.jsx';

const props = [
    { prop: 'rows', type: "number", def: "9", desc: "Rows of lines." },
    { prop: 'columns', type: "number", def: "9", desc: "Columns of lines." },
    { prop: 'size', type: "number", def: "22", desc: "Grid width in rem." },
    { prop: 'lineColor', type: "string", def: "\"currentColor\"", desc: "Line color." },
    { prop: 'activeColor', type: "string", def: "\"#a3e635\"", desc: "Color near the pointer." },
    { prop: 'lineWidth', type: "number", def: "0.22", desc: "Line width in rem." },
    { prop: 'lineHeight', type: "number", def: "1.6", desc: "Line length in rem." },
    { prop: 'baseAngle', type: "number", def: "-10", desc: "Resting angle in degrees." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function MagnetLinesDoc() {
    const [grid, setGrid] = useState(9);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Magnet Lines"
            description="A grid of short lines that all swing to point at the pointer, like iron filings around a magnet. Nearby lines glow and stretch; on leave they drift back into a slow wave."
            preview={
                <MagnetLines rows={grid} columns={grid} activeColor={accent} className="text-[var(--ink)]" />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Grid" value={grid} onChange={setGrid} min={5} max={14} step={1} format={(v) => `${v}×${v}`} />
                    <ColorControl label="Active" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import MagnetLines from './ApexUI-Kit/MagnetLines/MagnetLines.jsx';

const App = () => (
  <div>
    <MagnetLines rows={${grid}} columns={${grid}} activeColor="${accent}" />
  </div>
);

export default App;`}
            cli="magnet-lines"
            props={props}
            dependencies={dependencies}
        />
    );
}
