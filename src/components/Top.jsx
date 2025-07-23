import React, { useState, useEffect } from "react";

const Top = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Use LocomotiveScroll if available
        let locoScroll = window.locoScroll;
        const handleScroll = () => {
            let scrollY = locoScroll && locoScroll.scroll && locoScroll.scroll.instance
                ? locoScroll.scroll.instance.scroll.y
                : window.scrollY;
            setVisible(scrollY > 200);
        };

        if (locoScroll) {
            locoScroll.on('scroll', handleScroll);
        } else {
            window.addEventListener("scroll", handleScroll);
        }
        // Initial check
        handleScroll();
        return () => {
            if (locoScroll) {
                locoScroll.off('scroll', handleScroll);
            } else {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const scrollToTop = () => {
        let locoScroll = window.locoScroll;
        if (locoScroll) {
            locoScroll.scrollTo(0, { duration: 900, disableLerp: true });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#181824] to-[#2d2250] text-white p-3 rounded-full shadow-xl border border-[#23233a] transition-opacity duration-300 hover:bg-[#2d2250] hover:shadow-purple-900/40 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-label="Scroll to top"
        >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12L12 5L19 12" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
};

export default Top;
