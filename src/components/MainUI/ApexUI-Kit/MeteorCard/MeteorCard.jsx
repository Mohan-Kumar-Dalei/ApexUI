import React from 'react';
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
const Meteors = ({ number = 20 }) => {
    const meteors = [...Array(number)].map((_, i) => (
        <span
            key={i}
            className="meteor-bg"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.floor(Math.random() * 6) + 4}s`,
            }}
        ></span>
    ));
    return <>{meteors}</>;
};

// Particle Effect Component
const Particles = ({ number = 50, color = '#ffffff', speed = 1 }) => {
    const particles = [...Array(number)].map((_, i) => {
        const animationDuration = (Math.random() * 5 + 3) / speed;
        return (
            <span
                key={i}
                className="particle-bg"
                style={{
                    '--particle-color': color,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * animationDuration}s`,
                    animationDuration: `${animationDuration}s`,
                }}
            ></span>
        );
    });
    return <>{particles}</>;
};

// Main MeteorCard Component
const MeteorCard = ({ data, particleNumber, particleColor, particleSpeed }) => {
    return (
        <>
            {data.map((item, index) => (
                <div key={index} className="relative w-full lg:w-[30vw] max-w-4xl mx-auto bg-slate-800/80 p-0.5 rounded-lg moving-border-card">
                    {/* Card ka content container */}
                    <div className="relative bg-slate-900 rounded-lg p-4 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <Meteors number={5} />
                            <Particles
                                number={particleNumber}
                                color={particleColor}
                                speed={particleSpeed}
                            />
                        </div>

                        {/* Spotlight Effect (hide on small screens to reduce visual noise) */}
                        <div className="hidden md:block absolute -top-1/3 -left-1/3 w-2/3 h-2/3 bg-blue-400/90 rounded-full blur-[120px] pointer-events-none z-0"></div>

                        {/* Left Side: Image */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-full rounded-md overflow-hidden z-10">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover lg:aspect-square" />
                        </div>

                        {/* Right Side: Content */}
                        <div className="relative w-full md:w-2/3 text-center md:text-left z-10">
                            <h3 className="text-3xl font-bold mb-2 text-white">{item.title}</h3>
                            <p className="text-gray-400 mb-6">{item.description}</p>
                            <button className="group relative inline-flex md:inline-flex w-full md:w-auto items-center justify-center px-6 py-2 bg-lime-600 text-white font-semibold rounded-md overflow-hidden transition-all duration-300 hover:bg-lime-700">
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