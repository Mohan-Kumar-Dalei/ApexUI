
import React, { useEffect } from "react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import HoverText from "./MainUI/ApexUI/HoverText/HoverText.jsx";
import GlassCardStack from "./MainUI/ApexUI/GlassCardStack/GlassCardStack.jsx";
import GlassProfile from "./MainUI/ApexUI/GlassProfile/GlassProfile.jsx";

const ComponentShowcase = () => {
    useEffect(() => {
        const indicator = document.getElementById("gsap-indicator");
        function moveWithGSAP(el) {
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();
            const left = rect.left - parentRect.left;
            const width = rect.width;
            gsap.to(indicator, {
                x: left,
                width: width,
                duration: 0.5,
                ease: "elastic.out(1, 0.6)"
            });
            document.querySelectorAll('.nav-item').forEach(btn => {
                btn.classList.remove('text-white');
                btn.classList.add('text-gray-400');
            });
            el.classList.add('text-white');
            el.classList.remove('text-gray-400');
        }
        // Initial setup
        const first = document.querySelector(".nav-item");
        if (first) moveWithGSAP(first);
        // Attach click handler
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.onclick = () => moveWithGSAP(btn);
        });



        // Profile Card parallax effect
        const profileCards = [
            ...document.querySelectorAll('.profile-card'),
            ...document.querySelectorAll('#profileCard')
        ];

        profileCards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.style.perspective = '600px';
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 12; // max 12deg
                const rotateX = ((centerY - y) / centerY) * 12;
                gsap.to(card, {
                    rotateY,
                    rotateX,
                    scale: 1.06,
                    transformPerspective: 600,
                    transformOrigin: 'center',
                    ease: 'power2.out',
                    duration: 0.35
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });
        });
    }, []);

    return (
        <section className="component-showcase bg-gradient-to-b from-[#060010] to-[#020E22] py-3 px-4 w-full h-full z-30 overflow-visible">
            <div className="max-w-6xl mx-auto w-full gsap-reveal">
                <div className="relative w-full h-full overflow-hidden">
                    {/* 🔦 Top Beam Source Bar */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-80 h-2 bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-300 rounded-md shadow-[0_0_10px_#fff,0_0_20px_#4f46e5,0_0_30px_#06b6d4] animate-pulse hidden md:block" style={{ animation: 'pulse 2s infinite' }}>
                        {/* 🔦 Beam from Bar using pseudo-element */}
                        <div
                            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[400px] h-[600px] pointer-events-none z-0"
                            style={{
                                background: "linear-gradient(to bottom, rgba(111, 93, 245, 0.7), rgba(7, 7, 7, 0.3), transparent)",
                                filter: "blur(100px)",
                                opacity: 1.2,
                                animation: "glow 10s infinite alternate"
                            }}
                        ></div>
                    </div>

                    {/* 💬 Foreground Content */}
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-white text-center px-4 mt-16 lg:mt-20">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore the Apex Components</h2>
                        <p className="text-gray-400 max-w-xl text-sm">
                            Beautifully crafted UI blocks built with Tailwind, GSAP, and smooth scroll — ready to drop into your next project.
                        </p>
                    </div>

                    {/* 🌐 Spotlight Container Card */}
                    <div className="relative z-10 max-w-7xl mx-auto md:bg-[#643579]/20 border border-purple-800 backdrop-blur-xl shadow-2xl rounded-2xl p-8 max-md:p-0 max-md:border-0 mt-16" data-scroll data-scroll-speed="1">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 max-md:mb-20 max-md:justify-center">
                            <i className="fa-solid fa-layer-group text-purple-400 animate-pulse"></i> Apex UI Glass Components
                        </h2>

                        {/* 📦 Inner Component Cards Grid */}
                        <div className="relative z-10 max-w-7xl mx-auto grid gap-10 sm:grid-cols-1 lg:grid-cols-2 items-center justify-center">
                            {/* 🌐 Component Card: Navbar */}
                            <div className="border border-white/10 backdrop-blur-md max-md:bg-white/5 rounded-2xl p-8 shadow-xl transition hover:scale-[1.015] hover:shadow-2xl duration-500">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
                                    <i className="fa-solid fa-compass text-purple-400 group-hover:scale-110 transition"></i>
                                    Navbar with Slide Indicator
                                </h2>
                                {/* 🧭 Nav Bar */}
                                <div className="relative w-max mx-auto bg-white/10 backdrop-blur-md rounded-full px-2 py-2 shadow-md overflow-hidden">
                                    {/* Indicator */}
                                    <div id="gsap-indicator" className="absolute top-1.5 px-3 py-5 bg-purple-600 rounded-full z-0"></div>
                                    {/* Nav Items */}
                                    <div className="relative flex gap-2 z-10">
                                        <button className="nav-item px-5 py-2 text-sm font-medium text-white relative z-10">Home</button>
                                        <button className="nav-item px-5 py-2 text-sm font-medium text-white relative z-10">Docs</button>
                                        <button className="nav-item px-5 py-2 text-sm font-medium text-white relative z-10">UI Kit</button>
                                        <button className="nav-item px-5 py-2 text-sm font-medium text-white relative z-10">Contact</button>
                                    </div>
                                </div>
                                {/* CTA */}
                                <div className="text-center mt-8">
                                    <NavLink
                                        to="/components/glass-navbar"
                                        className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-slate-900/20 group"
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
                            </div>

                            {/* ✨ Component Card: Hover Text */}
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl transition hover:scale-[1.015] hover:shadow-2xl duration-500">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white justify-center">
                                    <i className="fa-solid fa-wand-magic-sparkles text-blue-300 group-hover:scale-110 transition"></i>
                                    Text Hover Interaction
                                </h2>
                                <HoverText text="Hover Me!" className="max-sm:translate-x-10 md:translate-x-36 lg:translate-x-20" />
                                <div className="mt-8 flex justify-center">
                                    <NavLink
                                        to="/components/hover-text"
                                        className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-slate-900/20 group"
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
                            </div>
                        </div>

                        {/* 🌟 Smooth CardStack +  */}
                        <section className="relative py-16 px-4 overflow-hidden text-white">
                            {/* 🎯 Glassy Background */}
                            <div className="absolute inset-0 z-0 hidden md:block">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,#dadada_0%,transparent_60%)] opacity-30"></div>
                            </div>
                            <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl ">
                                {/* 🌐 Animated Glass Form */}
                                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col justify-center hover:scale-[1.015] transition-all duration-500 w-full mx-0 sm:mx-auto sm:max-w-lg">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white justify-center">
                                        <i className="fa-solid fa-id-card-clip text-green-300 group-hover:scale-110 transition"></i>
                                        Glass Card Stack
                                    </h2>
                                    <GlassCardStack />
                                    <div className="mt-6 text-center">
                                        <NavLink
                                            to="/components/glass-card-stack"
                                            className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-slate-900/20 group"
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
                                </div>
                                {/* 👤 Profile Card with Parallax */}
                                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center items-center hover:scale-[1.02] transition duration-500 w-full mx-0 sm:mx-auto sm:max-w-lg">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.25v-1.5A2.75 2.75 0 017.25 15h9.5a2.75 2.75 0 012.75 2.75v1.5" />
                                        </svg>
                                        Glass Profile Card
                                    </h2>
                                    <GlassProfile />
                                    <div className="mt-6 text-center">
                                        <NavLink
                                            to="/components/glass-profile"
                                            className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-slate-900/20 group"
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
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-center w-full mt-8">
                            <NavLink
                                to="/components/glass-navbar"
                                className="relative overflow-hidden px-5 py-2 rounded-lg border border-purple-400/60 text-white transition hover:text-white bg-slate-900/20 group"
                            >
                                <span className="relative z-10">More Components</span>
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
                </div>
            </div>
        </section>

    );
};

export default ComponentShowcase;
