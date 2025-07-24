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
import { CopyBlock, dracula } from 'react-code-blocks';
import GlassNavbar from '../ApexUI-Kit/GlassNavbar/GlassNavBar.jsx';


// Props data array for easy filtering/mapping
const propsList = [
    {
        prop: 'indicatorColor',
        type: 'string',
        default: '"#7c3aed"',
        description: 'Color of the moving indicator (shows active nav item, animated)'
    },
    {
        prop: 'backgroundColor',
        type: 'string',
        default: '"#1f1f1f"',
        description: 'Background of navbar'
    },
    {
        prop: 'activeColor',
        type: 'string',
        default: '"#ffffff"',
        description: 'Active nav item color'
    },
    {
        prop: 'indicatorAnimation',
        type: 'string',
        default: '"elastic"',
        description: 'Animation style for indicator ("elastic", "spring", "power")'
    },
    {
        prop: 'shrinkOnScroll',
        type: 'boolean',
        default: 'false',
        description: 'Navbar shrinks on scroll if true'
    },
    {
        prop: 'position',
        type: 'string',
        default: '"fixed"',
        description: 'CSS position for navbar ("fixed", "sticky", etc.)'
    },
];

const GlassNavBar = () => {
    const [selectedLang, setSelectedLang] = useState('jsx');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Show more/less logic for props table: show 5, expand for rest
    const [showAllProps, setShowAllProps] = useState(false);

    const codeSnippets = {
        jsx: `import GlassNavbar from './ApexUI-Kit/GlassNavbar/GlassNavbar.jsx';
const App = () => {
  return (
    <div>
        <GlassNavbar
         position='absolute'
         indicatorAnimation="elastic"
         indicatorColor="#ED67BE"
     />
    </div>
  );
}
export default app; 
        `,
        tsx: `import GlassNavbar from './ApexUI-Kit/GlassNavbar/GlassNavbar.jsx';

export default function App(): JSX.Element {
  return (
    <div>
      <GlassNavbar
         position='absolute'
         indicatorAnimation="elastic"
         indicatorColor="#ED67BE"
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
            {/*
                PROPS for <GlassNavbar />:
                - indicatorColor: string (default: "#7c3aed")
                - backgroundColor: string (default: "#1f1f1f")
                - activeColor: string (default: "#ffffff")
                - shrinkOnScroll: boolean (default: false)
                - position: string (default: "fixed")
            */}
            <div className="sticky w-full left-0 top-0 z-10">
                <GlassNavbar
                    position='absolute'
                    indicatorAnimation="elastic"
                    indicatorColor="#ED67BE"
                />
            </div>

            {/* Modern Showcase Section */}
            <section className=" pt-40 pb-20 text-[wheat]">
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Title & Install */}
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <FontAwesomeIcon icon={faCube} className="text-purple-400" />
                        ApexUI Glass Navbar
                    </h2>
                    <div className="space-y-2 ">
                        <h4 className="text-lg font-semibold flex items-center gap-2 ">
                            <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                            Installation Command
                        </h4>
                        <div className="bg-[#1a1a1d]/20 text-green-400 px-4 py-3 font-mono rounded-md border border-purple-600/50 relative scrollbar-hide">
                            <CopyBlock
                                text={`npm i apex-ui-kit && npx apex-ui-kit add glass-navbar`}
                                language="bash"
                                theme={dracula}
                                codeBlock
                                showLineNumbers={false}

                            />
                        </div>
                    </div>

                    {/* Component Preview Section */}
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" />
                        Component Preview
                    </h4>
                    <div className="bg-white/5 rounded-xl border border-purple-600/50 p-6 h-52 ">
                        <p className="text-xl text-gray-400/40 text-center mt-9">Navbar will appear at the top of your page</p>
                    </div>

                    {/* Code Block Section with Language Dropdown */}
                    <div className="mt-8 scrollbar-hide">
                        <div className="mb-3 flex justify-between ">
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
                        <div className="bg-[#0e0e10]/20 p-4 rounded-md text-sm font-mono relative border border-purple-600/50 shadow-lg overflow-x-auto ">
                            <CopyBlock
                                text={codeSnippets[selectedLang]}
                                language={selectedLang}
                                theme={dracula}
                                codeBlock
                                showLineNumbers={false}
                            />
                        </div>
                    </div>

                    {/* Modern Props Table Section (separate) */}
                    <section className="max-w-5xl mx-auto mt-12 mb-8 scrollbar-hide">
                        <div className="rounded-md border-2 border-dashed border-purple-600/50 shadow-xl p-6 bg-black/20 backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-4 justify-between">
                                <div className='flex items-center gap-4'>
                                    <FontAwesomeIcon icon={faTableList} className="text-purple-400 text-xl" />
                                    <h4 className="text-xl font-bold text-[wheat]">Props</h4>
                                </div>
                                {propsList.length > 5 && (
                                    <button
                                        className="px-3 py-1 rounded-md border border-purple-600/40 bg-purple-900/20 text-purple-200 text-xs hover:bg-purple-800/40 transition"
                                        onClick={() => setShowAllProps((v) => !v)}
                                    >
                                        {showAllProps ? 'Show Less' : `Show ${propsList.length - 3} More`}
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto scrollbar-hide rounded-md border border-purple-600/50 shadow-xl">
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
                                        {(showAllProps ? propsList : propsList.slice(0, 3)).map((props) => (
                                            <tr key={props.prop} className="hover:bg-purple-800/10 transition">
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-purple-300">{props.prop}</td>
                                                <td className="px-4 py-3 text-indigo-300">{props.type}</td>
                                                <td className="px-4 py-3 text-emerald-400">{props.default}</td>
                                                <td className="px-4 py-3 text-white/80">{props.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Dependencies Section */}
                    <section className="max-w-5xl mx-auto mb-16">
                        <div className="bg-black/20 backdrop-blur-md rounded-md border border-purple-700/40 shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <FontAwesomeIcon icon={faPuzzlePiece} className="text-purple-400 text-xl" />
                                <h4 className="text-xl font-bold">Dependencies</h4>
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
                </div>
            </section>
        </>
    );
};

export default GlassNavBar;
