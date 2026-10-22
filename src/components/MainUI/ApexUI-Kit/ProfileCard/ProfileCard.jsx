import React, { useEffect, useId, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check, Github, Linkedin, MapPin, Plus, Twitter } from "lucide-react";

/*
 * Profile Card: one profile, two looks.
 *  card    – cover, avatar, bio, stats, socials and a Follow button, with a soft 3D tilt
 *  lanyard – the same person as an ID badge hanging from a ribbon; drag it and
 *            let go to watch it swing back like a pendulum
 */

const DEFAULT_PROFILE = {
    name: "Mohan Dalei",
    role: "Frontend Engineer",
    company: "ApexUI",
    location: "Bhubaneswar, India",
    bio: "Building animated React components that feel alive. Coffee, motion and clean code.",
    avatar: "https://ik.imagekit.io/ny6yinyut/apexui/assets/black-panther.png?tr=f-auto,q-80,w-320",
    id: "APX-0042",
    stats: [
        { label: "Projects", value: "48" },
        { label: "Followers", value: "12.8k" },
        { label: "Stars", value: "3.2k" },
    ],
    socials: [
        { icon: Github, href: "#", label: "GitHub" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
    ],
};

// Stable pseudo-random barcode bars from a string.
const barsFrom = (seed) => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return Array.from({ length: 34 }, (_, i) => 1 + (((h >>> (i % 24)) ^ (i * 7)) & 3));
};

