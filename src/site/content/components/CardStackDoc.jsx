import ComponentDoc from '../../docs/ComponentDoc.jsx';
import CardStack from '../../../components/MainUI/ApexUI-Kit/CardStack/CardStack.jsx';
import { withCdn } from '../../ui/cdn.js';

const cards = withCdn([
    {
        title: 'Iron Man',
        subtitle: 'Leader of Stark Industries',
        desc: 'Genius, billionaire, philanthropist. Tap the card to see the next hero.',
        color: 'from-red-500/70 to-amber-400/40',
        image: '/assets/ironman.png',
        link: 'https://apex-ui.in/',
        github: 'https://github.com/Mohan-Kumar-Dalei/ApexUI',
    },
    {
        title: 'Spider-Man',
        subtitle: 'Friendly neighbourhood hero',
        desc: 'Swings across the city. Pauses on hover, cycles on its own.',
        color: 'from-rose-500/70 to-blue-500/40',
        image: '/assets/spiderman.png',
        link: 'https://apex-ui.in/',
        github: 'https://github.com/Mohan-Kumar-Dalei/ApexUI',
    },
    {
        title: 'Captain America',
        subtitle: 'Leader of the Avengers',
        desc: 'Stacked with smooth, springy transitions between cards.',
        color: 'from-blue-600/70 to-red-500/40',
        image: '/assets/captainamerica.png',
        link: 'https://apex-ui.in/',
        github: 'https://github.com/Mohan-Kumar-Dalei/ApexUI',
    },
    {
        title: 'Hulk',
        subtitle: 'The strongest Avenger',
        desc: 'Full-bleed images, a tinted gradient and progress dots.',
        color: 'from-green-500/70 to-lime-300/40',
        image: '/assets/hulk.png',
        link: 'https://apex-ui.in/',
        github: 'https://github.com/Mohan-Kumar-Dalei/ApexUI',
    },
], { w: 640 });

const code = `import CardStack from './ApexUI-Kit/CardStack/CardStack.jsx';

const cards = [
  {
    title: "Iron Man",
    subtitle: "Leader of Stark Industries",
    desc: "Genius, billionaire, philanthropist.",
    color: "from-red-500/70 to-amber-400/40",
    image: "https://ik.imagekit.io/ny6yinyut/apexui/assets/ironman.png",
    link: "https://apex-ui.in/",
    github: "https://github.com/Mohan-Kumar-Dalei/ApexUI",
  },
  // Add more cards as needed
];

const App = () => (
  <CardStack cards={cards} autoCycle={true} cycleInterval={5000} />
);

export default App;`;

const props = [
    { prop: 'cards', type: 'array', def: '[...]', desc: 'Array of card data objects (title, subtitle, desc, color, image, link, github).' },
    { prop: 'autoCycle', type: 'boolean', def: 'true', desc: 'Enable or disable auto cycling of cards.' },
    { prop: 'cycleInterval', type: 'number', def: '5000', desc: 'Interval in ms between auto cycles.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function CardStackDoc() {
    return (
        <ComponentDoc
            title="Card Stack"
            description="An interactive stack of cards that cycles automatically, perfect for projects or testimonials."
            preview={<CardStack autoCycle cycleInterval={3000} cards={cards} />}
            code={code}
            cli="card-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
