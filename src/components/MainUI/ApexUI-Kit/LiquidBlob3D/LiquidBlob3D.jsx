import React, { useEffect, useRef } from "react";
import { Color, IcosahedronGeometry, Mesh, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer } from "three";

/*
 * Liquid Blob 3D: a glossy blob whose surface flows with 3D noise, shaded
 * with an iridescent fresnel rim. It leans toward the pointer and ripples
 * harder while hovered. One mesh, one shader, no textures, so it stays
 * light. Pauses when off screen and frees the GPU on unmount.
 */

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = `
uniform float uTime; uniform float uAmp; uniform float uFreq;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${NOISE}
float field(vec3 p){ return snoise(p * uFreq + vec3(uTime * .3)) + .18 * snoise(p * uFreq * 2. - vec3(uTime * .2)); }
void main(){
  float n = field(normal);
  vNoise = n;
  vec3 pos = position + normal * n * uAmp;
  // Rebuild the normal from two nearby displaced points so the shading follows the waves.
  vec3 t = normalize(cross(normal, abs(normal.y) < .99 ? vec3(0.,1.,0.) : vec3(1.,0.,0.)));
  vec3 b = normalize(cross(normal, t));
  float e = .01;
  vec3 n1 = normalize(normal + t * e); vec3 n2 = normalize(normal + b * e);
  vec3 p1 = n1 * (1. + field(n1) * uAmp); vec3 p2 = n2 * (1. + field(n2) * uAmp);
  vec3 nrm = normalize(cross(p1 - pos, p2 - pos));
  if (dot(nrm, normal) < 0.) nrm = -nrm;
  vec4 mv = modelViewMatrix * vec4(pos, 1.);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * nrm);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
void main(){
  vec3 n = normalize(vNormal); vec3 v = normalize(vView);
  float fr = pow(1. - max(dot(n, v), 0.), 2.4);
  vec3 col = mix(uC1, uC2, smoothstep(-.7, .7, vNoise));
  col = mix(col, uC3, fr * .9);
  vec3 l = normalize(vec3(.45, .8, .6));
  float diff = max(dot(n, l), 0.);
  float spec = pow(max(dot(reflect(-l, n), v), 0.), 40.);
  col = col * (.55 + .55 * diff) + spec * .8 + fr * .25;
  gl_FragColor = vec4(col, 1.);
}`;

const LiquidBlob3D = ({ colors = ["#a3e635", "#22d3ee", "#a78bfa"], size = 22, speed = 1, distortion = 0.24, detail = 48, interactive = true, className = "" }) => {
    const mount = useRef(null);
    const opts = useRef({ colors, speed, distortion, interactive });
    opts.current = { colors, speed, distortion, interactive };

    useEffect(() => {
        const el = mount.current;
        const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        el.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";

        const scene = new Scene();
        const camera = new PerspectiveCamera(35, 1, 0.1, 50);
        camera.position.z = 4.2;
        const uniforms = {
            uTime: { value: 0 },
            uAmp: { value: distortion },
            uFreq: { value: 0.85 },
            uC1: { value: new Color(colors[0]) },
            uC2: { value: new Color(colors[1] ?? colors[0]) },
            uC3: { value: new Color(colors[2] ?? colors[1] ?? colors[0]) },
        };
        const geometry = new IcosahedronGeometry(1, detail);
        const material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        const resize = () => {
            const { width, height } = el.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const pointer = { x: 0, y: 0, hover: 0 };
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
            pointer.hover = 1;
        };
        const onLeave = () => {
            pointer.x = 0;
            pointer.y = 0;
            pointer.hover = 0;
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(el);

        let raf = 0;
        let last = performance.now();
        let amp = distortion;
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!visible) return;
            const o = opts.current;
            uniforms.uTime.value += dt * o.speed * (reduced ? 0.15 : 1);
            const targetAmp = o.distortion * (o.interactive && pointer.hover ? 1.55 : 1);
            amp += (targetAmp - amp) * 0.06;
            uniforms.uAmp.value = amp;
            uniforms.uC1.value.set(o.colors[0]);
            uniforms.uC2.value.set(o.colors[1] ?? o.colors[0]);
            uniforms.uC3.value.set(o.colors[2] ?? o.colors[1] ?? o.colors[0]);
            const tx = o.interactive ? pointer.y * 0.5 : 0;
            const ty = o.interactive ? pointer.x * 0.7 : 0;
            mesh.rotation.x += (tx - mesh.rotation.x) * 0.05;
            mesh.rotation.y += (ty + uniforms.uTime.value * 0.15 - mesh.rotation.y) * 0.05;
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
            material.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
        };
        // Colors, speed and distortion are read live from opts; only geometry detail rebuilds.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail]);

    return <div ref={mount} className={`relative touch-none ${className}`} style={{ width: `min(${size}rem, 90vw)`, aspectRatio: "1" }} aria-hidden="true" />;
};

export default LiquidBlob3D;