function CardVariant({ p, color, theme }) {
    const [following, setFollowing] = useState(false);
    const reduced = useReducedMotion();
    const rx = useSpring(0, { stiffness: 200, damping: 20 });
    const ry = useSpring(0, { stiffness: 200, damping: 20 });
    const dark = theme !== "light";

    const onMove = (e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };

    return (
        <div style={{ perspective: 1000 }}>
            <motion.article
                onPointerMove={onMove}
                onPointerLeave={() => {
                    rx.set(0);
                    ry.set(0);
                }}
                style={{ rotateX: rx, rotateY: ry }}
                className={`w-[min(21rem,88vw)] overflow-hidden rounded-3xl border shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"}`}
            >
                <div className="relative h-24" style={{ background: `radial-gradient(120% 140% at 0% 0%, ${color}, transparent 60%), radial-gradient(120% 140% at 100% 0%, #6366f1, transparent 60%), ${dark ? "#111" : "#eee"}` }}>
                    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:12px_12px]" />
                </div>
                <div className="px-6 pb-6">
                    <div className="-mt-11 flex items-end justify-between">
                        <div className="relative">
                            <img src={p.avatar} alt="" className={`h-[5.5rem] w-[5.5rem] rounded-full object-cover ring-4 ${dark ? "bg-neutral-800 ring-neutral-950" : "bg-neutral-200 ring-white"}`} />
                            <span className={`absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-[3px] ${dark ? "ring-neutral-950" : "ring-white"}`} aria-label="Online" />
                        </div>
                        <motion.button
                            type="button"
                            onClick={() => setFollowing((f) => !f)}
                            whileTap={{ scale: 0.94 }}
                            layout
                            className="mb-1 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[0.8rem] font-semibold"
                            style={following ? { background: "transparent", color: dark ? "#fff" : "#111", boxShadow: `inset 0 0 0 1.5px ${dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.2)"}` } : { background: color, color: "#0a0a0a" }}
                        >
                            {following ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            {following ? "Following" : "Follow"}
                        </motion.button>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-tight">{p.name}</h3>
                    <p className={`text-[0.85rem] ${dark ? "text-white/55" : "text-neutral-500"}`}>
                        {p.role} · {p.company}
                    </p>
                    {p.location && (
                        <p className={`mt-1 flex items-center gap-1 text-[0.78rem] ${dark ? "text-white/45" : "text-neutral-400"}`}>
                            <MapPin className="h-3.5 w-3.5" /> {p.location}
                        </p>
                    )}
                    {p.bio && <p className={`mt-3 text-[0.85rem] leading-relaxed ${dark ? "text-white/75" : "text-neutral-600"}`}>{p.bio}</p>}
                    <dl className={`mt-4 grid grid-cols-3 divide-x rounded-2xl py-3 text-center ${dark ? "divide-white/10 bg-white/[0.04]" : "divide-black/10 bg-black/[0.03]"}`}>
                        {p.stats?.map((s) => (
                            <div key={s.label}>
                                <dd className="text-[1rem] font-semibold">{s.value}</dd>
                                <dt className={`text-[0.7rem] ${dark ? "text-white/45" : "text-neutral-500"}`}>{s.label}</dt>
                            </div>
                        ))}
                    </dl>
                    <div className="mt-4 flex gap-2">
                        {p.socials?.map(({ icon: Icon, href, label }) => (
                            <a key={label} href={href} aria-label={label} className={`grid h-9 w-9 place-items-center rounded-full transition hover:-translate-y-0.5 ${dark ? "bg-white/[0.06] hover:bg-white/[0.12]" : "bg-black/[0.04] hover:bg-black/[0.08]"}`}>
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </motion.article>
        </div>
    );
}

function LanyardVariant({ p, color, theme, strapLength }) {
    const pathId = `strap-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(reduced ? 0 : -140);
    const length = strapLength * 16;
    const bars = useMemo(() => barsFrom(p.id || p.name), [p.id, p.name]);
    const dark = theme !== "light";
    const swing = { type: "spring", stiffness: 90, damping: 5, mass: 1 };

    // Drop in on mount.
    useEffect(() => {
        if (reduced) return undefined;
        const a = animate(y, 0, { type: "spring", stiffness: 120, damping: 9 });
        return () => a.stop();
    }, [reduced, y]);

    // The badge hangs along the strap, so its angle follows its offset.
    const rotate = useTransform([x, y], ([vx, vy]) => (-Math.atan2(vx, Math.max(40, length + vy)) * 180) / Math.PI);
    const d = useTransform([x, y], ([vx, vy]) => {
        const ex = 160 + vx;
        const ey = length + vy;
        return `M160 0 Q ${160 + vx * 0.35} ${ey * 0.55} ${ex} ${ey}`;
    });

    return (
        <div className="relative flex w-[20rem] max-w-full justify-center" style={{ height: `${strapLength + 22}rem` }}>
            <svg className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 overflow-visible" width="320" height={length + 40} aria-hidden="true">
                <defs>
                    <motion.path id={pathId} d={d} />
                </defs>
                <motion.path d={d} fill="none" stroke={color} strokeWidth="26" strokeLinecap="butt" />
                <motion.path d={d} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="26" strokeDasharray="2 10" />
                <text fontSize="11" fontWeight="800" letterSpacing="3" fill="#0a0a0a" dy="4">
                    <textPath href={`#${pathId}`} startOffset="8">
                        {`${(p.company || "APEXUI").toUpperCase()} • `.repeat(6)}
                    </textPath>
                </text>
                <rect x="148" y="-6" width="24" height="14" rx="3" fill={dark ? "#2a2a2a" : "#bbb"} />
            </svg>

            <motion.div
                drag
                dragMomentum={false}
                onDragEnd={() => {
                    animate(x, 0, swing);
                    animate(y, 0, swing);
                }}
                whileDrag={{ cursor: "grabbing" }}
                className="absolute left-1/2 cursor-grab touch-none"
                style={{ x, y, rotate, top: length, marginLeft: "-7.25rem", transformOrigin: "50% 0%" }}
            >
                {/* Metal clip */}
                <div className="mx-auto h-5 w-9 rounded-b-md rounded-t-sm bg-gradient-to-b from-neutral-300 to-neutral-500 shadow-inner" />
                <article className={`-mt-1 w-[14.5rem] overflow-hidden rounded-2xl border shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] ${dark ? "border-white/10 bg-neutral-950 text-white" : "border-black/10 bg-white text-neutral-900"}`}>
                    <div className="relative h-16 px-4 pt-3" style={{ background: color }}>
                        <span className="mx-auto block h-2.5 w-12 rounded-full bg-black/25" aria-hidden="true" />
                        <p className="mt-2 flex items-center justify-between text-[0.7rem] font-black uppercase tracking-[0.2em] text-black/80">
                            <span>{p.company}</span>
                            <span>Staff</span>
                        </p>
                    </div>
                    <div className="px-5 pb-5">
                        <img src={p.avatar} alt="" draggable="false" className={`relative -mt-8 h-24 w-24 rounded-2xl object-cover ring-4 ${dark ? "bg-neutral-800 ring-neutral-950" : "bg-neutral-200 ring-white"}`} />
                        <h3 className="mt-3 text-[1.05rem] font-bold leading-tight">{p.name}</h3>
                        <p className={`text-[0.78rem] ${dark ? "text-white/55" : "text-neutral-500"}`}>{p.role}</p>
                        <div className={`mt-3 grid grid-cols-2 gap-2 text-[0.68rem] ${dark ? "text-white/45" : "text-neutral-500"}`}>
                            <div>
                                <p className="uppercase tracking-wider">ID</p>
                                <p className={`font-mono text-[0.78rem] font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>{p.id}</p>
                            </div>
                            <div>
                                <p className="uppercase tracking-wider">Location</p>
                                <p className={`truncate text-[0.78rem] font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>{p.location?.split(",")[0]}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex h-9 items-stretch gap-[2px]" aria-hidden="true">
                            {bars.map((w, i) => (
                                <span key={i} className={dark ? "bg-white/80" : "bg-neutral-900"} style={{ width: w, opacity: i % 5 === 0 ? 0.5 : 1 }} />
                            ))}
                        </div>
                    </div>
                </article>
            </motion.div>
        </div>
    );
}

const ProfileCard = ({ variant = "card", profile = DEFAULT_PROFILE, color = "#a3e635", theme = "dark", strapLength = 10, className = "" }) => {
    const p = { ...DEFAULT_PROFILE, ...profile };
    return (
        <div className={`flex justify-center ${className}`}>
            {variant === "lanyard" ? <LanyardVariant p={p} color={color} theme={theme} strapLength={strapLength} /> : <CardVariant p={p} color={color} theme={theme} />}
        </div>
    );
};

export default ProfileCard;
