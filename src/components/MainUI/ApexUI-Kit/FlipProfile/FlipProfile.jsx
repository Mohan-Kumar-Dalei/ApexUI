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


const FlipProfile = ({
    name = "Iron Man",
    role = "AI Engineer",
    dob = "5th March, 1999",
    avatar = "/assets/ironman.png",
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
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full flex items-center justify-center p-4 min-h-[450px]" style={{ perspective: "1200px" }}>
            <motion.div
                className="relative w-full max-w-sm h-[420px] cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                variants={cardVariants}
                animate={isFlipped ? "flipped" : "initial"}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* --- FRONT OF THE CARD --- */}
                <motion.div
                    className="absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[#B0DC3C] backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white"
                    style={{
                        background: bgColor,
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className="absolute inset-0 w-full h-full border-2 border-[#B0DC3C] rounded-3xl animate-pulse pointer-events-none opacity-30"></div>
                    <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#B0DC3C] object-cover shadow-lg shadow-fuchsia-900/50 mb-4" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-500 to-white bg-clip-text text-transparent">{name}</h2>
                    <p className="text-lg font-medium text-green-200/90">{role}</p>
                    <p className="mt-4 text-xs text-gray-100">Click to flip</p>
                </motion.div>

                {/* --- BACK OF THE CARD --- */}
                <motion.div
                    className="absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white"
                    style={{
                        background: bgColor,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    <AnimatePresence>
                        {isFlipped && (
                            <motion.div
                                className="flex flex-col items-center justify-center w-full h-full"
                                variants={backContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <motion.p variants={itemVariants} className="text-sm text-cyan-300">DOB: {dob}</motion.p>
                                <motion.div variants={itemVariants} className="w-1/2 h-px bg-cyan-400/30 my-4" />

                                <motion.div variants={itemVariants} className="flex gap-5 items-center justify-center text-cyan-300">
                                    <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><GitHubIcon /></a>
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><LinkedInIcon /></a>
                                    <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><TwitterIcon /></a>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-3 w-full items-center">
                                    <motion.a whileTap={{ scale: 0.95 }} href={hireLink} className="w-full max-w-xs text-center px-6 py-2.5 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-full font-semibold shadow-lg shadow-cyan-900/40 transition-all">
                                        Hire Me
                                    </motion.a>
                                    <motion.a whileTap={{ scale: 0.95 }} href={resumeLink} download className="w-full max-w-xs text-center px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-md transition-all">
                                        Download CV
                                    </motion.a>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default FlipProfile;