import React, { useEffect, useRef } from "react";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer } from "three";

/*
 * Distortion Image: an image drawn in WebGL that ripples where the pointer
 * moves. The ripple bends the picture, splits it into red / green / blue
 * fringes and fades out smoothly when the pointer leaves. Image is "cover"
 * fitted like CSS object-fit. Pauses off screen, frees the GPU on unmount.
 */

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

const FRAG = `
uniform sampler2D uTex; uniform vec2 uPointer; uniform float uHover; uniform float uTime;
uniform float uStrength; uniform float uRgb; uniform vec2 uCover; uniform float uAspect;
varying vec2 vUv;
void main(){
  // object-fit: cover
  vec2 uv = (vUv - .5) * uCover + .5;
  vec2 d = vUv - uPointer; d.x *= uAspect;
  float dist = length(d);
  float wave = sin(dist * 28. - uTime * 6.) * exp(-dist * 5.) * uHover;
  vec2 dir = dist > 0. ? normalize(d) : vec2(0.);
  vec2 offset = dir * wave * .03 * uStrength;
  float split = uRgb * uHover * exp(-dist * 4.) * .012;
  float r = texture2D(uTex, uv + offset + dir * split).r;
  float g = texture2D(uTex, uv + offset).g;
  float b = texture2D(uTex, uv + offset - dir * split).b;
  gl_FragColor = vec4(r, g, b, 1.);
}`;

const DistortionImage = ({ src = "https://ik.imagekit.io/ny6yinyut/apexui/assets/doctorStrange.png?tr=f-auto,q-85,w-1000", alt = "", strength = 1, rgbSplit = 1, aspectRatio = "4 / 5", width = 22, rounded = "1.25rem", className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ strength, rgbSplit });
    opts.current = { strength, rgbSplit };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = SRGBColorSpace;
        Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
        el.appendChild(renderer.domElement);
        const scene = new Scene();
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
            uTex: { value: null },
            uPointer: { value: new Vector2(0.5, 0.5) },
            uHover: { value: 0 },
            uTime: { value: 0 },
            uStrength: { value: strength },
            uRgb: { value: rgbSplit },
            uCover: { value: new Vector2(1, 1) },
            uAspect: { value: 1 },
        };
        const geometry = new PlaneGeometry(2, 2);
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
        scene.add(new Mesh(geometry, material));

        let imgAspect = 1;
        const fit = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            const box = width / height;
            uniforms.uAspect.value = box;
            // Scale UVs so the image covers the box without stretching.
            uniforms.uCover.value.set(box < imgAspect ? box / imgAspect : 1, box < imgAspect ? 1 : imgAspect / box);
        };
        let texture = null;
        let disposed = false;
        new TextureLoader().setCrossOrigin("anonymous").load(src, (t) => {
            if (disposed) return t.dispose();
            t.colorSpace = SRGBColorSpace;
            texture = t;
            imgAspect = t.image.width / t.image.height;
            uniforms.uTex.value = t;
            fit();
        });
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        fit();

        const target = { x: 0.5, y: 0.5, hover: 0 };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            target.x = (e.clientX - r.left) / r.width;
            target.y = 1 - (e.clientY - r.top) / r.height;
            target.hover = 1;
        };
        const onLeave = () => (target.hover = 0);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let raf = 0;
        let last = performance.now();
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible || !uniforms.uTex.value) return;
            uniforms.uTime.value += dt;
            uniforms.uPointer.value.x += (target.x - uniforms.uPointer.value.x) * 0.12;
            uniforms.uPointer.value.y += (target.y - uniforms.uPointer.value.y) * 0.12;
            uniforms.uHover.value += (target.hover - uniforms.uHover.value) * 0.06;
            uniforms.uStrength.value = opts.current.strength;
            uniforms.uRgb.value = opts.current.rgbSplit;
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            texture?.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Strength and RGB split are read live from opts; only a new image reloads.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return <div ref={mount} role="img" aria-label={alt} className={`relative overflow-hidden bg-neutral-900 ${className}`} style={{ width: `min(${width}rem, 88vw)`, aspectRatio, borderRadius: rounded }} />;
};

export default DistortionImage;
