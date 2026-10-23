import React, { useEffect, useRef, useState } from "react";

/*
 * Image Accordion: a row of image panels where the active one opens wide and
 * the rest fold into slim strips with their titles turned sideways. Hover,
 * focus or tap a panel to open it; it can also cycle on its own. Below
 * 520px of width it stacks vertically and the panels grow in height instead,
 * so it fits phones. The panels animate flex-grow with one easing curve, so
 * the open and close always move together.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage";
const DEFAULT_ITEMS = [
    { image: `${IK}/galaxy-3d.png?tr=f-auto,q-80,w-1100`, title: "Galaxy 3D", description: "A turning spiral galaxy for hero sections." },
    { image: `${IK}/sunrise-background.png?tr=f-auto,q-80,w-1100`, title: "Sunrise", description: "A sun rising between two mountain ranges." },
    { image: `${IK}/liquid-blob-3d.png?tr=f-auto,q-80,w-1100`, title: "Liquid Blob", description: "A glossy blob that ripples toward the pointer." },
    { image: `${IK}/warp-tunnel.png?tr=f-auto,q-80,w-1100`, title: "Warp Tunnel", description: "Hold to boost into hyperspace." },
    { image: `${IK}/horizon-glow-v2.png?tr=f-auto,q-80,w-1100`, title: "Horizon Glow", description: "Soft light rising from below the edge." },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const ImageAccordion = ({ items = DEFAULT_ITEMS, defaultActive = 0, autoPlay = 0, openRatio = 4, radius = 1.25, gap = 0.6, duration = 700, height = "26rem", onChange, className = "" }) => {
    const list = items.length ? items : DEFAULT_ITEMS;
    const [active, setActive] = useState(Math.min(defaultActive, list.length - 1));
    const [vertical, setVertical] = useState(false);
    const root = useRef(null);
    const hovering = useRef(false);

    const open = (i) => {
        setActive((cur) => {
            if (cur !== i) onChange?.(i);
            return i;
        });
    };

    // Stack vertically when the box is narrow (a container check, not the viewport).
    useEffect(() => {
        const el = root.current;
        const ro = new ResizeObserver(([entry]) => setVertical(entry.contentRect.width < 520));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!autoPlay) return undefined;
        const id = setInterval(() => {
            if (!hovering.current) setActive((cur) => (cur + 1) % list.length);
        }, autoPlay * 1000);
        return () => clearInterval(id);
    }, [autoPlay, list.length]);

    return (
        <div
            ref={root}
            role="tablist"
            aria-orientation={vertical ? "vertical" : "horizontal"}
            onPointerEnter={() => (hovering.current = true)}
            onPointerLeave={() => (hovering.current = false)}
            className={`flex w-full ${vertical ? "flex-col" : "flex-row"} ${className}`}
            style={{ height: vertical ? `max(${height}, ${list.length * 3.4 + openRatio * 3}rem)` : height, gap: `${gap}rem` }}
        >
            {list.map((item, i) => {
                const on = i === active;
                return (
                    <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-label={item.title}
                        onPointerEnter={(e) => e.pointerType === "mouse" && open(i)}
                        onFocus={() => open(i)}
                        onClick={() => open(i)}
                        className="group relative min-h-0 min-w-0 overflow-hidden text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        style={{ flexGrow: on ? openRatio : 1, flexBasis: 0, borderRadius: `${radius}rem`, transition: `flex-grow ${duration}ms ${EASE}` }}
                    >
                        <img
                            src={item.image}
                            alt=""
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{ transform: on ? "scale(1)" : "scale(1.12)", filter: on ? "none" : "saturate(0.6) brightness(0.75)", transition: `transform ${duration * 1.4}ms ${EASE}, filter ${duration}ms ${EASE}` }}
                        />
                        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Folded: the title runs along the strip. */}
                        <span
                            aria-hidden="true"
                            className="absolute whitespace-nowrap text-sm font-semibold tracking-wide"
                            style={{
                                ...(vertical ? { left: "1rem", top: "50%", transform: "translateY(-50%)" } : { left: "50%", bottom: "1.25rem", transform: "translateX(-50%) rotate(-90deg)", transformOrigin: "center", translate: "0 -2.5rem" }),
                                opacity: on ? 0 : 0.9,
                                transition: `opacity ${duration * 0.5}ms ease`,
                            }}
                        >
                            {item.title}
                        </span>

                        {/* Open: title and text rise in once the panel has room. */}
                        <span
                            className="absolute inset-x-0 bottom-0 block p-[clamp(1rem,3cqw,1.75rem)]"
                            style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(0.75rem)", transition: `opacity ${duration * 0.6}ms ${EASE} ${on ? duration * 0.35 : 0}ms, transform ${duration * 0.8}ms ${EASE} ${on ? duration * 0.3 : 0}ms` }}
                        >
                            <span className="block font-mono text-[0.7rem] tracking-[0.2em] text-white/60">{String(i + 1).padStart(2, "0")}</span>
                            <span className="mt-1 block text-[clamp(1.2rem,2.4vw,1.9rem)] font-bold leading-tight">{item.title}</span>
                            {item.description && <span className="mt-1 block max-w-sm text-sm text-white/75">{item.description}</span>}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ImageAccordion;
