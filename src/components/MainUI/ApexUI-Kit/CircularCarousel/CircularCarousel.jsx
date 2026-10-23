import React, { useEffect, useRef, useState } from "react";
import { Color, DoubleSide, Group, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";

/*
 * Circular Carousel: image cards bent around a cylinder and drawn in WebGL.
 * The ring drifts on its own; drag or flick to throw it, and it glides,
 * then settles on a card. Hover pauses, a click brings that card to the
 * front, arrows / keys step through. Cards turning away fade into the
 * background and you can see their backs through the ring.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n) => `${IK}/${n}.png?tr=f-auto,q-80,w-640`;
const DEFAULT_ITEMS = [
    { src: img("spiderman"), title: "Spider-Man" },
    { src: img("black-panther"), title: "Black Panther" },
    { src: img("hulk"), title: "Hulk" },
    { src: img("thanos"), title: "Thanos" },
    { src: img("captainamerica"), title: "Captain America" },
    { src: img("doctorStrange"), title: "Doctor Strange" },
    { src: img("ironman"), title: "Iron Man" },
    { src: img("spiderman"), title: "Spider-Man" },
    { src: img("hulk"), title: "Hulk" },
];

const VERT = `
uniform float uRadius; uniform float uBase;
varying vec2 vUv; varying float vFacing;
void main(){
  vUv = uv;
  // Bend the flat card onto the cylinder.
  float a = uBase + position.x / uRadius;
  vec3 p = vec3(sin(a) * uRadius, position.y, cos(a) * uRadius);
  vec3 n = vec3(sin(a), 0.0, cos(a));
  vFacing = (modelViewMatrix * vec4(n, 0.0)).z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = `
uniform sampler2D uTex; uniform float uReady; uniform vec2 uCover; uniform float uCorner;
uniform vec3 uFade; uniform float uDepth; uniform float uAspect; uniform float uInner;
varying vec2 vUv; varying float vFacing;
void main(){
  vec2 uv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);
  // Rounded corners.
  vec2 q = abs(uv - 0.5) * vec2(uAspect, 1.0);
  vec2 b = vec2(uAspect, 1.0) * 0.5 - uCorner;
  float d = length(max(q - b, 0.0)) - uCorner;
  float edge = 1.0 - smoothstep(-0.004, 0.004, d);
  if (edge <= 0.0) discard;
  vec3 col = texture2D(uTex, (uv - 0.5) * uCover + 0.5).rgb;
  // Backs of far cards melt into the background, so it works on light and dark.
  if (!gl_FrontFacing) col = mix(col, uFade, uInner);
  float away = clamp((1.0 - vFacing) * 0.5, 0.0, 1.0);
  col = mix(col, uFade, uDepth * pow(away, 1.2));
  gl_FragColor = vec4(col, edge * uReady);
}`;

const CircularCarousel = ({
    items = DEFAULT_ITEMS,
    cardWidth = 1,
    aspectRatio = 0.8,
    gap = 0.12,
    speed = 12,
    autoplay = true,
    pauseOnHover = true,
    snap = true,
    tilt = -6,
    depthFade = 0.6,
    fadeColor = "#0a0a0a",
    cornerRadius = 0.06,
    captions = true,
    height = "28rem",
    onChange,
    className = "",
}) => {
    const wrap = useRef(null);
    const api = useRef(null);
    const [active, setActive] = useState(0);
    const live = useRef({});
    live.current = { speed, autoplay, pauseOnHover, snap, tilt, depthFade, fadeColor, onChange };
    const list = items.length ? items : DEFAULT_ITEMS;
    const key = list.map((i) => i.src).join("|");

    useEffect(() => {
        const el = wrap.current;
        const n = list.length;
        const step = (Math.PI * 2) / n;
        const w = cardWidth;
        const h = w / aspectRatio;
        // Radius so the cards (plus gap) wrap the ring exactly.
        const R = (n * w * (1 + gap)) / (Math.PI * 2);

        const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = SRGBColorSpace;
        Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%", touchAction: "pan-y" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new PerspectiveCamera(32, 1, 0.1, 200);
        const ring = new Group();
        scene.add(ring);

        const geometry = new PlaneGeometry(w, h, 32, 1);
        const loader = new TextureLoader().setCrossOrigin("anonymous");
        const fade = new Color(live.current.fadeColor);
        const materials = list.map((item, i) => {
            const m = new ShaderMaterial({
                vertexShader: VERT,
                fragmentShader: FRAG,
                transparent: true,
                side: DoubleSide,
                uniforms: {
                    uRadius: { value: R },
                    uBase: { value: i * step },
                    uTex: { value: null },
                    uReady: { value: 0 },
                    uCover: { value: new Vector2(1, 1) },
                    uCorner: { value: cornerRadius },
                    uFade: { value: fade },
                    uDepth: { value: depthFade },
                    uAspect: { value: aspectRatio },
                    uInner: { value: 0.72 },
                },
            });
            loader.load(item.src, (t) => {
                t.colorSpace = SRGBColorSpace;
                m.uniforms.uTex.value = t;
                const ia = t.image.width / t.image.height;
                // Cover crop: show the middle of the image at the card's shape.
                m.uniforms.uCover.value.set(ia > aspectRatio ? aspectRatio / ia : 1, ia > aspectRatio ? 1 : ia / aspectRatio);
                m.userData.loadedAt = performance.now();
                wake();
            });
            const mesh = new Mesh(geometry, m);
            mesh.renderOrder = 0;
            ring.add(mesh);
            return m;
        });

        const fit = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            if (!width || !hh) return;
            renderer.setSize(width, hh, false);
            camera.aspect = width / hh;
            const vfov = (camera.fov * Math.PI) / 180;
            const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
            // Distance so the whole ring fits the width and the cards fit the height.
            const dW = (R * 0.98) / Math.tan(hfov / 2);
            const dH = (h * 0.75) / Math.tan(vfov / 2);
            // On narrow screens let the sides crop rather than shrink the front card below half the width.
            const dCard = R + w / (2 * 0.5 * Math.tan(hfov / 2));
            camera.userData.dist = Math.max(Math.min(R + dW, dCard), R + dH);
            camera.updateProjectionMatrix();
            wake();
        };
        const ro = new ResizeObserver(fit);
        ro.observe(el);

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const s = { angle: 0, vel: 0, target: null, hover: false, drag: null, px: 0, py: 0, yaw: 0, pitch: 0, dir: -1, hold: 0 };
        let raf = 0;
        let last = 0;
        let visible = true;
        let shown = -1;

        const nearest = (a) => Math.round(a / step) * step;
        const frontIndex = () => ((Math.round(-s.angle / step) % n) + n) % n;

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            const paused = (o.pauseOnHover && s.hover) || s.drag || now < s.hold || reduced;
            const cruise = o.autoplay && !paused ? ((o.speed * Math.PI) / 180) * s.dir : 0;
            let busy = !!s.drag || cruise !== 0;
            if (!s.drag) {
                if (s.target !== null) {
                    // Critically damped spring onto the target card.
                    const k = 90;
                    const c = 2 * Math.sqrt(k);
                    s.vel += (k * (s.target - s.angle) - c * s.vel) * dt;
                    s.angle += s.vel * dt;
                    if (Math.abs(s.target - s.angle) < 0.0005 && Math.abs(s.vel) < 0.001) {
                        s.angle = s.target;
                        s.vel = 0;
                        s.target = null;
                    }
                    busy = true;
                } else {
                    s.vel += (cruise - s.vel) * (1 - Math.exp(-dt / 0.6));
                    s.angle += s.vel * dt;
                    if (!cruise && o.snap && Math.abs(s.vel) < 0.25) s.target = nearest(s.angle);
                    if (Math.abs(s.vel) > 0.0005 || s.target !== null) busy = true;
                }
            }
            s.yaw += (s.px * 0.08 - s.yaw) * (1 - Math.exp(-dt / 0.3));
            s.pitch += (s.py * 0.05 - s.pitch) * (1 - Math.exp(-dt / 0.3));
            if (Math.abs(s.px * 0.08 - s.yaw) > 0.0005) busy = true;

            ring.rotation.y = s.angle;
            const d = camera.userData.dist || R * 3;
            const t = ((o.tilt * Math.PI) / 180) + s.pitch;
            camera.position.set(Math.sin(s.yaw) * d, -Math.sin(t) * d, Math.cos(s.yaw) * Math.cos(t) * d);
            camera.lookAt(0, 0, 0);
            fade.set(o.fadeColor);
            materials.forEach((m) => {
                m.uniforms.uDepth.value = o.depthFade;
                const at = m.userData.loadedAt;
                if (at) {
                    m.uniforms.uReady.value = Math.min(1, (now - at) / 400);
                    if (m.uniforms.uReady.value < 1) busy = true;
                }
            });
            renderer.render(scene, camera);

            const idx = frontIndex();
            if (idx !== shown) {
                shown = idx;
                setActive(idx);
                o.onChange?.(idx);
            }
            if (busy && visible) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        function wake() {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        }

        const goTo = (i) => {
            let target = -i * step;
            target += Math.PI * 2 * Math.round((s.angle - target) / (Math.PI * 2));
            s.target = target;
            s.hold = performance.now() + 2500;
            wake();
        };
        api.current = {
            next: () => goTo(frontIndex() + 1),
            prev: () => goTo(frontIndex() - 1),
            goTo,
        };

        const canvas = renderer.domElement;
        const onDown = (e) => {
            if (e.button !== 0) return;
            s.drag = { x: e.clientX, y: e.clientY, a: s.angle, moved: false, samples: [{ t: performance.now(), a: s.angle }] };
            s.target = null;
            wake();
        };
        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            s.px = ((e.clientX - r.left) / r.width) * 2 - 1;
            s.py = ((e.clientY - r.top) / r.height) * 2 - 1;
            const g = s.drag;
            if (g) {
                const dx = e.clientX - g.x;
                if (!g.moved && Math.abs(dx) > 5) {
                    g.moved = true;
                    canvas.setPointerCapture(e.pointerId);
                }
                if (g.moved) {
                    // Drag speed follows the ring's on-screen size.
                    s.angle = g.a + (dx / r.width) * 2.4;
                    const now = performance.now();
                    g.samples.push({ t: now, a: s.angle });
                    while (g.samples.length > 2 && now - g.samples[0].t > 100) g.samples.shift();
                    s.vel = 0;
                }
            }
            wake();
        };
        const onUp = (e) => {
            const g = s.drag;
            if (!g) return;
            s.drag = null;
            if (g.moved) {
                const a = g.samples[0];
                const b = g.samples[g.samples.length - 1];
                const span = (b.t - a.t) / 1000;
                s.vel = span > 0.01 ? Math.max(-12, Math.min(12, (b.a - a.a) / span)) : 0;
                if (Math.abs(s.vel) > 0.6) s.dir = Math.sign(s.vel);
                s.hold = performance.now() + 1200;
            } else {
                // A click: the front-facing card whose center lands nearest the pointer.
                const r = canvas.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
                const p = new Vector3();
                let best = -1;
                let bestDx = Infinity;
                for (let i = 0; i < n; i++) {
                    const a = i * step + s.angle;
                    if (Math.cos(a) < 0.15) continue;
                    const dx = Math.abs(p.set(Math.sin(a) * R, 0, Math.cos(a) * R).project(camera).x - x);
                    if (dx < bestDx) {
                        bestDx = dx;
                        best = i;
                    }
                }
                if (best >= 0) goTo(best);
            }
            wake();
        };
        const onEnter = () => {
            s.hover = true;
            wake();
        };
        const onLeave = () => {
            s.hover = false;
            s.px = 0;
            s.py = 0;
            if (s.drag) onUp({ clientX: 0, clientY: 0 });
            wake();
        };
        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointercancel", onUp);
        canvas.addEventListener("pointerenter", onEnter);
        canvas.addEventListener("pointerleave", onLeave);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            wake();
        });
        io.observe(el);
        fit();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointercancel", onUp);
            canvas.removeEventListener("pointerenter", onEnter);
            canvas.removeEventListener("pointerleave", onLeave);
            materials.forEach((m) => {
                m.uniforms.uTex.value?.dispose();
                m.dispose();
            });
            geometry.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
            api.current = null;
        };
        // Rebuild when the cards or their shape change; motion settings are live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, cardWidth, aspectRatio, gap, cornerRadius]);

    const current = list[active] ?? list[0];
    return (
        <div
            ref={wrap}
            role="region"
            aria-roledescription="carousel"
            aria-label="Image carousel"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") api.current?.next();
                else if (e.key === "ArrowLeft") api.current?.prev();
                else return;
                e.preventDefault();
            }}
            className={`relative w-full cursor-grab select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/30 ${className}`}
            style={{ height }}
        >
            {captions && current && (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center" aria-live="polite">
                    <p className="text-sm font-semibold">{current.title}</p>
                    <p className="font-mono text-[0.7rem] tabular-nums opacity-50">
                        {String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CircularCarousel;
