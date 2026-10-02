import { useEffect } from 'react';
import { ScrollRestoration, useLocation, useMatches, useNavigation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Dock from './Dock.jsx';
import IndexPanel from './IndexPanel.jsx';
import TopBar from './TopBar.jsx';
import MobileBar from './MobileBar.jsx';
import CommandMenu from './CommandMenu.jsx';
import FeedbackDialog from './FeedbackDialog.jsx';

function NavProgress() {
    const busy = useNavigation().state !== 'idle';
    return (
        <AnimatePresence>
            {busy && (
                <motion.div
                    className="fixed inset-x-0 top-0 z-[3000] h-[2px] overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.12 } }}
                    exit={{ opacity: 0 }}
                >
                    <div className="h-full w-1/3 bg-[var(--lime)] shadow-[0_0_12px_var(--lime)]" style={{ animation: 'apex-progress 1s var(--ease-out) infinite' }} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/*
 * The whole site lives in one framed "window": dock on the left, the docs
 * index next to it on docs pages, and a fluid main column that fills any
 * screen width (no max-width cap), from phones to 27" displays.
 */
export default function AppShell() {
    const matches = useMatches();
    const { pathname } = useLocation();
    // useOutlet() captures this render's page, so the exiting page keeps its
    // own content while it fades out.
    const outlet = useOutlet();
    const handle = [...matches].reverse().find((m) => m.handle)?.handle ?? {};
    const showIndex = Boolean(handle.page);

    useEffect(() => {
        document.title = handle.title ?? 'ApexUI';
    }, [handle.title]);

    // A page rendered fine, so a later stale-chunk error may reload once again.
    useEffect(() => {
        try {
            sessionStorage.removeItem('apexui:chunk-reload');
        } catch {
            /* ignore */
        }
    }, []);

    return (
        <div className="min-h-dvh bg-[var(--frame)] p-[var(--pad)] text-[var(--ink)]">
            <div className="min-h-shell flex overflow-clip bg-[var(--bg)] lg:rounded-[1.25rem] lg:border lg:border-[var(--line)]">
                <Dock />
                {showIndex && <IndexPanel />}
                <main id="main" className="relative min-w-0 flex-1 pb-24 lg:pb-0">
                    <TopBar showIndexToggle={showIndex} />
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {outlet}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            <MobileBar />
            <CommandMenu />
            <FeedbackDialog />
            <NavProgress />
            <Toaster richColors closeButton position="bottom-center" />
            <ScrollRestoration />
        </div>
    );
}
