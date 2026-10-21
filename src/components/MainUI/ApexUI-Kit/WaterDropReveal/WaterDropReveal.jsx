import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

/*
 * Mask View: three ways to reveal content through a mask.
 *   variant="window"    – big letters are a window onto an image; it pans with the pointer, tap opens it fully.
 *   variant="spotlight" – near-hidden text lit by a soft spotlight that follows the pointer (wanders on its own when idle).
 *   variant="wipe"      – text under steamed-up glass; wipe it clear with the pointer or a finger, it slowly fogs back.
 */

const DEFAULT_IMAGE = "https://ik.imagekit.io/ny6yinyut/apexui/assets/ironman.png?updatedAt=1792562203671";
const DEFAULT_TEXT = {
    window: "MASK\nVIEW",
    spotlight: "Look through the mask.\nOnly what sits under the light\ncomes into focus.",
    wipe: "Wipe the glass.\nThe words underneath\nare waiting for you.",
};

const textClass = "text-center text-2xl sm:text-4xl font-semibold leading-tight tracking-tight";

const Lines = ({ text }) => text.split("\n").map((line, i) => <span key={i} className="block">{line}</span>);

// Shared card: dark panel, corner label and a hint that hides while the effect is in use.
const Frame = ({ boxRef, accent, label, hint, active, className = "", children, ...handlers }) => (
    <div
        ref={boxRef}
        className={`relative isolate w-full max-w-2xl min-h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-[#07070c] select-none ${className}`}
        {...handlers}
    >
        <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        {children}
        <span className="pointer-events-none absolute left-5 top-4 z-30 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            {label}
        </span>
        <span
            className={`pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs text-white/65 backdrop-blur-md transition-all duration-500 ${active ? "translate-y-3 opacity-0" : "opacity-100"}`}
        >
            {hint}
        </span>
    </div>
);

