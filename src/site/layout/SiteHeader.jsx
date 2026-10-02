import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Menu, X } from 'lucide-react';
import ThemeToggle from '../../components/MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';
import Logo from '../ui/Logo.jsx';
import { SearchTrigger } from './CommandMenu.jsx';
import DocsSidebar from './DocsSidebar.jsx';
import { SITE } from '../config/navigation.js';

const links = [
    { label: 'Docs', to: '/components/docs/getting-started/introduction', match: '/components/docs' },
    { label: 'Components', to: '/components', match: '/components' },
    { label: 'Templates', to: '/templates-soon', match: '/templates' },
];

const iconBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--fg-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--fg)]';

export function ThemeButton() {
    return (
        <span className={`${iconBtn} [&_button]:inline-flex [&_button]:h-full [&_button]:w-full [&_button]:items-center [&_button]:justify-center [&_button]:hover:scale-100 [&_svg]:h-[18px] [&_svg]:w-[18px]`}>
            <ThemeToggle LightTheme="light" animation="circle-right" duration="1s" className="text-[var(--fg-muted)]" />
        </span>
    );
}

export default function SiteHeader() {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setMenuOpen(false), [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    const isActive = (l) => {
        if (l.match === '/components') return pathname.startsWith('/components') && !pathname.startsWith('/components/docs');
        return pathname.startsWith(l.match);
    };

    return (
        <>
            <header
                className={`sticky top-0 z-[1000] h-14 w-full border-b backdrop-blur-xl transition-colors ${scrolled || pathname !== '/' ? 'border-[var(--border)] bg-[var(--bg)]/80' : 'border-transparent bg-transparent'}`}
            >
                <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-4 sm:px-6">
                    <Logo showVersion version={SITE.version} />

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
                        {links.map((l) => (
                            <NavLink
                                key={l.label}
                                to={l.to}
                                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${isActive(l) ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'}`}
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="hidden w-60 md:block">
                            <SearchTrigger />
                        </span>
                        <span className="md:hidden">
                            <SearchTrigger compact className="border-transparent bg-transparent" />
                        </span>
                        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={`${iconBtn} hidden sm:inline-flex`} aria-label="GitHub">
                            <Github className="h-[18px] w-[18px]" />
                        </a>
                        <ThemeButton />
                        <button type="button" className={`${iconBtn} lg:hidden`} onClick={() => setMenuOpen(true)} aria-label="Open menu">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <div className="fixed inset-0 z-[1500] lg:hidden">
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.aside
                            className="absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col border-r border-[var(--border)] bg-[var(--bg)]"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                        >
                            <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
                                <Logo />
                                <button type="button" className={iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="thin-scroll flex-1 overflow-y-auto px-3 py-5">
                                <div className="mb-7 space-y-px">
                                    {links.map((l) => (
                                        <NavLink key={l.label} to={l.to} className="block rounded-md px-3 py-1.5 text-sm font-medium text-[var(--fg)] hover:bg-[var(--surface-2)]">
                                            {l.label}
                                        </NavLink>
                                    ))}
                                    <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="block rounded-md px-3 py-1.5 text-sm font-medium text-[var(--fg)] hover:bg-[var(--surface-2)]">
                                        GitHub
                                    </a>
                                </div>
                                <DocsSidebar onNavigate={() => setMenuOpen(false)} />
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
