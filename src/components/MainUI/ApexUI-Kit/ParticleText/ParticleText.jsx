import React, { useEffect, useRef } from "react";

/*
 * Particle Text: your text rebuilt from thousands of tiny particles on a
 * canvas. They fly in to form the words (assemble, fall, explode or wave),
 * move out of the pointer's way, and a click sends a shockwave through them
 * before they spring back. Moving particles light up in the accent color.
 * When everything has settled and the pointer is away, the loop sleeps.
 */

const TAU = Math.PI * 2;

// Points where the text is drawn, sampled from an offscreen canvas.
function sampleText(text, width, height, weight, family, maxSize, gap) {
    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.floor(width));
    off.height = Math.max(1, Math.floor(height));
    const c = off.getContext("2d", { willReadFrequently: true });
    let size = Math.min(maxSize, height * 0.7);
    c.font = `${weight} ${size}px ${family}`;
    const measured = c.measureText(text).width;
    // Shrink to fit 90% of the width.
    if (measured > width * 0.9) size *= (width * 0.9) / measured;
    c.font = `${weight} ${size}px ${family}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#fff";
    c.fillText(text, width / 2, height / 2);
    const data = c.getImageData(0, 0, off.width, off.height).data;
    const pts = [];
    for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
            if (data[(y * off.width + x) * 4 + 3] > 120) pts.push(x, y);
        }
    }
    return pts;
}

const ParticleText = ({
    text = "ApexUI",
    fontSize = 9,
    fontWeight = 800,
    fontFamily,
    particleSize = 2,
    gap = 4,
    color = "currentColor",
    accentColor = "#a3e635",
    intro = "assemble",
    replayOn = "none",
    repelRadius = 90,
    repelStrength = 1,
    clickBurst = true,
    height = "20rem",
    className = "",
}) => {
    const wrap = useRef(null);
    const canvas = useRef(null);
    const live = useRef({ particleSize, accentColor, color, repelRadius, repelStrength, clickBurst, replayOn, intro });
    live.current = { particleSize, accentColor, color, repelRadius, repelStrength, clickBurst, replayOn, intro };
    const wakeRef = useRef(() => {});

    // Prop changes that don't need a rebuild just wake the loop to redraw.
    useEffect(() => {
        wakeRef.current();
    });

    useEffect(() => {
        const el = wrap.current;
        const cv = canvas.current;
        const ctx = cv.getContext("2d");
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let P = new Float32Array(0); // per particle: x, y, vx, vy, tx, ty, delay, seed
        let n = 0;
        let w = 0;
        let h = 0;
        let dpr = 1;
        let raf = 0;
        let last = 0;
        let started = 0;
        let alive = true;
        let visible = true;
        let built = "";
        const pointer = { x: -9999, y: -9999, on: false };

        const startPositions = (mode) => {
            started = performance.now();
            for (let i = 0; i < n; i++) {
                const o = i * 8;
                const tx = P[o + 4];
                const ty = P[o + 5];
                const seed = P[o + 7];
                let x = tx;
                let y = ty;
                let delay = 0;
                if (reduced) {
                    // Appear in place.
                } else if (mode === "fall") {
                    x = tx + (seed - 0.5) * 30;
                    y = -20 - seed * h * 0.6;
                    delay = seed * 500;
                } else if (mode === "explode") {
                    const a = seed * TAU * 7;
                    x = w / 2 + Math.cos(a) * 4;
                    y = h / 2 + Math.sin(a) * 4;
                    delay = seed * 200;
                } else if (mode === "wave") {
                    x = tx - w * 0.6;
                    y = ty + Math.sin(tx * 0.04) * 40;
                    delay = (tx / w) * 700;
                } else {
                    x = Math.random() * w;
                    y = Math.random() * h;
                    delay = seed * 350;
                }
                P[o] = x;
                P[o + 1] = y;
                P[o + 2] = mode === "explode" && !reduced ? (Math.random() - 0.5) * 900 : 0;
                P[o + 3] = mode === "explode" && !reduced ? (Math.random() - 0.5) * 900 : 0;
                P[o + 6] = delay;
            }
            wake();
        };

        const build = (withIntro) => {
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width;
            h = r.height;
            cv.width = Math.round(w * dpr);
            cv.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const family = fontFamily || getComputedStyle(el).fontFamily || "sans-serif";
            const pts = sampleText(String(text || " "), w, h, fontWeight, family, fontSize * rem, Math.max(2, Math.round(gap)));
            // Cap the count so huge containers stay smooth.
            const cap = 6000;
            const stride = Math.max(1, Math.ceil(pts.length / 2 / cap));
            n = Math.floor(pts.length / 2 / stride);
            const old = P;
            const oldN = old.length / 8;
            P = new Float32Array(n * 8);
            for (let i = 0; i < n; i++) {
                const o = i * 8;
                const s = i * stride * 2;
                P[o + 4] = pts[s];
                P[o + 5] = pts[s + 1];
                P[o + 7] = ((i * 9301 + 49297) % 233280) / 233280;
                // Keep current positions on resize so nothing jumps.
                if (!withIntro && i < oldN) {
                    P[o] = old[i * 8];
                    P[o + 1] = old[i * 8 + 1];
                } else {
                    P[o] = pts[s];
                    P[o + 1] = pts[s + 1];
                }
            }
            if (withIntro) startPositions(live.current.intro);
            wake();
        };

        const toRgb = (() => {
            const c = document.createElement("canvas").getContext("2d");
            return (value) => {
                c.fillStyle = "#000";
                c.fillStyle = value;
                const hex = c.fillStyle;
                if (hex.startsWith("#")) return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
                const m = hex.match(/\d+(\.\d+)?/g) || [0, 0, 0];
                return [+m[0], +m[1], +m[2]];
            };
        })();

        const frame = (now) => {
            raf = 0;
            if (!alive) return;
            const o = live.current;
            const dt = last ? Math.min(0.033, (now - last) / 1000) : 1 / 60;
            last = now;
            const elapsed = now - started;
            const base = o.color === "currentColor" ? getComputedStyle(el).color : o.color;
            const [br, bg, bb] = toRgb(base);
            const [ar, ag, ab] = toRgb(o.accentColor);
            const size = Math.max(0.5, o.particleSize);
            const rr = o.repelRadius;
            const rs = o.repelStrength * 2600;
            let busy = pointer.on;

            ctx.clearRect(0, 0, w, h);
            // Two passes: settled particles in the base color, moving ones in the accent.
            const hot = [];
            ctx.fillStyle = `rgb(${br}, ${bg}, ${bb})`;
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
                const k = i * 8;
                let x = P[k];
                let y = P[k + 1];
                let vx = P[k + 2];
                let vy = P[k + 3];
                if (elapsed >= P[k + 6]) {
                    // Spring toward the target, with damping.
                    vx += (P[k + 4] - x) * 60 * dt;
                    vy += (P[k + 5] - y) * 60 * dt;
                    if (pointer.on && rr > 0) {
                        const dx = x - pointer.x;
                        const dy = y - pointer.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < rr * rr && d2 > 0.01) {
                            const d = Math.sqrt(d2);
                            const f = (1 - d / rr) * rs * dt;
                            vx += (dx / d) * f;
                            vy += (dy / d) * f;
                        }
                    }
                    const damp = Math.pow(0.0009, dt);
                    vx *= damp;
                    vy *= damp;
                    x += vx * dt;
                    y += vy * dt;
                }
                P[k] = x;
                P[k + 1] = y;
                P[k + 2] = vx;
                P[k + 3] = vy;
                const off = Math.abs(P[k + 4] - x) + Math.abs(P[k + 5] - y);
                if (off > 0.3 || Math.abs(vx) + Math.abs(vy) > 2) busy = true;
                if (off > 4) hot.push(x, y, Math.min(1, off / 40));
                else ctx.rect(x - size / 2, y - size / 2, size, size);
            }
            ctx.fill();
            if (hot.length) {
                ctx.globalCompositeOperation = "lighter";
                for (let j = 0; j < hot.length; j += 3) {
                    const t = hot[j + 2];
                    ctx.fillStyle = `rgb(${Math.round(br + (ar - br) * t)}, ${Math.round(bg + (ag - bg) * t)}, ${Math.round(bb + (ab - bb) * t)})`;
                    ctx.fillRect(hot[j] - size / 2, hot[j + 1] - size / 2, size, size);
                }
                ctx.globalCompositeOperation = "source-over";
            }
            if (busy && visible) raf = requestAnimationFrame(frame);
        };

        function wake() {
            if (raf || !alive || !visible) return;
            last = 0;
            raf = requestAnimationFrame(frame);
        }
        wakeRef.current = wake;

        const local = (e) => {
            const r = cv.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onMove = (e) => {
            [pointer.x, pointer.y] = local(e);
            pointer.on = true;
            wake();
        };
        const onEnter = (e) => {
            onMove(e);
            if (live.current.replayOn === "hover") startPositions(live.current.intro);
        };
        const onLeave = () => {
            pointer.on = false;
            pointer.x = pointer.y = -9999;
            wake();
        };
        const onDown = (e) => {
            const o = live.current;
            if (o.replayOn === "click") return startPositions(o.intro);
            if (!o.clickBurst || reduced) return;
            const [cx, cy] = local(e);
            for (let i = 0; i < n; i++) {
                const k = i * 8;
                const dx = P[k] - cx;
                const dy = P[k + 1] - cy;
                const d = Math.hypot(dx, dy) || 1;
                const f = Math.max(0, 1 - d / 260) * 1400 * (0.6 + P[k + 7] * 0.8);
                P[k + 2] += (dx / d) * f;
                P[k + 3] += (dy / d) * f;
            }
            wake();
        };
        cv.addEventListener("pointerenter", onEnter);
        cv.addEventListener("pointermove", onMove);
        cv.addEventListener("pointerleave", onLeave);
        cv.addEventListener("pointerdown", onDown);

        const ro = new ResizeObserver(() => {
            const r = el.getBoundingClientRect();
            const key = `${Math.round(r.width)}x${Math.round(r.height)}`;
            if (key === built) return;
            const first = !built;
            built = key;
            build(first);
        });
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            wake();
        });
        io.observe(el);
        // Rebuild once web fonts are ready so the shape uses the real font.
        document.fonts?.ready.then(() => alive && built && build(false));

        return () => {
            alive = false;
            wakeRef.current = () => {};
            if (raf) cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            cv.removeEventListener("pointerenter", onEnter);
            cv.removeEventListener("pointermove", onMove);
            cv.removeEventListener("pointerleave", onLeave);
            cv.removeEventListener("pointerdown", onDown);
        };
        // Text and font settings rebuild the particles; the rest is read live.
    }, [text, fontSize, fontWeight, fontFamily, gap]);

    return (
        <div ref={wrap} className={`relative w-full touch-pan-y select-none overflow-hidden ${className}`} style={{ height }}>
            <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
            <span className="sr-only">{text}</span>
        </div>
    );
};

export default ParticleText;
