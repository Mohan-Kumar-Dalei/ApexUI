import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
const DropdownPanel = ({ item, isActive }) => {
    const panelRef = useRef(null);

    // GSAP animation for revealing the panel
    useEffect(() => {
        if (isActive) {
            gsap.to(panelRef.current, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.2,
                ease: 'power3.out'
            });
        } else {
            gsap.to(panelRef.current, {
                autoAlpha: 0,
                y: -10,
                scale: 0.95,
                duration: 0.2,
                ease: 'power3.in'
            });
        }
    }, [isActive]);

    return (
        <div
            ref={panelRef}
            style={{ visibility: 'hidden', transformOrigin: 'top left' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-max max-w-4xl"
        >
            <div className="bg-gray-950 rounded-4xl shadow-xl p-6 z-50 border border-dashed border-gray-700/40">
                {/* Links Dropdown */}
                {item.type === "links" && (
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-left">
                        {item.submenu.map((subItem, i) => (
                            <li key={i}>
                                <a href={subItem.href} className="block p-1.5 text-sm text-gray-400 rounded-md transition-colors duration-75 hover:text-lime-400 hover:bg-slate-800">
                                    {subItem.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {/* Products Dropdown */}
                {item.type === "products" && (
                    <div className=' border border-gray-700/40 bg-black/10 rounded-2xl p-5'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-50">
                            {item.submenu.map((subItem, i) => (
                                <a href={subItem.href} key={i} className={`flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800 transition-all group w-80`}>
                                    <div className="overflow-hidden rounded-md">
                                        <img src={subItem.image} alt={subItem.label} className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110" />
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
                {/* Services Dropdown */}
                {item.type === "services" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.submenu.map((subItem, i) => (
                            <a href={subItem.href} key={i} className="group block bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800 transition-all w-64">
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

const NavDropDown = ({ navData }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        // New container panel with dashed border
        <div className=" inline-block bg-stone-950 border border-dashed border-slate-300/20 rounded-xl p-4 fixed" style={{ zIndex: '4000' }}>
            <nav className="relative">
                <ul className="flex space-x-2 justify-center">
                    {navData.map((item, index) => (
                        <li
                            key={index}
                            className="relative"
                            onMouseEnter={() => item.submenu && setOpenIndex(index)}
                            onMouseLeave={() => item.submenu && setOpenIndex(null)}
                        >
                            <a
                                href={item.href || '#'}
                                className="flex items-center px-3 py-2 text-sm font-medium hover:text-lime-400 text-slate-300 transition-colors duration-300 cursor-pointer"
                            >
                                {item.label}
                                {item.submenu && (
                                    <ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                                )}
                            </a>
                            {item.submenu && <DropdownPanel item={item} isActive={openIndex === index} />}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default NavDropDown; 