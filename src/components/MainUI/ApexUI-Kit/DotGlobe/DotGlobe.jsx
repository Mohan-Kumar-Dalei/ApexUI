import React, { useEffect, useRef } from "react";

/*
 * Dot Globe: a 3D globe of land dots drawn on a 2D canvas (no WebGL, no map
 * library). Drag to spin it with inertia; it also turns on its own. Cities
 * pulse as markers and flights arc between them.
 */

// 2° land mask (Natural Earth 110m): 180 × 69 cells from 180°W, 78°N, one bit each.
const LAND = "AAAAwADkw////wEABAAAAABgAAAAAAAAAADAUT8A/v8PAAAAAAwA/j8AuAEAAAAAcBHtDcD/fwAAAAAwAPz/fwMAABCAAQD5w/wD8P8FAAAcAIL7//9//xOAAP/ff0668QD/HwAA+A8At///////v3/w/////x8++B8AAOD/1//7////////jP////+/+AE/gAcAn9f//////////w/w/////wEs4AEAAHz+////////////gL////8HeAAcAADg5///////////9ADgAf7/f4AnAAAAAH78////////H0QAAAiA//8f8AcAAIBB4////////38ADwAQAOD//5//AQAAHAT/////////A3AAAAAA/v//+T8AAGDz//////////8DAQAAAMD/////AwAAsP//////////LwAAAAAA6P///2IAAAD+//////////8CAAAAAAD///8/CAAA4P//////////JwAAAAAA8P///wYAAAD+/unz/////z8AAAAAAAD///8HAAAA/pgPPP//////MQAAAAAA8P//PwAAAMBD9v7n/////wcBAAAAAAD///8AAAAAPkD7f/7///8hEAAAAAAA4P//DwAAAIDhAv/n////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD////7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cv+P//PwAAAAAAAAAAHjAAAADA/////g/+//8EAAAAAAAAAOBhCAAAAP7//99/4D//AAAAAAAAAAAAPAMEAADA////+Qf84BcAAAAAAAAAAAA/AAAAAPz//58fgAf+QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgPAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAVIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDh//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAAYXgAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgbtQBAAAAAAAAAOD//w8AAPD/AwAAAAQIeAAAAAAAAAAA/P//AQAA/z8AAACAA4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P9/AAAA/z8EAAAAAD8GIAAAAAAAAAD8/wMAAPD/cQAAAAD4ZwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/EAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8BAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEIAfAAEAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const STEP = 2;
const COLS = 180;
const ROWS = 69;

const landDots = (() => {
    const bin = typeof atob === "function" ? atob(LAND) : "";
    const dots = [];
    for (let r = 0; r < ROWS; r++) {
        const lat = 78 - r * STEP - 1;
        // Fewer dots toward the poles so the globe looks evenly filled.
        const skip = Math.max(1, Math.round(1 / Math.max(0.25, Math.cos((lat * Math.PI) / 180))));
        for (let c = 0; c < COLS; c += skip) {
            const i = r * COLS + c;
            if ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) dots.push([lat, -180 + c * STEP + 1]);
        }
    }
    return dots;
})();

const DEFAULT_MARKERS = [
    { label: "Bhubaneswar", lat: 20.3, lon: 85.8 },
    { label: "San Francisco", lat: 37.8, lon: -122.4 },
    { label: "London", lat: 51.5, lon: -0.1 },
    { label: "Tokyo", lat: 35.7, lon: 139.7 },
    { label: "Sydney", lat: -33.9, lon: 151.2 },
    { label: "São Paulo", lat: -23.5, lon: -46.6 },
    { label: "Dubai", lat: 25.2, lon: 55.3 },
];

const DEFAULT_ARCS = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [2, 5],
    [6, 2],
    [3, 1],
];

const rad = (d) => (d * Math.PI) / 180;
const toVec = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];

// Spherical interpolation between two unit vectors.
const slerp = (a, b, t) => {
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const om = Math.acos(dot);
    if (om < 1e-4) return a;
    const s = Math.sin(om);
    const k1 = Math.sin((1 - t) * om) / s;
    const k2 = Math.sin(t * om) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};

