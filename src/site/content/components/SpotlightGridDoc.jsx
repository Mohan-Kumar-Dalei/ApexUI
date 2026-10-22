import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import SpotlightGrid from '../../../components/MainUI/ApexUI-Kit/SpotlightGrid/SpotlightGrid.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'items', type: '{ title, description?, icon?, span? }[]', def: '6 feature cards', desc: 'Cards in order; span: 2 makes a card twice as wide on larger screens.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Spotlight color for borders and glow.' },
    { prop: 'size', type: 'number', def: '360', desc: 'Spotlight diameter in px.' },
    { prop: 'theme', type: "'auto' | 'dark' | 'light'", def: '"auto"', desc: "Card colors; auto follows the visitor's light / dark setting." },
    { prop: 'minCardWidth', type: 'number', def: '12', desc: 'Smallest card width in rem before the grid wraps.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the grid.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Cards fade up as they enter the view.' },
    { name: 'Lucide React', desc: 'Demo icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function SpotlightGridDoc() {
    const [color, setColor] = useState('#a3e635');
    const [size, setSize] = useState(360);
    const siteTheme = useSiteTheme();
    const [themeChoice, setTheme] = useState('site');
    // By default the demo matches the site's day / night theme.
    const theme = themeChoice === 'site' ? siteTheme : themeChoice;

    const code = `import { Zap, Lock, Globe2 } from 'lucide-react';
import SpotlightGrid from './ApexUI-Kit/SpotlightGrid/SpotlightGrid.jsx';

const items = [
  { title: "Lightning fast", description: "Loads only what a page needs.", icon: Zap, span: 2 },
  { title: "Secure by default", description: "Nothing to configure.", icon: Lock },
  { title: "Global edge", description: "Close to every user.", icon: Globe2 },
];

const App = () => <SpotlightGrid items={items} color="${color}" size={${size}} theme="auto" />;

export default App;`;

    return (
        <ComponentDoc
            title="Spotlight Grid"
            description="A bento grid of cards that share one pointer spotlight — the light sweeps across every border and surface at once."
            preview={<SpotlightGrid key={theme} color={color} size={size} theme={theme} className="max-w-3xl" />}
            controls={
                <ControlGrid>
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <RangeControl label="Spotlight size" value={size} onChange={setSize} min={160} max={640} step={20} format={(v) => `${v}px`} />
                    <SelectControl label="Theme" value={themeChoice} onChange={setTheme} options={[{ value: 'site', label: 'Match site' }, { value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
                </ControlGrid>
            }
            code={code}
            cli="spotlight-grid"
            props={props}
            dependencies={dependencies}
        />
    );
}
