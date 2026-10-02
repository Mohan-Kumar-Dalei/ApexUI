import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import ColorControl, { RangeControl } from '../../docs/controls.jsx';
import LensFlareBackground from '../../../components/MainUI/ApexUI-Kit/LensFlareBackground/LensFlareBackground.jsx';

const props = [
    { prop: 'flareColor', type: 'string', def: "'#fbbf24'", desc: 'Main color of the lens flare.' },
    { prop: 'intensity', type: 'number', def: '1.0', desc: 'Intensity of the flare.' },
    { prop: 'animationSpeed', type: 'number', def: '1.0', desc: 'Animation speed.' },
    { prop: 'rayLengthValue', type: 'number', def: '1', desc: 'Length of the light rays.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Three.js', desc: '3D library for rendering and animations.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function LensFlareBackgroundDoc() {
    const [flareColor, setFlareColor] = useState('#9ae600');
    const [intensity, setIntensity] = useState(1);
    const [speed, setSpeed] = useState(1);
    const code = `import LensFlareBackground from './ApexUI-Kit/LensFlareBackground/LensFlareBackground.jsx';

const App = () => (
  <LensFlareBackground
    flareColor="${flareColor}"
    intensity={${intensity}}
    animationSpeed={${speed}}
  />
);

export default App;`;
    return (
        <ComponentDoc
            title="Lens Flare Background"
            description="An animated lens flare that adds a cinematic touch to any hero section."
            preview={
                <BackgroundDemo title="Lens Flare">
                    <LensFlareBackground flareColor={flareColor} intensity={intensity} animationSpeed={speed} />
                </BackgroundDemo>
            }
            fullBleed
            controls={
                <div className="grid gap-5 sm:grid-cols-3">
                    <ColorControl label="Flare color" value={flareColor} onChange={setFlareColor} />
                    <RangeControl label="Intensity" value={intensity} onChange={setIntensity} min={0.1} max={2} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.1} max={3} step={0.01} format={(v) => v.toFixed(2)} />
                </div>
            }
            code={code}
            cli="lens-flare-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
