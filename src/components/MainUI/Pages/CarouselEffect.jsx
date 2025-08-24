/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy,
    View,
} from 'lucide-react';
import { CopyBlock, irBlack } from 'react-code-blocks';
import Carousel from '../ApexUI-Kit/Carousel/Carousel.jsx';
import ParallaxCarousel from '../ApexUI-Kit/ParallaxCarousel/ParallaxCarousel.jsx'
import DragCarousel from '../ApexUI-Kit/DragCarousel/DragCarousel.jsx'
// --- Reusable Sub-Components (No Changes) ---

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };
    return (
        <div className="absolute top-2 right-2 z-20 flex flex-col items-center">
            <button
                onClick={handleCopy}
                className="p-2 rounded-md bg-black text-[var(--color-pages-side-active-text)] transition-all duration-200"
                aria-label={copied ? 'Copied!' : 'Copy code'}
            >
                <Copy className="w-4 h-4" />
            </button>
            {copied && (
                <span
                    className="pointer-events-none select-none absolute -top-8 right-1/2 translate-x-1/2 px-3 py-1 rounded-md bg-white text-xs font-semibold text-black border border-gray-200"
                    style={{ minWidth: '60px', textAlign: 'center', zIndex: 30 }}
                >
                    Copied!
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" style={{ marginTop: '-2px' }}></span>
                </span>
            )}
        </div>
    );
};

