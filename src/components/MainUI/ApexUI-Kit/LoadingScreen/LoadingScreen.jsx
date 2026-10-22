import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/*
 * Loading Screen: five ways to wait.
 *  orbit    – dots orbit a breathing core around the percentage
 *  progress – a big counting percentage, a sliding bar and rotating status lines
 *  blocks   – a grid of tiles fills in like a wave
 *  catch    – a mini game: tap the orb before it fades while things load
 *  runner   – a mini game: jump the blocks (Space / ↑ / tap) while things load
 * Pass `progress` (0–100) yourself, or leave it out and it runs on its own.
 */

const MESSAGES = ["Warming up the engines", "Fetching your components", "Polishing pixels", "Almost there"];

// Simulated progress that eases toward 100 over `duration` ms, then calls onComplete.
function useProgress(progress, duration, loop, onComplete) {
    const [auto, setAuto] = useState(0);
    const doneRef = useRef(onComplete);
    doneRef.current = onComplete;
    const controlled = typeof progress === "number";

    useEffect(() => {
        if (controlled) return undefined;
        let raf = 0;
        let start = performance.now();
        let fired = false;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            // Fast start, slow middle, quick finish — the way real loads feel.
            const eased = t < 0.85 ? 0.92 * (1 - Math.pow(1 - t / 0.85, 2.2)) : 0.92 + 0.08 * ((t - 0.85) / 0.15);
            setAuto(Math.round(eased * 100));
            if (t >= 1) {
                if (!fired) {
                    fired = true;
                    doneRef.current?.();
                }
                if (loop) {
                    start = now + 900;
                    fired = false;
                } else return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [controlled, duration, loop]);

    useEffect(() => {
        if (controlled && progress >= 100) doneRef.current?.();
    }, [controlled, progress]);

    return Math.max(0, Math.min(100, controlled ? progress : auto));
}

function Bar({ value, color, track }) {
    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: track }}>
            <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: `${value}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
        </div>
    );
}

function Orbit({ value, color, moving }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative grid h-36 w-36 place-items-center">
                {[0, 1, 2].map((ring) => (
                    <motion.div
                        key={ring}
                        className="absolute inset-0"
                        style={{ scale: 1 - ring * 0.22, rotate: ring * 40 }}
                        // Each ring starts at its own angle so the dots never line up.
                        animate={moving ? { rotate: ring * 40 + (ring % 2 ? -360 : 360) } : undefined}
                        transition={{ duration: 2.4 + ring * 1.1, repeat: Infinity, ease: "linear" }}
                    >
                        {[0, 1, 2].map((d) => (
                            <div key={d} className="absolute inset-0" style={{ transform: `rotate(${d * 120}deg)` }}>
                                <span
                                    className="absolute left-1/2 top-0 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full"
                                    style={{ background: color, opacity: 1 - ring * 0.25, boxShadow: `0 0 10px ${color}` }}
                                />
                            </div>
                        ))}
                    </motion.div>
                ))}
                <motion.div
                    className="h-12 w-12 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 35%, #fff, ${color} 55%)`, boxShadow: `0 0 40px ${color}` }}
                    animate={moving ? { scale: [0.9, 1.08, 0.9] } : undefined}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <p className="mt-5 font-mono text-2xl font-semibold tabular-nums">{value}%</p>
        </div>
    );
}

function ProgressView({ value, color, track, moving }) {
    const message = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(value / (100 / MESSAGES.length)))];
    return (
        <div className="w-[min(22rem,80vw)]">
            <p className="font-mono text-[clamp(3.5rem,12vw,5.5rem)] font-bold leading-none tabular-nums tracking-tight">
                {value}
                <span className="text-[0.4em] align-top opacity-50">%</span>
            </p>
            <div className="mt-5">
                <Bar value={value} color={color} track={track} />
            </div>
            <div className="mt-3 h-5 overflow-hidden text-sm opacity-70">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={message} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: moving ? 0.25 : 0 }}>
                        {message}…
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}

function Blocks({ value, color, track, moving }) {
    const N = 7;
    const filled = Math.round((value / 100) * N * N);
    return (
        <div className="flex flex-col items-center">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
                {Array.from({ length: N * N }, (_, i) => {
                    const on = i < filled;
                    const r = Math.floor(i / N);
                    const c = i % N;
                    return (
                        <motion.span
                            key={i}
                            className="h-4 w-4 rounded-[5px] sm:h-5 sm:w-5"
                            style={{ background: on ? color : track }}
                            animate={moving ? { scale: on ? [1, 0.7, 1] : 1, opacity: on ? 1 : [0.5, 1, 0.5] } : undefined}
                            transition={{ duration: 1.6, repeat: Infinity, delay: (r + c) * 0.07, ease: "easeInOut" }}
                        />
                    );
                })}
            </div>
            <p className="mt-5 font-mono text-lg font-semibold tabular-nums">{value}%</p>
        </div>
    );
}

