// ApexIntro.jsx
import { Copy } from "lucide-react";
import ApexUIImage from "../../assets/ApexUI-Beta.png";
import { useState, useRef } from "react";
import { CopyBlock, dracula, } from "react-code-blocks";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faGem,
    faRocket,
    faFolderOpen
} from "@fortawesome/free-solid-svg-icons";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ApexIntro = () => {
    const [copied, setCopied] = useState(false);
    const [faqOpen, setFaqOpen] = useState(null);
    const faqRefs = useRef([]);
    const iconRefs = useRef([]);

    const handleCopy = () => {
        navigator.clipboard.writeText("npx apex-ui add hyper-card");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleFAQ = (index) => {
        if (faqOpen === index) {
            gsap.to(faqRefs.current[index], {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power3.inOut"
            });
            gsap.to(iconRefs.current[index], {
                rotate: 0,
                duration: 0.5,
                ease: "power3.inOut",
                overwrite: "auto"
            });
            setFaqOpen(null);
        } else {
            if (faqOpen !== null && faqRefs.current[faqOpen]) {
                gsap.to(faqRefs.current[faqOpen], {
                    height: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut"
                });
                gsap.to(iconRefs.current[faqOpen], {
                    rotate: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
            }
            setFaqOpen(index);
            gsap.set(faqRefs.current[index], { height: "auto" });
            const autoHeight = faqRefs.current[index].scrollHeight;
            gsap.fromTo(
                iconRefs.current[index],
                { rotate: 0 },
                {
                    rotate: 90,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                }
            );
            gsap.fromTo(
                faqRefs.current[index],
                { height: 0, opacity: 0 },
                {
                    height: autoHeight,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        faqRefs.current[index].style.height = "auto";
                    }
                }
            );
        }
    };

    return (
        <section className="px-4 py-20 sm:px-8 lg:px-16 text-[wheat] rounded-md">
            <div className="max-w-7xl mx-auto space-y-20">

                {/* Hero Intro */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">Introducing ApexUI</h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            <span className="text-purple-400 font-semibold">ApexUI</span> is a developer-first React component kit designed to help you build fast, animated UIs — without boilerplate.
                        </p>
                        <div className=" border border-purple-400/40 rounded-xl p-4 relative bg-white/10">
                            <p className="text-sm text-white/60 mb-2"># Run the CLI command</p>
                            <div className="flex items-center justify-between bg-[#0d0d0f] rounded-lg px-4 py-2 text-purple-400 font-mono text-sm">
                                <SyntaxHighlighter language="bash" style={atomDark} customStyle={{ background: 'transparent', fontSize: '1em', margin: 0, padding: 0, color: '#a855f7' }}>
                                    {`npx apex-ui@latest add hyper-card`}
                                </SyntaxHighlighter>
                                <button onClick={handleCopy} className="text-white hover:text-purple-300 transition" title="Copy command">
                                    <Copy size={16} />
                                </button>
                            </div>
                            {copied && <p className="absolute top-2 right-4 text-xs text-purple-400 font-medium">Copied!</p>}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-purple-400/40 bg-white/5 backdrop-blur-md">
                            <img src={ApexUIImage} alt="Apex UI Screenshot" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>

                {/* Why Choose ApexUI */}
                <div className=" border border-purple-400/40 rounded-xl p-6 space-y-4 bg-white/10">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <FontAwesomeIcon icon={faGem} className="text-purple-400" /> Why Choose ApexUI?
                    </h3>
                    <ul className="list-disc pl-5 text-white/80 space-y-4">
                        <li><strong>One-Line Integration:</strong> Instantly add any animated component with a single CLI command like <code>npx apex-ui add hyper-card</code>. No manual setup — just plug and play.</li>
                        <li><strong>Production-Ready by Default:</strong> All ApexUI components are responsive, clean, and performant — built with Tailwind CSS, GSAP, and Framer Motion.</li>
                        <li><strong>Developer-First Design:</strong> Reusable, accessible, and easy to integrate into any React/Vite project.</li>
                        <li><strong>Zero Config Hassle:</strong> Dependencies like <code>gsap</code>, <code>framer-motion</code>, and <code>react-icons</code> are auto-installed — no conflicts, no setup stress.</li>
                        <li><strong>Organized Output Structure:</strong> Components are placed in <code>src/ApexUI</code> — clean, modular, and ready to use.</li>
                    </ul>
                </div>

                {/* Why This Stack */}
                <div className="space-y-8 bg-white/10 p-4 rounded-md border border-purple-400/40">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <FontAwesomeIcon icon={faRocket} className="text-purple-400" /> Why React.js, Tailwind CSS & GSAP/Framer?
                    </h3>
                    <ul className="list-disc pl-5 text-white/80 space-y-4">
                        <li><strong>React.js:</strong> Component-based structure with massive ecosystem support.</li>
                        <li><strong>Tailwind CSS:</strong> Utility-first styling that adapts responsively and keeps your codebase clean.</li>
                        <li><strong>GSAP + Framer Motion:</strong> Native animations, scroll triggers, transitions — with minimal code and high performance.</li>
                    </ul>
                </div>

                {/* Output Example */}
                <div className=" border border-purple-400/40 rounded-md p-6 bg-white/10">
                    <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFolderOpen} className="text-purple-400" /> Output Structure & Usage
                    </h4>
                    <div className=" rounded-lg p-4 text-sm font-mono text-white">
                        <p className="text-purple-300">└── src/</p>
                        <p className="ml-4 text-purple-300">└── ApexUI/</p>
                        <p className="ml-8 text-green-400">└── HyperCard.jsx</p>
                        <br />
                        <p className="text-white mb-2">// Usage Example:</p>
                        <CopyBlock


                            text={`import HyperCard from './ApexUI/HyperCard';

export default function HomePage() {
  return (
    <div>
      <HyperCard />
    </div>
  );
}`}
                            language="jsx"
                            showLineNumbers={false}
                            theme={dracula}
                            scrollHeight="auto"
                            codeBlock
                        />
                    </div>
                </div>
                {/* REQUIREMENTS */}
                <div className=" rounded-md p-6 border border-purple-400/40 bg-white/10">
                    <h3 className="text-2xl font-bold mb-4">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-white/80 text-sm">
                        <li><strong className="text-white">React+Vite:</strong> Latest </li>
                        <li><strong className="text-white">Tailwind CSS:</strong> properly configured</li>
                        <li><strong className="text-white">GSAP:</strong> latest version</li>
                        <li><strong className="text-white">Framer Motion:</strong> for seamless animation support</li>
                        <li><strong className="text-white">Node.js:</strong> version 22+</li>
                        <li><strong className="text-white">Bundler:</strong> Vite (preferred) or CRA</li>
                    </ul>
                </div>


                {/* FAQ Section */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">FAQ</h3>
                    <div className="space-y-2">
                        {[
                            { q: "Does ApexUI work with CRA?", a: "Yes, as long as Tailwind CSS is configured properly." },
                            { q: "How can I customize a component?", a: "All components are editable. Open the generated file in src/ApexUI/ and modify it as needed." },
                            { q: "Does ApexUI support animation out of the box?", a: "Yes. GSAP and Framer Motion are pre-integrated for smooth animations." },
                            { q: "Is ApexUI open source?", a: "Absolutely. It is MIT licensed and open to contributions." }
                        ].map((item, index) => (
                            <div key={index}>
                                <button
                                    className="w-full text-left font-semibold text-purple-300 hover:text-purple-400 transition flex items-center gap-2"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className="w-4 h-4 transition-transform"
                                        ref={(el) => (iconRefs.current[index] = el)}
                                    />
                                    {item.q}
                                </button>
                                <div
                                    className="overflow-hidden"
                                    ref={(el) => (faqRefs.current[index] = el)}
                                    style={{ height: faqOpen === index ? "auto" : 0, opacity: faqOpen === index ? 1 : 0 }}
                                >
                                    <p className="text-white/70 mt-2 ml-6 text-sm">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApexIntro;
