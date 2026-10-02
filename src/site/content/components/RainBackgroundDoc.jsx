import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import RainBackground from '../../../components/MainUI/ApexUI-Kit/RainBackground/RainBackground.jsx';

const code = `import RainBackground from './ApexUI-Kit/RainBackground/RainBackground.jsx';

const App = () => (
  <div className="relative w-full h-screen">
    <RainBackground
      dropCount={32}
      dropGradient="linear-gradient(to bottom, #00f2fe, #4facfe)"
      collisionGradient="linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
    />
    {/* Your content here */}
  </div>
);

export default App;`;

const props = [
    { prop: 'dropCount', type: 'number', def: '32', desc: 'Number of rain drops.' },
    { prop: 'dropColor', type: 'string', def: "'#fff'", desc: 'Color of the rain drops (used when no gradient is set).' },
    { prop: 'collisionColor', type: 'string', def: "'#e0e7ff'", desc: 'Color of the splash when a drop hits the ground.' },
    { prop: 'dropGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for the rain drops.' },
    { prop: 'collisionGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for the collision splash.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'A powerful animation library.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function RainBackgroundDoc() {
    return (
        <ComponentDoc
            title="Rain Background"
            description="Animated rainfall with collision detection — drops splash when they hit the ground."
            preview={
                <BackgroundDemo title="Rain Effect">
                    <RainBackground
                        dropGradient="linear-gradient(to bottom, #ec003f, #51a2ff)"
                        collisionGradient="linear-gradient(90deg, #ec003f 0%, #51a2ff 100%)"
                        dropCount={5}
                    />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="rain-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
