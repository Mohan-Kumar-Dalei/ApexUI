import { useEffect } from 'react';
import { ScrollRestoration, useLocation, useMatches, useNavigation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileDrawer from './MobileDrawer.jsx';
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
 * Classic docs layout: a sticky top navbar on every page; docs pages add a
 * left sidebar (desktop) or a slide-in drawer (mobile). Other pages use the
 * full width under the navbar.
 */
export default function AppShell() {
    const matches = useMatches();
    const { pathname } = useLocation();
    const outlet = useOutlet();
    const handle = [...matches].reverse().find((m) => m.handle)?.handle ?? {};
    const showSidebar = Boolean(handle.page || handle.sidebar);

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

    // New pages swap in at once: dimming them in on every navigation read as a
    // flicker, and the top progress bar already covers slow loads.
    const page = <div key={pathname}>{outlet}</div>;

    return (
        <div className="min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
            <Navbar />
            {showSidebar ? (
                <div className="mx-auto flex w-full max-w-[100rem]">
                    <Sidebar />
                    <main id="main" className="min-w-0 flex-1">{page}</main>
                </div>
            ) : (
                <main id="main" className="min-w-0">{page}</main>
            )}
            <MobileDrawer />
            <CommandMenu />
            <FeedbackDialog />
            <NavProgress />
            <Toaster richColors closeButton position="bottom-center" />
            <ScrollRestoration />
        </div>
    );
}
