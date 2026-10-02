import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import KineticThreadBackground from '../../../components/MainUI/ApexUI-Kit/KineticThreadsBackground/KineticThreadBackground.jsx';

const code = `import KineticThreadsBackground from './ApexUI-Kit/KineticThreadsBackground/KineticThreadsBackground.jsx';

const App = () => (
  <div className="relative w-full h-screen">
    <KineticThreadsBackground
      speed={0.7}
      amplitude={1.2}
      distance={0.3}
      color="#a3e635"
      mouseInteraction={true}
    />
    {/* Your content here */}
  </div>
);

export default App;`;

const props = [
    { prop: 'speed', type: 'number', def: '1.0', desc: 'Speed of the animation.' },
    { prop: 'amplitude', type: 'number', def: '1.0', desc: 'Amplitude of the thread waves.' },
    { prop: 'distance', type: 'number', def: '0.5', desc: 'Distance between the threads.' },
    { prop: 'color', type: 'string', def: "'#a3e635'", desc: 'Color of the threads.' },
    { prop: 'mouseInteraction', type: 'boolean', def: 'true', desc: 'Whether the threads respond to mouse movement.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'Three.js', desc: 'A powerful 3D library for immersive graphics.' },
];

export default function KineticThreadsBackgroundDoc() {
    return (
        <ComponentDoc
            title="Kinetic Threads Background"
            description="A generative WebGL background of flowing threads that bend toward the pointer."
            preview={
                <BackgroundDemo title="Kinetic Threads Background Demo">
                    <KineticThreadBackground speed={0.7} amplitude={1.2} distance={0.3} color="#a3e635" mouseInteraction />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="kinetic-threads-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
