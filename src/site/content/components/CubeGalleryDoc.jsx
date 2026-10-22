import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import CubeGallery from '../../../components/MainUI/ApexUI-Kit/CubeGallery/CubeGallery.jsx';

const props = [
    { prop: 'faces', type: '{ image, title }[]', def: '4 demo heroes', desc: 'The four side faces.' },
    { prop: 'size', type: 'number', def: '15', desc: 'Cube edge in rem (shrinks to fit small screens).' },
    { prop: 'autoRotate', type: 'boolean', def: 'true', desc: 'Turn a face at a time on its own (pauses on hover).' },
    { prop: 'interval', type: 'number', def: '3000', desc: 'Milliseconds between automatic turns.' },
    { prop: 'tilt', type: 'number', def: '-12', desc: 'Camera tilt in degrees.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Active dot color.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Drag rotation and spring snapping.' },
    { name: 'Lucide React', desc: 'Arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CubeGalleryDoc() {
    const [tilt, setTilt] = useState(-12);
    const [auto, setAuto] = useState(true);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Cube Gallery"
            description="Four images on the sides of a 3D cube — drag to spin it, let go and it snaps to a face, or use the arrows, dots and arrow keys."
            preview={<CubeGallery tilt={tilt} autoRotate={auto} accentColor={accent} className="py-6 text-[var(--ink)]" />}
            controls={
                <ControlGrid>
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-30} max={15} step={1} format={(v) => `${v}°`} />
                    <ToggleControl label="Auto rotate" value={auto} onChange={setAuto} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import CubeGallery from './ApexUI-Kit/CubeGallery/CubeGallery.jsx';

const faces = [
  { image: "/one.jpg", title: "One" },
  { image: "/two.jpg", title: "Two" },
  { image: "/three.jpg", title: "Three" },
  { image: "/four.jpg", title: "Four" },
];

const App = () => <CubeGallery faces={faces} tilt={${tilt}}${auto ? '' : ' autoRotate={false}'} accentColor="${accent}" />;

export default App;`}
            cli="cube-gallery"
            props={props}
            dependencies={dependencies}
        />
    );
}
