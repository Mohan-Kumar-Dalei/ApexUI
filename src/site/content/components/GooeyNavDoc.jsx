import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import GooeyNav from '../../../components/MainUI/ApexUI-Kit/GooeyNav/GooeyNav.jsx';

const props = [
    { prop: 'items', type: "{ label, href }[]", def: "4 demo links", desc: "Links." },
    { prop: 'initialActive', type: "number", def: "0", desc: "Active link at start." },
    { prop: 'onChange', type: "(index, item) => void", def: "—", desc: "Called when a link is clicked." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Blob color." },
    { prop: 'particleCount', type: "number", def: "8", desc: "Droplets per click." },
    { prop: 'theme', type: "'dark' | 'light'", def: "\"dark\"", desc: "Bar colors." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Pill and droplet motion.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function GooeyNavDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const [count, setCount] = useState(8);
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Gooey Nav"
            description="The active pill glides between links like a drop of liquid, and every click bursts a few droplets that melt back into it. Only the blob layer is gooey, so labels stay crisp."
            preview={
                <GooeyNav accentColor={accent} particleCount={count} theme={theme} />
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Blob" value={accent} onChange={setAccent} />
                    <RangeControl label="Droplets" value={count} onChange={setCount} min={0} max={16} step={1} />
                </ControlGrid>
            }
            code={`import GooeyNav from './ApexUI-Kit/GooeyNav/GooeyNav.jsx';

const App = () => (
  <div>
    <GooeyNav
      accentColor="${accent}"
      particleCount={${count}}
      items={[
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
      ]}
    />
  </div>
);

export default App;`}
            cli="gooey-nav"
            props={props}
            dependencies={dependencies}
        />
    );
}
