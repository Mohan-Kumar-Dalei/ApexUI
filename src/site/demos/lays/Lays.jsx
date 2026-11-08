import { useEffect } from 'react';
import { BackPill } from '../shared.jsx';

/*
 * Lay's Crunch Lab, built with the premiumbrand skill (food playbook): a snack brand store with real 3D bags.
 * The site is its own build (React, Three.js, GSAP, Lenis) with the Express API running in the
 * browser, served from /demos/lays/app/. It sits in a full-page frame so its styles stay its own.
 * Fan project: the pack art and the Lay's logo belong to PepsiCo.
 */
export default function Lays() {
    useEffect(() => {
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, []);
    return (
        <div className="fixed inset-0 bg-[#D6182A]">
            <iframe src="/demos/lays/app/" title="Lay's Crunch Lab demo" className="h-full w-full border-0" allow="autoplay; fullscreen" />
            <BackPill />
        </div>
    );
}
