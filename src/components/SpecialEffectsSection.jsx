/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { TextPlugin } from 'gsap/TextPlugin';
import { NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Settings, Wifi, Rocket, HardDrive, Lock, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RainBackground from './MainUI/ApexUI-Kit/RainBackground/RainBackground.jsx';
import ScrollMarquee from './MainUI/ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';
import SmartGrid from './MainUI/ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';
import SmokeBackground from './MainUI/ApexUI-Kit/SmokeBackground/SmokeBackground.jsx'
// GSAP plugins ko register karna
gsap.registerPlugin(TextPlugin);

// --- Keyframes and Styled Component for the animated grid ---
const moveGrid = keyframes`
  from {
    background-position-y: 0;
  }
  to {
    background-position-y: -4rem; /* Match the background-size */
  }
`;

let movingLine1 = 'var(--color-SpecialComponent-movingGrid-line1)';
let movingLine2 = 'var(--color-SpecialComponent-movingGrid-line2)';
const AnimatedGridPanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  position: relative;
  
  /* The hi-tech grid background */
 /* bg-slate-950 */
 background: var(--color-SpecialComponent-movingGrid-bg);
  background-image: 
    linear-gradient(${movingLine1} 1px, transparent 1px),
    linear-gradient(90deg, ${movingLine2} 1px, transparent 1px);
  background-size: 4rem 4rem; /* 64px grid squares */
  
  /* The animation */
  animation: ${moveGrid} 3s linear infinite;
`;

// Button with a "spotlight" hover effect
const StyledFancyLink = styled(NavLink)`
  position: relative;
  z-index: 1;
  background-color: var(--color-SpecialComponent-btn-bg); /* Dark background for the button */
  border: 2px solid var(--color-SpecialComponent-btn-border); /* Lime-400 */
  border-radius: 0.5rem; /* 8px */
  color: var(--color-SpecialComponent-text); /* Lime-400 */
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1em 2.1em;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  font-size: 14px;
  overflow: hidden;
  transition: color 0.4s ease-in-out, border-color 0.4s ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(163, 230, 53, 0.4), transparent 40%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  .text {
    position: relative;
    z-index: 2;
  }

  &:hover {
    color: var(--color-SpecialComponent-text-hover); /* Lighter lime */
    border-color: var(--color-SpecialComponent-text-hover-border);
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const FancyButton = ({ to, children }) => {
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
        buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <StyledFancyLink ref={buttonRef} to={to} onMouseMove={handleMouseMove}>
            <span className="text">{children}</span>
        </StyledFancyLink>
    );
}


// --- Animated Background Shapes Component ---
const AnimatedShapes = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
    };
    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
    };
    return (
        <motion.div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="absolute -top-20 -left-20 w-80 h-80 bg-lime-400/5 rounded-full animate-pulse-slow" variants={itemVariants} />
            <motion.div className="absolute top-1/4 -right-24 w-60 h-60 bg-emerald-500/5 rounded-2xl animate-spin-slow" variants={itemVariants} />
            <motion.div className="absolute bottom-10 left-1/3 w-40 h-40 bg-sky-500/5 rounded-full animate-pulse-slow" variants={itemVariants} />
            <motion.div className="absolute -bottom-20 right-1/4 w-72 h-40 bg-teal-500/5 rounded-lg animate-spin-slow-reverse" variants={itemVariants} />
        </motion.div>
    );
};

// --- Demo content for Rain Background ---
const RainDemoContent = ({ isVisible }) => (
    <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center gap-12 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full max-w-sm bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 flex items-center justify-between">
            <span className="text-white font-bold">ApexUI</span>
            <div className="flex gap-4 text-gray-400">
                <span>Home</span>
                <span>Docs</span>
            </div>
        </div>
        <div className="text-center">
            <h3 className="text-3xl font-bold text-white">Smoke Background Demo</h3>
            <div className="flex gap-4 mt-4 items-center justify-center">
                <button className="px-4 py-2 bg-[var(--color-SpecialComponent-btn-Demo-bg)] text-[var(--color-SpecialComponent-btn-Demo-text)] rounded-lg font-semibold">Get Started</button>
                <button className="px-4 py-2 bg-gray-700/80 text-white rounded-lg font-semibold">Learn More</button>
            </div>
        </div>
    </div>
);

