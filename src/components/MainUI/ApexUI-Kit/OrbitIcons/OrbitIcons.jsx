import React, { useEffect, useRef, useState } from "react";
import { Cloud, Code2, Cpu, Database, Figma, Github, Globe, Layers, Lock, Palette, Rocket, Sparkles, Zap } from "lucide-react";

/*
 * Orbit Icons: icons circling a center on a few rings, each ring at its own
 * speed and direction. Tip the orbits back for depth: icons on the far side
 * shrink, dim and pass behind the near ones. Hovering eases the motion to a
 * stop (and shows labels); the orbits lean a little toward the pointer. It
 * scales to its container, so it fits phones.
 */

const DEFAULT_RINGS = [
    { speed: 22, items: [{ icon: Code2, label: "Code" }, { icon: Zap, label: "Fast" }, { icon: Palette, label: "Design" }] },
    { speed: -14, items: [{ icon: Github, label: "GitHub" }, { icon: Figma, label: "Figma" }, { icon: Sparkles, label: "AI" }, { icon: Cpu, label: "Compute" }] },
    { speed: 9, items: [{ icon: Globe, label: "Web" }, { icon: Database, label: "Data" }, { icon: Cloud, label: "Cloud" }, { icon: Lock, label: "Auth" }, { icon: Rocket, label: "Deploy" }, { icon: Layers, label: "Stack" }] },
];

const OrbitIcons = ({ rings = DEFAULT_RINGS, size = 28, tilt = 0.55, speed = 1, pauseOnHover = true, showRings = true, accentColor = "#a3e635", center, className = "" }) => {
    const box = useRef(null);
    const nodes = useRef([]);
    const ringEls = useRef([]);
    const [hover, setHover] = useState(false);
    const live = useRef({});
    live.current = { tilt, speed, pauseOnHover, rings };
    const flat = rings.flatMap((r, ri) => r.items.map((it, k) => ({ ...it, ri, k, n: r.items.length })));

    useEffect(() => {
        const el = box.current;
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const s = { angles: live.current.rings.map((_, i) => i * 0.7), rate: 1, half: 100, lean: 0, leanX: 0, tx: 0, ty: 0, hover: false };
        let raf = 0;
        let last = 0;
        let visible = true;

        const fit = () => {
            s.half = el.getBoundingClientRect().width / 2;
            el.style.setProperty("--orbit-item", `${Math.max(30, Math.min(52, s.half * 0.21)).toFixed(1)}px`);
        };
        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            // Ease the spin down on hover rather than stopping dead.
            const goal = (o.pauseOnHover && s.hover) || reduced ? 0 : 1;
            s.rate += (goal - s.rate) * (1 - Math.exp(-dt / 0.35));
            s.lean += (s.ty - s.lean) * (1 - Math.exp(-dt / 0.4));
            s.leanX += (s.tx - s.leanX) * (1 - Math.exp(-dt / 0.4));
            const tiltA = Math.max(0, Math.min(1.2, o.tilt * 1.15 + s.lean * 0.18));
            const squash = Math.cos(tiltA);
            const depthAmt = Math.sin(tiltA);
            o.rings.forEach((ring, ri) => {
                s.angles[ri] = (s.angles[ri] ?? 0) + ((ring.speed * Math.PI) / 180) * o.speed * s.rate * dt;
            });
            const radii = o.rings.map((_, ri) => s.half * (0.34 + (0.6 * (ri + 1)) / o.rings.length) * 0.94);
            ringEls.current.forEach((e, ri) => {
                if (!e) return;
                const r = radii[ri];
                e.style.width = `${r * 2}px`;
                e.style.height = `${r * 2 * squash}px`;
                e.style.transform = `translate(-50%, -50%) rotate(${(s.leanX * 6).toFixed(2)}deg)`;
            });
            nodes.current.forEach((e, idx) => {
                const it = flat[idx];
                if (!e || !it) return;
                const r = radii[it.ri];
                const a = s.angles[it.ri] + (it.k / it.n) * Math.PI * 2;
                const z = Math.sin(a); // +1 is the near side (bottom)
                const lean = (s.leanX * 6 * Math.PI) / 180;
                let x = Math.cos(a) * r;
                let y = Math.sin(a) * r * squash;
                [x, y] = [x * Math.cos(lean) - y * Math.sin(lean), x * Math.sin(lean) + y * Math.cos(lean)];
                const sc = 1 + z * 0.16 * depthAmt;
                e.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${sc.toFixed(3)})`;
                e.style.zIndex = String(Math.round(50 + z * 40));
                e.style.opacity = String((1 - (1 - z) * 0.22 * depthAmt).toFixed(3));
            });
            const busy = s.rate > 0.001 || Math.abs(s.ty - s.lean) > 0.001 || Math.abs(s.tx - s.leanX) > 0.001;
            if (visible && busy) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        const start = () => {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            s.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
            s.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
            start();
        };
        const onEnter = (e) => {
            if (e.pointerType === "mouse") {
                s.hover = true;
                setHover(true);
            }
            start();
        };
        const onLeave = () => {
            s.hover = false;
            s.tx = 0;
            s.ty = 0;
            setHover(false);
            start();
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        const ro = new ResizeObserver(() => {
            fit();
            start();
        });
        ro.observe(el);
        const io = new IntersectionObserver(([en]) => {
            visible = en.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        fit();
        start();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
        };
        // flat is derived from rings; the loop reads both through refs and live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flat.length]);

    return (
        <div ref={box} className={`relative aspect-square w-full select-none ${className}`} style={{ maxWidth: `${size}rem`, "--orbit-accent": accentColor }}>
            {showRings &&
                rings.map((_, ri) => (
                    <span
                        key={ri}
                        ref={(e) => (ringEls.current[ri] = e)}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 rounded-[50%] border border-dashed border-current opacity-15"
                    />
                ))}
            <div className="absolute left-1/2 top-1/2 z-[50] grid aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-neutral-950 text-white shadow-[0_0_60px_-10px_var(--orbit-accent)]">
                {center ?? <span className="text-base font-black tracking-tight sm:text-xl" style={{ color: accentColor }}>Apex</span>}
            </div>
            {flat.map((it, idx) => {
                const Icon = it.icon;
                return (
                    <div key={idx} ref={(e) => (nodes.current[idx] = e)} className="group absolute left-1/2 top-1/2 will-change-transform">
                        <div
                            className="grid place-items-center rounded-2xl border border-white/10 bg-neutral-900/90 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur transition-colors duration-300 group-hover:border-[var(--orbit-accent)]"
                            style={{ width: "var(--orbit-item, 2.75rem)", aspectRatio: "1" }}
                            title={it.label}
                        >
                            {typeof Icon === "function" || (Icon && typeof Icon === "object" && Icon.$$typeof) ? <Icon className="h-[46%] w-[46%]" style={{ color: it.color }} /> : Icon}
                        </div>
                        {it.label && (
                            <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-2 py-0.5 text-[0.65rem] font-semibold text-white transition-opacity duration-300" style={{ opacity: hover ? 1 : 0 }}>
                                {it.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default OrbitIcons;
