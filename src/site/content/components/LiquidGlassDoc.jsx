import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import LiquidGlass from '../../../components/MainUI/ApexUI-Kit/LiquidGlass/LiquidGlass.jsx';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage';
const WALLPAPERS = {
    gradient: undefined,
    sunrise: `${IK}/sunrise-background.png?tr=f-auto,q-85,w-1600`,
    galaxy: `${IK}/galaxy-3d.png?tr=f-auto,q-85,w-1600`,
    blob: `${IK}/liquid-blob-3d.png?tr=f-auto,q-85,w-1600`,
};

const props = [
    { prop: 'items', type: '{ id, x, y, offset?, width, height, radius, content }[]', def: 'tab bar, search, widget, button', desc: 'Up to 4 glass panels. x / y place the centre as 0..1 of the box, offset nudges x in px, content is any JSX.' },
    { prop: 'image', type: 'string', def: 'animated gradient', desc: 'Wallpaper behind the glass (needs CORS from another domain).' },
    { prop: 'refraction', type: 'number', def: '1', desc: 'How strongly the rounded edges bend the picture.' },
    { prop: 'frost', type: 'number', def: '0.2', desc: 'Blur inside the glass (0 is clear).' },
    { prop: 'vibrancy', type: 'number', def: '1', desc: 'How much richer and brighter the picture looks through the glass, like iOS vibrancy.' },
    { prop: 'chroma', type: 'number', def: '1', desc: 'Colour split along the rim.' },
    { prop: 'tint', type: 'string', def: '"#ffffff"', desc: 'Glass tint.' },
    { prop: 'tintAmount', type: 'number', def: '0.08', desc: 'How much the tint colours the glass (0 to 1).' },
    { prop: 'merge', type: 'number', def: '18', desc: 'Distance in px over which panels melt into each other.' },
    { prop: 'draggable', type: 'boolean', def: 'true', desc: 'Let people drag the panels around.' },
    { prop: 'height', type: 'string', def: '"32rem"', desc: 'Height of the component.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'Runs the glass shader on the GPU.' },
    { name: 'Lucide React', desc: 'Icons in the demo panels.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function LiquidGlassDoc() {
    const [wallpaper, setWallpaper] = useState('gradient');
    const [refraction, setRefraction] = useState(1);
    const [frost, setFrost] = useState(0.2);
    const [vibrancy, setVibrancy] = useState(1);
    const [chroma, setChroma] = useState(1);
    const [merge, setMerge] = useState(18);
    const [drag, setDrag] = useState(true);

    return (
        <ComponentDoc
            title="Liquid Glass"
            description="iOS style glass panels over a wallpaper, drawn in one WebGL shader. Each panel bends the picture at its rounded edges, frosts it a little inside, splits colours along the rim and catches an edge light that follows the pointer, and makes what shows through a little more vivid. Drag the panels: they wobble like jelly and melt into each other when they get close. The content inside is plain HTML."
            preview={
                <div className="absolute inset-0">
                    <LiquidGlass key={wallpaper} image={WALLPAPERS[wallpaper]} refraction={refraction} frost={frost} chroma={chroma} vibrancy={vibrancy} merge={merge} draggable={drag} height="100%" />
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <SelectControl label="Wallpaper" value={wallpaper} onChange={setWallpaper} options={[{ value: 'gradient', label: 'Gradient' }, { value: 'sunrise', label: 'Sunrise' }, { value: 'galaxy', label: 'Galaxy' }, { value: 'blob', label: 'Liquid blob' }]} />
                    <RangeControl label="Refraction" value={refraction} onChange={setRefraction} min={0} max={2} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Frost" value={frost} onChange={setFrost} min={0} max={2} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Vibrancy" value={vibrancy} onChange={setVibrancy} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Chroma" value={chroma} onChange={setChroma} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Merge" value={merge} onChange={setMerge} min={0} max={60} step={1} format={(v) => `${v}px`} />
                    <ToggleControl label="Draggable" value={drag} onChange={setDrag} />
                </ControlGrid>
            }
            code={`import { Home, Search } from 'lucide-react';
import LiquidGlass from './ApexUI-Kit/LiquidGlass/LiquidGlass.jsx';

const items = [
  { id: 'bar', x: 0.5, y: 0.85, offset: -36, width: 300, height: 62, radius: 31, content: <nav>{/* tabs */}</nav> },
  { id: 'search', x: 0.5, y: 0.85, offset: 155, width: 62, height: 62, radius: 31, content: <Search /> },
];

const App = () => (
  <LiquidGlass
    items={items}
    image="/wallpaper.jpg"
    refraction={${refraction}}
    frost={${frost}}
    chroma={${chroma}}
    vibrancy={${vibrancy}}
    merge={${merge}}${drag ? '' : '\n    draggable={false}'}
  />
);

export default App;`}
            cli="liquid-glass"
            props={props}
            dependencies={dependencies}
        />
    );
}
