import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import DistortionImage from '../../../components/MainUI/ApexUI-Kit/DistortionImage/DistortionImage.jsx';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets';
const IMAGES = {
    strange: `${IK}/doctorStrange.png?tr=f-auto,q-85,w-1000`,
    panther: `${IK}/black-panther.png?tr=f-auto,q-85,w-1000`,
    spidey: `${IK}/spiderman.png?tr=f-auto,q-85,w-1000`,
};

const props = [
    { prop: 'src', type: 'string', def: 'demo image', desc: 'Image URL (must allow cross-origin loading).' },
    { prop: 'alt', type: 'string', def: '""', desc: 'Description for screen readers.' },
    { prop: 'strength', type: 'number', def: '1', desc: 'How far the ripple bends the image.' },
    { prop: 'rgbSplit', type: 'number', def: '1', desc: 'Strength of the red / green / blue fringes.' },
    { prop: 'aspectRatio', type: 'string', def: '"4 / 5"', desc: 'Box shape; the image covers it like object-fit: cover.' },
    { prop: 'width', type: 'number', def: '22', desc: 'Width in rem (shrinks on small screens).' },
    { prop: 'rounded', type: 'string', def: '"1.25rem"', desc: 'Corner radius.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL rendering with one small custom shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function DistortionImageDoc() {
    const [image, setImage] = useState('strange');
    const [strength, setStrength] = useState(1);
    const [rgb, setRgb] = useState(1);
    return (
        <ComponentDoc
            title="Distortion Image"
            description="A WebGL image that ripples where the pointer moves, bending the picture and splitting it into red, green and blue fringes, then settling back when you leave. Great for portfolio and product cards."
            preview={<DistortionImage src={IMAGES[image]} alt="Hero portrait" strength={strength} rgbSplit={rgb} />}
            controls={
                <ControlGrid>
                    <SelectControl label="Image" value={image} onChange={setImage} options={[{ value: 'strange', label: 'Doctor Strange' }, { value: 'panther', label: 'Black Panther' }, { value: 'spidey', label: 'Spider-Man' }]} />
                    <RangeControl label="Strength" value={strength} onChange={setStrength} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="RGB split" value={rgb} onChange={setRgb} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                </ControlGrid>
            }
            code={`import DistortionImage from './ApexUI-Kit/DistortionImage/DistortionImage.jsx';

const App = () => (
  <DistortionImage
    src="/images/portrait.jpg"
    alt="Portrait"
    strength={${strength}}
    rgbSplit={${rgb}}
  />
);

export default App;`}
            cli="distortion-image"
            props={props}
            dependencies={dependencies}
        />
    );
}
