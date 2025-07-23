import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faCodeBranch,
    faTerminal,
    faTableList,
    faPuzzlePiece,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import HoverText from './HoverText'; // <-- Your HoverText component

// --- Update this array with your latest HoverText props ---
const hoverTextProps = [
    { prop: 'text', type: 'string', def: '"Hover Me"', desc: 'Text to display with hover effect.' },
    { prop: 'effect', type: 'string', def: '"defaultReveal"', desc: 'Animation effect. Options: "defaultReveal", "magnetic", "wave", "rubber", "jump", "rotate", "party".' },
    { prop: 'effectColor', type: 'string', def: '"#C27AFF"', desc: 'Color of the hover effect.' },
    { prop: 'fontSize', type: 'string/number', def: '"2rem"', desc: 'Font size of the text.' },
];

function PropsTable({ showAll, propsList }) {
    const displayProps = showAll ? propsList : propsList.slice(0, 5);
    return (
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
                    {displayProps.map((row) => (
                        <tr key={row.prop} className="hover:bg-purple-800/10 transition">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-purple-300">{row.prop}</td>
                            <td className="px-4 py-3 text-indigo-300">{row.type}</td>
                            <td className="px-4 py-3 text-emerald-400">{row.def}</td>
                            <td className="px-4 py-3 text-white/80">{row.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PropsCollapseBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 5) return null;
    return (
        <button
            className="px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition flex items-center gap-2"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
            {showAll ? 'Show Less' : `Show ${propCount - 5} More`}
        </button>
    );
}

function PropsAndDepsSections() {
    const [showAllProps, setShowAllProps] = useState(false);
    const propCount = hoverTextProps.length;
    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Props Table Section */}
            <section className="mt-12 mb-8 px-0 w-full">
                <div className="rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 justify-between">
                        <div className='flex items-center gap-4'>
                            <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                            <h4 className="text-xl font-bold text-white">Props</h4>
                        </div>
                        <PropsCollapseBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={propCount} />
                    </div>
                    <PropsTable showAll={showAllProps} propsList={hoverTextProps} />
                </div>
            </section>
            {/* Dependencies Section */}
            <div className="rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl p-6 mb-8">
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
                            <code className="text-blue-400 font-semibold">React</code>
                            <span className="ml-2 text-white/70">Modern React library for UI building</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-purple-900/60 p-2 rounded-full flex items-center justify-center">
                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        </span>
                        <span>
                            <code className="text-purple-400 font-semibold">Tailwindcss</code>
                            <span className="ml-2 text-white/70">Utility-first CSS framework for rapid styling</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-green-900/60 p-2 rounded-full flex items-center justify-center">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        </span>
                        <span>
                            <code className="text-green-400 font-semibold">GSAP</code>
                            <span className="ml-2 text-white/70">Animation library for smooth effects</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const HoverTextEffect = () => {
    const [selectedEffect, setSelectedEffect] = useState('defaultReveal'); // Dropdown for effect selection
    const [effectColor, setEffectColor] = useState('#C27AFF');
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const codeSnippets = {
        jsx: `import HoverText from './ApexUI/HoverText/HoverText';

const App = () => {
  return (
    <HoverText text="Hover Me!" effectColor="#C27AFF" />
  );
}

export default App;
`,
        tsx: `import HoverText from './ApexUI/HoverText/HoverText';

export default function App(): JSX.Element {
  return (
    <HoverText text="Hover Me!" effectColor="#C27AFF" fontSize="2rem" />
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto  ">
            <section className="py-20 pb-20  text-[wheat] w-full">
                <div className="flex flex-col gap-10 items-center w-full">
                    <h2 className="text-3xl font-bold flex items-center gap-3 w-full">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400 text-3xl" />
                        Hover Text Effect
                    </h2>

                    <div className="w-full mb-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#181824]/50 border border-purple-800 text-green-400 px-4 py-3 font-mono rounded-md relative shadow-md scrollbar-hide">
                            <CopyBlock
                                text={`npm install apex-ui@latest && npx apex-ui add hover-text`}
                                language="bash"
                                showLineNumbers={false}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>

                    {/* Component Preview with Effect Dropdown */}
                    <div className="w-full py-20 flex flex-col items-start gap-8 ">
                        <h4 className="text-lg font-semibold flex items-center gap-2 ">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Component Preview
                        </h4>
                        <div className="flex flex-col h-[50vh]  w-full gap-6 items-start">
                            {/* Preview area */}
                            <div className="flex-1 w-full h-[60vh] max-md:h-[20vh] rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl px-3 py-3 flex flex-col gap-6 mx-auto overflow-hidden items-center justify-center">
                                <HoverText text="Hover Me!" effectColor={effectColor} effect={selectedEffect} />
                            </div>
                            {/* Dropdown and color picker */}
                            <div className="flex flex-row gap-4 items-end min-w-[180px]">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold mb-1">Choose Effect</label>
                                    <select
                                        className="bg-[#181824] border border-purple-700/40 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                                        value={selectedEffect}
                                        onChange={e => setSelectedEffect(e.target.value)}
                                    >
                                        <option value="defaultReveal">Default Reveal</option>
                                        <option value="magnetic">Magnetic</option>
                                        <option value="wave">Wave</option>
                                        <option value="rubber">Rubber</option>
                                        <option value="jump">Jump</option>
                                        <option value="rotate">Rotate</option>
                                        <option value="party">Party</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 items-center">
                                    <label className="text-sm font-semibold mb-1">Effect Color</label>
                                    <input
                                        type="color"
                                        value={effectColor}
                                        onChange={e => setEffectColor(e.target.value)}
                                        className="w-10 h-10 border-2 border-purple-700 rounded-md cursor-pointer bg-transparent p-0"
                                        title="Pick effect color"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Usage Example */}
                    <div className="mt-8 w-full">
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
                            />
                        </div>
                    </div>

                    <PropsAndDepsSections />
                </div>
            </section>
        </div>
    );
};

export default HoverTextEffect;
