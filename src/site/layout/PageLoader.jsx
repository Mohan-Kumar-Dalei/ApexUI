import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSiteTheme from '../ui/useSiteTheme.js';

// The Runner game lives in the LoadingScreen component; its code is warmed while idle (AppShell).
const LoadingScreen = lazy(() => import('../../components/MainUI/ApexUI-Kit/LoadingScreen/LoadingScreen.jsx'));

/*
 * Real progress for a page load. When a page's code is requested, Vite adds
 * a <link rel="modulepreload"> (or stylesheet) to <head> for every file it
 * still needs. A watcher that runs from the start records each of those
 * links and when it finishes, so the bar counts files actually downloaded
 * (plus the page chunk itself), not a timer.
 */
const files = [];
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
if (typeof document !== 'undefined') {
    const track = (node) => {
        if (node.tagName !== 'LINK' || !/modulepreload|stylesheet/.test(node.rel)) return;
        const file = { t: performance.now(), done: false };
        files.push(file);
        const finish = () => {
            file.done = true;
            emit();
        };
        node.addEventListener('load', finish, { once: true });
        node.addEventListener('error', finish, { once: true });
        emit();
    };
    new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach(track))).observe(document.head, { childList: true });
}

function useFileProgress(active) {
    const [, bump] = useState(0);
    // Files requested from slightly before the load began count toward it.
    const [since, setSince] = useState(() => performance.now() - 300);

    useEffect(() => {
        if (active) setSince(performance.now() - 300);
    }, [active]);
    useEffect(() => {
        const fn = () => bump((n) => n + 1);
        listeners.add(fn);
        return () => listeners.delete(fn);
    }, []);

    const mine = files.filter((f) => f.t >= since);
    const loaded = mine.filter((f) => f.done).length;
    const total = mine.length + 1; // + the page chunk, done when the route resolves
    const progress = active ? Math.min(99, Math.round((loaded / total) * 100)) : 100;
    return { progress, loaded, total };
}

/* Centered card: the Runner game with a progress bar and file count that follow the real load. */
export function LoaderCard({ progress, status }) {
    const theme = useSiteTheme();
    return (
        <div className="h-[22rem] w-[min(30rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--panel)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <Suspense
                fallback={
                    <div role="status" aria-live="polite" className="flex h-full flex-col justify-end gap-2 p-6">
                        <div className="flex justify-between text-[0.75rem] text-[var(--ink-3)]">
                            <span>{status}</span>
                            <span className="font-mono font-semibold tabular-nums text-[var(--ink)]">{progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--panel-3)]">
                            <div className="h-full rounded-full bg-[var(--lime)] transition-[width] duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                }
            >
                <LoadingScreen variant="runner" theme={theme} title="Loading page" progress={progress} statusText={status} loop={false} />
            </Suspense>
        </div>
    );
}

const statusFor = ({ loaded, total }) => `${loaded} of ${total} file${total === 1 ? '' : 's'} loaded`;

/* First visit: the loader centered on screen while the first page's code arrives. */
export default function PageLoader() {
    const files = useFileProgress(true);
    return (
        <div className="fixed inset-0 grid place-items-center bg-[var(--bg)] p-4">
            <LoaderCard progress={files.progress} status={statusFor(files)} />
        </div>
    );
}

/*
 * Navigations keep the current page up while the next one loads. If that
 * takes more than a moment, the loader card appears in the middle of the
 * screen (no blur or dimming), and the page swaps in as soon as it is ready.
 */
export function NavigationLoader({ loading }) {
    const [show, setShow] = useState(false);
    const files = useFileProgress(loading);
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
                    className="pointer-events-none fixed inset-0 z-[90] grid place-items-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <motion.div className="pointer-events-auto" initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}>
                        <LoaderCard progress={files.progress} status={statusFor(files)} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
