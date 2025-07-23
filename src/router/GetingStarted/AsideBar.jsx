/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SidebarContext from '../context/SidebarContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCode,
    faLightbulb,
    faPuzzlePiece,
    faChevronDown,
    faPalette,
    faMagicWandSparkles,
} from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(ScrollTrigger);

export default function AsideBar({ isMobile = false, onClose }) {
    const sidebarRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleNavClick = () => {
        if (isMobile && onClose) {
            setTimeout(() => {
                onClose();
            }, 150);
        }
    };

    const { data } = useContext(SidebarContext);
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleCollapse = (key) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

        gsap.to(`#chevron-${key}`, {
            rotate: collapsedSections[key] ? 0 : 180,
            duration: 0.2,
        });
    };

    const getSectionIcon = (key) => {
        switch (key) {
            case 'gettingstarted':
                return <FontAwesomeIcon icon={faLightbulb} className="text-lg text-yellow-500" />;
            case 'installation':
                return <FontAwesomeIcon icon={faCode} className="text-lg text-green-500" />;
            case 'components':
                return <FontAwesomeIcon icon={faPuzzlePiece} className="text-lg text-purple-500" />;
            case 'ui':
                return <FontAwesomeIcon icon={faMagicWandSparkles} className="text-lg text-blue-500" />;
            default:
                return <FontAwesomeIcon icon={faPalette} className="text-lg text-pink-500" />;
        }
    };

    const SidebarContent = (
        <aside
            ref={sidebarRef}
            className="relative h-full min-h-0 w-full bg-[#1a1528] max-md:bg-[#111316] text-white flex flex-col px-4 border-r border-white/10 backdrop-blur-xl shadow-[0_0_15px_rgba(138,43,226,0.2)] rounded-r-2xl"
        >
            <div
                ref={contentRef}
                className="w-full h-full min-h-0 overflow-y-auto scrollbar-hide pt-16"
            >
                {data.map((section) => (
                    <motion.div
                        key={section.key}
                        className="lg:mb-6 mb-2 transform lg:hover:translate-x-1 transition-transform duration-300 "
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className="flex items-center justify-between cursor-pointer mb-3 lg:mb-1  rounded-xl transition-all duration-200 group"
                            onClick={() => toggleCollapse(section.key)}
                        >
                            <div className="flex items-center gap-2">
                                <motion.div
                                    id={`icon-${section.key}`}
                                    className="text-lg p-2 rounded-lg"
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {getSectionIcon(section.key)}
                                </motion.div>
                                <span className="font-semibold text-[16px] tracking-wide text-white transition-all duration-200">
                                    {section.title}
                                </span>
                            </div>
                            <motion.div
                                id={`chevron-${section.key}`}
                                animate={{ rotate: !collapsedSections[section.key] ? 0 : -90 }}
                                transition={{ duration: 0.25 }}
                                className="text-white transition-colors duration-200 p-1.5 rounded-md"
                            >
                                <FontAwesomeIcon icon={faChevronDown} size="xs" />
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {!collapsedSections[section.key] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 pl-3 relative flex flex-col gap-2 font-semibold before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-purple-600 before:rounded-full after:content-[''] after:absolute after:left-[-3px] after:top-0 after:w-[8px] after:h-[8px] after:bg-purple-600 after:rounded-full"
                                >
                                    {section.content.map((item, idx) => (
                                        <motion.div
                                            key={item.name || idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="transform hover:translate-x-1 transition-all duration-200 relative"
                                        >
                                            {item.children ? (
                                                <div className="mb-0">
                                                    <div className="font-medium text-md text-white mb-2 uppercase tracking-wider transition-colors duration-200 bg-white/5 p-2 rounded-lg">
                                                        {item.name || ''}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {item.children.map((child, childIdx) => (
                                                            <motion.div
                                                                key={child.name}
                                                                initial={{ x: -10, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: childIdx * 0.05 }}
                                                                className="transform hover:translate-x-1 transition-all duration-200 py-1"
                                                            >
                                                                <NavLink
                                                                    to={child.path}
                                                                    className={({ isActive }) =>
                                                                        `text-[14px] transition-all duration-200 ${isActive
                                                                            ? 'bg-purple-600 text-white font-bold rounded-lg'
                                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg'
                                                                        }`
                                                                    }
                                                                    onClick={handleNavClick}
                                                                >
                                                                    <span className="px-3 py-1.5 block transition-all duration-200">
                                                                        {child.name}
                                                                    </span>
                                                                </NavLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `text-[14px] transition-all duration-200 ${isActive
                                                            ? 'bg-pink-600 text-white font-bold rounded-lg'
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg'
                                                        }`
                                                    }
                                                    onClick={handleNavClick}
                                                >
                                                    <span className="px-3 py-1.5 block transition-all duration-200">
                                                        {item.name}
                                                    </span>
                                                </NavLink>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </aside>
    );

    if (!isMobile) return SidebarContent;
    // Mobile: more offset and left-aligned heading
    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1528] border-r border-white/10 shadow-[0_0_25px_rgba(138,43,226,0.3)] backdrop-blur-xl lg:hidden h-full min-h-0 flex flex-col overflow-y-auto scrollbar-hide px-4 pt-32">
            <div className="w-full h-full min-h-0 ">
                {data.map((section) => (
                    <motion.div
                        key={section.key}
                        className="mb-2 transform transition-transform duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            className="flex items-center justify-between cursor-pointer mb-3 rounded-xl transition-all duration-200 group"
                            onClick={() => toggleCollapse(section.key)}
                        >
                            <motion.div
                                id={`icon-${section.key}`}
                                className="text-lg p-2 rounded-lg"
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {getSectionIcon(section.key)}
                            </motion.div>
                            <span className="font-semibold text-[16px] tracking-wide text-white transition-all duration-200 text-left w-full">
                                {section.title}
                            </span>
                            <motion.div
                                id={`chevron-${section.key}`}
                                animate={{ rotate: !collapsedSections[section.key] ? 0 : -90 }}
                                transition={{ duration: 0.25 }}
                                className="text-white transition-colors duration-200 p-1.5 rounded-md"
                            >
                                <FontAwesomeIcon icon={faChevronDown} size="xs" />
                            </motion.div>
                        </div>
                        <AnimatePresence>
                            {!collapsedSections[section.key] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 pl-3 relative flex flex-col gap-2 font-semibold before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-purple-600 before:rounded-full after:content-[''] after:absolute after:left-[-3px] after:top-0 after:w-[8px] after:h-[8px] after:bg-purple-600 after:rounded-full"
                                >
                                    {section.content.map((item, idx) => (
                                        <motion.div
                                            key={item.name || idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="transform hover:translate-x-1 transition-all duration-200 relative"
                                        >
                                            {item.children ? (
                                                <div className="mb-0">
                                                    <div className="font-medium text-md text-white mb-2 uppercase tracking-wider transition-colors duration-200 bg-white/5 p-2 rounded-lg">
                                                        {item.name || ''}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {item.children.map((child, childIdx) => (
                                                            <motion.div
                                                                key={child.name}
                                                                initial={{ x: -10, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: childIdx * 0.05 }}
                                                                className="transform hover:translate-x-1 transition-all duration-200 py-1"
                                                            >
                                                                <NavLink
                                                                    to={child.path}
                                                                    className={({ isActive }) =>
                                                                        `text-[14px] transition-all duration-200 ${isActive
                                                                            ? 'bg-purple-600 text-white font-bold rounded-lg'
                                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg'
                                                                        }`
                                                                    }
                                                                    onClick={handleNavClick}
                                                                >
                                                                    <span className="px-3 py-1.5 block transition-all duration-200">
                                                                        {child.name}
                                                                    </span>
                                                                </NavLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `text-[14px] transition-all duration-200 ${isActive
                                                            ? 'bg-pink-600 text-white font-bold rounded-lg'
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg'
                                                        }`
                                                    }
                                                    onClick={handleNavClick}
                                                >
                                                    <span className="px-3 py-1.5 block transition-all duration-200">
                                                        {item.name}
                                                    </span>
                                                </NavLink>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
