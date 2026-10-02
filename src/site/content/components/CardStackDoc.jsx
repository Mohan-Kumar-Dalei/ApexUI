import ComponentDoc from '../../docs/ComponentDoc.jsx';
import CardStack from '../../../components/MainUI/ApexUI-Kit/CardStack/CardStack.jsx';

const cards = [
    {
        title: 'ApexUI Glass Card Stack',
        subtitle: 'Modern glassmorphic stack with animation',
        desc: 'Beautiful glassmorphic UI. Pause on hover, auto-cycling.',
        color: 'from-blue-500/60 to-blue-300/30',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
        link: 'https://github.com/sheryians/apexui',
        github: 'https://github.com/sheryians/apexui',
    },
    {
        title: 'React Modern Card',
        subtitle: 'Responsive, animated, and clean',
        desc: 'Modern, responsive, and animated. Stacked with smooth transitions.',
        color: 'from-pink-500/60 to-pink-300/30',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80',
        link: 'https://react.dev/',
        github: 'https://github.com/facebook/react',
    },
    {
        title: 'UI Stack Demo',
        subtitle: 'Stacked cards with effects',
        desc: 'Stacked with smooth transitions. Glassmorphic and beautiful.',
        color: 'from-green-500/60 to-green-300/30',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
        link: 'https://ui.sheryians.com/',
        github: 'https://github.com/sheryians/ui-demo',
    },
    {
        title: 'Pause & Cycle',
        subtitle: 'Auto-cycling, pause on hover',
        desc: 'Pause on hover, auto-cycling. Try it now!',
        color: 'from-yellow-500/60 to-yellow-300/30',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
        link: 'https://github.com/sheryians',
        github: 'https://github.com/sheryians',
    },
];

const code = `import CardStack from './ApexUI-Kit/CardStack/CardStack.jsx';

const cards = [
  {
    title: "ApexUI Card Stack",
    subtitle: "Modern card stack with animation",
    desc: "Beautiful card UI. Pause on hover, auto-cycling.",
    color: "from-blue-500/60 to-blue-300/30",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
    link: "https://github.com/sheryians/apexui",
    github: "https://github.com/sheryians/apexui",
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
            description="A stack of cards that cycles automatically and on click, pausing while hovered — perfect for projects or testimonials."
            preview={<CardStack autoCycle cycleInterval={3000} cards={cards} />}
            code={code}
            cli="card-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
