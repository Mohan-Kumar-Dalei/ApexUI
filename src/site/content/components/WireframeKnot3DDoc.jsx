import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import WireframeKnot3D from '../../../components/MainUI/ApexUI-Kit/WireframeKnot3D/WireframeKnot3D.jsx';

const props = [
    { prop: 'shape', type: "'knot' | 'sphere' | 'gem'", def: '"knot"', desc: 'Wireframe shape.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Line color (lines glow where they overlap).' },
    { prop: 'pointColor', type: 'string', def: '"#ffffff"', desc: 'Color of the corner points.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Rotation speed.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Lean toward the pointer.' },
    { prop: 'size', type: 'number', def: '24', desc: 'Canvas size in rem (shrinks on small screens).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL lines and points, no post-processing.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function WireframeKnot3DDoc() {
    const [shape, setShape] = useState('knot');
    const [color, setColor] = useState('#a3e635');
    const [speed, setSpeed] = useState(1);
    const [interactive, setInteractive] = useState(true);
    return (
        <ComponentDoc
            title="Wireframe Knot 3D"
            description="A glowing three.js wireframe (torus knot, sphere or gem) with bright points at its corners, slowly turning and leaning toward the pointer. Additive lines make it glow with no post-processing, so it stays light."
            preview={<WireframeKnot3D shape={shape} color={color} speed={speed} interactive={interactive} />}
            controls={
                <ControlGrid>
                    <SelectControl label="Shape" value={shape} onChange={setShape} options={[{ value: 'knot', label: 'Torus knot' }, { value: 'sphere', label: 'Sphere' }, { value: 'gem', label: 'Gem' }]} />
                    <ColorControl label="Lines" value={color} onChange={setColor} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={3} step={0.1} format={(v) => `${v.toFixed(1)}x`} />
                    <ToggleControl label="Follow pointer" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={`import WireframeKnot3D from './ApexUI-Kit/WireframeKnot3D/WireframeKnot3D.jsx';

const App = () => <WireframeKnot3D shape="${shape}" color="${color}" speed={${speed}}${interactive ? '' : ' interactive={false}'} />;

export default App;`}
            cli="wireframe-knot-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
