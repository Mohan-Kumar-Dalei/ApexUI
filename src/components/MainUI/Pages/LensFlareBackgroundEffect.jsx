/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    ChevronDown,
    Package,
    Sun,
    Copy
} from 'lucide-react';
import { CopyBlock, irBlack } from 'react-code-blocks';
// Minimal CopyButton for code blocks (TailwindSetup style)
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
                    style={{
                        minWidth: '60px',
                        textAlign: 'center',
                        zIndex: 30,
                    }}
                >
                    Copied!
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" style={{ marginTop: '-2px' }}></span>
                </span>
            )}
        </div>
    );
};
import LensFlareBackground from '../ApexUI-Kit/LensFlareBackground/LensFlareBackground.jsx';

// --- SUB-COMPONENTS (Updated with CSS Variables and new design) ---

// Consistent "Show More" button
function PropsShowMoreBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 5) return null;
    return (
        <button
            className="text-sm font-medium text-[var(--color-pages-side-active-text)] hover:text-[var(--color-pages-side-active-hover)]"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 5} More`}
        </button>
    );
}

// Consistent PropsTable
function PropsTable({ showAll, setShowAll }) {
    const allProps = [
        { prop: 'flareColor', type: 'string', def: '"#fbbf24"', desc: 'Main color of the lens flare' },
        { prop: 'intensity', type: 'number', def: '1.0', desc: 'Flare intensity (opacity)' },
        { prop: 'animationSpeed', type: 'number', def: '1.0', desc: 'Speed of flare animation' },
    ];
    const displayProps = showAll ? allProps : allProps.slice(0, 5);

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
                <PropsShowMoreBtn showAll={showAll} setShowAll={setShowAll} propCount={allProps.length} />
            </div>
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
                    {displayProps.map((row) => (
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
}

// Consistent DependenciesList
function DependenciesList() {
    const dependencies = [
        { name: 'React', desc: 'Modern React library for UI building' },
        { name: 'Three.js', desc: '3D library for rendering and animations' },
        { name: 'TailwindCSS', desc: 'Utility-first CSS framework for rapid styling' },
    ];
    return (
        <ul className="space-y-4">
            {dependencies.map(dep => (
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
}


// --- MAIN COMPONENT (Updated with Tabbed Interface and CSS Variables) ---

const LensFlareBackgroundEffect = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx';
    const [showAllProps, setShowAllProps] = useState(false);
    const contentRef = useRef(null);

    // Live prop states
    const [flareColor, setFlareColor] = useState('#9ae600');
    const [intensity, setIntensity] = useState(1.0);
    const [animationSpeed, setAnimationSpeed] = useState(1.0);
    const [showDemo, setShowDemo] = useState(true); // State for demo content toggle


    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];

    const codeSnippets =
        `import LensFlareBackground from './ApexUI-Kit/LensFlareBackground/LensFlareBackground.jsx';

