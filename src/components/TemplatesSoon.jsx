import React, { useLayoutEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { toast } from "sonner";
import BluePrintBackground from "./BluePrintBackground";
import SidebarBadge from "./SidebarBadge";
// --- Waitlist Form ---
const WaitlistForm = () => {
    const [email, setEmail] = useState("");

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter a valid email.");
            return;
        }

        let stored = JSON.parse(localStorage.getItem("waitlist")) || [];
        if (stored.includes(email)) {
            toast.warning("You are already on our waitlist!");
            return;
        }

        try {
            // Use FormData so you can append a "subject" field
            const formData = new FormData();
            formData.append("access_key", "17a68c11-3e40-4879-ba02-65457533f959");
            formData.append("email", email);
            formData.append("subject", "New WaitList from ApexUI");


            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                // DON'T set Content-Type when sending FormData; browser sets it automatically
                body: formData,
            });

            if (res.ok) {
                stored.push(email);
                localStorage.setItem("waitlist", JSON.stringify(stored));
                toast.success("Thanks for joining our waitlist!");
                setEmail("");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Network error, try again later.", error);
        }
    };

    return (
        <form
            onSubmit={handleJoin}
            className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center"
        >
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg w-72 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <button
                type="submit"
                className="px-6 py-3 bg-lime-400 text-slate-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors shadow-md"
            >
                Join Waitlist
            </button>
        </form>
    );
};

// Helper to split text into spans
const splitTexth1 = (text) =>
    text.split("").map((char, i) => (
        <span key={i} style={{ display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ));
const splitTextp = (text) =>
    text.split("").map((char, i) => (
        <span key={i} style={{ display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ));

// --- Main Component ---
export default function TechShowcasePage() {
    const headingWrapperRef = useRef(null);
    const subtextWrapperRef = useRef(null);
    const badgeRef = useRef(null);
    const logoRef = useRef(null);
    const formRef = useRef(null);
    const buttonRef = useRef(null);

    useLayoutEffect(() => {
        // Animate heading letters
        if (headingWrapperRef.current) {
            const letters = headingWrapperRef.current.querySelectorAll("span");
            gsap.fromTo(
                letters,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.01,
                    ease: "elastic.inOut",
                    duration: 2,
                }
            );
        }

        // Blur reveal for other elements
        [badgeRef, logoRef, formRef, buttonRef, subtextWrapperRef].forEach((ref) => {
            if (ref.current) {
                gsap.fromTo(
                    ref.current,
                    { opacity: 0, filter: "blur(16px)" },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power2.out",
                        delay: 1,
                    }
                );
            }
        });
    }, []);

    return (
        <div className="relative bg-slate-900 min-h-screen font-sans text-white flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* ✅ Infinite Background */}
            <BluePrintBackground />

            {/* ✅ Logo Left */}
            <div
                ref={logoRef}
                className="absolute top-6 left-8 text-4xl font-extrabold text-white"
                style={{ fontFamily: "Righteous, sans-serif" }}
            >
                Apex<span className="text-lime-400">UI</span>
            </div>

            {/* ✅ Main Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
                <div ref={badgeRef}>
                    <SidebarBadge className="py-3 px-4 bg-slate-800">
                        🚀 Coming Soon
                    </SidebarBadge>
                </div>

                {/* ✅ Heading (wrapped spans) */}
                <h1
                    ref={headingWrapperRef}
                    className="mt-6 text-5xl md:text-6xl font-extrabold text-gray-300"
                >
                    {splitTexth1("Templates are on the way!")?.length > 0
                        ? splitTexth1("Templates are on the way!")
                        : "Templates are on the way!"}
                </h1>

                {/* ✅ Subtext (wrapped spans) */}
                <p className="mt-4 max-w-xl text-lg text-slate-400">
                    <span ref={subtextWrapperRef}>
                        {splitTextp("Get ready for stunning, modern UI templates built with React, TailwindCSS, Framer Motion, and GSAP.")}
                    </span>
                </p>

                {/* ✅ Waitlist Form */}
                <div ref={formRef}>
                    <WaitlistForm />
                </div>
            </div>

            {/* ✅ Bottom Right Button */}
            <div className="absolute bottom-6 right-6">
                <NavLink
                    ref={buttonRef}
                    to="/components"
                    className="px-6 py-3 bg-lime-800 text-white font-semibold rounded-lg border border-slate-600 hover:bg-lime-600 transition-colors shadow-lg"
                >
                    Go to Components
                </NavLink>
            </div>
        </div>
    );
}
