import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_ICON } from '../ui/logoSrc.js';

const BEST_KEY = 'apexui:orb-best';
const readBest = () => {
    try {
        return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
        return 0;
    }
};

/* Tiny "catch the orb" game for slow connections: tap the orb before it fades. */
function OrbGame() {
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(readBest);
    const [orb, setOrb] = useState({ id: 0, x: 50, y: 50 });
    const timer = useRef(0);

    const move = (id) => setOrb({ id, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 });

    // An orb that is not caught in time jumps somewhere else and the streak resets.
    useEffect(() => {
        timer.current = setTimeout(() => {
            setScore(0);
            move(orb.id + 1);
        }, 1400);
        return () => clearTimeout(timer.current);
    }, [orb.id]);

    const hit = () => {
        const next = score + 1;
        setScore(next);
        if (next > best) {
            setBest(next);
            try {
                localStorage.setItem(BEST_KEY, String(next));
            } catch {
                /* storage unavailable */
            }
        }
        move(orb.id + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 w-[min(20rem,85vw)]"
        >
            <div className="mb-2 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                <span>Catch the orb</span>
                <span>
                    <span className="text-[var(--ink)]">{score}</span> · best {best}
                </span>
            </div>
            <div className="relative h-[8.5rem] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] [background-image:radial-gradient(var(--line)_1px,transparent_1px)] [background-size:14px_14px]">
                <AnimatePresence>
                    <motion.button
                        key={orb.id}
                        type="button"
                        aria-label="Catch the orb"
                        onPointerDown={hit}
                        className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lime)] shadow-[0_0_24px_var(--lime)] outline-none"
                        style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.15, 1, 0.55], opacity: [0, 1, 1, 0.7] }}
                        exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ duration: 1.4, times: [0, 0.15, 0.3, 1], ease: 'easeOut' }}
                    />
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/*
 * Shown in the content area while a page's code downloads. It waits a moment
 * before appearing so fast loads never flash it, and offers a mini game when
 * the wait runs long.
 */
export default function PageLoader() {
    const [stage, setStage] = useState(0); // 0 hidden, 1 logo, 2 logo + game

    useEffect(() => {
        const a = setTimeout(() => setStage(1), 180);
        const b = setTimeout(() => setStage(2), 1600);
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        };
    }, []);

    return (
        <div role="status" aria-live="polite" className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
            {stage > 0 && (
                <motion.div className="flex flex-col items-center" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
                    <div className="relative grid h-24 w-24 place-items-center">
                        {/* Orbiting rings around the logo. */}
                        {[0, 1].map((i) => (
                            <motion.span
                                key={i}
                                className="absolute inset-0 rounded-full border-2 border-transparent"
                                style={{ borderTopColor: 'var(--lime)', borderRightColor: i ? 'transparent' : 'var(--lime-line)', scale: i ? 0.78 : 1 }}
                                animate={{ rotate: i ? -360 : 360 }}
                                transition={{ duration: i ? 1.6 : 1.1, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}
                        <motion.span
                            className="absolute inset-3 rounded-full bg-[var(--lime)]"
                            animate={{ scale: [0.85, 1.25], opacity: [0.35, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                        <motion.img
                            src={LOGO_ICON}
                            alt=""
                            className="relative h-12 w-12 rounded-full ring-1 ring-[var(--line-strong)]"
                            animate={{ y: [0, -4, 0], rotate: [0, -6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                    <p className="font-display mt-6 flex text-lg font-semibold tracking-tight text-[var(--ink)]" aria-label="Loading ApexUI">
                        {'ApexUI'.split('').map((ch, i) => (
                            <motion.span
                                key={i}
                                aria-hidden="true"
                                className={i >= 4 ? 'text-[var(--lime-text)]' : ''}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                            >
                                {ch}
                            </motion.span>
                        ))}
                    </p>
                    <p className="mt-1 text-[0.82rem] text-[var(--ink-3)]">Loading the page…</p>
                </motion.div>
            )}
            {stage > 1 && <OrbGame />}
        </div>
    );
}
