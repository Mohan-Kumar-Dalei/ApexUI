import React, { useEffect, useRef } from "react";
import { Color, HalfFloatType, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, RGBAFormat, Scene, ShaderMaterial, Vector2, WebGLRenderer, WebGLRenderTarget } from "three";

/*
 * Fluid Cursor: a real-time fluid simulation that trails the pointer, drawn
 * in WebGL. Moving the cursor pushes coloured ink through the fluid; it
 * swirls (vorticity), spreads (pressure) and slowly fades. A click blows a
 * burst. It sits over its parent as a transparent layer and never blocks
 * clicks, so content underneath stays usable.
 *
 * Props: colors (cycled; a rainbow when empty), simResolution, dyeResolution,
 * dissipation (how fast the ink fades), velocityDissipation, curl (swirl),
 * splatRadius, splatForce, idle (soft splashes when nobody moves),
 * className, children.
 */

const BASE_VERT = `
uniform vec2 texelSize;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
void main(){
  vUv = uv;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const HEAD = `precision highp float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
`;

const SPLAT = `${HEAD}
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){
  vec2 p = vUv - point;
  p.x *= aspect;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
}`;

const ADVECT = `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 velTexel; uniform float dt; uniform float dissipation;
void main(){
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * velTexel;
  gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
}`;

const DIVERGENCE = `${HEAD}
uniform sampler2D uVelocity;
void main(){
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  // Walls: reflect velocity at the edges.
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const CURL = `${HEAD}
uniform sampler2D uVelocity;
void main(){
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const VORTICITY = `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main(){
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy + force * dt;
  gl_FragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`;

const SCALE = `${HEAD}
uniform sampler2D uTexture; uniform float value;
void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`;

const PRESSURE = `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main(){
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float div = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main(){
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
  gl_FragColor = vec4(vel, 0.0, 1.0);
}`;

// Shaded ink: a little light on the slopes of the dye gives it body.
const DISPLAY = `${HEAD}
uniform sampler2D uTexture; uniform vec2 dyeTexel;
void main(){
  vec3 c = texture2D(uTexture, vUv).rgb;
  vec3 lc = texture2D(uTexture, vUv - vec2(dyeTexel.x, 0.0)).rgb;
  vec3 rc = texture2D(uTexture, vUv + vec2(dyeTexel.x, 0.0)).rgb;
  vec3 tc = texture2D(uTexture, vUv + vec2(0.0, dyeTexel.y)).rgb;
  vec3 bc = texture2D(uTexture, vUv - vec2(0.0, dyeTexel.y)).rgb;
  float dx = length(rc) - length(lc);
  float dy = length(tc) - length(bc);
  vec3 n = normalize(vec3(dx, dy, length(dyeTexel)));
  float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  c *= diffuse;
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  gl_FragColor = vec4(c, a);
}`;

const hsvToRgb = (h, s, v) => {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    return [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q],
    ][i % 6];
};

const FluidCursor = ({ colors = [], simResolution = 128, dyeResolution = 1024, dissipation = 1.6, velocityDissipation = 1.2, curl = 18, splatRadius = 0.22, splatForce = 6000, idle = true, className = "", children }) => {
    const wrap = useRef(null);
    const live = useRef({});
    live.current = { colors, dissipation, velocityDissipation, curl, splatRadius, splatForce, idle };

    useEffect(() => {
        const el = wrap.current;
        const renderer = new WebGLRenderer({ alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "high-performance" });
        if (!renderer.capabilities.isWebGL2 && !renderer.extensions.get("OES_texture_half_float")) {
            renderer.dispose();
            return undefined;
        }
        renderer.setPixelRatio(1);
        renderer.autoClear = false;
        Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", pointerEvents: "none" });
        el.prepend(renderer.domElement);

        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const quad = new Mesh(new PlaneGeometry(2, 2));
        scene.add(quad);
        const texel = { value: new Vector2() };
        const mat = (frag, uniforms) => new ShaderMaterial({ vertexShader: BASE_VERT, fragmentShader: frag, uniforms: { texelSize: texel, ...uniforms }, depthTest: false, depthWrite: false });
        const m = {
            splat: mat(SPLAT, { uTarget: { value: null }, aspect: { value: 1 }, color: { value: new Color() }, point: { value: new Vector2() }, radius: { value: 0.01 } }),
            advect: mat(ADVECT, { uVelocity: { value: null }, uSource: { value: null }, velTexel: { value: new Vector2() }, dt: { value: 0.016 }, dissipation: { value: 1 } }),
            divergence: mat(DIVERGENCE, { uVelocity: { value: null } }),
            curl: mat(CURL, { uVelocity: { value: null } }),
            vorticity: mat(VORTICITY, { uVelocity: { value: null }, uCurl: { value: null }, curl: { value: 18 }, dt: { value: 0.016 } }),
            scale: mat(SCALE, { uTexture: { value: null }, value: { value: 0.8 } }),
            pressure: mat(PRESSURE, { uPressure: { value: null }, uDivergence: { value: null } }),
            gradient: mat(GRADIENT, { uPressure: { value: null }, uVelocity: { value: null } }),
            display: mat(DISPLAY, { uTexture: { value: null }, dyeTexel: { value: new Vector2() } }),
        };
        m.display.transparent = true;

        const target = (w, h) => new WebGLRenderTarget(w, h, { type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false, stencilBuffer: false });
        const double = (w, h) => {
            const d = { read: target(w, h), write: target(w, h), w, h };
            d.swap = () => ([d.read, d.write] = [d.write, d.read]);
            d.dispose = () => {
                d.read.dispose();
                d.write.dispose();
            };
            return d;
        };
        let fbo = null;
        const sizeFor = (res, w, h) => {
            const a = w / h;
            const min = Math.round(res);
            const max = Math.round(res * Math.max(a, 1 / a));
            return a > 1 ? [max, min] : [min, max];
        };
        const build = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return false;
            renderer.setSize(width, height, false);
            fbo?.all.forEach((t) => t.dispose());
            const [sw, sh] = sizeFor(simResolution, width, height);
            const [dw, dh] = sizeFor(Math.min(dyeResolution, Math.max(width, height)), width, height);
            const velocity = double(sw, sh);
            const dye = double(dw, dh);
            const pressure = double(sw, sh);
            const divergence = target(sw, sh);
            const curlT = target(sw, sh);
            fbo = { velocity, dye, pressure, divergence, curl: curlT, all: [velocity, dye, pressure, divergence, curlT], aspect: width / height };
            return true;
        };

        const pass = (material, out, w, h) => {
            texel.value.set(1 / w, 1 / h);
            quad.material = material;
            renderer.setRenderTarget(out);
            renderer.render(scene, camera);
        };

        const splat = (x, y, dx, dy, color) => {
            const o = live.current;
            const f = fbo;
            m.splat.uniforms.aspect.value = f.aspect;
            m.splat.uniforms.point.value.set(x, y);
            m.splat.uniforms.radius.value = (o.splatRadius / 100) * (f.aspect > 1 ? f.aspect : 1);
            m.splat.uniforms.uTarget.value = f.velocity.read.texture;
            m.splat.uniforms.color.value.setRGB(dx, dy, 0);
            pass(m.splat, f.velocity.write, f.velocity.w, f.velocity.h);
            f.velocity.swap();
            m.splat.uniforms.uTarget.value = f.dye.read.texture;
            m.splat.uniforms.color.value.setRGB(color[0], color[1], color[2]);
            pass(m.splat, f.dye.write, f.dye.w, f.dye.h);
            f.dye.swap();
        };

        let hue = Math.random();
        let pick = 0;
        const nextColor = (strength = 0.3) => {
            const list = live.current.colors;
            if (list?.length) {
                const c = new Color(list[pick++ % list.length]);
                return [c.r * strength, c.g * strength, c.b * strength];
            }
            hue = (hue + 0.07) % 1;
            return hsvToRgb(hue, 1, 1).map((v) => v * strength);
        };

        const step = (dt) => {
            const o = live.current;
            const f = fbo;
            const { velocity, dye, pressure } = f;
            // Swirl.
            m.curl.uniforms.uVelocity.value = velocity.read.texture;
            pass(m.curl, f.curl, velocity.w, velocity.h);
            m.vorticity.uniforms.uVelocity.value = velocity.read.texture;
            m.vorticity.uniforms.uCurl.value = f.curl.texture;
            m.vorticity.uniforms.curl.value = o.curl;
            m.vorticity.uniforms.dt.value = dt;
            pass(m.vorticity, velocity.write, velocity.w, velocity.h);
            velocity.swap();
            // Make it incompressible.
            m.divergence.uniforms.uVelocity.value = velocity.read.texture;
            pass(m.divergence, f.divergence, velocity.w, velocity.h);
            m.scale.uniforms.uTexture.value = pressure.read.texture;
            m.scale.uniforms.value.value = 0.8;
            pass(m.scale, pressure.write, pressure.w, pressure.h);
            pressure.swap();
            m.pressure.uniforms.uDivergence.value = f.divergence.texture;
            for (let i = 0; i < 20; i++) {
                m.pressure.uniforms.uPressure.value = pressure.read.texture;
                pass(m.pressure, pressure.write, pressure.w, pressure.h);
                pressure.swap();
            }
            m.gradient.uniforms.uPressure.value = pressure.read.texture;
            m.gradient.uniforms.uVelocity.value = velocity.read.texture;
            pass(m.gradient, velocity.write, velocity.w, velocity.h);
            velocity.swap();
            // Carry velocity and ink along.
            m.advect.uniforms.velTexel.value.set(1 / velocity.w, 1 / velocity.h);
            m.advect.uniforms.dt.value = dt;
            m.advect.uniforms.uVelocity.value = velocity.read.texture;
            m.advect.uniforms.uSource.value = velocity.read.texture;
            m.advect.uniforms.dissipation.value = o.velocityDissipation;
            pass(m.advect, velocity.write, velocity.w, velocity.h);
            velocity.swap();
            m.advect.uniforms.uVelocity.value = velocity.read.texture;
            m.advect.uniforms.uSource.value = dye.read.texture;
            m.advect.uniforms.dissipation.value = o.dissipation;
            pass(m.advect, dye.write, dye.w, dye.h);
            dye.swap();
        };

        const draw = () => {
            m.display.uniforms.uTexture.value = fbo.dye.read.texture;
            m.display.uniforms.dyeTexel.value.set(1 / fbo.dye.w, 1 / fbo.dye.h);
            texel.value.set(1 / fbo.dye.w, 1 / fbo.dye.h);
            quad.material = m.display;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
        };

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, inside: false, color: nextColor(), lastMove: 0 };
        let raf = 0;
        let last = 0;
        let visible = true;
        let nextIdle = 0;

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min((now - last) / 1000, 0.016) : 0.016;
            last = now;
            if (pointer.moved) {
                pointer.moved = false;
                splat(pointer.x, pointer.y, pointer.dx * o.splatForce, pointer.dy * o.splatForce, pointer.color);
            }
            // Idle: soft splashes from the edges so the space never looks empty.
            if (o.idle && now - pointer.lastMove > 2500 && now > nextIdle) {
                nextIdle = now + 1400 + Math.random() * 1200;
                const x = Math.random();
                const y = Math.random() * 0.6 + 0.2;
                const ang = Math.random() * Math.PI * 2;
                splat(x, y, Math.cos(ang) * 600, Math.sin(ang) * 600, nextColor(0.35));
            }
            step(dt);
            draw();
            if (visible) raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (!raf && visible && !reduced) {
                last = 0;
                raf = requestAnimationFrame(frame);
            }
        };

        // Listen on the window so the layer can sit over clickable content.
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) {
                pointer.inside = false;
                return;
            }
            const x = (e.clientX - r.left) / r.width;
            const y = 1 - (e.clientY - r.top) / r.height;
            if (!pointer.inside) {
                pointer.inside = true;
                pointer.x = x;
                pointer.y = y;
                return;
            }
            pointer.dx = (x - pointer.x) * (fbo.aspect < 1 ? fbo.aspect : 1);
            pointer.dy = (y - pointer.y) / (fbo.aspect > 1 ? fbo.aspect : 1);
            pointer.x = x;
            pointer.y = y;
            pointer.moved = Math.abs(pointer.dx) + Math.abs(pointer.dy) > 0;
            pointer.lastMove = performance.now();
            if (Math.random() < 0.08) pointer.color = nextColor();
        };
        const onDown = (e) => {
            const r = el.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
            const x = (e.clientX - r.left) / r.width;
            const y = 1 - (e.clientY - r.top) / r.height;
            const c = nextColor(0.6);
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2;
                splat(x, y, Math.cos(ang) * 1400, Math.sin(ang) * 1400, c);
            }
            pointer.lastMove = performance.now();
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });

        const ro = new ResizeObserver(() => {
            if (build()) start();
        });
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        if (build()) start();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            fbo?.all.forEach((t) => t.dispose());
            Object.values(m).forEach((x) => x.dispose());
            quad.geometry.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Resolutions rebuild the simulation; the rest is read live.
    }, [simResolution, dyeResolution]);

    return (
        <div ref={wrap} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export default FluidCursor;
