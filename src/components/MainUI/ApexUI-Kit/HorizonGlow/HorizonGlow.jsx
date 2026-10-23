import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";

/*
 * Horizon Glow: a soft, wide light rising from below the bottom edge, fading
 * from a pale core through an accent band and a mid tone into a deep sky,
 * drawn in one WebGL shader. A thin luminous arc marks the horizon, faint
 * volumetric rays climb out of it and specks of dust drift up through the
 * light. It rises in on mount, breathes slowly and leans toward the pointer;
 * a filmic tone curve and dithering keep the long gradient silky.
 */

const PRESETS = {
    lilac: { sky: "#0d1438", mid: "#6f4c86", accent: "#ff9fd2", core: "#fff1f8" },
    ocean: { sky: "#020f1c", mid: "#195a78", accent: "#58e1ff", core: "#e9fbff" },
    ember: { sky: "#100606", mid: "#7a2f1e", accent: "#ff9b54", core: "#fff0dc" },
    mint: { sky: "#04131a", mid: "#22625a", accent: "#6dffc4", core: "#ecfff6" },
    mono: { sky: "#08080a", mid: "#45454d", accent: "#c9c9d6", core: "#ffffff" },
};

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uRise; uniform vec2 uMouse;
uniform vec3 uSky; uniform vec3 uMid; uniform vec3 uAccent; uniform vec3 uCore;
uniform float uSpread; uniform float uIntensity; uniform float uShimmer; uniform float uBreath; uniform float uGrain;
uniform float uArc; uniform float uRays; uniform float uDust;

float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * n2(p); p *= 2.02; a *= 0.5; } return v; }

