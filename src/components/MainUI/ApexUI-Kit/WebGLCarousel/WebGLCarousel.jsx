import React, { useEffect, useRef, useState } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";

/*
 * WebGL Carousel: images stand on a full 360° ring drawn with OGL, seen from
 * slightly above. Drag, swipe or use a sideways scroll to spin it; let go and it settles on the nearest image.
 * Fast spins ripple the images and the far side of the ring dims.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (name) => `${IK}/${name}?tr=f-jpg,q-80,w-640`;

const DEFAULT_ITEMS = [
    { image: img("ironman.png"), title: "Iron Man" },
    { image: img("spiderman.png"), title: "Spider-Man" },
    { image: img("captainamerica.png"), title: "Captain America" },
    { image: img("hulk.png"), title: "Hulk" },
    { image: img("black-panther.png"), title: "Black Panther" },
    { image: img("doctorStrange.png"), title: "Doctor Strange" },
    { image: img("thanos.png"), title: "Thanos" },
    { image: img("png/spider-man.png"), title: "Miles" },
];

const cardVertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uSpeed;
uniform float uTime;
varying vec2 vUv;
void main() {
    vUv = uv;
    vec3 p = position;
    // Ripple across the image while the ring spins fast.
    p.z += sin(p.y * 3.1416 + uTime * 3.0) * uSpeed * 0.03 + sin(p.x * 3.1416) * abs(uSpeed) * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const cardFragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform float uRadius;
uniform float uFade;
uniform float uReady;
varying vec2 vUv;

float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
    vec2 ratio = vec2(
        min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
        min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
    );
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
    // Back faces show the image mirrored, so flip it to read the right way round.
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
    vec3 col = mix(vec3(0.1), texture2D(tMap, uv).rgb, uReady);
    vec2 p = (vUv - 0.5) * uPlaneSize;
    float d = roundedBox(p, uPlaneSize * 0.5, uRadius * min(uPlaneSize.x, uPlaneSize.y));
    float edge = 0.006 * min(uPlaneSize.x, uPlaneSize.y);
    float alpha = 1.0 - smoothstep(-edge, edge, d);
    gl_FragColor = vec4(col * uFade, alpha);
}
`;

const WebGLCarousel = ({
    items = DEFAULT_ITEMS,
    height = "30rem",
    tilt = 3,
    radiusScale = 0.83,
    autoRotate = 6,
    borderRadius = 0.06,
    wheel = true,
    showTitle = true,
    className = "",
}) => {
    const containerRef = useRef(null);
    const opts = useRef(null);
    opts.current = { tilt, radiusScale, autoRotate, borderRadius, wheel };
    const [active, setActive] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, antialias: true });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
        container.prepend(gl.canvas);

        const camera = new Camera(gl, { fov: 35 });
        const scene = new Transform();
        const ring = new Transform();
        ring.setParent(scene);
        const geometry = new Plane(gl, { widthSegments: 20, heightSegments: 8 });
        const count = Math.max(items.length, 1);
        const W = 1;
        const H = W / 0.75;
        const step = (Math.PI * 2) / count;

        const meshes = items.map((item) => {
            const texture = new Texture(gl, { generateMipmaps: true });
            const program = new Program(gl, {
                vertex: cardVertex,
                fragment: cardFragment,
                transparent: true,
                cullFace: null,
                uniforms: {
                    tMap: { value: texture },
                    uImageSize: { value: [1, 1] },
                    uPlaneSize: { value: [W, H] },
                    uRadius: { value: opts.current.borderRadius },
                    uFade: { value: 1 },
                    uReady: { value: 0 },
                    uSpeed: { value: 0 },
                    uTime: { value: 0 },
                },
            });
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                texture.image = image;
                program.uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight];
                program.uniforms.uReady.value = 1;
            };
            image.src = item.image;
            const mesh = new Mesh(gl, { geometry, program });
            mesh.scale.set(W, H, 1);
            mesh.setParent(ring);
            return mesh;
        });


        let radius = 1;
        let cssWidth = 1;
        const layout = () => {
            const { width, height: h } = container.getBoundingClientRect();
            cssWidth = Math.max(1, width);
            renderer.setSize(cssWidth, Math.max(1, h));
            camera.perspective({ aspect: cssWidth / Math.max(1, h) });
            radius = Math.max((count * W * 1.18) / (Math.PI * 2), W * 1.1) * opts.current.radiusScale;
            meshes.forEach((m, i) => {
                const a = i * step;
                m.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
                m.rotation.y = a;
            });
            // Pull the camera back until the whole ring fits.
            const t = (opts.current.tilt * Math.PI) / 180;
            const half = Math.tan(((camera.fov / 2) * Math.PI) / 180);
            const needW = (radius + W * 0.6) / (half * camera.aspect);
            const needH = (H * 0.62 + radius * Math.sin(t)) / half;
            // The front card sits a radius closer to the camera, so keep that much extra room.
            const dist = Math.max(needW, needH) * 0.8 + radius * 0.9;
            camera.position.set(0, Math.sin(t) * dist, Math.cos(t) * dist);
            camera.lookAt([0, 0, 0]);
        };

        const s = { angle: 0, target: 0, dragging: false, startX: 0, startTarget: 0, moved: false, hover: false };
        let raf = 0;
        let last = performance.now();
        let time = 0;
        let lastActive = -1;
        let visible = true;

        const update = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            time += dt;
            const o = opts.current;
            if (!s.dragging && !s.hover && !reduced && o.autoRotate) s.target -= ((o.autoRotate * Math.PI) / 180) * dt;
            const prev = s.angle;
            s.angle += (s.target - s.angle) * (reduced ? 1 : 0.08);
            const speed = dt ? (s.angle - prev) / dt / step : 0;
            ring.rotation.y = s.angle;

            let nearest = 0;
            let best = -Infinity;
            meshes.forEach((mesh, i) => {
                const facing = Math.cos(i * step + s.angle);
                mesh.program.uniforms.uFade.value = 0.28 + 0.72 * ((facing + 1) / 2) ** 1.6;
                mesh.program.uniforms.uSpeed.value = Math.max(-2, Math.min(2, speed));
                mesh.program.uniforms.uTime.value = time;
                mesh.program.uniforms.uRadius.value = o.borderRadius;
                if (facing > best) {
                    best = facing;
                    nearest = i;
                }
            });
            if (nearest !== lastActive) {
                lastActive = nearest;
                setActive(nearest);
            }
            renderer.render({ scene, camera });
        };

        const loop = (now) => {
            update(now);
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (raf || !visible) return;
            last = performance.now();
            raf = requestAnimationFrame(loop);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const snap = () => (s.target = Math.round(s.target / step) * step);
        const anglePerPx = () => (Math.PI * 1.1) / cssWidth;
        const onDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            s.dragging = true;
            s.moved = false;
            s.startX = e.clientX;
            s.startTarget = s.target;
        };
        const onMove = (e) => {
            if (!s.dragging) return;
            const dx = e.clientX - s.startX;
            if (Math.abs(dx) > 4) s.moved = true;
            // Drag right → the front of the ring moves right.
            s.target = s.startTarget + dx * anglePerPx();
        };
        const onUp = (e) => {
            if (!s.dragging) return;
            s.dragging = false;
            if (s.moved) {
                s.target += (s.target - s.angle) * 0.5;
                snap();
                return;
            }
            // A click on the left or right half brings that neighbour forward.
            const rect = container.getBoundingClientRect();
            const side = (e.clientX - rect.left) / rect.width - 0.5;
            if (Math.abs(side) > 0.15) s.target += side > 0 ? -step : step;
            snap();
        };
        let wheelTimer = 0;
        const onWheel = (e) => {
            const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (!opts.current.wheel || (!sideways && !e.shiftKey)) return;
            e.preventDefault();
            s.target -= (sideways ? e.deltaX : e.deltaY) * anglePerPx() * 0.5;
            clearTimeout(wheelTimer);
            wheelTimer = setTimeout(snap, 160);
        };
        const onEnter = (e) => (s.hover = e.pointerType === "mouse");
        const onLeave = () => (s.hover = false);

        container.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        container.addEventListener("pointerenter", onEnter);
        container.addEventListener("pointerleave", onLeave);
        container.addEventListener("wheel", onWheel, { passive: false });

        const ro = new ResizeObserver(layout);
        ro.observe(container);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(container);
        layout();
        start();

        // Re-layout when tilt or radius change.
        const relayout = setInterval(() => {
            if (s.lastTilt !== opts.current.tilt || s.lastRadius !== opts.current.radiusScale) {
                s.lastTilt = opts.current.tilt;
                s.lastRadius = opts.current.radiusScale;
                layout();
            }
        }, 150);

        return () => {
            stop();
            clearInterval(relayout);
            clearTimeout(wheelTimer);
            ro.disconnect();
            io.disconnect();
            container.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            container.removeEventListener("pointerenter", onEnter);
            container.removeEventListener("pointerleave", onLeave);
            container.removeEventListener("wheel", onWheel);
            gl.canvas.remove();
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
        // Items rebuild the scene; other props are read live from opts.
    }, [items]);

    return (
        <div className={`flex w-full flex-col items-center ${className}`}>
            <div
                ref={containerRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="WebGL carousel"
                className="relative w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
                style={{ height }}
            />
            {showTitle && (
                <p className="mt-1 text-[0.95rem] font-semibold" aria-live="polite">
                    {items[active]?.title}
                    <span className="ml-2 text-[0.75rem] font-normal opacity-50">
                        {active + 1} / {items.length}
                    </span>
                </p>
            )}
        </div>
    );
};

export default WebGLCarousel;
