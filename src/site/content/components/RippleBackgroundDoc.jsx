import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import RippleBackground from '../../../components/MainUI/ApexUI-Kit/RippleBackground/RippleBackground.jsx';

const colors = ['#34D399', '#3B82F6', '#8B5CF6', '#F472B6', '#FBBF24'];

const code = `import RippleBackground from './ApexUI-Kit/RippleBackground/RippleBackground.jsx';

const App = () => (
  <RippleBackground
    colors={['#34D399', '#3B82F6', '#8B5CF6', '#F472B6', '#FBBF24']}
    desktopGridSize={20}
    mobileGridSize={10}
  >
    {/* Your content here */}
  </RippleBackground>
);

export default App;`;

const props = [
    { prop: 'children', type: 'ReactNode', def: '—', desc: 'Content rendered above the ripples.' },
    { prop: 'className', type: 'string', def: '—', desc: 'Classes for the content wrapper.' },
    { prop: 'containerClassName', type: 'string', def: '—', desc: 'Classes for the outer container.' },
    { prop: 'colors', type: 'string[]', def: 'built-in palette', desc: 'Colors used for the ripple waves.' },
    { prop: 'desktopGridSize', type: 'number', def: '20', desc: 'Grid size on desktop (e.g. 20 × 20).' },
    { prop: 'mobileGridSize', type: 'number', def: '10', desc: 'Grid size on mobile.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'GSAP', desc: 'A powerful library for animations.' },
];

export default function RippleBackgroundDoc() {
    return (
        <ComponentDoc
            title="Ripple Background"
            description="A grid of tiles that ripple outward in waves of color."
            preview={
                <BackgroundDemo title="Ripple Background">
                    <RippleBackground colors={colors} containerClassName="!h-full !w-full" />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="ripple-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
