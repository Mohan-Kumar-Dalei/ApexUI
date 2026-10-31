import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from "three";

/*
 * Sketch Reveal: one picture turns into a glowing line sketch, then a ragged,
 * pixelated circle burns outward from the centre and reveals a second
 * picture, with sparks along the burning edge. Drawn in one WebGL shader
 * (edge detection + noise). Drive it with the page scroll (the section pins
 * while it plays), with hover, on a loop, or with your own progress value.
 *
 * Props: from, to (image urls), mode ("scroll" | "hover" | "auto" |
 * "manual"), progress (0..1 for manual), scrollLength (extra scroll in vh
 * for scroll mode), stickyTop (px, e.g. your header height), edgeColor,
 * sparkle, center ([x, y] 0..1), duration (seconds per auto loop),
 * height, className, children (shown on top).
 */

const photo = (id) => `https://images.unsplash.com/${id}?w=1800&q=80&auto=format&fit=crop`;

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom; uniform sampler2D uTo; uniform vec2 uCoverFrom; uniform vec2 uCoverTo;
uniform vec2 uRes; uniform float uProgress; uniform float uTime; uniform vec2 uCenter;
uniform vec3 uEdge; uniform float uSparkle; uniform float uReady;

float h2(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.97))) * 23758.5453); }
float n2(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.55; for (int i = 0; i < 5; i++) { v += a * n2(p); p = p * 2.07 + 3.1; a *= 0.5; } return v; }
float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

vec2 coverUv(vec2 uv, vec2 k){ return (uv - 0.5) * k + 0.5; }

// Edge strength from a 3x3 Sobel pass over the picture's brightness.
float edges(vec2 uv){
  vec2 t = 1.0 / uRes;
  float tl = luma(texture2D(uFrom, uv + t * vec2(-1.0,  1.0)).rgb);
  float tc = luma(texture2D(uFrom, uv + t * vec2( 0.0,  1.0)).rgb);
  float tr = luma(texture2D(uFrom, uv + t * vec2( 1.0,  1.0)).rgb);
  float ml = luma(texture2D(uFrom, uv + t * vec2(-1.0,  0.0)).rgb);
  float mr = luma(texture2D(uFrom, uv + t * vec2( 1.0,  0.0)).rgb);
  float bl = luma(texture2D(uFrom, uv + t * vec2(-1.0, -1.0)).rgb);
  float bc = luma(texture2D(uFrom, uv + t * vec2( 0.0, -1.0)).rgb);
  float br = luma(texture2D(uFrom, uv + t * vec2( 1.0, -1.0)).rgb);
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -bl - 2.0 * bc - br + tl + 2.0 * tc + tr;
  // Keep the strong lines only, so busy textures (leaves, water) stay calm.
  return smoothstep(0.1, 0.62, length(vec2(gx, gy)));
}

