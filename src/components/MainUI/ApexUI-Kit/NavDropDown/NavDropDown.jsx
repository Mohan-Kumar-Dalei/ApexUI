import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

const CLOSE_DELAY = 140;

const DropdownPanel = ({ item, isActive, onEnter, onLeave }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return undefined;
        gsap.set(panel, { xPercent: -50 });
        const tween = gsap.to(panel, isActive
            ? { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out', overwrite: 'auto' }
            : { autoAlpha: 0, y: -8, scale: 0.97, duration: 0.18, ease: 'power2.in', overwrite: 'auto' });
        return () => tween.kill();
    }, [isActive]);

    return (
        // pt-6 (instead of a margin) keeps the pointer inside the menu while it
        // travels from the trigger to the panel, so the panel doesn't close.
        <div
            ref={panelRef}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{ visibility: 'hidden', opacity: 0, transformOrigin: 'top center' }}
            className="absolute top-full left-1/2 pt-6 w-max max-w-[min(56rem,92vw)] z-50"
        >
            <div className="bg-gray-950 rounded-4xl shadow-xl p-6 border border-dashed border-gray-700/40">
                {item.type === "links" && (
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-left">
                        {item.submenu.map((subItem, i) => (
                            <li key={subItem.label ?? i}>
                                <a href={subItem.href} className="block p-1.5 text-sm text-gray-400 rounded-md transition-colors duration-150 hover:text-lime-400 hover:bg-slate-800">
                                    {subItem.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {item.type === "products" && (
                    <div className="border border-gray-700/40 bg-black/10 rounded-2xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.submenu.map((subItem, i) => (
                                <a href={subItem.href} key={subItem.label ?? i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800 transition-colors group w-80 max-w-full">
                                    <div className="overflow-hidden rounded-md shrink-0">
                                        <img src={subItem.image} alt={subItem.label} loading="lazy" className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-gray-200 font-medium text-sm">{subItem.label}</h3>
                                        <p className="text-gray-500 text-xs">{subItem.subtitle}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
                {item.type === "services" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.submenu.map((subItem, i) => (
                            <a href={subItem.href} key={subItem.label ?? i} className="group block bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800 transition-colors w-64 max-w-full">
                                <h3 className="text-lime-400 font-medium transition-colors group-hover:text-lime-300">{subItem.label}</h3>
                                <p className="text-gray-500 text-sm">{subItem.subtitle}</p>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const NavDropDown = ({ navData = [], fixed = false }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const closeTimer = useRef(null);

    const open = (index) => {
        clearTimeout(closeTimer.current);
        setOpenIndex(index);
    };
    const scheduleClose = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpenIndex(null), CLOSE_DELAY);
    };

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    return (
        <div
            className={`${fixed ? 'fixed top-4 left-1/2 -translate-x-1/2' : 'relative'} inline-block bg-stone-950 border border-dashed border-slate-300/20 rounded-xl p-4`}
            style={{ zIndex: 4000 }}
            onKeyDown={(e) => e.key === 'Escape' && setOpenIndex(null)}
        >
            <nav className="relative">
                <ul className="flex space-x-2 justify-center">
                    {navData.map((item, index) => {
                        const hasMenu = Boolean(item.submenu?.length);
                        return (
                            <li
                                key={item.label ?? index}
                                className="relative"
                                onMouseEnter={() => hasMenu && open(index)}
                                onMouseLeave={() => hasMenu && scheduleClose()}
                                onFocus={() => hasMenu && open(index)}
                                onBlur={(e) => hasMenu && !e.currentTarget.contains(e.relatedTarget) && scheduleClose()}
                            >
                                <a
                                    href={item.href || '#'}
                                    aria-haspopup={hasMenu || undefined}
                                    aria-expanded={hasMenu ? openIndex === index : undefined}
                                    className="flex items-center px-3 py-2 text-sm font-medium hover:text-lime-400 text-slate-300 transition-colors duration-200 cursor-pointer"
                                >
                                    {item.label}
                                    {hasMenu && (
                                        <ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                                    )}
                                </a>
                                {hasMenu && (
                                    <DropdownPanel
                                        item={item}
                                        isActive={openIndex === index}
                                        onEnter={() => open(index)}
                                        onLeave={scheduleClose}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default NavDropDown;
