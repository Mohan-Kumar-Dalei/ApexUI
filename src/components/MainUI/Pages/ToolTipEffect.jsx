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
import ToolTip from '../ApexUI-Kit/ToolTip/ToolTip.jsx';
import { CopyBlock, dracula } from 'react-code-blocks';

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
        { prop: 'items', type: 'array', def: '[...]', desc: 'Array of tooltip data objects (name, designation, image)' },
    ];
    const displayProps = showAll ? allProps : allProps;
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

const people = [
    {
        id: 1,
        name: "Aarav Mehta",
        designation: "Frontend Architect",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
        id: 2,
        name: "Riya Kapoor",
        designation: "Visual Designer",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        id: 3,
        name: "Devansh Verma",
        designation: "AI Engineer",
        image: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
        id: 4,
        name: "Saanvi Desai",
        designation: "UX Strategist",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 5,
        name: "Ishaan Khurana",
        designation: "DevOps Specialist",
        image: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    {
        id: 6,
        name: "Meher Shah",
        designation: "Interaction Designer",
        image: "https://randomuser.me/api/portraits/women/66.jpg",
    },
];

const codeSnippets = {
    jsx: `import ToolTip from './ApexUI-Kit/ToolTip/ToolTip.jsx';
const people = [
  { name: 'Aarav Mehta', designation: 'Frontend Architect', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
  // ...more
];
const App = () => (
  <ToolTip items={people} />
);
export default App;`,
    tsx: `import ToolTip from './ApexUI-Kit/ToolTip/ToolTip.jsx';
const people = [
  { name: 'Aarav Mehta', designation: 'Frontend Architect', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
  // ...more
];
export default function App(): JSX.Element {
  return <ToolTip items={people} />;
}`,
};

const languageOptions = [
    { label: 'JSX', value: 'jsx' },
    { label: 'TSX', value: 'tsx' },
];

function PropsAndDepsSections() {
    const [showAllProps, setShowAllProps] = useState(false);
    const propCount = 1;
    return (
        <>
            <section className="max-w-5xl mx-auto mt-12 mb-8">
                <div className=" rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 justify-between">
                        <div className='flex items-center gap-4'>
                            <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                            <h4 className="text-xl font-bold text-[wheat]">Props</h4>
                        </div>
                        <PropsShowMoreBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={propCount} />
                    </div>
                    <PropsTable showAll={showAllProps} />
                </div>
            </section>
            <section className="max-w-5xl mx-auto mb-16">
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

const ToolTipEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <>
            {/* Main Title and Install Section */}
            <section className="py-20 text-[wheat]">
                <div className="max-w-5xl mx-auto space-y-12">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                        ToolTip Effect
                    </h2>
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-black/20 backdrop-blur-md text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                            <CopyBlock
                                text={"npm i apex-ui-kit && npx apex-ui-kit add tooltip"}
                                language="bash"
                                theme={dracula}
                                codeBlock
                                showLineNumbers={false}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Preview Section - Only ToolTip, no extra card styles/content */}
            <section className="px-4 py-8 sm:px-8  text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                        Component Preview
                    </h4>
                    <div className="flex-1 w-full h-[60vh] max-md:h-[40vh] rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl px-3 py-3 flex flex-col gap-6 mx-auto overflow-hidden items-center justify-center">
                        <ToolTip items={people} />
                    </div>
                </div>
            </section>

            {/* Code Block Section (React code, not syntax highlighter) */}
            <section className="px-4 py-8 sm:px-8  text-[wheat]">
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

                {/* Modern Props Table Section (separate) */}
                <PropsAndDepsSections />
            </section>


        </>
    );
}

export default ToolTipEffect;
