import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Infinite Canvas: an endless wall of image cards you can drag, flick or
 * scroll in any direction. It glides to a stop with momentum, cards lean
 * with the speed of the move and settle flat again, and the wall drifts on
 * its own while nobody touches it. Only enough cards to cover the view are
 * rendered; they are recycled as they leave an edge, so it stays light.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage";
const shot = (n, t) => ({ image: `${IK}/${n}.png?tr=f-auto,q-75,w-520`, title: t });
const DEFAULT_ITEMS = [
    shot("galaxy-3d", "Galaxy 3D"),
    shot("warp-tunnel", "Warp Tunnel"),
    shot("liquid-blob-3d", "Liquid Blob 3D"),
    shot("particle-text", "Particle Text"),
    shot("retro-grid-3d", "Retro Grid 3D"),
    shot("marquee-3d", "Marquee 3D"),
    shot("sunrise-background", "Sunrise Background"),
    shot("circular-carousel", "Circular Carousel"),
    shot("wireframe-knot-3d", "Wireframe Knot 3D"),
    shot("arc-gallery", "Arc Gallery"),
    shot("particle-morph", "Particle Morph"),
    shot("scroll-stack", "Scroll Stack"),
];

const InfiniteCanvas = ({ items = DEFAULT_ITEMS, cardWidth = 14, aspectRatio = 0.8, gap = 1.25, drift = 18, tilt = 1, friction = 0.93, showTitles = true, height = "34rem", onItemClick, className = "" }) => {
    const wrap = useRef(null);
    const tiles = useRef([]);
    const [pool, setPool] = useState(0);
    const live = useRef({});
    live.current = { drift, tilt, friction, showTitles, onItemClick };
    const list = items.length ? items : DEFAULT_ITEMS;
    const listRef = useRef(list);
    listRef.current = list;
    const geo = useRef({ cw: 1, ch: 1, cols: 0, rows: 0 });

    // Size the pool to cover the view (plus a ring of spares) whenever it resizes.
    useLayoutEffect(() => {
        const el = wrap.current;
        const fit = () => {
            const { width, height: hh } = el.getBoundingClientRect();
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            // Cards shrink a little on small screens so a few always fit.
            const w = Math.min(cardWidth * rem, Math.max(width * 0.42, 120));
            const cw = w + gap * rem;
            const ch = w / aspectRatio + gap * rem;
            const cols = Math.ceil(width / cw) + 2;
            const rows = Math.ceil(hh / ch) + 3;
            geo.current = { cw, ch, w, h: w / aspectRatio, cols, rows };
            setPool(cols * rows);
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        return () => ro.disconnect();
    }, [cardWidth, aspectRatio, gap]);

    useEffect(() => {
        const el = wrap.current;
        if (!pool) return undefined;
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const s = { ox: 0, oy: 0, vx: 0, vy: 0, lean: { x: 0, y: 0 }, drag: null, hover: false };
        const slots = tiles.current.slice(0, pool).map(() => ({ key: "" }));
        let raf = 0;
        let last = 0;
        let visible = true;

        const paint = () => {
            const { cw, ch, cols } = geo.current;
            const items = listRef.current;
            const n = items.length;
            const c0 = Math.floor(-s.ox / cw) - 1;
            const r0 = Math.floor(-s.oy / ch) - 2;
            const rx = Math.max(-10, Math.min(10, -s.lean.y * 0.012 * live.current.tilt));
            const ry = Math.max(-10, Math.min(10, s.lean.x * 0.012 * live.current.tilt));
            const sc = 1 - Math.min(0.06, Math.hypot(s.lean.x, s.lean.y) / 30000);
            for (let k = 0; k < slots.length; k++) {
                const el = tiles.current[k];
                if (!el) continue;
                const i = c0 + (k % cols);
                const j = r0 + Math.floor(k / cols);
                // Odd columns sit half a card lower, like a masonry wall.
                const x = i * cw + s.ox;
                const y = j * ch + s.oy + (((i % 2) + 2) % 2) * ch * 0.5;
                el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
                const key = `${i},${j}`;
                if (slots[k].key !== key) {
                    slots[k].key = key;
                    const idx = ((((i * 5 + j * 3) % n) + n) % n);
                    el.dataset.index = String(idx);
                    const img = el.querySelector("img");
                    if (img && img.getAttribute("src") !== items[idx].image) img.setAttribute("src", items[idx].image);
                    const label = el.querySelector("[data-title]");
                    if (label) label.textContent = items[idx].title ?? "";
                }
            }
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            if (!s.drag) {
                const k = Math.pow(o.friction, dt * 60);
                s.vx *= k;
                s.vy *= k;
                // Ease back into the idle drift once the throw has died down.
                if (!s.hover && !reduced && o.drift) {
                    s.vx += (-o.drift * 0.6 - s.vx) * (1 - Math.exp(-dt / 1.6)) * (Math.abs(s.vx) < 120 ? 1 : 0);
                    s.vy += (-o.drift - s.vy) * (1 - Math.exp(-dt / 1.6)) * (Math.abs(s.vy) < 120 ? 1 : 0);
                }
                s.ox += s.vx * dt;
                s.oy += s.vy * dt;
            }
            const lx = s.drag ? s.drag.vx : s.vx;
            const ly = s.drag ? s.drag.vy : s.vy;
            s.lean.x += (lx - s.lean.x) * (1 - Math.exp(-dt / 0.12));
            s.lean.y += (ly - s.lean.y) * (1 - Math.exp(-dt / 0.12));
            paint();
            const moving = s.drag || Math.abs(s.vx) + Math.abs(s.vy) > 1 || Math.abs(s.lean.x) + Math.abs(s.lean.y) > 1;
            if (visible && (moving || (o.drift && !s.hover && !reduced))) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        const start = () => {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        };

        const onDown = (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            s.drag = { x: e.clientX, y: e.clientY, ox: s.ox, oy: s.oy, t: performance.now(), vx: 0, vy: 0, moved: false, target: e.target.closest("[data-index]") };
            el.setPointerCapture(e.pointerId);
            s.vx = s.vy = 0;
            start();
        };
        const onMove = (e) => {
            const g = s.drag;
            if (!g) return;
            const now = performance.now();
            const dx = e.clientX - g.x;
            const dy = e.clientY - g.y;
            if (Math.hypot(dx, dy) > 5) g.moved = true;
            const nx = g.ox + dx;
            const ny = g.oy + dy;
            const span = Math.max(8, now - g.t) / 1000;
            g.vx += ((nx - s.ox) / span - g.vx) * 0.4;
            g.vy += ((ny - s.oy) / span - g.vy) * 0.4;
            g.t = now;
            s.ox = nx;
            s.oy = ny;
            start();
        };
        const onUp = (e) => {
            const g = s.drag;
            if (!g) return;
            s.drag = null;
            if (g.moved) {
                // Fling: keep the release speed (capped) and let friction take it.
                s.vx = Math.max(-3000, Math.min(3000, g.vx));
                s.vy = Math.max(-3000, Math.min(3000, g.vy));
            } else if (g.target && e.type === "pointerup") {
                const idx = Number(g.target.dataset.index);
                live.current.onItemClick?.(listRef.current[idx], idx);
            }
            start();
        };
        const onWheel = (e) => {
            e.preventDefault();
            s.vx = -e.deltaX * 6;
            s.vy = -e.deltaY * 6;
            start();
        };
        const onEnter = () => {
            s.hover = true;
        };
        const onLeave = () => {
            s.hover = false;
            start();
        };
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("wheel", onWheel, { passive: false });
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
        });
        io.observe(el);
        paint();
        start();

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointercancel", onUp);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
            el.removeEventListener("wheel", onWheel);
        };
    }, [pool]);

    const { w, h } = geo.current;
    return (
        <div
            ref={wrap}
            className={`relative w-full cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing ${className}`}
            style={{ height, perspective: "1200px", maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, #000 55%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, #000 55%, transparent 100%)" }}
        >
            {Array.from({ length: pool }, (_, k) => (
                <div key={k} ref={(e) => (tiles.current[k] = e)} className="group absolute left-0 top-0 will-change-transform" style={{ width: w, height: h }}>
                    <div className="h-full w-full overflow-hidden rounded-2xl bg-white/5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                        <img alt="" draggable={false} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]" />
                    </div>
                    {showTitles && <p data-title="" className="pointer-events-none absolute inset-x-3 bottom-3 truncate rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100" />}
                </div>
            ))}
        </div>
    );
};

export default InfiniteCanvas;
