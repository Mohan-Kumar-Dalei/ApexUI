import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { BsTwitterX } from "react-icons/bs";
// --- SVG Icons (No changes here) --- //
const GitHubIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>);
const LinkedInIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
const TwitterIcon = () => (<BsTwitterX size={24} />);
const InstagramIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>);
const defaultProfile = {
    avatarUrl: "/assets/spiderman.png",
    name: "Spider Man",
    username: "spider_man",
    dob: "10-08-2001",
    title: "PhotoGrapher",
    status: "Available for Hire",
    socialLinks: {
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        twitter: "https://twitter.com/",
        instagram: "https://www.instagram.com/",
    },
    onHireClick: () => alert("Hire Me button clicked!"),
    onCvClick: () => alert("CV button clicked!"),
};

const ParallaxProfileCard = ({ profile }) => {
    const {
        avatarUrl, name, username, dob, title, status, socialLinks, onHireClick, onCvClick
    } = profile || defaultProfile;

    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const handleMouseMove = (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left; const y = e.clientY - top;
            const rotateX = gsap.utils.mapRange(0, height, -9, 9, y);
            const rotateY = gsap.utils.mapRange(0, width, 9, -9, x);
            gsap.to(card, { duration: 0.7, rotationX: rotateX, rotationY: rotateY, scale: 1.05, ease: "power3.out" });
        };
        const handleMouseLeave = () => {
            gsap.to(card, { duration: 1, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)" });
        };
        gsap.set(card, { transformPerspective: 1000 });
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="relative w-[300px] h-[440px] bg-[#1D2B3A] rounded-3xl p-6 border border-cyan-400/30 shadow-2xl shadow-cyan-900/40 flex flex-col"
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D2B3A] to-[#111827] rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.08), transparent 70%)", transform: "translateZ(20px)" }}></div>

            <div className="relative z-10 flex flex-col items-center justify-between h-full" style={{ transform: "translateZ(50px)" }}>
                {/* Top Part */}
                <div className="text-center">
                    <img src={avatarUrl} alt="Profile" className="w-28 h-28 rounded-full mx-auto mb-3 border-4 border-cyan-400 shadow-lg object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/1D2B3A/A5F3FC?text=ERR"; }} />
                    <h2 className="text-2xl font-bold text-cyan-300 tracking-wide">{name}</h2>
                    <div className="flex flex-col items-center mt-1">
                        <span className="text-xs font-semibold text-slate-300 bg-slate-700 px-2 py-0.5 rounded-full mb-1">@{username}</span>
                        <span className="text-xs font-medium text-cyan-400 bg-slate-700 px-2 py-0.5 rounded-full">DOB: {dob}</span>
                    </div>
                </div>

                {/* Bottom Part */}
                <div className="w-full text-center">
                    <p className="text-slate-400 text-lg">{title}</p>
                    {status && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                            <span className="text-green-300 text-sm">{status}</span>
                        </div>
                    )}
                    <div className="flex justify-center gap-4 my-4">
                        {socialLinks?.github && (<a href={socialLinks.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-cyan-400 hover:text-white transition-colors duration-200"><GitHubIcon /></a>)}
                        {socialLinks?.linkedin && (<a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-cyan-400 hover:text-white transition-colors duration-200"><LinkedInIcon /></a>)}
                        {socialLinks?.twitter && (<a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-cyan-400 hover:text-white transition-colors duration-200"><TwitterIcon /></a>)}
                        {socialLinks?.instagram && (<a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-cyan-400 hover:text-white transition-colors duration-200"><InstagramIcon /></a>)}
                    </div>

                    {/* Buttons Section */}
                    <div className="flex justify-center gap-3">
                        <button onClick={onHireClick} className="w-1/2 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors duration-300">
                            Hire Me
                        </button>
                        <button onClick={onCvClick} className="w-1/2 bg-slate-700 text-cyan-300 font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                            CV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ParallaxProfile = ({ profiles = [defaultProfile], className = '' }) => {
    const safe = Array.isArray(profiles) && profiles.length > 0 ? profiles : [defaultProfile];
    return (
        <div className={`flex flex-wrap gap-6 justify-center ${className}`}>
            {safe.map((p, i) => (
                <ParallaxProfileCard key={p.id || p.username || i} profile={p} />
            ))}
        </div>
    );
};

export { ParallaxProfileCard };
export default ParallaxProfile;