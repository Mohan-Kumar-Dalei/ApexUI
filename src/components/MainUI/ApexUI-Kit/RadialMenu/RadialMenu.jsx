import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Heart, Home, MessageCircle, Plus, Settings, Share2, User } from "lucide-react";

/*
 * Radial Menu: a round button that fans its actions out in a circle (or an
 * arc). Items spring out one after another and tuck back in on close.
 * Keyboard friendly: arrows move between items, Escape closes, and clicking
 * outside closes too.
 */

const DEFAULT_ITEMS = [
    { icon: Home, label: "Home" },
    { icon: User, label: "Profile" },
    { icon: MessageCircle, label: "Messages" },
    { icon: Camera, label: "Camera" },
    { icon: Heart, label: "Likes" },
    { icon: Share2, label: "Share" },
    { icon: Settings, label: "Settings" },
];

const RadialMenu = ({ items = DEFAULT_ITEMS, radius = 6.5, arc = 360, startAngle = -90, accentColor = "#a3e635", theme = "dark", onSelect, className = "" }) => {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [picked, setPicked] = useState(null);
    const root = useRef(null);
    const btns = useRef([]);
    const dark = theme !== "light";
    const n = items.length;
    // Full circle spreads evenly; a partial arc includes both ends.
    const step = arc >= 360 ? 360 / n : arc / Math.max(1, n - 1);

    useEffect(() => {
        if (!open) return undefined;
        const down = (e) => !root.current?.contains(e.target) && setOpen(false);
        const key = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", down);
        document.addEventListener("keydown", key);
        return () => {
            document.removeEventListener("pointerdown", down);
            document.removeEventListener("keydown", key);
        };
    }, [open]);

    const choose = (item, i) => {
        setPicked(i);
        setOpen(false);
        onSelect?.(item, i);
    };
    const onItemKey = (e, i) => {
        const next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!next) return;
        e.preventDefault();
        btns.current[(i + next + n) % n]?.focus();
    };

    return (
        <div ref={root} className={`relative inline-grid place-items-center ${className}`} style={{ width: `${radius * 2 + 4}rem`, height: `${radius * 2 + 4}rem`, maxWidth: "100%" }}>
            <AnimatePresence>
                {open &&
                    items.map((item, i) => {
                        const a = ((startAngle + i * step) * Math.PI) / 180;
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={`${id}-${i}`}
                                ref={(el) => (btns.current[i] = el)}
                                type="button"
                                aria-label={item.label}
                                title={item.label}
                                onClick={() => choose(item, i)}
                                onKeyDown={(e) => onItemKey(e, i)}
                                className={`group absolute grid h-12 w-12 place-items-center rounded-full shadow-lg outline-none ring-1 focus-visible:ring-2 ${dark ? "bg-neutral-900 text-white ring-white/10 hover:bg-neutral-800 focus-visible:ring-white/50" : "bg-white text-neutral-800 ring-black/10 hover:bg-neutral-50 focus-visible:ring-black/40"}`}
                                initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                                animate={{ x: `${Math.cos(a) * radius}rem`, y: `${Math.sin(a) * radius}rem`, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 24, delay: i * 0.03 } }}
                                exit={{ x: 0, y: 0, scale: 0.3, opacity: 0, transition: { duration: 0.18, delay: (n - 1 - i) * 0.015 } }}
                                style={picked === i ? { color: accentColor } : undefined}
                            >
                                {Icon ? <Icon className="h-5 w-5" /> : item.label[0]}
                                <span className={`pointer-events-none absolute top-full mt-1.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.65rem] font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${dark ? "bg-white text-black" : "bg-neutral-900 text-white"}`}>{item.label}</span>
                            </motion.button>
                        );
                    })}
            </AnimatePresence>
            <motion.button
                type="button"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => open && e.key === "ArrowRight" && (e.preventDefault(), btns.current[0]?.focus())}
                whileTap={{ scale: 0.92 }}
                className="relative z-10 grid h-16 w-16 place-items-center rounded-full text-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                style={{ background: accentColor }}
            >
                <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                    <Plus className="h-7 w-7" strokeWidth={2.5} />
                </motion.span>
            </motion.button>
        </div>
    );
};

export default RadialMenu;
