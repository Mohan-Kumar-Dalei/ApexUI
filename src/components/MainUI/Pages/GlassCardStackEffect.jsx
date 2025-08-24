import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy
} from 'lucide-react';
import GlassCardStack from '../ApexUI-Kit/GlassCardStack/GlassCardStack.jsx';
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

function PropsTable() {
    const allProps = [
        { prop: 'cards', type: 'array', def: '[...]', desc: 'Array of card data objects (title, subtitle, etc.)' },
        { prop: 'autoCycle', type: 'boolean', def: 'true', desc: 'Enable or disable auto cycling of cards' },
        { prop: 'cycleInterval', type: 'number', def: '5000', desc: 'Interval in ms for auto cycling' },
    ];


    return (
        <div className="overflow-x-auto">
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
                    {allProps.map((row) => (
                        <tr key={row.prop}>
                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text)]">{row.prop}</td>
                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text2)]">{row.type}</td>
                            <td className="py-4 pr-4 whitespace-nowrap font-mono text-[var(--color-pages-side-active-text3)]">{row.def}</td>
                            <td className="py-4 text-[var(--color-pages-props-text)]">{row.desc}</td>
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
const GlassCardStackEffect = () => {
    const Cards = [
        {
            title: "ApexUI Glass Card Stack",
            subtitle: "Modern glassmorphic stack with animation",
            desc: "Beautiful glassmorphic UI. Pause on hover, auto-cycling.",
            color: "from-blue-500/60 to-blue-300/30",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
            link: "https://github.com/sheryians/apexui",
            github: "https://github.com/sheryians/apexui",
        },
        {
            title: "React Modern Card",
            subtitle: "Responsive, animated, and clean",
            desc: "Modern, responsive, and animated. Stacked with smooth transitions.",
            color: "from-pink-500/60 to-pink-300/30",
            image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80",
            link: "https://react.dev/",
            github: "https://github.com/facebook/react",
        },
        {
            title: "UI Stack Demo",
            subtitle: "Stacked cards with effects",
            desc: "Stacked with smooth transitions. Glassmorphic and beautiful.",
            color: "from-green-500/60 to-green-300/30",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
            link: "https://ui.sheryians.com/",
            github: "https://github.com/sheryians/ui-demo",
        },
        {
            title: "Pause & Cycle",
            subtitle: "Auto-cycling, pause on hover",
            desc: "Pause on hover, auto-cycling. Try it now!",
            color: "from-yellow-500/60 to-yellow-300/30",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
            link: "https://github.com/sheryians",
            github: "https://github.com/sheryians",
        },
    ];
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx';
    const contentRef = useRef(null);
    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];
    const codeSnippets = 
        `import GlassCardStack from './ApexUI-Kit/GlassCardStack/GlassCardStack.jsx';

const App = () => {
  return (
      const Cards = [
        {
            title: "ApexUI Glass Card Stack",
            subtitle: "Modern glassmorphic stack with animation",
            desc: "Beautiful glassmorphic UI. Pause on hover, auto-cycling.",
            color: "from-blue-500/60 to-blue-300/30",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
            link: "https://github.com/sheryians/apexui",
            github: "https://github.com/sheryians/apexui",
        },
        // Add more cards as needed
    ];
    return (
        <div>
            <GlassCardStack 
            cards={Cards} 
            autoCycle={true}
            cycleInterval={5000}
            />
        </div>
    );
}
export default App;`
let copyText = `npm i apex-ui-kit && npx apex-ui-kit add glass-card-stack`;

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
                        Glass Card Stack
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        An interactive stack of glassmorphism cards that cycle automatically, perfect for showcasing projects or testimonials.
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
                                            // Change: Hard-coded background color replaced with CSS variable
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-pages-side-active-text)] rounded-full"></span>
                                        )}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <div ref={contentRef} className="p-4 sm:p-6">
                        {activeTab === 'preview' && (
                            <div className="w-full min-h-[50vh] bg-black/30 rounded-md flex items-center justify-center p-4">
                                <GlassCardStack
                                    autoCycle={true}
                                    cycleInterval={3000}
                                    cards={Cards}
                                />
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
                            <PropsTable />
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

export default GlassCardStackEffect;