import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector2, Vector4, WebGLRenderer } from "three";
import { CloudSun, Compass, Home, Music2, Plus, Search, User } from "lucide-react";

/*
 * Liquid Glass: iOS style glass panels over a wallpaper, drawn in one WebGL
 * shader. Each panel bends the picture at its rounded edges, frosts it a
 * little inside, splits colours along the rim and catches a specular edge
 * light. Panels are draggable, wobble like jelly while they move, and melt
 * into each other when they get close. Content inside each panel is plain
 * HTML that rides along with it.
 *
 * Props: items ({ id, x, y, offset?, width, maxWidth?, height, radius, content }[],
 * up to 4; x / y place the centre as 0..1 of the box, offset nudges x in px,
 * a width of 1 or less is a share of the box width), children (shown under
 * the glass, e.g. hero text), image (wallpaper; a soft animated gradient when empty),
 * refraction, frost, chroma, vibrancy, tint, tintAmount, merge (px of liquid
 * blending),
 * draggable, height, className.
 */

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uDpr;
uniform sampler2D uTex; uniform float uHasTex; uniform vec2 uCover;
uniform vec4 uBox[4]; uniform float uRad[4]; uniform float uCount;
uniform float uRefract; uniform float uFrost; uniform float uChroma; uniform vec3 uTint; uniform float uTintAmt; uniform float uMerge;
uniform vec2 uLight; uniform float uVibrancy;

float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }

float scene(vec2 p){
  float d = 1e5;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uCount) break;
    float s = sdBox(p - uBox[i].xy, uBox[i].zw, uRad[i]);
    d = smin(d, s, max(uMerge, 0.001));
  }
  return d;
}

// Half-size (shorter side) of the panel closest to p, for a bevel that suits it.
float nearestSize(vec2 p){
  float best = 1e5; float size = 30.0;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uCount) break;
    float s = sdBox(p - uBox[i].xy, uBox[i].zw, uRad[i]);
    if (s < best) { best = s; size = min(uBox[i].z, uBox[i].w); }
  }
  return size;
}

// Default wallpaper: drifting colour blobs with fine stripes so the bending shows.
vec3 wallpaper(vec2 uv){
  float t = uTime * 0.06;
  vec2 a = vec2(0.25 + 0.15 * sin(t * 2.1), 0.3 + 0.2 * cos(t * 1.7));
  vec2 b = vec2(0.75 + 0.12 * cos(t * 1.3), 0.65 + 0.15 * sin(t * 2.3));
  vec2 c = vec2(0.5 + 0.25 * sin(t * 0.9 + 2.0), 0.15 + 0.1 * cos(t * 1.1));
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec3 col = vec3(0.06, 0.07, 0.12);
  col += vec3(1.0, 0.36, 0.42) * exp(-length((uv - a) * asp) * 3.2) * 0.95;
  col += vec3(0.25, 0.45, 1.0) * exp(-length((uv - b) * asp) * 2.8) * 0.95;
  col += vec3(1.0, 0.75, 0.25) * exp(-length((uv - c) * asp) * 3.6) * 0.8;
  float stripes = smoothstep(0.35, 0.5, abs(fract((uv.x * asp.x + uv.y) * 14.0) - 0.5));
  col *= 0.88 + 0.12 * stripes;
  return col;
}

vec3 bg(vec2 px){
  vec2 uv = px / uRes;
  if (uHasTex > 0.5) return texture2D(uTex, (uv - 0.5) * uCover + 0.5).rgb;
  return wallpaper(uv);
}

