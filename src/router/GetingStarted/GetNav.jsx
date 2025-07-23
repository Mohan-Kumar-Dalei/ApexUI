import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import MessageBar from '../../components/MessageBar';
import SearchComponent from '../../components/Search';
import { motion } from 'framer-motion';

export default function GetNav({ onSidebarToggle, sidebarOpen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
        if (onSidebarToggle) onSidebarToggle();
    };

    // Sync hamburger icon with sidebarOpen from parent
    useEffect(() => {
        if (!sidebarOpen) {
            setIsMenuOpen(false);
        }
    }, [sidebarOpen]);

    return (
        <>
            <nav className="w-full flex flex-row items-center justify-between px-2 sm:px-6 py-3 max-md:py-4 bg-[#1A1528] max-md:bg-[#1A1528] text-white border-b border-gray-600 z-[900] fixed top-10" style={{ boxShadow: '0 2px 16px 0 #0001' }}>
                {/* Left: Logo + Version */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-400 transition duration-300">Apex UI</span>
                    <span className="text-[10px] sm:text-xs bg-purple-800 text-white  px-2 py-0.5 rounded-full">v1.0.0-beta</span>
                </NavLink>
                {/* Right: Links + Search + Icons (all in one line, responsive) */}
                <div className="flex items-center gap-2 sm:gap-4 w-auto justify-end">
                    <NavLink to="/components/docs/getting-started/installation/react-setup" className="shine text-xs sm:text-sm font-medium hidden lg:inline">Installation</NavLink>
                    <NavLink to="/components/docs/getting-started/introduction" className="shine text-xs sm:text-sm font-medium hidden lg:inline">Documentation</NavLink>
                    <input
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
                        className="lg:hidden flex items-center px-3 py-2 border rounded text-gray-400 border-gray-600 ml-2  transition-all duration-300 ease-in-out focus:outline-none cursor-pointer"
                        aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
                        onClick={handleMenuToggle}
                    >
                        {isMenuOpen ? (
                            <i className="fa-sharp-duotone fa-solid fa-angles-left text-2xl transition-all duration-300 ease-in-out" />
                        ) : (
                            <i className="fa-sharp-duotone fa-solid fa-angles-right text-2xl transition-all duration-300 ease-in-out" />
                        )}

                    </button>
                </div>
            </nav>
            {/* MessageBar below nav so it's visible */}
            <div className="relative z-[901]">
                <MessageBar />
            </div>
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
                        <SearchComponent onSelect={() => setShowSearch(false)} />
                    </div>
                </motion.div>
            )}
        </>
    );
}
