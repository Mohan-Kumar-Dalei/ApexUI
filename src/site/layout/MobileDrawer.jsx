import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { IndexNav } from './IndexNav.jsx';
import { NAV_ITEMS } from './navItems.js';
import { OPEN_INDEX_EVENT, openFeedback } from './overlays.js';

/* Slide-in menu for phones and tablets (below lg): primary links plus the docs index. */
export default function MobileDrawer() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    useEffect(() => setOpen(false), [pathname]);
    useEffect(() => {
        const show = () => setOpen(true);
        window.addEventListener(OPEN_INDEX_EVENT, show);
        return () => window.removeEventListener(OPEN_INDEX_EVENT, show);
    }, []);
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[1200] lg:hidden">
                    <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col border-r border-[var(--line-strong)] bg-[var(--bg)] shadow-2xl"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 420, damping: 42 }}
                    >
                        <div className="flex h-16 items-center justify-between border-b border-[var(--line)] px-4">
                            <Logo />
                            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-2)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <nav aria-label="Primary" className="grid gap-0.5 border-b border-[var(--line)] p-3">
                            <NavLink to="/" end className={({ isActive }) => `rounded-lg px-3 py-2 text-[0.95rem] font-medium ${isActive ? 'bg-[var(--panel-2)] text-[var(--ink)]' : 'text-[var(--ink-2)]'}`}>
                                Home
                            </NavLink>
                            {NAV_ITEMS.map(({ label, to, icon: Icon, match }) => (
                                <NavLink key={label} to={to} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.95rem] font-medium ${match(pathname) ? 'bg-[var(--panel-2)] text-[var(--ink)]' : 'text-[var(--ink-2)]'}`}>
                                    <Icon className="h-4 w-4 text-[var(--ink-3)]" />
                                    {label}
                                </NavLink>
                            ))}
                            <button type="button" onClick={() => { setOpen(false); openFeedback(); }} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.95rem] font-medium text-[var(--ink-2)]">
                                <MessageSquare className="h-4 w-4 text-[var(--ink-3)]" />
                                Feedback
                            </button>
                        </nav>
                        <div className="thin-scroll flex-1 overflow-y-auto px-3 py-5">
                            <IndexNav onNavigate={() => setOpen(false)} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
