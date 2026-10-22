import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Minus, Plus, RotateCcw, X } from "lucide-react";

/*
 * World Map: a flat dotted world (canvas dots, SVG overlay) in three modes.
 *  connections – flights arc between cities with a travelling glow
 *  live        – random pings pop up across the land with an online counter
 *  locations   – office pins with labels; click one for its info card
 */

// 2° land mask (Natural Earth 110m): 180 × 69 cells from 180°W, 78°N, one bit each.
const LAND = "AAAAwADkw////wEABAAAAABgAAAAAAAAAADAUT8A/v8PAAAAAAwA/j8AuAEAAAAAcBHtDcD/fwAAAAAwAPz/fwMAABCAAQD5w/wD8P8FAAAcAIL7//9//xOAAP/ff0668QD/HwAA+A8At///////v3/w/////x8++B8AAOD/1//7////////jP////+/+AE/gAcAn9f//////////w/w/////wEs4AEAAHz+////////////gL////8HeAAcAADg5///////////9ADgAf7/f4AnAAAAAH78////////H0QAAAiA//8f8AcAAIBB4////////38ADwAQAOD//5//AQAAHAT/////////A3AAAAAA/v//+T8AAGDz//////////8DAQAAAMD/////AwAAsP//////////LwAAAAAA6P///2IAAAD+//////////8CAAAAAAD///8/CAAA4P//////////JwAAAAAA8P///wYAAAD+/unz/////z8AAAAAAAD///8HAAAA/pgPPP//////MQAAAAAA8P//PwAAAMBD9v7n/////wcBAAAAAAD///8AAAAAPkD7f/7///8hEAAAAAAA4P//DwAAAIDhAv/n////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD////7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cv+P//PwAAAAAAAAAAHjAAAADA/////g/+//8EAAAAAAAAAOBhCAAAAP7//99/4D//AAAAAAAAAAAAPAMEAADA////+Qf84BcAAAAAAAAAAAA/AAAAAPz//58fgAf+QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgPAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAVIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDh//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAAYXgAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgbtQBAAAAAAAAAOD//w8AAPD/AwAAAAQIeAAAAAAAAAAA/P//AQAA/z8AAACAA4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P9/AAAA/z8EAAAAAD8GIAAAAAAAAAD8/wMAAPD/cQAAAAD4ZwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/EAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8BAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEIAfAAEAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const STEP = 2;
const COLS = 180;
const ROWS = 69;

const landCells = (() => {
    const bin = typeof atob === "function" ? atob(LAND) : "";
    const cells = [];
    for (let i = 0; i < COLS * ROWS; i++) if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) cells.push([i % COLS, Math.floor(i / COLS)]);
    return cells;
})();

// Lat/lon to map units (one unit per 2° cell).
const toXY = (lat, lon) => [(lon + 180) / STEP, (78 - lat) / STEP];

const CITIES = {
    bbsr: { label: "Bhubaneswar", lat: 20.3, lon: 85.8, note: "HQ · 42 people" },
    sf: { label: "San Francisco", lat: 37.8, lon: -122.4, note: "Design studio · 18 people" },
    ldn: { label: "London", lat: 51.5, lon: -0.1, note: "Sales · 11 people" },
    tyo: { label: "Tokyo", lat: 35.7, lon: 139.7, note: "Engineering · 23 people" },
    syd: { label: "Sydney", lat: -33.9, lon: 151.2, note: "Support · 7 people" },
    sp: { label: "São Paulo", lat: -23.5, lon: -46.6, note: "Partners · 5 people" },
    nbo: { label: "Nairobi", lat: -1.3, lon: 36.8, note: "Research · 4 people" },
};

const DEFAULT_LOCATIONS = Object.values(CITIES);
const DEFAULT_CONNECTIONS = [
    ["bbsr", "sf"],
    ["bbsr", "ldn"],
    ["bbsr", "tyo"],
    ["bbsr", "syd"],
    ["ldn", "sp"],
    ["ldn", "nbo"],
    ["tyo", "sf"],
];

