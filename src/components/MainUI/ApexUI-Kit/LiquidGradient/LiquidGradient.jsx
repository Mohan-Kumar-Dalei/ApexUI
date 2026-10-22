import React, { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/*
 * Liquid Gradient: a slow, flowing four-color mesh gradient drawn by a single
 * OGL fragment shader on one full-screen triangle. The colors lean toward the
 * pointer, a light film grain keeps it from banding, and it pauses off screen.
 */

const hexToVec3 = (hex) => {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uScale;
uniform float uGrain;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
varying vec2 vUv;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * uScale;
    float t = uTime * 0.12;

    // Pull the field toward the pointer.
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * uScale;
    float md = length(p - m);
    p += (m - p) * uMouseStrength * 0.35 * exp(-md * md * 1.5);

    // Domain-warped noise: noise feeding noise gives the liquid folds.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.4));
    float n = fbm(p + 2.5 * r);

    vec3 col = mix(uColor1, uColor2, smoothstep(-0.4, 0.4, q.x));
    col = mix(col, uColor3, smoothstep(-0.3, 0.5, r.y));
    col = mix(col, uColor4, smoothstep(0.1, 0.7, n));

    col *= 1.0 - 0.25 * length(vUv - 0.5);
    float g = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * uGrain;

    gl_FragColor = vec4(col, 1.0);
}
`;

const LiquidGradient = ({
    children,
    className = "",
    containerClassName = "",
    colors = ["#1e1b4b", "#4f46e5", "#db2777", "#f97316"],
    speed = 1,
    scale = 1.6,
    grain = 0.06,
    mouseInteractive = true,
    quality = 1,
}) => {
    const containerRef = useRef(null);
    const programRef = useRef(null);
    const renderRef = useRef(() => {});
    const speedRef = useRef(speed);
    speedRef.current = speed;
    const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, strength: 0, target: 0 });

    useEffect(() => {
        const container = containerRef.current;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.5) * quality, antialias: false, alpha: false });
        const gl = renderer.gl;
        gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
        container.prepend(gl.canvas);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: [1, 1] },
                uMouse: { value: [0.5, 0.5] },
                uMouseStrength: { value: 0 },
                uScale: { value: scale },
                uGrain: { value: grain },
                uColor1: { value: hexToVec3(colors[0]) },
                uColor2: { value: hexToVec3(colors[1] ?? colors[0]) },
                uColor3: { value: hexToVec3(colors[2] ?? colors[0]) },
                uColor4: { value: hexToVec3(colors[3] ?? colors[0]) },
            },
        });
        programRef.current = program;
        const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

        let raf = 0;
        let last = performance.now();
        let time = 7; // start mid-flow so the first frame already looks liquid
        let visible = true;

        const render = () => renderer.render({ scene: mesh });
        renderRef.current = render;
        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            renderer.setSize(Math.max(1, width), Math.max(1, height));
            program.uniforms.uResolution.value = [Math.max(1, width), Math.max(1, height)];
            render();
        };

        const loop = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            time += dt * speedRef.current;
            const p = pointer.current;
            p.x += (p.tx - p.x) * 0.06;
            p.y += (p.ty - p.y) * 0.06;
            p.strength += (p.target - p.strength) * 0.05;
            program.uniforms.uTime.value = time;
            program.uniforms.uMouse.value = [p.x, p.y];
            program.uniforms.uMouseStrength.value = p.strength;
            render();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (reduced || raf || !visible) return;
            last = performance.now();
            raf = requestAnimationFrame(loop);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(container);
        program.uniforms.uTime.value = time;
        resize();
        start();

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            programRef.current = null;
            renderRef.current = () => {};
            gl.canvas.remove();
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
        // The renderer is rebuilt only when quality changes; other props update uniforms below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality]);

    useEffect(() => {
        const program = programRef.current;
        if (!program) return;
        program.uniforms.uScale.value = scale;
        program.uniforms.uGrain.value = grain;
        program.uniforms.uColor1.value = hexToVec3(colors[0]);
        program.uniforms.uColor2.value = hexToVec3(colors[1] ?? colors[0]);
        program.uniforms.uColor3.value = hexToVec3(colors[2] ?? colors[0]);
        program.uniforms.uColor4.value = hexToVec3(colors[3] ?? colors[0]);
        // Redraw now so a paused (reduced-motion) gradient shows the change too.
        renderRef.current();
    }, [colors, scale, grain]);

    const onPointerMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        pointer.current.tx = (e.clientX - rect.left) / rect.width;
        pointer.current.ty = 1 - (e.clientY - rect.top) / rect.height;
        pointer.current.target = 1;
    };
    const onPointerLeave = () => {
        pointer.current.target = 0;
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={mouseInteractive ? onPointerMove : undefined}
            onPointerLeave={onPointerLeave}
            className={`relative h-screen w-full overflow-hidden bg-[#0b0b14] ${containerClassName}`}
        >
            {children && <div className={`relative z-10 h-full w-full ${className}`}>{children}</div>}
        </div>
    );
};

export default LiquidGradient;
