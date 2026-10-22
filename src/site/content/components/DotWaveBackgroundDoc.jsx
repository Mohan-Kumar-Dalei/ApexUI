import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import DotWaveBackground from '../../../components/MainUI/ApexUI-Kit/DotWaveBackground/DotWaveBackground.jsx';

const props = [
    { prop: 'children', type: 'ReactNode', def: 'none', desc: 'Content rendered above the dots.' },
    { prop: 'colors', type: '[string, string]', def: '["#38bdf8", "#a78bfa"]', desc: 'Wave highlight colors, blended left to right (hex).' },
    { prop: 'dotColor', type: 'string', def: '"#ffffff"', desc: 'Color of the resting dots (hex).' },
    { prop: 'background', type: 'string', def: '"#09090b"', desc: 'Background behind the dots.' },
    { prop: 'gap', type: 'number', def: '22', desc: 'Space between dots, in pixels.' },
    { prop: 'dotSize', type: 'number', def: '1.2', desc: 'Resting dot radius, in pixels.' },
    { prop: 'waveStrength', type: 'number', def: '1', desc: 'How bright and big the wave makes the dots (0 turns it off).' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Wave speed multiplier.' },
    { prop: 'interactive', type: 'boolean', def: 'true', desc: 'Dots near the pointer swell, light up and lean away.' },
    { prop: 'fade', type: 'boolean', def: 'true', desc: 'Soften the edges with a radial fade.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the content wrapper.' },
    { prop: 'containerClassName', type: 'string', def: '""', desc: 'Classes for the outer container (defaults to h-screen).' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function DotWaveBackgroundDoc() {
    const [colorA, setColorA] = useState('#38bdf8');
    const [colorB, setColorB] = useState('#a78bfa');
    const [gap, setGap] = useState(22);
    const [speed, setSpeed] = useState(1);
    const [waveStrength, setWaveStrength] = useState(1);
    const [interactive, setInteractive] = useState(true);

    const code = `import DotWaveBackground from './ApexUI-Kit/DotWaveBackground/DotWaveBackground.jsx';

const App = () => (
  <DotWaveBackground
    colors={["${colorA}", "${colorB}"]}
    gap={${gap}}
    speed={${speed}}
    waveStrength={${waveStrength}}${interactive ? '' : '\n    interactive={false}'}
  >
    {/* Your content here */}
  </DotWaveBackground>
);

export default App;`;

    return (
        <ComponentDoc
            title="Dot Wave Background"
            description="A calm grid of dots with a wave of color rolling through it, dots near the pointer swell, glow and lean away."
            preview={
                <BackgroundDemo title="Dot Wave Background">
                    <DotWaveBackground
                        containerClassName="!h-full"
                        colors={[colorA, colorB]}
                        gap={gap}
                        speed={speed}
                        waveStrength={waveStrength}
                        interactive={interactive}
                    />
                </BackgroundDemo>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <ColorControl label="Color A" value={colorA} onChange={setColorA} />
                    <ColorControl label="Color B" value={colorB} onChange={setColorB} />
                    <RangeControl label="Dot gap" value={gap} onChange={setGap} min={14} max={40} step={1} format={(v) => `${v}px`} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0.2} max={3} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                    <RangeControl label="Wave strength" value={waveStrength} onChange={setWaveStrength} min={0} max={1.5} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Pointer effect" value={interactive} onChange={setInteractive} />
                </ControlGrid>
            }
            code={code}
            cli="dot-wave-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
