import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { FiMessageCircle, FiCheck, FiX } from "react-icons/fi";
import { toast } from 'sonner';

export default function FeedbackButton() {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const modalRef = useRef(null);
    const fabRef = useRef(null);
    const dotRefs = useRef([]);
    const checkRef = useRef(null);
    const formRef = useRef(null);

    const accessKey = "17a68c11-3e40-4879-ba02-65457533f959";

    // Updated GSAP transition for a smoother, vertical entrance
    const openModal = () => {
        setOpen(true);
        gsap.fromTo(
            modalRef.current,
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
    };

    // Updated GSAP transition for closing
    const closeModal = () => {
        gsap.to(modalRef.current, {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.3,
            ease: "power3.in",
            onComplete: () => {
                setOpen(false);
                resetButton();
                formRef.current?.reset();
            },
        });
    };

    // All your internal logic remains the same
    const resetButton = () => {
        setSubmitted(false);
        gsap.set(dotRefs.current, { y: 0, opacity: 0 });
        gsap.set(checkRef.current, { scale: 0, opacity: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitted) return;
        setSubmitted(true);

        const formData = new FormData(formRef.current);
        formData.append("access_key", accessKey);
        formData.append("subject", "New Feedback from ApexUI");

        dotRefs.current.forEach((dot, i) => {
            gsap.to(dot, {
                y: -6, opacity: 1, repeat: -1, yoyo: true,
                delay: i * 0.2, duration: 0.4, ease: "power1.inOut",
            });
        });

        try {
            const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
            if (res.ok) {
                gsap.killTweensOf(dotRefs.current);
                gsap.to(dotRefs.current, { opacity: 0 });
                gsap.fromTo(checkRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
                formRef.current?.reset();
                toast.success("Feedback sent successfully!");
                setTimeout(closeModal, 1500);
            } else {
                toast.error("Failed to send feedback. Try again.");
                resetButton();
            }
        } catch (err) {
            toast.error("Error sending feedback.");
            resetButton();
        }
    };

    return (
        <>
            <button
                ref={fabRef}
                onClick={openModal}
                className="group fixed bottom-8 right-8 z-50 h-16 w-16 bg-lime-400 text-slate-900 rounded-2xl shadow-lg shadow-lime-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lime-500/30 hover:rounded-3xl"
            >
                <FiMessageCircle size={28} className="transition-transform duration-300 group-hover:rotate-12" />
            </button>

            {open && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[1999] flex items-center justify-center p-4">
                    <div
                        ref={modalRef}
                        className="bg-slate-900 w-full max-w-sm p-8 rounded-2xl relative shadow-2xl border border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-center flex-col">
                            <div className="text-lime-400 text-3xl"><FiMessageCircle /></div>
                            <h1 className="text-xl font-bold text-slate-100">Share Your Feedback</h1>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email" name="email" placeholder="Your email" required
                                className="w-full bg-slate-800 p-3 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 border border-transparent transition"
                            />
                            <textarea
                                name="message" placeholder="What could be better?" rows={4} required
                                className="w-full bg-slate-800 p-3 rounded-lg text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-lime-400 border border-transparent transition"
                            />

                            <button
                                type="submit"
                                className="w-full bg-lime-400 hover:bg-lime-500 text-slate-900 transition-all duration-300 font-bold py-3 rounded-lg relative overflow-hidden transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-400/20"
                            >
                                <div className="flex items-center justify-center gap-2 min-h-[24px] relative">
                                    {!submitted && <span>Submit</span>}
                                    <span className="flex gap-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <span key={i} ref={(el) => (dotRefs.current[i] = el)} className="w-2 h-2 rounded-full bg-slate-900 opacity-0" />
                                        ))}
                                    </span>
                                    <span ref={checkRef} className="absolute inset-0 flex items-center justify-center opacity-0 scale-0 text-slate-900">
                                        <FiCheck size={24} />
                                    </span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}