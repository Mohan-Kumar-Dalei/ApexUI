import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { motion } from 'framer-motion'; // Framer Motion import kiya gaya hai

// GSAP ko MotionPathPlugin ke saath register karna zaroori hai
gsap.registerPlugin(MotionPathPlugin);

let iconColor = 'var(--color-feature-icon)';
// --- Naye SVG Icons ---
const Icon1 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4l-1.188-.648 1.188-.648a2.25 2.25 0 011.4-1.4l.648-1.188.648 1.188a2.25 2.25 0 011.4 1.4l1.188.648-1.188.648a2.25 2.25 0 01-1.4 1.4z" />
    </svg>
);
const Icon2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008z" />
    </svg>
);
const Icon3 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
const Icon4 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={iconColor} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

// --- Naya AnimatedShapes Component ---
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
                className="absolute -top-20 -left-20 w-80 h-80 bg-[#9ae600]/5 rounded-full animate-pulse-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute top-1/4 -right-24 w-60 h-60 bg-[#00bc7d]/5 rounded-2xl animate-spin-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute bottom-10 left-1/3 w-40 h-40 bg-[#2b7fff]/5 rounded-full animate-pulse-slow"
                variants={itemVariants}
            />
            <motion.div
                className="absolute -bottom-20 right-1/4 w-72 h-40 bg-[#00bba7]/5 rounded-lg animate-spin-slow-reverse"
                variants={itemVariants}
            />
        </motion.div>
    );
};


const features = [
    {
        icon: <Icon1 />,
        accentColor: "text-purple-400",
        title: "Smooth Experience",
    },
    {
        icon: <Icon2 />,
        accentColor: "text-sky-400",
        title: "Dark First Design",
    },
    {
        icon: <Icon3 />,
        accentColor: "text-green-400",
        title: "Developer Focused",
    },
    {
        icon: <Icon4 />,
        accentColor: "text-yellow-400",
        title: "Rapid Setup",
    }
];

const FeaturesSection = () => {
    const sectionRef = useRef(null);
    const svgRef = useRef(null);
    const logoRef = useRef(null);
    const iconRefs = useRef([]);
    const [paths, setPaths] = useState([]);

    useLayoutEffect(() => {
        const calculatePaths = () => {
            const newPaths = [];
            if (!svgRef.current || !logoRef.current || iconRefs.current.some(ref => !ref)) {
                return;
            }

            const svgRect = svgRef.current.getBoundingClientRect();
            const logoRect = logoRef.current.getBoundingClientRect();
            const logoCenter = {
                x: logoRect.left + logoRect.width / 2 - svgRect.left,
                y: logoRect.top + logoRect.height / 2 - svgRect.top
            };

            iconRefs.current.forEach(iconEl => {
                if (iconEl) {
                    const iconRect = iconEl.getBoundingClientRect();
                    const iconCenter = {
                        x: iconRect.left + iconRect.width / 2 - svgRect.left,
                        y: iconRect.top + iconRect.height / 2 - svgRect.top
                    };

                    const controlX = iconCenter.x + (logoCenter.x - iconCenter.x) * 0.5;
                    const controlY = (iconCenter.y < logoCenter.y) ? iconCenter.y - 60 : iconCenter.y + 60;

                    newPaths.push(`M ${iconCenter.x} ${iconCenter.y} Q ${controlX} ${controlY}, ${logoCenter.x} ${logoCenter.y}`);
                }
            });
            setPaths(newPaths);
        };

        const timeoutId = setTimeout(calculatePaths, 100);
        window.addEventListener('resize', calculatePaths);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calculatePaths);
        };
    }, []);

    useEffect(() => {
        if (paths.length === 0) return;

        const ctx = gsap.context(() => {
            paths.forEach((_, index) => {
                gsap.to(`.beam-${index}`, {
                    duration: 4 + Math.random() * 2,
                    repeat: -1,
                    ease: "none",
                    motionPath: {
                        path: `#path${index}`,
                        align: `#path${index}`,
                        alignOrigin: [0.5, 0.5],
                        autoRotate: true
                    }
                });
            });

            const iconWrappers = gsap.utils.toArray('.icon-wrapper');
            iconWrappers.forEach(wrapper => {
                const tooltip = wrapper.querySelector('.tooltip');
                const tl = gsap.timeline({ paused: true });
                tl.fromTo(tooltip, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });

                wrapper.addEventListener('mouseenter', () => tl.play());
                wrapper.addEventListener('mouseleave', () => tl.reverse());
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [paths]);
    let stopColor1 = 'var(--color-feature-stopColor-1)';
    let stopColor2 = 'var(--color-feature-stopColor-2)';
    let strokeColor = 'var(--color-feature-stroke-color)';

    return (
        <section ref={sectionRef} className="bg-[var(--color-feature-bg)] py-24 w-full overflow-hidden flex items-center justify-center min-h-screen relative">
            <AnimatedShapes />
            <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-feature-text-heading)]">Why Choose ApexUI?</h2>
                    <p className="text-lg text-[var(--color-feature-text-subheading)] mt-4 max-w-2xl mx-auto">
                        Our library is built on four key principles that ensure a superior development experience.
                    </p>
                </div>

                <div className="relative flex items-center justify-center h-96">
                    <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full z-0" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={stopColor1} />
                                <stop offset="100%" stopColor={stopColor2} />
                            </linearGradient>
                        </defs>

                        {paths.map((pathData, index) => (
                            <path key={index} id={`path${index}`} d={pathData} stroke={strokeColor} strokeWidth="2" fill="none" />
                        ))}

                        {paths.map((_, index) => (
                            <rect key={index} className={`beam-${index}`} width="24" height="4" fill="url(#beamGradient)" rx="2" />
                        ))}
                    </svg>

                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between z-10">
                        {features.slice(0, 2).map((feature, index) => (
                            <div key={index} ref={el => iconRefs.current[index] = el} className="icon-wrapper relative">
                                <div className={`p-4 bg-[var(--color-icon-bg-color)] border border-[var(--color-icon-border-color)] rounded-full cursor-pointer ${feature.accentColor}`}>
                                    {feature.icon}
                                </div>
                                <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--color-icon-bg-color)] text-white text-sm rounded-md whitespace-nowrap opacity-0 pointer-events-none">
                                    {feature.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div ref={logoRef} className="relative flex items-center justify-center w-48 h-48 z-10">
                        <div className="absolute w-full h-full bg-[var(--color-feature-animated-pulse)]/20 rounded-full animate-pulse" />
                        <div className="relative w-36 h-36 bg-[var(--color-icon-bg-color)] border-2 border-[var(--color-icon-border-color)] rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-[var(--color-feature-text-heading)]" style={{ fontFamily: "Righteous, sans-serif" }}>Apex<span className="text-lime-400">UI</span></span>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 h-full flex flex-col justify-between z-10">
                        {features.slice(2, 4).map((feature, index) => (
                            <div key={index + 2} ref={el => iconRefs.current[index + 2] = el} className="icon-wrapper relative">
                                <div className={`p-4 bg-[var(--color-icon-bg-color)] border border-[var(--color-icon-border-color)] rounded-full cursor-pointer ${feature.accentColor}`}>
                                    {feature.icon}
                                </div>
                                <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--color-icon-bg-color)] text-white text-sm rounded-md whitespace-nowrap opacity-0 pointer-events-none">
                                    {feature.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
