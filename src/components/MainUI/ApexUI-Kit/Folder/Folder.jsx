import React, { useState } from "react";
import { motion } from "framer-motion";

/*
 * Folder: a little folder that opens on click — the front flap tilts down
 * and up to three papers fan out of it. While open, each paper leans toward
 * the pointer a little. Click again to tuck everything back in.
 */

const DEFAULT_ITEMS = [
    <div key="a" className="space-y-1.5 p-2">
        <p className="text-[0.55rem] font-bold text-neutral-800">Notes.md</p>
        {[85, 60, 72].map((w) => (
            <span key={w} className="block h-1 rounded-full bg-neutral-300" style={{ width: `${w}%` }} />
        ))}
    </div>,
    <div key="b" className="space-y-1.5 p-2">
        <p className="text-[0.55rem] font-bold text-neutral-800">Plan.pdf</p>
        {[70, 90, 50].map((w) => (
            <span key={w} className="block h-1 rounded-full bg-neutral-300" style={{ width: `${w}%` }} />
        ))}
    </div>,
    <div key="c" className="space-y-1.5 p-2">
        <p className="text-[0.55rem] font-bold text-neutral-800">Logo.png</p>
        <span className="block h-7 rounded bg-gradient-to-br from-lime-300 to-cyan-300" />
    </div>,
];

// Where each paper lands when open, in em (scales with `size`).
const SPOTS = [
    { x: -3.9, y: -3.3, r: -14 },
    { x: 0, y: -4.2, r: 3 },
    { x: 3.9, y: -3.3, r: 15 },
];

const Folder = ({ color = "#a3e635", size = 1, items = DEFAULT_ITEMS, label = "Projects", className = "" }) => {
    const [open, setOpen] = useState(false);
    const [lean, setLean] = useState([]);
    const papers = items.slice(0, 3);
    const back = `color-mix(in srgb, ${color} 75%, #000)`;

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`} style={{ fontSize: `${size}rem` }}>
            <button
                type="button"
                aria-expanded={open}
                aria-label={`${label} folder`}
                onClick={() => {
                    setOpen((o) => !o);
                    setLean([]);
                }}
                className="group relative h-[5.5em] w-[7em] outline-none transition-transform duration-200 hover:-translate-y-1"
                style={{ perspective: "600px" }}
            >
                {/* Back panel with tab */}
                <span className="absolute inset-0 rounded-[0.6em] rounded-tl-none" style={{ background: back }} />
                <span className="absolute -top-[0.7em] left-0 h-[0.9em] w-[2.6em] rounded-t-[0.45em]" style={{ background: back }} />

                {papers.map((p, i) => {
                    const spot = SPOTS[papers.length === 1 ? 1 : papers.length === 2 ? i * 2 : i];
                    const l = lean[i] ?? { x: 0, y: 0 };
                    return (
                        <motion.span
                            key={i}
                            className="absolute bottom-[10%] left-[10%] h-[80%] w-[80%] overflow-hidden rounded-[0.4em] bg-white text-left shadow-md"
                            initial={false}
                            animate={open ? { x: `${spot.x + l.x}em`, y: `${spot.y + l.y}em`, rotate: spot.r, scale: 1 } : { x: "0em", y: `${-0.3 - i * 0.2}em`, rotate: 0, scale: 0.92 - (2 - i) * 0.03 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22, delay: open ? i * 0.04 : 0 }}
                            onPointerMove={(e) => {
                                if (!open) return;
                                const r = e.currentTarget.getBoundingClientRect();
                                const next = [...lean];
                                next[i] = { x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 0.8, y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 0.8 };
                                setLean(next);
                            }}
                            onPointerLeave={() => {
                                const next = [...lean];
                                next[i] = { x: 0, y: 0 };
                                setLean(next);
                            }}
                        >
                            {p}
                        </motion.span>
                    );
                })}

                {/* Front flap */}
                <motion.span
                    className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom rounded-[0.6em] shadow-[0_-4px_12px_rgba(0,0,0,0.12)]"
                    style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${color} 85%, #fff), ${color})` }}
                    initial={false}
                    animate={{ rotateX: open ? -38 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
            </button>
            <span className="text-sm font-medium opacity-70">{label}</span>
        </div>
    );
};

export default Folder;
