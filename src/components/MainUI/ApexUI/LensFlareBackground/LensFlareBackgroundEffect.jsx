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
import LensFlareBackground from './LensFlareBackground';
import { CopyBlock, dracula } from 'react-code-blocks';

function PropsShowMoreBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 5) return null;
    return (
        <button
            className="ml-3 px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 5} More`}
        </button>
    );
}

// Export allProps so it can be used for propCount
const allProps = [
    { prop: 'flareColor', type: 'string', def: '"#fbbf24"', desc: 'Main color of the lens flare' },
    { prop: 'intensity', type: 'number', def: '1.0', desc: 'Flare intensity (opacity)' },
    { prop: 'animationSpeed', type: 'number', def: '1.0', desc: 'Speed of flare animation' },
];

function PropsTable() {
    const displayProps = allProps;
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

const LensFlareBackgroundEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Live test state for props
    const [flareColor, setFlareColor] = useState('#af23fb');
    const [intensity, setIntensity] = useState(1.0);
    const [animationSpeed, setAnimationSpeed] = useState(1.0);
    const codeSnippets = {
        jsx: `import LensFlareBackground from './ApexUI/LensFlareBackground/LensFlareBackground';
const App = () => (
  <LensFlareBackground
    flareColor="#fbbf24"
    intensity={1.0}
    animationSpeed={1.0}
  />
);
export default App;`,
        tsx: `import LensFlareBackground from './ApexUI/LensFlareBackground/LensFlareBackground';
export default function App(): JSX.Element {
  return (
    <LensFlareBackground
      flareColor="#fbbf24"
      intensity={1.0}
      animationSpeed={1.0}
    />
  );
}`,
    };
    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' },
    ];
    const [showAllProps, setShowAllProps] = useState(false);
    const [showDemo, setShowDemo] = useState(true);
    return (
        <>
            {/* Main Title and Install Section */}
            <section className="py-20 text-[wheat]  ">
                <div className="max-w-5xl mx-auto space-y-12">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                        Lens Flare Background
                    </h2>
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-black/20 backdrop-blur-md text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                            <CopyBlock
                                text={"npm install apex-ui@latest && npx apex-ui add lens-flare-background"}
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
            <div className="w-full py-20 max-w-5xl flex flex-col items-start mx-auto space-y-8  ">
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-4 text-[wheat]">
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
                                                <span className="font-bold text-xl text-white">Apex Nav</span>
                                                <div className="flex gap-4">
                                                    <button className="text-purple-300 hover:text-white font-medium transition">Home</button>
                                                    <button className="text-purple-300 hover:text-white font-medium transition">Docs</button>
                                                    <button className="text-purple-300 hover:text-white font-medium transition">About</button>
                                                </div>
                                            </nav>
                                            {/* Title & Subtitle */}
                                            <h2 className="text-5xl font-extrabold mb-1 text-white drop-shadow-lg">Lens Ray Demo</h2>
                                            <p className="text-white/80 text-center text-lg mb-4">Beautiful animated lens flare background for your <span className="text-purple-400 font-bold">UI</span></p>
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
                        {/* LensFlareBackground with live props */}
                        <LensFlareBackground
                            flareColor={flareColor}
                            intensity={intensity}
                            animationSpeed={animationSpeed}
                        />
                    </div>
                </div>
                {/* Live Test Controls - Responsive, now below preview */}
                <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-center gap-6 bg-black/30 rounded-lg z-20 relative border border-purple-800 mt-4">
                    {/* Color Picker */}
                    <div className="flex flex-col items-center w-full md:w-1/3">
                        <label className="text-sm text-purple-200 mb-2 font-medium">Flare Color</label>
                        <input
                            type="color"
                            value={flareColor}
                            onChange={e => setFlareColor(e.target.value)}
                            className="w-12 h-12 rounded-full shadow-lg bg-transparent cursor-pointer"
                            aria-label="Flare Color"
                        />
                        <span className="text-xs text-purple-300 mt-1">{flareColor}</span>
                    </div>
                    {/* Intensity Slider */}
                    <div className="flex flex-col items-center w-full md:w-1/3">
                        <label className="text-sm text-purple-200 mb-2 font-medium">Intensity</label>
                        <input
                            type="range"
                            min={0.1}
                            max={2}
                            step={0.01}
                            value={intensity}
                            onChange={e => setIntensity(Number(e.target.value))}
                            className="w-full md:w-32 accent-purple-400"
                            aria-label="Intensity"
                        />
                        <span className="text-xs text-purple-300 mt-1">{intensity}</span>
                    </div>
                    {/* Animation Speed Slider */}
                    <div className="flex flex-col items-center w-full md:w-1/3">
                        <label className="text-sm text-purple-200 mb-2 font-medium">Animation Speed</label>
                        <input
                            type="range"
                            min={0.1}
                            max={3}
                            step={0.01}
                            value={animationSpeed}
                            onChange={e => setAnimationSpeed(Number(e.target.value))}
                            className="w-full md:w-32 accent-purple-400"
                            aria-label="Animation Speed"
                        />
                        <span className="text-xs text-purple-300 mt-1">{animationSpeed}</span>
                    </div>
                </div>
            </div>

            {/* Code Block Section */}
            <section className="px-4 py-8 sm:px-8   text-[wheat]">
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
            </section>

            {/* Modern Props Table Section */}
            <section className="max-w-5xl mx-auto mt-12 mb-8  ">
                <div className=" rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 justify-between">
                        <div className='flex items-center gap-4'>
                            <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                            <h4 className="text-xl font-bold text-[wheat]">Props</h4>
                        </div>
                        <PropsShowMoreBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={allProps.length} />
                    </div>
                    {/* Table style for props */}
                    <PropsTable />
                </div>
            </section>
            {/* Dependencies Section */}
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
                            <span className="bg-gray-700/60 p-2 rounded-full flex items-center justify-center">
                                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            </span>
                            <span>
                                <code className="text-gray-300 font-semibold">ThreeJS</code>
                                <span className="ml-2 text-white/70">3D library for rendering and animations</span>
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

export default LensFlareBackgroundEffect;
