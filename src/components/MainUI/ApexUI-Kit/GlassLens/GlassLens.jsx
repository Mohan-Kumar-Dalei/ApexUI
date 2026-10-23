import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer } from "three";

/*
 * Glass Lens: a drop of liquid glass that glides over an image, drawn in
 * WebGL. It magnifies the middle, bends the picture hard at its rim, splits
 * the colors a little at the edge, catches a specular highlight and casts a
 * soft shadow. It follows the pointer on a spring and stretches along the
 * way it moves, then rounds out again when it stops. When the pointer
 * leaves it drifts on its own. Drag it on touch screens.
 */

const DEFAULT_IMAGE = "https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage/galaxy-3d.png?tr=f-auto,q-85,w-1600";

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uTex; uniform vec2 uRes; uniform vec2 uCover; uniform float uReady;
uniform vec2 uLens; uniform float uRadius; uniform vec2 uStretch; uniform float uAngle;
uniform float uRefract; uniform float uDisperse; uniform float uFrost; uniform vec3 uTint; uniform float uTintAmt;

vec3 img(vec2 uv){ return texture2D(uTex, (uv - 0.5) * uCover + 0.5).rgb; }

void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;
  vec3 base = img(uv);

  // Lens space: rotate into the direction of travel and squash by the stretch.
  vec2 rel = px - uLens;
  float c = cos(uAngle); float s = sin(uAngle);
  vec2 q = vec2(c * rel.x + s * rel.y, -s * rel.x + c * rel.y) / (uRadius * uStretch);
  float d = length(q);

  // Soft drop shadow just outside the rim.
  float shadow = smoothstep(1.45, 0.95, d) * (1.0 - smoothstep(0.98, 1.0, d));
  vec3 col = base * (1.0 - 0.28 * shadow);

  if (d < 1.0) {
    float h = sqrt(1.0 - d * d);           // dome height
    vec2 dir = rel / max(length(rel), 1e-3);
    // Like a convex lens: the middle is magnified, the rim squeezes in the
    // picture from further out.
    float rimK = (1.0 - h) * (1.0 - h);
    float scaleK = mix(1.0, 0.7, uRefract) + rimK * 1.15 * uRefract;
    vec2 baseUv = (uLens + rel * scaleK) / uRes;
    float disp = uDisperse * rimK * 0.006;
    vec3 g;
    if (uFrost > 0.0) {
      vec3 acc = vec3(0.0);
      float k = uFrost * 0.012;
      for (int i = 0; i < 8; i++) {
        float a = float(i) * 0.785398;
        vec2 o = vec2(cos(a), sin(a)) * k * (0.5 + 0.5 * fract(float(i) * 0.618));
        acc += vec3(img(baseUv + o + dir * disp).r, img(baseUv + o).g, img(baseUv + o - dir * disp).b);
      }
      g = acc / 8.0;
    } else {
      g = vec3(img(baseUv + dir * disp).r, img(baseUv).g, img(baseUv - dir * disp).b);
    }
    g = mix(g, g * uTint + uTint * 0.08, uTintAmt);
    // Light from the top left: a tight highlight and a broad sheen.
    vec3 n = normalize(vec3(q, h * 1.4));
    vec3 l = normalize(vec3(-0.45, 0.6, 0.65));
    float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 48.0);
    float sheen = pow(max(dot(n, l), 0.0), 3.0) * 0.12;
    float rim = smoothstep(0.86, 0.995, d);
    float inner = smoothstep(0.995, 0.9, d) * smoothstep(0.75, 0.97, d);
    g += vec3(1.0) * (spec * 0.9 + sheen) + vec3(1.0) * rim * 0.22 * (0.6 + 0.4 * q.y) - inner * 0.06;
    float edge = smoothstep(1.0, 0.985, d);
    col = mix(col, g, edge);
  }
  col = mix(vec3(0.07), col, uReady);
  gl_FragColor = vec4(col, 1.0);
}`;

const GlassLens = ({ image = DEFAULT_IMAGE, size = 9, refraction = 0.7, dispersion = 1, frost = 0, tint = "#ffffff", tintAmount = 0, stretch = 1, idle = true, height = "28rem", className = "", children }) => {
    const wrap = useRef(null);
    const live = useRef({});
    live.current = { size, refraction, dispersion, frost, tint, tintAmount, stretch, idle };

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        renderer.outputColorSpace = SRGBColorSpace;
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", touchAction: "none" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uTex: { value: null },
            uRes: { value: new Vector2(1, 1) },
            uCover: { value: new Vector2(1, 1) },
            uReady: { value: 0 },
            uLens: { value: new Vector2() },
            uRadius: { value: 100 },
            uStretch: { value: new Vector2(1, 1) },
            uAngle: { value: 0 },
            uRefract: { value: 0.7 },
            uDisperse: { value: 1 },
            uFrost: { value: 0 },
            uTint: { value: new Color(1, 1, 1) },
            uTintAmt: { value: 0 },
        };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false });
        const geometry = new PlaneGeometry(2, 2);
        scene.add(new Mesh(geometry, material));

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const view = { w: 1, h: 1, aspect: 1, imgAspect: 1 };
        // Lens state in CSS pixels, y measured from the bottom like gl_FragCoord.
        const lens = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, sx: 1, sy: 1, angle: 0, placed: false };
        const pointer = { inside: false, dragging: false, lastMove: 0 };
        let raf = 0;
        let last = 0;
        let time = 0;
        let visible = true;
        let readyAt = 0;

        const cover = () => {
            const a = view.aspect;
            const ia = view.imgAspect;
            u.uCover.value.set(ia > a ? a / ia : 1, ia > a ? 1 : ia / a);
        };
        new TextureLoader().setCrossOrigin("anonymous").load(image, (t) => {
            t.colorSpace = SRGBColorSpace;
            u.uTex.value = t;
            view.imgAspect = t.image.width / t.image.height;
            cover();
            readyAt = performance.now();
            start();
        });

        const fit = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            if (!width || !hh) return;
            view.w = width;
            view.h = hh;
            view.aspect = width / hh;
            renderer.setSize(width, hh, false);
            u.uRes.value.set(width * dpr, hh * dpr);
            cover();
            if (!lens.placed) {
                lens.x = lens.tx = width * 0.5;
                lens.y = lens.ty = hh * 0.5;
                lens.placed = true;
            }
            start();
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt;
            // Idle drift when nobody is steering it.
            if (o.idle && !pointer.inside && !pointer.dragging && !reduced && now - pointer.lastMove > 900) {
                lens.tx = view.w * (0.5 + 0.28 * Math.sin(time * 0.45));
                lens.ty = view.h * (0.5 + 0.22 * Math.sin(time * 0.7 + 1.2));
            }
            // Spring toward the target (slightly underdamped for a liquid feel).
            const k = reduced ? 400 : 140;
            const c = 2 * Math.sqrt(k) * 0.82;
            lens.vx += (k * (lens.tx - lens.x) - c * lens.vx) * dt;
            lens.vy += (k * (lens.ty - lens.y) - c * lens.vy) * dt;
            lens.x += lens.vx * dt;
            lens.y += lens.vy * dt;
            const speed = Math.hypot(lens.vx, lens.vy);
            const goal = 1 + Math.min(0.32, speed / 2600) * o.stretch;
            lens.sx += (goal - lens.sx) * (1 - Math.exp(-dt / 0.08));
            lens.sy = 1 / Math.sqrt(lens.sx);
            if (speed > 30) {
                const want = Math.atan2(lens.vy, lens.vx);
                let delta = want - lens.angle;
                delta = Math.atan2(Math.sin(delta), Math.cos(delta));
                lens.angle += delta * (1 - Math.exp(-dt / 0.06));
            }

            // size is in rem; never more than ~40% of the short side.
            const r = Math.min(Math.min(view.w, view.h) * 0.4, o.size * 16);
            u.uRadius.value = r * dpr;
            u.uLens.value.set(lens.x * dpr, (view.h - lens.y) * dpr);
            u.uStretch.value.set(lens.sx, lens.sy);
            u.uAngle.value = -lens.angle;
            u.uRefract.value = o.refraction;
            u.uDisperse.value = o.dispersion;
            u.uFrost.value = o.frost;
            u.uTint.value.set(o.tint);
            u.uTintAmt.value = o.tintAmount;
            u.uReady.value = readyAt ? Math.min(1, (now - readyAt) / 500) : 0;
            renderer.render(scene, camera);

            const moving = speed > 0.5 || Math.abs(lens.tx - lens.x) > 0.3 || Math.abs(lens.ty - lens.y) > 0.3 || Math.abs(lens.sx - 1) > 0.002;
            const idling = o.idle && !pointer.inside && !reduced;
            if (visible && (moving || idling || u.uReady.value < 1)) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        function start() {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        }

        const local = (e) => {
            const r = el.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onMove = (e) => {
            if (e.pointerType === "touch" && !pointer.dragging) return;
            [lens.tx, lens.ty] = local(e);
            pointer.inside = true;
            pointer.lastMove = performance.now();
            start();
        };
        const onDown = (e) => {
            if (e.pointerType !== "touch") return;
            e.preventDefault();
            pointer.dragging = true;
            el.setPointerCapture(e.pointerId);
            [lens.tx, lens.ty] = local(e);
            start();
        };
        const onUp = () => {
            pointer.dragging = false;
            pointer.lastMove = performance.now();
        };
        const onLeave = (e) => {
            if (e.pointerType === "touch") return;
            pointer.inside = false;
            pointer.lastMove = performance.now();
            start();
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
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
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointercancel", onUp);
            el.removeEventListener("pointerleave", onLeave);
            u.uTex.value?.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
    }, [image]);

    return (
        <div ref={wrap} className={`relative w-full cursor-none select-none overflow-hidden bg-[#111] ${className}`} style={{ height }}>
            {children && <div className="pointer-events-none relative z-10 h-full w-full">{children}</div>}
        </div>
    );
};

export default GlassLens;
