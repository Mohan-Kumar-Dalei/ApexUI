import React, { useEffect, useRef, useState } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from "three";

/*
 * Particle Morph: thousands of glowing particles that flow between shapes:
 * sphere, cube, torus, DNA helix and a wave. It morphs on a timer or when
 * you click, drifts with the pointer, and each particle takes a slightly
 * different path so the change looks like a swarm, not a snap. One draw
 * call; pauses off screen and frees the GPU on unmount.
 */

const SHAPES = {
    sphere: (i, n) => {
        // Fibonacci sphere: even spacing.
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = i * 2.399963;
        return [Math.cos(t) * r * 1.6, y * 1.6, Math.sin(t) * r * 1.6];
    },
    cube: () => {
        const s = 1.25;
        const p = [(Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s];
        p[Math.floor(Math.random() * 3)] = Math.sign(Math.random() - 0.5) * s;
        return p;
    },
    torus: () => {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 1.3;
        const r = 0.45;
        return [(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)];
    },
    helix: (i, n) => {
        const t = (i / n) * Math.PI * 8;
        const y = (i / n) * 3.4 - 1.7;
        const strand = i % 3;
        if (strand === 2) {
            // Rungs between the two strands.
            const k = Math.random();
            const a = Math.round(t / 0.6) * 0.6;
            return [Math.cos(a) * 0.8 * (1 - 2 * k), y, Math.sin(a) * 0.8 * (1 - 2 * k)];
        }
        const a = t + strand * Math.PI;
        return [Math.cos(a) * 0.8, y, Math.sin(a) * 0.8];
    },
    wave: (i, n) => {
        const side = Math.ceil(Math.sqrt(n));
        const x = ((i % side) / side) * 4 - 2;
        const z = (Math.floor(i / side) / side) * 4 - 2;
        return [x, Math.sin(x * 2) * Math.cos(z * 2) * 0.35, z];
    },
};

const VERT = `
attribute float aSeed;
uniform float uTime; uniform float uSize; uniform float uDpr;
varying float vSeed;
void main(){
  vSeed = aSeed;
  vec3 p = position;
  p += 0.012 * vec3(sin(uTime * 1.3 + aSeed * 30.), cos(uTime * 1.1 + aSeed * 20.), sin(uTime * .9 + aSeed * 40.));
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = uSize * uDpr * (0.6 + aSeed * 0.8) * (11. / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform vec3 uC1; uniform vec3 uC2;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .0, d) * .85;
  vec3 col = mix(uC1, uC2, vSeed);
  gl_FragColor = vec4(col * a, a);
}`;

const ORDER = ["sphere", "cube", "torus", "helix", "wave"];

const ParticleMorph = ({ shapes = ORDER, count = 6000, colors = ["#a3e635", "#22d3ee"], interval = 3500, pointSize = 3, autoPlay = true, height = 26, className = "" }) => {
    const mount = useRef(null);
    const api = useRef(null);
    const [index, setIndex] = useState(0);
    const list = shapes.filter((s) => SHAPES[s]);
    const opts = useRef({ colors, pointSize });
    opts.current = { colors, pointSize };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);
        el.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";
        const scene = new Scene();
        const camera = new PerspectiveCamera(40, 1, 0.1, 50);
        camera.position.z = 6;

        const n = count;
        const pos = new Float32Array(n * 3);
        const seeds = new Float32Array(n);
        const targets = list.map((s) => {
            const arr = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) arr.set(SHAPES[s](i, n), i * 3);
            return arr;
        });
        pos.set(targets[0]);
        for (let i = 0; i < n; i++) seeds[i] = Math.random();
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(pos, 3));
        geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
        const uniforms = { uTime: { value: 0 }, uSize: { value: pointSize }, uDpr: { value: dpr }, uC1: { value: new Color(colors[0]) }, uC2: { value: new Color(colors[1] ?? colors[0]) } };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending });
        const points = new Points(geometry, material);
        scene.add(points);

        const resize = () => {
            const { width, height: h } = el.getBoundingClientRect();
            if (!width || !h) return;
            renderer.setSize(width, h, false);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            camera.aspect = width / h;
            // Keep the shape in frame on narrow screens.
            camera.position.z = width / h < 1 ? 6 / Math.max(0.55, width / h) : 6;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const pointer = { x: 0, y: 0 };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        };
        el.addEventListener("pointermove", onMove);
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let target = targets[0];
        // Per-particle speed so the swarm flows rather than snapping.
        const rate = new Float32Array(n);
        for (let i = 0; i < n; i++) rate[i] = 0.025 + seeds[i] * 0.05;
        api.current = { go: (k) => (target = targets[((k % targets.length) + targets.length) % targets.length]) };

        let raf = 0;
        let last = performance.now();
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible) return;
            uniforms.uTime.value += dt;
            uniforms.uSize.value = opts.current.pointSize;
            uniforms.uC1.value.set(opts.current.colors[0]);
            uniforms.uC2.value.set(opts.current.colors[1] ?? opts.current.colors[0]);
            for (let i = 0; i < n * 3; i++) pos[i] += (target[i] - pos[i]) * rate[(i / 3) | 0] * (dt * 60);
            geometry.attributes.position.needsUpdate = true;
            points.rotation.y += dt * 0.15;
            points.rotation.x += (pointer.y * 0.4 - points.rotation.x) * 0.04;
            points.rotation.z += (-pointer.x * 0.15 - points.rotation.z) * 0.04;
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
            api.current = null;
        };
        // Rebuild only when the particle set changes; colors and size are live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, list.join(",")]);

    useEffect(() => {
        api.current?.go(index);
    }, [index]);

    useEffect(() => {
        if (!autoPlay) return undefined;
        const id = setInterval(() => setIndex((i) => i + 1), interval);
        return () => clearInterval(id);
    }, [autoPlay, interval]);

    const current = list[((index % list.length) + list.length) % list.length];
    return (
        <div className={`relative flex w-full flex-col items-center gap-4 ${className}`}>
            <div ref={mount} className="w-full cursor-pointer touch-none" style={{ height: `${height}rem` }} onClick={() => setIndex((i) => i + 1)} aria-hidden="true" />
            <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Shape">
                {list.map((s, i) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-pressed={current === s}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${current === s ? "text-black" : "opacity-60 hover:opacity-100"}`}
                        style={current === s ? { background: colors[0] } : undefined}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ParticleMorph;
