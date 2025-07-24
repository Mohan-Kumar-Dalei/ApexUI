/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import MessageBar from './MessageBar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchComponent from './Search';
function useGsapLocoMessageBar(messageBarRef) {
    React.useEffect(() => {
        let lastY = 0;
        let ticking = false;
        let ran = false;
        function handleScroll(e) {
            let currY;
            if (window.locoScroll && window.locoScroll.scroll) {
                currY = window.locoScroll.scroll.instance.scroll.y;
            } else {
                currY = window.scrollY;
            }
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (messageBarRef.current) {
                        if (currY > lastY && currY > 50) {
                            gsap.to(messageBarRef.current, { y: '-150%', duration: 0.4, ease: 'power2.out' });
                        } else {
                            gsap.to(messageBarRef.current, { y: '0%', duration: 0.4, ease: 'power2.out' });
                        }
                    }
                    lastY = currY;
                    ticking = false;
                });
                ticking = true;
            }
        }
        function bindScroll() {
            if (window.locoScroll && window.locoScroll.on) {
                window.locoScroll.on('scroll', handleScroll);
            } else {
                window.addEventListener('scroll', handleScroll);
            }
        }
        function unbindScroll() {
            if (window.locoScroll && window.locoScroll.off) {
                window.locoScroll.off('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll);
            }
        }
        bindScroll();
        const fallback = setTimeout(() => {
            if (!ran && window.locoScroll && window.locoScroll.on) {
                unbindScroll();
                bindScroll();
                ran = true;
            }
        }, 1000);
        return () => {
            unbindScroll();
            clearTimeout(fallback);
        };
    }, [messageBarRef]);
}

gsap.registerPlugin(ScrollTrigger);

function useGsapLocoNavbar(navbarRef) {
    useEffect(() => {
        let lastY = 0;
        let ticking = false;
        let ran = false;
        function handleScroll(e) {
            let currY;
            if (window.locoScroll && window.locoScroll.scroll) {
                currY = window.locoScroll.scroll.instance.scroll.y;
            } else {
                currY = window.scrollY;
            }
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (navbarRef.current) {
                        if (currY > lastY && currY > 50) {
                            gsap.to(navbarRef.current, { y: '-150%', duration: 0.4, ease: 'power2.out' });
                        } else {
                            gsap.to(navbarRef.current, { y: '0%', duration: 0.4, ease: 'power2.out' });
                        }
                    }
                    lastY = currY;
                    ticking = false;
                });
                ticking = true;
            }
        }
        function bindScroll() {
            if (window.locoScroll && window.locoScroll.on) {
                window.locoScroll.on('scroll', handleScroll);
            } else {
                console.log('[GSAP Navbar] Binding window scroll event');
                window.addEventListener('scroll', handleScroll);
            }
        }
        function unbindScroll() {
            if (window.locoScroll && window.locoScroll.off) {
                window.locoScroll.off('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll);
            }
        }
        bindScroll();
        const fallback = setTimeout(() => {
            if (!ran && window.locoScroll && window.locoScroll.on) {
                unbindScroll();
                bindScroll();
                ran = true;
            }
        }, 1000);
        return () => {
            unbindScroll();
            clearTimeout(fallback);
        };
    }, [navbarRef]);
}

const Navbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const navbarRef = React.useRef(null);
    const messageBarRef = React.useRef(null);
    useGsapLocoNavbar(navbarRef);
    useGsapLocoMessageBar(messageBarRef);

    const [showSidebar, setShowSidebar] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    React.useEffect(() => {
        if (showSidebar) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [showSidebar]);

    const menuLinks = [
        { to: 'components/docs/getting-started/introduction', label: 'Getting Started' },
        { to: 'components/docs/getting-started/installation/react-setup', label: 'Documentation' },
        { to: '#', label: 'Instagram', icon: 'instagram' },
        { to: '#', label: 'Twitter', icon: 'twitter' },
        { to: '#', label: 'GitHub', icon: 'github' },
    ];

    function handleMenuToggle() {
        setShowSidebar((prev) => !prev);
        setIsMenuOpen((prev) => !prev);
    }

    function handleOverlayClick(e) {
        if (e.target.id === 'sidebar-overlay') {
            setShowSidebar(false);
            setIsMenuOpen(false);
        }
    }
    return (
        <>
            <div ref={messageBarRef} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <MessageBar />
            </div>
            <nav ref={navbarRef} className="w-full flex flex-row items-center justify-between px-2 sm:px-6 py-5 sm:py-6 bg-slate-950 text-white border-b border-gray-600 z-[900] fixed top-8 sm:top-8 left-0" style={{ boxShadow: '0 2px 16px 0 #0001' }}>
                {/* Left: Logo + Version */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-400 transition duration-300">Apex UI</span>
                    <span className="text-[10px] sm:text-xs bg-purple-800 text-white  px-2 py-0.5 rounded-full">v1.0.4-beta</span>
                </NavLink>
                {/* Right: Links + Search + Icons (all in one line, responsive) */}
                <div className="flex items-center gap-2 sm:gap-4 w-auto justify-end">
                    <NavLink to="/components/docs/getting-started/installation/react-setup" className="shine text-xs sm:text-sm font-medium hidden lg:inline">Installation</NavLink>
                    <NavLink to="/components/docs/getting-started/introduction" className="shine text-xs sm:text-sm font-medium hidden lg:inline">Documentation</NavLink>

                    <label htmlFor="search" className="sr-only">Search</label>
                    <input
                        id='search'
                        name='search'
                        type="text"
                        placeholder="Search..."
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-white text-black dark:bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white placeholder-gray-400 w-24 sm:w-auto hidden md:inline"
                        onClick={() => setShowSearch(true)}
                        readOnly
                    />
                    <NavLink to="#" className="text-lg sm:text-xl text-gray-400 hover:text-pink-500"><i className="fab fa-instagram"></i></NavLink>
                    <NavLink to="#" className="text-lg sm:text-xl text-gray-400 hover:text-blue-400"><i className="fab fa-twitter"></i></NavLink>
                    <NavLink to="#" className="text-lg sm:text-xl text-gray-400 hover:text-gray-300"><i className="fab fa-github"></i></NavLink>
                    {/* Hamburger/Cross Icon for mobile/tablet */}
                    <button
                        className="lg:hidden flex items-center px-3 py-2 border rounded text-gray-400 border-gray-600 ml-2 transition-transform duration-300 focus:outline-none ease-in-out cursor-pointer"
                        aria-label={showSidebar ? 'Close Menu' : 'Open Menu'}
                        onClick={handleMenuToggle}
                    >
                        {/* Animate icon with Framer Motion */}
                        {isMenuOpen ? (
                            <i className="fas fa-times text-2xl transition-transform duration-300" />
                        ) : (
                            <i className="fas fa-bars text-2xl transition-transform duration-300" />
                        )}
                    </button>
                </div>
            </nav>
            {/* Mobile/Tablet Sidebar Drawer & Overlay (Framer Motion + blurred overlay) */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        id="sidebar-overlay"
                        className="fixed inset-0 z-[999] flex "
                        style={{
                            background: 'rgba(30, 30, 30, 0.25)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            transition: 'background 0.3s',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleOverlayClick}
                    >
                        <motion.aside
                            className="w-[80vw] max-w-xs h-full bg-[#1A1528] text-white shadow-2xl p-6 flex flex-col gap-6 pt-16"
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold">Menu</span>
                                <button
                                    aria-label="Close Menu"
                                    className="text-gray-400 hover:text-white text-2xl"
                                    onClick={handleMenuToggle}
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-4">
                                {menuLinks.map((link, idx) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.to}
                                        className="text-base font-medium py-2 px-3 rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        {link.icon && (
                                            <i className={`fab fa-${link.icon} text-lg`} />
                                        )}
                                        {link.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </motion.aside>
                    </motion.div>
                )}
                {showSearch && (
                    <motion.div
                        className="fixed inset-0 z-[1000] flex items-center justify-center  backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                aria-label="Close Search"
                                className="text-white text-3xl  p-2 "
                                onClick={() => setShowSearch(false)}
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <div className="w-full h-full flex items-center justify-center">
                            <SearchComponent />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
