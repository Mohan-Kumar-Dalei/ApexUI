import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Pause, Phone, PhoneOff, Play, SkipBack, SkipForward, Timer } from "lucide-react";

/*
 * Dynamic Island: a black capsule that morphs between live activities —
 * idle, music, call, timer and notification. Click the music view to expand
 * it. Runs through the views on its own, or follows a controlled `view`.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const ALL_VIEWS = ["idle", "music", "call", "timer", "notification"];

// Capsule size per view, in rem so it scales with the page's font size.
const SIZES = {
    idle: { width: "7.5rem", height: "2.1rem", borderRadius: "1.05rem" },
    music: { width: "17rem", height: "2.6rem", borderRadius: "1.3rem" },
    musicExpanded: { width: "22rem", height: "11.25rem", borderRadius: "2.4rem" },
    call: { width: "22rem", height: "4.6rem", borderRadius: "2.3rem" },
    timer: { width: "14rem", height: "2.6rem", borderRadius: "1.3rem" },
    notification: { width: "22rem", height: "4.6rem", borderRadius: "2.3rem" },
};

const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 };

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Waveform({ color, playing, moving }) {
    const bars = [0.55, 1, 0.7, 0.9, 0.45];
    return (
        <span className="flex h-4 items-center gap-[3px]" aria-hidden="true">
            {bars.map((peak, i) => (
                <motion.span
                    key={i}
                    className="w-[3px] origin-center rounded-full"
                    style={{ backgroundColor: color, height: "100%" }}
                    animate={playing && moving ? { scaleY: [0.3, peak, 0.4, peak * 0.8, 0.3] } : { scaleY: 0.3 }}
                    transition={playing && moving ? { duration: 0.9 + i * 0.12, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                />
            ))}
        </span>
    );
}

const DynamicIsland = ({
    view,
    defaultView = "music",
    views = ALL_VIEWS,
    autoPlay = true,
    interval = 3600,
    accentColor = "#a3e635",
    music = { title: "Midnight City", artist: "Apex Sessions", cover: `${IK}/spiderman.png?tr=f-auto,q-80,w-200` },
    call = { name: "Tony Stark", subtitle: "Mobile", avatar: `${IK}/ironman.png?tr=f-auto,q-80,w-160` },
    notification = { app: "Messages", title: "Peter Parker", message: "On my way — saving the city first 🕷️" },
    timerSeconds = 300,
    onViewChange,
    className = "",
}) => {
    const controlled = view !== undefined;
    const [ownView, setOwnView] = useState(views.includes(defaultView) ? defaultView : views[0]);
    const current = controlled ? view : ownView;
    const [expanded, setExpanded] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [remaining, setRemaining] = useState(timerSeconds);
    const moving = !useReducedMotion();
    const onViewChangeRef = useRef(onViewChange);
    onViewChangeRef.current = onViewChange;

    // Cycle through the views on its own (uncontrolled), pausing while hovered or expanded.
    useEffect(() => {
        if (controlled || !autoPlay || hovered || expanded || views.length < 2) return undefined;
        const id = setTimeout(() => {
            setOwnView((v) => {
                const next = views[(views.indexOf(v) + 1) % views.length];
                onViewChangeRef.current?.(next);
                return next;
            });
        }, interval);
        return () => clearTimeout(id);
    }, [controlled, autoPlay, hovered, expanded, views, interval, ownView]);

    // A new view always starts compact.
    useEffect(() => setExpanded(false), [current]);

    // Live countdown while the timer is showing.
    useEffect(() => {
        if (current !== "timer") return undefined;
        const id = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : timerSeconds)), 1000);
        return () => clearInterval(id);
    }, [current, timerSeconds]);

    const sizeKey = current === "music" && expanded ? "musicExpanded" : current;
    const size = SIZES[sizeKey] ?? SIZES.idle;
    const canExpand = current === "music";

    const content = {
        idle: <span className="sr-only">Idle</span>,
        music: (
            <div className="flex h-full w-full items-center justify-between pl-1.5 pr-4">
                <img src={music.cover} alt="" className="h-[1.85rem] w-[1.85rem] rounded-full object-cover" draggable="false" />
                <span className="sr-only">Now playing {music.title} by {music.artist}</span>
                <Waveform color={accentColor} playing={playing} moving={moving} />
            </div>
        ),
        musicExpanded: (
            <div className="flex h-full w-full flex-col justify-between p-5">
                <div className="flex items-center gap-3.5">
                    <img src={music.cover} alt="" className="h-14 w-14 rounded-2xl object-cover" draggable="false" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.95rem] font-semibold">{music.title}</p>
                        <p className="truncate text-[0.8rem] text-white/50">{music.artist}</p>
                    </div>
                    <Waveform color={accentColor} playing={playing} moving={moving} />
                </div>
                <div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/15">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: accentColor }}
                            initial={{ width: "32%" }}
                            animate={{ width: playing && moving ? "78%" : "32%" }}
                            transition={{ duration: playing && moving ? 20 : 0.3, ease: "linear" }}
                        />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-7">
                        <button type="button" aria-label="Previous" onClick={(e) => e.stopPropagation()} className="text-white/70 transition hover:text-white">
                            <SkipBack className="h-5 w-5" fill="currentColor" />
                        </button>
                        <button
                            type="button"
                            aria-label={playing ? "Pause" : "Play"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPlaying((p) => !p);
                            }}
                            className="text-white transition hover:scale-105"
                        >
                            {playing ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="h-7 w-7" fill="currentColor" />}
                        </button>
                        <button type="button" aria-label="Next" onClick={(e) => e.stopPropagation()} className="text-white/70 transition hover:text-white">
                            <SkipForward className="h-5 w-5" fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        ),
        call: (
            <div className="flex h-full w-full items-center gap-3 pl-2.5 pr-2.5">
                <img src={call.avatar} alt="" className="h-[3.4rem] w-[3.4rem] rounded-full object-cover" draggable="false" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.72rem] text-white/50">{call.subtitle}</p>
                    <p className="truncate text-[0.95rem] font-semibold">{call.name}</p>
                </div>
                <button type="button" aria-label="Decline" onClick={(e) => e.stopPropagation()} className="grid h-11 w-11 place-items-center rounded-full bg-[#ff453a] transition hover:brightness-110">
                    <PhoneOff className="h-[1.1rem] w-[1.1rem]" />
                </button>
                <button type="button" aria-label="Accept" onClick={(e) => e.stopPropagation()} className="grid h-11 w-11 place-items-center rounded-full bg-[#30d158] transition hover:brightness-110">
                    <Phone className="h-[1.1rem] w-[1.1rem]" fill="currentColor" />
                </button>
            </div>
        ),
        timer: (
            <div className="flex h-full w-full items-center justify-between pl-3 pr-4">
                <span className="grid h-[1.85rem] w-[1.85rem] place-items-center rounded-full bg-[#ff9f0a]/20 text-[#ff9f0a]">
                    <Timer className="h-4 w-4" />
                </span>
                <span className="font-mono text-[0.95rem] font-semibold tabular-nums text-[#ff9f0a]" aria-label={`Timer ${formatTime(remaining)} left`}>
                    {formatTime(remaining)}
                </span>
            </div>
        ),
        notification: (
            <div className="flex h-full w-full items-center gap-3 pl-2.5 pr-5">
                <span className="grid h-[3.4rem] w-[3.4rem] shrink-0 place-items-center rounded-full" style={{ backgroundColor: accentColor }}>
                    <MessageCircle className="h-6 w-6 text-black" fill="currentColor" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between gap-2 text-[0.72rem] text-white/50">
                        <span className="truncate">{notification.app}</span>
                        <span className="shrink-0">now</span>
                    </p>
                    <p className="truncate text-[0.9rem] font-semibold">{notification.title}</p>
                    <p className="truncate text-[0.78rem] text-white/70">{notification.message}</p>
                </div>
            </div>
        ),
    };

    return (
        <div className={`flex w-full justify-center ${className}`}>
            <motion.div
                role="status"
                aria-live="polite"
                aria-label="Dynamic island"
                onClick={canExpand ? () => setExpanded((e) => !e) : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                className={`relative max-w-[calc(100vw-2rem)] overflow-hidden bg-black text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.06)] ${canExpand ? "cursor-pointer" : ""}`}
                initial={false}
                animate={size}
                transition={moving ? spring : { duration: 0 }}
            >
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                        key={sizeKey}
                        className="absolute inset-0 flex"
                        initial={moving ? { opacity: 0, scale: 0.92, filter: "blur(6px)" } : { opacity: 0 }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={moving ? { opacity: 0, scale: 0.92, filter: "blur(6px)" } : { opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: moving ? 0.06 : 0 }}
                    >
                        {content[sizeKey]}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DynamicIsland;
