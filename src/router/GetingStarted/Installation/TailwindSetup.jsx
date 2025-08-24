// TailwindViteSetup.jsx
import { CopyBlock, irBlack,} from 'react-code-blocks';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
    Terminal,
    FileCode,
    Play,
    Wind,
    PackagePlus,
    Settings2,
} from 'lucide-react';

const TailwindViteSetup = () => {
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
    const steps = [
        {
            // Responsive icon sizing
            icon: <PackagePlus className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Install Tailwind CSS & Dependencies",
            description: "Install Tailwind CSS, PostCSS, and Autoprefixer, then generate your configuration files.",
            code: `npm install tailwindcss @tailwindcss/vite`,
            lang: 'bash'
        },
        {
            // Responsive icon sizing
            icon: <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Configure Template Paths",
            description: "Add the paths to all of your template files in your `tailwind.config.js` file.",
            code: `import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});`,
            lang: 'javascript'
        },
        {
            // Responsive icon sizing
            icon: <FileCode className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Add Tailwind Directives to CSS",
            description: "Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.",
            code: `@import "tailwindcss";`,
            lang: 'css'
        },
        {
            // Responsive icon sizing
            icon: <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-pages-side-active-text)]" />,
            title: "Start the Build Process",
            description: "Run your build process with npm run dev to start using Tailwind classes in your project.",
            code: `npm run dev`,
            lang: 'bash'
        }
    ];

    return (
        <section className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto sm:px-6">
                {/* Header with responsive text sizes and margin */}
                <header className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent flex items-center justify-center gap-3 sm:gap-4">
                        <Wind className="w-8 h-8 sm:w-auto" /> Tailwind CSS + Vite
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-[var(--color-pages-props-sub-text)] max-w-2xl mx-auto">
                        Follow this guide to integrate the powerful utility-first CSS framework, Tailwind CSS, into your Vite project.
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
                                    <div className="mt-4 relative">
                                        <CopyBlock
                                            text={step.code}
                                            language={step.lang}
                                            theme={irBlack}
                                            showLineNumbers={false}
                                            codeBlock
                                            customStyle={{
                                                overflowX: 'auto',
                                                background: 'black'
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
                    🎉 All set! You can now start using Tailwind's utility classes to style your content.
                </p>
            </div>
        </section>
    );
};

export default TailwindViteSetup;