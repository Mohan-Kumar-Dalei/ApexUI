/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SidebarContext from '../router/context/SidebarContext';
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

    // GSAP reveal on scroll for each list item
    const listRef = useRef(null);
    const panelRef = useRef(null);
    useEffect(() => {
        if (!listRef.current) return;
        const items = Array.from(listRef.current.children);
        gsap.set(items, { opacity: 0, y: 40 });
        let observer;
        if ('IntersectionObserver' in window) {
            observer = new window.IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(entry.target, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    } else {
                        gsap.to(entry.target, {
                            opacity: 0,
                            y: 40,
                            duration: 0.4,
                            ease: "power2.in"
                        });
                    }
                });
            }, { root: panelRef.current, threshold: 0.1 });
            items.forEach(item => observer.observe(item));
        } else {
            // fallback: animate all
            gsap.to(items, {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: "power2.out"
            });
        }
        return () => {
            if (observer) observer.disconnect();
        };
    }, [filteredItems.length, query]);

    return (
        <div className="w-full max-w-2xl mx-auto p-0 md:p-2 bg-slate-950 rounded-3xl shadow-2xl border border-purple-800 relative overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-7 pb-3">
                <span className="text-purple-800 text-3xl">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="13" r="10" /><line x1="25" y1="25" x2="18.65" y2="18.65" /></svg>
                </span>
                <input
                    type="text"
                    placeholder="Search components..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-slate-900 placeholder:text-purple-800 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-800 border border-purple-800 text-lg transition-all duration-300 shadow-md"
                />
            </div>
            <div ref={panelRef} className="max-h-96 overflow-y-auto rounded-b-3xl border-t border-purple-800 bg-slate-950 shadow-inner custom-scrollbar transition-all duration-300 px-2 pb-2">
                <ul ref={listRef} className="divide-y divide-purple-800">
                    {(filteredItems.length > 0 ? filteredItems : allItems).map((item, index) => (
                        <li
                            key={item.path}
                            className="cursor-pointer px-6 py-4 hover:bg-purple-800/30 transition-colors duration-200 text-purple-100 font-semibold rounded-xl my-2 shadow-lg border border-transparent hover:border-purple-800/60 backdrop-blur-sm"
                            style={{ opacity: 0, transform: 'translateY(40px)' }}
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                    if (typeof onSelect === 'function') onSelect();
                                }
                            }}
                        >
                            <span className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-purple-800 inline-block" />
                                <span className="relative text-lg tracking-wide drop-shadow-md">
                                    {item.name}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #6d28d9;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}