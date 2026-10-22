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
    { prop: 'goo', type: "number", def: "12", desc: "How strongly drops melt into the pill (smooth-union radius in px)." },
    { prop: 'theme', type: "'dark' | 'light'", def: "\"dark\"", desc: "Bar colors." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'WebGL', desc: 'Built into the browser — a small metaball shader, no library needed.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function GooeyNavDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const [count, setCount] = useState(8);
    const [goo, setGoo] = useState(12);
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Gooey Nav"
            description="A WebGL metaball nav — the active pill is a liquid drop that stretches toward the next link and snaps back, while droplets burst out and melt into it. Labels stay crisp HTML; falls back to a CSS pill without WebGL."
            preview={
                <GooeyNav accentColor={accent} particleCount={count} goo={goo} theme={theme} />
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Blob" value={accent} onChange={setAccent} />
                    <RangeControl label="Droplets" value={count} onChange={setCount} min={0} max={12} step={1} />
                    <RangeControl label="Goo" value={goo} onChange={setGoo} min={2} max={24} step={1} format={(v) => `${v}px`} />
                </ControlGrid>
            }
            code={`import GooeyNav from './ApexUI-Kit/GooeyNav/GooeyNav.jsx';

const App = () => (
  <div>
    <GooeyNav
      accentColor="${accent}"
      particleCount={${count}}
      goo={${goo}}
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
