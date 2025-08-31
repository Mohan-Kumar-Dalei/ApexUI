/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBar from './MessageBar.jsx';
import SearchComponent from './Search.jsx';
import ThemeToggle from './MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';
import AsideBar from '../router/GetingStarted/AsideBar.jsx';

const AnimatedHamburgerIcon = ({ isOpen, ...props }) => {
    const topVariants = {
        closed: { rotate: 0, translateY: 0 },
        open: { rotate: 45, translateY: 6 }
    };
    const middleVariants = {
        closed: { opacity: 1 },
        open: { opacity: 0 }
    };
    const bottomVariants = {
        closed: { rotate: 0, translateY: 0 },
        open: { rotate: -45, translateY: -6 }
    };

    return (
        <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} animate={isOpen ? "open" : "closed"}>
            <motion.line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={topVariants} />
            <motion.line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={middleVariants} />
            <motion.line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={bottomVariants} />
        </motion.svg>
    );
};




export default function GetNav() {
    // Mobile sidebar state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Sidebar open/close handlers
    const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);
    const handleSidebarClose = () => setIsMenuOpen(false);

    return (
        <>
            <div style={{ zIndex: 1003, position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <MessageBar />
            </div>
            <nav className="w-full flex flex-row items-center justify-between px-4 sm:px-6 py-4 bg-[var(--hero-nav-bg)]/50 backdrop-blur-2xl text-[var(--hero-nav-text)] border-b border-[var(--color-border)] z-[1003] fixed top-10 left-0" style={{ boxShadow: '0 2px 16px 0 #0001' }}>
                {/* Left Side */}
                <div className="flex items-center gap-6">
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <h1 className="text-xl sm:text-3xl font-semibold text-[var(--hero-nav-text)] group-hover:text-[var(--hero-nav-hover)] transition duration-300" style={{ fontFamily: "Righteous, sans-serif" }}>Apex<span className="text-lime-400">UI</span></h1>
                        <span className="text-[10px] sm:text-xs bg-[var(--hero-nav-badge)] text-[var(--hero-nav-badge-text)] px-2 py-0.5 rounded-full">v2.0.7</span>
                    </NavLink>
                    <div className="w-px h-6 bg-[var(--color-divider)] hidden lg:inline" />
                    <div className="hidden lg:flex items-center gap-4">
                        <a href="https://www.npmjs.com/package/apex-ui-kit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--hero-nav-text2)] hover:text-[var(--hero-nav-hover)] transition-colors">
                            <i className="fab fa-npm text-2xl"></i>
                            <span className="text-sm font-medium">NPM</span>
                        </a>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-4">
                        <NavLink to="/components" className="text-sm font-medium text-gray-400 hover:text-[var(--color-hover-text)] transition-colors">Components</NavLink>
                        <NavLink to="/components/docs/getting-started/installation/react-setup" className="text-sm font-medium text-gray-400 hover:text-[var(--color-hover-text)] transition-colors">Installation</NavLink>
                        <NavLink to="/components/docs/getting-started/introduction" className="text-sm font-medium text-gray-400 hover:text-[var(--color-hover-text)] transition-colors">introduction</NavLink>
                        <div className="w-px h-6 bg-gray-700" />
                        <button onClick={() => setShowSearch(true)} aria-label="Search" className="text-gray-400 hover:text-[var(--color-hover-text)] transition-colors">
                            <i className="fas fa-search text-lg"></i>
                        </button>
                        <NavLink to="https://github.com/Mohan-Kumar-Dalei/ApexUI" target='_blank' className="text-lg text-gray-400 hover:text-white"><i className="fab fa-github"></i></NavLink>
                        <NavLink to="https://www.linkedin.com/in/mohan-kumar-dalei/" target='_blank' className="text-lg text-gray-400 hover:text-blue-500"><i className="fab fa-linkedin"></i></NavLink>
                        <NavLink to="https://www.instagram.com/_.apexui._/" target='_blank' className="text-lg text-gray-400 hover:text-pink-400"><i className="fab fa-instagram"></i></NavLink>
                    </div>

                    <button className="lg:hidden p-2" aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'} onClick={handleMenuToggle}>
                        <AnimatedHamburgerIcon isOpen={isMenuOpen} />
                    </button>
                    <ThemeToggle
                        LightTheme='light'
                        animation='circle-right'
                        duration='1s'
                        ease="var(--vt-ease)"
                        className='text-gray-400 hover:text-[var(--color-hover-text)]'

                    />
                </div>
            </nav>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[1001] flex lg:hidden">
                        <AsideBar isMobile={true} onClose={handleSidebarClose} />
                        <div className="flex-1 bg-black/40" onClick={handleSidebarClose} />
                    </div>
                )}
            </AnimatePresence>

            {/* Search modal */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        className="fixed inset-0 z-[1100] flex items-center justify-center backdrop-blur-xl bg-black/50"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false) }}
                    >
                        <div className="absolute top-4 right-4">
                            <button aria-label="Close Search" className="text-white text-3xl p-2" onClick={() => setShowSearch(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}>
                            <SearchComponent onSelect={() => setShowSearch(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

