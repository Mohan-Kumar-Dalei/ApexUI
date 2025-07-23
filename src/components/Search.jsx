/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import SidebarContext from '../router/context/SidebarContext';
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
        return allItems.filter((item) =>
            item.name && item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allItems]);

    // GSAP refs for list items
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, stagger: 0.07, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [filteredItems.length, query]);

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-purple-950/40 backdrop-blur-md rounded-3xl border border-purple-400/30 relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search components..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-14 py-4 rounded-2xl bg-white/10 placeholder:text-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/80 border-2 border-purple-400/30 shadow-xl text-xl transition-all duration-300"
                    style={{ boxShadow: "0 2px 24px 0 #a78bfa44, 0 1.5px 0 0 #a78bfa" }}
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 text-3xl pointer-events-none drop-shadow-lg">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="13" cy="13" r="10" /><line x1="25" y1="25" x2="18.65" y2="18.65" /></svg>
                </span>
            </div>

            <div className="mt-8 max-h-96 overflow-y-auto rounded-2xl border border-purple-400/20 bg-gradient-to-br from-[#2d1857]/60 to-[#1a1a2e]/80 shadow-2xl scrollbar-hide" style={{ scrollBehavior: "smooth" }}>
                <ul ref={listRef} className="space-y-4 p-3">
                    {(filteredItems.length > 0 ? filteredItems : allItems).map((item, index) => (
                        <li
                            key={item.path}
                            className="cursor-pointer px-6 py-4 rounded-xl bg-[#181828]/40 text-white text-lg font-semibold shadow-lg  border border-gray-800"
                            style={{ marginBottom: "2px", position: "relative", zIndex: 1, }}
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                    if (typeof onSelect === 'function') onSelect();
                                }
                            }}
                            onMouseEnter={e => {
                                gsap.to(e.currentTarget, {
                                    x: 4,
                                    boxShadow: "0 0 16px 2px #a78bfa55, 0 0 2px 1px #232345",
                                    borderColor: "#a78bfa",
                                    color: "#a78bfa",
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            }}
                            onMouseLeave={e => {
                                gsap.to(e.currentTarget, {
                                    x: 0,
                                    boxShadow: "none",
                                    borderColor: "#232345",
                                    color: "#fff",
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            }}
                        >
                            <span className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-purple-400/80 inline-block" />
                                <span className="relative">
                                    {item.name}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}