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
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const mountNode = mountRef.current;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        mountNode.appendChild(renderer.domElement);

        // Shader Material
        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2() },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uColor: { value: new THREE.Color(color) },
            uAmplitude: { value: amplitude },
            uDistance: { value: distance },
            u_line_count: { value: 40 } // Default line count
        };
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
        });

        // Fullscreen Plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Mouse move handler
        const handleMouseMove = (event) => {
            if (!mouseInteraction) return;
            const rect = mountNode.getBoundingClientRect();
            targetMouseRef.current.x = (event.clientX - rect.left) / rect.width;
            targetMouseRef.current.y = 1.0 - (event.clientY - rect.top) / rect.height;
        };
        const handleMouseLeave = () => {
            targetMouseRef.current.x = 0.5;
            targetMouseRef.current.y = 0.5;
        };
        if (mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseleave', handleMouseLeave);
        }

        // Resize handler with mobile optimization
        const handleResize = () => {
            const { clientWidth, clientHeight } = mountNode;
            renderer.setSize(clientWidth, clientHeight);

            // --- Mobile Optimization ---
            const isMobile = clientWidth < 768;

            // 1. Adjust pixel ratio for performance on small screens
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

            // 2. Reduce shader complexity (line count) on mobile
            uniforms.u_line_count.value = isMobile ? 20 : 40;

            uniforms.uResolution.value.set(clientWidth, clientHeight);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        // Animation loop
        const clock = new THREE.Clock();
        let animationFrameId;
        const animate = () => {
            uniforms.uTime.value = clock.getElapsedTime() * speed;

            // Smoothly update mouse position (lerping)
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;
            uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (mountNode && renderer.domElement) {
                mountNode.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [color, amplitude, distance, speed, mouseInteraction]);

    return <div ref={mountRef} className="absolute inset-0 z-0 w-full h-full -translate-y-20"/>;
};
export default KineticThreadsBackground;
