import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- GLSL Shader Code ---
// Vertex shader (simple, just positions the plane)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader "Kinetic Threads" ke liye
const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform float uAmplitude;
    uniform float uDistance;
    uniform vec2 uMouse;
    uniform int u_line_count; // Line count ab uniform hai

    #define PI 3.1415926538

    const float u_line_width = 7.0;
    const float u_line_blur = 10.0;

    // Perlin Noise function for organic movement
    float Perlin2D(vec2 P) {
        vec2 Pi = floor(P);
        vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
        vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
        Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
        Pt += vec2(26.0, 161.0).xyxy;
        Pt *= Pt;
        Pt = Pt.xzxz * Pt.yyww;
        vec4 hash_x = fract(Pt * (1.0 / 951.135664));
        vec4 hash_y = fract(Pt * (1.0 / 642.949883));
        vec4 grad_x = hash_x - 0.49999;
        vec4 grad_y = hash_y - 0.49999;
        vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
            * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
        grad_results *= 1.4142135623730950;
        vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
            * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
        vec4 blend2 = vec4(blend, vec2(1.0 - blend));
        return dot(grad_results, blend2.zxzx * blend2.wwyy);
    }

    float pixel(float count, vec2 resolution) {
        return (1.0 / max(resolution.x, resolution.y)) * count;
    }

    // Function to draw a single animated line
    float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
        float split_offset = (perc * 0.4);
        float split_point = 0.1 + split_offset;

        float amplitude_normal = smoothstep(split_point, 0.7, st.x);
        float amplitude_strength = 0.5;
        float finalAmplitude = amplitude_normal * amplitude_strength
                                * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

        float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
        float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

        float xnoise = mix(
            Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
            Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
            st.x * 0.3
        );

        float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

        float line_start = smoothstep(
            y + (width / 2.0) + (u_line_blur * pixel(1.0, uResolution.xy) * blur),
            y,
            st.y
        );

        float line_end = smoothstep(
            y,
            y - (width / 2.0) - (u_line_blur * pixel(1.0, uResolution.xy) * blur),
            st.y
        );

        return clamp(
            (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
            0.0,
            1.0
        );
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float line_strength1 = 1.0;
        for (int i = 0; i < u_line_count; i++) {
            float p = float(i) / float(u_line_count);
            line_strength1 *= (1.0 - lineFn(
                uv,
                u_line_width * pixel(1.0, uResolution.xy) * (1.0 - p),
                p,
                (PI * 1.0) * p,
                uMouse,
                uTime,
                uAmplitude,
                uDistance
            ));
        }

        float line_strength2 = 1.0;
        vec2 mirroredUv = vec2(1.0 - uv.x, uv.y);
        vec2 mirroredMouse = vec2(1.0 - uMouse.x, uMouse.y);
        for (int i = 0; i < u_line_count; i++) {
            float p = float(i) / float(u_line_count);
            line_strength2 *= (1.0 - lineFn(
                mirroredUv,
                u_line_width * pixel(1.0, uResolution.xy) * (1.0 - p),
                p,
                (PI * 1.0) * p,
                mirroredMouse,
                uTime,
                uAmplitude,
                uDistance
            ));
        }

        float final_strength = line_strength1 * line_strength2;
        float colorVal = 1.0 - final_strength;
        gl_FragColor = vec4(uColor * colorVal, colorVal);
    }
`;


// --- KineticThreadsBackground Component ---
const KineticThreadsBackground = ({
    color = "#a3e635", // lime
    amplitude = 1.0,
    distance = 0.5,
    speed = 1.0,
    mouseInteraction = true,
}) => {
    const mountRef = useRef(null);
    const uniformsRef = useRef(null);
    const speedRef = useRef(speed);
    const mouseInteractionRef = useRef(mouseInteraction);

    // Cheap prop changes update uniforms instead of rebuilding the WebGL scene.
    useEffect(() => {
        speedRef.current = speed;
        mouseInteractionRef.current = mouseInteraction;
        const u = uniformsRef.current;
        if (!u) return;
        u.uColor.value.set(color);
        u.uAmplitude.value = amplitude;
        u.uDistance.value = distance;
    }, [color, amplitude, distance, speed, mouseInteraction]);

    useEffect(() => {
        const mountNode = mountRef.current;
        if (!mountNode) return undefined;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        mountNode.appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uColor: { value: new THREE.Color(color) },
            uAmplitude: { value: amplitude },
            uDistance: { value: distance },
            u_line_count: { value: 40 },
        };
        uniformsRef.current = uniforms;
        const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true });
        const geometry = new THREE.PlaneGeometry(2, 2);
        scene.add(new THREE.Mesh(geometry, material));

        const mouse = { x: 0.5, y: 0.5 };
        const target = { x: 0.5, y: 0.5 };
        const handleMouseMove = (event) => {
            if (!mouseInteractionRef.current) return;
            const rect = mountNode.getBoundingClientRect();
            target.x = (event.clientX - rect.left) / rect.width;
            target.y = 1.0 - (event.clientY - rect.top) / rect.height;
        };
        const handleMouseLeave = () => {
            target.x = 0.5;
            target.y = 0.5;
        };
        window.addEventListener("pointermove", handleMouseMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", handleMouseLeave);

        const resize = () => {
            const { clientWidth, clientHeight } = mountNode;
            const isMobile = clientWidth < 768;
            // Cap the pixel ratio: this shader runs 80 noise lines per pixel.
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : clientWidth > 1600 ? 1 : 1.5));
            renderer.setSize(clientWidth, clientHeight, false);
            uniforms.u_line_count.value = isMobile ? 20 : 40;
            // gl_FragCoord is in device pixels, so the resolution must be too
            // (using CSS pixels only drew the bottom-left quarter on HiDPI screens).
            renderer.getDrawingBufferSize(uniforms.uResolution.value);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(mountNode);
        resize();

        const clock = new THREE.Clock();
        let elapsed = 0;
        let frameId = 0;
        let visible = true;
        const animate = () => {
            elapsed += clock.getDelta() * speedRef.current;
            uniforms.uTime.value = elapsed;
            mouse.x += (target.x - mouse.x) * 0.05;
            mouse.y += (target.y - mouse.y) * 0.05;
            uniforms.uMouse.value.set(mouse.x, mouse.y);
            renderer.render(scene, camera);
            if (visible) frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);

        const io = new IntersectionObserver(([entry]) => {
            const was = visible;
            visible = entry.isIntersecting;
            if (visible && !was) {
                clock.getDelta();
                frameId = requestAnimationFrame(animate);
            }
            if (!visible) cancelAnimationFrame(frameId);
        });
        io.observe(mountNode);

        return () => {
            cancelAnimationFrame(frameId);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", handleMouseMove);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
            uniformsRef.current = null;
        };
        // Only rebuilt on mount; prop changes are handled by the effect above.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={mountRef} className="absolute inset-0 z-0 w-full h-full" />;
};
export default KineticThreadsBackground;
