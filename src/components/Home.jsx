/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import GlareCard from "./MainUI/ApexUI-Kit/GlareCard/GlareCard"
import HyperCard from "./MainUI/ApexUI-Kit/HyperCard/HyperCard"
import PointerFollower from "./MainUI/ApexUI-Kit/PointerFollower/PointerFollower";
import ToolTip from "./MainUI/ApexUI-Kit/ToolTip/ToolTip"


const people = [
    { id: 1, name: "Captain America", designation: "Leader of the Avengers", image: "/assets/captainamerica.png" },
    { id: 2, name: "Doctor Strange", designation: "Sorcerer Supreme", image: "/assets/doctorStrange.png" },
    { id: 3, name: "Iron Man", designation: "Leader Of Stark Industries", image: "/assets/ironman.png" },
    { id: 4, name: "HULK", designation: "Scientist", image: "/assets/hulk.png" },
    { id: 5, name: "Spider-Man", designation: "Friendly Neighborhood Spider-Man", image: "/assets/spiderman.png" },
    { id: 6, name: "Thanos", designation: "The Mad Titan", image: "/assets/thanos.png" },
];
// Button with a "spotlight" hover effect
let spotlight = 'var(--color-spotlight)';
const StyledFancyLink = styled(NavLink)`
  position: relative;
  z-index: 1;
  background-color: var(--color-btn-background); /* Dark background for the button */
  border: 2px solid var(--color-btn-border); /* Lime-400 */
  border-radius: 0.5rem; /* 8px */
  color: var(--color-hero-btn-text); /* Lime-400 */
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
      background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${spotlight}, transparent 40%);
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
    color: var(--color-btn-hover-text); /* Lighter lime */
    border-color: var(--color-btn-hover-color);
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

// --- SVG Icons for "Made With" Section ---
const ReactIcon = ({ className }) => (
    <svg viewBox="0 0 128 128" className={className}>
        <g fill="currentColor">
            <circle cx="64" cy="64" r="11.4"></circle>
            <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"></path>
        </g>
    </svg>
);

const TailwindIcon = ({ className }) => (
    <svg viewBox="0 0 128 128" className={className}>
        <path d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0" fill="currentColor"></path>
    </svg>
);

const FramerIcon = ({ className }) => (
    <svg viewBox="0 0 128 128" className={className}>
        <path d="M22.684 0h84.253v42.667H64.81L22.684 0Zm0 42.667H64.81l42.127 42.666H64.81V128L22.684 85.333V42.667Z" fill="currentColor"></path>
    </svg>
);

const GsapIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="m7.83,11.76h0s-.26,1.15-.26,1.15c-.01.06-.08.11-.15.11h-.32s-.04.02-.05.04c-.29.99-.69,1.68-1.21,2.09-.45.35-1,.51-1.73.51-.66,0-1.1-.21-1.48-.63-.5-.55-.7-1.46-.58-2.55.22-2.05,1.29-4.12,3.34-4.12.62,0,1.11.19,1.45.57.36.41.54,1.02.54,1.82,0,.07-.06.13-.13.13h-1.5c-.05,0-.1-.05-.1-.1-.01-.55-.18-.82-.5-.82-.58,0-.91.78-1.09,1.21-.25.6-.38,1.26-.35,1.92.01.3.06.73.35.91.26.16.62.05.84-.12.22-.17.4-.48.47-.75.01-.04.01-.07,0-.08-.01-.01-.04-.02-.06-.02h-.39s-.08-.02-.11-.05c-.02-.02-.03-.06-.02-.09l.26-1.14c.01-.06.07-.1.13-.11h0s2.53,0,2.53,0c0,0,.01,0,.02,0,.07,0,.11.07.11.14h0Z"></path><path d="m12.18,10.45c0,.07-.06.13-.13.13h-1.38c-.09,0-.17-.07-.17-.16,0-.4-.14-.6-.42-.6s-.47.18-.47.48c0,.34.19.65.74,1.18.72.68,1.01,1.28,1,2.08-.02,1.29-.9,2.12-2.23,2.12-.68,0-1.2-.18-1.54-.54-.35-.36-.51-.9-.48-1.59,0-.07.06-.13.13-.13h1.43s.08.02.1.05c.02.03.03.06.03.09-.02.25.03.43.13.54.06.07.15.1.26.1.26,0,.42-.19.42-.51,0-.28-.08-.53-.57-1.03-.63-.61-1.19-1.24-1.17-2.23.01-.58.24-1.1.64-1.48.43-.4,1.01-.61,1.69-.61.68,0,1.2.2,1.53.58.32.36.47.88.46,1.54h0Z"></path><path d="m16.47,15.43v-6.84c.01-.07-.05-.13-.12-.13,0,0,0,0,0,0h-2.14c-.07,0-.1.06-.12.1l-3.1,6.82h0s0,0,0,0c-.03.08.03.17.12.17h1.5c.08,0,.13-.02.16-.08l.3-.71c.04-.09.04-.1.15-.1h1.43c.1,0,.1,0,.1.1l-.03.66c0,.07.06.13.13.13,0,0,0,0,0,0h1.51s.07-.02.1-.04c.02-.02.03-.06.03-.09Zm-2.65-2.28s-.02,0-.03,0c-.02,0-.03-.02-.03-.04,0,0,0,0,0,0,0-.01,0-.02.01-.04l1.07-2.65s.02-.05.03-.08c.02-.04.04-.04.05-.01,0,.02-.12,2.72-.12,2.72-.01.1-.01.11-.11.11h-.86s0-.01,0-.01h0s0,0,0,0Z"></path><path d="m19.51,8.46h-1.14c-.06,0-.13.03-.14.1l-1.58,6.86s0,.06.02.09c.03.03.07.05.11.05h1.42c.08,0,.13-.04.14-.1,0,0,.17-.78.17-.78.01-.06,0-.11-.06-.14-.03-.01-.05-.03-.08-.04l-.25-.13-.24-.13-.09-.05s-.03-.02-.02-.04c0-.03.02-.05.05-.05h.78c.23,0,.47-.01.69-.05,1.61-.3,2.68-1.59,2.71-3.34.03-1.5-.81-2.26-2.48-2.26,0,0,0,0,0,0Zm-.39,4.08h-.03c-.07,0-.08,0-.08,0,0,0,.45-1.98.45-1.98.01-.06.01-.09-.02-.11-.05-.02-.7-.37-.7-.37-.02,0-.03-.02-.02-.04,0-.03.02-.05.05-.05h1.04c.32,0,.5.3.49.79-.01.85-.42,1.74-1.17,1.77h0Z"></path>
    </svg>

);

// --- "Made With" Component ---
const MadeWith = () => {
    return (
        <div className="mt-8 text-center min-[1080px]:text-left">
            <h3 className="text-sm font-semibold text-[var(--color-npm)] uppercase tracking-wider">Made With</h3>
            <div className="flex items-center justify-center min-[1080px]:justify-start gap-6 mt-4">
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer" title="React" className="transform hover:scale-110 transition-transform"><ReactIcon className="w-8 h-8 text-sky-400" /></a>
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" title="Tailwind CSS" className="transform hover:scale-110 transition-transform"><TailwindIcon className="w-8 h-8 text-cyan-400" /></a>
                <a href="https://framer.com/motion" target="_blank" rel="noopener noreferrer" title="Framer Motion" className="transform hover:scale-110 transition-transform"><FramerIcon className="w-8 h-8 text-fuchsia-500" /></a>
                <a href="https://gsap.com" target="_blank" rel="noopener noreferrer" title="GSAP" className="transform hover:scale-110 transition-transform"><GsapIcon className="w-10 h-10 text-green-500" /></a>
            </div>
        </div>
    );
};

// --- Waiting button for upcoming features ---
const WaitingButton = () => {
    return (
        <NavLink to="/templates-soon" className="flex items-center gap-3 bg-[var(--color-template)] border-2 border-dashed border-[var(--color-template-border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--color-template-text)] shadow-sm">
            <span>Templates Coming Soon</span>
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
            </span>
        </NavLink>
    );
};

// --- ✨ Combined Animated Headline Component ---
const AnimatedHeadline = () => {
    const title = `Swift UI Setup`;
    const words = title.split(" ");
    const letterCount = title.replace(" ", "").length;

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.2,
            },
        },
    };

    const childVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14,
            },
        },
    };

    let strokeColor = "var(--color-stroke-color)";
    const drawVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: 0.2 + letterCount * 0.04, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: 0.2 + letterCount * 0.04, duration: 0.01 },
            },
        },
    };

    return (
        // Parent div is now relative and inline-block for proper sizing
        <div className="relative inline-block mx-auto lg:mx-0">
            <motion.h1
                // MODIFIED: Added responsive font sizes
                className="text-4xl sm:text-5xl md:text-7xl font-semibold text-[var(--color-btn-text)] flex justify-center lg:justify-start"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ fontFamily: "Righteous, sans-serif" }}
            >
                {words.map((word, wordIndex) => (
                    <React.Fragment key={wordIndex}>
                        <span className="flex overflow-hidden">
                            {word.split("").map((char, charIndex) => {
                                const isUILetter = (word === "UI" && (char === "U" || char === "I"));
                                return (
                                    <motion.span
                                        key={charIndex}
                                        className={`inline-block ${isUILetter ? 'text-lime-400' : ''}`}
                                        variants={childVariants}
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}
                        </span>
                        {wordIndex < words.length - 1 && <span className="w-2 md:w-4"></span>}
                    </React.Fragment>
                ))}
            </motion.h1>

            {/* SVG is now absolutely positioned relative to the inline-block parent */}
            <motion.svg
                aria-hidden="true"
                viewBox="0 0 340 22"
                // MODIFIED: Adjusted underline position for different text sizes
                className="absolute left-0 -bottom-2 md:-bottom-5 w-full min-[1200px]:w-[89%] min-[1280px]:w-[85%] min-[1281px]:w-[80%] h-auto"
                preserveAspectRatio="none"
                initial="hidden"
                animate="visible"
            >
                <motion.path
                    d="M2 13.062C81 19.425 180 -10.758 90 20.062C200 9.729 318 -1.022 338 19.062"
                    variants={drawVariants}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    stroke={strokeColor}
                />
            </motion.svg>
        </div>
    );
};


const AnimatedShapes = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 },
        },
    };

    return (
        <motion.div
            className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="absolute -top-20 -left-20 w-80 h-80 bg-lime-400/5 rounded-full animate-pulse-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute top-1/4 -right-24 w-60 h-60 bg-emerald-500/5 rounded-2xl animate-spin-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute bottom-10 left-1/3 w-40 h-40 bg-sky-500/5 rounded-full animate-pulse-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute -bottom-20 right-1/4 w-72 h-40 bg-teal-500/5 rounded-lg animate-spin-slow-reverse"
                variants={itemVariants}
            />
        </motion.div>
    );
};

// --- Keyframes and Styled Component for the animated grid ---
const moveGrid = keyframes`
  from {
    background-position-y: 0;
  }
  to {
    background-position-y: -4rem; /* Match the background-size */
  }
