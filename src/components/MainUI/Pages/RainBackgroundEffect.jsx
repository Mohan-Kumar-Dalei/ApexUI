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
import { CopyBlock, dracula } from 'react-code-blocks';
import RainBackground from '../ApexUI-Kit/RainBackground/RainBackground';

const rainBgProps = [
    { prop: 'dropCount', type: 'number', def: '100', desc: 'Number of rain drops' },
    { prop: 'dropColor', type: 'string', def: '"#7c3aed"', desc: 'Color of the rain drops' },
    { prop: 'speed', type: 'number', def: '1.5', desc: 'Speed of the rain animation' },
    { prop: 'blur', type: 'boolean', def: 'true', desc: 'Enable blur effect on drops' },
    { prop: 'background', type: 'string', def: '"#181824"', desc: 'Background color behind the rain' },
    { prop: 'children', type: 'ReactNode', def: 'null', desc: 'Content to render over the rain' },
    { prop: 'dropGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for rain drops (e.g. "linear-gradient(to bottom, #00f2fe, #4facfe)")' },
    { prop: 'collisionGradient', type: 'string', def: 'undefined', desc: 'CSS gradient for collision/explosion (e.g. "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)")' },
];

const RainBackgroundEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAllProps, setShowAllProps] = useState(false);
    const [showDemo, setShowDemo] = useState(true);

    const codeSnippets = {
        jsx: `import RainBackground from './ApexUI-Kit/RainBackground/RainBackground.jsx';

const App = () => {
  return (
     <RainBackground
       dropGradient="linear-gradient(to bottom, #00f2fe, #4facfe)"
        collisionGradient="linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
      />
  );
};
export default App;
`,
        tsx: `import RainBackground from './ApexUI-Kit/RainBackground/RainBackground.jsx';

export default function App(): JSX.Element {
  return (
    <RainBackground
       dropGradient="linear-gradient(to bottom, #00f2fe, #4facfe)"
        collisionGradient="linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
      />
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' }
    ];

    return (
        <>
            {/* 📍 Rain Background Showcase - HyperCard Style */}
            <section className=" py-20 pb-20  text-[wheat]">
                <div className="max-w-6xl mx-auto flex flex-col gap-10 items-center">
                    {/* Title */}
                    <h2 className="text-3xl font-bold flex items-center gap-3 w-full max-w-5xl">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400 text-3xl" />
                        Rain Background Effect
                    </h2>

                    {/* Install Instructions */}
                    <div className="w-full max-w-5xl mb-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#181824]/50 border border-purple-800 text-green-400 px-4 py-3 font-mono rounded-md relative shadow-md scrollbar-hide">
                            <CopyBlock
                                text={`npm i apex-ui-kit && npx apex-ui-kit add rain-background`}
                                language="bash"
                                showLineNumbers={false}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>

                    {/* Component Preview Heading OUTSIDE the box */}
                    <div className="w-full py-20 max-w-5xl flex flex-col items-start">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Component Preview
                        </h4>
                        <div className="w-full max-w-5xl rounded-md border border-purple-800 bg-gray-900/70 backdrop-blur-md shadow-2xl flex flex-col items-center mx-auto">
                            {/* Rain effect styled as preview box, label overlays rain */}
                            <div className="w-full h-[70vh] max-md:h-92 relative flex items-center justify-center rounded-lg border border-purple-700/40 bg-black/20 shadow-lg overflow-hidden">
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    {/* Demo UI for large screens, Recent text for mobile */}
                                    <div className="w-full flex flex-col items-center">
                                        <div className="hidden md:flex flex-col items-center w-full">
                                            {/* Demo UI only if showDemo is true */}
                                            {showDemo && (
                                                <>
                                                    {/* Demo Navbar */}
                                                    <nav className="w-full max-w-xl flex items-center justify-between px-6 py-3 rounded-full bg-[#232345]/80 shadow-lg mb-4 -translate-y-16">
                                                        <span className="font-bold text-xl text-white">DemoNav</span>
                                                        <div className="flex gap-4">
                                                            <button className="text-purple-300 hover:text-white font-medium transition">Home</button>
                                                            <button className="text-purple-300 hover:text-white font-medium transition">Docs</button>
                                                            <button className="text-purple-300 hover:text-white font-medium transition">About</button>
                                                        </div>
                                                    </nav>

                                                    {/* Title & Subtitle */}
                                                    <h2 className="text-5xl font-extrabold mb-1 text-white drop-shadow-lg">Rain Effect Demo</h2>
                                                    <p className="text-white/80 text-center text-lg mb-4">Beautiful animated rain background for your <span className="text-purple-400 font-bold">UI</span></p>
                                                    {/* Two Demo Buttons */}
                                                    <div className="flex gap-4 mb-4">
                                                        <button className="px-5 py-2 rounded-xl bg-[#232345] text-purple-300 font-semibold shadow hover:bg-purple-700 hover:text-white transition">Try Now</button>
                                                        <button className="px-5 py-2 rounded-xl bg-purple-400 text-white font-semibold shadow hover:bg-purple-600 transition">Learn More</button>
                                                    </div>
                                                </>
                                            )}
                                            {/* Fixed square demo toggle bottom right */}
                                            <div className="fixed bottom-6 right-6 z-50">
                                                {/* Toggle button styled like a switch, with square inside */}
                                                <div className="flex flex-col items-center">
                                                    <span className="text-white text-xs mb-1">Demo</span>
                                                    <button
                                                        aria-label="Toggle Demo"
                                                        onClick={() => setShowDemo(v => !v)}
                                                        className={`w-14 h-8 flex items-center rounded-md border-2 border-purple-500 bg-[#232345] relative transition-all duration-300 focus:outline-none ${showDemo ? 'bg-purple-600 border-purple-600' : 'bg-[#232345] border-purple-500'}`}
                                                    >
                                                        <span
                                                            className={`absolute left-1  w-6 h-6 ${showDemo ? 'translate-x-6' : ''} transition-transform duration-300 bg-white border border-purple-400 shadow rounded-sm`}
                                                            style={{ display: 'inline-block' }}
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Mobile: Only show Recent text */}
                                        <div className="md:hidden flex flex-col items-center justify-center w-full h-full">
                                            <h2 className="text-2xl font-extrabold mb-1 text-white drop-shadow-lg">Rain Effect Demo</h2>
                                            <p className="text-white/80 text-center text-lg mb-4">Beautiful animated rain background for your <span className="text-purple-400 font-bold">UI</span></p>
                                        </div>
                                    </div>
                                </div>
                                <RainBackground
                                    dropGradient="linear-gradient(to bottom, #00f2fe, #4facfe)"
                                    collisionGradient="linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
                                />
                            </div>
                        </div>

                        {/* Usage Example (with icon heading) */}
                        <div className="mt-28 w-5xl max-md:w-full  ">
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
                    </div>



                    {/* Props Section (with show more/less) */}
                    <section className="max-w-5xl mx-auto mt-12 mb-8 w-full max-sm:w-full max-sm:px-0">
                        <div className="rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                                    <h4 className="text-xl font-bold text-white">Props</h4>
                                </div>
                                {rainBgProps.length > 5 && (
                                    <button
                                        className="px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
                                        onClick={() => setShowAllProps((v) => !v)}
                                    >
                                        {showAllProps ? 'Show Less' : `Show ${rainBgProps.length - 5} More`}
                                    </button>
                                )}
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
                                        {(showAllProps ? rainBgProps : rainBgProps.slice(0, 5)).map((row) => (
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
                        </div>
                    </section>

                    {/* Dependencies Section */}
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
                                    <span className="ml-2 text-white/70">A powerful animation library</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RainBackgroundEffect;
