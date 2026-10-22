import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import MagnifyDock from '../../../components/MainUI/ApexUI-Kit/MagnifyDock/MagnifyDock.jsx';

const props = [
    { prop: 'items', type: '{ label, icon, color?, href? }[]', def: '7 demo apps', desc: 'Dock icons in order. Add { type: "separator" } for a divider.' },
    { prop: 'baseSize', type: 'number', def: '2.75', desc: 'Resting icon size, in rem.' },
    { prop: 'magnification', type: 'number', def: '1.7', desc: 'How many times bigger the icon under the pointer grows.' },
    { prop: 'distance', type: 'number', def: '140', desc: 'Reach of the magnification around the pointer, in pixels.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Glass panel, label and dot colors.' },
    { prop: 'tileStyle', type: "'color' | 'glass'", def: '"color"', desc: 'Colorful gradient tiles, or plain glass tiles with mono icons.' },
    { prop: 'showLabels', type: 'boolean', def: 'true', desc: 'Show a label above the icon on hover or focus.' },
    { prop: 'defaultOpen', type: 'number[]', def: '[0]', desc: 'Indexes that start with the “open” dot underneath.' },
    { prop: 'onSelect', type: '(item, index, event) => void', def: 'none', desc: 'Called when an icon is clicked (it also bounces and gets a dot).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring-driven magnification and bounce.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function MagnifyDockDoc() {
    const [theme, setTheme] = useState('dark');
    const [tileStyle, setTileStyle] = useState('color');
    const [magnification, setMagnification] = useState(1.7);
    const [distance, setDistance] = useState(140);
    const [showLabels, setShowLabels] = useState(true);

    const code = `import { House, Music, Mail, Settings } from 'lucide-react';
import MagnifyDock from './ApexUI-Kit/MagnifyDock/MagnifyDock.jsx';

const items = [
  { label: "Home", icon: House, color: "linear-gradient(160deg,#60a5fa,#2563eb)" },
  { label: "Music", icon: Music, color: "linear-gradient(160deg,#fb7185,#e11d48)" },
  { label: "Mail", icon: Mail, color: "linear-gradient(160deg,#38bdf8,#0369a1)" },
  { type: "separator" },
  { label: "Settings", icon: Settings, color: "linear-gradient(160deg,#a1a1aa,#52525b)" },
];

const App = () => (
  <MagnifyDock
    items={items}
    theme="${theme}"
    tileStyle="${tileStyle}"
    magnification={${magnification}}
    distance={${distance}}${showLabels ? '' : '\n    showLabels={false}'}
    onSelect={(item) => console.log(item.label)}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Magnify Dock"
            description="A glass dock whose icons swell toward the pointer, macOS style, with hover labels, a bounce on click and open-app dots."
            preview={
                <MagnifyDock
                    theme={theme}
                    tileStyle={tileStyle}
                    magnification={magnification}
                    distance={distance}
                    showLabels={showLabels}
                />
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
                    <SelectControl label="Tiles" value={tileStyle} onChange={setTileStyle} options={[{ value: 'color', label: 'Colorful' }, { value: 'glass', label: 'Glass' }]} />
                    <RangeControl label="Magnification" value={magnification} onChange={setMagnification} min={1} max={2.4} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                    <RangeControl label="Reach" value={distance} onChange={setDistance} min={60} max={240} step={10} format={(v) => `${v}px`} />
                    <ToggleControl label="Labels" value={showLabels} onChange={setShowLabels} />
                </ControlGrid>
            }
            code={code}
            cli="magnify-dock"
            props={props}
            dependencies={dependencies}
        />
    );
}
