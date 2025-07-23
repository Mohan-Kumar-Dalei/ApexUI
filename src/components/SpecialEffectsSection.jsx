import React from 'react'
import { useState, } from 'react';
import ScrollMarquee from './MainUI/ApexUI/ScrollMarquee/ScrollMarquee.jsx'
import RainBackground from './ui/rain-background/RainBackground.jsx'
import SmartGrid from './ui/SmartGrid/SmartGrid.jsx';
import { Settings, Wifi, Rocket, HardDrive, Lock, Sparkles } from "lucide-react";
import { NavLink } from 'react-router-dom';

const SpecialEffectsSection = () => {

    const [mergeMap, setMergeMap] = useState({ 5: 2 });

    const handleMerge = (source, target) => {
        setMergeMap((prev) => ({ ...prev, [source]: target }));
    };

    const clearMerge = () => setMergeMap({});

    const mergeOptions = [
        { label: "Merge 4:1", source: 4, target: 1 },
        { label: "Merge 5:2", source: 5, target: 2 },
        { label: "Merge 6:3", source: 6, target: 3 },
    ];


    return (
        <section className="special-effects-section-new flex flex-col gap-24 items-center justify-center min-h-[32rem] py-10 px-2 bg-gradient-to-b from-[#060010] to-[#060010] w-full overflow-x-hidden">
            <div className="special-effects-glasscard background-rain w-full max-w-7xl h-[65vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-md bg-[#fff]/10 border border-purple-800">
                {/* Left: Title, Subtitle, Button */}
                <div className="effect-card-left flex flex-col justify-center items-start px-8 py-10 md:w-1/2 w-full gap-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 font-sans tracking-tight">
                        Background Rain With <span className="text-purple-400">Collision</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-300 font-light mb-4">
                        Modern animated white Rain with collision & explosion, pure HTML + GSAP. No React, no gradient, just clean glassy style.
                    </p>
                    <div className="text-center mt-8 *:flex items-center justify-center">
                        <NavLink
                            className="mt-auto relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-black/20 group flex items-center gap-2"
                            to="/components/rain-background"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Try this component
                                <span className="arrow-icon transition-transform duration-200 group-hover:translate-x-2 flex items-center">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </span>
                            </span>
                            <span
                                className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-lg"
                                style={{
                                    background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                                    mixBlendMode: "screen",
                                }}
                            />
                        </NavLink>
                    </div>
                </div>
                {/* Right: White BG + Beams Effect */}
                <div className="effect-card-right relative flex flex-col items-center justify-center md:w-1/2 w-full min-h-[22rem] p-0 bg-gradient-to-b from-[#060010] to-slate-950 border border-white/10">
                    <RainBackground />
                    <div className="beams-collision-bg relative w-full h-full md:h-full flex items-center justify-center overflow-hidden rounded-none ">
                        <div className="flex flex-col md:items-center md:justify-center  w-full h-full py-8">
                            <h3 className=" text-4xl md:text-7xl font-bold text-white mb-2 ml-5">Experience Interactive Rains</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infinity Text Marquee */}
            <div className="special-effects-glasscard w-full max-w-7xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-md bg-white/10 border border-purple-800 my-8">
                {/* Left Side: Heading, Subtitle, Buttons */}
                <div className="flex flex-col justify-center items-start px-8 py-10 md:w-1/2 w-full gap-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-sans tracking-tight">
                        Infinity Text <span className='text-purple-400'>Marquee</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-200 font-light mb-4">
                        Modern infinite marquee synced with LocomotiveScroll velocity. Responsive, smooth, and easy to use in your projects.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <NavLink
                            className="mt-auto relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-black/20 group flex items-center gap-2"
                            to="/components/scroll-marquee"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Try this component
                                <span className="arrow-icon transition-transform duration-200 group-hover:translate-x-2 flex items-center">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </span>
                            </span>
                            <span
                                className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-lg"
                                style={{
                                    background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                                    mixBlendMode: "screen",
                                }}
                            />
                        </NavLink>
                    </div>
                </div>
                {/* Right Side: Two stacked sections with marquee in between, no scroll */}
                <div className="hidden md:flex flex-col flex-1 justify-between items-center md:w-1/2 w-full min-h-[32rem] h-[32rem] bg-gradient-to-b from-[#060010] to-[#020E22] p-0 relative " >
                    {/* Section 1 */}
                    <div className="flex flex-col items-center justify-center w-full min-h-[10rem] ">
                        <span className="text-2xl md:text-4xl font-bold text-purple-300 mb-2" />
                    </div>
                    {/* Marquee appears just below Section One */}
                    <div className="w-full flex items-center justify-center py-4 border-b border-white/10">
                        <div className='w-[100%] h-96 overflow-hidden'>
                            <ScrollMarquee
                                speed={40}
                            />

                        </div>
                    </div>
                </div>
                {/* On small screens, show only the marquee below left side */}
                <div className="md:hidden w-full h-72 flex items-center justify-center py-6 bg-gradient-to-b from-slate-800/60 to-slate-950/80">
                    <ScrollMarquee
                        speed={40}

                    />
                </div>
            </div>
            {/* Smart Grid Cards */}
            {/* Hover Card Section - Modern Glassy Card */}
            <div className="special-effects-glasscard w-full max-w-7xl mx-auto rounded-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden backdrop-blur-md bg-white/10  border border-purple-800 my-8 px-4 py-10">
                <h2 className="text-3xl font-bold text-white mb-2">Smart Grid Playground</h2>
                <p className="text-white/70 text-center max-w-2xl mb-6">
                    Interact with the cards below. Choose any merge combination to see layout behavior.
                </p>

                {/* Merge Presets */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-3 w-full items-center justify-center mb-6">
                    {mergeOptions.map(({ label, source, target }) => (
                        <button
                            key={label}
                            onClick={() => handleMerge(source, target)}
                            className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-black/20 group"
                        >
                            <span className="relative z-10">{label}</span>
                            <span
                                className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-lg"
                                style={{
                                    background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                                    mixBlendMode: "screen",
                                }}
                            />
                        </button>
                    ))}
                    <button
                        onClick={clearMerge}
                        className="relative overflow-hidden px-5 py-2 rounded-lg border border-white/20 text-white bg-red-500/80 hover:bg-red-600 transition group"
                    >
                        <span className="relative z-10">Reset</span>
                        <span className="absolute bottom-0 left-0 w-full h-full bg-red-800/40 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 rounded-lg" />
                    </button>
                </div>

                {/* SmartGrid Display - Large screens only */}
                <div className="hidden lg:flex items-center justify-center w-[90vw] p-4">
                    <SmartGrid
                        mergeMap={mergeMap}
                        cards={[
                            {
                                id: 1,
                                icon: <Settings className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "Control Panel 3000",
                                description: "Adjust settings like a NASA engineer... or just change the theme.",
                                buttonText: "Tweak It",
                            },
                            {
                                id: 2,
                                icon: <Wifi className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "Wi-Fi Wizard",
                                description: "Connect to the internet or summon the spirits of slow loading.",
                                buttonText: "Cast Spell",
                            },
                            {
                                id: 3,
                                icon: <Rocket className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "Launch-o-Matic",
                                description: "Press this and something definitely launches. Hopefully not your chair.",
                                buttonText: "Blast Off",
                            },
                            {
                                id: 4,
                                icon: <HardDrive className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "File Dungeon",
                                description: "Where your downloads live forever... or until you forget them.",
                                buttonText: "Open Vault",
                            },
                            {
                                id: 5,
                                icon: <Lock className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "Security Fortress",
                                description: "Protects your secrets better than your childhood diary. Mostly.",
                                buttonText: "Activate Shield",
                            },
                            {
                                id: 6,
                                icon: <Sparkles className="w-full h-full border border-dashed border-purple-400 rounded-md px-1 py-1 text-white" />,
                                title: "Powered by ApexUI",
                                description: "Crafted with stardust and React. ApexUI makes your UI sparkle like Diwali lights 🎇",
                                buttonText: "Explore Apex",
                            },
                        ]}

                    />
                </div>
                {/* Overlay for small screens */}
                <div className="flex lg:hidden flex-col items-center justify-center w-full min-h-[200px] py-10">
                    <Lock className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Smart Grid Playground</h3>
                    <p className="text-white/70 text-center max-w-xs mb-2">This feature is available only on large screens Sorry buddy the cards are responsive not this playground </p>
                </div>

                <NavLink
                    to="/components/smart-grid-card"
                    className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-black/20 group"
                >
                    <span className="relative z-10">Try This Component</span>
                    <span
                        className="absolute bottom-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 origin-bottom transition-all ease-in-out duration-500 rounded-lg"
                        style={{
                            background: "radial-gradient(circle at bottom, purple, transparent 69%)",
                            mixBlendMode: "screen",
                        }}
                    />
                </NavLink>
            </div>
        </section>
    )
}

export default SpecialEffectsSection