const App = () => (
  <LensFlareBackground
    flareColor="#fbbf24"
    intensity={1.0}
    animationSpeed={1.0}
  />
);
export default App;`
    let copyText = "npm i apex-ui-kit && npx apex-ui-kit add lens-flare-background";
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    return (
        <div className="text-[var(--color-pages-props-text2)] min-h-screen">
            <div className="max-w-5xl mx-auto py-16 sm:py-24">

                <header className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl sm:text-6xl lg:h-20 h-28 font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4">
                        <Sun /> LensFlare Background
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        A beautiful, animated lens flare effect to add a cinematic touch to your backgrounds.
                    </p>
                </header>

                <div className="w-full bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg shadow-2xl overflow-hidden">
                    <div className="border-b border-[var(--color-pages-divider)]">
                        <nav className="flex space-x-1 sm:space-x-2 px-2 sm:px-4" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative group font-medium text-sm py-4 px-2 sm:px-3 focus:outline-none transition-colors w-full md:w-auto ${activeTab === tab.id
                                            ? 'text-[var(--color-pages-side-active-text)]'
                                            : 'text-[var(--color-pages-props-text)] hover:text-[var(--color-pages-side-hover)]'
                                        }`}
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
                            <div>
                                <div className="w-full h-[70vh] bg-black rounded-md relative overflow-hidden flex items-center justify-center">
                                    <LensFlareBackground
                                        flareColor={flareColor}
                                        intensity={intensity}
                                        animationSpeed={animationSpeed}
                                    />
                                    {/* Demo Content Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 transition-opacity duration-500" style={{ opacity: showDemo ? 1 : 0, pointerEvents: showDemo ? 'auto' : 'none' }}>
                                        <nav className="w-full max-w-md flex items-center justify-between px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg mb-8">
                                            <span className="font-bold text-lg text-white">Demo Nav</span>
                                            <div className="flex gap-4">
                                                <a href="#" className="text-white/70 hover:text-white font-medium transition">Home</a>
                                                <a href="#" className="text-white/70 hover:text-white font-medium transition">About</a>
                                            </div>
                                        </nav>
                                        <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white text-center drop-shadow-lg">LensFlare Demo</h2>
                                        <p className="text-white/80 text-center text-lg max-w-md">A beautiful animated background for your UI.</p>
                                    </div>

                                    {/* Animated Toggle Button with Framer Motion */}
                                    <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center">
                                        <span className="text-white text-xs mb-1 drop-shadow-md">Demo UI</span>
                                        <button
                                            aria-label="Toggle Demo UI"
                                            onClick={() => setShowDemo(v => !v)}
                                            className={`w-14 h-8 flex items-center px-1 rounded-md border-2 transition-colors duration-300 focus:outline-none ${showDemo ? 'justify-end bg-[var(--color-pages-side-active-text)] border-[var(--color-pages-side-active-hover)]' : 'justify-start bg-black/30 border-[var(--color-pages-divider)]'}`}
                                        >
                                            <motion.div
                                                className="w-6 h-6 bg-white rounded shadow-lg"
                                                layout
                                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                </div>
                                {/* --- Live Controls --- */}
                                <div className="mt-6 p-4 bg-[var(--color-pages-border)]/50 border border-[var(--color-pages-border)] rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-sm text-[var(--color-pages-props-text)] font-medium">Flare Color</label>
                                            <input
                                                type="color"
                                                value={flareColor}
                                                onChange={e => setFlareColor(e.target.value)}
                                                className="w-10 h-10 bg-transparent rounded border-none cursor-pointer"
                                                title="Pick flare color"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            <label className="text-sm text-[var(--color-pages-props-text)] font-medium">Intensity: {intensity.toFixed(2)}</label>
                                            <input
                                                type="range" min={0.1} max={2} step={0.01}
                                                value={intensity}
                                                onChange={e => setIntensity(Number(e.target.value))}
                                                className="w-full h-2 bg-[var(--color-pages-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--color-pages-side-active-text)]"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            <label className="text-sm text-[var(--color-pages-props-text)] font-medium">Speed: {animationSpeed.toFixed(2)}</label>
                                            <input
                                                type="range" min={0.1} max={3} step={0.01}
                                                value={animationSpeed}
                                                onChange={e => setAnimationSpeed(Number(e.target.value))}
                                                className="w-full h-2 bg-[var(--color-pages-bg)] rounded-lg appearance-none cursor-pointer accent-[var(--color-pages-side-active-text)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'usage' && (
                            <div>
                                <div className="mt-2 relative">
                                    <CopyBlock
                                        text={codeSnippets}
                                        language={selectedLang}
                                        theme={irBlack}
                                        codeBlock
                                        showLineNumbers={false}
                                        customStyle={{
                                            overflowX: 'auto',
                                            background: 'black'
                                        }}
                                    />
                                    <CopyButton text={codeSnippets} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'installation' && (
                            <div className="relative mt-2">
                                <CopyBlock
                                    text={copyText}
                                    language="bash"
                                    theme={irBlack}
                                    codeBlock
                                    showLineNumbers={false}
                                    customStyle={{
                                        overflowX: 'auto',
                                        background: 'black'
                                    }}
                                />
                                <CopyButton text={copyText} />
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
                            <PropsTable showAll={showAllProps} setShowAll={setShowAllProps} />
                        </div>
                    </div>
                    <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                        <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                            <Puzzle className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                            Dependencies
                        </h3>
                        <div className="mt-4">
                            <DependenciesList />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LensFlareBackgroundEffect;
