/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from 'react';
import SidebarBadge from '../../components/SidebarBadge.jsx';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarContext from '../context/SidebarContext.jsx';



// --- Naye SVG Icons ---
const IconGettingStarted = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14-4-4 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32-9" /></svg>
);
const IconInstallation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const IconComponents = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const IconUI = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.41 1.41L3 12l7.59 7.59L12 21l9-9Z" /><path d="M3 12h18" /></svg>
);
const IconDefault = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);
const ChevronIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);


export default function AsideBar({ isMobile = false, onClose }) {
    const sidebarRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `;
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
    const [collapsedSections, setCollapsedSections] = useState(() => {
        if (!data) return {};
        const obj = {};
        data.forEach(section => {
            obj[section.key] = true;
        });
        return obj;
    });

    const toggleCollapse = (key) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const getSectionIcon = (key) => {
        switch (key) {
            case 'gettingstarted':
                return <IconGettingStarted />;
            case 'installation':
                return <IconInstallation />;
            case 'components':
                return <IconComponents />;
            case 'ui':
                return <IconUI />;
            default:
                return <IconDefault />;
        }
    };

    const SidebarContent = (
        <aside
            ref={sidebarRef}
            className={`relative h-full w-full min-h-0 lg:w-[20vw] overflow-hidden bg-[var(--nav-sidebar-bg)] text-[var(--nav-sidebar-text)] flex flex-col px-3 border-r border-[var(--color-border)]`}
        >
            <div
                ref={contentRef}
                className={`w-full h-full min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide pt-8 ${isMobile ? 'mt-26' : 'mt-0'}`}
            >
                {data.map((section, sectionIndex) => (
                    <motion.div
                        key={section.key}
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                    >
                        <button
                            className="flex items-center justify-between w-full cursor-pointer p-3 rounded-lg transition-colors duration-200 hover:bg-[var(--nav-sidebar-hover)]/50"
                            onClick={() => toggleCollapse(section.key)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-[var(--nav-sidebar-icon)]">
                                    {getSectionIcon(section.key)}
                                </div>
                                <span className="font-semibold text-base tracking-wide text-[var(--nav-sidebar-text)]">
                                    {section.title}
                                </span>
                            </div>
                            <motion.div
                                animate={{ rotate: collapsedSections[section.key] ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                                className="text-[var(--nav-sidebar-text)]"
                            >
                                <ChevronIcon />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {collapsedSections[section.key] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="ml-5 pl-1 border-l-2 border-[var(--nav-sidebar-border)] relative whitespace-nowrap"
                                    onMouseMove={e => {
                                        const container = e.currentTarget;
                                        const rect = container.getBoundingClientRect();
                                        const y = e.clientY - rect.top;
                                        if (container.beamRef) {
                                            container.beamRef.style.top = `${y - 8}px`;
                                        }
                                    }}
                                    onScroll={e => {
                                        const container = e.currentTarget;
                                        // Find the first active link
                                        const active = container.querySelector('.velocity-link-active');
                                        if (active && container.beamRef) {
                                            const rect = container.getBoundingClientRect();
                                            const activeRect = active.getBoundingClientRect();
                                            const y = activeRect.top - rect.top;
                                            container.beamRef.style.top = `${y}px`;
                                        }
                                    }}
                                    ref={el => {
                                        if (el) el.beamRef = el.querySelector('.velocity-beam');
                                    }}
                                >
                                    {/* Velocity Beam Effect */}
                                    <motion.div
                                        className="velocity-beam absolute -left-[1.5px] w-[2px] h-4 rounded-full bg-[var(--nav-sidebar-beam)] shadow-lg pointer-events-none z-10"
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ top: 0 }}
                                    />
                                    {section.content.map((item, idx) => (
                                        <motion.div
                                            key={item.name || idx}
                                            initial={{ x: -15, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="my-1"
                                        >
                                            {item.children ? (
                                                <div className="mt-2">
                                                    <div className="font-medium text-sm text-[var(--nav-sidebar-text)] mb-2 uppercase tracking-wider p-2">
                                                        {item.name || ''}
                                                    </div>
                                                    <div className="flex flex-col pl-3 border-l border-[var(--nav-sidebar-border)]">
                                                        {item.children.map((child, childIdx) => (
                                                            <motion.div
                                                                key={child.name}
                                                                initial={{ x: -10, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: childIdx * 0.05 }}
                                                            >
                                                                <NavLink
                                                                    to={child.path}
                                                                    className={({ isActive }) =>
                                                                        `block text-sm transition-all duration-200 rounded-md ${isActive
                                                                            ? ' text-[var(--nav-sidebar-active-text)] font-semibold velocity-link-active'
                                                                            : 'text-[var(--nav-sidebar-active-text)] hover:text-[var(--nav-sidebar-hover)] hover:bg-[var(--nav-sidebar-hover)]/50'
                                                                        }`
                                                                    }
                                                                    onClick={handleNavClick}
                                                                >
                                                                    <span className="px-3 py-2 block">{child.name}</span>
                                                                </NavLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `block text-sm transition-all duration-200 font-medium ${isActive
                                                            ? ' text-[var(--nav-sidebar-active-text)] font-semibold velocity-link-active translate-x-1'
                                                            : 'text-[var(--nav-sidebar-text)] hover:text-[var(--nav-sidebar-hover-text)] hover:translate-x-1 transition-all duration-75 ease-in-out'
                                                        }`
                                                    }
                                                    onClick={handleNavClick}
                                                >
                                                    <span className="px-3 py-2 flex items-center gap-2">
                                                        {item.name}
                                                        {item.badge && <SidebarBadge>{item.badge}</SidebarBadge>}
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

    return SidebarContent;
}
