import React, { useState, useRef, useEffect } from 'react';
import { gsap } from "gsap";
const NavMenu = ({
    indicatorColor = "#a3e635",
    backgroundColor = "rgba(17, 24, 39, 0.5)",
    activeColor = "#ffffff",
    indicatorAnimation = "elastic",
    onNavItemClick
}) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const navItemsRef = useRef([]);
    const indicatorRef = useRef(null);
    const navContainerRef = useRef(null);
    useEffect(() => {
        if (!navContainerRef.current) return;
        gsap.fromTo(
            navContainerRef.current,
            { width: 0, opacity: 0 },
            { width: "auto", opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
        );
    }, []);

    useEffect(() => {
        const indicator = indicatorRef.current;
        const el = navItemsRef.current[activeIdx];

        if (!indicator || !el) return;

        const getEase = () => {
            switch (indicatorAnimation) {
                case "spring": return "bounce.out";
                case "power": return "power3.out";
                case "elastic":
                default: return "elastic.out(1, 0.6)";
            }
        };

        const moveWithGSAP = () => {
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();
            const left = rect.left - parentRect.left;
            const width = rect.width;

            gsap.to(indicator, {
                x: left,
                width,
                duration: 0.5,
                ease: getEase(),
            });
        };

        const timeoutId = setTimeout(moveWithGSAP, 50);
        return () => clearTimeout(timeoutId);

    }, [activeIdx, indicatorAnimation]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const el = navItemsRef.current[activeIdx];
            if (el) {
                const rect = el.getBoundingClientRect();
                const parentRect = el.parentElement.getBoundingClientRect();
                const left = rect.left - parentRect.left;
                const width = rect.width;

                gsap.set(indicatorRef.current, {
                    x: left,
                    width: width
                });
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeIdx]);

    const navItems = ['Home', 'Docs', 'UI Kit', 'Contact'];

    return (
        <nav
            ref={navContainerRef}
            className="rounded px-3 py-2 shadow-lg border border-white/10 overflow-hidden"
            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: backgroundColor ,  }}
        >
            <div
                ref={indicatorRef}
                className="absolute top-1.5 h-[calc(100%-0.75rem)] rounded-lg z-0 "
                style={{ background: indicatorColor, opacity: 0.3 }}
            />
            <div className="relative flex gap-2 z-10 whitespace-nowrap">
                {navItems.map((label, i) => (
                    <button
                        key={label}
                        ref={(el) => (navItemsRef.current[i] = el)}
                        onClick={() => {
                            setActiveIdx(i);
                            if (onNavItemClick) onNavItemClick();
                        }}
                        className={`nav-item px-6 py-2 text-base font-semibold rounded-full relative z-10 transition-colors duration-300 ${i === activeIdx ? '' : 'text-gray-400 hover:text-white'}`}
                        style={{ color: i === activeIdx ? activeColor : undefined }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    );
};


// Responsive Wrapper Component
const ResponsiveNavMenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = ['Home', 'Docs', 'UI Kit', 'Contact'];

    return (
        <nav className="flex items-center justify-center p-4 sticky top-0 left-0 w-full z-50 bg-transparent">
            <div className="hidden md:flex w-full justify-center">
                <NavMenu {...props} />
            </div>

            <div className="md:hidden flex w-full justify-end">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden absolute top-20 left-4 right-4 rounded-xl shadow-lg border border-white/10"
                    style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(17, 24, 39, 0.7)' }}>
                    <div className="flex flex-col items-center gap-2 p-4">
                        {navItems.map((label, i) => (
                            <button
                                key={label}
                                onClick={() => {
                                    console.log(`${label} clicked`);
                                    setIsOpen(false);
                                }}
                                className="w-full text-center px-6 py-3 text-lg font-semibold rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default ResponsiveNavMenu;