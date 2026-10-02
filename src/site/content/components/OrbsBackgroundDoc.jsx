import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import FloatingOrbs from '../../../components/MainUI/ApexUI-Kit/OrbsBackground/FloatingOrbs.jsx';

const code = `import FloatingOrbs from './ApexUI-Kit/OrbsBackground/FloatingOrbs.jsx';

const App = () => (
  <FloatingOrbs
    className="flex flex-col items-center justify-center"
    containerClassName="h-screen"
    desktopOrbs={20}
    mobileOrbs={10}
  >
    {/* Your content here */}
  </FloatingOrbs>
);

export default App;`;

const props = [
    { prop: 'children', type: 'ReactNode', def: '—', desc: 'Content rendered above the orbs.' },
    { prop: 'className', type: 'string', def: '—', desc: 'Classes for the content wrapper.' },
    { prop: 'containerClassName', type: 'string', def: '—', desc: 'Classes for the outer container (height, background…).' },
    { prop: 'colors', type: 'string[]', def: 'built-in palette', desc: 'Orb colors to pick from.' },
    { prop: 'desktopOrbs', type: 'number', def: '20', desc: 'Number of orbs on desktop.' },
    { prop: 'mobileOrbs', type: 'number', def: '10', desc: 'Number of orbs on mobile.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'Framer Motion', desc: 'A library for creating animations in React.' },
];

export default function OrbsBackgroundDoc() {
    return (
        <ComponentDoc
            title="Orbs Background"
            description="Soft floating orbs that drift across the canvas and react to the pointer."
            preview={
                <BackgroundDemo title="Floating Orbs Demo">
                    <FloatingOrbs containerClassName="!h-full" />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="orbs-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
