import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import GlassLens from '../../../components/MainUI/ApexUI-Kit/GlassLens/GlassLens.jsx';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage';
const IMAGES = {
    galaxy: `${IK}/galaxy-3d.png?tr=f-auto,q-85,w-1600`,
    sunrise: `${IK}/sunrise-background.png?tr=f-auto,q-85,w-1600`,
    tunnel: `${IK}/warp-tunnel.png?tr=f-auto,q-85,w-1600`,
    grid: `${IK}/retro-grid-3d.png?tr=f-auto,q-85,w-1600`,
};

const props = [
    { prop: 'image', type: 'string', def: 'demo image', desc: 'Image under the glass (cover fitted). Needs CORS if it comes from another domain.' },
    { prop: 'size', type: 'number', def: '9', desc: 'Lens radius in rem (never more than 40% of the short side).' },
    { prop: 'refraction', type: 'number', def: '0.7', desc: 'How much the lens magnifies and bends the picture at its rim (0 to 1).' },
    { prop: 'dispersion', type: 'number', def: '1', desc: 'Color split at the edge of the glass.' },
    { prop: 'frost', type: 'number', def: '0', desc: 'Frosted blur inside the lens (0 is clear).' },
    { prop: 'tint', type: 'string', def: '"#ffffff"', desc: 'Glass tint color.' },
    { prop: 'tintAmount', type: 'number', def: '0', desc: 'How strongly the tint colors the glass (0 to 1).' },
    { prop: 'stretch', type: 'number', def: '1', desc: 'How much the lens stretches along the way it moves.' },
    { prop: 'idle', type: 'boolean', def: 'true', desc: 'Drift on its own when the pointer is away.' },
    { prop: 'height', type: 'string', def: '"28rem"', desc: 'Height of the component.' },
    { prop: 'children', type: 'ReactNode', def: 'undefined', desc: 'Content laid over the image (does not block the pointer).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the refraction shader on the GPU.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function GlassLensDoc() {
    const [image, setImage] = useState('galaxy');
    const [size, setSize] = useState(9);
    const [refraction, setRefraction] = useState(0.7);
    const [dispersion, setDispersion] = useState(1);
    const [frost, setFrost] = useState(0);
    const [tint, setTint] = useState('#ffffff');
    const tintAmount = tint.toLowerCase() === '#ffffff' ? 0 : 0.35;

    return (
        <ComponentDoc
            title="Glass Lens"
            description="A drop of liquid glass gliding over an image, drawn in WebGL. It magnifies the middle, bends the picture hard at the rim, splits the colors at the edge and catches a specular highlight. It follows the pointer on a spring, stretches along the way it moves and rounds out when it stops; drag it on touch screens."
            preview={
                <div className="absolute inset-0">
                    <GlassLens key={image} image={IMAGES[image]} size={size} refraction={refraction} dispersion={dispersion} frost={frost} tint={tint} tintAmount={tintAmount} height="100%" />
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Image" value={image} onChange={setImage} options={[{ value: 'galaxy', label: 'Galaxy' }, { value: 'sunrise', label: 'Sunrise' }, { value: 'tunnel', label: 'Warp tunnel' }, { value: 'grid', label: 'Retro grid' }]} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={4} max={16} step={0.5} format={(v) => `${v}rem`} />
                    <RangeControl label="Refraction" value={refraction} onChange={setRefraction} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Dispersion" value={dispersion} onChange={setDispersion} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Frost" value={frost} onChange={setFrost} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <ColorControl label="Tint" value={tint} onChange={setTint} />
                </ControlGrid>
            }
            code={`import GlassLens from './ApexUI-Kit/GlassLens/GlassLens.jsx';

const App = () => (
  <GlassLens
    image="/images/hero.jpg"
    size={${size}}
    refraction={${refraction}}
    dispersion={${dispersion}}${frost ? `\n    frost={${frost}}` : ''}${tintAmount ? `\n    tint="${tint}"\n    tintAmount={${tintAmount}}` : ''}
  />
);

export default App;`}
            cli="glass-lens"
            props={props}
            dependencies={dependencies}
        />
    );
}
