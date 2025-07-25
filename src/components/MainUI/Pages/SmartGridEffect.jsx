import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faCodeBranch,
    faTerminal,
    faTableList,
    faPuzzlePiece,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { Settings, Wifi, Rocket, HardDrive, Lock, Sparkles } from "lucide-react";
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import SmartGridCard from '../ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

const SmartGridEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [mergeMap, setMergeMap] = useState({ 5: 2 });
    // For code snippet live update
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

    // Helper to print mergeMap with number keys (not string keys)
    function printMergeMap(obj) {
        const entries = Object.entries(obj);
        if (entries.length === 0) return '{}';
        return '{' + entries.map(([k, v]) => `${Number.isNaN(Number(k)) ? k : Number(k)}: ${v}`).join(', ') + '}';
    }

    const codeSnippets = {
        jsx: `import SmartGridCard from './ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';
const App = ()=> {
return (
   <div>
      <SmartGridCard 
            mergeMap=${printMergeMap(currentMerge)}
      />
   </div>
}
export default App  
`,
        tsx: `import SmartGridCard from './ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

export default function App(): JSX.Element {
  return (
    <div>
      <SmartGridCard 
            mergeMap=${printMergeMap(currentMerge)}
      />
    </div>
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' }
    ];

    // SmartGridCard props array for table
    const smartGridProps = [
        { prop: 'cards', type: 'array', def: 'defaultCards()', desc: 'You can easily create cards array of objects using the props Each card object should have id, icon, title, description, and buttonText' },
        { prop: 'mergeMap', type: 'object', def: '{5:2}', desc: 'Map of card merges (target: source)' },
        { prop: 'borderColor', type: 'string', def: "purple", desc: 'Border color for the grid cards' },
        { prop: 'id', type: 'number', def: "1", desc: 'Unique identifier for each card' },
        { prop: 'icon', type: 'string', def: "<FontAwesomeIcon icon={faCube} />", desc: 'Icon for the card (from Lucide or FontAwesome)' },
        { prop: 'title', type: 'string', def: 'Card Title', desc: 'Title of the card' },
        { prop: 'description', type: 'string', def: 'Card Description', desc: 'Description of the card' },
        { prop: 'buttonText', type: 'string', def: 'Click Me', desc: 'Text for the card button' },
    ];

    // Show more/less logic for props table: show 5, expand for rest
    const [showAllProps, setShowAllProps] = useState(false);

    return (
        <>
            {/* 📍 Smart Grid Showcase - HyperCard Style */}
            <section className=" py-20 pb-20   text-[wheat] ">
                <div className="max-w-5xl mx-auto flex flex-col gap-10 items-center ">
                    {/* Title */}
                    <h2 className="text-3xl font-bold flex items-center gap-3 w-full max-w-5xl">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400 text-2xl" />
                        Smart Grid Card
                    </h2>

                    {/* Install Instructions (plain) */}
                    <div className="w-full max-w-5xl mb-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#181824]/50 border border-purple-800 text-green-400 px-4 py-3 font-mono rounded-md relative shadow-md scrollbar-hide">
                            <CopyBlock
                                text={`npm i apex-ui-kit && npx apex-ui-kit add smart-grid-card`}
                                language="bash"
                                showLineNumbers={false}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>

                    {/* Component Preview Heading OUTSIDE the box (HyperCard style) */}
                    <div className="w-full py-20 max-w-5xl flex flex-col items-start">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Component Preview
                        </h4>
                        {/* HyperCard: Component Preview (with all heading icons) */}
                        <div className="w-full max-w-5xl rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl px-8 py-8 flex flex-col items-center mx-auto">
                            {/* Merge Presets */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-3 w-full items-center justify-center mb-6">
                                {mergeOptions.map(({ label, source, target }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleMerge(source, target)}
                                        className="relative overflow-hidden px-5 py-2 rounded-md border border-purple-400/60 text-white transition hover:text-white bg-black/20 group"
                                    >
                                        <span className="relative z-10">{label}</span>
                                        <span
                                            className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-md"
                                            style={{
                                                background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                                                mixBlendMode: "screen",
                                            }}
                                        />
                                    </button>
                                ))}
                                <button
                                    onClick={clearMerge}
                                    className="relative overflow-hidden px-5 py-2 rounded-md border border-white/20 text-white bg-red-500/80 hover:bg-red-600 transition group"
                                >
                                    <span className="relative z-10">Reset</span>
                                    <span className="absolute bottom-0 left-0 w-full h-full bg-red-800/40 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 rounded-md" />
                                </button>
                            </div>

                            {/* SmartGrid Display - Large screens only */}
                            <div className="hidden lg:flex items-center justify-center w-full min-w-[900px] p-4">
                                <SmartGridCard
                                    mergeMap={mergeMap}
                                />
                            </div>
                            {/* Overlay for small screens */}
                            <div className="flex lg:hidden flex-col items-center justify-center w-full min-h-[200px] py-10">
                                <Lock className="w-12 h-12 text-purple-400 mb-4" />
                                <h4 className="text-2xl font-bold flex items-center gap-3 text-white mb-4">Lock</h4>
                                <p className="text-white/70 text-center max-w-xs mb-2">This feature is available only on large screens Sorry buddy the cards are responsive not this playground </p>
                            </div>
                        </div>
                    </div>


                    {/* Usage Example (with icon heading) */}
                    <div className="max-w-5xl mx-auto mt-12 mb-8 w-full max-sm:w-full max-sm:px-0">
                        <div className="mb-3 flex justify-between">
                            <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                                Usage Example
                            </h4>
                            <div className="relative w-32">
                                <button
                                    className="w-full bg-[#181824] border border-purple-700/40 text-white px-4 py-2 rounded-md flex items-center justify-between focus:outline-none hover:bg-purple-800/30 transition"
                                    onClick={() => setDropdownOpen((open) => !open)}
                                >
                                    <span>{languageOptions.find(opt => opt.value === selectedLang).label}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-white/60" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute z-10 mt-2 w-full bg-[#181824] border border-purple-700/40 rounded shadow-lg">
                                        {languageOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    setSelectedLang(option.value);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2 cursor-pointer hover:bg-purple-700/30 text-white ${selectedLang === option.value ? 'bg-purple-700/40' : ''}`}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-[#0e0e10]/20 p-4 rounded-md text-sm font-mono relative border border-purple-600/50 shadow-lg overflow-x-auto">
                            <CopyBlock
                                text={codeSnippets[selectedLang]}
                                language={selectedLang}
                                theme={dracula}
                                codeBlock
                                showLineNumbers={false}
                            />
                        </div>
                    </div>

                    {/* HyperCard: Props Section (styled like HyperCard, now collapsible) */}
                    <section className="max-w-5xl mx-auto mt-12 mb-8 w-full max-sm:w-full max-sm:px-0">
                        <div className="rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center justify-between gap-4 w-full">
                                    <div className='flex items-center gap-4'>
                                        <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                                        <h4 className="text-xl font-bold text-white">Props</h4>
                                    </div>
                                    {smartGridProps.length > 5 && (
                                        <button
                                            className="px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
                                            onClick={() => setShowAllProps((v) => !v)}
                                        >
                                            {showAllProps ? 'Show Less' : `Show ${smartGridProps.length - 5} More`}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="overflow-x-auto rounded-md border border-purple-600/50 shadow-xl scrollbar-hide">
                                <table className="min-w-full text-sm text-white table-auto ">
                                    <thead className="bg-purple-800/80 text-white uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Prop</th>
                                            <th className="px-4 py-3 text-left">Type</th>
                                            <th className="px-4 py-3 text-left">Default</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-600/20">
                                        {(showAllProps ? smartGridProps : smartGridProps.slice(0, 5)).map((row) => (
                                            <tr key={row.prop} className="hover:bg-purple-800/10 transition">
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-purple-300">{row.prop}</td>
                                                <td className="px-4 py-3 text-indigo-300">{row.type}</td>
                                                <td className="px-4 py-3 text-emerald-400">{row.def}</td>
                                                <td className="px-4 py-3 text-white/80">{row.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Show More/Less button moved to header */}
                            </div>
                        </div>
                    </section>

                    {/* HyperCard: Dependencies Section */}
                    <div className="w-full max-w-5xl rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl p-6 mb-8">
                        <h4 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <FontAwesomeIcon icon={faPuzzlePiece} className="text-purple-400 text-xl" />
                            Dependencies
                        </h4>
                        <ul className="text-base text-white/90 list-none pl-0 space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="bg-blue-900/60 p-2 rounded-full flex items-center justify-center">
                                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                </span>
                                <span>
                                    <code className="text-blue-300 font-semibold">React</code>
                                    <span className="ml-2 text-white/70">Modern React library for UI building</span>
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-purple-900/60 p-2 rounded-full flex items-center justify-center">
                                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                </span>
                                <span>
                                    <code className="text-purple-300 font-semibold">TailwindCSS</code>
                                    <span className="ml-2 text-white/70">Utility-first CSS framework for rapid styling</span>
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-green-900/60 p-2 rounded-full flex items-center justify-center">
                                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                </span>
                                <span>
                                    <code className="text-green-300 font-semibold">GSAP</code>
                                    <span className="ml-2 text-white/70">Animation library for creating high-performance animations</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SmartGridEffect;