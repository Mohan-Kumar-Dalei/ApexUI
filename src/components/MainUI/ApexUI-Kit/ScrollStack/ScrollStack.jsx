import React, { Children, useLayoutEffect, useRef } from "react";

/*
 * Scroll Stack: cards pin one after another as you scroll and pile up. A
 * card that gets covered shrinks a little, darkens and (optionally) blurs or
 * leans back, so the pile reads as depth. It rides on native scrolling
 * (position: sticky + one rAF update per scroll), so it stays smooth with
 * mouse, trackpad, touch and keyboard. Scrolls inside its own box, or with
 * the page (useWindowScroll).
 */

export const ScrollStackItem = ({ children, className = "", style }) => (
    <div className={`relative h-[18rem] w-full origin-top overflow-hidden rounded-[1.75rem] p-8 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)] will-change-transform ${className}`} style={style}>
        {children}
        <span data-stack-shade="" aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black opacity-0" />
    </div>
);

const ScrollStack = ({ children, gap = 90, offset = 22, top = 64, scaleStep = 0.05, minScale = 0.82, dim = 0.22, blur = 0, tilt = 0, endSpace = 180, useWindowScroll = false, height = "100%", className = "" }) => {
    const root = useRef(null);
    const slots = useRef([]);
    const items = Children.toArray(children);

    useLayoutEffect(() => {
        const box = root.current;
        const scroller = useWindowScroll ? window : box;
        let raf = 0;
        const update = () => {
            raf = 0;
            const els = slots.current.filter(Boolean);
            const viewTop = useWindowScroll ? 0 : box.getBoundingClientRect().top;
            const rects = els.map((e) => e.getBoundingClientRect());
            // How much each later card covers the one before it (0 to 1).
            const depth = els.map(() => 0);
            for (let j = 1; j < els.length; j++) {
                const pinPrev = viewTop + top + (j - 1) * offset;
                const startCover = pinPrev + rects[j - 1].height;
                const span = Math.max(1, rects[j - 1].height - offset);
                const cover = Math.min(1, Math.max(0, (startCover - rects[j].top) / span));
                for (let i = 0; i < j; i++) depth[i] += cover;
            }
            els.forEach((slot, i) => {
                const card = slot.firstElementChild;
                if (!card) return;
                const d = depth[i];
                const scale = Math.max(minScale, 1 - d * scaleStep);
                const lean = Math.min(1, d) * tilt;
                card.style.transform = d > 0.001 ? `perspective(1000px) rotateX(${-lean}deg) scale(${scale.toFixed(4)})` : "";
                card.style.filter = blur && d > 0.01 ? `blur(${(d * blur).toFixed(2)}px)` : "";
                const shade = card.querySelector("[data-stack-shade]");
                if (shade) shade.style.opacity = (1 - Math.pow(1 - dim, d)).toFixed(3);
            });
        };
        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        scroller.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        const ro = new ResizeObserver(schedule);
        ro.observe(box);
        update();
        return () => {
            cancelAnimationFrame(raf);
            scroller.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            ro.disconnect();
        };
    }, [useWindowScroll, top, offset, scaleStep, minScale, dim, blur, tilt, items.length]);

    return (
        <div ref={root} className={`relative w-full ${useWindowScroll ? "" : "overflow-y-auto overscroll-contain"} ${className}`} style={useWindowScroll ? undefined : { height }}>
            <div className="px-[clamp(1rem,6%,4rem)]" style={{ paddingTop: useWindowScroll ? 0 : top, paddingBottom: endSpace }}>
                {items.map((child, i) => (
                    <div
                        key={i}
                        ref={(e) => (slots.current[i] = e)}
                        className="sticky"
                        style={{ top: top + i * offset, marginTop: i ? gap : 0, zIndex: i + 1 }}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrollStack;
