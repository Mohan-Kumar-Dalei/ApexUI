import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Flip Book: a small 3D book. Pages turn around the spine with a soft shadow
 * sweeping across; click a page, use the buttons or the arrow keys.
 * Every sheet has a front and a back, so content reads on both sides.
 */

const DEFAULT_PAGES = [
    { title: "ApexUI", body: "A field guide to motion", cover: true },
    { title: "Chapter 1", body: "Start small. One spring, one easing, one idea per interaction." },
    { title: "Chapter 2", body: "Motion should explain — where things come from and where they go." },
    { title: "Chapter 3", body: "Keep it fast. Animate transform and opacity, never layout." },
    { title: "Chapter 4", body: "Respect reduced motion. Calm is a feature too." },
    { title: "The end", body: "Now go make something that feels alive.", cover: true },
];

function Face({ page, accentColor, back }) {
    if (!page) return <div className="h-full w-full rounded-r-xl bg-[#f6f1e7]" />;
    if (page.cover) {
        return (
            <div className={`flex h-full w-full flex-col justify-between p-6 text-neutral-950 ${back ? "rounded-l-xl" : "rounded-r-xl"}`} style={{ background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 55%, #000))` }}>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] opacity-70">Volume 1</span>
                <div>
                    <p className="text-2xl font-black leading-none">{page.title}</p>
                    <p className="mt-2 text-sm font-medium opacity-80">{page.body}</p>
                </div>
            </div>
        );
    }
    return (
        <div className={`flex h-full w-full flex-col bg-[#f6f1e7] p-5 text-neutral-800 ${back ? "rounded-l-xl" : "rounded-r-xl"}`}>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em]" style={{ color: `color-mix(in srgb, ${accentColor} 55%, #000)` }}>
                {page.title}
            </p>
            <p className="mt-3 font-serif text-[1.02rem] leading-relaxed">{page.body}</p>
            <div className="mt-auto space-y-1.5" aria-hidden="true">
                {[90, 75, 82, 60].map((w, i) => (
                    <span key={i} className="block h-1.5 rounded-full bg-neutral-900/10" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );
}

const FlipBook = ({ pages = DEFAULT_PAGES, width = 13, accentColor = "#a3e635", className = "" }) => {
    // Sheets: page 0+1 on sheet 0, 2+3 on sheet 1, …
    const sheets = [];
    for (let i = 0; i < pages.length; i += 2) sheets.push({ front: pages[i], back: pages[i + 1] });
    const [turned, setTurned] = useState(0);
    const go = (dir) => setTurned((t) => Math.min(sheets.length, Math.max(0, t + dir)));

    return (
        <div
            className={`flex flex-col items-center gap-6 outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
            }}
            aria-label="Flip book"
        >
            <div className="flex [perspective:1800px]" style={{ width: `min(${width * 2}rem, 92vw)` }}>
                <div className="flex-1" />
                <div className="relative aspect-[3/4] flex-1 [transform-style:preserve-3d]" style={{ transform: `translateX(${turned === 0 ? "-50%" : turned === sheets.length ? "50%" : "0%"})`, transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)" }}>
                    {sheets.map((sheet, i) => {
                        const flipped = i < turned;
                        return (
                            <motion.div
                                key={i}
                                className="absolute inset-0 origin-left cursor-pointer [transform-style:preserve-3d]"
                                style={{ zIndex: flipped ? i : sheets.length - i }}
                                animate={{ rotateY: flipped ? -180 : 0 }}
                                transition={{ type: "spring", stiffness: 70, damping: 16 }}
                                onClick={() => go(flipped ? -1 : 1)}
                            >
                                <div className="absolute inset-0 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] [backface-visibility:hidden]">
                                    <Face page={sheet.front} accentColor={accentColor} />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/15 to-transparent" />
                                </div>
                                <div className="absolute inset-0 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                    <Face page={sheet.back} accentColor={accentColor} back />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/15 to-transparent" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" aria-label="Previous page" onClick={() => go(-1)} disabled={turned === 0} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-mono text-xs tabular-nums opacity-60">
                    {turned} / {sheets.length}
                </span>
                <button type="button" aria-label="Next page" onClick={() => go(1)} disabled={turned === sheets.length} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default FlipBook;
