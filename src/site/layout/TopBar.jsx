import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Github, PanelLeft, Search } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { allDocPages, findPage, prefetch, SITE } from '../config/navigation.js';
import { openIndex, openSearch } from './overlays.js';

const iconBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-3)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-30';

function Crumbs({ pathname }) {
    const page = findPage(pathname);
    let parts;
    if (pathname === '/') parts = [{ label: 'home' }];
    else if (page?.category) parts = [{ label: 'components', to: '/components' }, { label: page.path.split('/').pop() }];
    else if (page) parts = [{ label: 'docs', to: '/components/docs/getting-started/introduction' }, { label: page.path.split('/').pop() }];
    else parts = pathname.split('/').filter(Boolean).map((label) => ({ label }));

    return (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 font-mono text-[0.75rem]">
            <Link to="/" className="text-[var(--ink-3)] hover:text-[var(--ink)]">apex</Link>
            {parts.map((part, i) => (
                <span key={`${part.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                    <span className="text-[var(--ink-3)]">/</span>
                    {part.to ? (
                        <Link to={part.to} className="text-[var(--ink-3)] hover:text-[var(--ink)]">{part.label}</Link>
                    ) : (
                        <span className="truncate rounded-md bg-[var(--panel-2)] px-1.5 py-0.5 text-[var(--ink)]">{part.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

export default function TopBar({ showIndexToggle }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);
    const i = page ? allDocPages.indexOf(page) : -1;
    const prev = i > 0 ? allDocPages[i - 1] : null;
    const next = i >= 0 && i < allDocPages.length - 1 ? allDocPages[i + 1] : null;

    return (
        <header className="sticky top-[var(--pad)] z-30 flex h-14 items-center gap-3 border-b border-[var(--line)] bg-[var(--bg)]/85 px-[clamp(1rem,2.2vw,2.5rem)] backdrop-blur-xl lg:rounded-tr-[1.25rem]">
            <div className="lg:hidden">
                <Logo withText={false} />
            </div>
            {showIndexToggle && (
                <button type="button" onClick={openIndex} className={`${iconBtn} xl:hidden`} aria-label="Open index">
                    <PanelLeft className="h-4 w-4" />
                </button>
            )}
            <Crumbs pathname={pathname} />

            <div className="ml-auto flex items-center gap-1">
                <button
                    type="button"
                    onClick={openSearch}
                    className="hidden h-9 items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--panel)] pl-3 pr-1.5 text-[0.8rem] text-[var(--ink-3)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink-2)] md:inline-flex"
                >
                    <Search className="h-3.5 w-3.5" />
                    <span className="w-36 text-left">Search components…</span>
                    <kbd className="rounded-full border border-[var(--line)] bg-[var(--panel-2)] px-2 py-0.5 font-mono text-[0.62rem]">Ctrl K</kbd>
                </button>
                {page && (
                    <div className="ml-1 hidden items-center rounded-full border border-[var(--line)] p-0.5 sm:flex">
                        <Link
                            to={prev?.path ?? '#'}
                            aria-disabled={!prev}
                            onMouseEnter={() => prefetch(prev)}
                            title={prev ? `Previous: ${prev.name}` : undefined}
                            className={`${iconBtn} h-8 w-8 rounded-full ${prev ? '' : 'pointer-events-none opacity-30'}`}
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                            to={next?.path ?? '#'}
                            aria-disabled={!next}
                            onMouseEnter={() => prefetch(next)}
                            title={next ? `Next: ${next.name}` : undefined}
                            className={`${iconBtn} h-8 w-8 rounded-full ${next ? '' : 'pointer-events-none opacity-30'}`}
                        >
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={`${iconBtn} lg:hidden`} aria-label="GitHub">
                    <Github className="h-4 w-4" />
                </a>
            </div>
        </header>
    );
}
