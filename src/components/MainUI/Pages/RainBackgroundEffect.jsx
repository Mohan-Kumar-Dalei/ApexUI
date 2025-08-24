/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Change: FontAwesome is replaced with Lucide Icons for consistency
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    ChevronDown,
    Package,
    CloudRain, // Icon for this component
    Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CopyBlock, irBlack } from 'react-code-blocks';
import RainBackground from '../ApexUI-Kit/RainBackground/RainBackground.jsx';


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
        { prop: 'dropCount', type: 'number', def: '100', desc: 'Number of rain drops' },
        { prop: 'dropColor', type: 'string', def: '"#7c3aed"', desc: 'Color of the rain drops' },
        { prop: 'speed', type: 'number', def: '1.5', desc: 'Speed of the rain animation' },
        { prop: 'blur', type: 'boolean', def: 'true', desc: 'Enable blur effect on drops' },
        { prop: 'background', type: 'string', def: '"#181824"', desc: 'Background color behind the rain' },
        { prop: 'children', type: 'ReactNode', def: 'null', desc: 'Content to render over the rain' },
        { prop: 'dropGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for rain drops' },
        { prop: 'collisionGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for collision/explosion' },
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
        { name: 'GSAP', desc: 'A powerful animation library' },
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

const RainBackgroundEffect = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx';
    const [showAllProps, setShowAllProps] = useState(false);
    const [showDemo, setShowDemo] = useState(true);
    const contentRef = useRef(null);

    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];

    const codeSnippets = 
       `import RainBackground from './ApexUI-Kit/RainBackground/RainBackground.jsx';

const App = () => {
  return (
    <RainBackground
      dropGradient="linear-gradient(to bottom, #00f2fe, #4facfe)"
      collisionGradient="linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
    />
  );
};
export default App;`
    let copyText = 'npm i apex-ui-kit && npx apex-ui-kit add rain-background'

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
                    <h1 className="whitespace-nowrap text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4 py-4">
                        <CloudRain /> Rain Background
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        A beautiful, animated rain effect for your backgrounds with collision detection.
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
                            <div className="w-full h-[60vh] bg-black/30 rounded-md relative overflow-hidden">
                                <RainBackground
                                    dropGradient="linear-gradient(to bottom, #ec003f, #51a2ff)"
                                    collisionGradient="linear-gradient(90deg, #ec003f 0%, #51a2ff 100%)"
                                    dropCount={5}
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
                                    <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white text-center drop-shadow-lg">Rain Effect Demo</h2>
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

export default RainBackgroundEffect;
