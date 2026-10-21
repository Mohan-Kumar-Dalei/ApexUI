import React, { useMemo } from 'react';
import './MeteorCard.css';
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

// Meteor Effect Component
// Positions are picked once (useMemo), so re-renders don't make the meteors jump.
const Meteors = ({ number = 20 }) => {
    const meteors = useMemo(() => [...Array(number)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${Math.floor(Math.random() * 6) + 4}s`,
    })), [number]);
    return <>{meteors.map((style, i) => <span key={i} className="meteor-bg" style={style}></span>)}</>;
};

// Particle Effect Component
const Particles = ({ number = 50, color = '#ffffff', speed = 1 }) => {
    const particles = useMemo(() => [...Array(number)].map(() => {
        const animationDuration = (Math.random() * 5 + 3) / speed;
        return {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * animationDuration}s`,
            animationDuration: `${animationDuration}s`,
        };
    }), [number, speed]);
    return <>{particles.map((style, i) => <span key={i} className="particle-bg" style={{ '--particle-color': color, ...style }}></span>)}</>;
};

// Main MeteorCard Component
// A fixed-size card (image on top, content below) so it looks the same on every screen.
const MeteorCard = ({ data, particleNumber, particleColor, particleSpeed }) => {
    return (
        <div className="flex flex-wrap justify-center gap-6">
            {data.map((item, index) => (
                <div key={index} className="relative w-[320px] max-w-full bg-slate-800/80 p-0.5 rounded-2xl moving-border-card">
                    {/* Card ka content container */}
                    <div className="relative bg-slate-900 rounded-[calc(1rem-2px)] p-3 flex flex-col overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <Meteors number={5} />
                            <Particles
                                number={particleNumber}
                                color={particleColor}
                                speed={particleSpeed}
                            />
                        </div>

                        {/* Spotlight Effect */}
                        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-1/2 bg-blue-400/60 rounded-full blur-[90px] pointer-events-none z-0"></div>

                        {/* Image */}
                        <div className="relative h-[220px] w-full rounded-xl overflow-hidden z-10 ring-1 ring-white/10">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover object-[center_25%]" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 px-2 pt-4 pb-2 text-center">
                            <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-400 mb-5">{item.description}</p>
                            <button className="group relative inline-flex w-full items-center justify-center whitespace-nowrap px-6 py-2.5 bg-lime-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:bg-lime-700">
                                <span>{item.buttonText}</span>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MeteorCard;