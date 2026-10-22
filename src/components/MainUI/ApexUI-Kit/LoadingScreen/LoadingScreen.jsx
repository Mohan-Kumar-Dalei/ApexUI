import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";

/*
 * Loading Screen: five ways to wait.
 *  orbit    – dots orbit a breathing core around the percentage
 *  progress – a big counting percentage, a sliding bar and rotating status lines
 *  blocks   – a grid of tiles fills in like a wave
 *  catch    – a mini game: tap the orb before its ring runs out and build a combo
 *  runner   – a mini game: jump the neon pillars (Space / ↑ / tap) while things load
 *  racer    – a mini game: steer through traffic (← → / tap a side) while things load
 * Pass `progress` (0–100) yourself, or leave it out and it runs on its own.
 */

const MESSAGES = ["Warming up the engines", "Fetching your components", "Polishing pixels", "Almost there"];
const messageFor = (v) => MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(v / (100 / MESSAGES.length)))];

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
            const t = Math.min(1, Math.max(0, (now - start) / duration));
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

    return Math.round(Math.max(0, Math.min(100, controlled ? progress : auto)));
}

function Bar({ value, color, track }) {
    return (
        <div className="relative h-1.5 w-full overflow-hidden rounded-full" style={{ background: track }}>
            <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 14px ${color}` }} />
        </div>
    );
}

// Progress row shared by the game variants.
function Footer({ value, color, track, statusText }) {
    return (
        <div className="mt-5 w-full">
            <div className="mb-2 flex items-center justify-between text-[0.75rem]">
                <span className="opacity-60">{statusText ?? `${messageFor(value)}…`}</span>
                <span className="font-mono font-semibold tabular-nums">{value}%</span>
            </div>
            <Bar value={value} color={color} track={track} />
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
                                <span className="absolute left-1/2 top-0 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full" style={{ background: color, opacity: 1 - ring * 0.25, boxShadow: `0 0 10px ${color}` }} />
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
    const message = messageFor(value);
    return (
        <div className="w-[min(22rem,80vw)]">
            <p className="font-mono text-[clamp(3.5rem,12vw,5.5rem)] font-bold leading-none tabular-nums tracking-tight">
                {value}
                <span className="align-top text-[0.4em] opacity-50">%</span>
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

/* ---------------------------------------------------------------- Catch game */

const ORB_LIFE = 1.5; // seconds before an orb escapes

function CatchGame({ value, color, track, dark, statusText }) {
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [combo, setCombo] = useState(0);
    const [orb, setOrb] = useState({ id: 0, x: 50, y: 55 });
    const [bursts, setBursts] = useState([]);
    const arena = useAnimationControls();

    const nextOrb = (id) => ({ id: id + 1, x: 12 + Math.random() * 76, y: 22 + Math.random() * 60 });

    // An orb that escapes resets the combo and nudges the arena.
    useEffect(() => {
        const t = setTimeout(() => {
            setCombo(0);
            arena.start({ x: [0, -6, 6, -3, 0], transition: { duration: 0.3 } });
            setOrb((o) => nextOrb(o.id));
        }, ORB_LIFE * 1000);
        return () => clearTimeout(t);
    }, [orb.id, arena]);

    const hit = () => {
        const nextCombo = combo + 1;
        const gain = Math.min(5, 1 + Math.floor(nextCombo / 3));
        setCombo(nextCombo);
        setScore((s) => {
            const n = s + gain;
            setBest((b) => Math.max(b, n));
            return n;
        });
        setBursts((list) => [...list.slice(-4), { id: performance.now(), x: orb.x, y: orb.y, gain }]);
        setOrb((o) => nextOrb(o.id));
    };

    const surface = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";

    return (
        <div className="w-[min(24rem,86vw)]">
            <motion.div
                animate={arena}
                className="relative h-52 overflow-hidden rounded-3xl border"
                style={{
                    borderColor: track,
                    background: `radial-gradient(120% 90% at 50% 0%, ${color}1f, transparent 60%), ${surface}`,
                    backgroundImage: `linear-gradient(${track} 1px, transparent 1px), linear-gradient(90deg, ${track} 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                }}
            >
                {/* HUD */}
                <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
                    <span className="rounded-full px-2.5 py-1 backdrop-blur" style={{ background: dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)" }}>
                        Score <span className="ml-1 font-mono text-[0.85rem] tabular-nums" style={{ color }}>{score}</span>
                    </span>
                    <AnimatePresence>
                        {combo >= 3 && (
                            <motion.span
                                key={Math.floor(combo / 3)}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                className="rounded-full px-2.5 py-1 font-mono text-black"
                                style={{ background: color, boxShadow: `0 0 16px ${color}` }}
                            >
                                ×{Math.min(5, 1 + Math.floor(combo / 3))} combo
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <span className="rounded-full px-2.5 py-1 opacity-80 backdrop-blur" style={{ background: dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)" }}>
                        Best <span className="ml-1 font-mono tabular-nums">{best}</span>
                    </span>
                </div>

                {/* The orb with a ring that empties as time runs out. */}
                <AnimatePresence>
                    <motion.button
                        key={orb.id}
                        type="button"
                        aria-label="Catch the orb"
                        onPointerDown={hit}
                        className="absolute grid h-14 w-14 place-items-center rounded-full outline-none"
                        style={{ left: `${orb.x}%`, top: `${orb.y}%`, marginLeft: "-1.75rem", marginTop: "-1.75rem" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.22 } }}
                        transition={{ type: "spring", stiffness: 420, damping: 18 }}
                    >
                        <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
                            <circle cx="28" cy="28" r="25" fill="none" stroke={track} strokeWidth="3" />
                            <motion.circle cx="28" cy="28" r="25" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="157" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 157 }} transition={{ duration: ORB_LIFE, ease: "linear" }} />
                        </svg>
                        <motion.span
                            className="h-7 w-7 rounded-full"
                            style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, boxShadow: `0 0 22px ${color}` }}
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                        />
                    </motion.button>
                </AnimatePresence>

                {/* Hit bursts: sparks and a floating +points. */}
                {bursts.map((b) => (
                    <div key={b.id} className="pointer-events-none absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
                        {Array.from({ length: 8 }, (_, i) => {
                            const a = (i / 8) * Math.PI * 2;
                            return (
                                <motion.span
                                    key={i}
                                    className="absolute h-1.5 w-1.5 rounded-full"
                                    style={{ background: color, marginLeft: -3, marginTop: -3 }}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            );
                        })}
                        <motion.span
                            className="absolute w-10 text-center font-mono text-sm font-bold"
                            style={{ color, marginLeft: "-1.25rem" }}
                            initial={{ y: -10, opacity: 1 }}
                            animate={{ y: -42, opacity: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            onAnimationComplete={() => setBursts((list) => list.filter((x) => x.id !== b.id))}
                        >
                            +{b.gain}
                        </motion.span>
                    </div>
                ))}
            </motion.div>
            <Footer value={value} color={color} track={track} statusText={statusText} />
        </div>
    );
}

