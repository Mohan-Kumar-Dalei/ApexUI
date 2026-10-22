import React, { useEffect, useRef } from "react";
import { Color, DoubleSide, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from "three";

/*
 * Retro Grid 3D: a synthwave landscape. Glowing grid lines run over rolling
 * hills that scroll toward you, with a flat road down the middle and a
 * striped sun on the horizon. Two planes and two small shaders, so it's
 * cheap to run as a hero background. Put your content on top as children.
 */

const NOISE = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y); }`;

const GROUND_VERT = `
uniform float uTime; uniform float uSpeed; uniform float uHeight;
varying vec2 vGrid; varying float vDepth; varying float vH;
${NOISE}
void main(){
  vec3 p = position;
  float z = p.y - uTime * uSpeed;           // plane is rotated, so y is depth
  float road = smoothstep(1.2, 3.2, abs(p.x)); // flat strip in the middle
  float h = (noise(vec2(p.x * .35, z * .35)) * .7 + noise(vec2(p.x * .9, z * .9)) * .3) * uHeight * road;
  p.z += h;
  vH = h / max(uHeight, .001);
  vGrid = vec2(p.x, z);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const GROUND_FRAG = `
uniform vec3 uLine; uniform vec3 uGround; uniform float uFog;
varying vec2 vGrid; varying float vDepth; varying float vH;
void main(){
  vec2 g = abs(fract(vGrid) - .5) / fwidth(vGrid);
  float line = 1. - min(min(g.x, g.y), 1.);
  vec3 col = mix(uGround, uGround * 1.6, vH);
  col += uLine * line * 1.4;
  float fog = smoothstep(uFog * .25, uFog, vDepth);
  gl_FragColor = vec4(col, 1. - fog);
}`;

const SUN_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const SUN_FRAG = `
uniform vec3 uTop; uniform vec3 uBottom; uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 c = vUv - .5;
  float d = length(c);
  float disc = smoothstep(.5, .49, d);
  // Horizontal gaps in the lower half that widen toward the bottom and drift down.
  float y = vUv.y;
  float t = clamp((.55 - y) / .55, 0., 1.);
  float gap = y < .55 ? step(1. - t * .75, fract(y * 16. + uTime * .3)) : 0.;
  vec3 col = mix(uBottom, uTop, y);
  float glow = smoothstep(.75, .3, d) * .35;
  float a = disc * (1. - gap);
  gl_FragColor = vec4(col * (a + glow), a + glow * .6);
}`;

const RetroGrid3D = ({ lineColor = "#e879f9", groundColor = "#0b0618", sunColors = ["#fde047", "#f43f5e"], skyColors = ["#1e0b3a", "#05020d"], speed = 1.2, hills = 1.4, showSun = true, height = "100%", children, className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ lineColor, groundColor, sunColors, speed, hills });
    opts.current = { lineColor, groundColor, sunColors, speed, hills };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        el.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { display: "block", position: "absolute", inset: "0" });
        const scene = new Scene();
        const camera = new PerspectiveCamera(60, 1, 0.1, 80);
        camera.position.set(0, 1.25, 5);
        camera.lookAt(0, 1.0, -10);

        const gUniforms = { uTime: { value: 0 }, uSpeed: { value: speed }, uHeight: { value: hills }, uLine: { value: new Color(lineColor) }, uGround: { value: new Color(groundColor) }, uFog: { value: 34 } };
        const groundGeo = new PlaneGeometry(40, 60, 80, 120);
        const groundMat = new ShaderMaterial({ vertexShader: GROUND_VERT, fragmentShader: GROUND_FRAG, uniforms: gUniforms, transparent: true });
        const ground = new Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.z = -22;
        scene.add(ground);

        const sUniforms = { uTop: { value: new Color(sunColors[0]) }, uBottom: { value: new Color(sunColors[1] ?? sunColors[0]) }, uTime: { value: 0 } };
        const sunGeo = new PlaneGeometry(14, 14);
        const sunMat = new ShaderMaterial({ vertexShader: SUN_VERT, fragmentShader: SUN_FRAG, uniforms: sUniforms, transparent: true, depthWrite: false, side: DoubleSide });
        const sun = new Mesh(sunGeo, sunMat);
        sun.position.set(0, 4.2, -48);
        sun.visible = showSun;
        scene.add(sun);

        const resize = () => {
            const { width, height: h } = el.getBoundingClientRect();
            if (!width || !h) return;
            renderer.setSize(width, h, false);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            camera.aspect = width / h;
            camera.fov = width / h < 0.8 ? 75 : 60;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

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
            gUniforms.uTime.value += dt * (reduced ? 0.1 : 1);
            sUniforms.uTime.value = gUniforms.uTime.value;
            gUniforms.uSpeed.value = o.speed;
            gUniforms.uHeight.value = o.hills;
            gUniforms.uLine.value.set(o.lineColor);
            gUniforms.uGround.value.set(o.groundColor);
            sUniforms.uTop.value.set(o.sunColors[0]);
            sUniforms.uBottom.value.set(o.sunColors[1] ?? o.sunColors[0]);
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            groundGeo.dispose();
            groundMat.dispose();
            sunGeo.dispose();
            sunMat.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Colors, speed and hills are read live from opts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSun]);

    return (
        <div className={`relative isolate w-full overflow-hidden ${className}`} style={{ height, background: `linear-gradient(to bottom, ${skyColors[1] ?? skyColors[0]} 0%, ${skyColors[0]} 55%, ${groundColor} 100%)` }}>
            <div ref={mount} aria-hidden="true" className="absolute inset-0 -z-10" />
            {children && <div className="relative flex h-full w-full items-center justify-center">{children}</div>}
        </div>
    );
};

export default RetroGrid3D;
