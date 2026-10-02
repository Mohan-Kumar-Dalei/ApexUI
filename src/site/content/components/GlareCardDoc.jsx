import ComponentDoc from '../../docs/ComponentDoc.jsx';
import GlareCard from '../../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';

const code = `import GlareCard from './ApexUI-Kit/GlareCard/GlareCard.jsx';

const App = () => (
  <GlareCard className="flex items-center justify-center">
    <h1 className="text-white text-2xl font-bold">Your Content Here</h1>
  </GlareCard>
);

// Render it without children to get the built-in ApexUI demo card.

export default App;`;

const props = [
    { prop: 'children', type: 'ReactNode', def: 'demo content', desc: 'Content inside the card. Without children the ApexUI demo card is shown.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Additional CSS classes for the card.' },
    { prop: 'backgroundImage', type: 'string', def: 'bgHexa', desc: 'Background image URL for the card.' },
    { prop: 'foilSvg', type: 'string', def: 'default SVG', desc: 'SVG string or URL for the foil overlay effect.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
    { name: 'Framer Motion', desc: 'Animation library for React.' },
];

export default function GlareCardDoc() {
    return (
        <ComponentDoc
            title="Glare Card"
            description="A card with a reflective glare effect that follows the user's cursor."
            preview={
                <GlareCard className="flex flex-col items-center justify-center p-8 text-center">
                    <h3 className="text-2xl font-bold text-white">Glare Card Effect</h3>
                    <p className="mt-2 text-white/80">Move your cursor over the card</p>
                </GlareCard>
            }
            code={code}
            cli="glare-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
