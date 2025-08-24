import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Change: FontAwesome is replaced with Lucide Icons for consistency
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Lock,
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
import SmartGridCard from '../ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

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
        { prop: 'cards', type: 'array', def: 'defaultCards[]', desc: 'Array of card objects (id, icon, title, etc.).' },
        { prop: 'mergeMap', type: 'object', def: '{5:2}', desc: 'Map of card merges (target: source).' },
        { prop: 'borderColor', type: 'string', def: '"purple"', desc: 'Border color for the grid cards.' },
        { prop: 'id', type: 'number', def: '1', desc: 'Unique identifier for each card.' },
        { prop: 'icon', type: 'ReactNode', def: '<Icon />', desc: 'Icon for the card (e.g., from Lucide).' },
        { prop: 'title', type: 'string', def: "'Card Title'", desc: 'Title of the card.' },
        { prop: 'description', type: 'string', def: "'Description'", desc: 'Description text for the card.' },
        { prop: 'buttonText', type: 'string', def: "'Click Me'", desc: 'Text for the card button.' },
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
        { name: 'Framer Motion', desc: 'Animation library for smooth effects' },
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

const SmartGridEffect = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx'
    const [showAllProps, setShowAllProps] = useState(false);
    const contentRef = useRef(null);

    const [mergeMap, setMergeMap] = useState({ 5: 2 });
    const [currentMerge, setCurrentMerge] = useState({ 5: 2 });

    const handleMerge = (source, target) => {
        setMergeMap((prev) => ({ ...prev, [source]: target }));
        setCurrentMerge((prev) => ({ ...prev, [source]: target }));
    };

    const clearMerge = () => {
        setMergeMap({});
        setCurrentMerge({});
    };

    const mergeOptions = [
        { label: "Merge 4:1", source: 4, target: 1 },
        { label: "Merge 5:2", source: 5, target: 2 },
        { label: "Merge 6:3", source: 6, target: 3 },
    ];

    function printMergeMap(obj) {
        const entries = Object.entries(obj);
        if (entries.length === 0) return '{}';
        return '{ ' + entries.map(([k, v]) => `${k}: ${v}`).join(', ') + ' }';
    }


    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];

    const codeSnippets =
        `import SmartGridCard from './ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

const App = () => {
  return (
    <SmartGridCard 
      mergeMap={${printMergeMap(currentMerge)}}
    />
  );
}
export default App;`
    let copyText = 'npm i apex-ui-kit && npx apex-ui-kit add smart-grid-card'

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
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4">
                        Smart Grid Card
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        A responsive grid of cards that can be dynamically merged for unique layouts.
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
                            <div className="w-full min-h-[60vh] bg-black/30 rounded-md flex flex-col items-center justify-center p-4">
                                <div className="flex flex-wrap gap-3 w-full items-center justify-center mb-6">
                                    {mergeOptions.map(({ label, source, target }) => (
                                        <button
                                            key={label}
                                            onClick={() => handleMerge(source, target)}
                                            className="px-4 py-2 rounded-md border border-[var(--color-pages-side-active-text)]/50 text-[var(--color-pages-side-active-text)] transition hover:bg-[var(--color-pages-side-active-text)] hover:text-[var(--color-pages-bg)] text-sm font-medium"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={clearMerge}
                                        className="px-4 py-2 rounded-md border border-red-500/50 text-red-400 transition hover:bg-red-500 hover:text-white text-sm font-medium"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <div className="hidden lg:flex items-center justify-center w-full p-4">
                                    <SmartGridCard mergeMap={mergeMap} />
                                </div>
                                <div className="flex lg:hidden flex-col items-center justify-center w-full min-h-[200px] py-10 text-center">
                                    <Lock className="w-12 h-12 text-[var(--color-pages-side-active-text)] mb-4" />
                                    <h4 className="text-xl font-bold text-white mb-2">Preview Unavailable</h4>
                                    <p className="text-[var(--color-pages-props-text)] max-w-xs">
                                        This interactive grid preview is best viewed on larger screens.
                                    </p>
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

export default SmartGridEffect;
