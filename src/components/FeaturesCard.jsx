/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from 'framer-motion';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        ),
        color: "text-indigo-500",
        title: "Smooth Experience",
        desc: "Built with GSAP and Locomotive Scroll for a buttery smooth UI journey."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.72 0l-.7.7M6.34 17.66l-.7.7" />
            </svg>
        ),
        color: "text-purple-500",
        title: "Dark First Design",
        desc: "Every component crafted to look elegant in dark mode by default."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-3-6a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
        ),
        color: "text-green-500",
        title: "Developer Focused",
        desc: "No complexity — just Tailwind, HTML, and useful animations."
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
            </svg>
        ),
        color: "text-yellow-500",
        title: "Rapid Setup",
        desc: "Start building in seconds with clean, component-ready structure."
    }
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18
        }
    }
};

const cardVariants = {
    offscreen: { opacity: 0, y: 60 },
    onscreen: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.22,
            duration: 0.7,
        }
    }
};

const FeaturesCard = () => {
    // Detect mobile screen
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1080;

    return (
        <section className="features-cards bg-gradient-to-b to-[#060010] from-[#020E22] py-16 px-4 w-full -mb-1">
            <motion.div
                className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                data-scroll data-scroll-speed="2"
                variants={isMobile ? containerVariants : undefined}
                initial={isMobile ? "hidden" : undefined}
                whileInView={isMobile ? "show" : undefined}
                viewport={isMobile ? { once: true, amount: 0.2 } : undefined}
            >
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        className="feature-card bg-white/5   text-white p-5 border border-purple-800 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer rounded-xl shadow-lg"
                        variants={isMobile ? cardVariants : undefined}
                        initial={isMobile ? "offscreen" : undefined}
                        whileInView={isMobile ? "onscreen" : undefined}
                        viewport={isMobile ? { once: true, amount: 0.3 } : undefined}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={f.color}>{f.icon}</div>
                            <h3 className="text-lg font-semibold">{f.title}</h3>
                        </div>
                        <p className="text-sm opacity-70">{f.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default FeaturesCard;
