import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { BsTwitterX } from "react-icons/bs";

const GitHubIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>);
const LinkedInIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
const TwitterIcon = () => (<BsTwitterX size={24} />);
const InstagramIcon = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>);

const defaultProfile = {
    avatarUrl: "/assets/spiderman.png",
    name: "Spider Man",
    username: "spider_man",
    dob: "10-08-2001",
    title: "Photographer",
    status: "Available for Hire",
    socials: {
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/",
        twitter: "https://twitter.com/",
        instagram: "https://www.instagram.com/",
    },
};

// Renders a link when `href` is given, otherwise a button.
const ActionButton = ({ href, onClick, className, children }) =>
    href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} text-center`}>{children}</a>
    ) : (
        <button type="button" onClick={onClick} className={className}>{children}</button>
    );

const ParallaxProfileCard = ({ profile }) => {
    // Missing fields fall back to the defaults; `socials` and the older
    // `socialLinks` key are both accepted.
    const merged = { ...defaultProfile, ...profile };
    const { avatarUrl, name, username, dob, title, status, onHireClick, onCvClick, hireLink, cvLink } = merged;
    const socialLinks = profile?.socials ?? profile?.socialLinks ?? defaultProfile.socials;

    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return undefined;
        gsap.set(card, { transformPerspective: 1000 });
        // quickTo reuses one tween per property instead of creating one per mousemove.
        const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
        const scale = gsap.quickTo(card, "scale", { duration: 0.6, ease: "power3.out" });

        const handleMove = (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            rotX(gsap.utils.mapRange(0, height, 9, -9, e.clientY - top));
            rotY(gsap.utils.mapRange(0, width, -9, 9, e.clientX - left));
            scale(1.04);
        };
        const handleLeave = () => {
            rotX(0);
            rotY(0);
            scale(1);
        };
        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", handleLeave);
        return () => {
            card.removeEventListener("pointermove", handleMove);
            card.removeEventListener("pointerleave", handleLeave);
            gsap.killTweensOf(card);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="relative w-[300px] h-[440px] bg-[#1D2B3A] rounded-3xl p-6 border border-cyan-400/30 shadow-2xl shadow-cyan-900/40 flex flex-col will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1D2B3A] to-[#111827] rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.08), transparent 70%)", transform: "translateZ(20px)" }}></div>

            <div className="relative z-10 flex flex-col items-center justify-between h-full" style={{ transform: "translateZ(50px)" }}>
                <div className="text-center">
                    <img src={avatarUrl} alt={name} className="w-28 h-28 rounded-full mx-auto mb-3 border-4 border-cyan-400 shadow-lg object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/128x128/1D2B3A/A5F3FC?text=ERR"; }} />
                    <h2 className="text-2xl font-bold text-cyan-300 tracking-wide">{name}</h2>
                    <div className="flex flex-col items-center mt-1">
                        {username && <span className="text-xs font-semibold text-slate-300 bg-slate-700 px-2 py-0.5 rounded-full mb-1">@{username}</span>}
                        {dob && <span className="text-xs font-medium text-cyan-400 bg-slate-700 px-2 py-0.5 rounded-full">DOB: {dob}</span>}
                    </div>
                </div>

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

                    <div className="flex justify-center gap-3">
                        <ActionButton href={hireLink} onClick={onHireClick} className="w-1/2 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors duration-300">
                            Hire Me
                        </ActionButton>
                        <ActionButton href={cvLink} onClick={onCvClick} className="w-1/2 bg-slate-700 text-cyan-300 font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                            CV
                        </ActionButton>
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
