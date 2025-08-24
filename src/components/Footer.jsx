/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Copy } from 'lucide-react'
import SplitType from 'split-type';
gsap.registerPlugin(ScrollTrigger);

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

let spotlight = 'var(--color-spotlight)';
// Button with a "spotlight" hover effect
const StyledFancyLink = styled(NavLink)`
  position: relative;
  z-index: 1;
  background-color: var(--color-footer-btn-bg); /* Dark background for the button */
  border: 2px solid var(--color-footer-btn-border); /* Lime-400 */
  border-radius: 0.5rem; /* 8px */
  color: var(--color-footer-btn-text); /* Lime-400 */
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
    color: var(--color-footer-hover-text); /* Lighter lime */
    border-color: var(--color-footer-hover-border);
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



// --- Main Footer Component ---
const Footer = () => {
    const sectionRef = useRef(null);
    const CopyButton = () => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText('npm i apex-ui-kit');
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        };
        return (
            <div className=" top-2 right-2 z-20 flex flex-col items-center">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-md text-[var(--color-pages-side-active-text)] transition-all duration-200"
                    aria-label={copied ? 'Copied!' : 'Copy code'}
                >
                    <Copy className="w-4 h-4" />
                </button>
                {copied && (
                    <span
                        className="pointer-events-none select-none absolute lg:-top-8 lg:right-[28.4rem] right-42 top-8 translate-x-1/2 px-3 py-1 rounded-md bg-white text-xs font-semibold text-black border border-gray-200"
                        style={{ minWidth: '60px', textAlign: 'center', zIndex: 30 }}
                    >
                        Copied!
                        <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45" style={{ marginTop: '-2px' }}></span>
                    </span>
                )}
            </div>
        );
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const heading = new SplitType('.footer-heading', { types: 'chars' });
            const chars = heading.chars;

            gsap.from(chars, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                rotationX: -90,
                stagger: 0.03,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from(".footer-content", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);
    // --- Styled Component for the Big, Faded, and Responsive Text (No changes here) ---
    const FadedBigText = styled.h1`
  font-weight: 300; /* font-black */
  text-transform: uppercase;
  color: var(--color-footer-text-color);
  opacity: 0.08; /* Faded effect */
  line-height: 1;

  /* Responsive font size */
  font-size: 6rem; /* 64px for mobile */
  
  @media (min-width: 768px) { /* md breakpoint */
    font-size: 8rem; /* 128px for tablets */
  }

  @media (min-width: 1024px) { /* lg breakpoint */
    font-size: 20rem; /* 160px for desktops */
  }
`;
    return (
        <footer ref={sectionRef} className="relative bg-[var(--color-footer-bg)] text-[var(--color-footer-text-color)] w-full overflow-hidden py-24 px-4">
            <AnimatedShapes />
            <div className="max-w-7xl mx-auto text-center relative z-10">
                {/* Heading */}
                <h2 className="footer-heading text-5xl md:text-7xl font-bold text-[var(--color-footer-text-color)] mb-6">
                    Start Building Today.
                </h2>
                <p className="footer-content text-lg text-[var(--color-footer-sub-text)] max-w-2xl mx-auto mb-10">
                    Get started with ApexUI and bring your projects to life with modern, interactive components.
                </p>

                {/* CTA and NPM copy block */}
                <div className="footer-content flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <FancyButton to='/components/docs/getting-started/introduction' className="relative inline-block px-8 py-3 rounded-lg bg-lime-400 text-gray-900 font-semibold transition-transform duration-300 hover:scale-105">
                        Get Started
                    </FancyButton>
                    <div className="flex items-center bg-[var(--color-footer-copy-bg)] text-[var(--color-footer-copy-text)] gap-3 font-mono text-base px-5 py-3 rounded-lg border border-[var(--color-footer-copy-border)] tracking-wide shadow-sm">
                        <span className="text-[var(--color-footer-copied-text)]">$</span>
                        <span className="truncate">npm i apex-ui-kit</span> <CopyButton />

                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className="footer-content-block grid grid-cols-2 md:grid-cols-3 gap-8 text-left mb-16 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <p className="font-semibold text-[var(--color-footer-sub-color)]">Resources</p>
                        <NavLink to="components/docs/getting-started/introduction" className="text-[var(--color-footer-sub-text)] hover:text-[var(--color-footer-hover-text2)] hover:underline block transition-colors">Documentation</NavLink>
                        <NavLink to="components/glass-navbar" className="text-[var(--color-footer-sub-text)] hover:text-[var(--color-footer-hover-text2)] hover:underline block transition-colors">Components</NavLink>
                    </div>
                    <div className="space-y-4">
                        <p className="font-semibold text-[var(--color-footer-text-color)]">Legal</p>
                        <a href="https://apex-ui.notion.site/ApexUI-Privacy-Policy-23bcc7626dfc80aaad60f1033802579a" target="_blank" rel="noopener noreferrer" className="text-[var(--color-footer-sub-text)] hover:text-[var(--color-footer-hover-text2)] hover:underline block transition-colors">Privacy Policy</a>
                        <a href="https://apex-ui.notion.site/ApexUI-Terms-Conditions-23bcc7626dfc805c9271f18b9b7af916" target="_blank" rel="noopener noreferrer" className="text-[var(--color-footer-sub-text)] hover:text-[var(--color-footer-hover-text2)] hover:underline block transition-colors">Terms & Conditions</a>
                    </div>
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <p className="font-semibold text-[var(--color-footer-text-color)]">Feedback</p>
                        <p className="text-[var(--color-footer-sub-text)]">Your feedback is valuable. Please connect on social media to share your thoughts.</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-content-block flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 pt-8 border-t border-gray-800">
                    <span>&copy; 2025 ApexUI. All rights reserved.</span>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <a href="https://github.com/Mohan-Kumar-Dalei/ApexUI" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors"><FontAwesomeIcon icon={faGithub} className="w-5 h-5" /></a>
                        <a href="https://www.linkedin.com/in/mohan-kumar-dalei/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" /></a>
                        <a href="https://www.instagram.com/_.apexui._/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><FontAwesomeIcon icon={faInstagram} className="w-5 h-5" /></a>
                    </div>
                </div>
                <div className="mt-20">
                    <FadedBigText style={{ fontFamily: "Righteous, sans-serif" }}>
                        APEX UI
                    </FadedBigText>
                </div>
            </div>
        </footer>
    );
};
export default Footer;

