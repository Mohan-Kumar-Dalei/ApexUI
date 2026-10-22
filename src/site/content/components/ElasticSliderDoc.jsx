import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import ElasticSlider from '../../../components/MainUI/ApexUI-Kit/ElasticSlider/ElasticSlider.jsx';

const props = [
    { prop: 'defaultValue', type: "number", def: "50", desc: "Starting value." },
    { prop: 'min', type: "number", def: "0", desc: "Minimum." },
    { prop: 'max', type: "number", def: "100", desc: "Maximum." },
    { prop: 'step', type: "number", def: "1", desc: "Step size." },
    { prop: 'leftIcon', type: "ReactNode", def: "Volume1", desc: "Icon at the start." },
    { prop: 'rightIcon', type: "ReactNode", def: "Volume2", desc: "Icon at the end." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Filled track color." },
    { prop: 'onChange', type: "(value) => void", def: "none", desc: "Called as the value changes." },
    { prop: 'showValue', type: "boolean", def: "true", desc: "Show the value below." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Stretch and spring-back.' },
    { name: 'Lucide React', desc: 'Volume icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ElasticSliderDoc() {
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Elastic Slider"
            description="Drag past either end and the track stretches like rubber, pulling the end icon with it, then springs back when you let go. The track thickens while hovered."
            preview={
                <ElasticSlider accentColor={accent} className="text-[var(--ink)]" />
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import { useState } from 'react';
import ElasticSlider from './ApexUI-Kit/ElasticSlider/ElasticSlider.jsx';

const App = () => {
  const [volume, setVolume] = useState(50);

  return <ElasticSlider defaultValue={50} onChange={setVolume} accentColor="${accent}" />;
};

export default App;`}
            cli="elastic-slider"
            props={props}
            dependencies={dependencies}
        />
    );
}