const PropsTable = ({ propsList }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead className="text-xs text-[var(--color-pages-props-text)] uppercase">
                <tr>
                    <th className="pb-3 text-left font-semibold">Prop</th>
                    <th className="pb-3 text-left font-semibold">Type</th>
                    <th className="pb-3 text-left font-semibold">Default</th>
                    <th className="pb-3 text-left font-semibold">Description</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-pages-divider)]">
                {propsList.map((row) => (
                    <tr key={row.prop}>
                        <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text)]">{row.prop}</td>
                        <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text2)]">{row.type}</td>
                        <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text3)]">{row.def}</td>
                        <td className="py-4 text-[var(--color-pages-props-text)]">{row.desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const DependenciesList = ({ dependenciesList }) => (
    <ul className="space-y-4">
        {dependenciesList.map(dep => (
            <li key={dep.name} className="flex items-center gap-4 p-4 bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg">
                <Package className="text-[var(--color-pages-side-active-text)] w-6 h-6 flex-shrink-0" />
                <div>
                    <code className="font-semibold text-[var(--color-pages-props-text2)]">{dep.name}</code>
                    <p className="text-sm text-[var(--color-pages-props-text3)]">{dep.desc}</p>
                </div>
            </li>
        ))}
    </ul>
);


// --- REUSABLE SHOWCASE COMPONENT ---

const ComponentShowcase = ({ component }) => {
    const [activeTab, setActiveTab] = useState('preview');
    const contentRef = useRef(null);
    const HeaderIcon = component.icon;

    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    return (
        <div className="w-full">
            <header className="text-center mb-12">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4 py-4">
                    {component.name}
                </h1>
                <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                    {component.description}
                </p>
            </header>

            <div className="w-full bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg shadow-2xl overflow-hidden">
                <div className="border-b border-[var(--color-pages-divider)]">
                    <nav className="flex space-x-1 sm:space-x-2 px-2 sm:px-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative group font-medium text-sm py-4 px-2 sm:px-3 focus:outline-none transition-colors w-full md:w-auto ${activeTab === tab.id ? 'text-[var(--color-pages-side-active-text)]' : 'text-[var(--color-pages-props-text)] hover:text-[var(--color-pages-side-hover)]'}`}
                            >
                                <tab.icon className="inline-block w-4 h-4 mr-2" />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-pages-side-active-text)] rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div ref={contentRef} className="p-4 sm:p-6">
                    {activeTab === 'preview' && (
                        <div className="w-full min-h-[50vh] bg-black/30 rounded-md flex items-center justify-center p-8 overflow-hidden">
                            {component.previewComponent}
                        </div>
                    )}
                    {activeTab === 'usage' && (
                        <div className="relative mt-2">
                            <CopyBlock text={component.usageCode} language="jsx" theme={irBlack} codeBlock showLineNumbers={false} customStyle={{ overflowX: 'auto', background: 'black' }} />
                            <CopyButton text={component.usageCode} />
                        </div>
                    )}
                    {activeTab === 'installation' && (
                        <div className="relative mt-2">
                            <CopyBlock text={component.installationCode} language="bash" theme={irBlack} codeBlock showLineNumbers={false} customStyle={{ overflowX: 'auto', background: 'black' }} />
                            <CopyButton text={component.installationCode} />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                    <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                        <List className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                        Props
                    </h3>
                    <div className="mt-4">
                        <PropsTable propsList={component.props} />
                    </div>
                </div>
                <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                    <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                        <Puzzle className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                        Dependencies
                    </h3>
                    <div className="mt-4">
                        <DependenciesList dependenciesList={component.dependencies} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const slides = [
    {
        imageUrl: '/assets/ironman.png',
        pngUrl: '/assets/png/iron-man.png',
        title: 'Iron Man',
        subtitle: "Gain insights that matter.",
        text: "Track your performance with our advanced analytics dashboard. Understand your users and make data-driven decisions.",
    },
    {
        imageUrl: '/assets/spiderman.png',
        title: 'Spider Man',
        pngUrl: '/assets/png/spider-man.png',
        subtitle: "Swing into action.",
        text: "Join Spider Man in an adventure through the city. Experience the thrill of web-slinging and crime-fighting."
    },
    {
        imageUrl: '/assets/captainamerica.png',
        title: 'Captain America',
        pngUrl: '/assets/png/captain-america.png',
        subtitle: "Stand tall and fight.",
        text: "Join Captain America in the battle for justice. Experience the thrill of being a hero."
    },
    {
        imageUrl: '/assets/hulk.png',
        title: 'Hulk',
        pngUrl: '/assets/png/hulk.png',
        subtitle: "Unleash the beast within.",
        text: "Join Hulk in a journey of strength and resilience. Experience the thrill of being the strongest Avenger."
    },
    {
        imageUrl: '/assets/doctorStrange.png',
        title: 'Doctor Strange',
        pngUrl: '/assets/png/doctor-strange.png',
        subtitle: "Master of the mystic arts.",
        text: "Join Doctor Strange in a journey through the multiverse. Experience the thrill of bending reality."
    },
    {
        imageUrl: '/assets/thanos.png',
        title: 'Thanos',
        pngUrl: '/assets/png/thanos.png',
        subtitle: "The Mad Titan.",
        text: "Join Thanos in his quest for the Infinity Stones. Experience the thrill of ultimate power."
    },
]
const images = [

    '/assets/ironman.png',
    '/assets/captainamerica.png',
    '/assets/spiderman.png',
    '/assets/hulk.png',
    '/assets/doctorStrange.png',
    '/assets/thanos.png',
]

// --- MAIN APP COMPONENT ---
const CarouselEffect = () => {
    const componentData = [
        {
            id: 'carousel',
            name: "Carousel",
            description: "A responsive and touch-friendly carousel component for showcasing images or content.",
            icon: View,
            previewComponent: <Carousel slides={slides} />,
            props: [
                { prop: 'slides', type: 'array', def: '[]', desc: 'Array of slide objects, each with an imageUrl and title.' },
            ],
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'Framer Motion', desc: 'For smooth animations and gestures.' },
                { name: 'TailwindCSS', desc: 'A utility-first CSS framework for rapid styling.' },
            ],
            usageCode: `import carousel from './ApexUI-Kit/Carousel/Carousel.jsx'
const App = () => {
     const slides = [
{
    imageUrl: '/assets/ironman.png',
    title: 'Iron Man',
    subtitle: "Gain insights that matter.",
    text: "Track your performance with our advanced analytics dashboard. Understand your users and make data-driven decisions.",
},
{
    imageUrl: '/assets/spiderman.png',
    title: 'Spider Man',
    subtitle: "Swing into action.",
    text: "Join Spider Man in an adventure through the city. Experience the thrill of web-slinging and crime-fighting."
},
                    
]
    return(
        <carousel slides={slides}/>
    );
}
`,
            installationCode: "npm i apex-ui-kit && npx apex-ui-kit add carousel",
        },
        {
            id: 'ParallaxCarousel',
            name: "Parallax Carousel",
            description: "A carousel component with a parallax Hovering and auto-slide effect.",
            icon: View,
            previewComponent: <ParallaxCarousel slides={slides} />,
            props: [
                { prop: 'slides', type: 'array', def: '[]', desc: 'Array of slide objects, each with an imageUrl and title.' },
            ],
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'Framer Motion', desc: 'For smooth animations and gestures.' },
                { name: 'TailwindCSS', desc: 'A utility-first CSS framework for rapid styling.' },
            ],
            usageCode: `import ParallaxCarousel from './ApexUI-Kit/Carousel/ParallaxCarousel.jsx'
const App = () => {
     const slides = [
{
    imageUrl: '/assets/ironman.png',
    title: 'Iron Man',
    pngUrl: '/assets/png/iron-man.png',
    subtitle: "Gain insights that matter.",
    text: "Track your performance with our advanced analytics dashboard. Understand your users and make data-driven decisions.",
},
{
    imageUrl: '/assets/spiderman.png',
    pngUrl: '/assets/png/spider-man.png',
    title: 'Spider Man',
    subtitle: "Swing into action.",
    text: "Join Spider Man in an adventure through the city. Experience the thrill of web-slinging and crime-fighting."
},
                    
]
    return(
        <ParallaxCarousel slides={slides}/>
    );
}
`,
            installationCode: "npm i apex-ui-kit && npx apex-ui-kit add parallax-carousel",
        },
        {
            id: 'DragCarousel',
            name: "Drag Carousel",
            description: "A carousel component with mouse Drag functionality.",
            icon: View,
            previewComponent: <DragCarousel images={images} />,
            props: [
                { prop: 'images', type: 'array', def: '[]', desc: 'Array of image URLs to display in the carousel.' },
            ],
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'GSAP', desc: 'For smooth animations and gestures.' },
                { name: 'TailwindCSS', desc: 'A utility-first CSS framework for rapid styling.' },
            ],
            usageCode: `import DragCarousel from './ApexUI-Kit/Carousel/DragCarousel.jsx'
const App = () => {
     const images = [
    '/assets/ironman.png',
    '/assets/captainamerica.png',
    '/assets/spiderman.png',
    '/assets/hulk.png',
    '/assets/doctorStrange.png',
    '/assets/thanos.png',
]
    return(
        <DragCarousel images={images}/>
    );
}
`,
            installationCode: "npm i apex-ui-kit && npx apex-ui-kit add drag-carousel",
        },

    ];

    return (
        <div className="text-[var(--color-pages-props-text2)] min-h-screen">
            <div className="max-w-5xl mx-auto py-16 sm:py-24 space-y-24">
                {componentData.map(component => (
                    <ComponentShowcase key={component.id} component={component} />
                ))}
            </div>
        </div>
    );
}

export default CarouselEffect;