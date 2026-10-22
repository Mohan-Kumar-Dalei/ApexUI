import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import TrueFocus from '../../../components/MainUI/ApexUI-Kit/TrueFocus/TrueFocus.jsx';

const props = [
    { prop: 'sentence', type: "string", def: "\"Design Build Ship Repeat\"", desc: "Words to focus, separated by spaces." },
    { prop: 'manual', type: "boolean", def: "false", desc: "Focus follows the pointer instead of a timer." },
    { prop: 'blur', type: "number", def: "5", desc: "Blur on unfocused words in px." },
    { prop: 'interval', type: "number", def: "1600", desc: "Milliseconds per word." },
    { prop: 'borderColor', type: "string", def: "\"#a3e635\"", desc: "Bracket color." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Bracket frame springs.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function TrueFocusDoc() {
    const [manual, setManual] = useState(false);
    const [blur, setBlur] = useState(5);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="True Focus"
            description="One word of a sentence is sharp while the rest blur, and a set of glowing corner brackets glides from word to word — on a timer or following the pointer."
            preview={
                <TrueFocus manual={manual} blur={blur} borderColor={accent} className="text-4xl text-[var(--ink)] sm:text-6xl" />
            }
            controls={
                <ControlGrid>
                    <ToggleControl label="Follow pointer" value={manual} onChange={setManual} />
                    <RangeControl label="Blur" value={blur} onChange={setBlur} min={0} max={12} step={1} format={(v) => `${v}px`} />
                    <ColorControl label="Brackets" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import TrueFocus from './ApexUI-Kit/TrueFocus/TrueFocus.jsx';

const App = () => (
  <div>
    <TrueFocus sentence="Design Build Ship Repeat" blur={${blur}} borderColor="${accent}"${manual ? ' manual' : ''} className="text-6xl" />
  </div>
);

export default App;`}
            cli="true-focus"
            props={props}
            dependencies={dependencies}
        />
    );
}
