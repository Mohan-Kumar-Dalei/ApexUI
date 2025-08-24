import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Lucide Icons
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy
} from 'lucide-react';
import NavMenu from '../ApexUI-Kit/NavMenu/NavMenu.jsx';
import { CopyBlock, irBlack } from 'react-code-blocks';
const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };
    return (
        <div className="absolute top-2 right-2 z-20 flex flex-col items-center">
            <button
                onClick={handleCopy}
                className="p-2 rounded-md bg-black text-[var(--color-pages-side-active-text)] transition-all duration-200"
                aria-label={copied ? 'Copied!' : 'Copy code'}
            >
                <Copy className="w-4 h-4" />
            </button>
            {copied && (
                <span
                    className="pointer-events-none select-none absolute -top-8 right-1/2 translate-x-1/2 px-3 py-1 rounded-md bg-white text-xs font-semibold text-black border border-gray-200"
                    style={{
                        minWidth: '60px',
                        textAlign: 'center',
                        zIndex: 30,
                    }}
                >
                    Copied!
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" style={{ marginTop: '-2px' }}></span>
                </span>
            )}
        </div>
    );
};


function PropsShowMoreBtn({ showAll, setShowAll, propCount }) {
    if (propCount <= 5) return null;
    return (
        <button
            // Change: Hard-coded colors -> CSS Variables
            className="text-sm font-medium text-[var(--color-pages-side-active-text)] hover:text-[var(--color-pages-side-active-hover)]"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 5} More`}
        </button>
    );
}

function PropsTable({ showAll, setShowAll }) {
    const allProps = [
        { prop: 'indicatorColor', type: 'string', def: '"#7c3aed"', description: 'Color of the moving indicator' },
        { prop: 'backgroundColor', type: 'string', def: '"#1f1f1f"', description: 'Background of navbar' },
        { prop: 'activeColor', type: 'string', def: '"#ffffff"', description: 'Active nav item color' },
        { prop: 'indicatorAnimation', type: 'string', def: '"elastic"', description: 'Animation style for indicator' },
        { prop: 'shrinkOnScroll', type: 'boolean', def: 'false', description: 'Navbar shrinks on scroll if true' },
        { prop: 'position', type: 'string', def: '"fixed"', description: 'CSS position for navbar' },
    ];
    const displayProps = showAll ? allProps : allProps.slice(0, 5);

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
                <PropsShowMoreBtn showAll={showAll} setShowAll={setShowAll} propCount={allProps.length} />
            </div>
            <table className="min-w-full text-sm">

                <thead className="text-xs text-[var(--color-pages-props-text)] uppercase">
                    <tr>
                        <th className="pb-3 text-left font-semibold">Prop</th>
                        <th className="pb-3 text-left font-semibold">Type</th>
                        <th className="pb-3 text-left font-semibold">Default</th>
                        <th className="pb-3 text-left font-semibold">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-pages-divider)]">
                    {displayProps.map((row) => (
                        <tr key={row.prop}>

                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text)]">{row.prop}</td>
                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text2)]">{row.type}</td>
                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text3)]">{row.def}</td>
                            <td className="py-4 text-[var(--color-pages-props-text)]">{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DependenciesList() {
    const dependencies = [
        { name: 'React', desc: 'Modern React library for UI building' },
        { name: 'GSAP', desc: 'Animation library for smooth effects' },
        { name: 'TailwindCSS', desc: 'Utility-first CSS framework for rapid styling' },
    ];
    return (
        <ul className="space-y-4">
            {dependencies.map(dep => (

                <li key={dep.name} className="flex items-center gap-4 p-4 bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg">
                    <Package className="text-[var(--color-pages-side-active-text)] w-6 h-6 flex-shrink-0" />
                    <div>
                        <code className="font-semibold text-[var(--color-pages-props-text2)]">{dep.name}</code>
                        <p className="text-sm text-[var(--color-pages-props-text3)]">{dep.desc}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}



const NavMenuEffect = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx';
    const [showAllProps, setShowAllProps] = useState(false);
    // Live prop states
    const [indicatorColor, setIndicatorColor] = useState('#9AE203');
    const [backgroundColor, setBackgroundColor] = useState('#0F172B');
    const [activeColor, setActiveColor] = useState('#ffffff');
    const [indicatorAnimation, setIndicatorAnimation] = useState('elastic');
    const contentRef = useRef(null);

    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];

    const codeSnippets = 
     `import NavMenu from './ApexUI-Kit/NavMenu/NavMenu.jsx';

const App = () => {
  return (
    <div>
      <NavMenu
        indicatorAnimation="elastic"
        indicatorColor="#ED67BE"
      />
    </div>
  );
}
export default App;`
    let copyText = `npm i apex-ui-kit && npx apex-ui-kit add nav-menu`;

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    return (

        <div className="text-[var(--color-pages-props-text2)] min-h-screen">
            <div className="max-w-5xl mx-auto py-16 sm:py-24">

                <header className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent">
                        Nav Menu
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        Effortlessly highlight your navigation with animated indicators. Perfect for dashboards, landing pages, and more.
                    </p>
                </header>

                <div className="w-full bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg shadow-2xl overflow-hidden">
                    <div className="border-b border-[var(--color-pages-divider)]">
                        <nav className="flex space-x-1 sm:space-x-2 px-2 sm:px-4" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative group font-medium text-sm py-4 px-2 sm:px-3 focus:outline-none transition-colors w-full md:w-auto ${activeTab === tab.id
                                            ? 'text-[var(--color-pages-side-active-text)]'
                                            : 'text-[var(--color-pages-props-text)] hover:text-[var(--color-pages-side-hover)]'
                                            }`}
                                    >
                                        <IconComponent className="inline-block w-4 h-4 mr-2" />
                                        <span>{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-pages-side-active-text)] rounded-full"></span>
                                        )}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <div ref={contentRef} className="p-4 sm:p-6">
                        {activeTab === 'preview' && (
                            <div>
                                <div className="w-full h-[50vh] bg-black/30 rounded-md p-4 flex items-start">
                                    <NavMenu
                                        indicatorColor={indicatorColor}
                                        backgroundColor={backgroundColor}
                                        activeColor={activeColor}
                                        indicatorAnimation={indicatorAnimation}
                                    />
                                </div>
                                {/* --- Live Controls --- */}
                                <div className="mt-6 p-4 bg-[var(--color-pages-border)]/50 border border-[var(--color-pages-border)] rounded-lg">
                                    <div className="flex items-center gap-2 mb-4">
                                        <List className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                                        <span className="text-md font-semibold text-[var(--color-pages-side-active-text6)]">Controls</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 items-center justify-center">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-[var(--color-pages-props-text)]">Indicator</label>
                                            <input type="color" value={indicatorColor} onChange={e => setIndicatorColor(e.target.value)} className="w-8 h-8 bg-transparent rounded border-none cursor-pointer" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-[var(--color-pages-props-text)]">Background</label>
                                            <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="w-8 h-8 bg-transparent rounded border-none cursor-pointer" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-[var(--color-pages-props-text)]">Active Color</label>
                                            <input type="color" value={activeColor} onChange={e => setActiveColor(e.target.value)} className="w-8 h-8 bg-transparent rounded border-none cursor-pointer" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-[var(--color-pages-props-text)]">Animation</label>
                                            <select value={indicatorAnimation} onChange={e => setIndicatorAnimation(e.target.value)} className="bg-[var(--color-pages-border)] border border-[var(--color-pages-border)] rounded px-2 py-1 text-[var(--color-pages-side-text2)]">
                                                <option value="elastic">Elastic</option>
                                                <option value="spring">Spring</option>
                                                <option value="power">Power</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'usage' && (
                            <div>
                                <div className="mt-2 relative">
                                    <CopyBlock
                                        text={codeSnippets}
                                        language={selectedLang}
                                        theme={irBlack}
                                        codeBlock
                                        showLineNumbers={false}
                                        customStyle={{
                                            overflowX: 'auto',
                                            background: 'black'
                                        }}
                                    />
                                    <CopyButton text={codeSnippets} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'installation' && (
                            <div className="relative mt-2">
                                <CopyBlock
                                    text={copyText}
                                    language="bash"
                                    theme={irBlack}
                                    codeBlock
                                    showLineNumbers={false}
                                    customStyle={{
                                        overflowX: 'auto',
                                        background: 'black'
                                    }}
                                />
                                <CopyButton text={copyText} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                        <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                            <List className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                            Props
                        </h3>
                        <div className="mt-4">
                            <PropsTable showAll={showAllProps} setShowAll={setShowAllProps} />
                        </div>
                    </div>
                    <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                        <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                            <Puzzle className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                            Dependencies
                        </h3>
                        <div className="mt-4">
                            <DependenciesList />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default NavMenuEffect;