import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from "three";

/*
 * Dither Waves: slow flowing waves turned into crisp two-tone pixel art with
 * ordered (Bayer) dithering, drawn in one WebGL shader. The pointer drops
 * ripples that spread through the pattern. Pick the two colors, the pixel
 * size and the matrix (4x4 is chunkier, 8x8 smoother).
 */

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uPixel; uniform float uScale; uniform float uContrast;
uniform vec3 uInk; uniform vec3 uPaper; uniform float uMatrix;
uniform vec3 uRipples[6]; // x, y in pixels, start time
uniform float uRipple; uniform vec2 uMouse; uniform float uHover;

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * n2(p); p = p * 2.03 + 11.7; a *= 0.5; } return v; }

void main(){
  // Snap to the pixel grid first so the whole field reads as chunky pixels.
  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  vec2 px = (cell + 0.5) * uPixel;
  vec2 p = px / uRes.y * uScale;
  float t = uTime;

  // Domain-warped waves drifting diagonally.
  vec2 w = vec2(fbm(p * 0.9 + vec2(t * 0.06, -t * 0.04)), fbm(p * 0.9 + vec2(-t * 0.05, t * 0.07) + 5.2));
  float v = fbm(p + w * 1.6 + vec2(t * 0.03, 0.0));
  v += 0.18 * sin(p.x * 1.3 + p.y * 0.7 - t * 0.6 + w.x * 4.0);

  // Ripples from the pointer.
  float rip = 0.0;
  for (int i = 0; i < 6; i++) {
    vec3 r = uRipples[i];
    float age = t - r.z;
    if (r.z > 0.0 && age < 3.5) {
      float dist = length(px - r.xy) / uRes.y;
      float front = age * 0.45;
      rip += sin((dist - front) * 38.0) * exp(-abs(dist - front) * 14.0) * exp(-age * 0.9);
    }
  }
  v += rip * 0.22 * uRipple;
  // A soft glow under the pointer.
  v += uHover * 0.18 * exp(-length(px - uMouse) / uRes.y * 7.0);

  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);
  float threshold = uMatrix > 6.0 ? bayer8(cell) : bayer4(cell);
  float on = step(threshold, v);
  gl_FragColor = vec4(mix(uPaper, uInk, on), 1.0);
}`;

const DitherWaves = ({ ink = "#c8f560", paper = "#0b0d0a", pixelSize = 3, matrix = 8, scale = 2.4, contrast = 1.35, speed = 1, ripple = 1, interactive = true, className = "", children }) => {
    const wrap = useRef(null);
    const live = useRef({});
    live.current = { ink, paper, pixelSize, matrix, scale, contrast, speed, ripple, interactive };

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", imageRendering: "pixelated" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uRes: { value: new Vector2(1, 1) },
            uTime: { value: 0 },
            uPixel: { value: 3 },
            uScale: { value: 2.4 },
            uContrast: { value: 1.35 },
            uInk: { value: new Color() },
            uPaper: { value: new Color() },
            uMatrix: { value: 8 },
            uRipples: { value: Array.from({ length: 6 }, () => new Vector3()) },
            uRipple: { value: 1 },
            uMouse: { value: new Vector2(-9999, -9999) },
            uHover: { value: 0 },
        };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false });
        const geometry = new PlaneGeometry(2, 2);
        scene.add(new Mesh(geometry, material));

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const mouse = { x: -9999, y: -9999, hover: 0, in: false, lastDrop: 0, lx: 0, ly: 0 };
        let slot = 0;
        let raf = 0;
        let last = 0;
        let time = 1;
        let visible = true;
        let h = 1;

        const fit = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            h = height;
            renderer.setSize(width, height, false);
            u.uRes.value.set(width * dpr, height * dpr);
            if (!raf) draw(performance.now());
        };
        const drop = (x, y) => {
            const r = u.uRipples.value[slot];
            r.set(x * dpr, (h - y) * dpr, time);
            slot = (slot + 1) % 6;
        };
        const draw = (now) => {
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt * o.speed;
            mouse.hover += ((o.interactive && mouse.in ? 1 : 0) - mouse.hover) * (1 - Math.exp(-dt / 0.25));
            u.uTime.value = time;
            u.uPixel.value = Math.max(1, o.pixelSize) * dpr;
            u.uScale.value = o.scale;
            u.uContrast.value = o.contrast;
            // The shader writes these straight to the screen, so keep them in sRGB.
            u.uInk.value.set(o.ink).convertLinearToSRGB();
            u.uPaper.value.set(o.paper).convertLinearToSRGB();
            u.uMatrix.value = o.matrix;
            u.uRipple.value = o.interactive ? o.ripple : 0;
            u.uMouse.value.set(mouse.x * dpr, (h - mouse.y) * dpr);
            u.uHover.value = mouse.hover;
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

        const local = (e) => {
            const r = el.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onMove = (e) => {
            [mouse.x, mouse.y] = local(e);
            mouse.in = true;
            // Moving drops a ripple every so often, spaced by distance.
            if (live.current.interactive && Math.hypot(mouse.x - mouse.lx, mouse.y - mouse.ly) > 90 && time - mouse.lastDrop > 0.25) {
                drop(mouse.x, mouse.y);
                mouse.lastDrop = time;
                mouse.lx = mouse.x;
                mouse.ly = mouse.y;
            }
        };
        const onDown = (e) => {
            if (!live.current.interactive) return;
            const [x, y] = local(e);
            drop(x, y);
        };
        const onLeave = () => {
            mouse.in = false;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerdown", onDown);
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
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointerleave", onLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div ref={wrap} className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: paper }}>
            {children && <div className="relative z-10 h-full w-full">{children}</div>}
        </div>
    );
};

export default DitherWaves;