function CatchGame({ value, color, track }) {
    const [score, setScore] = useState(0);
    const [orb, setOrb] = useState({ id: 0, x: 50, y: 50 });

    useEffect(() => {
        const id = setTimeout(() => {
            setScore(0);
            setOrb((o) => ({ id: o.id + 1, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 }));
        }, 1400);
        return () => clearTimeout(id);
    }, [orb.id]);

    return (
        <div className="w-[min(22rem,84vw)]">
            <div className="mb-2 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] opacity-70">
                <span>Catch the orb</span>
                <span>Score {score}</span>
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border" style={{ borderColor: track, backgroundImage: `radial-gradient(${track} 1px, transparent 1px)`, backgroundSize: "14px 14px" }}>
                <AnimatePresence>
                    <motion.button
                        key={orb.id}
                        type="button"
                        aria-label="Catch the orb"
                        onPointerDown={() => {
                            setScore((s) => s + 1);
                            setOrb((o) => ({ id: o.id + 1, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 }));
                        }}
                        className="absolute h-9 w-9 rounded-full outline-none"
                        style={{ left: `${orb.x}%`, top: `${orb.y}%`, marginLeft: -18, marginTop: -18, background: color, boxShadow: `0 0 24px ${color}` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.15, 1, 0.55], opacity: [0, 1, 1, 0.7] }}
                        exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ duration: 1.4, times: [0, 0.15, 0.3, 1], ease: "easeOut" }}
                    />
                </AnimatePresence>
            </div>
            <div className="mt-4 flex items-center gap-3">
                <Bar value={value} color={color} track={track} />
                <span className="font-mono text-xs tabular-nums opacity-70">{value}%</span>
            </div>
        </div>
    );
}

function RunnerGame({ value, color, track, ink }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const jumpRef = useRef(() => {});

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let last = performance.now();
        let w = 0;
        let h = 0;
        const g = { y: 0, vy: 0, obstacles: [], speed: 220, spawn: 0.9, score: 0, flash: 0 };

        const resize = () => {
            const r = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width;
            h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        jumpRef.current = () => {
            if (g.y === 0) g.vy = 520;
        };

        const tick = (now) => {
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            const ground = h - 18;
            const px = 42;
            const size = 18;

            // Physics.
            g.vy -= 1500 * dt;
            g.y = Math.max(0, g.y + g.vy * dt);
            if (g.y === 0) g.vy = Math.max(0, g.vy);
            g.speed = Math.min(420, g.speed + 6 * dt);
            g.spawn -= dt;
            if (g.spawn <= 0) {
                const tall = Math.random() < 0.35;
                g.obstacles.push({ x: w + 10, w: tall ? 14 : 18, h: tall ? 30 : 18 });
                g.spawn = 0.75 + Math.random() * 0.9;
            }
            g.obstacles.forEach((o) => (o.x -= g.speed * dt));
            g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10);

            // Collision resets the run.
            const top = ground - g.y - size;
            const hit = g.obstacles.some((o) => px + size > o.x + 2 && px < o.x + o.w - 2 && top + size > ground - o.h + 2);
            if (hit) {
                g.obstacles = [];
                g.speed = 220;
                g.flash = 0.25;
                g.score = 0;
            }
            g.score += dt * 10;
            g.flash = Math.max(0, g.flash - dt);
            const s = Math.floor(g.score);
            setScore((prev) => (prev === s ? prev : s));
            setBest((b) => Math.max(b, s));

            // Draw.
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = track;
            ctx.fillRect(0, ground, w, 2);
            for (let x = (now / 12) % 24; x < w; x += 24) ctx.fillRect(w - x, ground + 8, 6, 2);
            ctx.fillStyle = g.flash ? "#ef4444" : color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.roundRect(px, top, size, size, 5);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = ink;
            ctx.globalAlpha = 0.85;
            g.obstacles.forEach((o) => {
                ctx.beginPath();
                ctx.roundRect(o.x, ground - o.h, o.w, o.h, 3);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        const onKey = (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                if (canvas.closest("[data-loading-screen]")?.matches(":hover") || document.activeElement === canvas) {
                    e.preventDefault();
                    jumpRef.current();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("keydown", onKey);
        };
    }, [color, track, ink]);

    return (
        <div className="w-[min(26rem,86vw)]">
            <div className="mb-2 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] opacity-70">
                <span>Space / tap to jump</span>
                <span>
                    {score} · best {best}
                </span>
            </div>
            <canvas
                ref={canvasRef}
                tabIndex={0}
                aria-label="Runner game: press Space or tap to jump"
                onPointerDown={() => jumpRef.current()}
                className="h-32 w-full cursor-pointer touch-manipulation rounded-2xl border outline-none focus-visible:ring-2"
                style={{ borderColor: track }}
            />
            <div className="mt-4 flex items-center gap-3">
                <Bar value={value} color={color} track={track} />
                <span className="font-mono text-xs tabular-nums opacity-70">{value}%</span>
            </div>
        </div>
    );
}

const LoadingScreen = ({
    variant = "orbit",
    progress,
    duration = 6000,
    loop = true,
    accentColor = "#a3e635",
    theme = "dark",
    title = "Loading",
    fullScreen = false,
    onComplete,
    className = "",
}) => {
    const moving = !useReducedMotion();
    const value = useProgress(progress, duration, loop, onComplete);
    const dark = theme !== "light";
    const track = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
    const ink = dark ? "#e5e5e5" : "#262626";
    const shared = { value, color: accentColor, track, ink, moving };

    return (
        <div
            data-loading-screen=""
            role="status"
            aria-live="polite"
            aria-label={`${title} ${value}%`}
            className={`flex flex-col items-center justify-center gap-6 p-8 ${fullScreen ? "fixed inset-0 z-[100]" : "relative h-full w-full"} ${dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"} ${className}`}
        >
            {variant === "orbit" && <Orbit {...shared} />}
            {variant === "progress" && <ProgressView {...shared} />}
            {variant === "blocks" && <Blocks {...shared} />}
            {variant === "catch" && <CatchGame {...shared} />}
            {variant === "runner" && <RunnerGame {...shared} />}
            {variant !== "progress" && <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-50">{title}</p>}
        </div>
    );
};

export default LoadingScreen;
