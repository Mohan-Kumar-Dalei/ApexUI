import React, { useState } from "react";
import { motion } from "framer-motion";

/*
 * Bounce Cards: a hand of photo cards that bounce into a fan on mount.
 * Hover one and it straightens and lifts while its neighbours lean away to
 * make room; move off and everything settles back into the fan.
 */

const IK = "https://ik.imagekit.io/ny6yinyut/apexui/assets";
const img = (n) => `${IK}/${n}.png?tr=f-auto,q-80,w-400`;
const DEFAULT_IMAGES = [img("hulk"), img("captainamerica"), img("spiderman"), img("doctorStrange"), img("black-panther")];

const BounceCards = ({ images = DEFAULT_IMAGES, cardSize = 9, spread = 5.5, fan = 8, delay = 0.2, className = "" }) => {
    const [hovered, setHovered] = useState(null);
    const mid = (images.length - 1) / 2;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: `min(${cardSize + spread * (images.length - 1) + 4}rem, 92vw)`, height: `${cardSize * 1.5}rem` }} onPointerLeave={() => setHovered(null)}>
            {images.map((src, i) => {
                const off = i - mid;
                let x = off * spread;
                let rotate = off * fan;
                let y = Math.abs(off) * 0.6;
                if (hovered !== null) {
                    if (i === hovered) {
                        rotate = 0;
                        y = -1;
                    } else {
                        // Neighbours lean away, closer ones more.
                        const d = i - hovered;
                        x += Math.sign(d) * Math.max(0, 3 - Math.abs(d) * 0.8);
                    }
                }
                return (
                    <motion.div
                        key={i}
                        className="absolute overflow-hidden rounded-[1.4rem] border-[0.35rem] border-white bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]"
                        style={{ width: `${cardSize}rem`, height: `${cardSize}rem`, zIndex: i === hovered ? 50 : 10 - Math.abs(Math.round(off)) }}
                        initial={{ scale: 0, x: 0, y: "0rem", rotate: 0 }}
                        animate={{ scale: i === hovered ? 1.06 : 1, x: `${x}rem`, y: `${y}rem`, rotate }}
                        transition={{ type: "spring", stiffness: 260, damping: 14, delay: hovered === null ? delay + i * 0.06 : 0 }}
                        onPointerEnter={() => setHovered(i)}
                    >
                        <img src={src} alt="" draggable="false" className="h-full w-full bg-neutral-200 object-cover" />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default BounceCards;
