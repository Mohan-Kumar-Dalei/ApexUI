import React, { useEffect, useRef } from "react";
import { siExpress, siJavascript, siMongodb, siNextdotjs, siNodedotjs, siReact, siRedux, siTailwindcss, siTypescript, siVite } from "simple-icons";

/*
 * Crossed Marquee: two tilted bands crossing like an "X" and scrolling in
 * opposite directions. The front band shows brand tiles and big labels, the
 * back band a quieter label row. Scrolling the page bursts the bands forward
 * (or reverses them when you scroll up), then they settle back to a cruise.
 *
 * Props: items (strings or { label, icon }), duration = 45 (s per loop),
 * tilt = 3 (deg), accentColor, bandInk, backColor, tileColor, showBackBand,
 * reactToScroll, pauseOnHover, className. Colours can be CSS variables.
 */

const ICONS = { mongodb: siMongodb, expressjs: siExpress, express: siExpress, react: siReact, nodejs: siNodedotjs, javascript: siJavascript, redux: siRedux, tailwindcss: siTailwindcss, tailwind: siTailwindcss, vite: siVite, nextjs: siNextdotjs, typescript: siTypescript };
const DEFAULT_ITEMS = ["MongoDB", "Express.js", "React", "Node.js", "JavaScript", "Redux", "Tailwind CSS", "Vite"];

const keyOf = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const wrap = (v) => ((((v + 50) % 50) + 50) % 50) - 50;
const initials = (s) =>
    String(s)
        .split(/[\s.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

const normalise = (it) => (typeof it === "string" ? { label: it, icon: ICONS[keyOf(it)] } : { ...it, icon: it.icon ?? ICONS[keyOf(it.label)] });

const BrandIcon = ({ icon, label }) => {
    if (icon && typeof icon === "object" && "path" in icon) {
        return (
            <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
                <path d={icon.path} fill={`#${icon.hex}`} />
            </svg>
        );
    }
    if (icon) return icon;
    return <span className="text-sm font-black md:text-base">{initials(label)}</span>;
};

const CrossedMarquee = ({ items = DEFAULT_ITEMS, duration = 45, tilt = 3, accentColor = "#ff5b1f", bandInk = "#14110d", backColor = "#121110", tileColor = "#fffaf2", showBackBand = true, reactToScroll = true, pauseOnHover = false, className = "" }) => {
    const root = useRef(null);
    const front = useRef(null);
    const back = useRef(null);
    const live = useRef({});
    live.current = { duration, reactToScroll, pauseOnHover };
    const list = (items.length ? items : DEFAULT_ITEMS).map(normalise);
    // Repeat the list so one copy is always wider than the screen.
    const row = Array.from({ length: Math.max(2, Math.ceil(12 / list.length)) }, () => list).flat();

    useEffect(() => {
        const el = root.current;
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return undefined;
        const s = { a: 0, b: -25, dir: 1, speed: 1, lastY: window.scrollY, lastT: performance.now(), hover: false };
        let raf = 0;
        let last = 0;
        let visible = true;

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            s.speed += (s.dir - s.speed) * 0.05;
            const k = o.pauseOnHover && s.hover ? 0 : 1;
            const d = Math.max(1, o.duration);
            s.a = wrap(s.a - (50 / d) * s.speed * dt * k);
            s.b = wrap(s.b + (50 / (d * 1.22)) * s.speed * dt * k);
            if (front.current) front.current.style.transform = `translate3d(${s.a}%, 0, 0)`;
            if (back.current) back.current.style.transform = `translate3d(${s.b}%, 0, 0)`;
            if (visible) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        const start = () => {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        };
        const onScroll = () => {
            if (!live.current.reactToScroll) return;
            const now = performance.now();
            const dy = window.scrollY - s.lastY;
            const dtS = Math.max(0.016, (now - s.lastT) / 1000);
            s.lastY = window.scrollY;
            s.lastT = now;
            if (!dy) return;
            s.dir = Math.sign(dy);
            s.speed = s.dir * (1 + Math.min(Math.abs(dy) / dtS / 350, 5));
        };
        const onEnter = () => (s.hover = true);
        const onLeave = () => (s.hover = false);
        window.addEventListener("scroll", onScroll, { passive: true });
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        start();
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    const band = "absolute left-[-5%] right-[-5%] overflow-hidden";
    return (
        <div ref={root} aria-label={`Tech stack: ${list.map((i) => i.label).join(", ")}`} className={`relative w-full overflow-hidden pb-24 pt-14 md:pb-32 md:pt-20 ${className}`}>
            {/* Spacer so the wrapper has the height of the front band. */}
            <div aria-hidden="true" className="invisible flex items-center py-4 md:py-5">
                <span className="block h-11 md:h-14" />
            </div>
            {showBackBand && (
                <div aria-hidden="true" className={band} style={{ top: "60%", transform: `translateY(-50%) rotate(${tilt}deg)`, background: backColor, borderBlock: `2px solid ${bandInk}` }}>
                    <div ref={back} className="flex w-max will-change-transform" style={{ transform: "translate3d(-25%, 0, 0)" }}>
                        {[0, 1].map((copy) => (
                            <div key={copy} className="flex shrink-0 items-center py-3 md:py-4">
                                {row.map((it, i) => (
                                    <span key={i} className="flex items-center">
                                        <span className="whitespace-nowrap text-lg font-bold uppercase tracking-tight md:text-2xl" style={{ color: "rgba(255,255,255,.8)" }}>
                                            {it.label}
                                        </span>
                                        <span className="mx-5 block h-2.5 w-2.5 rotate-45 md:mx-8 md:h-3 md:w-3" style={{ background: accentColor }} />
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div aria-hidden="true" className={band} style={{ top: "50%", transform: `translateY(-50%) rotate(${-tilt}deg)`, background: accentColor, borderBlock: `2px solid ${bandInk}`, boxShadow: "0 10px 0 rgb(0 0 0 / .08)" }}>
                <div ref={front} className="flex w-max will-change-transform">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center py-4 md:py-5">
                            {row.map((it, i) => (
                                <span key={i} className="flex items-center">
                                    <span className="mr-3 grid h-11 w-11 shrink-0 place-items-center rounded-xl md:mr-4 md:h-14 md:w-14" style={{ background: tileColor, border: `2px solid ${bandInk}`, boxShadow: `4px 4px 0 ${bandInk}`, color: bandInk }}>
                                        <BrandIcon icon={it.icon} label={it.label} />
                                    </span>
                                    <span className="whitespace-nowrap font-extrabold uppercase leading-none tracking-tight" style={{ fontSize: "clamp(1.5rem, 3.4vw, 3rem)", color: bandInk }}>
                                        {it.label}
                                    </span>
                                    <span className="mx-5 block h-2.5 w-2.5 rotate-45 md:mx-8 md:h-3 md:w-3" style={{ background: bandInk }} />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CrossedMarquee;
