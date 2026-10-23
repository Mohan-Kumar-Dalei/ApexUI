import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Accordion Marquee: a list of big rows with one colored band that glides
 * from row to row under the pointer. The band's two edges ride separate
 * springs (the leading edge is quicker), so it stretches like liquid as it
 * travels and snaps back when it lands; it also leans a little toward the
 * pointer. Inside the band each row's marquee scrolls, and moving the mouse
 * sideways speeds it up or turns it around. Works with touch (tap a row)
 * and keyboard (Tab through the rows).
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage";
const shot = (n) => `${IK}/${n}.png?tr=f-auto,q-70,w-420`;
const DEFAULT_ITEMS = [
    { title: "Cybernetic Dreams", text: "Explore the future", image: shot("galaxy-3d") },
    { title: "Quantum Leap", text: "Journey through spacetime", image: shot("warp-tunnel") },
    { title: "Neural Networks", text: "Unravel complexity", image: shot("particle-morph") },
    { title: "Digital Odyssey", text: "Voyage into the digital world", image: shot("retro-grid-3d") },
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const SHAPES = { pill: "rounded-full aspect-[2.2/1]", rounded: "rounded-[14cqh] aspect-[3/2]", circle: "rounded-full aspect-square" };

const Part = ({ item, shape }) => (
    <div className="flex h-full shrink-0 items-center">
        <span className="whitespace-nowrap px-[0.45em] text-[clamp(0.95rem,min(36cqh,7.5cqw),6rem)] font-semibold leading-none tracking-[-0.02em]">{item.text ?? item.title}</span>
        {item.image ? <span className={`mx-[3cqh] block h-[58cqh] shrink-0 bg-cover bg-center ${shape}`} style={{ backgroundImage: `url(${item.image})` }} /> : <span className="mx-[0.3em] text-[clamp(0.8rem,24cqh,3rem)] leading-none opacity-70">✦</span>}
    </div>
);

const AccordionMarquee = ({
    items = DEFAULT_ITEMS,
    speed = 70,
    direction = "left",
    cursorBoost = 0.5,
    duration = 0.5,
    stretch = 0.6,
    magnet = 0.2,
    bgColor = "#bbf451",
    textColor = "#18181b",
    menuBg = "#0f0f12",
    menuColor = "#fafafa",
    lineColor = "rgba(255,255,255,0.14)",
    inset = 0,
    radius = 0,
    imageShape = "pill",
    showIndex = false,
    dimOthers = false,
    intro = true,
    height = "32rem",
    onSelect,
    className = "",
}) => {
    const root = useRef(null);
    const list = useRef(null);
    const bandRef = useRef(null);
    const rowEls = useRef([]);
    const strips = useRef([]);
    const [copies, setCopies] = useState([]);
    const live = useRef({});
    live.current = { speed, direction, cursorBoost, duration, stretch, magnet, inset, radius, dimOthers, onSelect };
    const engine = useRef(null);
    const list_ = items.length ? items : DEFAULT_ITEMS;

    useLayoutEffect(() => {
        const nav = root.current;
        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const rows = [];
        const runs = [];
        const b = { on: false, index: -1, top: 0, bot: 0, vTop: 0, vBot: 0, tTop: 0, tBot: 0, lead: 1 };
        const cur = { x: 0, y: null, t: 0, vx: 0 };
        let raf = 0;
        let last = 0;
        let visible = true;

        const mark = () => {
            rowEls.current.forEach((li, i) => {
                if (!li) return;
                li.toggleAttribute("data-active", i === b.index);
                li.toggleAttribute("data-dim", live.current.dimOthers && b.index >= 0 && i !== b.index);
            });
        };

        const paint = () => {
            const band = bandRef.current;
            if (!band) return;
            const H = list.current?.clientHeight ?? 0;
            const o = live.current;
            const tall = b.bot - b.top;
            if (!b.on || tall < 0.3) {
                band.style.visibility = "hidden";
                return;
            }
            const side = clamp(o.inset, 0, 40);
            const r = Math.min(o.radius, tall / 2);
            band.style.visibility = "visible";
            band.style.clipPath = `inset(${b.top.toFixed(2)}px ${side}px ${(H - b.bot).toFixed(2)}px ${side}px round ${r.toFixed(2)}px)`;
            runs.forEach((run, i) => {
                const track = strips.current[i]?.firstElementChild;
                if (track && run.spin > 0) track.style.transform = `translate3d(${run.x.toFixed(2)}px,0,0)`;
            });
        };

        const frame = (now) => {
            raf = 0;
            const o = live.current;
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            let busy = false;

            if (b.on) {
                const row = rows[b.index];
                if (row) {
                    const ins = Math.min(o.inset, row.h / 2 - 2);
                    const lean = cur.y === null || reduced ? 0 : clamp((cur.y - (row.top + row.h / 2)) * o.magnet, -row.h * 0.3, row.h * 0.3);
                    b.tTop = row.top + ins + lean;
                    b.tBot = row.top + row.h - ins + lean;
                }
                const move = (b.tTop + b.tBot) / 2 - (b.top + b.bot) / 2;
                if (Math.abs(move) > 1) b.lead = Math.sign(move);
                if (reduced) {
                    b.top = b.tTop;
                    b.bot = b.tBot;
                    b.vTop = b.vBot = 0;
                } else {
                    // Two springs: the edge heading the move is stiffer, the trailing one lags.
                    const w = (Math.PI * 2) / Math.max(0.1, o.duration);
                    const quick = w * (1 + o.stretch);
                    const lazy = w * (1 - 0.55 * o.stretch);
                    const wTop = b.lead > 0 ? lazy : quick;
                    const wBot = b.lead > 0 ? quick : lazy;
                    const n = Math.ceil(dt * 240);
                    const h = dt / n;
                    for (let k = 0; k < n; k++) {
                        b.vTop += (-wTop * wTop * (b.top - b.tTop) - 1.8 * wTop * b.vTop) * h;
                        b.vBot += (-wBot * wBot * (b.bot - b.tBot) - 1.8 * wBot * b.vBot) * h;
                        b.top += b.vTop * h;
                        b.bot += b.vBot * h;
                        if (b.bot < b.top) {
                            const mid = (b.top + b.bot) / 2;
                            const v = (b.vTop + b.vBot) / 2;
                            b.top = b.bot = mid;
                            b.vTop = b.vBot = v;
                        }
                    }
                }
                const still = Math.abs(b.top - b.tTop) < 0.1 && Math.abs(b.bot - b.tBot) < 0.1 && Math.abs(b.vTop) + Math.abs(b.vBot) < 3;
                if (still) {
                    b.top = b.tTop;
                    b.bot = b.tBot;
                    b.vTop = b.vBot = 0;
                    if (b.index < 0) b.on = false;
                } else busy = true;
            }

            // Marquees: only the rows the band covers run, easing in and out.
            cur.vx *= Math.exp(-dt / 0.3);
            const push = clamp(cur.vx * o.cursorBoost * 0.5, -1500, 1500);
            runs.forEach((run, i) => {
                const row = rows[i];
                const covered = b.on && row && Math.min(b.bot, row.top + row.h) - Math.max(b.top, row.top) > row.h * 0.04;
                const goal = covered ? 1 : 0;
                run.spin += (goal - run.spin) * (1 - Math.exp(-dt / 0.3));
                if (Math.abs(goal - run.spin) < 0.003) run.spin = goal;
                if (!run.spin) return;
                busy = true;
                if (!run.part || reduced) return;
                const way = o.direction === "right" ? 1 : o.direction === "alternate" && i % 2 ? 1 : -1;
                run.x += (way * o.speed + push) * run.spin * dt;
                run.x = (((run.x % run.part) + run.part) % run.part) - run.part;
            });

            paint();
            if (busy && visible) raf = requestAnimationFrame(frame);
            else last = 0;
        };
        const wake = () => {
            if (!raf && visible) raf = requestAnimationFrame(frame);
        };

        const measure = () => {
            rows.length = 0;
            rowEls.current.forEach((li, i) => {
                if (!li) return;
                rows[i] = { top: li.offsetTop, h: li.offsetHeight };
                const strip = strips.current[i];
                if (strip) {
                    strip.style.top = `${li.offsetTop}px`;
                    strip.style.height = `${li.offsetHeight}px`;
                }
                runs[i] = runs[i] || { x: 0, part: 0, spin: 0 };
            });
            const need = rows.map((row, i) => {
                const part = strips.current[i]?.firstElementChild?.firstElementChild;
                const pw = part?.getBoundingClientRect().width ?? 0;
                const run = runs[i];
                if (pw > 0) {
                    run.part = pw;
                    run.x = (((run.x % pw) + pw) % pw) - pw;
                }
                return pw > 0 ? Math.ceil((list.current?.clientWidth ?? 0) / pw) + 2 : 3;
            });
            setCopies((c) => (c.length === need.length && c.every((v, i) => v === need[i]) ? c : need));
            if (b.on && b.index >= 0) wake();
            paint();
        };

        const rowAt = (y) => rows.findIndex((r) => r && y >= r.top && y < r.top + r.h);
        const goTo = (i, fromY) => {
            const row = rows[i];
            if (!row) return;
            if (!b.on) {
                // Grow out of the edge the pointer came in from.
                const start = fromY !== undefined && fromY > row.top + row.h / 2 ? row.top + row.h : row.top;
                b.top = b.bot = start;
                b.vTop = b.vBot = 0;
                b.on = true;
            }
            b.index = i;
            mark();
            wake();
        };
        const release = (toward) => {
            if (!b.on) return;
            const p = toward === "top" ? b.tTop : toward === "bottom" ? b.tBot : (b.tTop + b.tBot) / 2;
            b.tTop = b.tBot = p;
            b.index = -1;
            cur.y = null;
            mark();
            wake();
        };

        const ul = list.current;
        const localY = (e) => e.clientY - ul.getBoundingClientRect().top;
        const onMove = (e) => {
            if (e.pointerType === "touch") return;
            const now = performance.now();
            const gap = (now - cur.t) / 1000;
            if (gap > 0 && gap < 0.1) cur.vx += ((e.clientX - cur.x) / gap - cur.vx) * (1 - Math.exp(-gap / 0.08));
            cur.x = e.clientX;
            cur.t = now;
            cur.y = localY(e);
            const i = rowAt(cur.y);
            if (i >= 0 && i !== b.index) goTo(i, cur.y);
            else wake();
        };
        const onLeave = (e) => {
            if (e.pointerType === "touch" || b.index < 0) return;
            const y = localY(e);
            const row = rows[b.index];
            release(y <= 0 ? "top" : y >= ul.clientHeight ? "bottom" : row && y < row.top + row.h / 2 ? "top" : "bottom");
        };
        const onDown = (e) => {
            if (e.pointerType !== "touch") return;
            const y = localY(e);
            const i = rowAt(y);
            if (i >= 0) goTo(i, y);
        };
        ul.addEventListener("pointermove", onMove);
        ul.addEventListener("pointerleave", onLeave);
        ul.addEventListener("pointerdown", onDown);
        engine.current = { goTo, release };

        const ro = new ResizeObserver(measure);
        ro.observe(nav);
        const io = new IntersectionObserver(([en]) => {
            visible = en.isIntersecting;
            if (visible) wake();
        });
        io.observe(nav);
        measure();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            ul.removeEventListener("pointermove", onMove);
            ul.removeEventListener("pointerleave", onLeave);
            ul.removeEventListener("pointerdown", onDown);
            engine.current = null;
        };
    }, [list_.length]);

    // Rows rise in and the lines draw once on mount.
    useEffect(() => {
        const nav = root.current;
        if (!intro || !nav || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
        const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
        const anims = [
            ...[...nav.querySelectorAll("[data-rise]")].map((el, i) => el.animate([{ transform: "translateY(105%)" }, { transform: "none" }], { duration: 850, delay: 80 + i * 80, easing: ease, fill: "backwards" })),
            ...[...nav.querySelectorAll("[data-rule]")].map((el, i) => el.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: 1000, delay: i * 80, easing: ease, fill: "backwards" })),
        ];
        return () => anims.forEach((a) => a.cancel());
    }, [intro]);

    const shape = SHAPES[imageShape] ?? SHAPES.pill;

    return (
        <nav ref={root} aria-label="Menu" className={`relative w-full select-none overflow-hidden ${className}`} style={{ height, background: menuBg, color: menuColor }}>
            <ul ref={list} className="relative m-0 flex h-full list-none flex-col p-0">
                {list_.map((item, i) => {
                    const Tag = item.href ? "a" : "button";
                    return (
                        <li key={i} ref={(e) => (rowEls.current[i] = e)} className="group relative min-h-[3.5rem] flex-1 overflow-hidden [container-type:size]">
                            {i > 0 && <span data-rule="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left" style={{ background: lineColor }} />}
                            <Tag
                                {...(item.href ? { href: item.href } : { type: "button" })}
                                onFocus={(e) => e.currentTarget.matches(":focus-visible") && engine.current?.goTo(i)}
                                onBlur={(e) => !list.current?.contains(e.relatedTarget) && engine.current?.release("bottom")}
                                onClick={(e) => live.current.onSelect?.(item, i, e)}
                                className={`relative flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent ${showIndex ? "px-[clamp(2.4rem,10cqw,5rem)]" : "px-[clamp(1rem,4cqw,2.5rem)]"} text-inherit no-underline outline-none transition-opacity duration-500 group-data-[dim]:opacity-30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current`}
                            >
                                {showIndex && <span className="absolute left-[clamp(1rem,4cqw,2.5rem)] font-mono text-[clamp(0.65rem,11cqh,0.9rem)] tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>}
                                <span className="block overflow-hidden py-[0.06em]">
                                    <span data-rise="" className="block whitespace-nowrap text-[clamp(1rem,min(38cqh,7cqw),6.5rem)] font-semibold uppercase leading-[1.05] tracking-[-0.02em]">
                                        {item.title}
                                    </span>
                                </span>
                            </Tag>
                        </li>
                    );
                })}
            </ul>
            <div ref={bandRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" style={{ background: bgColor, color: textColor, visibility: "hidden", clipPath: "inset(50% 0 50% 0)" }}>
                {list_.map((item, i) => (
                    <div key={i} ref={(e) => (strips.current[i] = e)} className="absolute inset-x-0 overflow-hidden [container-type:size]">
                        <div className="flex h-full w-max items-center will-change-transform">
                            {Array.from({ length: copies[i] ?? 3 }, (_, k) => (
                                <Part key={k} item={item} shape={shape} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default AccordionMarquee;
