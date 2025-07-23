import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faCodeBranch, faTerminal, faTableList, faPuzzlePiece, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import EdgeGlowForm from './EdgeGlowFrom';
const glassFormProps = [
    { prop: 'GlowColor', type: 'string', def: '"violet"', desc: 'Color of the moving radial background glow (follows mouse).' },
    { prop: 'borderGlowColor', type: 'string', def: '"#a78bfa88"', desc: 'Color of the animated top/bottom input border glow.' },
    { prop: 'borderGlowShadow', type: 'string', def: '"#a78bfa33"', desc: 'Shadow color for the input border glow.' },
];
const EdgeglowFromEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Color pickers state
    const [mouseGlowColor, setMouseGlowColor] = useState('#8b5cf6'); // violet

    // Define the props for EdgeGlowForm component
    const codeSnippets = {
        jsx: `import EdgeGlowForm from './ApexUI/EdgeGlowForm/EdgeGlowForm';
const App = () => {
  return (
     <EdgeGlowForm
        GlowColor="purple"
     />
  );
}
export default App;
`,
        tsx: `import EdgeGlowForm from './ApexUI/EdgeGlowForm/EdgeGlowForm';
export default function App(): JSX.Element {
  return (
       <EdgeGlowForm
        mouseGlowColor="purple"
       />
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' },
    ];

    return (
        <>
            {/* Main Title and Install Section */}
            <section className="py-20 text-[wheat]  ">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-12">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                            Edge Glow Form
                        </h2>
                        <div className="space-y-2">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                                Installation Command
                            </h4>
                            <div className="bg-black/20 backdrop-blur-md text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                                <CopyBlock
                                    text={"npm install apex-ui@latest && npx apex-ui add edge-glow-form"}
                                    language="bash"
                                    theme={dracula}
                                    codeBlock
                                    showLineNumbers={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Preview Section */}
            <section className="px-4 py-8 sm:px-8   text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                        Component Preview
                    </h4>
                    <div className="bg-[#141416]/50 p-6 rounded-md border border-purple-700/40 shadow-xl">
                        <EdgeGlowForm
                            GlowColor={mouseGlowColor}
                        />
                    </div>
                    {/* Color Pickers */}
                    <div className="flex flex-wrap gap-6 mt-8">
                        <div className="flex flex-col items-start gap-2">
                            <label className="text-sm text-purple-300 font-semibold">Glow Color</label>
                            <input
                                type="color"
                                value={mouseGlowColor}
                                onChange={e => setMouseGlowColor(e.target.value)}
                                className="w-10 h-10 rounded border-2 border-purple-400 bg-transparent cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Block Section */}
            <section className="px-4 py-8 sm:px-8   text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <div className=' flex justify-between items-center'>
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Usage Example
                        </h4>
                        <div className="mb-3 flex justify-end">
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
                    </div>
                    <div className="bg-[#0e0e10]/20 p-4 rounded-md text-sm font-mono relative border border-purple-600/50 shadow-lg overflow-x-auto scrollbar-hide">
                        <CopyBlock
                            text={codeSnippets[selectedLang]}
                            language={selectedLang}
                            theme={dracula}
                            codeBlock
                            showLineNumbers={false}
                        />
                    </div>
                </div>
            </section>

            {/* props aur dependesis */}
            <PropsAndDepsSections />
        </>
    );
};
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
    const propCount = glassFormProps.length;
    return (
        <div className="w-full max-w-5xl mx-auto  ">
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
                    <PropsTable showAll={showAllProps} propsList={glassFormProps} />
                </div>
            </section>
            {/* Dependencies Section */}
            <div className="rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl p-6 mb-8 ">
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
                        <span className="bg-green-900/60 p-2 rounded-full flex items-center justify-center">
                            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        </span>
                        <span>
                            <code className="text-green-300 font-semibold">GSAP</code>
                            <span className="ml-2 text-white/70">Animation library for smooth effects</span>
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
                </ul>
            </div>
        </div>
    );
}


export default EdgeglowFromEffect;
