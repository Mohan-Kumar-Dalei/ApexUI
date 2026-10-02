import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BasicCard from '../../../components/MainUI/ApexUI-Kit/Cards/BasicCard.jsx';
import MeteorCard from '../../../components/MainUI/ApexUI-Kit/MeteorCard/MeteorCard.jsx';

const basicData = [
    {
        title: 'Spider Man',
        summary: 'A superhero film based on the Marvel Comics character Spider-Man.',
        image: '/assets/spiderman.png',
        link: '',
    },
];

const meteorData = [
    {
        imageUrl: '/assets/black-panther.png',
        title: 'Black Panther',
        description: 'Experience the power and grace of the Black Panther in the digital realm.',
        buttonText: 'Explore Mission',
    },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
];

const variants = [
    {
        name: 'Basic Card',
        description: 'A simple card with a title, description, image and link.',
        preview: <BasicCard data={basicData} />,
        code: `import BasicCard from './ApexUI-Kit/Cards/BasicCard.jsx';

const data = [
  {
    title: "John Carter",
    summary: "Frontend developer passionate about React and design systems.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    link: "https://example2.com",
  },
];

const App = () => (
  <div className="relative w-full h-screen">
    <BasicCard data={data} />
  </div>
);

export default App;`,
        cli: 'basic-card',
        props: [
            { prop: 'data', type: 'array', def: '[]', desc: 'Cards to render. Each item has title, summary, image and link.' },
        ],
        dependencies,
    },
    {
        name: 'Meteor Card',
        description: 'A card with a meteor-shower particle animation behind its content.',
        preview: <MeteorCard data={meteorData} particleNumber={70} particleColor="#6366f1" particleSpeed={0.8} />,
        code: `import MeteorCard from './ApexUI-Kit/MeteorCard/MeteorCard.jsx';

const data = [
  {
    imageUrl: '/assets/black-panther.png',
    title: 'Black Panther',
    description: 'Experience the power and grace of the Black Panther in the digital realm.',
    buttonText: 'Explore Mission',
  },
];

// To change the meteor head or tail color, edit MeteorCard.css
// (the relevant rules are commented).
const App = () => (
  <div className="relative w-screen h-screen flex items-start justify-center flex-wrap">
    <MeteorCard
      data={data}
      particleNumber={70}
      particleColor="#6366f1"
      particleSpeed={0.8}
    />
  </div>
);

export default App;`,
        cli: 'meteor-card',
        props: [
            { prop: 'data', type: 'array', def: '[]', desc: 'Cards to render. Each item has imageUrl, title, description and buttonText.' },
            { prop: 'particleNumber', type: 'number', def: '70', desc: 'Number of particles in the background.' },
            { prop: 'particleColor', type: 'string', def: "'#6366f1'", desc: 'Color of the particles.' },
            { prop: 'particleSpeed', type: 'number', def: '0.8', desc: 'Speed of the particle animation.' },
        ],
        dependencies,
    },
];

export default function CardsDoc() {
    return (
        <ComponentDoc
            title="Cards"
            description="Content cards for profiles, products and features — from a simple basic card to an animated meteor card."
            variants={variants}
        />
    );
}
