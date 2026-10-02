import ComponentDoc from '../../docs/ComponentDoc.jsx';
import HyperCard from '../../../components/MainUI/ApexUI-Kit/HyperCard/HyperCard.jsx';

const code = `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

const App = () => (
  <HyperCard
    text="Apex UI is Lightning"
    LastText="Speed"
    LastTextColor="#9AE600"
    SubText="Experience the power of fully animated components."
    starColor="#9AE600"
    glow={true}
  />
);

export default App;`;

const props = [
    { prop: 'text', type: 'string', def: '"Apex UI..."', desc: 'Main title displayed on the card.' },
    { prop: 'LastText', type: 'string', def: '"Speed"', desc: 'Highlighted last word of the title.' },
    { prop: 'LastTextColor', type: 'string', def: '"purple"', desc: 'Color for the highlighted last word.' },
    { prop: 'SubText', type: 'string', def: '"Experience..."', desc: 'Subtitle below the title.' },
    { prop: 'width', type: 'string', def: '"w-80"', desc: 'Tailwind width class for the card.' },
    { prop: 'height', type: 'string', def: '"h-72"', desc: 'Tailwind height class for the card.' },
    { prop: 'starColor', type: 'string', def: '"#ffffff"', desc: 'Color of the animated stars.' },
    { prop: 'starCount', type: 'number', def: '250', desc: 'Number of stars in the background.' },
    { prop: 'glow', type: 'boolean', def: 'true', desc: 'Enables the animated glow effect.' },
    { prop: 'baseSpeed', type: 'number', def: '0.5', desc: 'Base speed of the starfield animation.' },
    { prop: 'warpSpeed', type: 'number', def: '8.5', desc: 'Speed of the stars on hover (warp effect).' },
    { prop: 'circlePosition', type: 'string', def: '"bottom"', desc: 'Position of the glow circle (e.g. bottom, center).' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function HyperCardDoc() {
    return (
        <ComponentDoc
            title="Hyper Card"
            description="A futuristic card with an animated starfield background and a warp-speed effect on hover."
            preview={
                <HyperCard
                    text="Apex UI is Lightning"
                    LastText="Speed"
                    LastTextColor="#9AE600"
                    SubText="Experience the power of fully animated components."
                    starColor="#9AE600"
                    glow
                />
            }
            code={code}
            cli="hyper-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
