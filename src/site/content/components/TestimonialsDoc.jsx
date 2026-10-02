import ComponentDoc from '../../docs/ComponentDoc.jsx';
import Testimonials from '../../../components/MainUI/ApexUI-Kit/Testimonials/Testimonials.jsx';

const testimonials = [
    { text: 'This is a game-changer. The animations are so smooth, and the component is incredibly easy to customize. Highly recommended!', author: 'Spider Man', title: 'Friendly Neighborhood Spider-Man', image: '/assets/spiderman.png' },
    { text: 'I was able to integrate this into my project in minutes. The props-based data makes it flexible for any use case.', author: 'Iron Man', title: 'Leader of Stark Industries', image: '/assets/ironman.png' },
    { text: 'Fantastic design and flawless execution. The use of Framer Motion adds a professional touch that clients love.', author: 'HULK', title: 'Hulk Smash', image: '/assets/hulk.png' },
    { text: "Our user engagement saw a significant boost after implementing this design. It's both beautiful and intuitive.", author: 'Captain America', title: 'Leader Of The Avengers', image: '/assets/captainamerica.png' },
];

const code = `import Testimonials from './ApexUI-Kit/Testimonials/Testimonials.jsx';

const testimonials = [
  {
    text: "This is a game-changer. The animations are so smooth, and the component is incredibly easy to customize.",
    author: "Spider Man",
    title: "Friendly Neighborhood Spider-Man",
    image: "/assets/spiderman.png",
  },
  {
    text: "I was able to integrate this into my project in minutes.",
    author: "Iron Man",
    title: "Leader of Stark Industries",
    image: "/assets/ironman.png",
  },
];

const App = () => <Testimonials testimonials={testimonials} />;

export default App;`;

const props = [
    { prop: 'testimonials', type: 'array', def: '—', desc: 'Testimonials to show. Each item has text, author, title and image.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'GSAP', desc: 'A high-performance JavaScript animation library.' },
];

export default function TestimonialsDoc() {
    return (
        <ComponentDoc
            title="Testimonials"
            description="A testimonials card with smooth transitions between quotes — social proof that looks the part."
            preview={<Testimonials testimonials={testimonials} />}
            previewClassName="min-h-[560px]"
            code={code}
            cli="testimonials"
            props={props}
            dependencies={dependencies}
        />
    );
}
