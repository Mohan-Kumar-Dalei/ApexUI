/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Lucide Icons for a modern look
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy,
    Layers
} from 'lucide-react';
import { CopyBlock, irBlack } from 'react-code-blocks';
import SmokeBackground from '../ApexUI-Kit/SmokeBackground/SmokeBackground.jsx';
import { motion } from 'framer-motion';
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

const PropsTable = ({ propsList }) => {
    const [expanded, setExpanded] = useState(false);
    const showSeeMore = propsList.length > 5;
    const displayedProps = expanded ? propsList : propsList.slice(0, 5);

    return (
        <>
            {showSeeMore && (
                <div className='w-full flex justify-end items-center h-full -translate-y-10'>
                    <button
                        className="text-sm font-medium text-[var(--color-pages-side-active-text)] hover:text-[var(--color-pages-side-active-hover)]"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? "See Less" : `See ${propsList.length - displayedProps.length} More`}
                    </button>
                </div>
            )}
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
                        {displayedProps.map((row) => (
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
        </>
    );
}
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
    const [showDemo, setShowDemo] = useState(true);
    const contentRef = useRef(null);

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
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4 p-4">
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
                        <div className="w-full min-h-[60vh] bg-black/30 rounded-md relative overflow-hidden flex items-center justify-center">
                            {component.previewComponent}
                            {/* Demo Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 transition-opacity duration-500" style={{ opacity: showDemo ? 1 : 0, pointerEvents: showDemo ? 'auto' : 'none' }}>
                                <nav className="w-full max-w-md flex items-center justify-between px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg mb-8">
                                    <span className="font-bold text-lg text-white">Demo Nav</span>
                                    <div className="flex gap-4">
                                        <a href="#" className="text-white/70 hover:text-white font-medium transition">Home</a>
                                        <a href="#" className="text-white/70 hover:text-white font-medium transition">About</a>
                                    </div>
                                </nav>
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white text-center drop-shadow-lg">Smoke Background</h2>
                                <p className="text-white/80 text-center text-lg max-w-md">A beautiful animated background for your UI.</p>
                            </div>
                            {/* Animated Toggle Button */}
                            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center">
                                <span className="text-white text-xs mb-1 drop-shadow-md">Demo UI</span>
                                <button
                                    aria-label="Toggle Demo UI"
                                    onClick={() => setShowDemo(v => !v)}
                                    className={`w-14 h-8 flex items-center px-1 rounded-md border-2 transition-colors duration-300 focus:outline-none ${showDemo ? 'justify-end bg-[var(--color-pages-side-active-text)] border-[var(--color-pages-side-active-hover)]' : 'justify-start bg-black/30 border-[var(--color-pages-divider)]'}`}
                                >
                                    <motion.div
                                        className="w-6 h-6 bg-white rounded-sm shadow-lg"
                                        layout
                                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                    />
                                </button>
                            </div>
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

// --- MAIN APP COMPONENT ---
const PlasmaBackgroundEffect = () => {
    // To add more component showcases, just add a new object to this array.
    const componentData = [
        {
            id: 'SmokeBackground',
            name: "Smoke Background",
            description: "A mesmerizing smoke simulation with dynamic lighting.",
            icon: Layers,
            previewComponent: (
                <>
                    <div className="relative w-screen h-[70vh]">

                        <SmokeBackground
                            color="#00ffff"
                            speed={0.7}
                            direction="forward"
                            scale={1.2}
                            mouseInteractive={true}

                        />
                    </div>
                </>
            ),
            props: [
                { prop: 'color', type: 'string', def: '#ff8800', desc: 'The color of the smoke.' },
                { prop: 'speed', type: 'number', def: '0.3', desc: 'The speed of the smoke movement.' },
                { prop: 'scale', type: 'number', def: '1.2', desc: 'The scale of the smoke effect.' },
                { prop: 'direction', type: 'string', def: 'funny', desc: 'The direction of the smoke movement.' },
                { prop: 'opacity', type: 'number', def: '1', desc: 'The opacity of the smoke.' },
                { prop: 'mouseInteractive', type: 'boolean', def: 'true', desc: 'Whether the smoke reacts to mouse movement.' },
            ],
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'TailwindCSS', desc: 'A utility-first CSS framework for rapid styling.' },
                { name: 'OGL', desc: 'A powerful 3D library for creating immersive graphics.' },
            ],
            usageCode: `
import KineticThreadsBackground From './ApexUI-Kit/SmokeBackground/SmokeBackground.jsx'

const App = () => (
  <div className="relative w-full h-screen">
     <SmokeBackground
     color="#00aaff"
     speed={0.3}
     scale={1.2}
     direction='funny'
     mouseInteractive={true}
     />
  </div>
);
export default App;
            `,
            installationCode: "npm i apex-ui-kit && npx apex-ui-kit add smoke-background",
        },
        // Add your next component's data object here
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
export default PlasmaBackgroundEffect;