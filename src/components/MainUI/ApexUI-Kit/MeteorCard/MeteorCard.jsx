import React, { useMemo } from 'react';
import './MeteorCard.css';

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="ml-2 h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

// Random positions are generated once per mount so re-renders don't reshuffle them.
const Meteors = ({ number = 20 }) => {
    const meteors = useMemo(
        () => Array.from({ length: number }, () => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.floor(Math.random() * 6) + 4}s`,
        })),
        [number]
    );
    return meteors.map((style, i) => <span key={i} className="meteor-bg" style={style} />);
};

const Particles = ({ number = 50, color = '#ffffff', speed = 1 }) => {
    const particles = useMemo(
        () => Array.from({ length: number }, () => {
            const duration = (Math.random() * 5 + 3) / (speed || 1);
            return {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * duration}s`,
                animationDuration: `${duration}s`,
            };
        }),
        [number, speed]
    );
    return particles.map((style, i) => (
        <span key={i} className="particle-bg" style={{ ...style, '--particle-color': color }} />
    ));
};

const MeteorCard = ({ data = [], particleNumber = 50, particleColor = '#ffffff', particleSpeed = 1 }) => {
    return (
        <>
            {data.map((item, index) => (
                <div key={item.id ?? item.title ?? index} className="relative w-full lg:w-[min(36rem,30vw)] min-w-0 max-w-4xl mx-auto bg-slate-800/80 p-0.5 rounded-lg moving-border-card">
                    <div className="relative bg-slate-900 rounded-lg p-4 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden">
                        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                            <Meteors number={5} />
                            <Particles number={particleNumber} color={particleColor} speed={particleSpeed} />
                        </div>

                        <div className="hidden md:block absolute -top-1/3 -left-1/3 w-2/3 h-2/3 bg-blue-400/90 rounded-full blur-[120px] pointer-events-none z-0"></div>

                        <div className="relative w-full md:w-1/2 h-64 md:h-auto md:self-stretch rounded-md overflow-hidden z-10">
                            <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover lg:aspect-square" />
                        </div>

                        <div className="relative w-full md:w-1/2 text-center md:text-left z-10">
                            <h3 className="text-3xl font-bold mb-2 text-white">{item.title}</h3>
                            <p className="text-gray-400 mb-6">{item.description}</p>
                            <button
                                type="button"
                                onClick={item.onClick}
                                className="group relative inline-flex w-full md:w-auto items-center justify-center px-6 py-2 bg-lime-600 text-white font-semibold rounded-md overflow-hidden transition-colors duration-300 hover:bg-lime-700"
                            >
                                <span className="mx-auto">{item.buttonText}</span>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default MeteorCard;
