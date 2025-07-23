/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useGsapLocoReveal from "../components/utils/useGsapLocoReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faInstagram,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { textSlideGsap } from "./ui/TextSlide/textSlideGsap";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function TextCtaFooterModern() {

    const [copied, setCopied] = useState(false);
    const handleCopy = async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText("npx apex-ui@latest init");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            setCopied(false);
            alert("Failed to copy!");
        }
    };

    useGsapLocoReveal((scrollerEl) => {
        // Animate floating circles behind CTA section
        if (window.innerWidth > 1024) {
            gsap.to(".cta-float-circle-1", {
                x: 80,
                y: -60,
                scale: 1.15,
                repeat: -1,
                yoyo: true,
                duration: 4,
                ease: "power1.inOut"
            });
            gsap.to(".cta-float-circle-2", {
                x: -100,
                y: 70,
                scale: 0.9,
                repeat: -1,
                yoyo: true,
                duration: 5,
                ease: "power1.inOut"
            });
        }
        if (window.locoScroll) {
            ScrollTrigger.scrollerProxy(scrollerEl, {
                scrollTop(value) {
                    if (arguments.length) {
                        // Prevent infinite loop by only setting scroll if value is different
                        if (window.locoScroll.scroll.instance.scroll.y !== value) {
                            window.locoScroll.scrollTo(value, 0, 0);
                        }
                    } else {
                        return window.locoScroll.scroll.instance.scroll.y;
                    }
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
                pinType: scrollerEl?.style.transform ? "transform" : "fixed",
            });
        }

        // Only run GSAP scroll animation for CTA and text-slide on large screens
        if (window.innerWidth > 1024) {
            gsap.fromTo(
                "#cta-section",
                { scale: 1, opacity: 1 },
                {
                    scale: 0.9,
                    opacity: 0.4,
                    scrollTrigger: {
                        trigger: "#cta-section",
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        pin: true,
                        scroller: scrollerEl,
                    },
                }
            );
            textSlideGsap(scrollerEl);
        }

        // Footer reveal after text-slide (only large screens)
        if (window.innerWidth > 1024) {
            gsap.fromTo(
                "#footer-main",
                { y: 150 },
                {

                    y: 0,
                    scrollTrigger: {
                        trigger: "#footer-main",
                        start: "top bottom",
                        end: "top center",
                        scrub: true,
                        scroller: scrollerEl,
                        duration: 1.4,
                        smooth: true,
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
        // Future text animation
        if (window.innerWidth > 1024) {
            gsap.from(".future-char", {
                scrollTrigger: {
                    trigger: "#cta-section",
                    scroller: scrollerEl,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    duration: 1.2,
                },
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.04,
            });

        }
        ScrollTrigger.addEventListener("refresh", () => window.locoScroll?.update());
        ScrollTrigger.refresh();
    });

    return (
        <div className="relative bg-gradient-to-b to-[#060010] from-[#020E22] text-white smooth-scroll">
            <div className="footer-scroll-wrapper ">
                {/* CTA Section for all screens */}
                <section id="cta-section" className="relative h-auto w-full lg:h-screen flex items-center justify-center px-6 -mb-8 lg:mb-0 bg-[#060010] lg:border border-white/10 backdrop-blur-xl">
                    {/* Animated floating circles for UI enhancement */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-purple-500/30 blur-3xl z-0 pointer-events-none cta-float-circle-1"></div>
                    <div className="absolute top-1/2 left-1/3 w-[260px] h-[260px] rounded-full bg-cyan-400/30 blur-2xl z-0 pointer-events-none cta-float-circle-2"></div>
                    <div className="grid md:grid-cols-2  gap-16 lg:gap-0 h-[65vh] lg:h-full max-w-7xl mx-auto items-center relative">
                        <div className="max-md:space-y-6 lg:flex flex-col lg:items-start lg:justify-around">
                            {/* Get Started button and CLI block */}
                            <div className="flex flex-col items-center gap-4 pt-4">
                                <NavLink to='components/getting-started' className="relative overflow-hidden w-auto sm:w-auto text-left sm:text-center px-6 sm:px-10 py-3 sm:py-3 rounded-xl border-2 border-purple-400/60 text-white bg-black/20 group shadow-lg  duration-300 text-base sm:text-xl font-bold self-start">
                                    <span className="relative z-10">Get Started</span>
                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" style={{ background: "radial-gradient(circle at bottom, purple, transparent 69%)", mixBlendMode: "screen" }} />
                                </NavLink>
                                <div className="flex items-center  bg-[#1a1027] text-white font-mono text-base px-6 py-4 rounded-xl border border-[#a855f7] tracking-wide shadow-sm mt-2 self-start lg:self-start">
                                    <span className="truncate">npx apex-ui@latest init</span>
                                    <button type="button" onClick={handleCopy} className="p-1 rounded-full hover:bg-[#a855f7]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                        </svg>
                                    </button>
                                    <span className={`text-[#a855f7] text-[0.7rem] font-medium ${copied ? "opacity-100" : "opacity-0"}`}>Copied!</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 lg:mt-4">
                                <p>Made With </p>
                                <svg viewBox="0 0 128 128" className="w-8 h-8 text-[#61DAFB] fill-current">
                                    <circle cx="64" cy="47.5" r="9.3"></circle>
                                    <path d="M64 81.7C71.3 88.8 78.5 93 84.3 93c1.9 0 3.7-.4 5.2-1.3 5.2-3 7.1-10.5 5.3-21.2-.3-1.9-.7-3.8-1.2-5.8 2-.6 3.8-1.2 5.6-1.8 10.1-3.9 15.7-9.3 15.7-15.2 0-6-5.6-11.4-15.7-15.2-1.8-.7-3.6-1.3-5.6-1.8.5-2 .9-3.9 1.2-5.8 1.7-10.9-.2-18.5-5.4-21.5-1.5-.9-3.3-1.3-5.2-1.3-5.7 0-13 4.2-20.3 11.3C56.7 6.3 49.5 2.1 43.7 2.1c-1.9 0-3.7.4-5.2 1.3-5.2 3-7.1 10.5-5.3 21.2.3 1.9.7 3.8 1.2 5.8-2 .6-3.8 1.2-5.6 1.8-10.1 3.9-15.7 9.3-15.7 15.2 0 6 5.6 11.4 15.7 15.2 1.8.7 3.6 1.3 5.6 1.8-.5 2-.9 3.9-1.2 5.8-1.7 10.7.2 18.3 5.3 21.2 1.5.9 3.3 1.3 5.2 1.3 5.8.2 13-4 20.3-11zm-5.6-13.5c1.8.1 3.7.1 5.6.1 1.9 0 3.8 0 5.6-.1-1.8 2.4-3.7 4.6-5.6 6.7-1.9-2.1-3.8-4.3-5.6-6.7zM46 57.9c1 1.7 1.9 3.3 3 4.9-3.1-.4-6-.9-8.8-1.5.9-2.7 1.9-5.5 3.1-8.3.8 1.6 1.7 3.3 2.7 4.9zm-5.8-24.1c2.8-.6 5.7-1.1 8.8-1.5-1 1.6-2 3.2-3 4.9-1 1.7-1.9 3.3-2.7 5-1.3-2.9-2.3-5.7-3.1-8.4zm5.5 13.7c1.3-2.7 2.7-5.4 4.3-8.1 1.5-2.6 3.2-5.2 4.9-7.8 3-.2 6-.3 9.1-.3 3.2 0 6.2.1 9.1.3 1.8 2.6 3.4 5.2 4.9 7.8 1.6 2.7 3 5.4 4.3 8.1-1.3 2.7-2.7 5.4-4.3 8.1-1.5 2.6-3.2 5.2-4.9 7.8-3 .2-6 .3-9.1.3-3.2 0-6.2-.1-9.1-.3-1.8-2.6-3.4-5.2-4.9-7.8-1.6-2.7-3-5.4-4.3-8.1zm39.1-5.4l-2.7-5c-1-1.7-1.9-3.3-3-4.9 3.1.4 6 .9 8.8 1.5-.9 2.8-1.9 5.6-3.1 8.4zm0 10.8c1.2 2.8 2.2 5.6 3.1 8.3-2.8.6-5.7 1.1-8.8 1.5 1-1.6 2-3.2 3-4.9.9-1.5 1.8-3.2 2.7-4.9zm2.3 34.7c-.8.5-1.8.7-2.9.7-4.9 0-11-4-17-10 2.9-3.1 5.7-6.6 8.5-10.5 4.7-.4 9.2-1.1 13.4-2.1.5 1.8.8 3.6 1.1 5.4 1.4 8.5.3 14.6-3.1 16.5zm5.2-52.7c11.2 3.2 17.9 8.1 17.9 12.6 0 3.9-4.6 7.8-12.7 10.9-1.6.6-3.4 1.2-5.2 1.7-1.3-4.1-2.9-8.3-4.9-12.6 2-4.3 3.7-8.5 4.9-12.6zm-8-28.2c1.1 0 2 .2 2.9.7 3.3 1.9 4.5 7.9 3.1 16.5-.3 1.7-.7 3.5-1.1 5.4-4.2-.9-8.7-1.6-13.4-2.1-2.7-3.9-5.6-7.4-8.5-10.5 6-5.9 12.1-10 17-10zM69.6 26.8c-1.8-.1-3.7-.1-5.6-.1s-3.8 0-5.6.1c1.8-2.4 3.7-4.6 5.6-6.7 1.9 2.1 3.8 4.4 5.6 6.7zM40.9 7.4c.8-.5 1.8-.7 2.9-.7 4.9 0 11 4 17 10-2.9 3.1-5.7 6.6-8.5 10.5-4.7.4-9.2 1.1-13.4 2.1-.5-1.8-.8-3.6-1.1-5.4-1.4-8.5-.3-14.5 3.1-16.5zm-5.2 52.7C24.5 56.9 17.8 52 17.8 47.5c0-3.9 4.6-7.8 12.7-10.9 1.6-.6 3.4-1.2 5.2-1.7 1.3 4.1 2.9 8.3 4.9 12.6-2 4.3-3.7 8.6-4.9 12.6zm2.1 11c.3-1.7.7-3.5 1.1-5.4 4.2.9 8.7 1.6 13.4 2.1 2.7 3.9 5.6 7.4 8.5 10.5-6 5.9-12.1 10-17 10-1.1 0-2-.2-2.9-.7-3.4-1.9-4.5-8-3.1-16.5zm-4.2 41.2c2.2-2.7 2.3-5.7 1.1-8.7-1.2-3-3.7-4.4-6.8-4.5-3.7-.1-7.5 0-11.2 0H16V125h3v-9.8h4.7c.6 0 1.1.2 1.4.7l6 9.3c.1.2.4.5.6.5h3.9c-2.4-3.7-4.7-7.2-7.1-10.8 2.1-.3 3.9-1 5.1-2.6zm-14.6-.2v-9.9h1.1c2.3 0 4.7-.1 7 .1 2.7.1 4.6 2.2 4.6 4.9s-2.2 4.8-4.9 4.9c-2.4.1-4.8 0-7.8 0zm38.7 1.3c-1.6-7-8-8.8-12.9-6.6-3.8 1.7-5.5 5-5.6 9.1-.1 3.1.8 5.9 3.2 8 2.7 2.4 6 2.7 9.4 2.1 1.9-.4 3.6-1.3 4.9-2.7-.5-.7-1-1.4-1.5-2-2.8 2.4-5.9 3.2-9.3 1.6-2.2-1.1-3.3-3.8-3.5-5.8h15.5v-1.3c.1-.9 0-1.7-.2-2.4zM42.6 115c-.3-3 2.7-6.2 6-6.2 3.8-.1 6.2 2.2 6.3 6.2H42.6zm30.7-8.7c-1.5-.3-3.1-.4-4.6-.3-2.4.2-4.5 1.3-6.2 3.1.5.7.9 1.4 1.5 2.2.2-.2.4-.4.6-.5 1.6-1.5 3.5-2.3 5.8-2.1 1.8.1 3.5.7 4 2.5.4 1.4.3 2.9.4 4.4-.3 0-.4-.1-.5-.2-2.4-2-5.1-2.4-8-1.7-2.7.7-4.4 2.8-4.6 5.5-.2 3.1 1.2 5.4 3.9 6.5 1.7.7 3.6.7 5.4.3 1.4-.3 2-1.1 4-2.2v1.3h2.8c0-4 .1-8.9 0-13.5 0-2.9-1.7-4.7-4.5-5.3zm1.4 12.6c-.1.3 0 .6 0 .9 0 2.1-.5 2.8-2.5 3.6-1.4.5-2.9.7-4.4.2-1.7-.5-2.9-2-2.9-3.7-.1-1.7 1-3.4 2.7-3.9 2.3-.8 4.4-.3 6.3 1.1.6.5 1 1 .8 1.8zm15.6-9.9c2.6-.8 5-.3 6.8 1.9l.3.2c.7-.6 1.3-1.2 2.1-1.9-.3-.3-.4-.5-.6-.8-2.9-3.1-8.6-3.5-12.1-1-4.9 3.6-4.8 10.6-2.4 14.3 2.3 3.5 5.6 4.7 9.5 4.2 2.3-.3 4.2-1.4 5.7-3.3-.7-.6-1.4-1.2-2.1-1.9-.2.2-.3.3-.4.5-2.7 3-7.2 2.7-9.6-.5-1.4-1.9-1.7-4.1-1.3-6.3.2-2.5 1.5-4.5 4.1-5.4zm20.8 13.6c-.2.1-.3.2-.3.2-.8.6-1.6.7-2.5.4-.9-.4-1-1.2-1.1-2v-11.4c0-.2 0 .2.1-.8h3.8v-3h-4v-5h-3v5.4h-2.6c-.2 0-.5.2-.5.4-.1.7 0 1.2 0 2.2h3.2v12.8c0 1.6.4 3 1.8 3.8 1.5.9 4.4.7 5.7-.4.2-.1.3-.5.3-.6-.3-.6-.6-1.3-.9-2z"></path>
                                </svg>
                                <svg viewBox="0 0 128 128" className="w-16 h-16">
                                    <path fill="#38bdf8" d="M13.227 56.074c-3.528 0-5.727 1.778-6.602 5.301 1.324-1.773 2.875-2.426 4.625-1.977 1 .25 1.727.977 2.523 1.801 1.301 1.324 2.801 2.852 6.079 2.852 3.523 0 5.722-1.778 6.597-5.301-1.324 1.773-2.875 2.426-4.625 1.977-1-.25-1.722-.977-2.523-1.801-1.301-1.324-2.801-2.852-6.074-2.852zM6.602 64C3.074 64 .875 65.773 0 69.3c1.324-1.777 2.875-2.425 4.625-1.976 1 .25 1.727.977 2.523 1.801 1.301 1.324 2.801 2.852 6.079 2.852 3.523 0 5.722-1.778 6.597-5.301-1.324 1.773-2.875 2.426-4.625 1.972-1-.25-1.722-.972-2.523-1.796C11.398 65.523 9.898 64 6.602 64zm0 0"></path><path fill="#fff" d="M39.676 62.75h-2.301v4.477c0 1.199.773 1.171 2.3 1.097v1.801c-3.1.375-4.323-.477-4.323-2.898V62.75h-1.704v-1.926h1.704v-2.5l2-.597v3.097h2.296v1.926zm8.8-1.926h2v9.301h-2v-1.352c-.703.977-1.8 1.579-3.25 1.579-2.527 0-4.624-2.153-4.624-4.903 0-2.773 2.097-4.898 4.625-4.898 1.449 0 2.546.597 3.25 1.574zm-2.953 7.625c1.676 0 2.954-1.25 2.954-2.972 0-1.727-1.278-2.977-2.954-2.977-1.671 0-2.949 1.25-2.949 2.977.028 1.722 1.278 2.972 2.95 2.972zm8.301-9.023c-.699 0-1.273-.602-1.273-1.278 0-.699.574-1.273 1.273-1.273.7 0 1.278.574 1.278 1.273.023.676-.579 1.278-1.278 1.278zm-1 10.699v-9.3h2v9.3zm4.324 0V56.551h2v13.574zm15.079-9.3h2.125l-2.926 9.3h-1.977l-1.926-6.273-1.949 6.273h-1.972l-2.926-9.3H62.8l1.8 6.425 1.95-6.426h1.926l1.921 6.426zm4.597-1.4c-.699 0-1.273-.6-1.273-1.277 0-.699.574-1.273 1.273-1.273.7 0 1.278.574 1.278 1.273.023.676-.551 1.278-1.278 1.278zm-1 10.7v-9.3h2v9.3zm9.227-9.55c2.074 0 3.574 1.425 3.574 3.823v5.727h-2v-5.5c0-1.426-.824-2.148-2.074-2.148-1.324 0-2.375.773-2.375 2.671v5h-2v-9.296h2v1.199c.625-1 1.625-1.477 2.875-1.477zm13.125-3.473h2v13.023h-2v-1.352c-.7.977-1.801 1.579-3.25 1.579-2.528 0-4.625-2.153-4.625-4.903 0-2.773 2.097-4.898 4.625-4.898 1.449 0 2.55.597 3.25 1.574zm-2.95 11.347c1.672 0 2.95-1.25 2.95-2.972 0-1.727-1.278-2.977-2.95-2.977-1.675 0-2.953 1.25-2.953 2.977 0 1.722 1.278 2.972 2.954 2.972zm11.672 1.926c-2.796 0-4.921-2.148-4.921-4.898 0-2.778 2.097-4.903 4.921-4.903 1.829 0 3.403.95 4.153 2.403l-1.727 1c-.398-.875-1.324-1.426-2.449-1.426-1.648 0-2.875 1.25-2.875 2.926 0 1.671 1.25 2.921 2.875 2.921 1.125 0 2.023-.574 2.477-1.421l1.722.972c-.75 1.477-2.347 2.426-4.176 2.426zm7.528-7c0 1.7 5 .676 5 4.125 0 1.852-1.625 2.875-3.625 2.875-1.852 0-3.2-.852-3.801-2.176l1.727-1c.296.852 1.046 1.352 2.074 1.352.898 0 1.574-.301 1.574-1.051 0-1.648-5-.727-5-4.05 0-1.75 1.5-2.848 3.398-2.848 1.528 0 2.801.699 3.454 1.921l-1.704.954c-.324-.727-.972-1.051-1.75-1.051-.722-.028-1.347.3-1.347.949zm8.574 0c0 1.7 5 .676 5 4.125 0 1.852-1.625 2.875-3.625 2.875-1.852 0-3.2-.852-3.8-2.176l1.726-1c.3.852 1.05 1.352 2.074 1.352.898 0 1.574-.301 1.574-1.051 0-1.648-5-.727-5-4.05 0-1.75 1.5-2.848 3.403-2.848 1.523 0 2.796.699 3.449 1.921l-1.7.954c-.328-.727-.976-1.051-1.75-1.051-.726-.028-1.351.3-1.351.949zm0 0"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-green-400">
                                    <path d="m7.83,11.76h0s-.26,1.15-.26,1.15c-.01.06-.08.11-.15.11h-.32s-.04.02-.05.04c-.29.99-.69,1.68-1.21,2.09-.45.35-1,.51-1.73.51-.66,0-1.1-.21-1.48-.63-.5-.55-.7-1.46-.58-2.55.22-2.05,1.29-4.12,3.34-4.12.62,0,1.11.19,1.45.57.36.41.54,1.02.54,1.82,0,.07-.06.13-.13.13h-1.5c-.05,0-.1-.05-.1-.1-.01-.55-.18-.82-.5-.82-.58,0-.91.78-1.09,1.21-.25.6-.38,1.26-.35,1.92.01.3.06.73.35.91.26.16.62.05.84-.12.22-.17.4-.48.47-.75.01-.04.01-.07,0-.08-.01-.01-.04-.02-.06-.02h-.39s-.08-.02-.11-.05c-.02-.02-.03-.06-.02-.09l.26-1.14c.01-.06.07-.1.13-.11h0s2.53,0,2.53,0c0,0,.01,0,.02,0,.07,0,.11.07.11.14h0Z"></path><path d="m12.18,10.45c0,.07-.06.13-.13.13h-1.38c-.09,0-.17-.07-.17-.16,0-.4-.14-.6-.42-.6s-.47.18-.47.48c0,.34.19.65.74,1.18.72.68,1.01,1.28,1,2.08-.02,1.29-.9,2.12-2.23,2.12-.68,0-1.2-.18-1.54-.54-.35-.36-.51-.9-.48-1.59,0-.07.06-.13.13-.13h1.43s.08.02.1.05c.02.03.03.06.03.09-.02.25.03.43.13.54.06.07.15.1.26.1.26,0,.42-.19.42-.51,0-.28-.08-.53-.57-1.03-.63-.61-1.19-1.24-1.17-2.23.01-.58.24-1.1.64-1.48.43-.4,1.01-.61,1.69-.61.68,0,1.2.2,1.53.58.32.36.47.88.46,1.54h0Z"></path><path d="m16.47,15.43v-6.84c.01-.07-.05-.13-.12-.13,0,0,0,0,0,0h-2.14c-.07,0-.1.06-.12.1l-3.1,6.82h0s0,0,0,0c-.03.08.03.17.12.17h1.5c.08,0,.13-.02.16-.08l.3-.71c.04-.09.04-.1.15-.1h1.43c.1,0,.1,0,.1.1l-.03.66c0,.07.06.13.13.13,0,0,0,0,0,0h1.51s.07-.02.1-.04c.02-.02.03-.06.03-.09Zm-2.65-2.28s-.02,0-.03,0c-.02,0-.03-.02-.03-.04,0,0,0,0,0,0,0-.01,0-.02.01-.04l1.07-2.65s.02-.05.03-.08c.02-.04.04-.04.05-.01,0,.02-.12,2.72-.12,2.72-.01.1-.01.11-.11.11h-.86s0-.01,0-.01h0s0,0,0,0Z"></path><path d="m19.51,8.46h-1.14c-.06,0-.13.03-.14.1l-1.58,6.86s0,.06.02.09c.03.03.07.05.11.05h1.42c.08,0,.13-.04.14-.1,0,0,.17-.78.17-.78.01-.06,0-.11-.06-.14-.03-.01-.05-.03-.08-.04l-.25-.13-.24-.13-.09-.05s-.03-.02-.02-.04c0-.03.02-.05.05-.05h.78c.23,0,.47-.01.69-.05,1.61-.3,2.68-1.59,2.71-3.34.03-1.5-.81-2.26-2.48-2.26,0,0,0,0,0,0Zm-.39,4.08h-.03c-.07,0-.08,0-.08,0,0,0,.45-1.98.45-1.98.01-.06.01-.09-.02-.11-.05-.02-.7-.37-.7-.37-.02,0-.03-.02-.02-.04,0-.03.02-.05.05-.05h1.04c.32,0,.5.3.49.79-.01.85-.42,1.74-1.17,1.77h0Z"></path>
                                </svg>
                                <svg viewBox="0 0 128 128" className="w-12 h-12 fill-current text-white">
                                    <path d="M0 46.028h24.62v12.127H12.16zm0 12.127h12.16l12.46 12.408H12.16v12.41L0 70.562zM40.282 73.74V55.417h11.33v3.661h-7.077v4.805h7.078v3.66h-7.078v6.197zm13.873 0V61.05h4.236v2.834c0-.845.565-1.708 1.13-2.271.847-.563 1.43-.845 2.276-.845.565 0 .847.282 1.13.282v3.678h-1.13c-1.13 0-1.994.282-2.559 1.127-.565.563-.847 1.689-.847 3.097v4.788zm15.566.564c-1.993 0-3.406-.846-4.535-1.972-.847-1.127-1.413-2.816-1.413-4.788 0-1.408.283-2.534.566-3.379a6.708 6.708 0 012.258-2.552c.848-.563 1.977-.845 3.124-.845.848 0 1.695.282 2.542.563.564.282 1.13.845 1.412 1.708v-1.99h4.236v12.69h-4.236V72.05c-.282.564-.848 1.127-1.412 1.69-.847.282-1.694.564-2.542.564zm1.13-3.38c1.13 0 1.694-.282 2.26-1.127.564-.563.846-1.408.846-2.253 0-1.126-.282-1.69-.847-2.534-.565-.563-1.13-.845-2.26-.845-.846 0-1.711.282-2.276.845-.564.845-.847 1.408-.847 2.534 0 .845.283 1.69.847 2.253.565.845 1.43 1.126 2.277 1.126zm10.183 2.816V61.05h3.953v1.989c.283-.863.847-1.145 1.413-1.707.864-.282 1.43-.564 2.276-.564 1.977 0 3.39.845 3.954 2.27.564-.58 1.13-1.143 1.694-1.706.847-.282 1.712-.564 2.56-.564 3.105 0 4.517 1.69 4.517 5.087v7.885h-3.953V66.7c0-.845-.282-1.409-.565-1.972-.283-.28-.847-.563-1.429-.563-.847 0-1.413.282-1.695.845-.282.281-.565 1.127-.565 2.253v6.477h-3.953V66.7c0-.845-.282-1.409-.565-1.972-.282-.28-.847-.563-1.412-.563-.582 0-1.148.282-1.711.845-.283.281-.566 1.127-.566 2.253v6.477zm35.935-7.04v1.97h-9.336c0 .846.282 1.41.847 1.972.282.281 1.129.563 1.976.563 1.412 0 1.977-.282 2.541-1.126h3.972c-.283 1.126-.848 2.253-2.259 3.098-1.13.563-2.559 1.126-4.254 1.126-2.259 0-3.953-.563-5.083-1.971a6.725 6.725 0 01-1.994-4.788c0-2.252.847-3.66 1.994-5.086 1.13-1.127 2.824-1.69 5.083-1.69 1.977 0 3.407.563 4.819 1.69 1.129 1.144 1.694 2.552 1.694 4.242zm-9.336-.564h5.364c0-.844-.281-1.408-.564-1.97-.565-.564-1.129-.564-1.977-.564-.847 0-1.694.282-2.259.563-.282.563-.564 1.127-.564 1.971zm11.596 7.604V61.05h3.97v2.834a6.192 6.192 0 011.412-2.271c.565-.563 1.413-.845 2.259-.845.283 0 .847.282 1.13.282v3.678h-1.412c-.847 0-1.695.282-2.259 1.127-.848.563-1.13 1.689-1.13 3.097v4.788z"></path>
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 text-white fill-current"
                                >
                                    <path d="M2 12h20M2 6h20M2 18h20" />
                                </svg>
                            </div>
                        </div>
                        <div className="max-md:-mt-16">
                            <h2 id="future-text" className="text-5xl md:text-7xl lg:mb-10 font-bold leading-tight tracking-tight whitespace-nowrap mb-2">
                                <span className="block lg:hidden  text-[3.3rem] max-md:text-2xl max-sm:text-5xl sm:text-4xl  font-thin leading-snug tracking-tight whitespace-normal">
                                    Let’s Create the Future of Web with Apex UI
                                </span>
                                <span className="hidden lg:inline font-thin">
                                    {"Let’s Create the Future".split("").map((char, i) => (
                                        <span key={i} className="inline-block future-char">{char === " " ? "\u00A0" : char}</span>
                                    ))}
                                    <br />
                                    {"of Web with Apex UI".split("").map((char, i) => (
                                        <span key={i + 100} className="inline-block future-char">{char === " " ? "\u00A0" : char}</span>
                                    ))}
                                </span>
                            </h2>
                        </div>
                    </div>
                </section>
                {/* Text Slide Section (only large screens) */}
                {
                    window.innerWidth > 1024 && (
                        <section className="text-slide-section h-screen flex flex-col justify-center items-center overflow-hidden mb-8 lg:mb-0 leading-none relative">
                            <div className="text-slide w-full flex flex-col items-center justify-center gap-2 relative">
                                {/* SVG stars for text-slide-1 (sparkle animation) */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[20vw] flex items-center z-0 pointer-events-none text-slide-trail-1">
                                    <svg className="absolute left-1/4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-70 text-slide-star-1" viewBox="0 0 24 24" fill="#fff200">
                                        <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                                    </svg>
                                    <svg className="absolute left-1/2 top-1/3 w-10 h-10 opacity-60 text-slide-star-2" viewBox="0 0 24 24" fill="#fff200">
                                        <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                                    </svg>
                                </div>
                                {/* SVG stars for text-slide-2 (sparkle animation) */}
                                <div className="absolute right-0 top-[70%] -translate-y-1/2 w-full h-[20vw] flex items-center z-0 pointer-events-none text-slide-trail-2">
                                    <svg className="absolute right-1/4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-70 text-slide-star-3" viewBox="0 0 24 24" fill="#fff200">
                                        <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                                    </svg>
                                    <svg className="absolute right-1/2 top-2/3 w-10 h-10 opacity-60 text-slide-star-4" viewBox="0 0 24 24" fill="#fff200">
                                        <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                                    </svg>
                                </div>
                                <h1 className="text-[7rem] md:text-[25rem] font-bold text-center w-auto text-slide-1 mt-8 md:mt-16 lg:mt-24 relative z-10" style={{ fontFamily: 'Humane-Regular', letterSpacing: '2rem', marginBottom: '-2rem' }}>
                                    EXPERIENCE THE
                                </h1>
                                <h1 className="text-[7rem] md:text-[25rem] font-bold text-center w-auto text-slide-2 mt-2 md:mt-6 lg:mt-10 relative z-10" style={{ fontFamily: 'Humane-Regular', letterSpacing: '2rem', marginTop: '-2rem' }}>
                                    MODERN WEB
                                </h1>
                            </div>
                        </section>
                    )
                }
                {/* Footer Section for all screens */}

                <footer
                    id="footer-main"
                    className="relative w-full h-auto lg:h-[57vh] overflow-hidden  bg-slate-900 px-6 pt-16 pb-8 mt-8 rounded-t-4xl border-t border-purple-400"
                >

                    <div className="max-w-6xl mx-auto text-center space-y-6 ">
                        <p className="text-sm text-white/60">
                            Created by
                            <a href="#" className="text-red-500 px-1 hover:underline">
                                ❤️
                            </a>
                        </p>
                        <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 font-medium">
                            ⭐ Star on <FontAwesomeIcon icon={faGithub} className="ml-1" />
                        </button>
                        <div className="flex justify-center gap-6">
                            <p className="text-purple-400">Feedback on</p>
                            <a href="#" className="hover:text-purple-400">
                                <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-pink-400">
                                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-10 mt-8 text-sm">
                            <div className="space-y-1">
                                <p className="font-semibold text-white">Resources</p>
                                <a href="#" className="text-white/60 hover:underline block">Documentation</a>
                                <a href="#" className="text-white/60 hover:underline block">Components</a>
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-white">Legal</p>
                                <a href="#" className="text-white/60 hover:underline block">Privacy Policy</a>
                                <a href="#" className="text-white/60 hover:underline block">Terms & Conditions</a>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white/40 pt-6 border-t border-white/10 mt-10">
                            <span>ApexUI</span>
                            <span>&copy; 2025 ApexUI. All rights reserved.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

    );
}
