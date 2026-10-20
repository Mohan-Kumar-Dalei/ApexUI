import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Menu, MessageSquare, Search } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { SITE } from '../config/navigation.js';
import { NAV_ITEMS } from './navItems.js';
import { openFeedback, openIndex, openSearch } from './overlays.js';
import ThemeSwitch from './ThemeSwitch.jsx';

const iconBtn = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-2)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)]';

/* Sticky top navigation used on every page. */
export default function Navbar() {
    const { pathname } = useLocation();

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/70">
            <div className="mx-auto flex h-16 w-full min-w-0 max-w-[100rem] items-center gap-2 px-[clamp(1rem,2.2vw,2rem)] sm:gap-3">
                <button type="button" onClick={openIndex} className={`${iconBtn} -ml-1.5 lg:hidden`} aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                </button>

                <Logo />

                <nav aria-label="Primary" className="ml-2 hidden items-center gap-0.5 md:flex lg:ml-4 lg:gap-1">
                    {NAV_ITEMS.map(({ label, to, match }) => {
                        const active = match(pathname);
                        return (
                            <NavLink
                                key={label}
                                to={to}
                                aria-current={active ? 'page' : undefined}
                                className={`relative rounded-lg px-3 py-1.5 text-[0.9rem] font-medium transition-colors ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
                            >
                                {active && (
                                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-[var(--panel-2)]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                                )}
                                <span className="relative">{label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={openSearch}
                        className="hidden h-9 w-[clamp(13rem,18vw,18rem)] items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] pl-3 pr-1.5 text-[0.85rem] text-[var(--ink-3)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-2)] lg:inline-flex"
                    >
                        <Search className="h-4 w-4" />
                        <span className="flex-1 text-left">Search components…</span>
                        <kbd className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[0.68rem]">Ctrl K</kbd>
                    </button>
                    <button type="button" onClick={openSearch} className={`${iconBtn} lg:hidden`} aria-label="Search">
                        <Search className="h-[1.05rem] w-[1.05rem]" />
                    </button>
                    <span className="mx-1 hidden h-5 w-px bg-[var(--line)] lg:block" />
                    <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="GitHub">
                        <Github className="h-[1.05rem] w-[1.05rem]" />
                    </a>
                    <button type="button" onClick={openFeedback} className={`${iconBtn} hidden sm:inline-flex`} aria-label="Send feedback">
                        <MessageSquare className="h-[1.05rem] w-[1.05rem]" />
                    </button>
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    );
}
