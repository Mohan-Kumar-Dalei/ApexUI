import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
// Change: FontAwesome is replaced with Lucide Icons for consistency
import {
    GitFork,
    Code,
    Terminal,
    List,
    Puzzle,
    Package,
    Copy
} from 'lucide-react';

import FlipProfile from '../ApexUI-Kit/FlipProfile/FlipProfile.jsx';
import ParallaxProfile from '../ApexUI-Kit/ParallaxProfile/ParallaxProfile.jsx';
import { CopyBlock, irBlack } from 'react-code-blocks';


// Minimal CopyButton for code blocks (TailwindSetup style)
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
            className="text-sm font-medium text-[var(--color-pages-side-active-text)] hover:text-[var(--color-pages-side-active-hover)]"
            onClick={() => setShowAll((v) => !v)}
        >
            {showAll ? 'Show Less' : `Show ${propCount - 5} More`}
        </button>
    );
}

function PropsTable({ showAll, setShowAll, propsTableData }) {
    const allProps = propsTableData || [];
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
                            <td className="py-4 text-[var(--color-pages-props-text)]">{row.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DependenciesList({ dependencies }) {
    if (!dependencies) return null;
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

// --- REUSABLE SHOWCASE COMPONENT ---

const ShowcaseBlock = ({
    previewCount = 1,
    componentToShow: ComponentToShow,
    propsTableData = [],
    codeSnippets = {},
    dependencies = [],
    installCommand = ''
}) => {
    const [activeTab, setActiveTab] = useState('preview');
    const selectedLang = 'jsx';
    const [showAllProps, setShowAllProps] = useState(false);
    const contentRef = useRef(null);
    const tabs = [
        { id: 'preview', label: 'Preview', icon: GitFork },
        { id: 'usage', label: 'Usage', icon: Code },
        { id: 'installation', label: 'Installation', icon: Terminal },
    ];
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    return (
        <>
            <div className="w-full bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg shadow-2xl overflow-hidden">
                <div className="border-b border-[var(--color-pages-divider)]">
                    <nav className="flex space-x-1 sm:space-x-2 px-2 sm:px-4 whitespace-nowrap" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative group font-medium text-sm py-4 px-2 sm:px-3 focus:outline-none transition-colors w-full md:w-auto ${activeTab === tab.id
                                    ? 'text-[var(--color-pages-side-active-text)]'
                                    : 'text-[var(--color-pages-props-text)] hover:text-[var(--color-pages-side-hover)]'
                                    }`}
                            >
                                <tab.icon className="inline-block w-4 h-4 mr-2" />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-pages-side-active-text)] rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
                <div ref={contentRef} className="p-4 sm:p-6">
                    {activeTab === 'preview' && (
                        <div className="w-full min-h-[60vh] bg-black/30 rounded-md flex items-center justify-center p-4 sm:p-8 overflow-auto">
                            <div className={`flex ${previewCount > 1 ? 'flex-col sm:flex-row' : 'flex-col'} gap-8 w-full h-full items-center justify-center`}>
                                {Array.from({ length: previewCount }).map((_, index) => (
                                    <div key={index} className="flex items-center justify-center w-full max-w-xs">
                                        {ComponentToShow && <ComponentToShow />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'usage' && (
                        <div>
                            <div className="mt-2 relative">
                                <CopyBlock
                                    text={codeSnippets || ''}
                                    language={selectedLang}
                                    theme={irBlack}
                                    codeBlock
                                    showLineNumbers={false}
                                    customStyle={{
                                        overflowX: 'auto',
                                        background: 'black'
                                    }}
                                />
                                <CopyButton text={codeSnippets || ''} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'installation' && (
                        <div className="relative mt-2">
                            <CopyBlock
                                text={installCommand || ''}
                                language="bash"
                                theme={irBlack}
                                codeBlock
                                showLineNumbers={false}
                                customStyle={{
                                    overflowX: 'auto',
                                    background: 'black'
                                }}
                            />
                            <CopyButton text={installCommand || ''} />
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
                        <PropsTable showAll={showAllProps} setShowAll={setShowAllProps} propsTableData={propsTableData} />
                    </div>
                </div>
                <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                    <h3 className="flex items-center gap-3 font-semibold text-lg text-[var(--color-pages-side-active-text6)]">
                        <Puzzle className="w-5 h-5 text-[var(--color-pages-side-active-text)]" />
                        Dependencies
                    </h3>
                    <div className="mt-4">
                        <DependenciesList dependencies={dependencies} />
                    </div>
                </div>
            </div>
        </>
    );
}

// --- MAIN PAGE COMPONENT ---

const ProfileEffect = () => {
    // Data for FlipProfile
    const flipProfileProps = [
        { prop: 'name', type: 'string', def: '"Iron Man"', desc: 'Profile name.' },
        { prop: 'role', type: 'string', def: '"AI Engineer"', desc: 'User role or profession.' },
        { prop: 'dob', type: 'string', def: '"5th March, 1999"', desc: 'Date of birth.' },
        { prop: 'avatar', type: 'string', def: '"..."', desc: 'Profile image URL.' },
        { prop: 'github', type: 'string', def: '"#"', desc: 'GitHub profile link.' },
        { prop: 'linkedin', type: 'string', def: '"#"', desc: 'LinkedIn profile link.' },
        { prop: 'twitter', type: 'string', def: '"#"', desc: 'Twitter/X profile link.' },
        { prop: 'resumeLink', type: 'string', def: '"..."', desc: 'Resume PDF link.' },
        { prop: 'hireLink', type: 'string', def: '"#"', desc: 'Contact or hire link.' },
        { prop: 'bgColor', type: 'string', def: '"#2d133b"', desc: 'Card background color.' },
    ];
    const flipProfileCode =
        `import FlipProfile from './ApexUI-Kit/Profile/FlipProfile.jsx';
const App = () => (
   <FlipProfile
    name = "Iron Man",
    role = "AI Engineer",
    dob = "5th March, 1999",
    avatar = "/public/assets/ironman.png",
    github = "#",
    linkedin = "#",
    twitter = "#",
    resumeLink = "/Iron-Man-Resume.pdf",
    hireLink = "#",
    bgColor = "#0F172B" 
    />
);
export default App;`

    const flipProfileDeps = [
        { name: 'React', desc: 'Modern React library for UI building' },
        { name: 'Framer Motion', desc: 'Animation library for smooth effects' },
        { name: 'TailwindCSS', desc: 'Utility-first CSS framework for rapid styling' },
    ];
    const flipProfileInstall = 'npm i apex-ui-kit && npx apex-ui-kit add flip-profile';

    // Data for ParallaxProfile
    const parallaxProfileProps = [
        { prop: 'name', type: 'string', def: '"Spider Man"', desc: 'Profile name.' },
        { prop: 'status', type: 'string', def: '"Available for Hire"', desc: 'Current status.' },
        { prop: 'avatarUrl', type: 'string', def: '"..."', desc: 'Profile image URL (PNG recommended).' },
        { prop: 'username', type: 'string', def: '"spider_man"', desc: 'Profile username.' },
        { prop: 'title', type: 'string', def: '"Photographer"', desc: 'User title or profession.' },
        { prop: 'socials', type: 'object', def: '{ }', desc: 'Object with social media links.' },
        { prop: 'bgColor', type: 'string', def: '"#1a1a2e"', desc: 'Card background color.' },
    ];
    const parallaxProfileCode =
        `import ParallaxProfile from './ApexUI-Kit/Profile/ParallaxProfile.jsx';

const App = () => (
    <ParallaxProfile
        profile={{
            name: "Spider Man",
            status: "Available for Hire",
            avatarUrl: "/assets/spiderman.png",
            username: "spider_man",
            title: "Photographer",
            bgColor: "#1a1a2e",
            socials: {
                github: "https://github.com/",
                linkedin: "https://www.linkedin.com/",
                twitter: "https://twitter.com/",
                instagram: "https://www.instagram.com/",
            },
        }}
    />
);
export default App;`

    const parallaxProfileDeps = [
        { name: 'React', desc: 'Modern React library for UI building' },
        { name: 'GSAP', desc: 'Animation library for smooth effects' },
        { name: 'TailwindCSS', desc: 'Utility-first CSS framework for rapid styling' },
    ];
    const parallaxProfileInstall = 'npm i apex-ui-kit && npx apex-ui-kit add parallax-profile';

    return (
        <div className="text-[var(--color-pages-props-text2)] min-h-screen">
            <div className="max-w-5xl mx-auto  py-16 sm:py-24">

                {/* FlipProfile Showcase Section */}
                <header className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4">
                        Flip Profile
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        An animated profile card with a 3D flip effect, perfect for showcasing user information and social links.
                    </p>
                </header>
                <ShowcaseBlock
                    previewCount={1}
                    componentToShow={FlipProfile}
                    propsTableData={flipProfileProps}
                    codeSnippets={flipProfileCode}
                    dependencies={flipProfileDeps}
                    installCommand={flipProfileInstall}
                />

                {/* Divider */}
                <hr className="my-16 sm:my-24 border-[var(--color-pages-divider)]" />

                {/* ParallaxProfile Showcase Section */}
                <header className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-4">
                        Parallax Profile
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        A profile card with a parallax effect on hover, creating a sense of depth and interactivity.
                    </p>
                </header>
                <ShowcaseBlock
                    componentToShow={ParallaxProfile}
                    propsTableData={parallaxProfileProps}
                    codeSnippets={parallaxProfileCode}
                    dependencies={parallaxProfileDeps}
                    installCommand={parallaxProfileInstall}
                />
            </div>
        </div>
    );
}

export default ProfileEffect;