void main(){
  vec2 p = gl_FragCoord.xy;
  float d = scene(p);
  vec3 base = bg(p);

  // Two soft shadows under the glass: a tight contact one and a wide ambient one.
  float sd = scene(p + vec2(0.0, 6.0 * uDpr));
  float sd2 = scene(p + vec2(0.0, 18.0 * uDpr));
  float outside = step(0.0, d);
  vec3 col = base * (1.0 - outside * (0.22 * exp(-max(sd, 0.0) / (8.0 * uDpr)) + 0.18 * exp(-max(sd2, 0.0) / (34.0 * uDpr))));

  if (d < 1.5 * uDpr) {
    vec2 e = vec2(1.0, 0.0);
    vec2 n = normalize(vec2(scene(p + e.xy) - scene(p - e.xy), scene(p + e.yx) - scene(p - e.yx)) + 1e-6);
    // The rim curves over about half of the short side, like a real slab of glass.
    float bevel = clamp(nearestSize(p) * 0.55, 10.0 * uDpr, 34.0 * uDpr);
    float depth = clamp(-d / bevel, 0.0, 1.0);       // 0 at the rim, 1 on the flat top
    // A rounded edge profile: the steeper the surface, the more it bends light.
    float x = 1.0 - depth;
    float h = sqrt(max(1.0 - x * x, 0.0));
    float slope = x / max(h, 0.08);
    vec2 off = n * min(slope, 6.0) * uRefract * bevel * 0.32;
    vec3 g = vec3(0.0);
    float f = uFrost * 5.0 * uDpr;
    for (int i = 0; i < 9; i++) {
      float a = float(i) * 2.399;
      vec2 o = f > 0.0 ? vec2(cos(a), sin(a)) * f * sqrt(float(i) / 9.0) : vec2(0.0);
      vec2 q = p + off + o;
      vec2 ch = n * x * x * uChroma * 2.5 * uDpr;
      g += vec3(bg(q + ch).r, bg(q).g, bg(q - ch).b);
    }
    g /= 9.0;
    // Vibrancy: what shows through gets a little richer and brighter.
    float luma = dot(g, vec3(0.299, 0.587, 0.114));
    g = mix(vec3(luma), g, 1.0 + 0.35 * uVibrancy) * (1.0 + 0.07 * uVibrancy) + 0.02 * uVibrancy;
    g = mix(g, uTint, uTintAmt);

    // Light follows the pointer, like tilting a phone.
    vec2 L = normalize(uLight);
    float facing = max(dot(n, L), 0.0);
    float away = max(dot(n, -L), 0.0);
    // Fresnel: the curved edge reflects more than the flat top.
    g = mix(g, vec3(1.0), pow(x, 3.0) * 0.18);
    // A crisp specular line on the rim, strongest facing the light, with a
    // fainter bounce on the opposite edge.
    float line = smoothstep(1.6 * uDpr, 0.0, abs(d + 0.9 * uDpr));
    g += line * (0.75 * pow(facing, 1.5) + 0.32 * pow(away, 2.0) + 0.06);
    // A broad glint just inside the lit edge.
    g += smoothstep(0.55, 1.0, x) * pow(facing, 3.0) * 0.22;
    // Inner shadow along the far edge gives the slab some thickness.
    g *= 1.0 - smoothstep(0.6, 1.0, x) * pow(away, 1.5) * 0.18;
    float mask = smoothstep(0.75 * uDpr, -0.75 * uDpr, d);
    col = mix(col, g, mask);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const Tab = ({ icon: Icon, label, active }) => (
    <span className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[0.62rem] font-semibold ${active ? "bg-white/25 text-white" : "text-white/85"}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        {label}
    </span>
);

const DEFAULT_ITEMS = [
    {
        id: "bar",
        x: 0.5,
        y: 0.84,
        width: 300,
        height: 62,
        radius: 31,
        offset: -36,
        content: (
            <div className="flex h-full items-center gap-1 px-2">
                <Tab icon={Home} label="Home" active />
                <Tab icon={Compass} label="Explore" />
                <Tab icon={Music2} label="Music" />
                <Tab icon={User} label="Profile" />
            </div>
        ),
    },
    {
        id: "search",
        x: 0.5,
        y: 0.84,
        width: 62,
        height: 62,
        radius: 31,
        offset: 155,
        content: (
            <div className="grid h-full place-items-center text-white">
                <Search className="h-5 w-5" strokeWidth={2.4} />
            </div>
        ),
    },
    {
        id: "widget",
        x: 0.3,
        y: 0.3,
        width: 170,
        height: 150,
        radius: 34,
        content: (
            <div className="flex h-full flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs font-semibold text-white/85">
                    Cupertino <CloudSun className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-4xl font-light leading-none">24°</p>
                    <p className="mt-1 text-[0.7rem] text-white/80">Partly cloudy · H 27° L 18°</p>
                </div>
            </div>
        ),
    },
    {
        id: "add",
        x: 0.74,
        y: 0.3,
        width: 64,
        height: 64,
        radius: 22,
        content: (
            <div className="grid h-full place-items-center text-white">
                <Plus className="h-6 w-6" strokeWidth={2.4} />
            </div>
        ),
    },
];

const LiquidGlass = ({ items = DEFAULT_ITEMS, children, image, refraction = 1, frost = 0.2, chroma = 1, vibrancy = 1, tint = "#ffffff", tintAmount = 0.06, merge = 18, draggable = true, height = "32rem", className = "" }) => {
    const wrap = useRef(null);
    const panels = useRef([]);
    const live = useRef({});
    live.current = { refraction, frost, chroma, vibrancy, tint, tintAmount, merge, draggable };
    const list = items.slice(0, 4);

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        el.prepend(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const u = {
            uRes: { value: new Vector2(1, 1) },
            uTime: { value: 0 },
            uDpr: { value: dpr },
            uTex: { value: null },
            uHasTex: { value: 0 },
            uCover: { value: new Vector2(1, 1) },
            uBox: { value: Array.from({ length: 4 }, () => new Vector4()) },
            uRad: { value: [0, 0, 0, 0] },
            uCount: { value: 0 },
            uRefract: { value: 1 },
            uFrost: { value: 0.2 },
            uLight: { value: new Vector2(-0.6, 0.8) },
            uVibrancy: { value: 1 },
            uChroma: { value: 1 },
            uTint: { value: new Color(1, 1, 1) },
            uTintAmt: { value: 0.08 },
            uMerge: { value: 18 },
        };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false });
        const geometry = new PlaneGeometry(2, 2);
        scene.add(new Mesh(geometry, material));

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const view = { w: 1, h: 1, imgAspect: 1 };
        // Panel state in CSS px: target (tx, ty), spring position, velocity, press.
        const st = list.map((it) => ({ it, tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0, press: 0, moved: false, placed: false }));
        let raf = 0;
        let last = 0;
        let time = 0;
        let visible = true;
        let drag = null;
        const light = { x: -0.6, y: 0.8, on: false };

        const scaleFor = () => Math.min(1, (view.w - 24) / 360);
        const place = () => {
            const s = scaleFor();
            st.forEach((p) => {
                if (p.moved && p.placed) return;
                p.tx = view.w * p.it.x + (p.it.offset ?? 0) * s;
                p.ty = view.h * p.it.y;
                if (!p.placed) {
                    p.x = p.tx;
                    p.y = p.ty;
                    p.placed = true;
                }
            });
        };
        const cover = () => {
            const a = view.w / view.h;
            const ia = view.imgAspect;
            u.uCover.value.set(ia > a ? a / ia : 1, ia > a ? 1 : ia / a);
        };
        if (image) {
            new TextureLoader().setCrossOrigin("anonymous").load(image, (t) => {
                u.uTex.value = t;
                u.uHasTex.value = 1;
                view.imgAspect = t.image.width / t.image.height;
                cover();
                start();
            });
        }

        const fit = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            if (!width || !hh) return;
            view.w = width;
            view.h = hh;
            renderer.setSize(width, hh, false);
            u.uRes.value.set(width * dpr, hh * dpr);
            cover();
            place();
            start();
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            time += dt;
            const s = scaleFor();
            let busy = !u.uHasTex.value && !reduced; // the default wallpaper drifts
            st.forEach((p, i) => {
                // Jelly spring: a little underdamped so panels wobble into place.
                const k = 260;
                const c = 2 * Math.sqrt(k) * 0.62;
                p.vx += (k * (p.tx - p.x) - c * p.vx) * dt;
                p.vy += (k * (p.ty - p.y) - c * p.vy) * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.press += ((drag?.i === i ? 1 : 0) - p.press) * (1 - Math.exp(-dt / 0.08));
                const speed = Math.hypot(p.vx, p.vy);
                if (speed > 0.5 || Math.abs(p.tx - p.x) > 0.2 || Math.abs(p.ty - p.y) > 0.2 || Math.abs(p.press - (drag?.i === i ? 1 : 0)) > 0.01) busy = true;
                // Stretch along the motion, squash across it; grow a touch while held.
                const sx = 1 + Math.min(0.18, Math.abs(p.vx) / 4000) - Math.min(0.1, Math.abs(p.vy) / 6000);
                const sy = 1 + Math.min(0.18, Math.abs(p.vy) / 4000) - Math.min(0.1, Math.abs(p.vx) / 6000);
                const grow = 1 + p.press * 0.06;
                // A width of 1 or less is a share of the box (handy for nav bars).
                const baseW = Math.min(p.it.width <= 1 ? p.it.width * view.w : p.it.width * s, p.it.maxWidth ?? Infinity);
                const hw = (baseW * sx * grow) / 2;
                const hh = (p.it.height * s * sy * grow) / 2;
                u.uBox.value[i].set(p.x * dpr, (view.h - p.y) * dpr, hw * dpr, hh * dpr);
                u.uRad.value[i] = Math.min(p.it.radius * s * grow, hw, hh) * dpr;
                const node = panels.current[i];
                if (node) {
                    node.style.width = `${hw * 2}px`;
                    node.style.height = `${hh * 2}px`;
                    node.style.transform = `translate3d(${(p.x - hw).toFixed(2)}px, ${(p.y - hh).toFixed(2)}px, 0)`;
                }
            });
            u.uCount.value = st.length;
            // Ease the light toward the pointer direction from the centre.
            const lv = u.uLight.value;
            const lx = light.on ? light.x : -0.6;
            const ly = light.on ? light.y : 0.8;
            lv.set(lv.x + (lx - lv.x) * (1 - Math.exp(-dt / 0.25)), lv.y + (ly - lv.y) * (1 - Math.exp(-dt / 0.25)));
            if (Math.abs(lx - lv.x) + Math.abs(ly - lv.y) > 0.002) busy = true;
            u.uVibrancy.value = o.vibrancy;
            u.uTime.value = time;
            u.uRefract.value = o.refraction;
            u.uFrost.value = o.frost;
            u.uChroma.value = o.chroma;
            u.uTint.value.set(o.tint).convertLinearToSRGB();
            u.uTintAmt.value = o.tintAmount;
            u.uMerge.value = o.merge * dpr;
            renderer.render(scene, camera);
            if (visible && busy) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        function start() {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        }

        const local = (e) => {
            const r = el.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onDown = (e) => {
            if (!live.current.draggable) return;
            const node = e.target.closest("[data-glass]");
            if (!node) return;
            e.preventDefault();
            const i = Number(node.dataset.glass);
            const [x, y] = local(e);
            drag = { i, dx: st[i].tx - x, dy: st[i].ty - y };
            el.setPointerCapture(e.pointerId);
            start();
        };
        const onMove = (e) => {
            const [x, y] = local(e);
            // The light comes from where the pointer is, relative to the centre.
            const lx = x - view.w / 2;
            const ly = view.h / 2 - y;
            const len = Math.hypot(lx, ly) || 1;
            light.x = lx / len;
            light.y = ly / len;
            light.on = true;
            start();
            if (!drag) return;
            const p = st[drag.i];
            p.tx = Math.max(0, Math.min(view.w, x + drag.dx));
            p.ty = Math.max(0, Math.min(view.h, y + drag.dy));
            p.moved = true;
            start();
        };
        const onUp = () => {
            drag = null;
            start();
        };
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
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
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointercancel", onUp);
            u.uTex.value?.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Rebuild when the panels or the wallpaper change; the look is live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, list.length]);

    return (
        <div ref={wrap} className={`relative w-full select-none overflow-hidden bg-[#0f1220] ${draggable ? "touch-none" : ""} ${className}`} style={{ height }}>
            {children && <div className="pointer-events-none absolute inset-0 z-[5] [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{children}</div>}
            {list.map((it, i) => (
                <div
                    key={it.id ?? i}
                    ref={(e) => (panels.current[i] = e)}
                    data-glass={i}
                    className={`absolute left-0 top-0 z-10 overflow-hidden [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
                    style={{ borderRadius: it.radius }}
                >
                    {it.content}
                </div>
            ))}
        </div>
    );
};

export default LiquidGlass;
