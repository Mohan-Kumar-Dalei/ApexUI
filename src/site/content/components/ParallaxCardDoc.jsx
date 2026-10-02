import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ParallaxCard from '../../../components/MainUI/ApexUI-Kit/ParallaxCard/ParallaxCard.jsx';

const cardData = [
    {
        title: 'Hover Me',
        subtitle: 'Built for Modern Development',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
        description: 'Our platform integrates seamlessly with your existing workflow, enabling rapid development and deployment with 99.99% uptime.',
        link: 'https://apex-ui.in',
    },
];

const code = `import ParallaxCard from './ApexUI-Kit/ParallaxCard/ParallaxCard.jsx';

const cardData = [
  {
    title: "Next-Gen Platform",
    subtitle: "Built for Modern Development",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    description: "Our platform integrates seamlessly with your existing workflow.",
    link: "https://apex-ui.in",
  },
];

const App = () => (
  <ParallaxCard
    cardData={cardData}
    tiltEnable={true}
    glareEnable={true}
    perspective={500}
    scale={1.1}
  />
);

export default App;`;

const props = [
    { prop: 'cardData', type: 'array', def: '[]', desc: 'Cards to render. Each item has title, subtitle, imageUrl, description and link.' },
    { prop: 'tiltEnable', type: 'boolean', def: '—', desc: 'Enables the 3D tilt on hover.' },
    { prop: 'glareEnable', type: 'boolean', def: '—', desc: 'Enables the glare highlight on hover.' },
    { prop: 'perspective', type: 'number', def: '—', desc: 'CSS perspective used for the tilt, in px.' },
    { prop: 'scale', type: 'number', def: '—', desc: 'Scale applied while hovering.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'GSAP', desc: 'A professional-grade animation library for the parallax effect.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
];

export default function ParallaxCardDoc() {
    return (
        <ComponentDoc
            title="Parallax Card"
            description="A card with a layered 3D parallax effect that reacts to mouse movement, creating a sense of depth."
            preview={<div className="text-white"><ParallaxCard cardData={cardData} tiltEnable glareEnable perspective={500} scale={1.1} /></div>}
            code={code}
            cli="parallax-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
