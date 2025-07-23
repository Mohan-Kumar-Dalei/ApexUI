/* eslint-disable no-unused-vars */
"use client";

import React, { useRef, useEffect, useState } from "react";
// --- Custom Cursor ---
const CustomCursor = ({ isActive, x, y, visible }) => {
    // Animate position with framer-motion spring
    return visible ? (
        <motion.div
            className="pointer-events-none z-50"
            initial={false}
            animate={isActive ? {
                width: 48,
                height: 48,
                borderRadius: 18,
                borderWidth: 3,
                borderColor: '#a78bfa',
            } : {
                width: 32,
                height: 32,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: '#a78bfa',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 50,
                transform: `translate(-50%, -50%)`,
                background: 'transparent',
                borderStyle: 'solid',
            }}
        />
    ) : null;
};
import {
    motion,
    useMotionValue,
    useTransform,
    useSpring,
} from "framer-motion";

// --- ICONS ---
const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.54 2.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);
const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);
const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);

// --- Magnetic Wrapper ---
const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        x.set(offsetX * 0.2);
        y.set(offsetY * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
};


const GlassProfile = ({
    name = "Aditya Verma",
    role = "MERN Stack Developer",
    dob = "5th March, 1999",
    avatar = "https://i.pravatar.cc/150?img=12",
    github = "#",
    linkedin = "#",
    twitter = "#",
    resumeLink = "/Aditya-Resume.pdf",
    hireLink = "#",
    bgColor = "#2d133b"
}) => {
    // Custom cursor state
    const [cursor, setCursor] = useState({ x: 0, y: 0, active: false, visible: false });
    const cardRef = useRef(null);

    // Mouse move handler for card area (restrict to card bounds)
    const handleCardMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        // Clamp to card bounds
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));
        setCursor((c) => ({ ...c, x, y, visible: true }));
    };
    const handleCardMouseLeave = () => {
        setCursor((c) => ({ ...c, visible: false, active: false }));
    };
    // Handlers for interactive elements
    const handleCursorActive = () => setCursor((c) => ({ ...c, active: true }));
    const handleCursorInactive = () => setCursor((c) => ({ ...c, active: false }));
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [0, 384], [15, -15]), {
        stiffness: 180,
        damping: 18,
    });
    const rotateY = useSpring(useTransform(mouseX, [0, 320], [-15, 15]), {
        stiffness: 180,
        damping: 18,
    });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        mouseX.set(160);
        mouseY.set(192);
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="relative w-80 h-96">
                {/* Custom Cursor (absolutely positioned inside card) */}
                <CustomCursor isActive={cursor.active} x={cursor.x} y={cursor.y} visible={cursor.visible} />
                <motion.div
                    ref={cardRef}
                    className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-2xl border border-purple-400/30 backdrop-blur-2xl"
                    style={{ background: bgColor, perspective: "1200px", rotateX, rotateY }}
                    onMouseMove={(e) => { handleMouseMove(e); handleCardMouseMove(e); }}
                    onMouseLeave={() => { handleMouseLeave(); handleCardMouseLeave(); }}
                >
                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center w-full h-full p-6 text-center text-white z-10">
                        <div className="relative flex items-center justify-center">
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-purple-400/50 object-cover shadow-xl"
                            />
                            <div className="absolute inset-0 rounded-full ring-2 ring-purple-400/90 animate-pulse pointer-events-none" />
                        </div>
                        <h2 className="mt-5 text-2xl font-bold text-fuchsia-100">{name}</h2>
                        <p className="text-sm font-medium text-purple-300">{role}</p>
                        <p className="text-xs text-purple-400 mt-1">DOB: {dob}</p>

                        {/* Socials */}
                        <div className="mt-5 flex gap-4 items-center justify-center">
                            <Magnetic>
                                <a
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/5 p-2 rounded-full hover:bg-purple-400/30 transition-all duration-300 flex items-center justify-center"
                                    onMouseEnter={handleCursorActive}
                                    onMouseLeave={handleCursorInactive}
                                >
                                    <GitHubIcon />
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/5 p-2 rounded-full hover:bg-purple-400/30 transition-all duration-300 flex items-center justify-center"
                                    onMouseEnter={handleCursorActive}
                                    onMouseLeave={handleCursorInactive}
                                >
                                    <LinkedInIcon />
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a
                                    href={twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/5 p-2 rounded-full hover:bg-purple-400/30 transition-all duration-300 flex items-center justify-center"
                                    onMouseEnter={handleCursorActive}
                                    onMouseLeave={handleCursorInactive}
                                >
                                    <TwitterIcon />
                                </a>
                            </Magnetic>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3 items-center justify-center whitespace-nowrap">
                            <Magnetic>
                                <motion.a
                                    whileTap={{ scale: 0.95 }}
                                    href={hireLink}
                                    className="px-6 py-2 bg-purple-600/40 hover:bg-purple-600/70 text-white rounded-full font-medium shadow-lg shadow-purple-900/40 backdrop-blur-md transition-all"
                                    onMouseEnter={handleCursorActive}
                                    onMouseLeave={handleCursorInactive}
                                >
                                    Hire Me
                                </motion.a>
                            </Magnetic>
                            <Magnetic>
                                <motion.a
                                    whileTap={{ scale: 0.95 }}
                                    href={resumeLink}
                                    download
                                    className="px-6 py-2 bg-purple-700/30 hover:bg-purple-700/60 text-white rounded-full font-medium shadow-lg shadow-purple-900/40 backdrop-blur-md transition-all"
                                    onMouseEnter={handleCursorActive}
                                    onMouseLeave={handleCursorInactive}
                                >
                                    Download CV
                                </motion.a>
                            </Magnetic>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GlassProfile;
