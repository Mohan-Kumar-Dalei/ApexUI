import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import CardSwap3D from '../../../components/MainUI/ApexUI-Kit/CardSwap3D/CardSwap3D.jsx';

const props = [
    { prop: 'cards', type: "{ icon?, title, body }[]", def: "4 demo cards", desc: "Cards in the stack." },
    { prop: 'delay', type: "number", def: "3200", desc: "Milliseconds between swaps." },
    { prop: 'distanceX', type: "number", def: "3.6", desc: "Horizontal step back in rem." },
    { prop: 'distanceY', type: "number", def: "3.2", desc: "Vertical step back in rem." },
    { prop: 'skew', type: "number", def: "5", desc: "Skew in degrees." },
    { prop: 'pauseOnHover', type: "boolean", def: "true", desc: "Pause while hovered." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Icon badge color." },
    { prop: 'theme', type: "'dark' | 'light'", def: "\"dark\"", desc: "Card colors." },
    { prop: 'width', type: "number", def: "18", desc: "Card width in rem." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Stack springs and drop.' },
    { name: 'Lucide React', desc: 'Card icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CardSwap3DDoc() {
    const [skew, setSkew] = useState(5);
    const [delay, setDelay] = useState(3200);
    const [accent, setAccent] = useState('#a3e635');
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Card Swap 3D"
            description="Cards stacked diagonally into the distance in 3D. On a timer the front card drops away and slides to the back while the rest step forward. Pauses on hover; click to swap now."
            preview={
                <CardSwap3D skew={skew} delay={delay} accentColor={accent} theme={theme} width={16} />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Skew" value={skew} onChange={setSkew} min={-10} max={10} step={1} format={(v) => `${v}°`} />
                    <RangeControl label="Delay" value={delay} onChange={setDelay} min={1500} max={6000} step={100} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import CardSwap3D from './ApexUI-Kit/CardSwap3D/CardSwap3D.jsx';

const App = () => (
  <div>
    <CardSwap3D
      skew={${skew}}
      delay={${delay}}
      accentColor="${accent}"
      cards={[
        { title: "Smooth", body: "Springs tuned to feel natural." },
        { title: "Composable", body: "Style it with Tailwind." },
        { title: "Fast", body: "Transforms only, 60fps." },
      ]}
    />
  </div>
);

export default App;`}
            cli="card-swap-3d"
            props={props}
            dependencies={dependencies}
        />
    );
}
