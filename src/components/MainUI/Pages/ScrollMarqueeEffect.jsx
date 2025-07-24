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
import ScrollMarquee from '../ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';
import { useRef } from 'react';
const scrollMarqueeProps = [
    { prop: 'items', type: 'array', def: `["Apex UI", "Apex UI"]`, desc: 'Array of strings to display as marquee lines.' },
    { prop: 'speed', type: 'number', def: '50', desc: 'Base speed of the marquee scroll.' },
    { prop: 'direction', type: 'string', def: 'undefined', desc: `Global direction for all lines ('left' or 'right'). If not set, alternates per line.` },
    { prop: 'repeat', type: 'number', def: '10', desc: 'Number of repeated text copies per line (for seamless effect).' },
    { prop: 'textStroke', type: 'boolean', def: 'false', desc: 'If true, enables text stroke (outline) on hover.' },
    { prop: 'textStrokeColor', type: 'string', def: "'#C27AFF'", desc: 'Color of the text stroke (outline) on hover.' },
    { prop: 'textFillColor', type: 'string', def: "'#1E2637'", desc: 'Fill color for the text on hover.' },
    { prop: 'textColor', type: 'string', def: "'#fff'", desc: 'Default text color (white).' },
    { prop: 'scrollRef', type: 'ref object', def: 'undefined', desc: 'Ref to a custom scroll container. If not set, uses window scroll.' },
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
    const propCount = scrollMarqueeProps.length;
    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Props Table Section */}
            <section className="mt-12 mb-8 w-full">
                <div className="rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 justify-between">
                        <div className='flex items-center gap-4'>
                            <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                            <h4 className="text-xl font-bold text-white">Props</h4>
                        </div>
                        <PropsCollapseBtn showAll={showAllProps} setShowAll={setShowAllProps} propCount={propCount} />
                    </div>
                    <PropsTable showAll={showAllProps} propsList={scrollMarqueeProps} />
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
                            <code className="text-purple-300 font-semibold">Tailwindcss</code>
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

const ScrollMarqueeEffect = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const scrollContainerRef = useRef();
    const codeSnippets = {
        jsx: `import ScrollMarquee from './ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';
import { useRef } from 'react';
const App = () => {
  return (
    <div ref={scrollContainerRef}>
       <ScrollMarquee
        scrollRef={scrollContainerRef}
        />
    </div>
  );
}
export default App;
`,
        tsx: `import ScrollMarquee from './ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';
import { useRef } from 'react';
export default function App(): JSX.Element {
  return (
    <div ref={scrollContainerRef}>
       <ScrollMarquee
        scrollRef={scrollContainerRef}
        />
    </div>
  );
}`
    };

    const languageOptions = [
        { label: 'JSX', value: 'jsx' },
        { label: 'TSX', value: 'tsx' }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <section className="py-20 pb-20  text-[wheat] w-full">
                <div className="flex flex-col gap-10 items-center w-full">
                    <h2 className="text-3xl font-bold flex items-center gap-3 w-full">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400 text-3xl" />
                        Scroll Marquee Effect
                    </h2>

                    <div className="w-full mb-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#181824]/50 border border-purple-800 text-green-400 px-4 py-3 font-mono rounded-md relative shadow-md scrollbar-hide">
                            <CopyBlock
                                text={`npm i apex-ui-kit && npx apex-ui-kit add scroll-marquee`}
                                language="bash"
                                showLineNumbers={false}
                                theme={dracula}
                                codeBlock
                            />
                        </div>
                    </div>

                    {/* Component Preview with one box, two scrollable sections inside */}
                    <div className="w-full py-20 flex flex-col items-start gap-8 ">
                        <h4 className="text-lg font-semibold flex items-center gap-2 ">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                            Component Preview
                        </h4>
                        <div className="w-full h-[80vh] max-md:h-[50vh] rounded-md border border-purple-800 bg-black/20 backdrop-blur-md shadow-2xl px-3 py-3 flex flex-col gap-6 mx-auto overflow-hidden">
                            <div ref={scrollContainerRef} className='w-full overflow-y-scroll scrollbar-hide'>
                                {/* Scrollable section 2 */}
                                <div className="w-full h-[200vh] max-md:h-[100vh]  flex flex-col items-center justify-around ">
                                    <p className='text-7xl font-semibold text-white/30 max-md:text-4xl'
                                        style={{ fontFamily: 'helvetica, sans-serif' }}
                                    >Scroll DOWN</p>
                                    <div className=" w-full">

                                        <ScrollMarquee
                                            scrollRef={scrollContainerRef}
                                        />
                                    </div>
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
                                    type='button'
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

export default ScrollMarqueeEffect;