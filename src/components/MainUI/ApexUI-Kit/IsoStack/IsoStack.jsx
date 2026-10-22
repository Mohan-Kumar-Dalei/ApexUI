import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Database, Layout, Server, Shield } from "lucide-react";

/*
 * Iso Stack: layers drawn in isometric 3D, stacked like a sandwich. Hover
 * (or tap) and the stack fans open so each layer's label shows; hover one
 * layer to lift it out. Great for architecture or feature diagrams.
 */

const DEFAULT_LAYERS = [
    { label: "Interface", note: "React + Tailwind", icon: Layout, color: "#a3e635" },
    { label: "Edge", note: "CDN & caching", icon: Cloud, color: "#38bdf8" },
    { label: "Security", note: "Auth & rate limits", icon: Shield, color: "#a78bfa" },
    { label: "API", note: "Node services", icon: Server, color: "#f59e0b" },
    { label: "Data", note: "Postgres + Redis", icon: Database, color: "#f43f5e" },
];

const IsoStack = ({ layers = DEFAULT_LAYERS, size = 13, gap = 1.6, theme = "dark", className = "" }) => {
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(-1);
    const dark = theme !== "light";
    const n = layers.length;

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ height: `${size * 0.6 + n * gap * 1.6 + 6}rem`, width: "100%" }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
            onPointerLeave={() => {
                setOpen(false);
                setHover(-1);
            }}
            onClick={() => setOpen((o) => !o)}
        >
            {/* Shifted down so the fully opened stack stays inside the frame. */}
            <div className="relative" style={{ width: `${size}rem`, height: `${size}rem`, marginTop: `${n * gap * 0.9}rem`, transform: "rotateX(58deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}>
                {layers.map((layer, i) => {
                    const Icon = layer.icon;
                    const fromTop = i;
                    const lift = (n - 1 - fromTop) * (open ? gap * 2.1 : gap * 0.55) + (hover === i ? 1.2 : 0);
                    return (
                        <motion.div
                            key={layer.label}
                            className="absolute inset-0 rounded-2xl border"
                            style={{
                                zIndex: n - fromTop,
                                background: dark ? `linear-gradient(135deg, color-mix(in srgb, ${layer.color} 22%, #0a0a0a), #0a0a0a)` : `linear-gradient(135deg, color-mix(in srgb, ${layer.color} 30%, #fff), #fff)`,
                                borderColor: `color-mix(in srgb, ${layer.color} 60%, transparent)`,
                                boxShadow: `0 0 0 1px ${layer.color}22, -18px 18px 30px -12px rgba(0,0,0,${dark ? 0.6 : 0.25})`,
                            }}
                            animate={{ z: `${lift}rem` }}
                            transition={{ type: "spring", stiffness: 200, damping: 22, delay: open ? (n - fromTop) * 0.03 : 0 }}
                            onPointerEnter={() => setHover(i)}
                            onPointerLeave={() => setHover(-1)}
                        >
                            <div className="absolute inset-3 rounded-xl border border-dashed" style={{ borderColor: `color-mix(in srgb, ${layer.color} 35%, transparent)` }} />
                            <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-lg" style={{ background: layer.color, color: "#0a0a0a" }}>
                                {Icon && <Icon className="h-5 w-5" />}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Labels sit outside the 3D plane so they stay readable. */}
            <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2 sm:right-6">
                {layers.map((layer, i) => (
                    <motion.div
                        key={layer.label}
                        className={`rounded-lg border px-2.5 py-1.5 text-right backdrop-blur ${dark ? "border-white/10 bg-black/50 text-white" : "border-black/10 bg-white/80 text-neutral-900"}`}
                        animate={{ opacity: open ? 1 : 0, x: open ? 0 : 12, scale: hover === i ? 1.05 : 1 }}
                        transition={{ delay: open ? i * 0.05 : 0 }}
                    >
                        <p className="text-[0.78rem] font-semibold" style={{ color: hover === i ? layer.color : undefined }}>
                            {layer.label}
                        </p>
                        <p className="text-[0.65rem] opacity-60">{layer.note}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default IsoStack;
