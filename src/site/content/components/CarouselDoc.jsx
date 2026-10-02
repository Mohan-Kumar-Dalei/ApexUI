import ComponentDoc from '../../docs/ComponentDoc.jsx';
import Carousel from '../../../components/MainUI/ApexUI-Kit/Carousel/Carousel.jsx';
import ParallaxCarousel from '../../../components/MainUI/ApexUI-Kit/ParallaxCarousel/ParallaxCarousel.jsx';
import DragCarousel from '../../../components/MainUI/ApexUI-Kit/DragCarousel/DragCarousel.jsx';

const slides = [
    { imageUrl: '/assets/ironman.png', pngUrl: '/assets/png/iron-man.png', title: 'Iron Man', subtitle: 'Gain insights that matter.', text: 'Track your performance with our advanced analytics dashboard. Understand your users and make data-driven decisions.' },
    { imageUrl: '/assets/spiderman.png', pngUrl: '/assets/png/spider-man.png', title: 'Spider Man', subtitle: 'Swing into action.', text: 'Join Spider Man in an adventure through the city. Experience the thrill of web-slinging and crime-fighting.' },
    { imageUrl: '/assets/captainamerica.png', pngUrl: '/assets/png/captain-america.png', title: 'Captain America', subtitle: 'Stand tall and fight.', text: 'Join Captain America in the battle for justice. Experience the thrill of being a hero.' },
    { imageUrl: '/assets/hulk.png', pngUrl: '/assets/png/hulk.png', title: 'Hulk', subtitle: 'Unleash the beast within.', text: 'Join Hulk in a journey of strength and resilience. Experience the thrill of being the strongest Avenger.' },
    { imageUrl: '/assets/doctorStrange.png', pngUrl: '/assets/png/doctor-strange.png', title: 'Doctor Strange', subtitle: 'Master of the mystic arts.', text: 'Join Doctor Strange in a journey through the multiverse. Experience the thrill of bending reality.' },
    { imageUrl: '/assets/thanos.png', pngUrl: '/assets/png/thanos.png', title: 'Thanos', subtitle: 'The Mad Titan.', text: 'Join Thanos in his quest for the Infinity Stones. Experience the thrill of ultimate power.' },
];

const images = [
    '/assets/ironman.png',
    '/assets/captainamerica.png',
    '/assets/spiderman.png',
    '/assets/hulk.png',
    '/assets/doctorStrange.png',
    '/assets/thanos.png',
];

const slidesCode = (withPng) => `const slides = [
  {
    imageUrl: '/assets/ironman.png',${withPng ? "\n    pngUrl: '/assets/png/iron-man.png'," : ''}
    title: 'Iron Man',
    subtitle: "Gain insights that matter.",
    text: "Track your performance with our advanced analytics dashboard.",
  },
  {
    imageUrl: '/assets/spiderman.png',${withPng ? "\n    pngUrl: '/assets/png/spider-man.png'," : ''}
    title: 'Spider Man',
    subtitle: "Swing into action.",
    text: "Join Spider Man in an adventure through the city.",
  },
];`;

const slidesProp = [{ prop: 'slides', type: 'array', def: '[]', desc: 'Slide objects with imageUrl, title, subtitle and text.' }];

const variants = [
    {
        name: 'Carousel',
        description: 'A responsive, touch-friendly carousel for showcasing images or content.',
        preview: <Carousel slides={slides} />,
        code: `import Carousel from './ApexUI-Kit/Carousel/Carousel.jsx';

${slidesCode(false)}

const App = () => <Carousel slides={slides} />;

export default App;`,
        cli: 'carousel',
        props: slidesProp,
        dependencies: [
            { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
            { name: 'Framer Motion', desc: 'For smooth animations and gestures.' },
            { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
        ],
    },
    {
        name: 'Parallax Carousel',
        description: 'A carousel with parallax hover depth and auto-sliding.',
        preview: <ParallaxCarousel slides={slides} />,
        code: `import ParallaxCarousel from './ApexUI-Kit/ParallaxCarousel/ParallaxCarousel.jsx';

${slidesCode(true)}

const App = () => <ParallaxCarousel slides={slides} />;

export default App;`,
        cli: 'parallax-carousel',
        props: [{ prop: 'slides', type: 'array', def: '[]', desc: 'Slide objects with imageUrl, pngUrl (cut-out image), title, subtitle and text.' }],
        dependencies: [
            { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
            { name: 'Framer Motion', desc: 'For smooth animations and gestures.' },
            { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
        ],
    },
    {
        name: 'Drag Carousel',
        description: 'A carousel you can drag with the mouse or touch.',
        preview: <DragCarousel images={images} />,
        code: `import DragCarousel from './ApexUI-Kit/DragCarousel/DragCarousel.jsx';

const images = [
  '/assets/ironman.png',
  '/assets/captainamerica.png',
  '/assets/spiderman.png',
  '/assets/hulk.png',
  '/assets/doctorStrange.png',
  '/assets/thanos.png',
];

const App = () => <DragCarousel images={images} />;

export default App;`,
        cli: 'drag-carousel',
        props: [{ prop: 'images', type: 'array', def: '[]', desc: 'Image URLs to display in the carousel.' }],
        dependencies: [
            { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
            { name: 'GSAP', desc: 'For smooth animations and gestures.' },
            { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
        ],
    },
];

export default function CarouselDoc() {
    return (
        <ComponentDoc
            title="Carousel"
            description="Three carousel styles — classic, parallax and draggable — for showcasing images or content."
            variants={variants}
            wide
        />
    );
}
