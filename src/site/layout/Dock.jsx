import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, MessageSquare, Search } from 'lucide-react';
import ThemeToggle from '../../components/MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';
import { LogoMark } from '../ui/Logo.jsx';
import { SITE } from '../config/navigation.js';
import { openFeedback, openSearch } from './overlays.js';
import { DOCK_ITEMS } from './dockItems.js';


function Tip({ children }) {
    return (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md border border-[var(--line-strong)] bg-[var(--panel)] px-2 py-1 text-xs font-medium text-[var(--ink)] opacity-0 shadow-[var(--shadow)] transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            {children}
        </span>
    );
}

const btn = 'group relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--ink-3)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)]';

export function ThemeSwitch({ className = '' }) {
    return (
        <span className={`${btn} ${className} [&_button]:inline-flex [&_button]:h-full [&_button]:w-full [&_button]:items-center [&_button]:justify-center [&_button]:hover:scale-100 [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]`}>
            <ThemeToggle LightTheme="light" animation="circle-left" duration="0.9s" className="text-inherit" />
            <Tip>Theme</Tip>
        </span>
    );
}

/* Vertical app dock (desktop). Mobile uses MobileBar instead. */
export default function Dock() {
    const { pathname } = useLocation();

    return (
        <aside className="sticky top-[var(--pad)] z-40 hidden h-shell w-[4.5rem] shrink-0 flex-col items-center border-r border-[var(--line)] py-4 lg:flex">
            <NavLink to="/" className="group relative mb-6" aria-label="ApexUI home">
                <LogoMark className="h-11 w-11 transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-105" />
                <Tip>ApexUI {SITE.version}</Tip>
            </NavLink>

            <nav aria-label="Primary" className="flex flex-col items-center gap-1.5">
                {DOCK_ITEMS.map(({ label, to, icon: Icon, match }) => {
                    const active = match(pathname);
                    return (
                        <NavLink key={label} to={to} className={`${btn} ${active ? 'text-[var(--ink)]' : ''}`} aria-label={label} aria-current={active ? 'page' : undefined}>
                            {active && (
                                <motion.span
                                    layoutId="dock-active"
                                    className="absolute inset-0 rounded-xl bg-[var(--panel-2)] ring-1 ring-[var(--line-strong)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                                />
                            )}
                            {active && (
                                <motion.span layoutId="dock-bar" className="absolute -left-[0.95rem] top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-[var(--lime)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                            )}
                            <Icon className="relative h-[1.15rem] w-[1.15rem]" />
                            <Tip>{label}</Tip>
                        </NavLink>
                    );
                })}
                <span className="my-2 h-px w-6 bg-[var(--line)]" />
                <button type="button" onClick={openSearch} className={btn} aria-label="Search (Ctrl K)">
                    <Search className="h-[1.15rem] w-[1.15rem]" />
                    <Tip>Search · Ctrl K</Tip>
                </button>
            </nav>

            <div className="mt-auto flex flex-col items-center gap-1.5">
                <button type="button" onClick={openFeedback} className={btn} aria-label="Send feedback">
                    <MessageSquare className="h-[1.15rem] w-[1.15rem]" />
                    <Tip>Feedback</Tip>
                </button>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={btn} aria-label="GitHub">
                    <Github className="h-[1.15rem] w-[1.15rem]" />
                    <Tip>GitHub</Tip>
                </a>
                <ThemeSwitch />
            </div>
        </aside>
    );
}
