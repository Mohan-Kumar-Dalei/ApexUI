import React from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/*
 * Marquee 3D: a wall of cards tilted back in 3D, with columns that scroll in
 * opposite directions forever. Great for showing off screenshots, logos or
 * testimonials. Each column repeats its items twice and moves exactly one
 * copy, so the loop has no seam. Hover pauses; edges fade out.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage";
const shot = (f) => `${IK}/${f}?tr=f-auto,q-75,w-420`;
const DEFAULT_IMAGES = [
    "gooey-nav-v3.png", "liquid-blob-3d.png", "galaxy-3d.png", "warp-tunnel.png", "retro-grid-3d.png", "particle-morph.png",
    "distortion-image.png", "cube-gallery-v2.png", "coverflow-3d.png", "ai-voice-orb.png", "flip-book-v2.png", "holo-card.png",
    "dot-globe.png", "3d-carousel.png", "pricing-cards.png", "stepper.png",
].map(shot);

function Column({ images, duration, reverse, paused }) {
    const reduced = useReducedMotion();
    const list = [...images, ...images];
    // Progress through one copy (0 to 50%), advanced every frame. Pausing just
    // stops advancing, so hover-out continues from the same spot (no jump).
    const offset = useMotionValue(0);
    useAnimationFrame((_, delta) => {
        if (paused || reduced) return;
        offset.set((offset.get() + (Math.min(delta, 50) / 1000 / duration) * 50) % 50);
    });
    const y = useTransform(offset, (v) => `${reverse ? v - 50 : -v}%`);
    return (
        <div className="relative h-full overflow-hidden">
            <motion.div className="flex flex-col gap-4" style={{ y }}>
                {list.map((src, i) => (
                    <img key={i} src={src} alt="" draggable="false" loading="lazy" className="aspect-[4/3] w-full rounded-xl bg-neutral-900 object-cover shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10" />
                ))}
            </motion.div>
        </div>
    );
}

const Marquee3D = ({ images = DEFAULT_IMAGES, columns = 4, speed = 1, tilt = 1, pauseOnHover = true, height = "100%", className = "" }) => {
    const [hover, setHover] = React.useState(false);
    const cols = Array.from({ length: columns }, (_, c) => images.filter((_, i) => i % columns === c));
    return (
        <div
            className={`relative w-full overflow-hidden [perspective:1000px] ${className}`}
            style={{ height, maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)" }}
            onPointerEnter={() => pauseOnHover && setHover(true)}
            onPointerLeave={() => setHover(false)}
            aria-hidden="true"
        >
            <div
                className="absolute left-1/2 top-1/2 grid h-[170%] w-[115%] gap-4"
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    transform: `translate(-50%, -50%) rotateX(${32 * tilt}deg) rotateZ(${-22 * tilt}deg) rotateY(${8 * tilt}deg)`,
                    transformStyle: "preserve-3d",
                }}
            >
                {cols.map((imgs, c) => (
                    <Column key={c} images={imgs.length ? imgs : images} duration={(28 + c * 6) / speed} reverse={c % 2 === 1} paused={hover} />
                ))}
            </div>
        </div>
    );
};

export default Marquee3D;