// Drifting dust: one speck per cell, rising slowly and twinkling.
float dust(vec2 p, float scale, float speed, float seed){
  vec2 q = p * scale + vec2(seed, -uTime * speed);
  vec2 id = floor(q); vec2 f = fract(q) - 0.5;
  vec2 o = vec2(h2(id + seed), h2(id + seed + 3.1)) - 0.5;
  float r = length(f - o * 0.7);
  float tw = 0.5 + 0.5 * sin(uTime * (1.5 + h2(id) * 2.5) + h2(id + 9.0) * 6.28);
  return smoothstep(0.06, 0.0, r) * step(0.55, h2(id + seed + 7.7)) * tw;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  // Work in height units; wide screens get a wider glow, phones a taller one.
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y);
  float width = max(asp, 0.8) * 0.82;

  float rise = uRise;
  float breath = 1.0 + uBreath * 0.035 * sin(uTime * 0.55) + uBreath * 0.015 * sin(uTime * 1.3 + 1.7);
  vec2 c = vec2(uMouse.x * 0.06 * asp, mix(-1.1, -0.06, rise) + uMouse.y * 0.025);

  // Elliptical distance from the light source below the edge.
  vec2 e = (p - c) / vec2(width, 1.0);
  float d0 = length(e);
  // A slow shimmer that bends the falloff a little.
  float s = fbm(vec2(p.x * 1.4, p.y * 1.1 - uTime * 0.035) + uTime * 0.02) - 0.5;
  float d = d0 + s * 0.12 * uShimmer * smoothstep(1.4, 0.3, d0);

  float reach = uSpread * breath * mix(0.35, 1.0, rise);
  float t = clamp(d / reach, 0.0, 1.0);

  // Core -> accent band -> mid tone -> sky.
  vec3 col = mix(uCore, uMid, smoothstep(0.0, 0.62, t));
  col = mix(col, uSky, smoothstep(0.38, 1.0, t));
  float band = exp(-pow((t - 0.3) / 0.13, 2.0));
  col = mix(col, col * 0.55 + uAccent * 0.55, band * 0.45);
  col += uCore * exp(-d * d * 9.0 / (reach * reach)) * 0.25 * uIntensity;

  // Volumetric rays climbing out of the source.
  float ang = atan(p.x - c.x, (p.y - c.y) * 1.6);
  float beams = n2(vec2(ang * 8.0, uTime * 0.07)) * 0.65 + n2(vec2(ang * 21.0, -uTime * 0.05)) * 0.35;
  col += mix(uAccent, uCore, 0.5) * smoothstep(0.5, 1.0, beams) * exp(-t * 2.4) * smoothstep(0.02, 0.2, t) * 0.28 * uRays;

  // Horizon arc: a thin bright rim where the light meets the edge of the world.
  float pr = 0.9;
  vec2 pc = vec2(c.x, c.y + 0.24 - pr);
  float rd = length((p - pc) / vec2(max(asp, 0.8) * 1.05, 1.0)) - pr;
  float fade = exp(-abs(p.x - c.x) / (width * 0.9));
  col += mix(uAccent, uCore, 0.7) * (exp(-abs(rd) * 140.0) * 0.9 + exp(-max(rd, 0.0) * 14.0) * 0.18) * fade * uArc * rise;
  col *= mix(1.0, 0.82, smoothstep(0.0, -0.08, rd) * uArc);

  // Dust lit by the glow.
  float lit = exp(-t * 2.2);
  col += uCore * (dust(p, 9.0, 0.05, 1.0) + dust(p, 16.0, 0.09, 7.0) * 0.7) * lit * 0.55 * uDust * rise;

  col = mix(uSky, col, clamp(uIntensity * (0.25 + 0.75 * rise), 0.0, 1.4));
  // Darker corners at the top keep text readable.
  col *= 1.0 - 0.12 * smoothstep(0.45, 1.1, uv.y) * smoothstep(0.1, 0.9, abs(uv.x - 0.5) * 2.0);
  // Filmic shoulder so the core rolls off instead of clipping.
  col = col / (1.0 + max(col - 0.85, 0.0));

  col += (h2(gl_FragCoord.xy + fract(uTime * 7.0) * 91.0) - 0.5) * (1.0 + 7.0 * uGrain) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const HorizonGlow = ({
    preset = "lilac",
    skyColor,
    midColor,
    accentColor,
    coreColor,
    spread = 1.3,
    intensity = 1,
    duration = 2.4,
    autoRise = true,
    breathe = 1,
    shimmer = 1,
    arc = 0.7,
    rays = 1,
    dust = 1,
    grain = 0.4,
    speed = 1,
    interactive = true,
    replay = 0,
    className = "",
    children,
}) => {
    const wrap = useRef(null);
    const p = PRESETS[preset] ?? PRESETS.lilac;
    const live = useRef({});
    live.current = { sky: skyColor ?? p.sky, mid: midColor ?? p.mid, accent: accentColor ?? p.accent, core: coreColor ?? p.core, spread, intensity, duration, autoRise, breathe, shimmer, arc, rays, dust, grain, speed, interactive };
    const rise = useRef({ start: 0 });

    useEffect(() => {
        rise.current.start = performance.now();
    }, [replay, autoRise]);

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uRes: { value: new Vector2(1, 1) },
            uTime: { value: 0 },
            uRise: { value: 0 },
            uMouse: { value: new Vector2() },
            uSky: { value: new Color() },
            uMid: { value: new Color() },
            uAccent: { value: new Color() },
            uCore: { value: new Color() },
            uSpread: { value: 1 },
            uIntensity: { value: 1 },
            uShimmer: { value: 1 },
            uBreath: { value: 1 },
            uGrain: { value: 0.4 },
            uArc: { value: 0.7 },
            uRays: { value: 1 },
            uDust: { value: 1 },
        };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false });
        const geometry = new PlaneGeometry(2, 2);
        scene.add(new Mesh(geometry, material));

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        let raf = 0;
        let last = 0;
        let time = 0;
        let visible = true;

        const draw = (now) => {
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt * o.speed;
            const t = o.autoRise && !reduced ? Math.min(1, (now - rise.current.start) / (Math.max(0.1, o.duration) * 1000)) : 1;
            // Ease out with a touch of overshoot-free settle.
            u.uRise.value = 1 - Math.pow(1 - t, 4);
            const k = 1 - Math.exp(-dt / 0.6);
            mouse.x += ((o.interactive ? mouse.tx : 0) - mouse.x) * k;
            mouse.y += ((o.interactive ? mouse.ty : 0) - mouse.y) * k;
            u.uMouse.value.set(mouse.x, mouse.y);
            u.uTime.value = time;
            u.uSky.value.set(o.sky);
            u.uMid.value.set(o.mid);
            u.uAccent.value.set(o.accent);
            u.uCore.value.set(o.core);
            u.uSpread.value = o.spread;
            u.uIntensity.value = o.intensity;
            u.uShimmer.value = reduced ? 0 : o.shimmer;
            u.uBreath.value = reduced ? 0 : o.breathe;
            u.uGrain.value = o.grain;
            u.uArc.value = o.arc;
            u.uRays.value = reduced ? o.rays * 0.6 : o.rays;
            u.uDust.value = reduced ? 0 : o.dust;
            renderer.render(scene, camera);
        };
        const loop = (now) => {
            raf = 0;
            draw(now);
            if (visible && !reduced) raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (!raf && visible && !reduced) {
                last = 0;
                raf = requestAnimationFrame(loop);
            }
        };
        const fit = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            renderer.getDrawingBufferSize(u.uRes.value);
            if (!raf) draw(performance.now());
        };

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
        };
        const onLeave = () => {
            mouse.tx = 0;
            mouse.ty = 0;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
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
            el.removeEventListener("pointerleave", onLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div ref={wrap} className={`relative h-full w-full overflow-hidden bg-[#0d1438] ${className}`}>
            {children && <div className="relative z-10 h-full w-full">{children}</div>}
        </div>
    );
};

export default HorizonGlow;
