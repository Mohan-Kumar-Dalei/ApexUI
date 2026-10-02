import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import SmokeBackground from '../../../components/MainUI/ApexUI-Kit/SmokeBackground/SmokeBackground.jsx';

const code = `import SmokeBackground from './ApexUI-Kit/SmokeBackground/SmokeBackground.jsx';

const App = () => (
  <div className="relative w-full h-screen">
    <SmokeBackground
      color="#00aaff"
      speed={0.3}
      scale={1.2}
      direction="forward" // "forward" | "backward" | "funny"
      mouseInteractive={true}
    />
  </div>
);

export default App;`;

const props = [
    { prop: 'color', type: 'string', def: "'#00c950'", desc: 'Color of the smoke.' },
    { prop: 'speed', type: 'number', def: '1', desc: 'Speed of the smoke movement.' },
    { prop: 'scale', type: 'number', def: '1', desc: 'Scale of the smoke effect.' },
    { prop: 'direction', type: "'forward' | 'backward' | 'funny'", def: "'forward'", desc: 'Direction of the smoke movement.' },
    { prop: 'opacity', type: 'number', def: '1', desc: 'Opacity of the smoke.' },
    { prop: 'mouseInteractive', type: 'boolean', def: 'true', desc: 'Whether the smoke reacts to mouse movement.' },
    { prop: 'className', type: 'string', def: "''", desc: 'Classes for the outer wrapper.' },
    { prop: 'maxWidth', type: 'string', def: "'max-w-4xl'", desc: 'Tailwind max-width class for the canvas.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'OGL', desc: 'A minimal WebGL library used for the smoke shader.' },
];

export default function SmokeBackgroundDoc() {
    return (
        <ComponentDoc
            title="Smoke Background"
            description="A WebGL smoke simulation with dynamic lighting that drifts with the pointer."
            preview={
                <BackgroundDemo title="Smoke Background">
                    <SmokeBackground color="#00ffff" speed={0.7} direction="forward" scale={1.2} mouseInteractive maxWidth="max-w-none" />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="smoke-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
