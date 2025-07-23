/* eslint-disable no-unused-vars */
import { React, useState, useEffect, useRef } from 'react';
import AnimatedTooltipDemo from "./ui/AnimatedTootip/animated-tooltip-demo.jsx";
import GlareCardDemo from "./ui/GlareCard.jsx/glare-card-demo.jsx";
import gsap from 'gsap';
import PointerFollower from "./ui/PointerFollower/pointer-follower.jsx";
import WaterDropTextReveal from "./ui/WaterDropReavel/water-drop-text-reveal.jsx";
import { motion } from 'framer-motion';
import LightningCard from "./ui/LightingHyperSpace/LightningCard.jsx";
import { NavLink } from 'react-router-dom';

const waveVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.04,
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    }),
};

const rightPanelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.18,
            type: 'spring',
            stiffness: 120,
            damping: 18,
        },
    }),
};

const Home = () => {
    const [copied, setCopied] = useState(false);
    const [autoAnimActive, setAutoAnimActive] = useState(false); // NEW: control GSAP float

    const showRightPanel = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;

    const handleCopy = () => {
        navigator.clipboard.writeText("npx apex-ui@latest init");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    // Inside your component
    const floatRefs = useRef([]);

    useEffect(() => {
        // Hold GSAP float for 3s after mount
        setAutoAnimActive(false);
        const timer = setTimeout(() => {
            setAutoAnimActive(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!autoAnimActive) return; // Only run GSAP after reveal
        floatRefs.current.forEach((ref, i) => {
            if (ref) {
                gsap.to(ref, {
                    y: -10,
                    duration: 2.8,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.25,
                });
            }
        });
    }, [autoAnimActive]);


    return (

        <section id="hero" className="relative w-full overflow-hidden text-white bg-gradient-to-b from-[#060010] to-[#020E22] transition-colors duration-300 min-h-screen lg:h-[120vh] flex items-center justify-center">
            {/* Background Image */}
            <div className="pointer-events-none absolute inset-0 w-full h-full z-0">
                <svg className="hidden lg:block" id="neon-hero-bg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1440 560" style={{ opacity: 0.09, filter: 'none', pointerEvents: 'none', transform: 'translateZ(0)', willChange: 'transform' }}>
                    <path d="M129.89 42.55L194.85 80.05L194.85 155.05L129.89 192.55L64.94 155.05L64.94 80.05zM64.94 380.05L129.89 417.55L129.89 492.55L64.94 530.05L-0.01 492.55L-0.01 417.55zM129.89 492.55L194.85 530.05L194.85 605.05L129.89 642.55L64.94 605.05L64.94 530.05zM194.85 155.05L259.8 192.55L259.8 267.55L194.85 305.05L129.89 267.55L129.89 192.55z" stroke="#a855f7" strokeWidth="2" fill="none" />
                </svg>
                <svg className="block lg:hidden absolute inset-0 w-full h-full" id="neon-hero-bg-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="100%" height="100%" style={{ opacity: 0.18, filter: 'none', pointerEvents: 'none', transform: 'translateZ(0)', willChange: 'transform' }} preserveAspectRatio="none">
                    <defs>
                        <radialGradient id="hexGlow2" cx="50%" cy="50%" r="80%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="hexLine" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <g>
                        <path d="M195 80L255 110L255 170L195 200L135 170L135 110Z" stroke="url(#hexLine)" strokeWidth="3.5" fill="url(#hexGlow2)" />
                        <path d="M80 200L120 220L120 260L80 280L40 260L40 220Z" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                        <path d="M300 300L340 320L340 360L300 380L260 360L260 320Z" stroke="#a855f7" strokeWidth="2.5" fill="none" />
                        <path d="M60 600L80 610L80 630L60 640L40 630L40 610Z" stroke="url(#hexLine)" strokeWidth="1.5" fill="url(#hexGlow2)" />
                        <path d="M320 700L340 710L340 730L320 740L300 730L300 710Z" stroke="url(#hexLine)" strokeWidth="1.5" fill="url(#hexGlow2)" />
                        <line x1="60" y1="400" x2="330" y2="400" stroke="#a855f7" strokeWidth="1.2" opacity="0.18" />
                        <line x1="100" y1="500" x2="290" y2="600" stroke="#38bdf8" strokeWidth="1.2" opacity="0.18" />
                    </g>
                </svg>
            </div>

            <div className="max-w-screen-2xl w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6 items-center justify-center px-2 sm:px-4 md:px-10 lg:px-20 py-6 lg:py-10">
                <div className="w-full h-full flex flex-col justify-center items-center xl:items-start text-center xl:text-left space-y-6">
                    <motion.h1 className="font-bold leading-tight text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl" initial="hidden" animate="visible">
                        {Array.from('Apex ').map((char, i) => (
                            <motion.span key={i} custom={i} variants={waveVariants} initial="hidden" animate="visible" style={{ display: 'inline-block' }}>{char}</motion.span>
                        ))}
                        <motion.span style={{ color: '#a855f7' }} custom={6} variants={waveVariants}>UI</motion.span>
                        <motion.span custom={8} variants={waveVariants}> Library</motion.span>
                        <motion.span className="block text-lg sm:text-xl md:text-2xl text-gray-300 font-light mt-2" custom={10} variants={waveVariants}>Ready-to-use Components & Effects</motion.span>
                    </motion.h1>
                    <motion.p className="text-sm sm:text-base text-gray-400 max-w-xl font-light" initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.5 }}>
                        Apex UI is a modern, flexible UI library.<br />
                        <span className="text-purple-400 font-semibold">Copy-paste ready for React, HTML + Tailwind, <span style={{ color: '#a855f7' }}>and CLI!</span></span><br />
                        <span className="block mt-1">Find unique text, button, and card effects for your projects. Just copy and enjoy stunning UI—no hassle.</span>
                    </motion.p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <NavLink to="/components/docs/getting-started/introduction" className="relative overflow-hidden px-6 py-3 rounded-lg border border-purple-400/60 text-white bg-black/20 group shadow-sm hover:shadow-purple-400/20 duration-300">
                            <span className="relative z-10">Get Started</span>
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" style={{ background: "radial-gradient(circle at bottom, purple, transparent 69%)", mixBlendMode: "screen" }} />
                        </NavLink>
                        <div className="flex items-center gap-3 bg-[#1a1027] text-white font-mono text-xs px-4 py-3 rounded-xl border border-[#a855f7] tracking-wide shadow-sm">
                            <span className="truncate">npx apex-ui@latest init</span>
                            <button onClick={handleCopy} className="p-1 rounded-full hover:bg-[#a855f7]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                            </button>
                            <span className={`text-[#a855f7] text-[0.7rem] font-medium ${copied ? "opacity-100" : "opacity-0"}`}>Copied!</span>
                        </div>
                    </div>
                </div>

                {showRightPanel && (
                    <div className="columns-2 gap-1 space-y-2 mb-6">
                        <motion.div
                            ref={(el) => (floatRefs.current[0] = el)}
                            className="rounded-xl shadow-lg h-32 bg-slate-600/60 flex items-center justify-center"
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={rightPanelVariants}
                        >
                            <AnimatedTooltipDemo />
                        </motion.div>

                        <motion.div
                            ref={(el) => (floatRefs.current[1] = el)}
                            className="rounded-2xl shadow-xl h-40 w-full overflow-hidden relative group"
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={rightPanelVariants}
                        >
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User"
                                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-700/60 to-indigo-900/60 z-10" />
                            <PointerFollower offsetY={10} />
                        </motion.div>

                        <motion.div
                            ref={(el) => (floatRefs.current[2] = el)}
                            className="h-full"
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={rightPanelVariants}
                        >
                            <WaterDropTextReveal />
                        </motion.div>

                        <motion.div
                            ref={(el) => (floatRefs.current[3] = el)}
                            className="w-full"
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={rightPanelVariants}
                        >
                            <LightningCard
                                width="w-[25vw] lg:w-full"
                                height="h-[140px]"
                                starColor="#ffffff"
                                starCount={180}
                                baseSpeed={0.8}
                                warpSpeed={12}
                                circlePosition="bottom"
                                text="Apex UI Is Lightning"
                                LastText="Speed"
                                LastTextColor="purple"
                                SubText="Experience the power of lightning-fast animations with our Highlight Lightning component. Perfect for"
                            />
                        </motion.div>

                        <motion.div
                            ref={(el) => (floatRefs.current[4] = el)}
                            className="w-full flex justify-center"
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={rightPanelVariants}
                        >
                            <div className="w-full max-w-xs">
                                <GlareCardDemo />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;
