import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import RadialMenu from '../../../components/MainUI/ApexUI-Kit/RadialMenu/RadialMenu.jsx';

const LAYOUTS = { circle: { arc: 360, startAngle: -90 }, top: { arc: 180, startAngle: -180 }, corner: { arc: 90, startAngle: -90 } };

const props = [
    { prop: 'items', type: '{ icon?, label }[]', def: '7 demo actions', desc: 'Actions; icon is a component (e.g. from lucide-react).' },
    { prop: 'radius', type: 'number', def: '6.5', desc: 'Distance of the items from the center, in rem.' },
    { prop: 'arc', type: 'number', def: '360', desc: 'Spread in degrees: 360 for a circle, 180 for a half, 90 for a corner.' },
    { prop: 'startAngle', type: 'number', def: '-90', desc: 'Where the first item sits, in degrees (-90 is the top).' },
    { prop: 'onSelect', type: '(item, index) => void', def: 'none', desc: 'Called when an action is picked.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Main button and active item color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Item colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Item springs and the rotating plus.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function RadialMenuDoc() {
    const theme = useSiteTheme();
    const [layout, setLayout] = useState('circle');
    const [radius, setRadius] = useState(6.5);
    const [accent, setAccent] = useState('#a3e635');
    const [last, setLast] = useState(null);
    return (
        <ComponentDoc
            title="Radial Menu"
            description="A round button that fans its actions out in a circle, a half circle or a corner arc. Items spring out one after another; arrow keys move between them, Escape or a click outside closes it."
            preview={
                <div className="flex flex-col items-center gap-2 text-[var(--ink)]">
                    <RadialMenu key={layout} {...LAYOUTS[layout]} radius={radius} accentColor={accent} theme={theme} onSelect={(item) => setLast(item.label)} />
                    <p className="h-5 font-mono text-xs text-[var(--ink-3)]">{last ? `picked: ${last}` : 'Tap the button'}</p>
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Layout" value={layout} onChange={setLayout} options={[{ value: 'circle', label: 'Circle' }, { value: 'top', label: 'Half circle' }, { value: 'corner', label: 'Corner' }]} />
                    <RangeControl label="Radius" value={radius} onChange={setRadius} min={4} max={9} step={0.5} format={(v) => `${v}rem`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import RadialMenu from './ApexUI-Kit/RadialMenu/RadialMenu.jsx';
import { Home, User, Settings } from 'lucide-react';

const App = () => (
  <RadialMenu
    arc={${LAYOUTS[layout].arc}}
    startAngle={${LAYOUTS[layout].startAngle}}
    radius={${radius}}
    accentColor="${accent}"
    items={[
      { icon: Home, label: "Home" },
      { icon: User, label: "Profile" },
      { icon: Settings, label: "Settings" },
    ]}
    onSelect={(item) => console.log(item.label)}
  />
);

export default App;`}
            cli="radial-menu"
            props={props}
            dependencies={dependencies}
        />
    );
}
