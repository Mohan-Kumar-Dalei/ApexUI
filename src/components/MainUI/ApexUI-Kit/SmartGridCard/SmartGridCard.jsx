import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Box, Settings, Lock, Sparkles, Search, LaptopMinimal } from "lucide-react";

const CARD_HEIGHT = 250;
const GAP = 8;

// Columns follow the component's own width (not the window), so the grid
// also fits inside sidebars, modals and docs previews.
function useColumns(ref) {
    const [cols, setCols] = useState(3);
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            setCols(w >= 900 ? 3 : w >= 560 ? 2 : 1);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return cols;
}

/*
 * mergeMap = { source: target } hides `source` and lets `target` grow into
 * its place: down when source sits directly below target, across when it
 * sits directly to the right. Merging only applies in the 3-column layout.
 */
function layoutFor(cards, mergeMap, cols) {
    const merged = cols === 3 ? mergeMap : {};
    const hidden = new Set(Object.keys(merged).map(Number));
    const spans = {};
    Object.entries(merged).forEach(([source, target]) => {
        const s = Number(source);
        const t = Number(target);
        const sameRowRight = s === t + 1 && Math.ceil(s / 3) === Math.ceil(t / 3);
        spans[t] = s === t + 3 ? { rows: 2 } : sameRowRight ? { cols: 2 } : { rows: 2 };
    });
    return cards
        .filter((c) => !hidden.has(c.id))
        .map((c) => ({ card: c, span: spans[c.id] ?? {} }));
}

const GridCard = ({ card, span, borderColor }) => {
    const ref = useRef(null);

    // The glow follows the pointer through CSS variables, so moving the mouse
    // doesn't re-render React.
    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onMouseMove={onMove}
            style={{
                gridColumn: span.cols ? `span ${span.cols}` : undefined,
                gridRow: span.rows ? `span ${span.rows}` : undefined,
                borderRadius: 16,
            }}
            className="group relative overflow-hidden p-[1px] bg-zinc-900 border border-zinc-700 shadow-2xl"
        >
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    maskImage: "radial-gradient(circle at var(--mx) var(--my), white 40%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(circle at var(--mx) var(--my), white 40%, transparent 80%)",
                    background: `radial-gradient(circle at var(--mx) var(--my), ${borderColor}, transparent 80%)`,
                }}
            />
            <motion.div layout="position" className="relative z-10 flex flex-col items-start justify-between h-full w-full p-6 rounded-2xl bg-zinc-900 text-white gap-4">
                <div className="text-4xl border border-dashed p-2 rounded-lg border-purple-600">{card.icon}</div>
                <div>
                    <h3 className="text-xl font-bold mb-2 break-words leading-tight">{card.title}</h3>
                    <p className="text-sm md:text-base w-full text-white/70 break-words">{card.description}</p>
                </div>
                <button
                    type="button"
                    onClick={card.onClick}
                    className="mt-auto relative overflow-hidden px-5 py-3 rounded-lg border border-purple-400/60 text-white bg-black/20 group/btn flex items-center gap-2 text-xs md:text-base"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {card.buttonText}
                        <span className="transition-transform duration-200 group-hover/btn:translate-x-2 flex items-center">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </span>
                    </span>
                    <span
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-lg"
                        style={{ background: "radial-gradient(circle at bottom, purple, transparent 69%)", mixBlendMode: "screen" }}
                    />
                </button>
            </motion.div>
        </motion.div>
    );
};

const SmartGridCard = ({
    cards = defaultCards(),
    mergeMap = {},
    borderColor = "cyan",
}) => {
    const rootRef = useRef(null);
    const cols = useColumns(rootRef);
    const items = layoutFor(cards, mergeMap, cols);

    return (
        <div ref={rootRef} className="w-full p-4">
            <LayoutGroup>
                <motion.div
                    layout
                    className="grid w-full"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gridAutoRows: CARD_HEIGHT,
                        gridAutoFlow: "dense",
                        gap: GAP,
                    }}
                >
                    <AnimatePresence initial={false} mode="popLayout">
                        {items.map(({ card, span }) => (
                            <GridCard key={card.id} card={card} span={span} borderColor={borderColor} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </LayoutGroup>
        </div>
    );
};

function defaultCards() {
    return [
        { id: 1, icon: <LaptopMinimal className="w-6 h-6 text-white" />, title: "Responsive Layout", description: "Works across all screen sizes with smooth animation.", buttonText: "Learn More" },
        { id: 2, icon: <Box className="w-6 h-6 text-white" />, title: "Composable Components", description: "Each card is modular and easy to customize.", buttonText: "Explore" },
        { id: 3, icon: <Settings className="w-6 h-6 text-white" />, title: "Easy Config", description: "Use props like mergeMap to control logic.", buttonText: "Settings" },
        { id: 4, icon: <Lock className="w-6 h-6 text-white" />, title: "Secure UI", description: "Perfect for dashboards and secure apps.", buttonText: "Secure Now" },
        { id: 5, icon: <Sparkles className="w-6 h-6 text-white" />, title: "Edge Effects", description: "Glowing borders that follow your mouse.", buttonText: "Try It" },
        { id: 6, icon: <Search className="w-6 h-6 text-white" />, title: "Fast Search", description: "Lightning-fast component navigation.", buttonText: "Search" },
    ];
}

export default SmartGridCard;
