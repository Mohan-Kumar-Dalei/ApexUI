import React, { useEffect, useRef, useState } from "react";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer } from "three";

/*
 * Arc Gallery: an endless row of image cards laid along a gentle arc and
 * drawn in WebGL. It drifts on its own (pausing on hover); drag, flick or
 * swipe sideways to move it and it eases to a stop on a card. While it
 * moves the cards ripple and bow, the edges fade out, and a title sits under
 * each card. Arrow keys step. Vertical wheel scrolling is left to the page.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n) => `${IK}/${n}.png?tr=f-auto,q-80,w-640`;
const DEFAULT_ITEMS = [
    { image: img("spiderman"), text: "Spider-Man" },
    { image: img("black-panther"), text: "Black Panther" },
    { image: img("hulk"), text: "Hulk" },
    { image: img("thanos"), text: "Thanos" },
    { image: img("captainamerica"), text: "Captain America" },
    { image: img("doctorStrange"), text: "Doctor Strange" },
    { image: img("ironman"), text: "Iron Man" },
];

const VERT = `
uniform float uWave; uniform float uTime; uniform float uPull;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position;
  // A soft ripple that only shows while the gallery moves.
  p.y += sin(uv.x * 3.14159 * 2.0 + uTime * 4.0) * uWave;
  // Pulled along: the middle of the card lags behind its corners, so the
  // trailing edge bows out into a half circle while it moves.
  float t = uv.y * 2.0 - 1.0;
  float bow = sqrt(max(0.0, 1.0 - t * t));
  float trail = uPull > 0.0 ? uv.x : 1.0 - uv.x;
  p.x += uPull * bow * mix(0.25, 1.0, trail);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = `
uniform sampler2D uTex; uniform float uReady; uniform vec2 uCover; uniform float uCorner; uniform float uAspect;
uniform float uFade; uniform float uViewW; uniform float uScreenX;
varying vec2 vUv;
void main(){
  vec2 q = abs(vUv - 0.5) * vec2(uAspect, 1.0);
  vec2 b = vec2(uAspect, 1.0) * 0.5 - uCorner;
  float d = length(max(q - b, 0.0)) - uCorner;
  float edge = 1.0 - smoothstep(-0.004, 0.004, d);
  if (edge <= 0.0) discard;
  vec3 col = texture2D(uTex, (vUv - 0.5) * uCover + 0.5).rgb;
  // Fade toward the left and right edges of the view.
  float u = clamp(gl_FragCoord.x / uViewW, 0.0, 1.0);
  float f = uFade > 0.0 ? smoothstep(0.0, uFade, u) * smoothstep(0.0, uFade, 1.0 - u) : 1.0;
  gl_FragColor = vec4(col, edge * f * uReady);
}`;

const ArcGallery = ({ items = DEFAULT_ITEMS, bend = 1, cardHeight = 0.62, aspectRatio = 0.78, gap = 0.22, cornerRadius = 0.05, wave = 1, pull = 1, fadeEdges = 0.14, ease = 0.08, snap = true, autoScroll = 40, pauseOnHover = true, showTitles = true, height = "26rem", onChange, className = "" }) => {
    const wrap = useRef(null);
    const labels = useRef([]);
    const api = useRef(null);
    const [active, setActive] = useState(0);
    const live = useRef({});
    live.current = { bend, wave, pull, fadeEdges, ease, snap, autoScroll, pauseOnHover, onChange };
    const list = items.length ? items : DEFAULT_ITEMS;
    const key = list.map((i) => i.image).join("|");

    useEffect(() => {
        const el = wrap.current;
        const n = list.length;
        const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.outputColorSpace = SRGBColorSpace;
        Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%", touchAction: "pan-y" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        // Orthographic camera in CSS pixels, origin at the center.
        const camera = new OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
        const geometry = new PlaneGeometry(1, 1, 24, 24);
        const loader = new TextureLoader().setCrossOrigin("anonymous");
        const view = { w: 1, h: 1 };
        // Enough meshes to cover the view plus a buffer, recycled as the row moves.
        const slots = [];
        const textures = list.map((item) => {
            const entry = { tex: null, aspect: 1, at: 0 };
            loader.load(item.image, (t) => {
                entry.tex = t;
                entry.aspect = t.image.width / t.image.height;
                entry.at = performance.now();
                wake();
            });
            return entry;
        });
        const makeSlot = () => {
            const m = new ShaderMaterial({
                vertexShader: VERT,
                fragmentShader: FRAG,
                transparent: true,
                uniforms: {
                    uTex: { value: null },
                    uReady: { value: 0 },
                    uCover: { value: new Vector2(1, 1) },
                    uCorner: { value: cornerRadius },
                    uAspect: { value: aspectRatio },
                    uFade: { value: fadeEdges },
                    uViewW: { value: 1 },
                    uScreenX: { value: 0 },
                    uWave: { value: 0 },
                    uTime: { value: 0 },
                    uPull: { value: 0 },
                },
            });
            const mesh = new Mesh(geometry, m);
            scene.add(mesh);
            return { mesh, m };
        };

        const s = { scroll: 0, target: 0, vel: 0, pull: 0, drag: null, time: 0, hover: false, hold: 0 };
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let cardW = 1;
        let cardH = 1;
        let spacing = 1;
        let raf = 0;
        let last = 0;
        let visible = true;
        let shown = -1;
        let snapTimer = 0;

        const size = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            if (!width || !hh) return;
            view.w = width;
            view.h = hh;
            renderer.setSize(width, hh, false);
            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = hh / 2;
            camera.bottom = -hh / 2;
            camera.updateProjectionMatrix();
            const old = spacing;
            cardH = hh * cardHeight;
            // At least two and a bit cards across, even in a tall narrow box.
            cardW = Math.min(cardH * aspectRatio, Math.max(width * 0.36, Math.min(width * 0.62, 200)));
            cardH = cardW / aspectRatio;
            spacing = cardW * (1 + gap);
            if (old > 1) {
                s.scroll = (s.scroll / old) * spacing;
                s.target = (s.target / old) * spacing;
            }
            const need = Math.ceil(width / spacing) + 4;
            while (slots.length < need) slots.push(makeSlot());
            wake();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);

        // Point on the arc for a horizontal offset x (circle through the edges).
        const arc = (x) => {
            const b = live.current.bend;
            if (!b) return { y: 0, rot: 0 };
            const depth = Math.min(view.w, view.h * 2) * 0.05 * Math.abs(b);
            const half = view.w / 2 + spacing;
            const r = (half * half + depth * depth) / (2 * depth);
            const reach = Math.min(Math.abs(x), r * 0.999);
            const y = r - Math.sqrt(r * r - reach * reach);
            const rot = Math.asin(reach / r) * Math.sign(x);
            return b > 0 ? { y: -y, rot: -rot } : { y, rot };
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            // Auto scroll drifts the row along, pausing while hovered, dragged or
            // just after someone moved it by hand.
            const auto = o.autoScroll && !reduced && !s.drag && !(o.pauseOnHover && s.hover) && now > s.hold;
            if (auto) s.target += o.autoScroll * dt;
            const before = s.scroll;
            const follow = 1 - Math.pow(1 - Math.min(1, Math.max(0.01, o.ease)), dt * 60);
            s.scroll += (s.target - s.scroll) * follow;
            if (Math.abs(s.target - s.scroll) < 0.05) s.scroll = s.target;
            const v = (s.scroll - before) / dt;
            s.vel += (v - s.vel) * (1 - Math.exp(-dt / 0.08));
            if (Math.abs(s.vel) < 1) s.vel = 0;
            s.time += dt;
            const waveAmt = o.wave * Math.min(1, Math.abs(s.vel) / (spacing * 6)) * cardH * 0.05;
            // Bow toward the side it came from (cards moving left lag to the right).
            const pullGoal = Math.max(-1, Math.min(1, s.vel / (spacing * 7))) * 0.32 * o.pull;
            s.pull += (pullGoal - s.pull) * (1 - Math.exp(-dt / 0.12));
            if (Math.abs(s.pull) < 0.0005 && !pullGoal) s.pull = 0;
            let busy = auto || s.pull !== 0 || s.scroll !== s.target || s.vel !== 0 || !!s.drag;

            const first = Math.floor((s.scroll - view.w / 2) / spacing) - 1;
            slots.forEach((slot, k) => {
                const index = first + k;
                const x = index * spacing - s.scroll;
                const item = ((index % n) + n) % n;
                const entry = textures[item];
                const { y, rot } = arc(x);
                slot.mesh.position.set(x, y + cardH * 0.06, 0);
                slot.mesh.rotation.z = rot;
                slot.mesh.scale.set(cardW, cardH, 1);
                const m = slot.m.uniforms;
                m.uTex.value = entry.tex;
                m.uReady.value = entry.at ? Math.min(1, (now - entry.at) / 400) : 0;
                if (entry.at && m.uReady.value < 1) busy = true;
                const ia = entry.aspect;
                m.uCover.value.set(ia > aspectRatio ? aspectRatio / ia : 1, ia > aspectRatio ? 1 : ia / aspectRatio);
                m.uFade.value = o.fadeEdges;
                m.uViewW.value = view.w * dpr;
                m.uWave.value = waveAmt / cardH;
                m.uTime.value = s.time;
                m.uPull.value = s.pull;
                // Title under the card.
                const label = labels.current[k];
                if (label) {
                    if (showTitles) {
                        label.textContent = list[item].text ?? "";
                        const ly = -(y + cardH * 0.06) + cardH / 2 + 18;
                        const lx = x - Math.sin(rot) * (cardH / 2 + 18);
                        const u = (lx + view.w / 2) / view.w;
                        const f = o.fadeEdges > 0 ? Math.min(1, Math.max(0, Math.min(u, 1 - u) / o.fadeEdges)) : 1;
                        label.style.transform = `translate(${lx + view.w / 2}px, ${ly + view.h / 2}px) translate(-50%, -50%) rotate(${-rot}rad)`;
                        label.style.opacity = String(f);
                    } else label.style.opacity = "0";
                }
            });
            renderer.render(scene, camera);

            const idx = ((Math.round(s.scroll / spacing) % n) + n) % n;
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
        const settle = () => {
            if (live.current.snap) s.target = Math.round(s.target / spacing) * spacing;
            wake();
        };
        api.current = {
            step: (d) => {
                s.target = (Math.round(s.target / spacing) + d) * spacing;
                wake();
            },
        };

        const canvas = renderer.domElement;
        const onDown = (e) => {
            if (e.button !== 0) return;
            s.drag = { x: e.clientX, start: s.target, moved: false, samples: [] };
            wake();
        };
        const onMove = (e) => {
            const g = s.drag;
            if (!g) return;
            const dx = e.clientX - g.x;
            if (!g.moved && Math.abs(dx) > 5) {
                g.moved = true;
                canvas.setPointerCapture(e.pointerId);
            }
            if (!g.moved) return;
            s.target = g.start - dx * 1.4;
            g.samples.push({ x: e.clientX, t: performance.now() });
            if (g.samples.length > 6) g.samples.shift();
            wake();
        };
        const onUp = (e) => {
            const g = s.drag;
            s.drag = null;
            s.hold = performance.now() + 1800;
            if (!g) return;
            if (g.moved && g.samples.length > 1) {
                const a = g.samples[0];
                const b = g.samples[g.samples.length - 1];
                const v = ((b.x - a.x) / Math.max(16, b.t - a.t)) * 1000;
                s.target -= v * 0.25;
            } else if (!g.moved) {
                // Click: bring the clicked card to the center.
                const r = canvas.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                s.target = Math.round((s.scroll + x) / spacing) * spacing;
                wake();
                return;
            }
            settle();
        };
        const onWheel = (e) => {
            // Only sideways wheel / trackpad swipes move the row; vertical
            // scrolling belongs to the page.
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            e.preventDefault();
            s.target += e.deltaX * 1.2;
            s.hold = performance.now() + 1800;
            clearTimeout(snapTimer);
            snapTimer = setTimeout(settle, 140);
            wake();
        };
        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointercancel", onUp);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        const onEnter = () => (s.hover = true);
        const onLeave = () => {
            s.hover = false;
            wake();
        };
        canvas.addEventListener("pointerenter", onEnter);
        canvas.addEventListener("pointerleave", onLeave);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            wake();
        });
        io.observe(el);
        size();

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(snapTimer);
            ro.disconnect();
            io.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointercancel", onUp);
            canvas.removeEventListener("wheel", onWheel);
            canvas.removeEventListener("pointerenter", onEnter);
            canvas.removeEventListener("pointerleave", onLeave);
            textures.forEach((t) => t.tex?.dispose());
            slots.forEach((slot) => slot.m.dispose());
            geometry.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
            api.current = null;
        };
        // Rebuild when the images or card shape change; motion settings are live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, cardHeight, aspectRatio, gap, cornerRadius, showTitles]);

    return (
        <div
            ref={wrap}
            role="region"
            aria-roledescription="carousel"
            aria-label={`Image gallery, ${list[active]?.text ?? ""}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") api.current?.step(1);
                else if (e.key === "ArrowLeft") api.current?.step(-1);
                else return;
                e.preventDefault();
            }}
            className={`relative w-full cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/30 ${className}`}
            style={{ height }}
        >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {Array.from({ length: 24 }, (_, k) => (
                    <span key={k} ref={(e) => (labels.current[k] = e)} className="absolute left-0 top-0 whitespace-nowrap text-sm font-semibold opacity-0" />
                ))}
            </div>
        </div>
    );
};

export default ArcGallery;
