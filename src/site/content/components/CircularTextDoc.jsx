import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import CircularText from '../../../components/MainUI/ApexUI-Kit/CircularText/CircularText.jsx';

const props = [
    { prop: 'text', type: "string", def: "\"APEX UI • MOTION • COMPONENTS • \"", desc: "Text around the circle." },
    { prop: 'size', type: "number", def: "11", desc: "Diameter in rem." },
    { prop: 'duration', type: "number", def: "18", desc: "Seconds per turn." },
    { prop: 'onHover', type: "'speedUp' | 'slowDown' | 'pause' | 'goBonkers' | 'none'", def: "\"speedUp\"", desc: "What hovering does." },
    { prop: 'color', type: "string", def: "\"currentColor\"", desc: "Text color." },
    { prop: 'children', type: "ReactNode", def: "—", desc: "Content in the middle." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Frame loop for the spin.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CircularTextDoc() {
    const [hover, setHover] = useState('speedUp');
    const [duration, setDuration] = useState(18);
    return (
        <ComponentDoc
            title="Circular Text"
            description="A line of text wrapped around a circle that keeps turning — on hover it can speed up, slow down, pause or go bonkers. Put a logo or icon in the middle."
            preview={
                <CircularText onHover={hover} duration={duration} className="text-[var(--ink)]">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-lime-400 text-xl font-black text-black">A</span>
                </CircularText>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="On hover" value={hover} onChange={setHover} options={['speedUp', 'slowDown', 'pause', 'goBonkers', 'none']} />
                    <RangeControl label="Turn time" value={duration} onChange={setDuration} min={4} max={40} step={1} format={(v) => `${v}s`} />
                </ControlGrid>
            }
            code={`import CircularText from './ApexUI-Kit/CircularText/CircularText.jsx';

const App = () => (
  <div>
    <CircularText text="APEX UI • MOTION • COMPONENTS • " onHover="${hover}" duration={${duration}}>
      <img src="/logo.svg" alt="" className="h-14 w-14" />
    </CircularText>
  </div>
);

export default App;`}
            cli="circular-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