void main(){
  vec2 uvA = coverUv(vUv, uCoverFrom);
  vec2 uvB = coverUv(vUv, uCoverTo);
  vec3 a = texture2D(uFrom, uvA).rgb;
  vec3 b = texture2D(uTo, uvB).rgb;
  float p = uProgress;

  // Stage 1: the first picture drains to a dark line sketch.
  float sketchK = smoothstep(0.0, 0.42, p);
  float e = edges(uvA);
  vec3 sketch = vec3(0.025) + uEdge * e * 0.92 + vec3(luma(a)) * 0.07;
  vec3 col = mix(a, sketch, sketchK);

  // Stage 2: a ragged, pixelated circle burns outward and shows the second picture.
  float asp = uRes.x / uRes.y;
  vec2 d = vUv - uCenter; d.x *= asp;
  float r = length(d);
  float maxR = length(vec2(max(uCenter.x, 1.0 - uCenter.x) * asp, max(uCenter.y, 1.0 - uCenter.y)));
  vec2 cell = floor(gl_FragCoord.xy / 7.0);
  float ragged = (fbm(cell * 0.09) - 0.5) * 0.22 + (fbm(vec2(atan(d.y, d.x) * 3.0, 1.7)) - 0.5) * 0.18;
  float front = mix(-0.15, 1.22, smoothstep(0.3, 1.0, p)) * maxR;
  float dist = r + ragged * maxR;
  float revealed = smoothstep(front + 0.006, front - 0.006, dist);
  col = mix(col, b, revealed);

  // Burning edge: a glowing band with flickering sparks just outside the front.
  float band = smoothstep(0.075 * maxR, 0.0, abs(dist - front)) * step(0.3, p) * (1.0 - smoothstep(0.96, 1.0, p));
  float flick = step(0.62, h2(cell + floor(uTime * 14.0)));
  col += uEdge * band * (0.55 + flick * 1.2 * uSparkle);
  col += uEdge * smoothstep(0.22 * maxR, 0.0, abs(dist - front)) * 0.18 * step(0.3, p) * (1.0 - smoothstep(0.96, 1.0, p));

  col = mix(vec3(0.03), col, uReady);
  gl_FragColor = vec4(col, 1.0);
}`;

const SketchReveal = ({
    from = photo("photo-1464822759023-fed622ff2c3b"),
    to = photo("photo-1506905925346-21bda4d32df4"),
    mode = "scroll",
    progress = 0,
    scrollLength = 150,
    stickyTop = 0,
    edgeColor = "#fff4d6",
    sparkle = 1,
    center = [0.5, 0.5],
    duration = 6,
    height = "100%",
    className = "",
    children,
}) => {
    const outer = useRef(null);
    const stage = useRef(null);
    const live = useRef({});
    live.current = { mode, progress, edgeColor, sparkle, center, duration, stickyTop };

    useEffect(() => {
        const el = stage.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uFrom: { value: null },
            uTo: { value: null },
            uCoverFrom: { value: new Vector2(1, 1) },
            uCoverTo: { value: new Vector2(1, 1) },
            uRes: { value: new Vector2(1, 1) },
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uCenter: { value: new Vector2(0.5, 0.5) },
            uEdge: { value: new Color() },
            uSparkle: { value: 1 },
            uReady: { value: 0 },
        };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false });
        const geometry = new PlaneGeometry(2, 2);
        scene.add(new Mesh(geometry, material));

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const view = { w: 1, h: 1, aspects: [1, 1] };
        const s = { p: 0, hover: false, loaded: 0, readyAt: 0 };
        let raf = 0;
        let last = 0;
        let time = 0;
        let visible = true;

        const cover = (ia) => {
            const a = view.w / view.h;
            return ia > a ? [a / ia, 1] : [1, ia / a];
        };
        const recover = () => {
            u.uCoverFrom.value.set(...cover(view.aspects[0]));
            u.uCoverTo.value.set(...cover(view.aspects[1]));
        };
        const loader = new TextureLoader().setCrossOrigin("anonymous");
        [from, to].forEach((src, i) =>
            loader.load(src, (t) => {
                (i ? u.uTo : u.uFrom).value = t;
                view.aspects[i] = t.image.width / t.image.height;
                recover();
                if (++s.loaded === 2) s.readyAt = performance.now();
                start();
            }),
        );

        const fit = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            if (!width || !hh) return;
            view.w = width;
            view.h = hh;
            renderer.setSize(width, hh, false);
            u.uRes.value.set(width * dpr, hh * dpr);
            recover();
            start();
        };

        // Where the section is in its pinned scroll run, 0 to 1.
        const scrollProgress = () => {
            const box = outer.current.getBoundingClientRect();
            const run = box.height - (window.innerHeight - live.current.stickyTop);
            return run > 0 ? Math.min(1, Math.max(0, (live.current.stickyTop - box.top) / run)) : 0;
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt;
            let target;
            if (o.mode === "scroll") target = scrollProgress();
            else if (o.mode === "hover") target = s.hover ? 1 : 0;
            else if (o.mode === "auto") target = reduced ? 1 : 0.5 - 0.5 * Math.cos((time / Math.max(1, o.duration)) * Math.PI * 2);
            else target = Math.min(1, Math.max(0, o.progress));
            // Ease toward the target so scroll and hover feel smooth.
            const k = o.mode === "auto" ? 1 : 1 - Math.exp(-dt / (o.mode === "hover" ? 0.45 : 0.12));
            s.p += (target - s.p) * k;
            u.uProgress.value = s.p;
            u.uTime.value = time;
            u.uCenter.value.set(o.center[0], 1 - o.center[1]);
            u.uEdge.value.set(o.edgeColor).convertLinearToSRGB();
            u.uSparkle.value = o.sparkle;
            u.uReady.value = s.readyAt ? Math.min(1, (now - s.readyAt) / 500) : 0;
            renderer.render(scene, camera);
            if (visible) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        function start() {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        }

        const onEnter = () => (s.hover = true);
        const onLeave = () => (s.hover = false);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        fit();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
            u.uFrom.value?.dispose();
            u.uTo.value?.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, [from, to]);

    const inner = (
        <div ref={stage} className={`relative w-full overflow-hidden bg-[#08080a] ${mode === "scroll" ? "" : className}`} style={mode === "scroll" ? { position: "sticky", top: stickyTop, height: `calc(100vh - ${stickyTop}px)` } : { height }}>
            {children && <div className="pointer-events-none relative z-10 h-full w-full [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{children}</div>}
        </div>
    );

    // Scroll mode: a tall section whose inner stage pins while the reveal plays.
    return mode === "scroll" ? (
        <div ref={outer} className={`relative w-full ${className}`} style={{ height: `calc(100vh - ${stickyTop}px + ${scrollLength}vh)` }}>
            {inner}
        </div>
    ) : (
        <div ref={outer} className="h-full w-full">
            {inner}
        </div>
    );
};

export default SketchReveal;
