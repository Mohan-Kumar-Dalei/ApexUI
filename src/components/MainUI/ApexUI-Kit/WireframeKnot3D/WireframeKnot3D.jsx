import React, { useEffect, useRef } from "react";
import { AdditiveBlending, Color, IcosahedronGeometry, LineBasicMaterial, LineSegments, PerspectiveCamera, Points, PointsMaterial, Scene, TorusKnotGeometry, WebGLRenderer, WireframeGeometry } from "three";

/*
 * Wireframe Knot 3D: a glowing wireframe shape (torus knot, sphere or
 * icosahedron) with bright points at its corners, slowly turning and
 * leaning toward the pointer. Additive lines make it glow without any
 * post-processing, so it stays light. Pauses off screen and frees the GPU
 * on unmount.
 */

const SHAPES = {
    knot: () => new TorusKnotGeometry(1, 0.32, 140, 14, 2, 3),
    sphere: () => new IcosahedronGeometry(1.35, 3),
    gem: () => new IcosahedronGeometry(1.4, 1),
};

const WireframeKnot3D = ({ shape = "knot", color = "#a3e635", pointColor = "#ffffff", speed = 1, interactive = true, size = 24, className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ color, pointColor, speed, interactive });
    opts.current = { color, pointColor, speed, interactive };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
        el.appendChild(renderer.domElement);
        const scene = new Scene();
        const camera = new PerspectiveCamera(40, 1, 0.1, 50);
        camera.position.z = 5.2;

        const geometry = (SHAPES[shape] ?? SHAPES.knot)();
        const wire = new WireframeGeometry(geometry);
        const lineMat = new LineBasicMaterial({ color: new Color(color), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false });
        const lines = new LineSegments(wire, lineMat);
        const pointMat = new PointsMaterial({ color: new Color(pointColor), size: 0.035, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false });
        const points = new Points(geometry, pointMat);
        const group = new Scene();
        group.add(lines, points);
        scene.add(group);

        const resize = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
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
        const onLeave = () => {
            pointer.x = 0;
            pointer.y = 0;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let raf = 0;
        let last = performance.now();
        let spin = 0;
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible) return;
            const o = opts.current;
            spin += dt * 0.35 * o.speed * (reduced ? 0.15 : 1);
            const px = o.interactive ? pointer.y * 0.6 : 0;
            const py = o.interactive ? pointer.x * 0.8 : 0;
            group.rotation.x += (px + spin * 0.5 - group.rotation.x) * 0.06;
            group.rotation.y += (py + spin - group.rotation.y) * 0.06;
            lineMat.color.set(o.color);
            pointMat.color.set(o.pointColor);
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            geometry.dispose();
            wire.dispose();
            lineMat.dispose();
            pointMat.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Colors, speed and interaction are read live; only the shape rebuilds.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shape]);

    return <div ref={mount} aria-hidden="true" className={`relative touch-none ${className}`} style={{ width: `min(${size}rem, 90vw)`, aspectRatio: "1" }} />;
};

export default WireframeKnot3D;