`;

let rgbaGrid1 = 'var(--right-grid-color1)';
let rgbaGrid2 = 'var(--right-grid-color2)';

// MODIFIED: Removed the fixed width from here, will apply it via Tailwind classes for responsiveness.
const AnimatedGridPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* Reduced padding slightly for smaller screens */
  overflow: hidden;
  height: 400px;
  
  @media (min-width: 768px) {
    height: 500px;
    padding: 2rem;
  }

  background-color: var(--right-grid-bg);
  background-image:  
    linear-gradient(${rgbaGrid1} 1px, transparent 1px),
    linear-gradient(90deg, ${rgbaGrid2} 1px, transparent 1px);
  background-size: 4rem 4rem;
    /* The animation */
  animation: ${moveGrid} 3s linear infinite;

`;


export default function Home() {
    const [activeComponent, setActiveComponent] = useState(0);
    const previewRef = useRef(null);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const components = [
        { name: "GlareCard", preview: <GlareCard /> },
        { name: "HyperCard", preview: <HyperCard /> },
        { name: "PointerFollower", preview: <PointerFollower /> },
        { name: "ToolTip", preview: <ToolTip items={people} /> }
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const startAutoCycle = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveComponent(prev => (prev + 1) % components.length);
        }, 3000);
    };

    useEffect(() => {
        startAutoCycle();
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [components.length, startAutoCycle]);

    const handleComponentClick = (index) => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        setActiveComponent(index);

        timeoutRef.current = setTimeout(() => {
            startAutoCycle();
        }, 5000);
    };

    return (
        <section className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[var(--color-bg)]">
            <AnimatedShapes />
            {/* MODIFIED: Changed margin-top for better spacing, and added responsive gap */}
            <div className="mt-24 flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 w-full max-w-7xl items-center justify-center relative z-10 px-4 py-8">
                {/* Left Panel */}
                <motion.div
                    className="flex flex-col w-full lg:w-1/2 justify-center gap-6 text-center min-[1080px]:text-left"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <AnimatedHeadline />
                    {/* MODIFIED: Added responsive text sizes */}
                    <h2 className="text-xl sm:text-2xl text-[var(--color-text)] font-medium mt-4">Build Stunning Web Interfaces, Faster Than Ever.</h2>
                    {/* MODIFIED: Added responsive text sizes */}
                    <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        A professionally curated collection of modern, copy-paste-ready components and effects. Designed for performance and built with the latest tech to bring your projects to life.
                    </p>

                    <MadeWith />

                    {/* MODIFIED: Changed to stack on small screens, row on sm and up */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center min-[1080px]:justify-start">
                        <FancyButton to="/components/docs/getting-started/introduction">
                            Get Started
                        </FancyButton>
                        <WaitingButton />
                    </div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                    className="hidden min-[1080px]:flex flex-col md:flex-row w-full lg:w-1/2 max-w-4xl max-h-[700px] mt-12 lg:mt-0 bg-[var(--right-color-bg)] backdrop-blur-xl border border-[var(--right-border)] rounded-2xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    {/* MODIFIED: This is now the component list. It takes full width on small screens and 1/3 on medium and up. */}
                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[var(--right-border)] flex flex-col">
                        <div className="p-4 border-b border-[var(--right-border)]">
                            <h3 className="font-semibold text-[var(--color-text)]">Components</h3>
                        </div>
                        {/* MODIFIED: Made the component list a horizontal row on small screens, and vertical on medium+ */}
                        <div className="flex-grow overflow-y-auto flex flex-row md:flex-col">
                            {components.map((comp, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleComponentClick(index)}
                                    // MODIFIED: Adjusted styles for both horizontal and vertical layouts
                                    className={`w-full px-4 py-3 md:px-5 md:py-4 text-center md:text-left font-medium transition-all duration-200 text-sm md:text-base ${activeComponent === index
                                        ? "bg-[var(--right-active-bg)]/10 text-[var(--right-active-text)] border-b-4 md:border-b-0 md:border-r-4 border-[var(--right-active-border)]"
                                        : "text-[var(--color-text)] hover:bg-[var(--right-hover)]/50"
                                        }`}
                                >
                                    {comp.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MODIFIED: Added responsive width to the preview panel */}
                    <AnimatedGridPanel ref={previewRef} className="w-full md:w-2/3">
                        <motion.div
                            key={activeComponent}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full h-full flex items-center justify-center overflow-hidden"
                        >
                            {components[activeComponent].preview}
                        </motion.div>
                    </AnimatedGridPanel>
                </motion.div>
            </div>
        </section>
    );
}