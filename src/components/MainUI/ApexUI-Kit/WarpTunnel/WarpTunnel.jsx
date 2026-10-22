import React, { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";

/*
 * Warp Tunnel: a hyperspace tunnel drawn entirely in one fragment shader.
 * Glowing rings and streaks rush toward you and the tunnel bends toward the
 * pointer. Hold the mouse (or touch) to boost into warp speed. Cheap: one
 * full-screen triangle pair, no geometry to update. Content goes on top.
 */

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

const FRAG = `
uniform float uTime; uniform vec2 uRes; uniform vec2 uBend; uniform float uBoost;
uniform vec3 uC1; uniform vec3 uC2; uniform float uDensity;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
void main(){
  vec2 p = (vUv - .5) * vec2(uRes.x / uRes.y, 1.);
  p -= uBend * .25 * length(p);                 // bend toward the pointer
  float r = length(p);
  float a = atan(p.y, p.x);
  float depth = .35 / max(r, .001) + uTime;    // tunnel coordinate
  // Rings rushing forward
  float rings = smoothstep(.92, 1., sin(depth * 6.2831 * .5 * uDensity) * .5 + .5);
  // Streaks: random angular slices that flicker along the tunnel
  float slice = floor(a / 6.2831 * 64.);
  float h = hash(vec2(slice, floor(depth * 2.)));
  float streak = step(.82, h) * smoothstep(.0, .8, fract(depth * 2.)) * (1. - fract(depth * 2.));
  float glow = (rings * .8 + streak * (1.2 + uBoost * 2.)) * smoothstep(.0, .25, r);
  vec3 col = mix(uC1, uC2, .5 + .5 * sin(a * 2. + depth * .6));
  float core = smoothstep(.5, .0, r) * (.25 + uBoost * .5);
  vec3 c = col * glow * (1.4 - r) + col * core;
  c *= smoothstep(1.2, .2, r);                 // vignette
  gl_FragColor = vec4(c, 1.);
}`;

const WarpTunnel = ({ colors = ["#a3e635", "#8b5cf6"], speed = 1, density = 1, interactive = true, height = "100%", children, className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ colors, speed, density, interactive });
    opts.current = { colors, speed, density, interactive };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        Object.assign(renderer.domElement.style, { display: "block", position: "absolute", inset: "0", width: "100%", height: "100%" });
        el.appendChild(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
            uTime: { value: 0 },
            uRes: { value: new Vector2(1, 1) },
            uBend: { value: new Vector2(0, 0) },
            uBoost: { value: 0 },
            uC1: { value: new Color(colors[0]) },
            uC2: { value: new Color(colors[1] ?? colors[0]) },
            uDensity: { value: density },
        };
        const geometry = new PlaneGeometry(2, 2);
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
        scene.add(new Mesh(geometry, material));

        const resize = () => {
            const { width, height: h } = el.getBoundingClientRect();
            if (!width || !h) return;
            renderer.setSize(width, h, false);
            uniforms.uRes.value.set(width, h);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const target = { x: 0, y: 0, boost: 0 };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            target.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        };
        const onDown = () => (target.boost = 1);
        const onUp = () => (target.boost = 0);
        const onLeave = () => {
            target.x = 0;
            target.y = 0;
            target.boost = 0;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointerleave", onLeave);
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let raf = 0;
        let last = performance.now();
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible) return;
            const o = opts.current;
            const active = o.interactive ? target : { x: 0, y: 0, boost: 0 };
            uniforms.uBoost.value += (active.boost - uniforms.uBoost.value) * 0.05;
            uniforms.uTime.value += dt * o.speed * (reduced ? 0.15 : 1) * (1 + uniforms.uBoost.value * 3);
            uniforms.uBend.value.x += (active.x - uniforms.uBend.value.x) * 0.05;
            uniforms.uBend.value.y += (active.y - uniforms.uBend.value.y) * 0.05;
            uniforms.uC1.value.set(o.colors[0]);
            uniforms.uC2.value.set(o.colors[1] ?? o.colors[0]);
            uniforms.uDensity.value = o.density;
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointerleave", onLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Everything visual is read live from opts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={mount} className={`relative isolate w-full touch-none select-none overflow-hidden bg-black ${className}`} style={{ height }}>
            {children && <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center [&>*]:pointer-events-auto">{children}</div>}
        </div>
    );
};

export default WarpTunnel;
