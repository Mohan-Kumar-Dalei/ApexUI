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
import PointerFollower from '../ApexUI-Kit/PointerFollower/PointerFollower.jsx';
import { CopyBlock, dracula } from 'react-code-blocks';

function PropsShowMoreBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 4) return null;
    return (
        <button
            className="ml-3 px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 4} More`}
        </button>
    );
}

function PropsTable({ showAll }) {
    const allProps = [
        { prop: 'cursorColor', type: 'string', def: '"#fff"', desc: 'Custom cursor color (SVG fill)' },
        { prop: 'interval', type: 'number', def: '3000', desc: 'Image change interval (ms)' },
        { prop: 'badgeColor', type: 'string', def: '"#fff"', desc: 'Background color for name/job badge' },
        { prop: 'badgeTextColor', type: 'string', def: '"#212121"', desc: 'Text color for name/job badge' },
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

const codeSnippets = {
    jsx: `import PointerFollower from './ApexUI-Kit/PointerFollower/PointerFollower.jsx';
const App = () => (
  <PointerFollower />
);
export default App;`,
    tsx: `import PointerFollower from './ApexUI-Kit/PointerFollower/PointerFollower.jsx';
export default function App(): JSX.Element {
  return <PointerFollower />;
}`,
};

const languageOptions = [
    { label: 'JSX', value: 'jsx' },
    { label: 'TSX', value: 'tsx' },
];

const PointerFollowerEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAllProps, setShowAllProps] = useState(false);
    return (
        <>
            {/* Main Title and Install Section */}
            <section className="py-20 text-[wheat]  ">
                <div className="max-w-5xl mx-auto space-y-12">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                        Pointer Follower
                    </h2>
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-black/20 backdrop-blur-md text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                            <CopyBlock
                                text={"npm i apex-ui-kit && npx apex-ui-kit add pointer-follower"}
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
            <section className="py-8  text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                        Component Preview
                    </h4>
                    <div className="flex-1 w-full h-[60vh] max-md:h-[40vh] rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl flex flex-col gap-6 mx-auto overflow-hidden items-center justify-center">
                        <PointerFollower
                            cursorColor="#a855f7"
                            badgeColor='#a855f7'
                            badgeTextColor="#fff"
                        />
                    </div>
                </div>
            </section>

            {/* Code Block Section */}
            <section className="py-8 text-[wheat]">
                <div className="max-w-5xl mx-auto">
                    <div className='w-full flex items-center justify-between'>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Usage Example
                        </h4>
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
                            language={selectedLang}
                            theme={dracula}
                            codeBlock
                            showLineNumbers={false}
                        />
                    </div>
                </div>

                {/* Props Table Section */}
                <section className="max-w-5xl mx-auto mt-12 mb-8">
                    <div className=" rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4 justify-between">
                            <div className='flex items-center gap-4'>
                                <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                                <h4 className="text-xl font-bold text-[wheat]">Props</h4>
                            </div>
                            <PropsShowMoreBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={3} />
                        </div>
                        <PropsTable showAll={showAllProps} />
                    </div>
                </section>

                {/* Dependencies Section */}
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
                                    <code className="text-blue-300 font-semibold">react</code>
                                    <span className="ml-2 text-white/70">Modern React library for UI building</span>
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-purple-900/60 p-2 rounded-full flex items-center justify-center">
                                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                </span>
                                <span>
                                    <code className="text-purple-300 font-semibold">tailwindcss</code>
                                    <span className="ml-2 text-white/70">Utility-first CSS framework for rapid styling</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>
            </section>


        </>
    );
}

export default PointerFollowerEffect;
