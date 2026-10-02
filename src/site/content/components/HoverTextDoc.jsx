import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { SelectControl } from '../../docs/controls.jsx';
import HoverText from '../../../components/MainUI/ApexUI-Kit/HoverText/HoverText.jsx';

const effects = [
    { value: 'defaultReveal', label: 'Default Reveal' },
    { value: 'magnetic', label: 'Magnetic' },
    { value: 'wave', label: 'Wave' },
    { value: 'rubber', label: 'Rubber' },
    { value: 'jump', label: 'Jump' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'party', label: 'Party' },
];

const props = [
    { prop: 'text', type: 'string', def: '"Hover Me"', desc: 'Text to display with the hover effect.' },
    { prop: 'effect', type: 'string', def: '"defaultReveal"', desc: 'Animation effect: "defaultReveal", "magnetic", "wave", "rubber", "jump", "rotate" or "party".' },
    { prop: 'effectColor', type: 'string', def: '"#C27AFF"', desc: 'Color of the hover effect.' },
    { prop: 'fontSize', type: 'string | number', def: '"2.5rem"', desc: 'Font size of the text.' },
    { prop: 'textColor', type: 'string', def: '"#fff"', desc: 'Resting colour of the letters (use a dark colour on light backgrounds).' },
    { prop: 'className', type: 'string', def: "''", desc: 'Classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function HoverTextDoc() {
    const [effect, setEffect] = useState('defaultReveal');
    const [color, setColor] = useState('#9ae600');
    const code = `import HoverText from './ApexUI-Kit/HoverText/HoverText.jsx';

const App = () => (
  <HoverText
    text="Hover Me!"
    effect="${effect}"
    effectColor="${color}"
  />
);

export default App;`;
    return (
        <ComponentDoc
            title="Hover Text"
            description="A collection of playful, interactive text hover effects to bring headings to life."
            preview={<HoverText text="Hover Me!" effectColor={color} effect={effect} />}
            controls={
                <div className="grid gap-4 sm:grid-cols-2">
                    <SelectControl label="Effect" value={effect} onChange={setEffect} options={effects} />
                    <ColorControl label="Color" value={color} onChange={setColor} />
                </div>
            }
            code={code}
            cli="hover-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
