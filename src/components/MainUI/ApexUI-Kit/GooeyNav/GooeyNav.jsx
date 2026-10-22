import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Gooey Nav: the active pill is drawn in WebGL as a metaball. A fragment
 * shader smooth-unions a capsule (the pill) with a handful of droplets, so
 * they genuinely melt into each other. When you switch links the pill's
 * leading edge races ahead and the trailing edge catches up (it stretches,
 * thins, then snaps back) and droplets burst out and get pulled back in.
 * Labels are plain HTML on top, so they stay crisp and accessible. Falls
 * back to a CSS pill without WebGL.
 */

const DEFAULT_ITEMS = [
    { label: "Home", href: "#" },
    { label: "Components", href: "#" },
    { label: "Templates", href: "#" },
    { label: "Docs", href: "#" },
];

const MAX_DROPS = 14;
const PAD = 22; // canvas bleed around the bar, for drops and glow (px)

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uPill;
uniform vec4 uDrops[${MAX_DROPS}];
uniform vec3 uColor;
uniform float uGoo;
uniform float uGlow;

float sdCapsule(vec2 p, vec2 halfSize) {
    float r = min(halfSize.x, halfSize.y);
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
    // Pixel position in CSS px, origin top-left.
    vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
    vec2 c = uPill.xy + uPill.zw * 0.5;
    float d = sdCapsule(p - c, uPill.zw * 0.5);
    for (int i = 0; i < ${MAX_DROPS}; i++) {
        vec4 dr = uDrops[i];
        if (dr.z > 0.01) d = smin(d, length(p - dr.xy) - dr.z, uGoo);
    }
    float aa = 0.8;
    float body = 1.0 - smoothstep(-aa, aa, d);
    // Soft top highlight and darker bottom for a bit of volume.
    float v = clamp((p.y - uPill.y) / max(uPill.w, 1.0), 0.0, 1.0);
    vec3 col = uColor * (1.08 - 0.18 * v);
    float rim = smoothstep(-3.0, 0.0, d) * body * 0.12;
    col += rim;
    float glow = exp(-max(d, 0.0) / 5.0) * uGlow * (1.0 - body);
    float a = body + glow;
    gl_FragColor = vec4(col * a, a);
}
`;

const hexToRgb = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n)) return [0.64, 0.9, 0.21];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function createGL(canvas) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return null;
    const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    return { gl, uRes: u("uRes"), uDpr: u("uDpr"), uPill: u("uPill"), uDrops: u("uDrops"), uColor: u("uColor"), uGoo: u("uGoo"), uGlow: u("uGlow") };
}

// One spring integration step.
const step = (s, target, k, c, dt) => {
    const a = k * (target - s.x) - c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
};

const GooeyNav = ({ items = DEFAULT_ITEMS, initialActive = 0, onChange, accentColor = "#a3e635", particleCount = 8, goo = 12, theme = "dark", className = "" }) => {
    const [active, setActive] = useState(initialActive);
    const [fallback, setFallback] = useState(false);
    const bar = useRef(null);
    const canvas = useRef(null);
    const fallbackPill = useRef(null);
    const links = useRef([]);
    const sim = useRef(null);
    const color = useRef(hexToRgb(accentColor));
    const gooRef = useRef(goo);
    const glowRef = useRef(theme === "light" ? 0 : 0.22);
    const dark = theme !== "light";

    useEffect(() => {
        color.current = hexToRgb(accentColor);
        gooRef.current = goo;
        glowRef.current = theme === "light" ? 0 : 0.22;
        if (sim.current) sim.current.dirty = true;
    }, [accentColor, goo, theme]);

    const measure = (i) => {
        const el = links.current[i];
        const b = bar.current;
        if (!el || !b) return null;
        const a = el.getBoundingClientRect();
        const p = b.getBoundingClientRect();
        return { l: a.left - p.left + PAD, r: a.right - p.left + PAD, t: a.top - p.top + PAD, h: a.height };
    };

    // Set up GL + simulation once.
    useLayoutEffect(() => {
        const cv = canvas.current;
        const ctx = createGL(cv);
        if (!ctx) setFallback(true);
        const m = measure(active) ?? { l: 0, r: 0, t: 0, h: 0 };
        const s = {
            l: { x: m.l, v: 0 },
            r: { x: m.r, v: 0 },
            t: { x: m.t, v: 0 },
            h: { x: m.h, v: 0 },
            target: m,
            activeIndex: active,
            dir: 1,
            drops: [],
            dirty: true,
            dpr: 1,
        };
        sim.current = s;

        const resize = () => {
            const r = bar.current.getBoundingClientRect();
            s.dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = r.width + PAD * 2;
            const h = r.height + PAD * 2;
            cv.width = Math.round(w * s.dpr);
            cv.height = Math.round(h * s.dpr);
            cv.style.width = `${w}px`;
            cv.style.height = `${h}px`;
            const t = measure(s.activeIndex);
            if (t) {
                s.target = t;
                s.l.x = t.l;
                s.r.x = t.r;
                s.t.x = t.t;
                s.h.x = t.h;
                s.l.v = s.r.v = s.t.v = s.h.v = 0;
            }
            s.dirty = true;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(bar.current);

        const dropData = new Float32Array(MAX_DROPS * 4);
        let raf = 0;
        let last = performance.now();
        const frame = (now) => {
            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;
            const T = s.target;
            // Leading edge is stiff, trailing edge is loose → stretch.
            const lead = [520, 30];
            const trail = [170, 17];
            const [kl, cl] = s.dir > 0 ? trail : lead;
            const [kr, cr] = s.dir > 0 ? lead : trail;
            step(s.l, T.l, kl, cl, dt);
            step(s.r, T.r, kr, cr, dt);
            step(s.t, T.t, 400, 32, dt);
            step(s.h, T.h, 400, 32, dt);

            // Thin the pill while it is stretched (keeps the "volume").
            const w = s.r.x - s.l.x;
            const restW = T.r - T.l || 1;
            const stretch = Math.max(0, w / restW - 1);
            const h = s.h.x * (1 - Math.min(0.32, stretch * 0.35));
            const top = s.t.x + (s.h.x - h) / 2;

            // Droplets fly out, then a spring pulls them back to the pill centre.
            const cx = (s.l.x + s.r.x) / 2;
            const cy = top + h / 2;
            s.drops = s.drops.filter((d) => (d.life -= dt) > 0);
            for (const d of s.drops) {
                d.vx += ((cx - d.x) * d.k - d.vx * 5) * dt;
                d.vy += ((cy - d.y) * d.k - d.vy * 5) * dt;
                d.x += d.vx * dt;
                d.y += d.vy * dt;
            }

            const moving = s.drops.length > 0 || [s.l, s.r, s.t, s.h].some((q) => Math.abs(q.v) > 0.5) || Math.abs(s.l.x - T.l) > 0.3 || Math.abs(s.r.x - T.r) > 0.3;
            if (moving || s.dirty) {
                s.dirty = false;
                if (ctx) {
                    const { gl } = ctx;
                    gl.viewport(0, 0, cv.width, cv.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.uniform2f(ctx.uRes, cv.width, cv.height);
                    gl.uniform1f(ctx.uDpr, s.dpr);
                    gl.uniform4f(ctx.uPill, s.l.x, top, Math.max(1, w), Math.max(1, h));
                    dropData.fill(0);
                    s.drops.slice(0, MAX_DROPS).forEach((d, i) => {
                        const life = Math.max(0, d.life / d.max);
                        dropData.set([d.x, d.y, d.r * Math.min(1, life * 1.6), 1], i * 4);
                    });
                    gl.uniform4fv(ctx.uDrops, dropData);
                    gl.uniform3fv(ctx.uColor, color.current);
                    gl.uniform1f(ctx.uGoo, gooRef.current);
                    gl.uniform1f(ctx.uGlow, glowRef.current);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);
                } else if (fallbackPill.current) {
                    Object.assign(fallbackPill.current.style, { left: `${s.l.x - PAD}px`, top: `${top - PAD}px`, width: `${w}px`, height: `${h}px` });
                }
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            ctx?.gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
        // Built once per item count; later selections go through sim.current.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);

    const select = (i, e) => {
        e?.preventDefault();
        const s = sim.current;
        if (i === active || !s) return;
        const t = measure(i);
        if (!t) return;
        s.dir = i > active ? 1 : -1;
        s.target = t;
        s.activeIndex = i;
        setActive(i);
        onChange?.(i, items[i]);
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            s.l.x = t.l;
            s.r.x = t.r;
            s.dirty = true;
            return;
        }
        const cx = (t.l + t.r) / 2;
        const cy = t.t + t.h / 2;
        // Burst at the destination; the droplets get pulled back into the pill.
        for (let k = 0; k < particleCount; k++) {
            const a = (Math.PI * 2 * k) / particleCount + (Math.random() - 0.5) * 0.6;
            const sp = 120 + Math.random() * 110;
            const max = 0.75 + Math.random() * 0.3;
            s.drops.push({ x: cx, y: cy, vx: Math.cos(a) * sp * 1.5, vy: Math.sin(a) * sp * 0.55, r: 4 + Math.random() * 4, k: 55, life: max, max });
        }
        if (s.drops.length > MAX_DROPS) s.drops.splice(0, s.drops.length - MAX_DROPS);
    };

    return (
        <nav className={`relative inline-flex max-w-full ${className}`} aria-label="Main">
            <div ref={bar} className={`relative flex items-center gap-0.5 rounded-full p-1.5 ${dark ? "bg-neutral-950 ring-1 ring-white/10" : "bg-white shadow-sm ring-1 ring-black/10"}`}>
                <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute" style={{ left: -PAD, top: -PAD, display: fallback ? "none" : "block" }} />
                {fallback && <span ref={fallbackPill} aria-hidden="true" className="pointer-events-none absolute rounded-full" style={{ background: accentColor }} />}
                {items.map((item, i) => (
                    <a
                        key={i}
                        ref={(el) => (links.current[i] = el)}
                        href={item.href}
                        onClick={(e) => select(i, e)}
                        aria-current={i === active ? "page" : undefined}
                        className={`relative z-[1] shrink-0 rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-current/30 sm:px-5 ${i === active ? "text-neutral-950" : dark ? "text-white/65 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default GooeyNav;