function DotsCanvas({ dotColor, zoom }) {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext("2d");
        const draw = () => {
            // Layout size (ignores the zoom transform), drawn at a higher resolution when zoomed in.
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const dpr = Math.min((window.devicePixelRatio || 1) * zoom, 6);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const sx = width / COLS;
            const sy = height / ROWS;
            const r = Math.max(0.7, Math.min(sx, sy) * 0.28);
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = dotColor;
            for (const [c, row] of landCells) {
                ctx.beginPath();
                ctx.arc((c + 0.5) * sx, (row + 0.5) * sy, r, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        const ro = new ResizeObserver(draw);
        ro.observe(canvas);
        draw();
        return () => ro.disconnect();
    }, [dotColor, zoom]);
    return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

const MAX_ZOOM = 6;

/* Zoom and pan state for the map: buttons, Ctrl/⌘ + wheel, double-click, drag and pinch. */
function useZoom(viewRef) {
    const [view, setView] = useState({ k: 1, x: 0, y: 0 });
    const pointers = useRef(new Map());
    const gesture = useRef(null);
    const [dragging, setDragging] = useState(false);

    // Keep the zoomed map covering the frame.
    const clamp = (v) => {
        const el = viewRef.current;
        const w = el?.offsetWidth ?? 0;
        const h = el?.offsetHeight ?? 0;
        const k = Math.min(MAX_ZOOM, Math.max(1, v.k));
        return { k, x: Math.min(0, Math.max(w * (1 - k), v.x)), y: Math.min(0, Math.max(h * (1 - k), v.y)) };
    };
    // Zoom by a factor around a point (in frame pixels), keeping that point still.
    const zoomAt = (factor, px, py) =>
        setView((v) => {
            const k = Math.min(MAX_ZOOM, Math.max(1, v.k * factor));
            const r = k / v.k;
            return clamp({ k, x: px - (px - v.x) * r, y: py - (py - v.y) * r });
        });
    const center = () => {
        const el = viewRef.current;
        return [el.offsetWidth / 2, el.offsetHeight / 2];
    };
    const local = (e) => {
        const r = viewRef.current.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };

    useEffect(() => {
        const el = viewRef.current;
        const onWheel = (e) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            const [px, py] = local(e);
            zoomAt(Math.exp(-e.deltaY * 0.0025), px, py);
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlers = {
        onDoubleClick: (e) => {
            const [px, py] = local(e);
            zoomAt(2, px, py);
        },
        onPointerDown: (e) => {
            pointers.current.set(e.pointerId, local(e));
            gesture.current = null;
            setDragging(true);
        },
        onPointerMove: (e) => {
            if (!pointers.current.has(e.pointerId)) return;
            const prev = pointers.current.get(e.pointerId);
            const now = local(e);
            pointers.current.set(e.pointerId, now);
            const pts = [...pointers.current.values()];
            if (pts.length === 2) {
                // Pinch: zoom by the change in finger distance, around their middle.
                const d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
                const mid = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
                if (gesture.current?.d) zoomAt(d / gesture.current.d, mid[0], mid[1]);
                gesture.current = { d };
            } else if (pts.length === 1) {
                setView((v) => (v.k > 1 ? clamp({ ...v, x: v.x + now[0] - prev[0], y: v.y + now[1] - prev[1] }) : v));
            }
        },
        onPointerUp: (e) => {
            pointers.current.delete(e.pointerId);
            gesture.current = null;
            setDragging(pointers.current.size > 0);
        },
        onPointerCancel: (e) => {
            pointers.current.delete(e.pointerId);
            setDragging(pointers.current.size > 0);
        },
    };

    return {
        view,
        dragging,
        handlers,
        zoomIn: () => zoomAt(1.6, ...center()),
        zoomOut: () => zoomAt(1 / 1.6, ...center()),
        reset: () => setView({ k: 1, x: 0, y: 0 }),
    };
}

const WorldMap = ({
    variant = "connections",
    locations = DEFAULT_LOCATIONS,
    connections = DEFAULT_CONNECTIONS,
    dotColor = "rgba(161,161,170,0.55)",
    accentColor = "#a3e635",
    pingRate = 700,
    showLabels = true,
    zoomable = true,
    className = "",
}) => {
    const gradId = `wm-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
    const viewRef = useRef(null);
    const { view, dragging, handlers, zoomIn, zoomOut, reset } = useZoom(viewRef);
    const k = zoomable ? view.k : 1;
    const reduced = useReducedMotion();
    const [pings, setPings] = useState([]);
    const [online, setOnline] = useState(1284);
    const [selected, setSelected] = useState(null);

    const byKey = useMemo(() => {
        const map = {};
        Object.entries(CITIES).forEach(([k, v]) => (map[k] = v));
        locations.forEach((l, i) => (map[l.key ?? i] = l));
        return map;
    }, [locations]);

    // Live mode: drop a ping on a random land cell every few hundred ms.
    useEffect(() => {
        if (variant !== "live" || reduced) return undefined;
        const id = setInterval(() => {
            const [c, r] = landCells[Math.floor(Math.random() * landCells.length)];
            setPings((list) => [...list.slice(-14), { id: performance.now(), x: c + 0.5, y: r + 0.5 }]);
            setOnline((n) => Math.max(900, n + Math.round((Math.random() - 0.45) * 9)));
        }, pingRate);
        return () => clearInterval(id);
    }, [variant, pingRate, reduced]);

    const arcs = connections
        .map(([a, b]) => [byKey[a], byKey[b]])
        .filter(([a, b]) => a && b)
        .map(([a, b]) => {
            const [x1, y1] = toXY(a.lat, a.lon);
            const [x2, y2] = toXY(b.lat, b.lon);
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const cx = (x1 + x2) / 2;
            const cy = Math.min(y1, y2) - dist * 0.32;
            return { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, len: dist * 1.25 };
        });

    const pins = variant === "connections" ? Object.values(byKey).filter((l) => connections.some(([a, b]) => byKey[a] === l || byKey[b] === l)) : variant === "locations" ? locations : [];

    return (
        <div className={`relative w-full ${className}`}>
            <div
                ref={viewRef}
                {...(zoomable ? handlers : {})}
                className={`relative w-full overflow-hidden ${zoomable && k > 1 ? "cursor-grab touch-none active:cursor-grabbing" : "touch-pan-y"}`}
                style={{ aspectRatio: `${COLS} / ${ROWS}` }}
            >
            <div
                className={`absolute inset-0 origin-top-left ${dragging ? "" : "transition-transform duration-200 ease-out"}`}
                style={{ transform: zoomable ? `translate(${view.x}px, ${view.y}px) scale(${k})` : undefined }}
            >
                <DotsCanvas dotColor={dotColor} zoom={Math.ceil(k)} />
                <svg viewBox={`0 0 ${COLS} ${ROWS}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                    <defs>
                        <linearGradient id={gradId} x1="0" x2="1">
                            <stop offset="0" stopColor={accentColor} stopOpacity="0" />
                            <stop offset="0.5" stopColor={accentColor} stopOpacity="1" />
                            <stop offset="1" stopColor={accentColor} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {variant === "connections" &&
                        arcs.map((a, i) => (
                            <g key={i}>
                                <path d={a.d} fill="none" stroke={accentColor} strokeOpacity="0.3" strokeWidth={0.3 / k} />
                                <motion.path
                                    d={a.d}
                                    fill="none"
                                    stroke={accentColor}
                                    strokeLinecap="round"
                                    strokeWidth={0.65 / k}
                                    strokeDasharray={`${a.len * 0.18} ${a.len}`}
                                    initial={{ strokeDashoffset: a.len * 0.18 }}
                                    animate={reduced ? undefined : { strokeDashoffset: -a.len }}
                                    transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
                                />
                            </g>
                        ))}

                    {variant === "live" && (
                        <AnimatePresence>
                            {pings.map((p) => (
                                <g key={p.id}>
                                    <motion.circle cx={p.x} cy={p.y} fill={accentColor} initial={{ r: 0, opacity: 1 }} animate={{ r: 0.9, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
                                    <motion.circle cx={p.x} cy={p.y} fill="none" stroke={accentColor} strokeWidth="0.25" initial={{ r: 0.5, opacity: 0.9 }} animate={{ r: 4, opacity: 0 }} transition={{ duration: 1.6, ease: "easeOut" }} />
                                </g>
                            ))}
                        </AnimatePresence>
                    )}
                </svg>

                {/* Pins are HTML so they stay round at any aspect ratio. */}
                {pins.map((l, i) => {
                    const [x, y] = toXY(l.lat, l.lon);
                    const active = selected === l;
                    return (
                        <button
                            key={l.label ?? i}
                            type="button"
                            onClick={() => variant === "locations" && setSelected(active ? null : l)}
                            aria-label={l.label}
                            className={`group absolute ${variant === "locations" ? "cursor-pointer" : "cursor-default"}`}
                            // Counter-scale so pins keep their size while the map zooms.
                            style={{ left: `${(x / COLS) * 100}%`, top: `${(y / ROWS) * 100}%`, transform: `translate(-50%, -50%) scale(${1 / k})` }}
                        >
                            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-40 sm:h-5 sm:w-5" style={{ background: accentColor, animationDuration: "2.2s", animationDelay: `${i * 0.3}s` }} />
                            <span className="relative block h-1.5 w-1.5 rounded-full ring-2 ring-black/40 sm:h-2.5 sm:w-2.5" style={{ background: accentColor }} />
                            {showLabels && (
                                <span className={`pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-black/75 px-1.5 py-0.5 text-[0.65rem] font-medium text-white backdrop-blur sm:block ${variant === "connections" ? "opacity-0 transition-opacity group-hover:opacity-100" : ""}`}>
                                    {l.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

                {zoomable && (
                    <div className="absolute left-2 top-2 z-10 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-950/80 text-white backdrop-blur">
                        <button type="button" aria-label="Zoom in" onClick={zoomIn} className="grid h-7 w-7 place-items-center hover:bg-white/10">
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" aria-label="Zoom out" onClick={zoomOut} disabled={k <= 1} className="grid h-7 w-7 place-items-center border-t border-white/10 hover:bg-white/10 disabled:opacity-35">
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        {k > 1 && (
                            <button type="button" aria-label="Reset zoom" onClick={reset} className="grid h-7 w-7 place-items-center border-t border-white/10 hover:bg-white/10">
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                )}

                <AnimatePresence>
                    {variant === "locations" && selected && (
                        <motion.div
                            key={selected.label}
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-3 left-3 flex max-w-[16rem] items-start gap-3 rounded-xl border border-white/10 bg-neutral-950/90 p-3 text-white shadow-xl backdrop-blur"
                        >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-black" style={{ background: accentColor }}>
                                <MapPin className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[0.85rem] font-semibold">{selected.label}</p>
                                {selected.note && <p className="text-[0.75rem] text-white/60">{selected.note}</p>}
                                <p className="mt-1 font-mono text-[0.65rem] text-white/40">
                                    {selected.lat.toFixed(1)}°, {selected.lon.toFixed(1)}°
                                </p>
                            </div>
                            <button type="button" aria-label="Close" onClick={() => setSelected(null)} className="ml-1 text-white/50 hover:text-white">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {variant === "live" && (
                <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/80 px-3 py-1.5 text-[0.75rem] text-white backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: accentColor }} />
                    <span className="font-semibold tabular-nums">{online.toLocaleString()}</span>
                    <span className="text-white/55">online now</span>
                </div>
            )}
        </div>
    );
};

export default WorldMap;
