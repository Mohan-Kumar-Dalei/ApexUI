import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { FiMessageCircle, FiCheck } from "react-icons/fi";
import { toast } from 'sonner';
export default function FeedbackButton() {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const modalRef = useRef(null);
    const dotRefs = useRef([]);
    const checkRef = useRef(null);
    const formRef = useRef(null);

    const accessKey = "17a68c11-3e40-4879-ba02-65457533f959";

    const openModal = () => {
        setOpen(true);
        gsap.fromTo(
            modalRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
    };

    const closeModal = () => {
        gsap.to(modalRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setOpen(false);
                resetButton();
                formRef.current?.reset();
            },
        });
    };

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

        // Animate bouncing dots
        dotRefs.current.forEach((dot, i) => {
            gsap.to(dot, {
                y: -6,
                opacity: 1,
                repeat: -1,
                yoyo: true,
                delay: i * 0.2,
                duration: 0.4,
                ease: "power1.inOut",
            });
        });

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                gsap.killTweensOf(dotRefs.current);
                gsap.to(dotRefs.current, { opacity: 0 });

                gsap.fromTo(
                    checkRef.current,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
                );

                formRef.current?.reset();
                toast.success("Feedback sent successfully!");

                setTimeout(() => {
                    resetButton();
                }, 2000);
            } else {
                toast.error("Failed to send feedback. Try again.");
                resetButton();
            }
        } catch (err) {
            console.error("Web3Forms error:", err);
            toast.error("Error sending feedback. Please check your connection.");
            resetButton();
        }
    };

    return (
        <>
            {/* Floating Feedback Button */}
            <button
                onClick={openModal}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition"
            >
                <FiMessageCircle size={24} />
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="bg-[#111] text-white w-full max-w-md p-6 rounded-xl relative shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-purple-500 text-3xl">
                                <FiMessageCircle />
                            </div>
                            <h1 className="text-lg font-semibold text-white">Feedback</h1>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your email"
                                required
                                className="w-full bg-white/10 p-3 rounded-md text-white focus:outline-none"
                            />
                            <textarea
                                name="message"
                                placeholder="Write your feedback..."
                                rows={4}
                                required
                                className="w-full bg-white/10 p-3 rounded-md text-white resize-none focus:outline-none"
                            />

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 transition font-bold py-3 rounded-md relative overflow-hidden"
                            >
                                <div className="flex items-center justify-center gap-2 min-h-[24px] relative">
                                    {!submitted && <span>Submit Feedback</span>}

                                    {/* Bouncing Dots */}
                                    <span className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                ref={(el) => (dotRefs.current[i] = el)}
                                                className="w-2 h-2 rounded-full bg-white opacity-0"
                                            />
                                        ))}
                                    </span>

                                    {/* Check Icon */}
                                    <span
                                        ref={checkRef}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 scale-0"
                                    >
                                        <FiCheck size={20} />
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
