import React, { useEffect, useMemo, useRef } from "react";

/*
 * Edge Blur: a soft, progressive blur along one edge of a scrolling area,
 * the way content melts under an app's top bar or fades out at the end of a
 * list. It stacks a few backdrop-blur layers; each one doubles the blur of
 * the last and is masked to an overlapping band, so the blur grows smoothly
 * toward the edge instead of in steps. Optionally fades into a tint, and can
 * hide itself when the scroll reaches that edge.
 */

const DIR = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" };
const len = (v) => (typeof v === "number" ? `${v}px` : v);

// The nearest thing that scrolls along this axis: a sibling, or the parent.
function findScroller(el, vertical) {
    const scrolls = (node) => {
        const s = getComputedStyle(node);
        return /(auto|scroll)/.test(vertical ? s.overflowY : s.overflowX);
    };
    const parent = el.parentElement;
    if (!parent) return null;
    return [...parent.children].find((c) => c !== el && scrolls(c)) || (scrolls(parent) ? parent : null);
}

const EdgeBlur = ({ edge = "bottom", size = "6rem", blur = 16, steps = 6, tint = "transparent", hideAtEnd = false, scroller, fixed = false, zIndex = 10, className = "" }) => {
    const ref = useRef(null);
    const side = DIR[edge] ? edge : "bottom";
    const vertical = side === "top" || side === "bottom";
    const count = Math.max(2, Math.min(10, Math.round(steps)));

    // Layer i covers the band [i, i + 2] / count and blurs blur / 2^(count - 1 - i).
    const layers = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => {
                const a = (i / count) * 100;
                const b = ((i + 1) / count) * 100;
                const c = ((i + 2) / count) * 100;
                const amount = blur / Math.pow(2, count - 1 - i);
                const last = i === count - 1;
                const mask = `linear-gradient(${DIR[side]}, transparent ${a.toFixed(1)}%, #000 ${b.toFixed(1)}%${last ? "" : `, #000 ${Math.min(100, c).toFixed(1)}%, transparent ${Math.min(100, c + 100 / count).toFixed(1)}%`})`;
                return { filter: `blur(${amount.toFixed(2)}px)`, mask };
            }),
        [count, blur, side],
    );

    useEffect(() => {
        const el = ref.current;
        if (!hideAtEnd || !el) {
            if (el) el.style.opacity = "";
            return undefined;
        }
        const target = scroller?.current ?? scroller ?? findScroller(el, vertical);
        if (!target) return undefined;
        const start = side === "top" || side === "left";
        const update = () => {
            const pos = vertical ? target.scrollTop : target.scrollLeft;
            const max = vertical ? target.scrollHeight - target.clientHeight : target.scrollWidth - target.clientWidth;
            const room = start ? pos : max - pos;
            const reach = Math.max(1, vertical ? el.offsetHeight : el.offsetWidth);
            el.style.opacity = String(Math.max(0, Math.min(1, room / reach)));
        };
        update();
        target.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(target);
        return () => {
            target.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [hideAtEnd, scroller, side, vertical]);

    const box = {
        position: fixed ? "fixed" : "absolute",
        zIndex,
        pointerEvents: "none",
        transition: "opacity 0.25s ease-out",
        [side]: 0,
        ...(vertical ? { left: 0, right: 0, height: len(size) } : { top: 0, bottom: 0, width: len(size) }),
    };

    return (
        <div ref={ref} aria-hidden="true" className={className} style={box}>
            {layers.map((l, i) => (
                <div key={i} className="absolute inset-0" style={{ backdropFilter: l.filter, WebkitBackdropFilter: l.filter, maskImage: l.mask, WebkitMaskImage: l.mask }} />
            ))}
            {tint !== "transparent" && <div className="absolute inset-0" style={{ background: `linear-gradient(${DIR[side]}, transparent, ${tint})` }} />}
        </div>
    );
};

export default EdgeBlur;
