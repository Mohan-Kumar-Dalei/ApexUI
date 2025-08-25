import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "https://unpkg.com/ogl";

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 0.5, 0.2];
    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
    ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  // loop count reduced to 30
  for (vec2 r = iResolution.xy, Q; ++i < 35.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}
`;


export const SmokeBackground = ({
    color = "#00c950",
    speed = 1,
    direction = "forward",
    scale = 1,
    opacity = 1,
    mouseInteractive = true,
    className = "",
    maxWidth = 'max-w-6xl',
}) => {
    const containerRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const mountNode = containerRef.current;
        if (!mountNode) return;

        const useCustomColor = color ? 1.0 : 0.0;
        const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];

        let directionMultiplier = direction === "backward" ? -1.0 : 1.0;

        const renderer = new Renderer({
            webgl: 2,
            alpha: true,
            antialias: false,
            dpr: Math.min(window.devicePixelRatio || 1, 1.8),
        });

        const gl = renderer.gl;
        const canvas = gl.canvas;
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        mountNode.appendChild(canvas);

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex: vertex,
            fragment: fragment,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Float32Array([1, 1]) },
                uCustomColor: { value: new Float32Array(customColorRgb) },
                uUseCustomColor: { value: useCustomColor },
                uSpeed: { value: speed * 0.4 },
                uDirection: { value: directionMultiplier },
                uScale: { value: scale },
                uOpacity: { value: opacity },
                uMouse: { value: new Float32Array([0, 0]) },
                uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        // 🖱 Mouse throttled to RAF
        let mouseNeedsUpdate = false;
        const handleMouseMove = (e) => {
            if (!mouseInteractive) return;
            const rect = containerRef.current.getBoundingClientRect();
            mousePos.current.x = e.clientX - rect.left;
            mousePos.current.y = rect.height - (e.clientY - rect.top);
            mouseNeedsUpdate = true;
        };
        if (mouseInteractive) {
            mountNode.addEventListener("mousemove", handleMouseMove);
        }

        const setSize = () => {
            const rect = containerRef.current.getBoundingClientRect();
            const width = Math.max(1, Math.floor(rect.width));
            const height = Math.max(1, Math.floor(rect.height));
            renderer.setSize(width, height);
            const res = program.uniforms.iResolution.value;
            res[0] = gl.drawingBufferWidth;
            res[1] = gl.drawingBufferHeight;
        };

        const ro = new ResizeObserver(() => {
            requestAnimationFrame(setSize);
        });
        ro.observe(mountNode);
        setSize();

        let raf = 0;
        const t0 = performance.now();
        const loop = (t) => {
            let timeValue = (t - t0) * 0.001;

            if (direction === "funny") {
                const cycle = Math.sin(timeValue * 0.5);
                program.uniforms.uDirection.value = cycle;
            }

            if (mouseNeedsUpdate) {
                const mouseUniform = program.uniforms.uMouse.value;
                mouseUniform[0] = mousePos.current.x;
                mouseUniform[1] = mousePos.current.y;
                mouseNeedsUpdate = false;
            }

            program.uniforms.iTime.value = timeValue;
            renderer.render({ scene: mesh });
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            if (mouseInteractive && mountNode) {
                mountNode.removeEventListener("mousemove", handleMouseMove);
            }
            try {
                mountNode.removeChild(canvas);
            } catch (error) { console.error("Error removing canvas:", error); }
        };
    }, [color, speed, direction, scale, opacity, mouseInteractive, className]);

    return (
        <div className={`w-full ${className}`}>
            <div className={`mx-auto w-full ${maxWidth} h-[60vh] lg:h-[90vh] overflow-hidden relative`}>
                <div ref={containerRef} className="absolute inset-0 w-full h-full" />
            </div>
        </div>
    );
};

export default SmokeBackground;
