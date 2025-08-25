/* eslint-disable no-unused-vars */
// ApexIntro.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    Copy,
    ChevronDown,
    Rocket,
    FolderGit2,
    Check,
    Box,
    Zap,
    CodeXml,
    Palette,
    Layers
} from "lucide-react";
import ApexUIImage from "/assets/ApexUI-Logo.png"; // Make sure this path is correct

// Lightweight LazyImage with blur-up placeholder
const LazyImage = ({ src, alt, wrapperClassName = '', imgClassName = '' }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`${wrapperClassName} relative overflow-hidden`}>
            {/* placeholder background while image loads */}
            <div
                aria-hidden
                className={`absolute inset-0 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.75))'
                }}
            />
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                onLoad={() => setLoaded(true)}
                className={`${imgClassName} w-full h-auto object-cover block`}
                style={{
                    filter: loaded ? 'none' : 'blur(18px)',
                    transform: loaded ? 'none' : 'scale(1.03)',
                    transition: 'filter 700ms ease, transform 700ms ease, opacity 300ms ease',
                    opacity: loaded ? 1 : 0.98
                }}
            />
        </div>
    );
};

// --- Accordion Component for FAQ ---
const AccordionItem = ({ item, index, expanded, onToggle }) => {
    const isOpen = index === expanded;
    return (
        <div className="border-b border-[var(--color-pages-divider)]">
            <button
                onClick={() => onToggle(index)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-[var(--color-pages-side-active-text4)] hover:text-[var(--color-pages-side-active-text)] transition-colors duration-300"
            >
                <span>{item.q}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-base text-[var(--color-pages-props-text)]">
                            {item.a}
                        </p>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Intro Component ---
const ApexIntro = () => {
    const [copied, setCopied] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleCopy = () => {
        navigator.clipboard.writeText("npx apex-ui-kit add hyper-card");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const features = [
        { icon: <Zap size={24} />, title: "One-Line Integration", description: "Instantly add any component with a single CLI command. No manual setup." },
        { icon: <Box size={24} />, title: "Production-Ready", description: "Components are responsive, clean, and performant, built with modern tech." },
        { icon: <CodeXml size={24} />, title: "Developer-First Design", description: "Reusable, accessible, and easy to integrate into any React/Vite project." },
        { icon: <Palette size={24} />, title: "Fully Customizable", description: "Since components are added to your codebase, you have full control to edit and style them as you see fit." },
        { icon: <Layers size={24} />, title: "Minimal Dependencies", description: "We only install what's necessary, keeping your project lean and fast." },
        { icon: <Rocket size={24} />, title: "Built for Speed", description: "Leveraging GSAP and Framer Motion for high-performance, smooth animations." },
    ];

    const faqs = [
        { q: "Does ApexUI work with Create React App?", a: "Yes, as long as Tailwind CSS is configured properly, ApexUI works perfectly with CRA." },
        { q: "How can I customize a component?", a: "All components are added directly to your project in `src/ApexUI/`. You can open the generated file and modify it as needed." },
        { q: "Does ApexUI support animation out of the box?", a: "Yes. GSAP and Framer Motion are pre-integrated for smooth, high-performance animations." },
        { q: "Is ApexUI open source?", a: "Absolutely. It is MIT licensed and open to contributions on GitHub." }
    ];

    return (
        <section className="py-20 sm:py-24">
            <div className="max-w-5xl mx-auto px-4 space-y-24">

                {/* --- Hero Section --- */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-pages-props-heading-text)] to-[var(--color-pages-props-heading-text2)] bg-clip-text text-transparent">
                            Build Animated UIs, Faster.
                        </h1>
                        <p className="text-lg text-[var(--color-pages-props-sub-text)]">
                            <span className="font-semibold text-[var(--color-pages-side-active-text4)]">ApexUI</span> is a developer-first React component kit designed to help you build beautiful, animated interfaces with zero boilerplate.
                        </p>
                        <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-4 relative">
                            <div className="flex items-center justify-between bg-black/50 rounded-md px-4 py-2">
                                <SyntaxHighlighter
                                    language="bash"
                                    style={atomDark}
                                    customStyle={{
                                        background: 'transparent',
                                        padding: '0',
                                        margin: '0',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {`npx apex-ui-kit add hyper-card`}
                                </SyntaxHighlighter>
                                <button onClick={handleCopy} className="text-[var(--color-pages-props-text)] hover:text-white transition" title="Copy command">
                                    <Copy size={16} />
                                </button>
                            </div>
                            {copied && <p className="absolute -top-3 right-4 text-xs bg-[var(--color-pages-side-active-text)] text-[var(--color-pages-bg)] px-2 py-0.5 rounded-full font-semibold">Copied!</p>}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-full rounded-4xl overflow-hidden shadow-2xl border border-[var(--color-pages-border)] bg-[var(--color-pages-bg)]">
                            <LazyImage src={ApexUIImage} alt="Apex UI Logo" wrapperClassName="w-full" imgClassName="w-full" />
                        </div>
                    </div>
                </div>

                {/* --- Features Section --- */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-[var(--color-pages-side-active-text4)]">Why Choose ApexUI?</h2>
                    <p className="text-lg text-[var(--color-pages-props-sub-text)] max-w-3xl mx-auto mb-12">
                        ApexUI is more than just a component library. It's a tool that accelerates your development workflow by providing you with ready-to-use, fully customizable, and beautifully animated components right inside your project.
                    </p>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-10 text-left">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-3 bg-[var(--color-pages-border)] rounded-full text-[var(--color-pages-side-active-text4)]">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1 text-[var(--color-pages-side-active-text6)]">{feature.title}</h3>
                                    <p className="text-[var(--color-pages-props-text)]">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Tech Stack & Requirements Section --- */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-[var(--color-pages-side-active-text6)]">
                            <Rocket className="text-[var(--color-pages-side-active-text)]" /> Our Tech Stack
                        </h3>
                        <ul className="space-y-3 text-[var(--color-pages-props-text)]">
                            <li className="flex items-center gap-3"><Check className="text-green-500" /> <strong>React.js:</strong> Component-based structure with a massive ecosystem.</li>
                            <li className="flex items-center gap-3"><Check className="text-green-500" /> <strong>Tailwind CSS:</strong> Utility-first styling for clean, responsive design.</li>
                            <li className="flex items-center gap-3"><Check className="text-green-500" /> <strong>GSAP & Framer Motion:</strong> For high-performance, native animations.</li>
                        </ul>
                    </div>
                    <div className="bg-[var(--color-pages-bg)] border border-[var(--color-pages-border)] rounded-lg p-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-[var(--color-pages-side-active-text6)]">
                            <FolderGit2 className="text-[var(--color-pages-side-active-text)]" /> Requirements
                        </h3>
                        <ul className="space-y-3 text-[var(--color-pages-props-text)]">
                            <li><strong>React+Vite:</strong> Latest version recommended.</li>
                            <li><strong>Tailwind CSS:</strong> Must be properly configured.</li>
                            <li><strong>Node.js:</strong> Version 18+</li>
                        </ul>
                    </div>
                </div>

                {/* --- FAQ Section --- */}
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-pages-side-active-text6)]">Frequently Asked Questions</h2>
                    <div className="max-w-2xl mx-auto">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                item={faq}
                                index={index}
                                expanded={expandedFaq}
                                onToggle={(idx) => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApexIntro;