const DotGlobe = ({
    markers = DEFAULT_MARKERS,
    arcs = DEFAULT_ARCS,
    dotColor = "#a1a1aa",
    markerColor = "#a3e635",
    arcColor = "#a3e635",
    glowColor = "#a3e635",
    labelColor = "rgba(255,255,255,0.9)",
    autoRotateSpeed = 8,
    tilt = 18,
    maxSize = 30,
    showLabels = true,
    className = "",
}) => {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const opts = useRef(null);
    opts.current = { markers, arcs, dotColor, markerColor, arcColor, glowColor, labelColor, autoRotateSpeed, tilt, showLabels };

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        const ctx = canvas.getContext("2d");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let size = 300;
        let raf = 0;
        let last = performance.now();
        let time = 0;
        let yaw = -80; // start over India
        let velocity = 0;
        let drag = null;
        let visible = true;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            size = wrap.getBoundingClientRect().width;
            canvas.width = Math.round(size * dpr);
            canvas.height = Math.round(size * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        };

        // Rotate a unit vector by the current yaw and tilt, then project.
        const project = (v, R, c) => {
            const cy = Math.cos(rad(yaw));
            const sy = Math.sin(rad(yaw));
            const x = v[0] * cy + v[2] * sy;
            const z0 = -v[0] * sy + v[2] * cy;
            const ct = Math.cos(rad(opts.current.tilt));
            const st = Math.sin(rad(opts.current.tilt));
            const y = v[1] * ct - z0 * st;
            const z = v[1] * st + z0 * ct;
            return [c + x * R, c - y * R, z];
        };

        function draw() {
            const o = opts.current;
            const c = size / 2;
            const R = size * 0.4;
            ctx.clearRect(0, 0, size, size);

            // Atmosphere glow and sphere body.
            const glow = ctx.createRadialGradient(c, c, R * 0.85, c, c, R * 1.25);
            glow.addColorStop(0, `${o.glowColor}33`);
            glow.addColorStop(1, `${o.glowColor}00`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(c, c, R * 1.25, 0, Math.PI * 2);
            ctx.fill();
            const body = ctx.createRadialGradient(c - R * 0.35, c - R * 0.35, R * 0.1, c, c, R);
            body.addColorStop(0, "rgba(255,255,255,0.07)");
            body.addColorStop(1, "rgba(255,255,255,0.01)");
            ctx.fillStyle = body;
            ctx.beginPath();
            ctx.arc(c, c, R, 0, Math.PI * 2);
            ctx.fill();

            // Land dots: front bright, back faint.
            const dr = Math.max(0.8, R / 190);
            ctx.fillStyle = o.dotColor;
            for (let i = 0; i < landDots.length; i++) {
                const [lat, lon] = landDots[i];
                const [x, y, z] = project(toVec(lat, lon), R, c);
                ctx.globalAlpha = z > 0 ? 0.35 + 0.65 * z : 0.06;
                ctx.fillRect(x - dr, y - dr, dr * 2, dr * 2);
            }
            ctx.globalAlpha = 1;

            // Arcs with a travelling head.
            o.arcs.forEach(([a, b], k) => {
                const A = o.markers[a];
                const B = o.markers[b];
                if (!A || !B) return;
                const va = toVec(A.lat, A.lon);
                const vb = toVec(B.lat, B.lon);
                const steps = 48;
                ctx.strokeStyle = o.arcColor;
                ctx.lineWidth = Math.max(1, R / 220);
                ctx.globalAlpha = 0.55;
                ctx.beginPath();
                let drawing = false;
                for (let s = 0; s <= steps; s++) {
                    const t = s / steps;
                    const v = slerp(va, vb, t);
                    const lift = 1 + 0.18 * Math.sin(Math.PI * t);
                    const [x, y, z] = project([v[0] * lift, v[1] * lift, v[2] * lift], R, c);
                    if (z > -0.1) {
                        if (drawing) ctx.lineTo(x, y);
                        else ctx.moveTo(x, y);
                        drawing = true;
                    } else drawing = false;
                }
                ctx.stroke();
                const t = ((time * 0.35 + k * 0.17) % 1 + 1) % 1;
                const v = slerp(va, vb, t);
                const lift = 1 + 0.18 * Math.sin(Math.PI * t);
                const [hx, hy, hz] = project([v[0] * lift, v[1] * lift, v[2] * lift], R, c);
                if (hz > 0) {
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = o.arcColor;
                    ctx.beginPath();
                    ctx.arc(hx, hy, Math.max(1.5, R / 110), 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1;

            // Markers with a pulse and labels.
            ctx.font = `600 ${Math.max(10, R / 18)}px ui-sans-serif, system-ui, sans-serif`;
            o.markers.forEach((m, k) => {
                const [x, y, z] = project(toVec(m.lat, m.lon), R, c);
                if (z <= 0.05) return;
                const pulse = ((time * 0.8 + k * 0.23) % 1 + 1) % 1;
                ctx.strokeStyle = o.markerColor;
                ctx.globalAlpha = (1 - pulse) * z;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(x, y, 3 + pulse * R * 0.06, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = z;
                ctx.fillStyle = o.markerColor;
                ctx.beginPath();
                ctx.arc(x, y, Math.max(2.5, R / 80), 0, Math.PI * 2);
                ctx.fill();
                if (o.showLabels && z > 0.35) {
                    ctx.globalAlpha = Math.min(1, (z - 0.35) * 3);
                    ctx.fillStyle = o.labelColor;
                    ctx.fillText(m.label, x + 8, y + 4);
                }
            });
            ctx.globalAlpha = 1;
        }

        const loop = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            time += dt;
            if (!drag) {
                velocity *= 0.94;
                yaw += velocity * dt * 60 + (reduced ? 0 : opts.current.autoRotateSpeed * dt) * (Math.abs(velocity) < 0.05 ? 1 : 0.3);
            }
            draw();
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

        const onDown = (e) => {
            e.preventDefault();
            drag = { x: e.clientX, yaw, lastX: e.clientX, lastT: performance.now() };
            canvas.setPointerCapture?.(e.pointerId);
        };
        const onMove = (e) => {
            if (!drag) return;
            const degPerPx = 180 / (size * 0.8);
            // Drag right → the surface under the pointer moves right.
            yaw = drag.yaw + (e.clientX - drag.x) * degPerPx;
            const now = performance.now();
            velocity = ((e.clientX - drag.lastX) * degPerPx) / Math.max(1, (now - drag.lastT) / 16.7);
            drag.lastX = e.clientX;
            drag.lastT = now;
        };
        const onUp = () => {
            drag = null;
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointercancel", onUp);
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(wrap);
        resize();
        start();

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerup", onUp);
            canvas.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return (
        <div ref={wrapRef} className={`relative aspect-square w-full ${className}`} style={{ maxWidth: `${maxSize}rem` }}>
            <canvas ref={canvasRef} role="img" aria-label="Interactive globe" className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" />
        </div>
    );
};

export default DotGlobe;