/* --------------------------------------------------------------- Runner game */

function RunnerGame({ value, color, track, dark, statusText }) {
    const canvasRef = useRef(null);
    const jumpRef = useRef(() => {});
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let last = performance.now();
        let w = 0;
        let h = 0;
        const sky = dark ? ["#05060d", "#0d1222"] : ["#eef2ff", "#f8fafc"];
        const hill = dark ? ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.09)"] : ["rgba(15,23,42,0.06)", "rgba(15,23,42,0.1)"];
        const pillar = dark ? "#e5e7eb" : "#1f2937";
        const stars = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random() * 0.6, r: Math.random() * 1.2 + 0.3, p: Math.random() * 6 }));
        const g = { y: 0, vy: 0, rot: 0, obstacles: [], dust: [], ghosts: [], speed: 240, spawn: 1.1, score: 0, shake: 0, flash: 0, dist: 0, buffer: 0 };

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

        const puff = (x, y, n) => {
            for (let i = 0; i < n; i++) g.dust.push({ x, y, vx: -40 - Math.random() * 80, vy: -Math.random() * 60, life: 0.5, t: 0 });
        };
        jumpRef.current = () => {
            setStarted(true);
            g.buffer = 0.12; // a press just before landing still counts
        };

        // Rolling hills, drawn as a smooth line scrolling at `rate`.
        const hills = (base, amp, rate, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let x = 0; x <= w; x += 8) {
                const t = (x + g.dist * rate) * 0.012;
                ctx.lineTo(x, base - (Math.sin(t) * 0.6 + Math.sin(t * 2.3) * 0.4) * amp);
            }
            ctx.lineTo(w, h);
            ctx.fill();
        };

        const tick = (now) => {
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            const ground = h - 26;
            const size = 20;
            const px = Math.max(44, w * 0.14);

            // Physics.
            g.buffer = Math.max(0, g.buffer - dt);
            if (g.buffer > 0 && g.y === 0) {
                g.vy = 560;
                g.buffer = 0;
                puff(px + size / 2, ground, 5);
            }
            const wasAir = g.y > 0;
            g.vy -= 1650 * dt;
            g.y = Math.max(0, g.y + g.vy * dt);
            if (g.y === 0) {
                g.vy = Math.max(0, g.vy);
                if (wasAir) puff(px + size / 2, ground, 7);
                g.rot = Math.round(g.rot / (Math.PI / 2)) * (Math.PI / 2);
            } else g.rot += dt * 7.5;

            g.speed = Math.min(460, g.speed + 7 * dt);
            g.dist += g.speed * dt;
            g.spawn -= dt;
            if (g.spawn <= 0) {
                const tall = Math.random() < 0.4;
                g.obstacles.push({ x: w + 20, w: tall ? 16 : 22, h: tall ? 40 : 24 });
                if (Math.random() < 0.25) g.obstacles.push({ x: w + 46, w: 16, h: 22 });
                g.spawn = 0.8 + Math.random() * 0.8 - Math.min(0.3, g.speed / 2000);
            }
            for (const o of g.obstacles) o.x -= g.speed * dt;
            g.obstacles = g.obstacles.filter((o) => o.x + o.w > -20);
            for (const d of g.dust) {
                d.t += dt;
                d.x += d.vx * dt;
                d.y += d.vy * dt;
                d.vy += 200 * dt;
            }
            g.dust = g.dust.filter((d) => d.t < d.life);

            const top = ground - g.y - size;
            g.ghosts.push({ y: top, rot: g.rot });
            if (g.ghosts.length > 5) g.ghosts.shift();

            // Collision resets the run.
            const hitIt = g.obstacles.some((o) => px + size - 3 > o.x && px + 3 < o.x + o.w && top + size > ground - o.h + 3);
            if (hitIt) {
                g.obstacles = [];
                g.speed = 240;
                g.shake = 0.3;
                g.flash = 0.35;
                g.score = 0;
            }
            g.score += dt * 12;
            g.shake = Math.max(0, g.shake - dt);
            g.flash = Math.max(0, g.flash - dt);
            const s = Math.floor(g.score);
            setScore((prev) => (prev === s ? prev : s));
            setBest((b) => Math.max(b, s));

            // Draw.
            ctx.save();
            if (g.shake) ctx.translate((Math.random() - 0.5) * 10 * g.shake, (Math.random() - 0.5) * 10 * g.shake);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, sky[0]);
            bg.addColorStop(1, sky[1]);
            ctx.fillStyle = bg;
            ctx.fillRect(-10, -10, w + 20, h + 20);
            if (dark) {
                for (const st of stars) {
                    ctx.globalAlpha = 0.35 + 0.35 * Math.sin(now / 600 + st.p);
                    ctx.fillStyle = "#fff";
                    ctx.beginPath();
                    ctx.arc(((st.x * w - g.dist * 0.02) % w + w) % w, st.y * h, st.r, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
            hills(ground - 22, 16, 0.15, hill[0]);
            hills(ground - 6, 10, 0.35, hill[1]);

            // Ground with moving dashes.
            ctx.fillStyle = track;
            ctx.fillRect(0, ground, w, 2);
            ctx.fillStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)";
            for (let x = -(g.dist % 32); x < w; x += 32) ctx.fillRect(x, ground + 9, 12, 2);

            // Neon pillars.
            for (const o of g.obstacles) {
                ctx.fillStyle = pillar;
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.roundRect(o.x, ground - o.h, o.w, o.h, 4);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = "#f43f5e";
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 10;
                ctx.fillRect(o.x + 2, ground - o.h, o.w - 4, 3);
                ctx.shadowBlur = 0;
            }

            // Dust.
            for (const d of g.dust) {
                ctx.globalAlpha = 1 - d.t / d.life;
                ctx.fillStyle = dark ? "#cbd5e1" : "#64748b";
                ctx.beginPath();
                ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Runner: faded echoes, then the glowing square that spins in the air.
            const drawBox = (y, rot, alpha) => {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(px + size / 2, y + size / 2);
                ctx.rotate(rot);
                ctx.fillStyle = g.flash ? "#f43f5e" : color;
                ctx.shadowColor = color;
                ctx.shadowBlur = alpha === 1 ? 18 : 0;
                ctx.beginPath();
                ctx.roundRect(-size / 2, -size / 2, size, size, 5);
                ctx.fill();
                if (alpha === 1) {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "rgba(0,0,0,0.75)";
                    ctx.fillRect(3, -4, 4, 4);
                }
                ctx.restore();
            };
            g.ghosts.forEach((gh, i) => g.y > 0 && drawBox(gh.y, gh.rot, (i / g.ghosts.length) * 0.25));
            drawBox(top, g.rot, 1);

            if (g.flash) {
                ctx.fillStyle = `rgba(244,63,94,${g.flash * 0.25})`;
                ctx.fillRect(0, 0, w, h);
            }
            ctx.restore();
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        const onKey = (e) => {
            if (e.code !== "Space" && e.code !== "ArrowUp") return;
            const area = canvas.closest("[data-loading-screen]");
            if (area?.matches(":hover") || area?.contains(document.activeElement)) {
                e.preventDefault();
                jumpRef.current();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("keydown", onKey);
        };
    }, [color, track, dark]);

    return (
        <div className="w-[min(28rem,88vw)]">
            <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: track }}>
                <canvas
                    ref={canvasRef}
                    tabIndex={0}
                    aria-label="Runner game: press Space or tap to jump"
                    onPointerDown={() => jumpRef.current()}
                    className="block h-44 w-full cursor-pointer touch-manipulation outline-none"
                />
                <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white mix-blend-difference">
                    <span>
                        Score <span className="ml-1 font-mono text-[0.85rem] tabular-nums">{score}</span>
                    </span>
                    <span className="opacity-80">
                        Best <span className="ml-1 font-mono tabular-nums">{best}</span>
                    </span>
                </div>
                <AnimatePresence>
                    {!started && (
                        <motion.div exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
                            <motion.span
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="rounded-full px-3 py-1 text-[0.72rem] font-semibold text-black"
                                style={{ background: color, boxShadow: `0 0 18px ${color}` }}
                            >
                                Tap or press Space to jump
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer value={value} color={color} track={track} statusText={statusText} />
        </div>
    );
}

/* ---------------------------------------------------------------- Racer game */

const LANES = 3;
const TRAFFIC = ["#f43f5e", "#38bdf8", "#f59e0b", "#a78bfa", "#e5e7eb"];

function RacerGame({ value, color, track, dark, statusText }) {
    const canvasRef = useRef(null);
    const moveRef = useRef(() => {});
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let last = performance.now();
        let w = 0;
        let h = 0;
        const g = { lane: 1, x: 1, cars: [], speed: 260, spawn: 0.6, score: 0, road: 0, shake: 0, flash: 0, sparks: [] };

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

        moveRef.current = (dir) => {
            setStarted(true);
            g.lane = Math.max(0, Math.min(LANES - 1, g.lane + dir));
        };

        // A top-down car: body, roof, windows and lights.
        const car = (cx, cy, cw, ch, body, player) => {
            ctx.save();
            ctx.translate(cx, cy);
            if (player) {
                ctx.shadowColor = body;
                ctx.shadowBlur = 18;
            }
            ctx.fillStyle = body;
            ctx.beginPath();
            ctx.roundRect(-cw / 2, -ch / 2, cw, ch, cw * 0.32);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            ctx.beginPath();
            ctx.roundRect(-cw * 0.36, -ch * (player ? 0.28 : 0.1), cw * 0.72, ch * 0.24, 4);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.18)";
            ctx.fillRect(-cw * 0.3, -ch * 0.02, cw * 0.6, ch * 0.18);
            // Headlights for the player (facing up), tail lights for traffic (facing down at us).
            ctx.fillStyle = player ? "#fffbe6" : "#ff3b3b";
            const ly = player ? -ch / 2 + 3 : ch / 2 - 6;
            ctx.fillRect(-cw * 0.38, ly, cw * 0.18, 3);
            ctx.fillRect(cw * 0.2, ly, cw * 0.18, 3);
            if (player && dark) {
                const beam = ctx.createLinearGradient(0, -ch / 2, 0, -ch / 2 - 70);
                beam.addColorStop(0, "rgba(255,251,230,0.35)");
                beam.addColorStop(1, "rgba(255,251,230,0)");
                ctx.fillStyle = beam;
                ctx.beginPath();
                ctx.moveTo(-cw * 0.38, -ch / 2);
                ctx.lineTo(cw * 0.38, -ch / 2);
                ctx.lineTo(cw * 0.75, -ch / 2 - 70);
                ctx.lineTo(-cw * 0.75, -ch / 2 - 70);
                ctx.fill();
            }
            ctx.restore();
        };

        const tick = (now) => {
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            const roadW = Math.min(w * 0.8, 260);
            const left = (w - roadW) / 2;
            const laneW = roadW / LANES;
            const cw = laneW * 0.5;
            const ch = cw * 1.75;
            const py = h - ch / 2 - 14;

            g.x += (g.lane - g.x) * Math.min(1, dt * 14);
            g.speed = Math.min(620, g.speed + 9 * dt);
            g.road = (g.road + g.speed * dt) % 40;
            g.spawn -= dt;
            if (g.spawn <= 0) {
                const lane = Math.floor(Math.random() * LANES);
                if (!g.cars.some((c) => c.lane === lane && c.y < ch * 2)) g.cars.push({ lane, y: -ch, color: TRAFFIC[Math.floor(Math.random() * TRAFFIC.length)], v: 0.45 + Math.random() * 0.25 });
                g.spawn = Math.max(0.35, 0.9 - g.speed / 1400) + Math.random() * 0.35;
            }
            for (const c of g.cars) c.y += g.speed * c.v * dt;
            g.cars = g.cars.filter((c) => c.y < h + ch);

            // Crash: sparks, shake and a fresh start.
            const pxc = left + laneW * (g.x + 0.5);
            const crash = g.cars.find((c) => Math.abs(left + laneW * (c.lane + 0.5) - pxc) < cw * 0.85 && Math.abs(c.y - py) < ch * 0.85);
            if (crash) {
                for (let i = 0; i < 14; i++) g.sparks.push({ x: pxc, y: py - ch / 2, vx: (Math.random() - 0.5) * 240, vy: -Math.random() * 220, t: 0 });
                g.cars = [];
                g.speed = 260;
                g.shake = 0.35;
                g.flash = 0.4;
                g.score = 0;
            }
            g.score += dt * g.speed * 0.04;
            g.shake = Math.max(0, g.shake - dt);
            g.flash = Math.max(0, g.flash - dt);
            for (const sp of g.sparks) {
                sp.t += dt;
                sp.x += sp.vx * dt;
                sp.y += sp.vy * dt;
                sp.vy += 500 * dt;
            }
            g.sparks = g.sparks.filter((sp) => sp.t < 0.6);
            const s = Math.floor(g.score);
            setScore((prev) => (prev === s ? prev : s));
            setBest((b) => Math.max(b, s));

            // Draw: grass, road, moving lane dashes, edge lines, traffic, player.
            ctx.save();
            if (g.shake) ctx.translate((Math.random() - 0.5) * 12 * g.shake, (Math.random() - 0.5) * 12 * g.shake);
            ctx.fillStyle = dark ? "#071209" : "#dcfce7";
            ctx.fillRect(-10, -10, w + 20, h + 20);
            ctx.fillStyle = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
            for (let y = -40 + g.road * 1; y < h; y += 40) {
                ctx.fillRect(left - 22, y, 8, 18);
                ctx.fillRect(left + roadW + 14, y, 8, 18);
            }
            ctx.fillStyle = dark ? "#15171d" : "#3f3f46";
            ctx.fillRect(left, -10, roadW, h + 20);
            ctx.fillStyle = color;
            ctx.fillRect(left, -10, 3, h + 20);
            ctx.fillRect(left + roadW - 3, -10, 3, h + 20);
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            for (let i = 1; i < LANES; i++) for (let y = -40 + g.road; y < h; y += 40) ctx.fillRect(left + laneW * i - 1.5, y, 3, 20);
            for (const c of g.cars) car(left + laneW * (c.lane + 0.5), c.y, cw, ch, c.color, false);
            car(pxc, py, cw, ch, g.flash ? "#f43f5e" : color, true);
            for (const sp of g.sparks) {
                ctx.globalAlpha = 1 - sp.t / 0.6;
                ctx.fillStyle = "#fbbf24";
                ctx.fillRect(sp.x, sp.y, 3, 3);
            }
            ctx.globalAlpha = 1;
            if (g.flash) {
                ctx.fillStyle = `rgba(244,63,94,${g.flash * 0.25})`;
                ctx.fillRect(0, 0, w, h);
            }
            ctx.restore();
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        const onKey = (e) => {
            const dir = { ArrowLeft: -1, KeyA: -1, ArrowRight: 1, KeyD: 1 }[e.code];
            if (!dir) return;
            const area = canvas.closest("[data-loading-screen]");
            if (area?.matches(":hover") || area?.contains(document.activeElement)) {
                e.preventDefault();
                moveRef.current(dir);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("keydown", onKey);
        };
    }, [color, dark]);

    return (
        <div className="w-[min(24rem,86vw)]">
            <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: track }}>
                <canvas
                    ref={canvasRef}
                    tabIndex={0}
                    aria-label="Racing game: use the left and right arrow keys, or tap the left or right side, to change lanes"
                    onPointerDown={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        moveRef.current(e.clientX - r.left < r.width / 2 ? -1 : 1);
                    }}
                    className="block h-60 w-full cursor-pointer touch-manipulation outline-none"
                />
                <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
                    <span className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur">
                        {score} <span className="opacity-60">m</span>
                    </span>
                    <span className="rounded-full bg-black/45 px-2.5 py-1 opacity-90 backdrop-blur">Best {best}</span>
                </div>
                <AnimatePresence>
                    {!started && (
                        <motion.div exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
                            <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="rounded-full px-3 py-1 text-[0.72rem] font-semibold text-black" style={{ background: color, boxShadow: `0 0 18px ${color}` }}>
                                ← → or tap a side to steer
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer value={value} color={color} track={track} statusText={statusText} />
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
    statusText,
    className = "",
}) => {
    const moving = !useReducedMotion();
    const value = useProgress(progress, duration, loop, onComplete);
    const dark = theme !== "light";
    const track = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
    const shared = { value, color: accentColor, track, moving, dark, statusText };
    const game = variant === "catch" || variant === "runner" || variant === "racer";

    return (
        <div
            data-loading-screen=""
            role="status"
            aria-live="polite"
            aria-label={`${title} ${value}%`}
            className={`flex flex-col items-center justify-center gap-6 p-6 sm:p-8 ${fullScreen ? "fixed inset-0 z-[100]" : "relative h-full w-full"} ${dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"} ${className}`}
            style={dark ? { backgroundImage: `radial-gradient(60% 50% at 50% 40%, ${accentColor}14, transparent 70%)` } : undefined}
        >
            {game && (
                <p className="text-center">
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-50">{title}</span>
                    <span className="mt-1 block text-[0.95rem] font-semibold">{{ catch: "Catch the orb while you wait", runner: "Jump the pillars while you wait", racer: "Dodge the traffic while you wait" }[variant]}</span>
                </p>
            )}
            {variant === "orbit" && <Orbit {...shared} />}
            {variant === "progress" && <ProgressView {...shared} />}
            {variant === "blocks" && <Blocks {...shared} />}
            {variant === "catch" && <CatchGame {...shared} />}
            {variant === "runner" && <RunnerGame {...shared} />}
            {variant === "racer" && <RacerGame {...shared} />}
            {!game && variant !== "progress" && <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-50">{title}</p>}
        </div>
    );
};

export default LoadingScreen;
