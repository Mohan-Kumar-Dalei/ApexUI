import React, { useEffect, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from "three";

/*
 * Galaxy 3D: a spiral galaxy of glowing stars that slowly turns, tilted so
 * you see its arms in depth. Colors blend from a hot core to cool arm tips,
 * and the camera drifts with the pointer for a soft parallax. One draw call;
 * the spin runs in the shader, so the CPU does almost nothing per frame.
 * Put your content on top as children.
 */

const VERT = `
attribute float aSize; attribute vec3 aColor; attribute float aRadius; attribute float aAngle; attribute float aHeight;
uniform float uTime; uniform float uSpeed; uniform float uDpr; uniform float uSize;
varying vec3 vColor;
void main(){
  // Inner stars orbit faster than outer ones.
  float a = aAngle + uTime * uSpeed * (0.6 / (0.35 + aRadius));
  vec3 p = vec3(cos(a) * aRadius, aHeight, sin(a) * aRadius);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = aSize * uSize * uDpr * (18. / -mv.z);
  gl_Position = projectionMatrix * mv;
  vColor = aColor;
}`;

const FRAG = `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = pow(smoothstep(.5, 0., d), 1.8);
  gl_FragColor = vec4(vColor * a * 1.35, a);
}`;

const Galaxy3D = ({ count = 30000, arms = 4, spin = 1.2, colors = ["#fde68a", "#a78bfa", "#22d3ee"], speed = 1, starSize = 1, tilt = 0.9, height = "100%", children, className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ speed, starSize });
    opts.current = { speed, starSize };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        renderer.setPixelRatio(dpr);
        Object.assign(renderer.domElement.style, { display: "block", position: "absolute", inset: "0", width: "100%", height: "100%" });
        el.appendChild(renderer.domElement);
        const scene = new Scene();
        const camera = new PerspectiveCamera(55, 1, 0.1, 100);

        const radius = new Float32Array(count);
        const angle = new Float32Array(count);
        const heightArr = new Float32Array(count);
        const sizes = new Float32Array(count);
        const cols = new Float32Array(count * 3);
        const inner = new Color(colors[0]);
        const mid = new Color(colors[1] ?? colors[0]);
        const outer = new Color(colors[2] ?? colors[1] ?? colors[0]);
        const c = new Color();
        const R = 5;
        for (let i = 0; i < count; i++) {
            const r = Math.pow(Math.random(), 1.6) * R;
            const arm = ((i % arms) / arms) * Math.PI * 2;
            // Scatter around the arm, tighter in the core.
            const scatter = (Math.random() - 0.5) * (0.35 + r * 0.12);
            radius[i] = r + (Math.random() - 0.5) * 0.25;
            angle[i] = arm + r * spin + scatter;
            heightArr[i] = (Math.random() - 0.5) * 0.35 * Math.exp(-r * 0.45);
            sizes[i] = 0.5 + Math.random() * 1.6 * (r < 0.6 ? 1.8 : 1);
            const t = r / R;
            if (t < 0.5) c.copy(inner).lerp(mid, t * 2);
            else c.copy(mid).lerp(outer, (t - 0.5) * 2);
            cols.set([c.r, c.g, c.b], i * 3);
        }
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
        geometry.setAttribute("aRadius", new BufferAttribute(radius, 1));
        geometry.setAttribute("aAngle", new BufferAttribute(angle, 1));
        geometry.setAttribute("aHeight", new BufferAttribute(heightArr, 1));
        geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
        geometry.setAttribute("aColor", new BufferAttribute(cols, 3));
        geometry.boundingSphere = null;
        const uniforms = { uTime: { value: 0 }, uSpeed: { value: speed }, uDpr: { value: dpr }, uSize: { value: starSize } };
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending });
        const points = new Points(geometry, material);
        points.frustumCulled = false;
        points.rotation.x = tilt;
        scene.add(points);

        const resize = () => {
            const { width, height: h } = el.getBoundingClientRect();
            if (!width || !h) return;
            renderer.setSize(width, h, false);
            camera.aspect = width / h;
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
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let raf = 0;
        let last = performance.now();
        const cam = { x: 0, y: 2.2 };
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible) return;
            uniforms.uTime.value += dt * (reduced ? 0.1 : 1);
            uniforms.uSpeed.value = opts.current.speed;
            uniforms.uSize.value = opts.current.starSize;
            cam.x += (pointer.x * 1.2 - cam.x) * 0.03;
            cam.y += (2.2 - pointer.y * 0.8 - cam.y) * 0.03;
            camera.position.set(cam.x, cam.y, 7.5);
            camera.lookAt(0, 0, 0);
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
        };
        // Star layout rebuilds on these; speed and size are read live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, arms, spin, tilt, colors.join(",")]);

    return (
        <div ref={mount} className={`relative isolate w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#0b1026_0%,#02030a_70%)] ${className}`} style={{ height }}>
            {children && <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center [&>*]:pointer-events-auto">{children}</div>}
        </div>
    );
};

export default Galaxy3D;
