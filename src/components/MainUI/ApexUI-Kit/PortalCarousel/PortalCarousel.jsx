import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

/*
 * Portal Carousel: photos in arch-topped frames. The one in front is large and sharp,
 * the rest step back on both sides.
 *  - variant "curve": the side arches turn away on a 3D curve and the front one gets a
 *    coloured frame, with a caption (title, subtitle, price) under it.
 *  - variant "stage": the side arches shrink, sink and blur, with a progress bar,
 *    "1 of 8 · title" and arrows underneath.
 * Drag, swipe, arrow keys, a sideways wheel or a click on a side arch moves it.
 * The arches size themselves from the height you give, so they fit any screen.
 */

const EASE = [0.16, 1, 0.3, 1];

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n, w = 640) => `${IK}/${n}.png?tr=f-auto,q-80,w-${w}`;
const DEFAULT_ITEMS = [
    { image: img("ironman"), title: "Iron Man", subtitle: "Mark 85 armour, repulsors charged", meta: "Tony Stark" },
    { image: img("captainamerica"), title: "Captain America", subtitle: "Vibranium shield, never thrown twice the same way", meta: "Steve Rogers" },
    { image: img("spiderman"), title: "Spider-Man", subtitle: "Web shooters, a hoodie and good timing", meta: "Peter Parker", badge: "Fan pick" },
    { image: img("hulk"), title: "Hulk", subtitle: "Strongest there is, on a good day", meta: "Bruce Banner" },
    { image: img("doctorStrange"), title: "Doctor Strange", subtitle: "Sorcerer Supreme, keeper of the time stone", meta: "Stephen Strange" },
    { image: img("black-panther"), title: "Black Panther", subtitle: "King of Wakanda, suit charged with kinetic energy", meta: "T'Challa" },
    { image: img("thanos"), title: "Thanos", subtitle: "Six stones, one snap", meta: "The Mad Titan" },
];

const THEMES = {
    dark: { ink: "#F5EFE6", muted: "rgba(245,239,230,0.6)", line: "rgba(245,239,230,0.18)", rest: "rgba(245,239,230,0.1)", badgeBg: "#F5EFE6", badgeInk: "#1C1714" },
    light: { ink: "#1C1714", muted: "rgba(28,23,20,0.6)", line: "rgba(28,23,20,0.14)", rest: "rgba(28,23,20,0.06)", badgeBg: "#1C1714", badgeInk: "#F5EFE6" },
};

