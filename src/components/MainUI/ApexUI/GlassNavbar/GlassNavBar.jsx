// ApexUIComponentShowcase.jsx
import { useState, useEffect, useRef } from 'react';
import gsap from "gsap";
// FontAwesome icons will be used via <i> tags and CDN


const GlassNavbarEffect = ({
    indicatorColor = "",
    backgroundColor = "rgba(0, 0, 0, 0.3)",
    activeColor = "#ffffff",
    shrinkOnScroll = false,
    position = "fixed",
    indicatorAnimation = "elastic"
}) => {
    // Responsive menu state
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);



    const navItemsRef = useRef([]);
    const indicatorRef = useRef(null);
    const navContainerRef = useRef(null);

    // 🌟 Reveal animation - only width expansion left/right
    useEffect(() => {
        if (!navContainerRef.current) return;
        gsap.fromTo(
            navContainerRef.current,
            { width: 0, opacity: 0, overflow: "hidden" },
            { width: "auto", opacity: 1, overflow: "hidden", whiteSpace: "nowrap", duration: 0.8, ease: "power2.out" }
        );
    }, []);

    // Scroll shrink/expand effect
    useEffect(() => {
        if (!shrinkOnScroll) return;
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [shrinkOnScroll]);

    // 🎯 Move indicator to correct nav item
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

        requestAnimationFrame(() => {
            setTimeout(moveWithGSAP, 10);
        });
    }, [activeIdx, indicatorAnimation]);

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

    return (
        <nav className={`${position} top-10 left-0 w-full z-50 rounded-full flex items-center justify-between transition-all duration-300 px-8 ${shrinkOnScroll && scrolled ? 'py-2 shadow-xl border-b border-purple-300/30' : 'py-4 shadow-lg border-b border-purple-300/10'}`} style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: backgroundColor }}>
            {/* Left: Text Logo */}
            <div className="flex items-center gap-3">
                <span className="font-extrabold text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-400 drop-shadow-lg select-none">ApexUI</span>
            </div>

            {/* Center: Menu with indicator (only visible for xl: 1080px and above) */}
            <div className="flex-1 flex justify-center">
                <div
                    ref={navContainerRef}
                    className="relative backdrop-blur-xl rounded-full px-8 py-2 shadow-lg border border-purple-300/20 overflow-hidden hidden xl:block"
                    style={{ background: backgroundColor }}
                >
                    <div
                        ref={indicatorRef}
                        className="absolute top-1.5 px-3 py-5 rounded-full z-0"
                        style={{ background: indicatorColor }}
                    ></div>
                    <div className="relative flex gap-2 z-10">
                        {['Home', 'Docs', 'UI Kit', 'Contact'].map((label, i) => (
                            <button
                                key={label}
                                ref={(el) => (navItemsRef.current[i] = el)}
                                onClick={() => setActiveIdx(i)}
                                className={`nav-item px-6 py-2 text-base font-semibold rounded-full relative z-10 transition-all duration-200 ${i === activeIdx ? ' shadow-md' : 'text-gray-400 bg-transparent hover:bg-purple-600/10 hover:text-purple-500'}`}
                                style={{ letterSpacing: '0.03em', color: i === activeIdx ? activeColor : undefined }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Hamburger (tablet/mobile) + Search (desktop >=1080px) + Dark/Light Mode Toggle */}
            <div className="flex items-center gap-4 overflow-hidden">
                {/* Search bar for desktop only (>=1080px) */}
                <div className="relative hidden xl:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => {
                            if (searchValue === "") setSearchFocused(false);
                        }}
                        onChange={e => setSearchValue(e.target.value)}
                        className={`px-4 py-2 rounded-full dark:bg-black/40 text-black dark:text-white border border-purple-300/30 focus:outline-none shadow-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${searchFocused || searchValue ? 'w-52' : 'w-40'}`}
                    />
                    <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 dark:text-purple-300" />
                </div>
                {/* Hamburger icon for <1080px (tablet/mobile) */}
                <button
                    className="xl:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full dark:bg-black/40 border border-purple-300/30 shadow-sm transition-all duration-200 hover:bg-purple-600/20 relative"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className={`block w-6 h-0.5 bg-purple-500 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-purple-500 rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-purple-500 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
                <button
                    aria-label="Toggle Dark Mode"
                    className="p-2 rounded-full dark:bg-black/40 border border-purple-300/30 flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-purple-600/20"
                    onClick={() => {
                        setIsDark((prev) => !prev);
                        document.documentElement.classList.toggle('dark');
                    }}
                >
                    <i className={`fa-solid ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-purple-500'} w-5 h-5`} />
                </button>
            </div>

            {/* Mobile/Tablet Sidebar Menu - Redesigned glassmorphism, z-50, modern look */}
            <div className={`fixed -top-8 inset-0 z-50 transition-transform duration-500 ${menuOpen ? '-translate-x-5' : '-translate-x-full'}`} style={{ pointerEvents: menuOpen ? 'auto' : 'none', height: '100vh', width: '100vw' }}>
                {/* Blurred overlay behind sidebar */}
                <div className={`fixed bg-black/80 ${menuOpen ? 'blur-6xl' : ''} z-40`} onClick={() => setMenuOpen(false)}></div>
                <div className={`fixed top-0 left-0 h-full w-[300px] bg-[#181824] flex flex-col pt-5 px-6 transition-transform duration-500 z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Cross icon for closing sidebar */}
                    <button
                        className="absolute top-4 right-4 text-white text-2xl p-2 rounded-full hover:bg-purple-700/30 transition z-50"
                        aria-label="Close sidebar"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                    <span className="font-extrabold text-2xl mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-400 drop-shadow-lg select-none">ApexUI</span>

                    {/* Search bar (always in sidebar for <1080px) */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchValue}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => {
                                if (searchValue === "") setSearchFocused(false);
                            }}
                            onChange={e => setSearchValue(e.target.value)}
                            className="px-4 py-2 rounded-full dark:bg-black/40 text-black dark:text-white border border-purple-300/30 focus:outline-none shadow-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 dark:text-purple-300" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {['Home', 'Docs', 'UI Kit', 'Contact'].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => {
                                    setActiveIdx(i);
                                    setMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 ${i === activeIdx ? 'bg-purple-700/40 text-purple-300 shadow-md' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-500'}`}
                                style={{ letterSpacing: '0.03em', color: i === activeIdx ? activeColor : undefined }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Overlay click closes menu (optional, can keep for UX) */}

            </div>

        </nav>
    );
};

export default GlassNavbarEffect;
