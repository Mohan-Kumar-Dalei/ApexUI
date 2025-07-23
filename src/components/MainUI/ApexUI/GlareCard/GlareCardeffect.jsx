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
import GlareCard from './GlareCard';

// --- Update this array with your latest GlareCard props ---
const glareCardProps = [
    { prop: 'children', type: 'ReactNode', def: 'null', desc: 'Content to render inside the glare card' },
    { prop: 'className', type: 'string', def: '""', desc: 'Additional CSS classes for the card' },
    { prop: 'backgroundImage', type: 'string', def: 'bgHexa', desc: 'Background image URL for the card' },
    { prop: 'foilSvg', type: 'string', def: 'default SVG', desc: 'SVG string or URL for foil overlay effect' },
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
    const propCount = glareCardProps.length;
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
                    <PropsTable showAll={showAllProps} propsList={glareCardProps} />
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
                            <code className="text-blue-300 font-semibold">React</code>
                            <span className="ml-2 text-white/70">Modern React library for UI building</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-purple-900/60 p-2 rounded-full flex items-center justify-center">
                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        </span>
                        <span>
                            <code className="text-purple-300 font-semibold">Tailwind CSS</code>
                            <span className="ml-2 text-white/70">Utility-first CSS framework for rapid styling</span>
                        </span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-yellow-900/60 p-2 rounded-full flex items-center justify-center">
                            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        </span>
                        <span>
                            <code className="text-yellow-300 font-semibold">Framer Motion</code>
                            <span className="ml-2 text-white/70">Animation library for React</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const GlareCardEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const codeSnippets = {
        jsx: `import GlareCard from './ApexUI/GlareCard/GlareCard';

const App = () => {
  return (
    <GlareCard
      backgroundImage="your-image-url.jpg"
      foilSvg="your-foil-svg-url-or-string"
      className="custom-class"
    >
      <h1 style={{ color: 'white', textAlign: 'center', marginTop: 120 }}>Glare Card Demo</h1>
    </GlareCard>
  );
}

export default App;
`,
        tsx: `import GlareCard from './ApexUI/GlareCard/GlareCard';

export default function App(): JSX.Element {
  return (
    <GlareCard
      backgroundImage="your-image-url.jpg"
      foilSvg="your-foil-svg-url-or-string"
      className="custom-class"
    >
      <h1 style={{ color: 'white', textAlign: 'center', marginTop: 120 }}>Glare Card Demo</h1>
    </GlareCard>
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto  ">
            <section className="py-20 pb-20 text-[wheat] w-full">
                <div className="flex flex-col gap-10 items-center w-full">
                    <h2 className="text-3xl font-bold flex items-center gap-3 w-full">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400 text-3xl" />
                        Glare Card Effect
                    </h2>

                    <div className="w-full mb-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#181824]/50 border border-purple-800 text-green-400 px-4 py-3 font-mono rounded-md relative shadow-md scrollbar-hide">
                            <CopyBlock
                                text={`npm install apex-ui@latest && npx apex-ui add glare-card`}
                                language="bash"
                                showLineNumbers={false}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>

                    <div className="w-full py-20 flex flex-col items-start">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Component Preview
                        </h4>
                        <div className="w-full h-[60vh] rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl px-8 py-3 flex flex-col items-center mx-auto">
                            <div className="w-full h-full relative flex items-center justify-center rounded-lg shadow-lg overflow-hidden">
                                <GlareCard />
                            </div>
                        </div>
                    </div>

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
                                showLineNumbers={false}
                            />
                        </div>
                    </div>

                    <PropsAndDepsSections />
                </div>
            </section>
        </div>
    );
};

export default GlareCardEffect;