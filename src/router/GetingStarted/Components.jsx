import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import FeedBack from '../../components/FeedBack.jsx';
import SidebarContext from '../context/SidebarContext.jsx';
import NavBar from '../../components/Navbar.jsx';
import AsideBar from './AsideBar.jsx';
import Footer from './ComponentFooter.jsx';
import AllComponents from './AllComponents.jsx'
const StyledNextButton = styled(NavLink)`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--color-logo); /* Lime-400 */
    color: var(--color-logo);
    background-color: transparent;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    overflow: hidden;
    transition: color 0.4s ease-in-out;

    .text {
        position: relative;
        z-index: 2;
    }

    .icon {
        position: relative;
        z-index: 2;
        transition: transform 0.3s ease;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #a3e635;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease-in-out;
        z-index: 1;
    }

    &:hover {
        color: #111827;
    }

    &:hover .icon {
        transform: translateX(4px);
    }

    &:hover::before {
        transform: scaleX(1);
    }
`;

const NextButton = ({ to, children }) => (
    <StyledNextButton to={to}>
        <span className="text">{children}</span>
        <svg className="icon w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </StyledNextButton>
);


export default function Components() {
    const { data: summaryData } = useContext(SidebarContext) || { data: [] };
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bgRef = useRef(null);
    const mainContentRef = useRef(null);

    const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
    const handleSidebarClose = () => setSidebarOpen(false);

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


    // Animation for the inner content + scroll reset
    useEffect(() => {
        // Reset scroll on component change
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
        const componentContainer = mainContentRef.current?.querySelector('.component-container');
        if (componentContainer) {
            gsap.fromTo(componentContainer,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
            );
        }
    }, [location.pathname]);

    const flattenLinks = (data) => {
        if (!data) return [];
        let links = [];
        data.forEach((section) => {
            if (section.content) {
                section.content.forEach((item) => {
                    if (item.children) {
                        item.children.forEach((child) => links.push(child));
                    } else {
                        links.push(item);
                    }
                });
            }
        });
        return links;
    };

    const allLinks = flattenLinks(summaryData);
    const active = allLinks.find((link) => link.path === location.pathname);
    const ComponentToRender = active?.component || null;
    const currentPath = location.pathname || '';
    const isInComponentsSection = currentPath.startsWith('/components');
    const isComponentsRoot = currentPath === '/components' || currentPath === '/components/';

    return (
        <>
            <div className="w-screen h-screen flex flex-col text-[var(--color-text)] bg-[var(--color-bg)] relative">
                <div ref={bgRef} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="circle absolute w-[28rem] h-[28rem] bg-lime-500/10 rounded-full blur-[120px] left-1/4 top-1/4 -translate-y-1/2" />
                    <div className="circle absolute w-[28rem] h-[28rem] bg-sky-500/10 rounded-full blur-[120px] left-3/4 top-1/3 -translate-y-1/2" />
                </div>

                <header className="h-20 flex-shrink-0 border-b border-[var(--color-border)] px-6">
                    <NavBar onSidebarToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="hidden lg:block w-64 border-r border-[var(--color-border)] z-[999]">
                        <AsideBar />
                    </aside>

                    {sidebarOpen && (
                        <div className="fixed inset-0 z-40 flex lg:hidden">
                            <AsideBar isMobile={true} onClose={handleSidebarClose} />
                            <div className="flex-1 bg-[var(--color-bg)] backdrop-blur-sm" onClick={handleSidebarClose} />
                        </div>
                    )}

                    <main ref={mainContentRef} className="flex-1 overflow-y-scroll scrollbar-hide lg:ml-20" style={{ scrollBehavior: 'smooth' }}>
                        <div className="min-h-full flex flex-col items-center justify-center p-8 rounded-2xl relative">
                            <div className="component-container flex-grow w-full z-10 relative">
                                {/* Animated background shapes: all sides (like Home section), now inside preview container */}
                                <div className="absolute -top-20 -left-20 w-80 h-80 bg-lime-400/5 rounded-full animate-pulse-slow pointer-events-none z-0" />
                                <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-spin-slow pointer-events-none z-0" />
                                <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-sky-500/5 rounded-full animate-pulse-slow pointer-events-none z-0" />
                                <div className="absolute -bottom-20 right-1/4 w-72 h-40 bg-teal-500/5 rounded-lg animate-spin-slow-reverse pointer-events-none z-0" />
                                {ComponentToRender ? (
                                    <ComponentToRender />
                                ) : isComponentsRoot ? (
                                    // If the user is at the components root, show the full components list
                                    <AllComponents />
                                ) : isInComponentsSection ? (
                                    // If user is inside /components/* but no matching component, show only the message
                                    <div className="w-full h-[calc(100vh-12rem)] py-12 flex flex-col items-center justify-center text-center text-slate-300">
                                        <h2 className="text-xl md:text-2xl font-semibold mb-2">There are no components</h2>
                                        <p className="text-sm md:text-base max-w-xl">We couldn't find a matching component for this route.</p>
                                    </div>
                                ) : null}
                            </div>

                            <div className='mt-8 z-10'>
                                {(() => {
                                    const flat = allLinks;
                                    const relevantPaths = [
                                        '/components/docs/getting-started/introduction',
                                        '/components/docs/getting-started/installation/react-setup',
                                        '/components/docs/getting-started/installation/tailwind-setup',
                                        '/components/docs/getting-started/installation/apexui-cli',
                                        '/components/avatar',
                                    ];
                                    const currentIdx = flat.findIndex(link => link.path === location.pathname);
                                    const next = flat[currentIdx + 1];
                                    const showBtn = relevantPaths.includes(location.pathname);
                                    let btnLabel = next ? (next.name || next.title || 'Next') : '';
                                    const isLast = !next || !relevantPaths.includes(next?.path);
                                    const nextPath = next && relevantPaths.includes(next.path) ? next.path : '';

                                    return showBtn && btnLabel && !isLast ? (
                                        <NextButton to={nextPath}>
                                            {btnLabel}
                                        </NextButton>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                        <Footer />
                    </main>

                </div>

            </div>

            <FeedBack />

        </>
    );
}
