import ComponentDoc from '../../docs/ComponentDoc.jsx';
import WaterDropReveal from '../../../components/MainUI/ApexUI-Kit/WaterDropReveal/WaterDropReveal.jsx';

const code = `import WaterDropReveal from './ApexUI-Kit/WaterDropReveal/WaterDropReveal.jsx';

const App = () => (
  <WaterDropReveal
    text={"Discover the Water Drop Reveal Effect!\\nHover to experience the reveal."}
    dropCount={3}
    dropColor="#a855f7"
    animationSpeed={0.4}
  />
);

export default App;`;

const props = [
    { prop: 'text', type: 'string', def: '"Discover the Water Drop…"', desc: 'Text to reveal. Use \\n for line breaks.' },
    { prop: 'dropCount', type: 'number', def: '3', desc: 'Number of water drops (1–10).' },
    { prop: 'dropColor', type: 'string', def: '"#a855f7"', desc: 'Color of the water drops.' },
    { prop: 'animationSpeed', type: 'number', def: '0.4', desc: 'Speed of the drop animation.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'A professional-grade animation library.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function WaterDropRevealDoc() {
    return (
        <ComponentDoc
            title="Water Drop Reveal"
            description="Water drops fall and merge to reveal the text underneath when you hover."
            preview={<WaterDropReveal animationSpeed={0.6} />}
            code={code}
            cli="water-drop-reveal"
            props={props}
            dependencies={dependencies}
        />
    );
}