/* ---------------------------------------------------------------- window */
const TextWindow = ({ text, image, accent, speed }) => {
    const boxRef = useRef(null);
    const pan = useRef({ x: 50, y: 50 });
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });

    const paint = () => {
        boxRef.current?.style.setProperty("--px", `${pan.current.x}%`);
        boxRef.current?.style.setProperty("--py", `${pan.current.y}%`);
    };
    useEffect(() => {
        const state = pan.current;
        paint();
        return () => gsap.killTweensOf(state);
    }, []);

    const handleMove = (e) => {
        const rect = boxRef.current.getBoundingClientRect();
        // Pan the image the opposite way to the pointer, for a little depth.
        gsap.to(pan.current, {
            x: 100 - ((e.clientX - rect.left) / rect.width) * 100,
            y: 100 - ((e.clientY - rect.top) / rect.height) * 100,
            duration: speed * 2,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: paint,
        });
    };
    const handleLeave = () => {
        setHovered(false);
        gsap.to(pan.current, { x: 50, y: 50, duration: 0.9, ease: "power3.out", onUpdate: paint });
    };
    const handleClick = (e) => {
        const rect = boxRef.current.getBoundingClientRect();
        setOrigin({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        setOpen((o) => !o);
    };

    return (
        <Frame
            boxRef={boxRef}
            accent={accent}
            label="Mask View"
            hint={open ? "Tap to close" : "Move to pan · tap to open"}
            active={hovered && !open}
            className="cursor-pointer touch-pan-y"
            onPointerEnter={() => setHovered(true)}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            onClick={handleClick}
        >
            {/* Full image, opened with a circle from the tap point */}
            <div
                className="absolute inset-0 z-10 transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{
                    backgroundImage: `url("${image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "var(--px) var(--py)",
                    clipPath: `circle(${open ? "150%" : "0%"} at ${origin.x}% ${origin.y}%)`,
                }}
            />
            {/* Letters as the window */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <p
                    className={`text-center text-[clamp(4rem,19vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] transition-[color,text-shadow] duration-500 ${open ? "text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.6)]" : "text-transparent"}`}
                    style={open ? undefined : {
                        backgroundImage: `url("${image}")`,
                        backgroundSize: "180%",
                        backgroundPosition: "var(--px) var(--py)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextStroke: "1px rgba(255,255,255,0.12)",
                    }}
                >
                    <Lines text={text} />
                </p>
            </div>
        </Frame>
    );
};

/* ------------------------------------------------------------- spotlight */
const Spotlight = ({ text, accent, speed }) => {
    const boxRef = useRef(null);
    const light = useRef({ x: 0, y: 0, r: 0 });
    const idle = useRef(null);
    const [active, setActive] = useState(false);

    const paint = () => {
        const el = boxRef.current;
        if (!el) return;
        el.style.setProperty("--x", `${light.current.x}px`);
        el.style.setProperty("--y", `${light.current.y}px`);
        el.style.setProperty("--r", `${light.current.r}px`);
    };

    // When nobody is pointing, the light drifts slowly across the text.
    const startIdle = () => {
        const el = boxRef.current;
        if (!el) return;
        const w = el.offsetWidth, h = el.offsetHeight;
        idle.current?.kill();
        idle.current = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.6, ease: "sine.inOut", onUpdate: paint } })
            .to(light.current, { x: w * 0.3, y: h * 0.42, r: Math.min(120, w * 0.22) })
            .to(light.current, { x: w * 0.7, y: h * 0.58 });
    };

    useEffect(() => {
        const el = boxRef.current;
        const state = light.current;
        if (!el) return;
        state.x = el.offsetWidth * 0.3;
        state.y = el.offsetHeight * 0.42;
        paint();
        startIdle();
        return () => {
            idle.current?.kill();
            gsap.killTweensOf(state);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEnter = () => {
        setActive(true);
        idle.current?.kill();
        const w = boxRef.current.offsetWidth;
        gsap.to(light.current, { r: Math.min(170, w * 0.3), duration: 0.6, ease: "power3.out", onUpdate: paint });
    };
    const handleMove = (e) => {
        if (!active) handleEnter();
        const rect = boxRef.current.getBoundingClientRect();
        gsap.to(light.current, { x: e.clientX - rect.left, y: e.clientY - rect.top, duration: speed, ease: "power3.out", overwrite: "auto", onUpdate: paint });
    };
    const handleLeave = () => {
        setActive(false);
        startIdle();
    };

    const mask = "radial-gradient(circle var(--r) at var(--x) var(--y), #000 0%, rgba(0,0,0,0.85) 35%, transparent 100%)";

    return (
        <Frame
            boxRef={boxRef}
            accent={accent}
            label="Spotlight"
            hint="Hover or touch to shine the light"
            active={active}
            className="cursor-none touch-pan-y"
            onPointerEnter={handleEnter}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            onPointerCancel={handleLeave}
        >
            {/* Text in the dark */}
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
                <p className={`${textClass} text-white/[0.07]`}><Lines text={text} /></p>
            </div>
            {/* Lit text */}
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10" style={{ WebkitMaskImage: mask, maskImage: mask }} aria-hidden="true">
                <p className={`${textClass} text-white`}><Lines text={text} /></p>
            </div>
            {/* Faint pool of light on the surface */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(circle calc(var(--r) * 1.4) at var(--x) var(--y), rgba(255,255,255,0.05), transparent 70%)" }}
            />
        </Frame>
    );
};

/* ------------------------------------------------------------------ wipe */
const FOG = "#10101a";

const WipeReveal = ({ text, accent }) => {
    const boxRef = useRef(null);
    const canvasRef = useRef(null);
    const last = useRef(null);
    const regrowUntil = useRef(0);
    const frame = useRef(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const box = boxRef.current;
        if (!canvas || !box) return;
        const ctx = canvas.getContext("2d");

        const fill = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = box.offsetWidth * dpr;
            canvas.height = box.offsetHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = FOG;
            ctx.fillRect(0, 0, box.offsetWidth, box.offsetHeight);
        };
        fill();
        const ro = new ResizeObserver(fill);
        ro.observe(box);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(frame.current);
        };
    }, []);

    // Fog creeps back over cleared glass for a few seconds after the last wipe.
    const regrow = () => {
        const canvas = canvasRef.current;
        const box = boxRef.current;
        if (!canvas || !box) return;
        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.018;
        ctx.fillStyle = FOG;
        ctx.fillRect(0, 0, box.offsetWidth, box.offsetHeight);
        ctx.globalAlpha = 1;
        frame.current = performance.now() < regrowUntil.current ? requestAnimationFrame(regrow) : 0;
    };

    const wipe = (x, y) => {
        const ctx = canvasRef.current.getContext("2d");
        const radius = Math.max(36, Math.min(60, boxRef.current.offsetWidth * 0.09));
        const from = last.current ?? { x, y };
        const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (radius / 3)));
        ctx.globalCompositeOperation = "destination-out";
        // Stamp soft brush dots along the path so fast moves leave no gaps.
        for (let i = 1; i <= steps; i++) {
            const px = from.x + ((x - from.x) * i) / steps;
            const py = from.y + ((y - from.y) * i) / steps;
            const brush = ctx.createRadialGradient(px, py, 0, px, py, radius);
            brush.addColorStop(0, "rgba(0,0,0,0.9)");
            brush.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = brush;
            ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
        }
        last.current = { x, y };
        regrowUntil.current = performance.now() + 4000;
        if (!frame.current) frame.current = requestAnimationFrame(regrow);
    };

    const handleMove = (e) => {
        const rect = boxRef.current.getBoundingClientRect();
        setActive(true);
        wipe(e.clientX - rect.left, e.clientY - rect.top);
    };
    const handleLeave = () => {
        last.current = null;
        setActive(false);
    };

    return (
        <Frame
            boxRef={boxRef}
            accent={accent}
            label="Wipe Reveal"
            hint="Wipe the glass with your pointer or finger"
            active={active}
            className="cursor-crosshair touch-pan-y"
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            onPointerCancel={handleLeave}
        >
            {/* Clear text under the glass */}
            <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
                <p className={`${textClass} text-white`}><Lines text={text} /></p>
            </div>
            {/* Steam on the glass */}
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.93]" />
            {/* Condensation droplets */}
            <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.5px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1.5px)",
                    backgroundSize: "23px 29px, 37px 31px",
                    backgroundPosition: "0 0, 11px 7px",
                }}
            />
        </Frame>
    );
};

const WaterDropReveal = ({
    variant = "spotlight",
    text,
    image = DEFAULT_IMAGE,
    dropColor = "#a855f7",
    animationSpeed = 0.4,
}) => {
    const kind = DEFAULT_TEXT[variant] ? variant : "spotlight";
    const content = text ?? DEFAULT_TEXT[kind];
    if (kind === "window") return <TextWindow text={content} image={image} accent={dropColor} speed={animationSpeed} />;
    if (kind === "wipe") return <WipeReveal text={content} accent={dropColor} />;
    return <Spotlight text={content} accent={dropColor} speed={animationSpeed} />;
};

export default WaterDropReveal;
