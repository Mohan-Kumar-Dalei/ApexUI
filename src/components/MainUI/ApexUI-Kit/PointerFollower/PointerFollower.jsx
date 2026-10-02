import React, { useRef, useEffect, useState } from "react";

const defaultPeople = [
    { id: 1, name: "Captain America", job: "Leader of the Avengers", img: "/assets/captainamerica.png" },
    { id: 2, name: "Doctor Strange", job: "Sorcerer Supreme", img: "/assets/doctorStrange.png" },
    { id: 3, name: "Iron Man", job: "Leader Of Stark Industries", img: "/assets/ironman.png" },
    { id: 4, name: "HULK", job: "Scientist", img: "/assets/hulk.png" },
    { id: 5, name: "Spider-Man", job: "Friendly Neighborhood Spider-Man", img: "/assets/spiderman.png" },
    { id: 6, name: "Thanos", job: "The Mad Titan", img: "/assets/thanos.png" },
];

const PointerFollower = ({
    cursorColor = "#fff",
    interval = 3000,
    badgeColor = "#fff",
    badgeTextColor = "#212121",
    people = defaultPeople,
}) => {
    const containerRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // 🛠️ Auto cycle with sync fix
    useEffect(() => {
        if (hovered) return;

        const autoInterval = setInterval(() => {
            setActiveIndex((prev) => {
                if (!people || people.length === 0) return 0;
                return (prev + 1) % people.length;
            });
        }, interval);

        return () => clearInterval(autoInterval);
    }, [hovered, interval, people]);

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

    // Guard against empty people array
    const safePeople = Array.isArray(people) && people.length > 0 ? people : defaultPeople;
    const person = safePeople[activeIndex % safePeople.length]; // ✅ SYNCED HERE

    // If the provided people list changes, ensure activeIndex is valid
    useEffect(() => {
        if (!Array.isArray(people) || people.length === 0) {
            setActiveIndex(0);
            return;
        }
        setActiveIndex((idx) => idx % people.length);
    }, [people]);

    return (
        <div className="relative w-full h-fit flex items-center justify-center">
            <div ref={containerRef} className="absolute flex items-center justify-center w-64  h-66 cursor-none">
                {/* 🔁 Image stack with auto fade */}
                {safePeople.map((p, i) => (
                    <img
                        key={i}
                        src={p.img}
                        alt={p.name}
                        className={`absolute w-full h-full object-cover rounded-xl transition-opacity duration-1000 ease-in-out border border-white/10`}
                        style={{
                            transform: `translate(${i * -2}px, ${i * -2}px)`,
                            zIndex: safePeople.length - i,
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