// --- Toggle Switch Component ---
const ToggleSwitch = ({ isToggled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative w-14 h-8 flex items-center rounded-lg p-1 cursor-pointer transition-colors duration-300 ${isToggled ? 'bg-[var(--color-SpecialComponent-btnDemo-toggle)]' : 'bg-gray-700'}`}
    >
        <span className="absolute left-2 text-xs text-white transition-opacity duration-200" style={{ opacity: isToggled ? 0 : 1 }}></span>
        <span className="absolute right-2 text-xs text-black transition-opacity duration-200" style={{ opacity: isToggled ? 1 : 0 }}></span>
        <motion.div
            className="w-6 h-6 bg-[var(--color-SpecialComponent-btnDemo-toggle-bg)] rounded-lg shadow-md"
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            initial={false}
            animate={{ x: isToggled ? 32 : 0 }}
        />
    </button>
);


const SpecialEffectsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mergeMap, setMergeMap] = useState({ 5: 2 });
    const [showRainDemo, setShowRainDemo] = useState(true);
    const sectionRef = useRef(null);
    const displayRef = useRef(null);
    const infoContainerRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabsRef = useRef(null);

    const showcaseItems = [
        {
            title: "Smoke Background",
            description: "A mesmerizing smoke effect that adds depth to your UI.",
            component: <SmokeBackground />,
            link: "/components/smoke-background"
        },
        {
            title: "Infinity Marquee",
            description: "A smooth, infinite marquee that syncs with scroll velocity.",
            component: <ScrollMarquee />,
            link: "/components/scroll-marquee"
        },
        {
            title: "Smart Grid",
            description: "An interactive grid where you can merge cells dynamically.",
            component: <SmartGrid
                mergeMap={mergeMap}
                cards={[
                    { id: 1, icon: <Settings />, title: "Control Panel", description: "Adjust settings.", buttonText: "Tweak It" },
                    { id: 2, icon: <Wifi />, title: "Wi-Fi Wizard", description: "Connect to the internet.", buttonText: "Cast Spell" },
                    { id: 3, icon: <Rocket />, title: "Launch-o-Matic", description: "Press this to launch.", buttonText: "Blast Off" },
                    { id: 4, icon: <HardDrive />, title: "File Dungeon", description: "Where downloads live.", buttonText: "Open Vault" },
                    { id: 5, icon: <Lock />, title: "Security Fortress", description: "Protects your secrets.", buttonText: "Activate Shield" },
                    { id: 6, icon: <Sparkles />, title: "Powered by ApexUI", description: "Crafted with stardust.", buttonText: "Explore Apex" },
                ]}
            />,
            link: "/components/smart-grid-card"
        },
    ];

    // Find the index of the Smart Grid card for conditional rendering
    const smartGridIndex = showcaseItems.findIndex(item => item.title && item.title.toLowerCase().includes('smart grid'));

    const handleMerge = (source, target) => setMergeMap((prev) => ({ ...prev, [source]: target }));
    const clearMerge = () => setMergeMap({});
    const mergeOptions = [
        { label: "Merge 4:1", source: 4, target: 1 },
        { label: "Merge 5:2", source: 5, target: 2 },
        { label: "Merge 6:3", source: 6, target: 3 },
    ];

    useLayoutEffect(() => {
        const updateIndicator = () => {
            if (!tabsRef.current || !indicatorRef.current) return;
            const tabs = Array.from(tabsRef.current.querySelectorAll('button'));
            if (tabs.length > activeIndex) {
                const activeTab = tabs[activeIndex];
                const parentRect = tabsRef.current.getBoundingClientRect();
                const rect = activeTab.getBoundingClientRect();
                const top = rect.top - parentRect.top;
                const height = rect.height;

                gsap.to(indicatorRef.current, { y: top, height: height, duration: 0.2, ease: "power3.inOut" });
            }
        };
        const timeoutId = setTimeout(updateIndicator, 100);
        window.addEventListener('resize', updateIndicator);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateIndicator);
        };
    }, [activeIndex]);

    useEffect(() => {
        if (displayRef.current) {
            gsap.timeline()
                .to(displayRef.current, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
                .fromTo(displayRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
        }
        if (infoContainerRef.current) {
            gsap.timeline()
                .to(infoContainerRef.current, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
                .fromTo(infoContainerRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
        }
    }, [activeIndex]);

    return (
        <section ref={sectionRef} className="special-effects-section-new bg-[var(--color-SpecialComponent-bg)] py-24 px-4 w-full overflow-hidden relative">
            <AnimatedShapes />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-SpecialComponent-text)]">Discover Our Special Effects</h2>
                    <p className="text-lg text-[var(--color-component-text-subheading)] mt-4 max-w-2xl mx-auto">
                        A curated collection of animated and interactive UI components, ready to bring your projects to life.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-2 min-h-[700px]">
                    <div ref={tabsRef} className="relative w-full lg:w-96 bg-[var(--color-SpecialComponent-movingGrid-Side-bg)] rounded-2xl p-4 flex flex-col justify-start" style={{ clipPath: 'polygon(0 0, calc(100% - 50px) 0, 100% 50px, 100% 100%, 50px 100%, 0 calc(100% - 50px))' }}>
                        <div ref={indicatorRef} className="absolute left-0 -top-1 bg-[var(--color-SpecialComponent-side-active-bg)]/10 rounded-lg border-2 border-[var(--color-SpecialComponent-side-active-border)]/50" />
                        {showcaseItems.map((item, index) => (
                            <button key={index} onClick={() => setActiveIndex(index)} className={`w-full px-6 py-4 text-lg font-semibold text-left transition-colors duration-300 z-10 rounded-lg ${activeIndex === index ? 'text-[var(--color-SpecialComponent-side-active-text)]' : 'text-[--color-SpecialComponent-side-text] hover:text-[var(--color-SpecialComponent-side-hover)]'}`}>
                                {item.title}
                            </button>
                        ))}
                        <div ref={infoContainerRef} className="mt-auto p-4 border-t border-[var(--color-SpecialComponent-border)]">
                            <h3 className="text-2xl font-bold text-[var(--color-SpecialComponent-text)] mb-2">{showcaseItems[activeIndex].title}</h3>
                            <p className="text-[var(--color-SpecialComponent-text-subheading)] mb-6 h-24">{showcaseItems[activeIndex].description}</p>
                            {activeIndex === 2 && (
                                <div className="mb-6">
                                    <h4 className="text-[var(--color-SpecialComponent-text)] font-semibold mb-3">Grid Controls</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {mergeOptions.map(({ label, source, target }) => (
                                            <button key={label} onClick={() => handleMerge(source, target)} className="px-3 py-1 rounded-md border border-[var(--color-SpecialComponent-btn-border)]/60 text-[var(--color-SpecialComponent-text2)] text-sm transition hover:bg-[var(--color-SpecialComponent-side-Btn-hover)]/50">{label}</button>
                                        ))}
                                        <button onClick={clearMerge} className="px-3 py-1 rounded-md bg-red-500/80 text-white text-sm transition hover:bg-red-600">Reset</button>
                                    </div>
                                </div>
                            )}
                            <FancyButton to={showcaseItems[activeIndex].link}>Try This Component</FancyButton>
                        </div>
                    </div>
                    {/* Right Panel */}
                    <div className="relative flex-grow h-[700px] w-full lg:max-w-[65vw] overflow-hidden">
                        <div className=" absolute inset-0  rounded-md transition-all duration-500" />
                        <div className="h-full rounded-lg overflow-hidden" style={{ clipPath: 'polygon(50px 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 50px)' }}>
                            <AnimatedGridPanel>
                                <div ref={displayRef} className="w-full h-full flex items-center justify-center">
                                    {/* Only for SmartGridCard: hide preview on mobile/tablet, show message. Others: show always */}
                                    {activeIndex === smartGridIndex ? (
                                        <>
                                            <div className="hidden lg:block w-full h-full">
                                                {showcaseItems[activeIndex].component}
                                            </div>
                                            <div className="lg:hidden absolute inset-0 flex items-center justify-center z-30">
                                                <div className="bg-[var(--color-SpecialComponent-bg)] border border-[var(--color-SpecialComponent-side-active-border)] text-[var(--color-SpecialComponent-text)] px-6 py-4 rounded-xl text-center text-base font-semibold shadow-xl">
                                                    This feature is shown only on large screens.
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        activeIndex === showcaseItems.findIndex(item => item.title && item.title.toLowerCase().includes('marquee')) ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                {showcaseItems[activeIndex].component}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full">
                                                {showcaseItems[activeIndex].component}
                                            </div>
                                        )
                                    )}
                                    {activeIndex === 0 && <RainDemoContent isVisible={showRainDemo} />}
                                </div>
                            </AnimatedGridPanel>
                        </div>
                        {activeIndex === 0 && (
                            <div className="absolute bottom-6 right-6 z-20">
                                <ToggleSwitch isToggled={showRainDemo} onToggle={() => setShowRainDemo(!showRainDemo)} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialEffectsSection;
