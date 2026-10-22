import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Flip Book: a small 3D hardcover book. Pages turn around the spine and lift
 * off the stack while a shadow sweeps across them; drag a page to turn it
 * by hand, click it, use the buttons or the arrow keys. The page edges
 * thicken on whichever side has more pages, and every page is numbered.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const DEFAULT_PAGES = [
    { title: "ApexUI", body: "A field guide to motion", cover: true },
    { title: "Chapter 1", body: "Start small. One spring, one easing, one idea per interaction." },
    { title: "Chapter 2", body: "Motion should explain — where things come from and where they go.", image: `${IK}/spiderman.png?tr=f-auto,q-80,w-500` },
    { title: "Chapter 3", body: "Keep it fast. Animate transform and opacity, never layout." },
    { title: "Chapter 4", body: "Respect reduced motion. Calm is a feature too.", image: `${IK}/doctorStrange.png?tr=f-auto,q-80,w-500` },
    { title: "Chapter 5", body: "Details compound. Tiny shadows and easing make it feel real." },
    { title: "Chapter 6", body: "Test on a slow phone. If it stutters there, it is not done." },
    { title: "The end", body: "Now go make something that feels alive.", cover: true },
];

const PAPER = "#f7f2e8";

function Face({ page, number, accentColor, back }) {
    const round = back ? "rounded-l-[0.7rem] rounded-r-sm" : "rounded-r-[0.7rem] rounded-l-sm";
    if (!page) return <div className={`h-full w-full ${round}`} style={{ background: PAPER }} />;
    if (page.cover) {
        return (
            <div className={`relative flex h-full w-full flex-col justify-between overflow-hidden p-6 text-neutral-950 ${round}`} style={{ background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 50%, #000))` }}>
                <div className="pointer-events-none absolute inset-3 rounded-md border border-black/15" />
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] opacity-70">Volume 1</span>
                <div>
                    <p className="text-[1.6rem] font-black leading-none">{page.title}</p>
                    <p className="mt-2 text-[0.82rem] font-medium opacity-80">{page.body}</p>
                </div>
                {/* Cloth texture */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 4px)" }} />
            </div>
        );
    }
    return (
        <div className={`flex h-full w-full flex-col p-5 text-neutral-800 ${round}`} style={{ background: PAPER }}>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em]" style={{ color: `color-mix(in srgb, ${accentColor} 50%, #000)` }}>
                {page.title}
            </p>
            {page.image && <img src={page.image} alt="" draggable="false" className="mt-3 h-[38%] w-full rounded-md object-cover object-top" />}
            <p className="mt-3 font-serif text-[0.98rem] leading-relaxed">{page.body}</p>
            <div className="mt-auto flex items-end justify-between gap-3">
                {!page.image && (
                    <div className="flex-1 space-y-1.5" aria-hidden="true">
                        {[90, 75, 82].map((w, i) => (
                            <span key={i} className="block h-1.5 rounded-full bg-neutral-900/10" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                )}
                <span className={`font-mono text-[0.65rem] text-neutral-500 ${back ? "order-first" : "ml-auto"}`}>{number}</span>
            </div>
        </div>
    );
}

// Stacked page edges peeking out under a page.
const edges = (count, side) => {
    const n = Math.min(6, Math.ceil(count * 1.5));
    const dir = side === "right" ? 1 : -1;
    return Array.from({ length: n }, (_, k) => `${dir * (k + 1)}px ${k + 1}px 0 ${k % 2 ? "#e4dccb" : "#efe8da"}`).join(", ") || "none";
};

function Sheet({ index, sheet, flipped, active, dragAngle, accentColor, total, onClick }) {
    const rot = useMotionValue(flipped ? -180 : 0);
    // Lift while turning, and darken the page as it faces away from the light.
    const z = useTransform(rot, [0, -90, -180], [0, 40, 0]);
    const frontShade = useTransform(rot, [0, -90], [0, 0.45]);
    const backShade = useTransform(rot, [-90, -180], [0.45, 0]);

    useEffect(() => {
        if (dragAngle != null) rot.set(dragAngle);
        else animate(rot, flipped ? -180 : 0, { type: "spring", stiffness: 75, damping: 16 });
    }, [flipped, dragAngle, rot]);

    return (
        <motion.div className="group absolute inset-0 origin-left cursor-pointer [transform-style:preserve-3d]" style={{ rotateY: rot, z, zIndex: active ? 50 : flipped ? index : total - index }} onClick={onClick}>
            <div className="absolute inset-0 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.55)] [backface-visibility:hidden]">
                <Face page={sheet.front} number={index * 2 + 1} accentColor={accentColor} />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />
                <motion.div className="pointer-events-none absolute inset-0 rounded-r-[0.7rem] bg-gradient-to-l from-black to-black/40" style={{ opacity: frontShade }} />
                {/* Dog-ear hint */}
                {!flipped && <span className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 origin-bottom-right scale-0 rounded-tl-md bg-gradient-to-tl from-transparent from-50% to-[#e2d9c6] to-50% shadow-[-2px_-2px_6px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-100" />}
            </div>
            <div className="absolute inset-0 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Face page={sheet.back} number={index * 2 + 2} accentColor={accentColor} back />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/20 via-black/5 to-transparent" />
                <motion.div className="pointer-events-none absolute inset-0 rounded-l-[0.7rem] bg-gradient-to-r from-black to-black/40" style={{ opacity: backShade }} />
            </div>
        </motion.div>
    );
}

const FlipBook = ({ pages = DEFAULT_PAGES, width = 12, accentColor = "#a3e635", className = "" }) => {
    // Sheets: page 0+1 on sheet 0, 2+3 on sheet 1, …
    const sheets = [];
    for (let i = 0; i < pages.length; i += 2) sheets.push({ front: pages[i], back: pages[i + 1] });
    const [turned, setTurned] = useState(0);
    const [drag, setDrag] = useState(null); // { sheet, angle }
    const start = useRef(null);
    const dragged = useRef(false);
    const pageRef = useRef(null);
    const go = (dir) => setTurned((t) => Math.min(sheets.length, Math.max(0, t + dir)));
    const open = turned > 0 && turned < sheets.length;

    const onDown = (e) => {
        dragged.current = false;
        start.current = { x: e.clientX, moved: false, w: pageRef.current.offsetWidth };
    };
    const onMove = (e) => {
        const s = start.current;
        if (!s) return;
        const dx = e.clientX - s.x;
        if (!s.moved && Math.abs(dx) < 6) return;
        if (!s.moved) {
            s.moved = true;
            s.sheet = dx < 0 ? turned : turned - 1;
            s.from = dx < 0 ? 0 : -180;
            if (s.sheet < 0 || s.sheet >= sheets.length) return (start.current = null);
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        const angle = Math.max(-180, Math.min(0, s.from + (dx / s.w) * 180));
        setDrag({ sheet: s.sheet, angle });
    };
    const onUp = () => {
        const s = start.current;
        start.current = null;
        if (!s?.moved || !drag) return;
        dragged.current = true;
        const flippedNow = drag.angle < -90;
        setTurned(flippedNow ? s.sheet + 1 : s.sheet);
        setDrag(null);
    };

    return (
        <div
            className={`flex flex-col items-center gap-7 outline-none ${className}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
            }}
            aria-label="Flip book"
        >
            <div className="relative flex touch-pan-y select-none [perspective:2000px]" style={{ width: `min(${width * 2}rem, 92vw)` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                {/* Hardcover boards behind the open spread */}
                <div className="pointer-events-none absolute -inset-x-2 -inset-y-2 rounded-xl transition-opacity duration-500" style={{ opacity: open ? 1 : 0, background: `color-mix(in srgb, ${accentColor} 35%, #111)`, boxShadow: "0 30px 60px -25px rgba(0,0,0,0.6)" }} />
                <div className="flex-1" />
                <div ref={pageRef} className="relative aspect-[3/4] flex-1 [transform-style:preserve-3d]" style={{ transform: `translateX(${turned === 0 && !drag ? "-50%" : turned === sheets.length && !drag ? "50%" : "0%"})`, transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)" }}>
                    <div className="absolute inset-y-0 right-full w-full rounded-l-[0.7rem] transition-[opacity,box-shadow] duration-500" style={{ opacity: turned > 0 ? 1 : 0, boxShadow: edges(turned, "left") }} />
                    <div className="absolute inset-0 rounded-r-[0.7rem] transition-[opacity,box-shadow] duration-500" style={{ opacity: turned < sheets.length ? 1 : 0, boxShadow: edges(sheets.length - turned, "right") }} />
                    {sheets.map((sheet, i) => (
                        <Sheet
                            key={i}
                            index={i}
                            sheet={sheet}
                            total={sheets.length}
                            flipped={i < turned}
                            active={drag?.sheet === i}
                            dragAngle={drag?.sheet === i ? drag.angle : null}
                            accentColor={accentColor}
                            onClick={() => !dragged.current && go(i < turned ? -1 : 1)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" aria-label="Previous page" onClick={() => go(-1)} disabled={turned === 0} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: sheets.length + 1 }, (_, i) => (
                        <span key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === turned ? 18 : 6, background: i === turned ? accentColor : "color-mix(in srgb, currentColor 25%, transparent)" }} />
                    ))}
                </div>
                <button type="button" aria-label="Next page" onClick={() => go(1)} disabled={turned === sheets.length} className="grid h-10 w-10 place-items-center rounded-full border border-current/20 transition hover:scale-105 active:scale-95 disabled:opacity-30">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default FlipBook;
