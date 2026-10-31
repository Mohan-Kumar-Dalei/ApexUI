import React, { useEffect, useRef } from "react";

/*
 * Aurora Background: northern lights over a night sky, drawn in one small
 * WebGL shader. Curtains of light hang from the top, ripple sideways and
 * flicker in fine vertical rays; the colours run from the first (lower edge)
 * to the last (upper fringe). Faint stars sit behind them. Reduced-motion
 * visitors get a still frame. No library needed.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uIntensity; uniform float uLight;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uSky;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * n(p); p *= 2.1; a *= 0.5; } return v; }

vec3 ramp(float t){
  t = clamp(t, 0.0, 1.0) * 3.0;
  return t < 1.0 ? mix(uC0, uC1, t) : t < 2.0 ? mix(uC1, uC2, t - 1.0) : mix(uC2, uC3, t - 2.0);
}

// One curtain: a wavy band whose lower edge is bright and which fades upward.
vec3 curtain(vec2 uv, float t, float seed, float base, float amp){
  float x = uv.x * 1.6 + seed;
  float wave = (fbm(vec2(x * 0.9, t * 0.12 + seed)) - 0.5) * amp + sin(x * 1.7 + t * 0.35 + seed) * amp * 0.35;
  float edge = base + wave;                      // lower edge of the curtain
  float d = uv.y - edge;                         // height above the edge
  if (d < -0.05) return vec3(0.0);
  float rays = 0.55 + 0.45 * n(vec2(x * 38.0, t * 0.6 + seed));   // fine vertical rays
  float body = exp(-max(d, 0.0) * 3.2) * smoothstep(-0.05, 0.015, d);
  float glow = exp(-abs(d) * 26.0) * 0.9;        // bright lower rim
  float shimmer = 0.75 + 0.25 * sin(t * 1.3 + x * 6.0 + seed * 3.0);
  return ramp(clamp(d * 1.9, 0.0, 1.0)) * (body * rays + glow) * shimmer;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.x *= uRes.x / uRes.y;
  float t = uTime;
  vec3 col = uSky * (0.55 + 0.45 * (1.0 - gl_FragCoord.y / uRes.y));
  // Stars (dark sky only).
  vec2 cell = floor(gl_FragCoord.xy / 2.0);
  col += step(0.9975, h(cell)) * (0.5 + 0.5 * sin(t * 2.0 + h(cell) * 40.0)) * (1.0 - uLight) * 0.8;
  vec3 a = curtain(uv, t, 0.0, 0.42, 0.22) + curtain(uv, t * 0.8, 4.7, 0.52, 0.18) * 0.75 + curtain(uv, t * 1.15, 9.3, 0.33, 0.26) * 0.55;
  a *= uIntensity;
  col = uLight > 0.5 ? mix(col, col * (1.0 - min(a, 0.85)) + a * 0.55, 1.0) : col + a;
  col += (h(gl_FragCoord.xy + t) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const toRgb = (hex) => {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(String(hex).trim());
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0.4, 0.9, 0.6];
};

const AuroraBackground = ({ children, colors = ["#22c55e", "#2dd4bf", "#38bdf8", "#c084fc"], theme = "dark", speed = 1, intensity = 1, className = "", containerClassName = "" }) => {
    const box = useRef(null);
    const live = useRef({});
    live.current = { colors, theme, speed, intensity };
    const dark = theme !== "light";

    useEffect(() => {
        const el = box.current;
        const cv = document.createElement("canvas");
        Object.assign(cv.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        el.prepend(cv);
        const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
        if (!gl) {
            cv.remove();
            return undefined;
        }
        const shader = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const U = (name) => gl.getUniformLocation(prog, name);
        const u = { res: U("uRes"), time: U("uTime"), int: U("uIntensity"), light: U("uLight"), sky: U("uSky"), c: [U("uC0"), U("uC1"), U("uC2"), U("uC3")] };

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let raf = 0;
        let last = 0;
        let time = 8;
        let visible = true;
        const scale = 0.75; // render a little under full size: the light is soft anyway

        const fit = () => {
            const r = el.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
            cv.width = Math.max(1, Math.round(r.width * dpr));
            cv.height = Math.max(1, Math.round(r.height * dpr));
            gl.viewport(0, 0, cv.width, cv.height);
        };
        const draw = (now) => {
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
            last = now;
            time += dt * o.speed;
            const cs = [0, 1, 2, 3].map((i) => toRgb(o.colors[Math.min(i, o.colors.length - 1)] ?? "#22c55e"));
            const light = o.theme === "light";
            gl.uniform2f(u.res, cv.width, cv.height);
            gl.uniform1f(u.time, time);
            gl.uniform1f(u.int, o.intensity);
            gl.uniform1f(u.light, light ? 1 : 0);
            gl.uniform3fv(u.sky, light ? [0.95, 0.97, 0.99] : [0.02, 0.03, 0.07]);
            cs.forEach((c, i) => gl.uniform3fv(u.c[i], c));
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        const loop = (now) => {
            raf = 0;
            draw(now);
            if (visible && !reduced) raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (!raf && visible) {
                last = 0;
                raf = requestAnimationFrame(loop);
            }
        };
        const ro = new ResizeObserver(() => {
            fit();
            start();
        });
        ro.observe(el);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        fit();
        start();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
            cv.remove();
        };
    }, []);

    return (
        <div ref={box} className={`relative h-screen w-full overflow-hidden ${dark ? "bg-[#05070f]" : "bg-[#f1f5f9]"} ${containerClassName}`}>
            {children && <div className={`relative z-10 h-full w-full ${className}`}>{children}</div>}
        </div>
    );
};

export default AuroraBackground;
