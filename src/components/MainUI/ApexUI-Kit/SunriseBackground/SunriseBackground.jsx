import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";

/*
 * Sunrise Background: a sun rising out of the valley between two mountain
 * ranges, drawn in one WebGL shader. The sky warms from night to dawn as it
 * climbs, light rays fan out, the ridges catch a rim of light, mist glows in
 * the valley and the stars fade. The mountains drift a little with the
 * pointer. Put your hero content on top as children.
 */

const PRESETS = {
    dawn: { sunColor: "#ffb15c", skyTop: "#1d2350", skyHorizon: "#ff7a59", mountainColor: "#140f24" },
    golden: { sunColor: "#ffd36e", skyTop: "#2b3a67", skyHorizon: "#ffa94d", mountainColor: "#1b1420" },
    dusk: { sunColor: "#ff8fb1", skyTop: "#1a1033", skyHorizon: "#c86dd7", mountainColor: "#100a1c" },
    arctic: { sunColor: "#b8f3ff", skyTop: "#0c1f33", skyHorizon: "#5fd4e6", mountainColor: "#08141f" },
};

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uRise; uniform vec2 uMouse;
uniform vec3 uSun; uniform vec3 uSkyTop; uniform vec3 uSkyLow; uniform vec3 uMount;
uniform float uRays; uniform float uStars; uniform float uHaze; uniform float uSunSize; uniform float uSunHeight;

