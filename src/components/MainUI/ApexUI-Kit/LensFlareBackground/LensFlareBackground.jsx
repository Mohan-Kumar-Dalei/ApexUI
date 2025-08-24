/* eslint-disable no-unused-vars */
import { react, useRef, useEffect } from "react";
import * as THREE from "three";
const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
        ? [
              parseInt(m[1], 16) / 255,
              parseInt(m[2], 16) / 255,
              parseInt(m[3], 16) / 255,
          ]
        : [1, 1, 1];
};

const getAnchorAndDir = (w, h) => {
    // Always center for this effect
    return { anchor: [0.5 * w, 0.2 * h], dir: [0, 3] };
};

// Only add the selected props for lens flare effect, no other changes
const LensFlareBackground = ({
    flareColor = "#fbbf24", // Main color of the lens flare
    intensity = 1.0,        // Intensity of the flare
    animationSpeed = 1.0,   // Animation speed
    rayLengthValue = 1,
}) => {
    const mountRef = useRef();
    const uniformsRef = useRef();
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!mountRef.current) return;
        let renderer, scene, camera, material, mesh, frameId;
        let dpr = Math.min(window.devicePixelRatio, 2);

        const getDims = () => {
            if (!mountRef.current) return [0, 0];
            return [mountRef.current.clientWidth * dpr, mountRef.current.clientHeight * dpr];
        };

        const setupRenderer = () => {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setClearColor(0x000000, 0);
            if (mountRef.current) {
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight, false);
                mountRef.current.appendChild(renderer.domElement);
            }
        };

        const setupScene = () => {
            camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
            scene = new THREE.Scene();
            const geometry = new THREE.PlaneGeometry(1, 2);
            const [w, h] = getDims();
            const uniforms = {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector2(w, h) },
                rayPos: { value: new THREE.Vector2(0, 0) },
                rayDir: { value: new THREE.Vector2(0, 1) },
                raysColor: { value: new THREE.Color(...hexToRgb(flareColor)) },
                raysSpeed: { value: animationSpeed },
                lightSpread: { value: 4 },
                rayLength: { value: 1 },
                pulsating: { value: 0.0 },
                fadeDistance: { value: 1.0 },
                saturation: { value: 1.0 },
                mousePos: { value: new THREE.Vector2(0.5, 0.5) },
                mouseInfluence: { value: 0.1 },
                noiseAmount: { value: 0.0 },
                distortion: { value: 0.0 },
                intensity: { value: intensity },
            };
            uniformsRef.current = uniforms;

            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                precision highp float;
                uniform float iTime;
                uniform vec2  iResolution;
                uniform vec2  rayPos;
                uniform vec2  rayDir;
                uniform vec3  raysColor;
                uniform float raysSpeed;
                uniform float lightSpread;
                uniform float rayLength;
                uniform float pulsating;
                uniform float fadeDistance;
                uniform float saturation;
                uniform vec2  mousePos;
                uniform float mouseInfluence;
                uniform float noiseAmount;
                uniform float distortion;
                uniform float intensity;
                varying vec2 vUv;

                float noise(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                                    float seedA, float seedB, float speed) {
                    vec2 sourceToCoord = coord - raySource;
                    vec2 dirNorm = normalize(sourceToCoord);
                    float cosAngle = dot(dirNorm, rayRefDirection);
                    float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
                    float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
                    float distance = length(sourceToCoord);
                    float maxDistance = iResolution.x * rayLength;
                    float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                    float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
                    float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
                    float baseStrength = clamp(
                        (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
                        (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
                        0.0, 1.0
                    );
                    return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
                }

                float dotGlow(vec2 uv, vec2 pos, float size) {
                    float d = length(uv - pos);
                    return exp(-pow(d / size, 2.5));
                }

                void main() {
                    vec2 fragCoord = vUv * iResolution.xy;
                    vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
                    vec2 finalRayDir = rayDir;

                    if (mouseInfluence > 0.0) {
                        vec2 mouseScreenPos = mousePos * iResolution.xy;
                        vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                        finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
                    }

                    vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
                    vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
                    vec4 fragColor = (rays1 * 0.7 + rays2 * 0.6) * 1.5;

                    if (noiseAmount > 0.0) {
                        float n = noise(coord * 0.01 + iTime * 0.1);
                        fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
                    }

                    float brightness = 1.0 - (coord.y / iResolution.y);
                    fragColor.x *= 0.1 + brightness * 0.8;
                    fragColor.y *= 0.3 + brightness * 0.6;
                    fragColor.z *= 0.5 + brightness * 0.5;

                    if (saturation != 1.0) {
                        float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
                        fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
                    }

                    fragColor.rgb *= raysColor;
                    fragColor.rgb *= intensity;

                    float t = iTime;
                    vec2 uvNorm = fragCoord / iResolution.xy;
                    float dots = 0.0;
                    dots += dotGlow(uvNorm, vec2(0.3 + 0.1 * sin(t), 0.4 + 0.1 * cos(t)), 0.04 + 0.01 * sin(t * 1.2));
                    dots += dotGlow(uvNorm, vec2(0.7 + 0.08 * cos(t * 1.1), 0.6 + 0.09 * sin(t * 0.9)), 0.035 + 0.01 * cos(t * 1.3));
                    dots += dotGlow(uvNorm, vec2(0.5 + 0.12 * sin(t * 0.7), 0.7 + 0.07 * cos(t * 1.5)), 0.03 + 0.01 * sin(t * 1.7));
                    dots += dotGlow(uvNorm, vec2(0.4 + 0.09 * cos(t * 1.4), 0.3 + 0.08 * sin(t * 1.1)), 0.025 + 0.01 * cos(t * 1.9));
                    dots += dotGlow(uvNorm, vec2(0.6 + 0.07 * sin(t * 1.6), 0.5 + 0.1 * cos(t * 1.2)), 0.03 + 0.01 * sin(t * 1.5));
                    vec3 dotColor = vec3(1.0, 0.95, 0.8);
                    fragColor.rgb += dots * dotColor * 0.7 * intensity;

                    gl_FragColor = fragColor;
                }
            `;

            material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
                depthWrite: false,
            });
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            return { uniforms };
        };

        let uniforms;
        setupRenderer();
        ({ uniforms } = setupScene());

        const updatePlacement = () => {
            dpr = Math.min(window.devicePixelRatio, 2);
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth * dpr;
            const h = mountRef.current.clientHeight * dpr;
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight, false);
            uniforms.iResolution.value.set(w, h);
            const { anchor, dir } = getAnchorAndDir(w, h);
            uniforms.rayPos.value.set(anchor[0], anchor[1]);
            uniforms.rayDir.value.set(dir[0], dir[1]);
        };
        updatePlacement();
        window.addEventListener("resize", updatePlacement);

        const handleMouseMove = (e) => {
            if (!mountRef.current) return;
            const rect = mountRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            mouseRef.current = { x, y };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const animate = (now) => {
            uniforms.iTime.value = now * 0.001;
            const smoothing = 0.92;
            smoothMouseRef.current.x =
                smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
            smoothMouseRef.current.y =
                smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);
            uniforms.mousePos.value.set(smoothMouseRef.current.x, smoothMouseRef.current.y);
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            window.removeEventListener("resize", updatePlacement);
            window.removeEventListener("mousemove", handleMouseMove);
            renderer.dispose();
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [flareColor, intensity, animationSpeed]);

    useEffect(() => {
        if (!uniformsRef.current) return;
        uniformsRef.current.raysColor.value.set(...hexToRgb(flareColor));
        uniformsRef.current.raysSpeed.value = animationSpeed;
        uniformsRef.current.intensity.value = intensity;
    }, [flareColor, animationSpeed, intensity]);

    return (
        <div
            ref={mountRef}
            // Corrected the className and ensured overflow is hidden
            className="pointer-events-none w-[135vw] overflow-hidden"
            style={{
                position: "absolute",
                bottom: 0,
                height: "100vh",
                // Add these two lines to center the element horizontally
                left: "50%",
                transform: "translateX(-50%)",
            }}
        />
    );
};

export default LensFlareBackground;