import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import ImageCompare from '../../../components/MainUI/ApexUI-Kit/ImageCompare/ImageCompare.jsx';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets';

const props = [
    { prop: 'before', type: 'string', def: 'none', desc: '"Before" image URL.' },
    { prop: 'after', type: 'string', def: 'none', desc: '"After" image URL.' },
    { prop: 'image', type: 'string', def: 'demo image', desc: 'One image for both sides; the before side gets beforeFilter.' },
    { prop: 'beforeFilter', type: 'string', def: 'grayscale', desc: 'CSS filter for the before side when only image is given.' },
    { prop: 'beforeLabel / afterLabel', type: 'string', def: '"Before" / "After"', desc: 'Corner labels.' },
    { prop: 'defaultPosition', type: 'number', def: '50', desc: 'Starting split, in percent.' },
    { prop: 'vertical', type: 'boolean', def: 'false', desc: 'Split top / bottom instead of left / right.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Divider and handle color.' },
    { prop: 'aspectRatio', type: 'string', def: '"16 / 10"', desc: 'Frame aspect ratio.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Lucide React', desc: 'Handle icon.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const FILTERS = {
    grayscale: { label: 'Black & white', value: 'grayscale(1) contrast(1.05) brightness(0.9)' },
    sepia: { label: 'Old photo', value: 'sepia(0.9) contrast(0.9) brightness(0.95)' },
    blur: { label: 'Blurry', value: 'blur(6px) saturate(0.6)' },
    dark: { label: 'Underexposed', value: 'brightness(0.45) saturate(0.7)' },
};

export default function ImageCompareDoc() {
    const [filter, setFilter] = useState('grayscale');
    const [vertical, setVertical] = useState(false);
    const [accent, setAccent] = useState('#a3e635');

    const code = `import ImageCompare from './ApexUI-Kit/ImageCompare/ImageCompare.jsx';

const App = () => (
  <ImageCompare
    before="/photo-raw.jpg"
    after="/photo-edited.jpg"
    accentColor="${accent}"${vertical ? '\n    vertical' : ''}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Image Compare"
            description="A before / after slider, drag the handle, click anywhere or use the arrow keys to wipe between two images, side to side or top to bottom."
            preview={
                <div className="w-full max-w-2xl">
                    <ImageCompare key={String(vertical)} image={`${IK}/thanos.png?tr=f-auto,q-80,w-1200`} beforeFilter={FILTERS[filter].value} vertical={vertical} accentColor={accent} />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Before look" value={filter} onChange={setFilter} options={Object.entries(FILTERS).map(([value, f]) => ({ value, label: f.label }))} />
                    <ToggleControl label="Vertical split" value={vertical} onChange={setVertical} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="image-compare"
            props={props}
            dependencies={dependencies}
        />
    );
}
