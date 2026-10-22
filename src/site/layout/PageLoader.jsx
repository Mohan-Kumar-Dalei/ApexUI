import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSiteTheme from '../ui/useSiteTheme.js';

// The mini games live in the LoadingScreen component; its code is warmed while idle (AppShell).
const LoadingScreen = lazy(() => import('../../components/MainUI/ApexUI-Kit/LoadingScreen/LoadingScreen.jsx'));

const GAMES = [
    { value: 'runner', label: 'Runner' },
    { value: 'racer', label: 'Racer' },
    { value: 'catch', label: 'Catch' },
];
const STORE = 'apexui:loader-game';

const readGame = () => {
    try {
        return localStorage.getItem(STORE) || 'runner';
    } catch {
        return 'runner';
    }
};

function Bars() {
    return (
        <div className="flex h-8 items-end gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1.5 rounded-full bg-[var(--lime)]"
                    animate={{ height: ['30%', '100%', '30%'] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}

/*
 * Centered loading card: three bouncing bars plus a mini game, so a slow
 * connection isn't boring. The game can be switched (or hidden) and the
 * choice is remembered.
 */
export function LoaderCard() {
    const theme = useSiteTheme();
    const [game, setGame] = useState(readGame);
    const pick = (g) => {
        setGame(g);
        try {
            localStorage.setItem(STORE, g);
        } catch {
            /* ignore */
        }
    };

    return (
        <div role="status" aria-live="polite" aria-label="Loading the page" className="w-[min(30rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                    <Bars />
                    <span className="text-sm font-medium text-[var(--ink-2)]">Loading…</span>
                </div>
                <div className="flex rounded-full bg-[var(--panel-2)] p-0.5" role="group" aria-label="Game">
                    {[...GAMES, { value: 'none', label: 'Hide' }].map((g) => (
                        <button
                            key={g.value}
                            type="button"
                            onClick={() => pick(g.value)}
                            aria-pressed={game === g.value}
                            className={`rounded-full px-2.5 py-1 text-[0.72rem] font-medium transition-colors ${game === g.value ? 'bg-[var(--lime)] text-black' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>
            {game !== 'none' && (
                <div className="h-[19rem] border-t border-[var(--line)]">
                    <Suspense
                        fallback={
                            <div className="grid h-full place-items-center text-[0.8rem] text-[var(--ink-3)]">
                                <span className="animate-pulse">Starting the game…</span>
                            </div>
                        }
                    >
                        <LoadingScreen key={game} variant={game} theme={theme} title="Loading page" />
                    </Suspense>
                </div>
            )}
        </div>
    );
}

/* First visit: a full-screen centered loader while the first page's code arrives. */
export default function PageLoader() {
    return (
        <div className="fixed inset-0 grid place-items-center bg-[var(--bg)] p-4">
            <LoaderCard />
        </div>
    );
}

/*
 * Navigations keep the current page up while the next one loads; if that
 * takes more than a moment, this overlay centers the loader on screen.
 */
export function NavigationLoader({ loading }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (!loading) {
            setShow(false);
            return undefined;
        }
        const id = setTimeout(() => setShow(true), 450);
        return () => clearTimeout(id);
    }, [loading]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[90] grid place-items-center bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
                        <LoaderCard />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
