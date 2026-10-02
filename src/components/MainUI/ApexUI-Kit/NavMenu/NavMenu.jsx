import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from "gsap";

const DEFAULT_ITEMS = ['Home', 'Docs', 'UI Kit', 'Contact'];

const EASES = {
    spring: "back.out(1.6)",
    power: "power3.out",
    elastic: "elastic.out(1, 0.6)",
};

const NavMenu = ({
    indicatorColor = "#a3e635",
    backgroundColor = "rgba(17, 24, 39, 0.5)",
    activeColor = "#ffffff",
    indicatorAnimation = "elastic",
    items = DEFAULT_ITEMS,
    activeIndex: controlledIndex,
    onNavItemClick,
}) => {
    const [internalIdx, setInternalIdx] = useState(0);
    const activeIdx = controlledIndex ?? internalIdx;
    const navRef = useRef(null);
    const itemRefs = useRef([]);
    const indicatorRef = useRef(null);
    const firstRun = useRef(true);

    useEffect(() => {
        if (!navRef.current) return undefined;
        const tween = gsap.fromTo(navRef.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 });
        return () => tween.kill();
    }, []);

    // Position the indicator relative to the nav itself (which is now `relative`).
    useLayoutEffect(() => {
        const nav = navRef.current;
        const indicator = indicatorRef.current;
        if (!nav || !indicator) return undefined;

        const place = (animate) => {
            const el = itemRefs.current[activeIdx];
            if (!el) return;
            const vars = { x: el.offsetLeft, width: el.offsetWidth };
            if (animate) gsap.to(indicator, { ...vars, duration: 0.55, ease: EASES[indicatorAnimation] ?? EASES.elastic, overwrite: "auto" });
            else gsap.set(indicator, vars);
        };

        place(!firstRun.current);
        firstRun.current = false;

        const ro = new ResizeObserver(() => place(false));
        ro.observe(nav);
        return () => ro.disconnect();
    }, [activeIdx, indicatorAnimation, items]);

    const select = (i, label) => {
        if (controlledIndex === undefined) setInternalIdx(i);
        onNavItemClick?.(label, i);
    };

    return (
        <nav
            ref={navRef}
            className="relative rounded px-3 py-2 shadow-lg border border-white/10 overflow-hidden"
            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: backgroundColor }}
        >
            <div className="relative flex gap-2 whitespace-nowrap">
                <div
                    ref={indicatorRef}
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full rounded-lg pointer-events-none"
                    style={{ background: indicatorColor, opacity: 0.3, width: 0 }}
                />
                {items.map((label, i) => (
                    <button
                        key={label}
                        type="button"
                        ref={(el) => (itemRefs.current[i] = el)}
                        onClick={() => select(i, label)}
                        aria-current={i === activeIdx ? "page" : undefined}
                        className={`px-6 py-2 text-base font-semibold rounded-full relative z-10 transition-colors duration-300 ${i === activeIdx ? '' : 'text-gray-400 hover:text-white'}`}
                        style={{ color: i === activeIdx ? activeColor : undefined }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

const ResponsiveNavMenu = ({ items = DEFAULT_ITEMS, onNavItemClick, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const handleSelect = (label, i) => {
        setActiveIdx(i);
        setIsOpen(false);
        onNavItemClick?.(label, i);
    };

    return (
        <nav className="sticky top-0 flex items-center justify-center p-4 w-full z-50 bg-transparent">
            <div className="hidden md:flex w-full justify-center">
                <NavMenu {...props} items={items} activeIndex={activeIdx} onNavItemClick={handleSelect} />
            </div>

            <div className="md:hidden flex w-full justify-end">
                <button
                    type="button"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((v) => !v)}
                    className="text-white focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="md:hidden absolute top-16 left-4 right-4 rounded-xl shadow-lg border border-white/10"
                    style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(17, 24, 39, 0.85)' }}
                >
                    <div className="flex flex-col items-center gap-2 p-4">
                        {items.map((label, i) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => handleSelect(label, i)}
                                className={`w-full text-center px-6 py-3 text-lg font-semibold rounded-full transition-colors duration-300 ${i === activeIdx ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
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
