/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsTwitterX } from "react-icons/bs";
// --- ICONS (unchanged) ---
const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.54 2.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);
const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);
const TwitterIcon = () => (
    <BsTwitterX size={17} />
);


const ACCENT = "#B0DC3C";
const stop = (e) => e.stopPropagation();
const socialBtn = "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-[#B0DC3C]/50 hover:text-[#B0DC3C]";

const FlipProfile = ({
    name = "Iron Man",
    role = "AI Engineer",
    dob = "5th March, 1999",
    avatar = "https://ik.imagekit.io/ny6yinyut/apexui/assets/ironman.png?tr=f-auto,q-80,w-480",
    github = "#",
    linkedin = "#",
    twitter = "#",
    resumeLink = "/Iron-Man-Resume.pdf",
    hireLink = "#",
    bgColor = "#0F172B"
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const cardVariants = {
        flipped: { rotateY: 180 },
        initial: { rotateY: 0 }
    };

    // Staggered animation for the back content
    const backContentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 }
    };

    // Shared face styles: accent glow at the top and a faint grid
    const faceStyle = {
        backgroundColor: bgColor,
        backgroundImage: `radial-gradient(120% 60% at 50% 0%, ${ACCENT}26, transparent 60%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)`,
        backgroundSize: "auto, 22px 22px, 22px 22px",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
    };

    return (
        <div className="w-full flex items-center justify-center p-4" style={{ perspective: "1200px" }}>
            <motion.div
                // Sized in rem (300×420 at a 16px root) so the card grows with its rem-based content.
                className="relative w-[18.75rem] max-w-full h-[26.25rem] cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                variants={cardVariants}
                animate={isFlipped ? "flipped" : "initial"}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* --- FRONT OF THE CARD --- */}
                <div
                    className="absolute inset-0 rounded-[1.75rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 flex flex-col items-center p-6 text-center text-white"
                    style={faceStyle}
                >
                    <div className="flex w-full items-center justify-between">
                        <span className="rounded-full border border-[#B0DC3C]/30 bg-[#B0DC3C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B0DC3C]">Profile</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60" aria-hidden="true">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
                        </span>
                    </div>

                    {/* Avatar with a slowly spinning accent ring */}
                    <div className="relative mt-6 h-36 w-36">
                        <div className="absolute inset-0 rounded-full animate-[spin_6s_linear_infinite]" style={{ background: `conic-gradient(from 0deg, ${ACCENT}, transparent 35%, ${ACCENT}55 60%, transparent 80%, ${ACCENT})` }} />
                        <div className="absolute inset-[3px] rounded-full" style={{ backgroundColor: bgColor }} />
                        <img src={avatar} alt={name} className="absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)] rounded-full object-cover" />
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight">{name}</h2>
                    <p className="mt-1.5 rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-[#B0DC3C]">{role}</p>

                    <p className="mt-auto flex items-center gap-1.5 text-xs text-white/50">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V6a3 3 0 0 1 6 0v8" /><path d="M5 15a7 7 0 0 0 14 0v-1a2 2 0 0 0-4 0" /></svg>
                        Tap to flip
                    </p>
                </div>

                {/* --- BACK OF THE CARD --- */}
                <div
                    className="absolute inset-0 rounded-[1.75rem] overflow-hidden border border-[#B0DC3C]/30 shadow-2xl shadow-black/50 p-6 text-white"
                    style={{ ...faceStyle, transform: "rotateY(180deg)" }}
                >
                    <AnimatePresence>
                        {isFlipped && (
                            <motion.div
                                className="flex h-full w-full flex-col"
                                variants={backContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <motion.div variants={itemVariants} className="flex items-center gap-3">
                                    <img src={avatar} alt="" className="h-12 w-12 rounded-full border-2 border-[#B0DC3C] object-cover" />
                                    <div className="min-w-0 text-left">
                                        <p className="truncate text-lg font-bold leading-tight">{name}</p>
                                        <p className="truncate text-xs text-[#B0DC3C]">{role}</p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Born</p>
                                    <p className="mt-1 text-sm font-medium text-white/90">{dob}</p>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-4 flex items-center gap-2.5">
                                    <a href={github} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label="GitHub" className={socialBtn}><GitHubIcon /></a>
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label="LinkedIn" className={socialBtn}><LinkedInIcon /></a>
                                    <a href={twitter} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label="X (Twitter)" className={socialBtn}><TwitterIcon /></a>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-auto flex flex-col gap-2.5">
                                    <motion.a whileTap={{ scale: 0.97 }} href={hireLink} onClick={stop} className="w-full rounded-xl bg-[#B0DC3C] py-2.5 text-center text-sm font-bold text-slate-950 transition hover:brightness-110">
                                        Hire Me
                                    </motion.a>
                                    <motion.a whileTap={{ scale: 0.97 }} href={resumeLink} download onClick={stop} className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                                        Download CV
                                    </motion.a>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default FlipProfile;
