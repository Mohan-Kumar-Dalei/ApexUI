import { useEffect } from 'react';
import { ScrollRestoration, useLocation, useMatches, useOutlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import CommandMenu from './CommandMenu.jsx';
import FeedbackDialog from './FeedbackDialog.jsx';
import { applySeo, seoForRoute } from '../seo.js';

// Shared fallback, so a route without a handle doesn't re-run the SEO effect every render.
const NO_HANDLE = {};

/*
 * Classic docs layout: a sticky top navbar on every page; docs pages add a
 * left sidebar (desktop) or a slide-in drawer (mobile). Other pages use the
 * full width under the navbar.
 */
export default function AppShell() {
    const matches = useMatches();
    const { pathname } = useLocation();
    const outlet = useOutlet();
    const handle = [...matches].reverse().find((m) => m.handle)?.handle ?? NO_HANDLE;
    const showSidebar = Boolean(handle.page || handle.sidebar);

    // Title, description, canonical, social tags and breadcrumbs for this route.
    useEffect(() => {
        applySeo(seoForRoute(handle, pathname));
    }, [handle, pathname]);

    // Warm the shared docs code (page layout, code blocks, playground controls)
    // while the browser is idle, so the first component page opens quickly.
    useEffect(() => {
        const warm = () => {
            import('../docs/ComponentDoc.jsx').catch(() => {});
            import('../docs/controls.jsx').catch(() => {});
            import('../docs/BackgroundDemo.jsx').catch(() => {});
        };
        const idle = window.requestIdleCallback;
        const id = idle ? idle(warm, { timeout: 3000 }) : window.setTimeout(warm, 1500);
        return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
    }, []);

    // A page rendered fine, so a later stale-chunk error may reload once again.
    useEffect(() => {
        try {
            sessionStorage.removeItem('apexui:chunk-reload');
        } catch {
            /* ignore */
        }
    }, []);

    // New pages swap in at once: dimming them in on every navigation read as a
    // flicker, and the centered PageLoader covers slow loads.
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
            <Toaster richColors closeButton position="bottom-center" />
            <ScrollRestoration />
        </div>
    );
}