const PortalCarousel = ({
    items = DEFAULT_ITEMS,
    variant = "curve",
    theme = "dark",
    frameColor = "#C9A253",
    height = "clamp(18rem, min(58svh, 118vw), 34rem)",
    ratio = 0.6,
    visible = 2,
    startIndex = 0,
    autoPlay = 0,
    showCaption = true,
    renderActions,
    onChange,
    label = "Gallery",
    className = "",
}) => {
    const n = items.length;
    const [at, setAt] = useState(() => Math.min(Math.max(0, startIndex), Math.max(0, n - 1)));
    const [paused, setPaused] = useState(false);
    const drag = useRef(null);
    const root = useRef(null);
    const t = THEMES[theme] || THEMES.dark;
    const curve = variant !== "stage";

    const go = useCallback((d) => setAt((a) => (((a + d) % n) + n) % n), [n]);
    useEffect(() => onChange?.(at, items[at]), [at]); // eslint-disable-line react-hooks/exhaustive-deps

    // autoplay, paused on hover, focus and when the tab is hidden
    useEffect(() => {
        if (!autoPlay || paused || n < 2) return undefined;
        const id = setInterval(() => !document.hidden && go(1), autoPlay);
        return () => clearInterval(id);
    }, [autoPlay, paused, go, n]);

    if (!n) return null;
    const item = items[at];

    const onKey = (e) => {
        if (e.key === "ArrowRight") (e.preventDefault(), go(1));
        if (e.key === "ArrowLeft") (e.preventDefault(), go(-1));
    };

    const arrow = (dir) => (
        <button
            type="button"
            onClick={() => go(dir)}
            aria-label={dir < 0 ? "Previous" : "Next"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors"
            style={{ borderColor: t.line, color: t.ink }}
        >
            {dir < 0 ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
        </button>
    );

    return (
        <div
            ref={root}
            className={`w-full ${className}`}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            {/* the arches */}
            <div
                className="relative w-full touch-pan-y select-none overflow-hidden outline-none"
                style={{ height, perspective: curve ? "87.5rem" : undefined }}
                tabIndex={0}
                onKeyDown={onKey}
                onPointerDown={(e) => (drag.current = e.clientX)}
                onPointerUp={(e) => {
                    if (drag.current == null) return;
                    const dx = e.clientX - drag.current;
                    drag.current = null;
                    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                }}
                onPointerCancel={() => (drag.current = null)}
                onWheel={(e) => {
                    if (Math.abs(e.deltaX) > 30 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) go(e.deltaX > 0 ? 1 : -1);
                }}
                role="region"
                aria-roledescription="carousel"
                aria-label={label}
            >
                {items.map((it, i) => {
                    let o = i - at;
                    if (o > n / 2) o -= n;
                    if (o < -n / 2) o += n;
                    const a = Math.abs(o);
                    const hidden = a > visible;
                    const front = o === 0;
                    const anim = curve
                        ? { x: `calc(-50% + ${o * 78}%)`, y: 0, rotateY: o * -24, z: -a * 140, scale: 1, filter: "blur(0px)", opacity: hidden ? 0 : 1 - a * 0.28 }
                        : { x: `calc(-50% + ${o * 78}%)`, y: `${a * 4}%`, rotateY: 0, z: 0, scale: 1 - Math.min(a, 3) * 0.17, filter: `blur(${Math.min(a, 2) * 2.5}px)`, opacity: hidden ? 0 : 1 - a * 0.22 };
                    return (
                        <motion.button
                            key={it.id ?? i}
                            type="button"
                            tabIndex={-1}
                            onClick={() => o !== 0 && go(o)}
                            aria-label={`${it.title ?? `Slide ${i + 1}`}${front ? ", in front" : ""}`}
                            aria-hidden={hidden}
                            initial={false}
                            animate={anim}
                            transition={{ duration: 0.85, ease: EASE }}
                            className="absolute bottom-0 left-1/2 h-full origin-bottom"
                            style={{ aspectRatio: ratio, zIndex: 10 - a, pointerEvents: hidden ? "none" : "auto", transformStyle: curve ? "preserve-3d" : undefined }}
                        >
                            <div
                                className="h-full rounded-t-[999px] transition-colors duration-700"
                                style={{ padding: curve ? "0.5rem" : 0, background: curve ? (front ? frameColor : t.rest) : "transparent" }}
                            >
                                <div className="relative h-full overflow-hidden rounded-t-[999px]" style={{ boxShadow: curve ? undefined : "0 2.5rem 3rem -2.4rem rgba(28,23,20,0.7)" }}>
                                    <img src={it.image} alt={it.alt ?? ""} draggable={false} loading={a > 1 ? "lazy" : "eager"} className="h-full w-full object-cover" />
                                    {it.badge && (
                                        <span
                                            className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.75rem] font-semibold"
                                            style={{ background: t.badgeBg, color: t.badgeInk }}
                                        >
                                            {it.badge}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* curve: a caption under the front arch */}
            {curve && showCaption && (
                <div className="mx-auto mt-8 max-w-xl px-4 text-center" style={{ color: t.ink }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={at} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }} aria-live="polite">
                            {item.title && <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] leading-none">{item.title}</h3>}
                            {item.subtitle && <p className="mt-2 text-[0.95rem]" style={{ color: t.muted }}>{item.subtitle}</p>}
                            {item.meta && <p className="mt-3 text-2xl tabular-nums" style={{ color: frameColor }}>{item.meta}</p>}
                        </motion.div>
                    </AnimatePresence>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        {arrow(-1)}
                        {renderActions?.(item, at)}
                        {arrow(1)}
                    </div>
                </div>
            )}

            {/* stage: progress, counter and arrows */}
            {!curve && showCaption && (
                <div className="mt-6 flex items-center gap-4" style={{ color: t.ink }}>
                    {arrow(-1)}
                    <div className="min-w-0 flex-1">
                        <div className="relative h-px" style={{ background: t.line }}>
                            <motion.span className="absolute -top-px h-[3px] rounded-full" style={{ width: `${100 / n}%`, background: t.ink }} animate={{ left: `${(at / n) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
                        </div>
                        <p className="mt-3 flex justify-between gap-4 text-[0.82rem]" style={{ color: t.muted }} aria-live="polite">
                            <span className="truncate">
                                <span className="tabular-nums" style={{ color: t.ink }}>
                                    {at + 1} of {n}
                                </span>
                                {item.title ? ` · ${item.title}` : ""}
                            </span>
                            <span className="hidden shrink-0 sm:inline">Swipe or drag</span>
                        </p>
                    </div>
                    {renderActions?.(item, at)}
                    {arrow(1)}
                </div>
            )}
        </div>
    );
};

export default PortalCarousel;
