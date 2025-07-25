import React, { useContext, useState, useEffect, useRef } from 'react';
import FeedBack from '../../components/FeedBack.jsx';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import SidebarContext from '../context/SidebarContext.jsx';
import GetNav from './GetNav.jsx';
import AsideBar from './AsideBar.jsx';
import { NavLink } from 'react-router-dom';


export default function Components() {
    const { data: summaryData } = useContext(SidebarContext);
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bgRef = useRef(null);
    // (Removed framer-motion spring wheel smooth scroll effect)

    // Sidebar open/close handlers
    const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
    const handleSidebarClose = () => setSidebarOpen(false);

    // Animate blurred circles on mount
    useEffect(() => {
        const circles = bgRef.current?.querySelectorAll('.circle');
        if (circles) {
            circles.forEach((circle) => {
                gsap.to(circle, {
                    x: () => gsap.utils.random(-100, 100),
                    y: () => gsap.utils.random(-100, 100),
                    duration: gsap.utils.random(8, 16),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
        }
    }, []);

    const flattenLinks = (data) => {
        let links = [];
        data.forEach((section) => {
            section.content.forEach((item) => {
                if (item.children) {
                    item.children.forEach((child) => links.push(child));
                } else {
                    links.push(item);
                }
            });
        });
        return links;
    };

    const allLinks = flattenLinks(summaryData);
    const active = allLinks.find((link) => link.path === location.pathname);
    const ComponentToRender = active?.component || null;

    return (
        <>
            <div className="w-screen h-screen flex flex-col text-white max-md:bg-[#1A1528] relative overflow-hidden ">
                {/* Modern Blurred Animated Background */}
                <div ref={bgRef} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    {/* Two blurred floating circles */}
                    <div className="circle absolute w-[28rem] h-[28rem] bg-purple-900 rounded-full blur-[120px] opacity-70 left-1/4 top-1/4 -translate-y-1/2 hidden sm:block" />
                    <div className="circle absolute w-[28rem] h-[28rem] bg-pink-900 rounded-full blur-[120px] opacity-60 left-3/4 top-1/3 -translate-y-1/2 hidden sm:block" />
                    {/* Subtle overlay for extra depth */}
                    <div className="absolute inset-0  z-0" />
                </div>

                <GetNav onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />

                <div className="flex flex-1 overflow-hidden outline-8 mt-20">
                    {/* Sidebar Desktop */}
                    <div className="hidden lg:block ">
                        <AsideBar />
                    </div>

                    {/* Sidebar Mobile Drawer */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-40 flex lg:hidden">
                            <AsideBar isMobile={true} onClose={handleSidebarClose} />
                            <div className="flex-1 backdrop-blur-2xl" onClick={handleSidebarClose} />
                        </div>
                    )}


                    {/* Main content with normal scroll */}
                    <div
                        className="flex-1  overflow-y-scroll scrollbar-hide  p-6  bg-gray-900/20 backdrop-blur-2xl"
                    >
                        {ComponentToRender ? (
                            <ComponentToRender />
                        ) : (
                            <div className="text-white/60 text-center mt-12">
                                Select a component from the sidebar to view it.
                            </div>
                        )}
                        <div className='flex justify-center max-md:mb-10'>
                            {(() => {
                                // Only show button for Introduction, React Setup, Tailwind Setup (not ApexUI or others)
                                const flat = allLinks;
                                // Define the relevant section paths (update as per your sidebar data)
                                const relevantPaths = [
                                    '/components/docs/getting-started/introduction',
                                    '/components/docs/getting-started/installation/react-setup',
                                    '/components/docs/getting-started/installation/tailwind-setup',
                                    '/components/docs/getting-started/installation/apexui-cli',
                                    '/components/glass-navbar',
                                ];
                                const currentIdx = flat.findIndex(link => link.path === location.pathname);
                                const next = flat[currentIdx + 1];
                                // Only show if current is in relevantPaths
                                const showBtn = relevantPaths.includes(location.pathname);
                                // Button label is always next section name
                                let btnLabel = '';
                                if (next) {
                                    btnLabel = next.name || next.title || 'Next';
                                } else {
                                    btnLabel = '';
                                }
                                // Button disabled if next is not in relevantPaths (i.e., last relevant section)
                                const isLast = !next || !relevantPaths.includes(next?.path);
                                const nextPath = next && relevantPaths.includes(next.path) ? next.path : '';
                                return showBtn && btnLabel && !isLast ? (
                                    <NavLink
                                        to={nextPath}
                                        className={`relative overflow-hidden px-6 py-3 rounded-lg border border-purple-400/60 text-white bg-black/20 group shadow-sm hover:shadow-purple-400/20 duration-300 flex items-center gap-3 mt-4 font-semibold ${isLast ? 'opacity-60 pointer-events-none cursor-not-allowed' : ''}`}
                                        tabIndex={0}
                                        aria-hidden={isLast}
                                    >
                                        <span className="relative z-10">{btnLabel}</span>
                                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" style={{ background: "radial-gradient(circle at bottom, purple, transparent 69%)", mixBlendMode: "screen" }} />
                                        {/* Animated Arrow Icon */}
                                        <span className="relative z-10 flex items-center ml-2">
                                            <svg className="w-5 h-5 text-purple-300 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </NavLink>
                                ) : null;
                            })()}
                        </div>
                    </div>

                </div>
                {/* Feedback floating button (bottom right) */}
            </div>
            <FeedBack />
        </>
    );
}
