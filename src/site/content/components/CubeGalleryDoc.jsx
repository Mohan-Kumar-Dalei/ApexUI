import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import CubeGallery from '../../../components/MainUI/ApexUI-Kit/CubeGallery/CubeGallery.jsx';

const props = [
    { prop: 'faces', type: '{ image, title }[]', def: '6 demo heroes', desc: 'Up to six faces: four sides, then top and bottom (repeats if fewer).' },
    { prop: 'size', type: 'number', def: '13', desc: 'Cube edge in rem (shrinks to fit small screens).' },
    { prop: 'autoRotate', type: 'boolean', def: 'true', desc: 'Spin slowly on its own (pauses on hover).' },
    { prop: 'speed', type: 'number', def: '12', desc: 'Auto spin speed in degrees per second.' },
    { prop: 'tilt', type: 'number', def: '-24', desc: 'Camera tilt in degrees — negative looks down on the top face.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Active dot color.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Drag, momentum and spring settling.' },
    { name: 'Lucide React', desc: 'Arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CubeGalleryDoc() {
    const [tilt, setTilt] = useState(-24);
    const [auto, setAuto] = useState(true);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Cube Gallery"
            description="Six images on a solid 3D cube seen from a corner, so three faces show at once. It spins slowly, you can throw it around in any direction, and each face is shaded as it turns away."
            preview={<CubeGallery tilt={tilt} autoRotate={auto} accentColor={accent} className="py-6 text-[var(--ink)]" />}
            controls={
                <ControlGrid>
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-50} max={10} step={1} format={(v) => `${v}°`} />
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
  { image: "/five.jpg", title: "Top" },
  { image: "/six.jpg", title: "Bottom" },
];

const App = () => <CubeGallery faces={faces} tilt={${tilt}}${auto ? '' : ' autoRotate={false}'} accentColor="${accent}" />;

export default App;`}
            cli="cube-gallery"
            props={props}
            dependencies={dependencies}
        />
    );
}
