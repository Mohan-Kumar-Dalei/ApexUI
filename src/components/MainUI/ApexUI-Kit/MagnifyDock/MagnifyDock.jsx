import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Compass, House, Image, Mail, MessageCircle, Music, Settings } from "lucide-react";

/*
 * Magnify Dock: a glass dock whose icons swell toward the pointer, like the
 * macOS dock. Hover shows a label, a click bounces the icon and marks it open.
 * Sizes are in rem so the dock scales with the page's font size.
 */

const DEFAULT_ITEMS = [
    { label: "Home", icon: House, color: "linear-gradient(160deg,#60a5fa,#2563eb)" },
    { label: "Explore", icon: Compass, color: "linear-gradient(160deg,#a78bfa,#7c3aed)" },
    { label: "Music", icon: Music, color: "linear-gradient(160deg,#fb7185,#e11d48)" },
    { label: "Photos", icon: Image, color: "linear-gradient(160deg,#fcd34d,#f97316)" },
    { label: "Messages", icon: MessageCircle, color: "linear-gradient(160deg,#4ade80,#16a34a)" },
    { label: "Mail", icon: Mail, color: "linear-gradient(160deg,#38bdf8,#0369a1)" },
    { type: "separator" },
    { label: "Settings", icon: Settings, color: "linear-gradient(160deg,#a1a1aa,#52525b)" },
];

const THEMES = {
    dark: {
        panel: "border-white/10 bg-neutral-900/75 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]",
        glassTile: "bg-white/10 text-white",
        label: "bg-neutral-900/90 text-white border-white/10",
        separator: "bg-white/15",
        dot: "bg-white/80",
    },
    light: {
        panel: "border-black/10 bg-white/70 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)]",
        glassTile: "bg-black/[0.06] text-neutral-800",
        label: "bg-white/95 text-neutral-900 border-black/10",
        separator: "bg-black/15",
        dot: "bg-neutral-800/80",
    },
};

function DockItem({ item, index, mouseX, baseSize, magnification, distance, theme, tileStyle, showLabels, open, onSelect }) {
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);
    const controls = useAnimationControls();
    const t = THEMES[theme] ?? THEMES.dark;

    // Distance from the pointer to this icon's centre, mapped to a size factor.
    const offset = useTransform(mouseX, (x) => {
        const rect = ref.current?.getBoundingClientRect();
        return rect ? x - (rect.left + rect.width / 2) : Infinity;
    });
    const target = useTransform(offset, [-distance, 0, distance], [1, magnification, 1]);
    const factor = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
    const size = useTransform(factor, (f) => `${f * baseSize}rem`);

    const Icon = item.icon;
    const Tag = item.href ? motion.a : motion.button;

    return (
        <motion.div className="relative flex flex-col items-center" style={{ width: size }}>
            <AnimatePresence>
                {showLabels && hovered && (
                    <motion.span
                        className={`pointer-events-none absolute bottom-full mb-3 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[0.75rem] font-medium backdrop-blur-md ${t.label}`}
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.16 }}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
            <Tag
                ref={ref}
                type={item.href ? undefined : "button"}
                href={item.href}
                aria-label={item.label}
                animate={controls}
                onClick={(e) => {
                    controls.start({ y: [0, -14, 0, -5, 0], transition: { duration: 0.7, ease: "easeOut" } });
                    onSelect(index, item, e);
                }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className={`grid aspect-square w-full place-items-center rounded-[24%] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-white/70 ${tileStyle === "glass" ? t.glassTile : "text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_14px_-6px_rgba(0,0,0,0.5)]"}`}
                style={tileStyle === "glass" ? undefined : { background: item.color }}
            >
                {Icon && <Icon className="h-[48%] w-[48%]" strokeWidth={2} />}
            </Tag>
            <span className={`absolute -bottom-[0.45rem] h-1 w-1 rounded-full transition-opacity ${t.dot} ${open ? "opacity-100" : "opacity-0"}`} />
        </motion.div>
    );
}

const MagnifyDock = ({
    items = DEFAULT_ITEMS,
    baseSize = 2.75,
    magnification = 1.7,
    distance = 140,
    theme = "dark",
    tileStyle = "color",
    showLabels = true,
    defaultOpen = [0],
    onSelect,
    className = "",
}) => {
    const mouseX = useMotionValue(Infinity);
    const [open, setOpen] = useState(() => new Set(defaultOpen));
    const reduced = useReducedMotion();
    const t = THEMES[theme] ?? THEMES.dark;
    const reset = () => mouseX.set(Infinity);

    const select = (index, item, e) => {
        setOpen((prev) => new Set(prev).add(index));
        onSelect?.(item, index, e);
    };

    return (
        <nav aria-label="Dock" className={`flex w-full justify-center ${className}`}>
            <div
                onPointerMove={(e) => mouseX.set(e.clientX)}
                onPointerLeave={reset}
                onPointerUp={(e) => e.pointerType !== "mouse" && reset()}
                onPointerCancel={reset}
                className={`flex max-w-full items-end gap-[0.45rem] rounded-[1.35rem] border px-[0.55rem] pb-[0.6rem] pt-[0.55rem] backdrop-blur-xl ${t.panel}`}
                style={{ height: `${baseSize + 1.15}rem`, touchAction: "pan-y" }}
            >
                {items.map((item, i) =>
                    item.type === "separator" ? (
                        <span key={`sep-${i}`} aria-hidden="true" className={`mx-[0.2rem] w-px self-stretch ${t.separator}`} />
                    ) : (
                        <DockItem
                            key={item.label ?? i}
                            item={item}
                            index={i}
                            mouseX={mouseX}
                            baseSize={baseSize}
                            magnification={reduced ? 1 : magnification}
                            distance={distance}
                            theme={theme}
                            tileStyle={tileStyle}
                            showLabels={showLabels}
                            open={open.has(i)}
                            onSelect={select}
                        />
                    )
                )}
            </div>
        </nav>
    );
};

export default MagnifyDock;
