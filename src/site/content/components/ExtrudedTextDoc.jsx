import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import ExtrudedText from '../../../components/MainUI/ApexUI-Kit/ExtrudedText/ExtrudedText.jsx';

const props = [
    { prop: 'text', type: 'string', def: '"APEX"', desc: 'The word to extrude (short words work best).' },
    { prop: 'depth', type: 'number', def: '14', desc: 'How many layers deep the letters go.' },
    { prop: 'faceColor', type: 'string', def: '"#a3e635"', desc: 'Front face color.' },
    { prop: 'sideColor', type: 'string', def: '"#3f6212"', desc: 'Side color (gets darker toward the back).' },
    { prop: 'gradient', type: 'string', def: '""', desc: 'Optional CSS gradient for the face instead of faceColor.' },
    { prop: 'maxTilt', type: 'number', def: '22', desc: 'Strongest tilt toward the pointer, in degrees.' },
    { prop: 'fontSize', type: 'number', def: '7', desc: 'Largest font size in rem (it scales down on small screens).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring-smoothed tilt.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const GRADIENTS = {
    none: '',
    sunset: 'linear-gradient(135deg,#fde047,#f97316,#ec4899)',
    ocean: 'linear-gradient(135deg,#67e8f9,#3b82f6,#8b5cf6)',
};

export default function ExtrudedTextDoc() {
    const [text, setText] = useState('APEX');
    const [depth, setDepth] = useState(14);
    const [face, setFace] = useState('#a3e635');
    const [side, setSide] = useState('#3f6212');
    const [gradient, setGradient] = useState('none');
    return (
        <ComponentDoc
            title="Extruded Text"
            description="Chunky 3D letters built from stacked layers, the block tilts toward the pointer so you can see the sides, with a solid or gradient face."
            preview={<ExtrudedText text={text} depth={depth} faceColor={face} sideColor={side} gradient={GRADIENTS[gradient]} />}
            controls={
                <ControlGrid>
                    <SelectControl label="Word" value={text} onChange={setText} options={['APEX', 'WOW', 'HELLO', '3D']} />
                    <RangeControl label="Depth" value={depth} onChange={setDepth} min={2} max={30} step={1} format={(v) => `${v} layers`} />
                    <ColorControl label="Face" value={face} onChange={setFace} />
                    <ColorControl label="Sides" value={side} onChange={setSide} />
                    <SelectControl label="Face gradient" value={gradient} onChange={setGradient} options={[{ value: 'none', label: 'None' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                </ControlGrid>
            }
            code={`import ExtrudedText from './ApexUI-Kit/ExtrudedText/ExtrudedText.jsx';

const App = () => <ExtrudedText text="${text}" depth={${depth}} faceColor="${face}" sideColor="${side}"${GRADIENTS[gradient] ? ` gradient="${GRADIENTS[gradient]}"` : ''} />;

export default App;`}
            cli="extruded-text"
            props={props}
            dependencies={dependencies}
        />
    );
}
