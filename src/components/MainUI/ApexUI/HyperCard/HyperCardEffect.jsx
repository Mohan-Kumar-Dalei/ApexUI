// ApexUIComponentShowcase.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faCodeBranch,
    faTerminal,
    faTableList,
    faPuzzlePiece,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import HyperCard from './HyperCard';
import { CopyBlock, dracula } from 'react-code-blocks';

// Show more/less logic for props table: show 8, expand for rest
function PropsShowMoreBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 8) return null;
    return (
        <button
            className="ml-3 px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 8} More`}
        </button>
    );
}

function PropsTable({ showAll }) {
    const allProps = [
        { prop: 'text', type: 'string', def: '"Apex UI is Lightning"', desc: 'Main title displayed on the card' },
        { prop: 'LastText', type: 'string', def: '"Speed"', desc: 'Highlighted last word' },
        { prop: 'LastTextColor', type: 'string', def: '"purple"', desc: 'Color for the highlighted last word' },
        { prop: 'SubText', type: 'string', def: '"Experience the power..."', desc: 'Subtitle/description below the title' },
        { prop: 'width', type: 'string', def: '"w-80"', desc: 'Tailwind width class for card' },
        { prop: 'height', type: 'string', def: '"h-72"', desc: 'Tailwind height class for card' },
        { prop: 'starColor', type: 'string', def: '"#ffffff"', desc: 'Color of the animated stars' },
        { prop: 'starCount', type: 'number', def: '250', desc: 'Number of stars in the background' },
        { prop: 'glow', type: 'boolean', def: 'true', desc: 'Show animated glow effect' },
        { prop: 'baseSpeed', type: 'number', def: '0.5', desc: 'Base speed of starfield animation' },
        { prop: 'warpSpeed', type: 'number', def: '8.5', desc: 'Speed on hover (warp effect)' },
        { prop: 'circlePosition', type: 'string', def: '"bottom"', desc: 'Glow circle position (e.g., bottom, center)' },
    ];
    const displayProps = showAll ? allProps : allProps.slice(0, 5);
    return (
        <div className="overflow-x-auto rounded-md border border-purple-600/50 shadow-xl scrollbar-hide">
            <table className="min-w-full text-sm text-white table-auto">
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

const HyperCardEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const codeSnippets = {
        jsx: `import HyperCard from './ApexUI/HyperCard';
const App = () => {
  return (
    <div>
      <HyperCard
        starColor="#9f7aea"
        glow={true}
        beamCount={10}
        starCount={250}
       />
    </div>
  );
}
export default App;
`,
        tsx: `import HyperCard from './ApexUI/HyperCard';

export default function App(): JSX.Element {
  return (
    <div>
      <HyperCard
        starColor="#9f7aea"
        glow={true}
        beamCount={10}
        starCount={250}
       />
    </div>
  );
}`,
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' },
    ];

    return (
        <>
            {/* Main Title and Install Section */}
            <section className=" py-20  text-[wheat]  ">
                <div className="max-w-5xl mx-auto space-y-12">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                        Space Hyper Card
                    </h2>
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-black/20 backdrop-blur-md text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                            <CopyBlock
                                text={"npm install apex-ui@latest && npx apex-ui add hyper-card"}
                                language="bash"
                                theme={dracula}
                                codeBlock
                                showLineNumbers={false}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Preview Section */}
            <section className="py-8 text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                        Component Preview
                    </h4>
                    <div className="bg-[#141416]/50 p-6 rounded-lg border border-purple-700/40 shadow-xl">
                        <div className="relative w-full max-w-sm mx-auto h-auto flex flex-col bg-[#181824] rounded-3xl shadow-xl border border-white/10 overflow-hidden">
                            {/* Hyper Card Preview */}
                            <div className="pt-5 px-4 pb-0 text-white">
                                <HyperCard
                                    width="w-full"
                                    height="h-50"
                                    text="Introducing Hyper Card"
                                    LastText="Effect"
                                    LastTextColor="purple"
                                    SubText="Fully animated lightning effect card with customizable props, built with Apex UI."
                                    starColor="#9f7aea"
                                    glow={true}
                                    beamCount={5}
                                    starCount={250}
                                />
                            </div>
                            {/* Card Content */}
                            <div className="px-6 pt-4 pb-7 w-full text-left flex flex-col items-start">
                                <div className="flex items-center gap-3 mb-2">
                                    <FontAwesomeIcon icon={faCube} className="text-purple-400 text-2xl" />
                                    <h3 className="text-2xl font-extrabold text-white tracking-tight">Apex UI Hyper Card</h3>
                                </div>
                                <p className="text-gray-400 text-base mb-5 max-w-xs leading-relaxed">
                                    Experience futuristic animations with customizable props like glow, beam, star count, and hover interactions.
                                </p>
                                <button
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition font-semibold shadow-lg mt-2 focus:outline-none group"
                                >
                                    Get Started
                                    <span className="inline-block transition-transform duration-300 will-change-transform group-hover:translate-x-2">
                                        <FontAwesomeIcon icon={faChevronDown} className="text-white/80 rotate-[-90deg]" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Block Section (React code, not syntax highlighter) */}
            <section className="py-8 text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <div className='w-full flex items-center justify-between'>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Usage Example
                        </h4>
                        {/* Language Dropdown */}
                        <div className="mb-3 flex justify-end">
                            <div className="relative w-32">
                                <button
                                    className="w-full bg-[#181824] border border-purple-700/40 text-white px-4 py-2 rounded-lg flex items-center justify-between focus:outline-none hover:bg-purple-800/30 transition"
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

                    <div className="bg-[#0e0e10]/20 p-4 rounded-lg text-sm font-mono relative border border-purple-600/50 shadow-lg overflow-x-auto scrollbar-hide">
                        <CopyBlock
                            text={codeSnippets[selectedLang]}
                            language={selectedLang === 'html' ? 'html' : selectedLang}
                            theme={dracula}
                            codeBlock
                            showLineNumbers={false}
                        />
                    </div>
                </div>
            </section>

            {/* Modern Props Table Section (separate) */}
            <PropsAndDepsSections />
        </>
    );
}

function PropsAndDepsSections() {
    const [showAllProps, setShowAllProps] = useState(false);
    const propCount = 15;
    return (
        <>
            {/* Props Table Section - width matches main showcase (max-w-5xl) */}
            <section className="max-w-5xl mx-auto mt-12 mb-8  ">
                <div className=" rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 justify-between">
                        <div className='flex items-center gap-4'>
                            <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                            <h4 className="text-xl font-bold text-[wheat]">Props</h4>
                        </div>
                        <PropsShowMoreBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={propCount} />
                    </div>
                    {/* Table style for props */}
                    <PropsTable showAll={showAllProps} />
                </div>
            </section>
            {/* Dependencies Section - width matches main showcase (max-w-5xl) */}
            <section className="max-w-5xl mx-auto mb-16  ">
                <div className="bg-gradient-to-r rounded-md border border-purple-700/40 shadow-lg p-6 backdrop:blur-md bg-black/20">
                    <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon icon={faPuzzlePiece} className="text-purple-400 text-xl" />
                        <h4 className="text-xl font-bold text-[wheat]">Dependencies</h4>
                    </div>
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
            </section>
        </>
    );
}

export default HyperCardEffect;
