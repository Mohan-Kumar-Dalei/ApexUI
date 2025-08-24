// ApexUICLISetup.jsx
import { CopyBlock, irBlack } from 'react-code-blocks';
import { useState } from 'react';
import { Copy } from 'lucide-react';
// Change: FontAwesome is replaced with Lucide Icons for consistency
import {
    Download,
    Terminal,
    Puzzle,
    CheckCircle
} from 'lucide-react';

const ApexUICLISetup = () => {
    // Custom CopyButton for code blocks
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
                        className="pointer-events-none select-none absolute -top-8 right-1/2 translate-x-1/2 px-3 py-1 rounded-md bg-white text-xs font-semibold text-black border border-gray-200 "
                        style={{
                            minWidth: '60px',
                            textAlign: 'center',
                            zIndex: 990,
                        }}
                    >
                        Copied!
                        <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" style={{ marginTop: '-2px' }}></span>
                    </span>
                )}
            </div>
        );
    };
    const steps = [
        {
            icon: <Terminal className="w-6 h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Run the CLI installer",
            description: "This initializes Apex UI in your project, generating the `src/ApexUI` folder automatically.",
            code: `npm i apex-ui-kit`,
            lang: 'bash'
        },
        {
            icon: <Puzzle className="w-6 h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Add a component like HyperCard",
            description: "This command adds the animated `HyperCard` component to `src/ApexUI/`.",
            code: `npx apex-ui-kit add hyper-card`,
            lang: 'bash'
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Import and use in App.jsx",
            description: "Once added, you can instantly use your component like any other React import.",
            code: `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

const App = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <HyperCard />
    </main>
  );
};
export default App;`,
            lang: 'jsx'
        }
    ];

    return (
        <section className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto sm:px-6">
                <header className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-3 sm:gap-4">
                        <Download className="w-8 h-8 sm:w-auto" /> Install via CLI
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        Get up and running in minutes. Follow these simple steps to integrate Apex UI components into your project.
                    </p>
                </header>

                <div className="relative">
                    {/* Vertical Timeline Line - position adjusted for smaller icon size on mobile */}
                    <div className="absolute left-3 sm:left-9 top-0 h-full w-0.5 bg-[var(--color-pages-divider)] -translate-x-1/2" aria-hidden="true"></div>

                    {/* Responsive spacing between timeline items */}
                    <div className="space-y-10 sm:space-y-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex items-start">
                                {/* Timeline Icon - smaller on mobile */}
                                <div className="-ml-3 sm:-ml-0 flex-shrink-0 w-12 h-12 sm:w-18 sm:h-18 bg-[var(--color-pages-bg)] rounded-full border-2 border-[var(--color-pages-divider)] flex items-center justify-center z-10">
                                    {step.icon}
                                </div>
                                {/* Content container with responsive margin */}
                                <div className="ml-4 sm:ml-6 flex-1 pt-1 max-md:overflow-hidden scrollbar-hide">
                                    {/* Step Title - smaller font on mobile */}
                                    <h3 className="text-lg sm:text-xl font-bold text-[var(--color-pages-side-active-text4)]">
                                        Step {index + 1}: {step.title}
                                    </h3>
                                    <p className="mt-2 text-base text-[var(--color-pages-props-text)]">
                                        {step.description}
                                    </p>
                                    <div className="mt-4 relative ">
                                        <CopyBlock
                                            text={step.code}
                                            language={step.lang}
                                            theme={irBlack}
                                            showLineNumbers={false}
                                            codeBlock
                                            scrollable
                                            customStyle={{
                                                overflowX: 'auto',
                                                background: 'black',
                                                display: 'flex',
                                            }}
                                        />
                                        <CopyButton text={step.code} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Responsive top padding for the final message */}
                <p className="text-center text-[var(--color-pages-props-text)] pt-12 sm:pt-16">
                    ✅ That’s it! Apex UI CLI makes it easy to scaffold and use beautiful, animated UI components instantly.
                </p>
            </div>
        </section>
    );
};

export default ApexUICLISetup;
