import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import StarBorder from '../../../components/MainUI/ApexUI-Kit/StarBorder/StarBorder.jsx';

const props = [
    { prop: 'as', type: "string", def: "\"button\"", desc: "Element to render, e.g. \"a\" for links." },
    { prop: 'color', type: "string", def: "\"#a3e635\"", desc: "Star color." },
    { prop: 'speed', type: "number", def: "5", desc: "Seconds per pass." },
    { prop: 'thickness', type: "number", def: "1.5", desc: "Visible edge thickness in px." },
    { prop: 'theme', type: "'dark' | 'light'", def: "\"dark\"", desc: "Button surface." },
    { prop: 'children', type: "ReactNode", def: "\"Get started\"", desc: "Label." },
    { prop: '...rest', type: "any", def: "none", desc: "Other props (href, onClick, …)." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Looping star movement.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function StarBorderDoc() {
    const [color, setColor] = useState('#a3e635');
    const [speed, setSpeed] = useState(5);
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Star Border"
            description="Two soft points of light travel along the top and bottom edges of a button in opposite directions, like stars sliding around its rim. Renders a button or a link."
            preview={
                <div className="flex flex-wrap items-center justify-center gap-5">
                    <StarBorder color={color} speed={speed} theme={theme}>Get started</StarBorder>
                    <StarBorder color={color} speed={speed} theme={theme} as="a" href="#">Read the docs →</StarBorder>
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Star" value={color} onChange={setColor} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={2} max={10} step={0.5} format={(v) => `${v}s`} />
                </ControlGrid>
            }
            code={`import StarBorder from './ApexUI-Kit/StarBorder/StarBorder.jsx';

const App = () => (
  <div>
    <StarBorder color="${color}" speed={${speed}} onClick={() => signUp()}>
      Get started
    </StarBorder>
  </div>
);

export default App;`}
            cli="star-border"
            props={props}
            dependencies={dependencies}
        />
    );
}
