import React, { useRef, useEffect, useState } from "react";

const people = [
    {
        name: "Arjun Sharma",
        job: "Frontend Dev",
        img: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
        name: "Priya Mehra",
        job: "Product Designer",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        name: "Rahul Verma",
        job: "Backend Engineer",
        img: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
        name: "Neha Kapoor",
        job: "AI Researcher",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Kunal Joshi",
        job: "DevOps Expert",
        img: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    {
        name: "Ankita Rao",
        job: "UI Specialist",
        img: "https://randomuser.me/api/portraits/women/66.jpg",
    },
];

const PointerFollower = ({ cursorColor = "#fff", interval = 3000, badgeColor = "#fff", badgeTextColor = "#212121" }) => {
    const containerRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // 🛠️ Auto cycle with sync fix
    useEffect(() => {
        if (hovered) return;

        const autoInterval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % people.length);
        }, interval);

        return () => clearInterval(autoInterval);
    }, [hovered, interval]);

    // 🖱️ Mouse tracking
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            setPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setHovered(true);
        };

        const handleLeave = () => {
            setHovered(false);
        };

        container.addEventListener("pointermove", handleMove);
        container.addEventListener("pointerleave", handleLeave);

        return () => {
            container.removeEventListener("pointermove", handleMove);
            container.removeEventListener("pointerleave", handleLeave);
        };
    }, []);

    const person = people[activeIndex]; // ✅ SYNCED HERE

    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            <div ref={containerRef} className="relative w-72 h-72 cursor-none">
                {/* 🔁 Image stack with auto fade */}
                {people.map((p, i) => (
                    <img
                        key={i}
                        src={p.img}
                        alt={p.name}
                        className={`absolute w-full h-full object-cover rounded-xl transition-opacity duration-1000 ease-in-out border border-white/10`}
                        style={{
                            transform: `translate(${i * -2}px, ${i * -2}px)`,
                            zIndex: people.length - i,
                            opacity: activeIndex === i ? 1 : 0,
                        }}
                    />
                ))}
                {/* 🖱️ Custom SVG Cursor */}
                {hovered && (
                    <>
                        <div
                            className="absolute z-50"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill={cursorColor}
                                    stroke="#000"
                                    strokeWidth="1.8"
                                    d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
                                />
                            </svg>
                        </div>

                        {/* 🎯 Job Passion Label */}
                        <div
                            className="absolute z-40"
                            style={{
                                left: pos.x + 24,
                                top: pos.y + 36,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                color: badgeTextColor,
                            }}
                        >
                            <div className="px-4 py-3 rounded-full text-[11px] overflow-hidden font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-black/10" style={{ backgroundColor: badgeColor }}>
                                <span className="text-[12px] font-medium tracking-wide whitespace-nowrap drop-shadow" style={{ color: badgeTextColor }}>
                                    {person.name} — {person.job}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PointerFollower;