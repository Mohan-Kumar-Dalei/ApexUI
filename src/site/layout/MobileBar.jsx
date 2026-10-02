import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Menu, MessageSquare, Search, X } from 'lucide-react';
import { ThemeSwitch } from './Dock.jsx';
import { DOCK_ITEMS } from './dockItems.js';
import { IndexNav } from './IndexPanel.jsx';
import Logo from '../ui/Logo.jsx';
import { SITE } from '../config/navigation.js';
import { OPEN_INDEX_EVENT, openFeedback, openSearch } from './overlays.js';

/* Bottom tab bar + slide-up sheet for phones and tablets (below lg). */
export default function MobileBar() {
    const { pathname } = useLocation();
    const [sheet, setSheet] = useState(false);
    // On lg screens (where the index panel is hidden until xl) the sheet slides in from the left.
    const [side, setSide] = useState(false);

    useEffect(() => setSheet(false), [pathname]);
    useEffect(() => {
        const open = () => {
            setSide(window.matchMedia('(min-width: 1024px)').matches);
            setSheet(true);
        };
        window.addEventListener(OPEN_INDEX_EVENT, open);
        return () => window.removeEventListener(OPEN_INDEX_EVENT, open);
    }, []);
    useEffect(() => {
        document.body.style.overflow = sheet ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [sheet]);

    const tab = 'relative flex flex-1 flex-col items-center justify-center gap-1 text-[0.62rem] font-medium';

    return (
        <>
            <nav
                aria-label="Primary"
                className="fixed inset-x-3 bottom-3 z-[1100] flex h-16 items-stretch rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)]/90 px-1 shadow-[var(--shadow)] backdrop-blur-xl lg:hidden"
            >
                {DOCK_ITEMS.slice(0, 3).map(({ label, to, icon: Icon, match }) => {
                    const active = match(pathname);
                    return (
                        <NavLink key={label} to={to} className={`${tab} ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]'}`}>
                            {active && <motion.span layoutId="mobile-active" className="absolute inset-x-2 inset-y-1.5 rounded-xl bg-[var(--panel-2)]" />}
                            <Icon className="relative h-5 w-5" />
                            <span className="relative">{label}</span>
                            {active && <span className="absolute top-1 h-1 w-1 rounded-full bg-[var(--lime)]" />}
                        </NavLink>
                    );
                })}
                <button type="button" onClick={openSearch} className={`${tab} text-[var(--ink-3)]`}>
                    <Search className="h-5 w-5" />
                    Search
                </button>
                <button type="button" onClick={() => { setSide(false); setSheet(true); }} className={`${tab} text-[var(--ink-3)]`} aria-expanded={sheet}>
                    <Menu className="h-5 w-5" />
                    Menu
                </button>
            </nav>

            <AnimatePresence>
                {sheet && (
                    <div className="fixed inset-0 z-[1200]">
                        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
                        <motion.div
                            role="dialog"
                            aria-label="Menu"
                            className={side
                                ? 'absolute inset-y-0 left-0 flex w-[22rem] flex-col border-r border-[var(--line-strong)] bg-[var(--bg)]'
                                : 'absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-[var(--line-strong)] bg-[var(--bg)]'}
                            initial={side ? { x: '-100%' } : { y: '100%' }}
                            animate={side ? { x: 0 } : { y: 0 }}
                            exit={side ? { x: '-100%' } : { y: '100%' }}
                            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                            drag={side ? false : 'y'}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.6 }}
                            onDragEnd={(_, info) => info.offset.y > 120 && setSheet(false)}
                        >
                            {!side && <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[var(--panel-3)]" />}
                            <div className="flex items-center justify-between px-5 py-3">
                                <Logo />
                                <button type="button" onClick={() => setSheet(false)} aria-label="Close menu" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-3)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 border-y border-[var(--line)] px-4 py-2">
                                {DOCK_ITEMS.map(({ label, to }) => (
                                    <NavLink key={label} to={to} className="rounded-full px-3 py-1.5 text-sm text-[var(--ink-2)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]">
                                        {label}
                                    </NavLink>
                                ))}
                                <span className="ml-auto flex">
                                    <button type="button" onClick={openFeedback} aria-label="Feedback" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-3)]"><MessageSquare className="h-[1.15rem] w-[1.15rem]" /></button>
                                    <a href={SITE.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-3)]"><Github className="h-[1.15rem] w-[1.15rem]" /></a>
                                    <ThemeSwitch />
                                </span>
                            </div>
                            <div className="thin-scroll flex-1 overflow-y-auto px-3 py-5">
                                <IndexNav onNavigate={() => setSheet(false)} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
