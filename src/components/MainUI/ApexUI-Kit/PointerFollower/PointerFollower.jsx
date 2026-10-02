import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

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
    const safePeople = Array.isArray(people) && people.length > 0 ? people : defaultPeople;
    const [hovered, setHovered] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Pointer position lives in motion values: moving the cursor no longer
    // re-renders the component, and the badge trails slightly on a spring.
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const badgeX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
    const badgeY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

    useEffect(() => {
        if (hovered || safePeople.length < 2) return undefined;
        const id = setInterval(() => setActiveIndex((prev) => (prev + 1) % safePeople.length), interval);
        return () => clearInterval(id);
    }, [hovered, interval, safePeople.length]);

    useEffect(() => {
        setActiveIndex((idx) => idx % safePeople.length);
    }, [safePeople.length]);

    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        if (!hovered) {
            badgeX.jump(e.clientX - rect.left);
            badgeY.jump(e.clientY - rect.top);
            setHovered(true);
        }
    };

    const person = safePeople[activeIndex % safePeople.length];

    return (
        <div className="relative w-full flex items-center justify-center">
            <div
                className="relative flex items-center justify-center w-64 h-66 cursor-none touch-none"
                onPointerMove={handleMove}
                onPointerLeave={() => setHovered(false)}
            >
                {safePeople.map((p, i) => (
                    <img
                        key={p.id ?? i}
                        src={p.img}
                        alt={p.name}
                        draggable="false"
                        className="absolute w-full h-full object-cover rounded-xl transition-opacity duration-700 ease-in-out border border-white/10"
                        style={{
                            transform: `translate(${i * -2}px, ${i * -2}px)`,
                            zIndex: safePeople.length - i,
                            opacity: activeIndex === i ? 1 : 0,
                        }}
                    />
                ))}

                <AnimatePresence>
                    {hovered && (
                        <>
                            <motion.div
                                className="absolute left-0 top-0 z-50 pointer-events-none"
                                style={{ x, y }}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="-translate-x-1 -translate-y-1">
                                    <path
                                        fill={cursorColor}
                                        stroke="#000"
                                        strokeWidth="1.8"
                                        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
                                    />
                                </svg>
                            </motion.div>

                            <motion.div
                                className="absolute left-0 top-0 z-40 pointer-events-none"
                                style={{ x: badgeX, y: badgeY }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <div
                                    className="translate-x-6 translate-y-7 px-4 py-2.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-black/10"
                                    style={{ backgroundColor: badgeColor }}
                                >
                                    <span className="text-[12px] font-medium tracking-wide whitespace-nowrap" style={{ color: badgeTextColor }}>
                                        {person.name} — {person.job}
                                    </span>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PointerFollower;