float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n1(float x){ float i = floor(x); float f = fract(x); return mix(h1(i), h1(i + 1.0), f * f * (3.0 - 2.0 * f)); }
float n2(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y);
}
// Craggy ridge detail: a few octaves of folded noise.
float crag(float x){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * (1.0 - abs(n1(x) * 2.0 - 1.0)); x *= 2.03; a *= 0.5; }
  return v;
}
// Two peaks with a valley between them, plus detail.
float range(float x, float c, float w, float peak, float base, float amp, float freq, float seed){
  float tl = clamp(1.0 - abs(x + c) / w, 0.0, 1.0);
  float tr = clamp(1.0 - abs(x - c) / w, 0.0, 1.0);
  float sl = mix(tl, tl * tl * (3.0 - 2.0 * tl), 0.45);
  float sr = mix(tr, tr * tr * (3.0 - 2.0 * tr), 0.45);
  float s = max(sl, sr);
  return base + s * peak + (crag(x * freq + seed) - 0.45) * amp * (0.35 + s);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  // x normalised to the half width (clamped so phones still show both slopes).
  float xn = (uv.x - 0.5) * asp / (0.5 * clamp(asp, 0.7, 2.2));
  float y = uv.y;
  float rise = uRise;

  vec2 sp = vec2(0.0, mix(-0.16, uSunHeight, rise));
  vec2 q = vec2((uv.x - 0.5) * asp, y);
  float d = length(q - sp);

  // Sky: night blue warming toward the horizon as the sun climbs.
  vec3 top = mix(uSkyTop * 0.28, uSkyTop, smoothstep(0.0, 0.8, rise));
  vec3 low = mix(uSkyTop * 0.5, uSkyLow, smoothstep(0.05, 0.9, rise));
  vec3 col = mix(low, top, smoothstep(0.0, 0.9, y + 0.15 * (1.0 - rise)));
  float warm = exp(-max(y - sp.y * 0.6, 0.0) * 3.2) * exp(-abs(q.x) * 0.9);
  col += uSun * warm * (0.15 + 0.75 * rise);

  // Stars fade out with the dawn.
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  float star = step(0.9965, h2(cell)) * (0.6 + 0.4 * sin(uTime * 2.0 + h2(cell + 7.0) * 30.0));
  col += star * uStars * (1.0 - smoothstep(0.1, 0.75, rise)) * smoothstep(0.35, 0.9, y);

  // Sun disc, halo and rays.
  float r = uSunSize;
  float disc = smoothstep(r + 0.003, r - 0.003, d);
  vec3 sunCore = mix(uSun, vec3(1.0, 0.98, 0.92), 0.65);
  col = mix(col, sunCore, disc);
  col += uSun * (exp(-d * 9.0 / (r * 10.0)) * 0.55 + exp(-d * 2.2) * 0.35) * (0.4 + 0.6 * rise);
  float ang = atan(q.x - sp.x, q.y - sp.y);
  float beam = n2(vec2(ang * 7.0, uTime * 0.12)) * 0.7 + n2(vec2(ang * 17.0, -uTime * 0.07)) * 0.3;
  float rays = smoothstep(0.45, 0.95, beam) * exp(-d * 1.6) * smoothstep(r, r * 2.5, d);
  col += uSun * rays * uRays * 0.55 * rise;

  // Mountains, far to near. Each layer drifts with the pointer by depth.
  float mx = uMouse.x; float my = uMouse.y;
  float hf = range(xn + mx * 0.012, 0.6, 0.85, 0.36, 0.16, 0.06, 2.6, 3.0) + my * 0.004;
  float hm = range(xn + mx * 0.028, 0.42, 0.78, 0.33, 0.08, 0.07, 3.8, 11.0) + my * 0.008;
  float hn = range(xn + mx * 0.05, 0.66, 0.86, 0.30, -0.02, 0.06, 5.2, 27.0) + my * 0.014;

  float toSun = exp(-abs(xn) * 1.4) * rise;
  vec3 haze = mix(low, uSun, 0.35 + 0.3 * rise);

  // Far range: soft and hazy.
  float mf = smoothstep(hf + 0.0025, hf - 0.0025, y);
  vec3 cf = mix(uMount, haze, 0.62 * uHaze + 0.1);
  cf += uSun * exp(-max(hf - y, 0.0) * 40.0) * toSun * 0.5;
  col = mix(col, cf, mf);

  // Valley mist lit by the sun.
  float mist = exp(-abs(y - (hm - 0.03)) * 9.0) * exp(-abs(xn) * 1.1) * uHaze;
  col += uSun * mist * 0.35 * rise;

  // Middle range.
  float mm = smoothstep(hm + 0.002, hm - 0.002, y);
  vec3 cm = mix(uMount, haze, 0.32 * uHaze + 0.04);
  cm *= 0.75 + 0.35 * smoothstep(hm - 0.35, hm, y);
  cm += uSun * exp(-max(hm - y, 0.0) * 70.0) * toSun * 0.7;
  col = mix(col, cm, mm);

  // Near range: darkest, with a sharp rim of light on the ridge.
  float mn = smoothstep(hn + 0.0018, hn - 0.0018, y);
  vec3 cn = uMount * (0.65 + 0.35 * smoothstep(hn - 0.3, hn, y));
  cn += uSun * exp(-max(hn - y, 0.0) * 120.0) * toSun * 0.9;
  col = mix(col, cn, mn);

  // Low fog over everything and light bleeding over the ridges.
  col += haze * exp(-y * 7.0) * 0.12 * uHaze * rise;
  col += uSun * exp(-d * 3.0) * 0.18 * rise;

  // Gentle tone curve and dither (no banding in the gradients).
  col = col / (1.0 + col * 0.35);
  col += (h2(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const SunriseBackground = ({
    preset = "dawn",
    sunColor,
    skyTop,
    skyHorizon,
    mountainColor,
    duration = 6,
    autoRise = true,
    sunHeight = 0.36,
    sunSize = 0.075,
    rays = 1,
    stars = 1,
    haze = 1,
    speed = 1,
    interactive = true,
    replay = 0,
    className = "",
    children,
}) => {
    const wrap = useRef(null);
    const live = useRef({});
    const p = PRESETS[preset] ?? PRESETS.dawn;
    live.current = {
        sun: sunColor ?? p.sunColor,
        top: skyTop ?? p.skyTop,
        low: skyHorizon ?? p.skyHorizon,
        mount: mountainColor ?? p.mountainColor,
        duration,
        autoRise,
        sunHeight,
        sunSize,
        rays,
        stars,
        haze,
        speed,
        interactive,
    };
    const rise = useRef({ start: 0 });

    // Replaying (or turning autoRise back on) starts the climb again.
    useEffect(() => {
        rise.current.start = performance.now();
    }, [replay, autoRise]);

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uRes: { value: new Vector2(1, 1) },
            uTime: { value: 0 },
            uRise: { value: 0 },
            uMouse: { value: new Vector2() },
            uSun: { value: new Color() },
            uSkyTop: { value: new Color() },
            uSkyLow: { value: new Color() },
            uMount: { value: new Color() },
            uRays: { value: 1 },
            uStars: { value: 1 },
            uHaze: { value: 1 },
            uSunSize: { value: 0.075 },
            uSunHeight: { value: 0.3 },
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

        const fit = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            renderer.getDrawingBufferSize(u.uRes.value);
            if (!raf) draw(performance.now());
        };
        const draw = (now) => {
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt * o.speed;
            const t = o.autoRise && !reduced ? Math.min(1, (now - rise.current.start) / (Math.max(0.1, o.duration) * 1000)) : 1;
            // Ease out: quick at first, then a slow settle at the top.
            u.uRise.value = 1 - Math.pow(1 - t, 3);
            const k = 1 - Math.exp(-dt / 0.35);
            mouse.x += ((o.interactive ? mouse.tx : 0) - mouse.x) * k;
            mouse.y += ((o.interactive ? mouse.ty : 0) - mouse.y) * k;
            u.uMouse.value.set(mouse.x, mouse.y);
            u.uTime.value = time;
            u.uSun.value.set(o.sun);
            u.uSkyTop.value.set(o.top);
            u.uSkyLow.value.set(o.low);
            u.uMount.value.set(o.mount);
            u.uRays.value = o.rays;
            u.uStars.value = o.stars;
            u.uHaze.value = o.haze;
            u.uSunSize.value = o.sunSize;
            u.uSunHeight.value = o.sunHeight;
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

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
            mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
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
        <div ref={wrap} className={`relative h-full w-full overflow-hidden bg-[#0b0b18] ${className}`}>
            {children && <div className="relative z-10 h-full w-full">{children}</div>}
        </div>
    );
};

export default SunriseBackground;
