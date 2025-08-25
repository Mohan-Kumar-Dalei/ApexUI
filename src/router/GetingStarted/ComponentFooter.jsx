/* eslint-disable no-unused-vars */
import React from "react"; // Removed unused imports like useEffect, useRef, etc.
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

// --- Animated Background Shapes Component (No changes here) ---
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

// --- Styled Component for the Big, Faded, and Responsive Text (No changes here) ---
const FadedBigText = styled.h1`
  font-weight: 300; /* font-black */
  text-transform: uppercase;
  color: var(--color-footer-text-color);
  opacity: 0.08; /* Faded effect */
  line-height: 1;
  white-space: nowrap;

  /* Responsive font size */
  font-size: 6rem; /* 64px for mobile */
  
  @media (min-width: 768px) { /* md breakpoint */
    font-size: 8rem; /* 128px for tablets */
  }

  @media (min-width: 1080px) { /* lg breakpoint */
    font-size: 20rem; /* 160px for desktops */
  }
`;


// --- Main Footer Component ---
const Footer = () => {
    // --- ✨ REMOVED: GSAP and ScrollTrigger useLayoutEffect hook ---

    return (
        <footer className="relative bg-[var(--color-footer-bg)] text-[var(--color-footer-text-color)] w-full overflow-hidden pt-24 pb-12 px-4">
            <AnimatedShapes />

            <div className="max-w-7xl mx-auto text-center relative z-20">
                {/* Links and Copyright are on top */}
                <div>
                    {/* Footer Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left mb-16 max-w-4xl mx-auto">
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
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 pt-8 border-t border-gray-800 px-20">
                        <span>&copy; 2025 ApexUI. All rights reserved.</span>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <a href="https://github.com/Mohan-Kumar-Dalei/ApexUI" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors"><FontAwesomeIcon icon={faGithub} className="w-5 h-5" /></a>
                            <a href="https://www.linkedin.com/in/mohan-kumar-dalei/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" /></a>
                            <a href="https://www.instagram.com/_.apexui._/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><FontAwesomeIcon icon={faInstagram} className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                
                <div className="mt-20 cursor-default whitespace-nowrap w-full">
                    <FadedBigText style={{fontFamily: "Righteous, sans-serif", whiteSpace: "nowrap"}}>
                        APEX UI
                    </FadedBigText>
                </div>
            </div>
        </footer>
    );
};
export default Footer;