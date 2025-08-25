import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Lucide Icons for a modern look
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy,
    Settings2
} from 'lucide-react';
// Using CodeBlock and the irBlack theme as per your example
import { CopyBlock, irBlack, CodeBlock } from 'react-code-blocks';
// Assuming your ThemeToggle component is here
import ThemeToggle from '../ApexUI-Kit/ThemeToggle/ThemeToggle';


// --- SUB-COMPONENTS USING CSS VARIABLES ---

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
        { prop: 'LightTheme', type: 'string', def: 'light', desc: 'Set the Theme for light mode.' },
        { prop: 'animation', type: 'string', def: 'circle-right', desc: 'Animation for the toggle switch.' },
        { prop: 'gif', type: 'link', def: '...', desc: 'Link to the GIF for the toggle switch.' },
        { prop: 'duration', type: 'string', def: '1s', desc: 'Set the animation Speed' },
        { prop: 'className', type: 'string', def: '...', desc: 'Custom class name for the toggle switch.' },
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
        { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
        { name: 'TailwindCSS', desc: 'A utility-first CSS framework for rapid styling.' },
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


// --- MAIN SHOWCASE PAGE COMPONENT ---

const ThemeToggleEffect = () => {
    const [activeTab, setActiveTab] = useState('preview');
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);

    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
        { id: 'setup', label: 'Setup', icon: Settings2 },
    ];
    const ToggleContent = [
        { animation: 'circle', theme: 'light' },
        { animation: 'circle-right', theme: 'light' },
        { animation: 'circle-left', theme: 'light' },
        { animation: 'split-reveal-horizontal', theme: 'light' },
        { animation: 'chevron-wipe-right', theme: 'light' },
        { animation: 'blur-fade', theme: 'light' },
        { animation: 'gif', theme: 'light', link: '/assets/ApexUI.gif' },
        { animation: 'gif', theme: 'light', link: 'https://media.tenor.com/azoiEHypBKYAAAAi/ketawa-love.gif' },
        { animation: 'gif', theme: 'light', link: 'https://media.tenor.com/6fO1ClbWx6YAAAAi/raamking.gif' },
    ]

    const usageCodeText = `import ThemeToggle from './ApexUI-Kit/ThemeToggle/ThemeToggle';

const App = () => {
return (
<ThemeToggle 
    LightTheme="light" 
    animation={{type: 'gif', link: '/assets/ApexUI.gif'}}
    animation='circle-left'
    duration="1s"
    />
);
};
export default App;`;

    const installationCodeText = "npm i apex-ui-kit && npx apex-ui-kit add theme-toggle";
    const setupCodeText = `
// ============================
// THEME & ANIMATION SETUP GUIDE
// ============================

// ----------------------------
// 🎨 Theme Setup
// ----------------------------
/*
Step 1️⃣: Define your theme in CSS
----------------------------------
.theme-light {
  --right-color-bg: #e5c287;   // ✅ Replace only color values
  --color-text: #615b5b;
  ...
}

Step 2️⃣: Register theme in ThemeConfig.js
------------------------------------------
export const THEMES = {
  light: "theme-light",
};

Step 3️⃣: Apply theme in component
----------------------------------
<ThemeToggle LightTheme="light" />
*/


// ----------------------------
// ✨ Animation Setup
// ----------------------------
/*
Step 1️⃣: Define animation in ThemeAnimation.js
-----------------------------------------------

📌 Example 1: Circle-left animation
-------------------------------------------------
case "circle-left": {
  const svg = esc(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="b"><feGaussianBlur 
    stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23b)"/></svg>'
  );

  return header + \`
    ::view-transition-new(root) {
      mask: url('data:image/svg+xml,svg') top left / 0 no-repeat;
      -webkit-mask: url('data:image/svg+xml,svg') top left / 0 no-repeat;
      transform-origin: top left;
      animation: vt-scale-tl var(--vt-duration);
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      transform-origin: top left;
      animation: vt-scale-tl var(--vt-duration);
    }

    @keyframes vt-scale-tl {
      to { 
        mask-size: 350vmax;
        -webkit-mask-size: 350vmax;
      }
    }
  \`;
}

Step 2️⃣: Register animation in ThemeToggle.jsx
-----------------------------------------------
📌 Use a built-in animation:
<ThemeToggle animation="circle-left" />

📌 Use a GIF animation:
<ThemeToggle animation={{ type: "gif", link: "your-gif-link.gif" }} />

💡 Note:
- Visit any GIF site (e.g., tenor.com).
- Choose a GIF with a transparent background for best results.
- Right-click → "Copy Image Address".
- Paste the link in the \`link\` field above.
*/
`;



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
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent py-4">
                        Theme Toggle
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        A sleek and accessible toggle switch for changing between light and dark themes.
                    </p>
                </header>

                <div className="w-full bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg shadow-2xl overflow-hidden">
                    <div className="border-b border-[var(--color-pages-divider)]">
                        <nav className="flex space-x-1 sm:space-x-2 px-2 sm:px-4 whitespace-nowrap" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative group font-medium text-sm py-4 px-2 sm:px-3 focus:outline-none transition-colors w-full md:w-auto ${activeTab === tab.id ? 'text-[var(--color-pages-side-active-text)]' : 'text-[var(--color-pages-props-text)] hover:text-[var(--color-pages-side-hover)]'
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
                            <div className="w-full min-h-[50vh] bg-black/30 rounded-md flex  items-center justify-center p-4 gap-4">
                                {
                                    ToggleContent.map((item, index) => (
                                        <div key={index} className="w-10 h-full flex flex-col items-center justify-center group relative">
                                            {/* Top tooltip: theme */}
                                            <span className="pointer-events-none select-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded  text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-lg">
                                                theme: {item.theme}
                                            </span>
                                            <ThemeToggle
                                                LightTheme={item.theme}
                                                animation={{ type: item.animation, link: item.link }}
                                                duration="1s"
                                                ease="var(--vt-ease)"
                                                className='text-gray-400 hover:text-[var(--color-hover-text)]'
                                            />
                                            {/* Bottom tooltip: animation */}
                                            <span className="pointer-events-none select-none absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap shadow-lg">
                                                animation: {item.animation}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                        {activeTab === 'usage' && (
                            <div className="relative mt-2">
                                <CopyBlock
                                    text={usageCodeText}
                                    language="jsx"
                                    theme={irBlack}
                                    codeBlock
                                    showLineNumbers={false}
                                    customStyle={{
                                        overflowX: 'auto',
                                        background: 'black'
                                    }}
                                />
                                <CopyButton text={usageCodeText} />
                            </div>
                        )}
                        {activeTab === 'installation' && (
                            <div className="relative mt-2">
                                <CopyBlock
                                    text={installationCodeText}
                                    language="bash"
                                    theme={irBlack}
                                    codeBlock
                                    showLineNumbers={false}
                                    customStyle={{
                                        overflowX: 'auto',
                                        background: 'black'
                                    }}
                                />
                                <CopyButton text={installationCodeText} />
                            </div>
                        )}
                        {activeTab === 'setup' && (
                            <div className="relative mt-2 overflow-hidden">
                                {/* ✅ Wrapper with expand logic */}
                                <div
                                    className={`relative transition-all ease-in-out duration-500 overflow-hidden rounded-md ${expanded ? 'max-h-[2500px]' : 'max-h-[250px]'}`}
                                >
                                    <CodeBlock
                                        text={setupCodeText}
                                        language="bash"
                                        theme={irBlack}
                                        codeBlock
                                        showLineNumbers={false}
                                        customStyle={{
                                            overflowX: 'auto',
                                            background: 'black'
                                        }}
                                    />

                                    {/* ✅ Faded TOP Overlay with Expand button */}
                                    {!expanded ? (
                                        <div className="absolute bottom-0 left-0 w-full h-full 
                        bg-gradient-to-t from-black/90 via-black/70 to-transparent 
                        flex justify-center items-center pt-6 ">
                                            <button
                                                onClick={() => setExpanded(true)}
                                                className="px-4 py-2 text-xs font-semibold rounded-md border 
                       border-gray-600 bg-lime-700 text-white 
                       hover:bg-lime-600 transition"
                                            >
                                                Expand
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full 
                        flex justify-center items-end  pt-6">
                                            <button
                                                onClick={() => setExpanded(false)}
                                                className="px-4 py-2 text-xs font-semibold rounded-md border 
                       border-gray-600 bg-lime-700 text-white 
                       hover:bg-lime-600 transition"
                                            >
                                                Collapse
                                            </button>
                                        </div>
                                    )}
                                </div>
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

export default ThemeToggleEffect;