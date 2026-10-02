import ComponentDoc from '../../docs/ComponentDoc.jsx';
import GlareCard from '../../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';

const code = `import GlareCard from './ApexUI-Kit/GlareCard/GlareCard.jsx';

const App = () => (
  <GlareCard>
    <h1 style={{ color: 'white', textAlign: 'center' }}>
      Your Content Here
    </h1>
  </GlareCard>
);

export default App;`;

const props = [
    { prop: 'children', type: 'ReactNode', def: 'null', desc: 'Content to render inside the glare card.' },
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
                <GlareCard>
                    <div className="text-center text-white">
                        <h3 className="text-2xl font-bold">Glare Card Effect</h3>
                        <p className="mt-2 text-white/80">Move cursor to see the effect</p>
                    </div>
                </GlareCard>
            }
            code={code}
            cli="glare-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
