import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import BluePrintBackground from '../../../components/MainUI/ApexUI-Kit/BluePrintBackground/BluePrintBackground.jsx';

const code = `import BluePrintBackground from './ApexUI-Kit/BluePrintBackground/BluePrintBackground.jsx';

const App = () => (
  <div className="relative w-full h-screen">
    <BluePrintBackground
      color="#9ae600"
      borderColor="rgb(98, 116, 142, 0.1)"
    />
  </div>
);

export default App;`;

const props = [
    { prop: 'color', type: 'string', def: "'#9ae600'", desc: 'Color of the grid boxes that light up under the pointer.' },
    { prop: 'borderColor', type: 'string', def: "'rgb(98, 116, 142, 0.1)'", desc: 'Color of the grid lines.' },
    { prop: 'bgColor', type: 'string', def: '—', desc: 'Background color.' },
    { prop: 'circleColor', type: 'string', def: "'rgb(154, 230, 0, 0.2)'", desc: 'Color of the spotlight circle.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'GSAP', desc: 'A powerful library for creating animations and transitions.' },
];

export default function BluePrintBackgroundDoc() {
    return (
        <ComponentDoc
            title="BluePrint Background"
            description="A blueprint-style grid background with dynamic lines and a spotlight that follows the pointer."
            preview={
                <BackgroundDemo title="BluePrint Background">
                    <BluePrintBackground color="#9ae600" borderColor="rgb(98, 116, 142, 0.1)" />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="blueprint-background"
            props={props}
            dependencies={dependencies}
        />
    );
}
