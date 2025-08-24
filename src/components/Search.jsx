import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import SidebarContext from '../router/context/SidebarContext';
// --- Dummy Sidebar Context (for demonstration) ---

// --- Naya Search Result Item Component ---
const SearchResultItem = ({ item, onSelect, navigate }) => {
    const itemRef = useRef(null);

    // Spotlight hover effect
    useEffect(() => {
        const el = itemRef.current;
        if (!el) return;

        const onMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        };

        el.addEventListener('mousemove', onMouseMove);
        return () => el.removeEventListener('mousemove', onMouseMove);
    }, []);

    return (
        <li
            ref={itemRef}
            key={item.path}
            className="group relative cursor-pointer p-4 text-gray-300 font-medium rounded-lg transition-colors duration-200 overflow-hidden"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
            onClick={() => {
                if (item.path) {
                    navigate(item.path);
                    if (typeof onSelect === 'function') onSelect();
                }
            }}
        >
            {/* Spotlight element */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(163, 230, 53, 0.15), transparent 80%)`,
                }}
            />
            <span className="relative flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-lime-400 transition-colors duration-300" />
                <span className="relative text-lg tracking-wide group-hover:text-white transition-colors duration-300">
                    {item.name}
                </span>
            </span>
        </li>
    );
};


export default function SearchComponent({ onSelect }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const contextValue = useContext(SidebarContext);
    const sidebarData = useMemo(() => {
        if (Array.isArray(contextValue?.data)) return contextValue.data;
        return [];
    }, [contextValue]);

    const allItems = useMemo(() => {
        return sidebarData.flatMap((section) => Array.isArray(section.content) ? section.content : []);
    }, [sidebarData]);

    const filteredItems = useMemo(() => {
        if (!query) return allItems;
        return allItems.filter((item) =>
            item.name && item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allItems]);

    const listRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!listRef.current) return;
        const items = Array.from(listRef.current.children);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(entry.target, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        }, { root: panelRef.current, threshold: 0.1 });

        items.forEach(item => observer.observe(item));

        return () => {
            if (observer) observer.disconnect();
        };
    }, [filteredItems]);


    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-950 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden z-[1004]">
            <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-gray-800">
                <span className="text-lime-400">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <input
                    type="text"
                    placeholder="Search components..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent placeholder:text-gray-600 text-gray-100 focus:outline-none text-lg"
                    autoFocus
                />
            </div>
            <div ref={panelRef} className="max-h-96 overflow-y-auto custom-scrollbar">
                <ul ref={listRef} className="p-4 space-y-1">
                    {filteredItems.length > 0 ? filteredItems.map((item) => (
                        <SearchResultItem
                            key={item.path}
                            item={item}
                            onSelect={onSelect}
                            navigate={navigate}
                        />
                    )) : (
                        <li className="px-4 py-8 text-center text-gray-500">No components found.</li>
                    )}
                </ul>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
}