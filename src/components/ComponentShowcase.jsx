/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "framer-motion";

// GSAP plugins ko register karna
gsap.registerPlugin(TextPlugin, ScrollTrigger);

import HoverText from "./MainUI/ApexUI-Kit/HoverText/HoverText.jsx";
import GlassCardStack from "./MainUI/ApexUI-Kit/GlassCardStack/GlassCardStack.jsx";
import Profile from "./MainUI/ApexUI-Kit/FlipProfile/FlipProfile.jsx";
import Navbar from "./MainUI/ApexUI-Kit/NavMenu/NavMenu.jsx";
const Cards = [
    {
        title: "ApexUI Glass Card Stack",
        subtitle: "Modern glassmorphic stack with animation",
        desc: "Beautiful glassmorphic UI. Pause on hover, auto-cycling.",
        color: "from-blue-500/60 to-blue-300/30",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
        link: "https://github.com/sheryians/apexui",
        github: "https://github.com/sheryians/apexui",
    },
    {
        title: "React Modern Card",
        subtitle: "Responsive, animated, and clean",
        desc: "Modern, responsive, and animated. Stacked with smooth transitions.",
        color: "from-pink-500/60 to-pink-300/30",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80",
        link: "https://react.dev/",
        github: "https://github.com/facebook/react",
    },
    {
        title: "UI Stack Demo",
        subtitle: "Stacked cards with effects",
        desc: "Stacked with smooth transitions. Glassmorphic and beautiful.",
        color: "from-green-500/60 to-green-300/30",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
        link: "https://ui.sheryians.com/",
        github: "https://github.com/sheryians/ui-demo",
    },
    {
        title: "Pause & Cycle",
        subtitle: "Auto-cycling, pause on hover",
        desc: "Pause on hover, auto-cycling. Try it now!",
        color: "from-yellow-500/60 to-yellow-300/30",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
        link: "https://github.com/sheryians",
        github: "https://github.com/sheryians",
    },
];


// --- Keyframes and Styled Component for the animated grid ---
const moveGrid = keyframes`
  from {
    background-position-y: 0;
  }
  to {
    background-position-y: -4rem; /* Match the background-size */
  }
`;
let Line1 = 'var(--color-component-movingGrid-line1)';
let Line2 = 'var(--color-component-movingGrid-line2)';
const AnimatedGridPanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  
  /* The hi-tech grid background */
  background-color: var(--color-component-movingGrid-bg); /* bg-slate-950 */
  background-image: 
    linear-gradient(${Line1} 1px, transparent 1px),
    linear-gradient(90deg, ${Line2} 1px, transparent 1px);
  background-size: 4rem 4rem; /* 64px grid squares */
  
  /* The animation */
  animation: ${moveGrid} 3s linear infinite;
`;

// --- NEW: Animated Background Shapes Component ---
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


// --- Main Component ---
const ComponentShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const displayContentRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabsRef = useRef(null);

    const showcaseItems = [
        { name: "Navbar", component: <Navbar indicatorAnimation="spring" /> },
        { name: "Hover Text", component: <HoverText text="Hover Me!" /> },
        { name: "Card Stack", component: <GlassCardStack cards={Cards} /> },
        { name: "Profile Card", component: <Profile /> },
    ];

    // Tab indicator animation
    useLayoutEffect(() => {
        const updateIndicator = () => {
            if (!tabsRef.current || !indicatorRef.current) return;
            const tabs = Array.from(tabsRef.current.querySelectorAll('button'));
            if (tabs.length > activeIndex) {
                const activeTab = tabs[activeIndex];
                const parentRect = tabsRef.current.getBoundingClientRect();
                const rect = activeTab.getBoundingClientRect();

                const isHorizontal = window.innerWidth < 1024;

                gsap.to(indicatorRef.current, {
                    x: isHorizontal ? rect.left - parentRect.left : 0,
                    y: isHorizontal ? 0 : rect.top - parentRect.top,
                    width: isHorizontal ? rect.width : '100%',
                    height: isHorizontal ? '100%' : rect.height,
                    duration: 0.3,
                    ease: "power3.inOut"
                });
            }
        };

        const timeoutId = setTimeout(updateIndicator, 100);
        window.addEventListener('resize', updateIndicator);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateIndicator);
        };
    }, [activeIndex]);

    // Component switch animation
    useEffect(() => {
        if (displayContentRef.current) {
            gsap.timeline()
                .to(displayContentRef.current, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
                .fromTo(displayContentRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
        }
    }, [activeIndex]);

    const handleTabClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <section ref={sectionRef} className="component-showcase bg-[var(--color-component-bg)] py-24 px-4 w-full overflow-hidden relative">
            <AnimatedShapes />
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-component-text-heading)]">Explore the Apex Components</h2>
                    <p className="text-lg text-[var(--color-component-text-subheading)] mt-4 max-w-2xl mx-auto">
                        A showcase of our most popular components. Click to preview and see them in action.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 min-h-[600px]">
                    {/* Left Navigation Panel */}
                    <div ref={tabsRef} className="relative w-full lg:w-1/4 bg-[var(--color-component-movingGrid-Side-bg)] rounded p-4 flex flex-row lg:flex-col justify-center" style={{ clipPath: 'polygon(0 0, calc(100% - 50px) 0, 100% 50px, 100% 100%, 50px 100%, 0 calc(100% - 50px))' }}>
                        <div ref={indicatorRef} className=" absolute top-0 left-0 bg-[var(--color-component-side-active-bg)]/10 rounded-lg border-2 border-[var(--color-component-side-active-border)]/50 " />
                        <div className="flex-1 w-full flex flex-row lg:flex-col  items-start justify-center">
                            {showcaseItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTabClick(index)}
                                    className={
                                        `w-full px-3 py-2 sm:px-6 sm:py-4 text-base text-center sm:text-lg font-semibold lg:text-left transition-colors duration-300 z-10 rounded-lg break-words sm:whitespace-nowrap ${activeIndex === index ? 'text-[var(--color-component-side-active-text)]' : 'text-[var(--color-component-side-text)] hover:text-[var(--color-component-side-hover)]'}`
                                    }
                                    style={{ wordBreak: 'break-word', whiteSpace: 'nowrap' }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Display Panel */}
                    <div className="relative w-full h-[600px]  lg:w-3/4 group">
                        <div className="absolute inset-0" />
                        <div className="w-full h-full rounded-md overflow-hidden">
                            <AnimatedGridPanel style={{ clipPath: 'polygon(50px 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 50px)' }}>
                                <div ref={displayContentRef} className="w-full h-full flex items-center justify-center">
                                    {showcaseItems[activeIndex].component}
                                </div>
                            </AnimatedGridPanel>
                        </div>
                    </div>

                </div>
                <div className="w-full flex justify-center items-center translate-y-5 ">
                    <NavLink to="/components" className="lg:w-auto px-4 py-2 rounded-lg bg-[var(--color-component-side-active-bg2)] text-[var(--color-component-side-active-text2)] font-semibold border border-[var(--color-component-side-active-border)]/40 hover:bg-[var(--color-component-side-active-bg)]/50 transition-colors duration-300 shadow-lg cursor-pointer z-10">
                        More Components
                    </NavLink>
                </div>
            </div>
        </section>
    );
};

export default ComponentShowcase;
