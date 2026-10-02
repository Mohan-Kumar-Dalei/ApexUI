import { Suspense, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SiteHeader from './SiteHeader.jsx';
import DocsSidebar from './DocsSidebar.jsx';
import FeedbackButton from './FeedbackButton.jsx';
import { allDocPages, findPage, SITE } from '../config/navigation.js';
import ComponentsIndex from '../pages/ComponentsIndex.jsx';
import NotFound from '../pages/NotFound.jsx';

function PageSkeleton() {
    return (
        <div className="mx-auto max-w-3xl animate-pulse space-y-4 py-2">
            <div className="h-4 w-32 rounded bg-[var(--surface-2)]" />
            <div className="h-9 w-72 rounded bg-[var(--surface-2)]" />
            <div className="h-4 w-full max-w-md rounded bg-[var(--surface-2)]" />
            <div className="mt-8 h-[420px] rounded-xl bg-[var(--surface-2)]" />
        </div>
    );
}

function Pager({ path }) {
    const i = allDocPages.findIndex((p) => p.path === path);
    if (i === -1) return null;
    const prev = allDocPages[i - 1];
    const next = allDocPages[i + 1];
    const card = 'group flex flex-1 flex-col gap-1 rounded-xl border border-[var(--border)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]';
    return (
        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-3 sm:flex-row xl:max-w-6xl xl:pr-64">
            {prev ? (
                <Link to={prev.path} className={card}>
                    <span className="flex items-center gap-1 text-xs text-[var(--fg-subtle)]"><ChevronLeft className="h-3.5 w-3.5" /> Previous</span>
                    <span className="text-sm font-medium text-[var(--fg)]">{prev.name}</span>
                </Link>
            ) : <span className="flex-1" />}
            {next ? (
                <Link to={next.path} className={`${card} items-end text-right`}>
                    <span className="flex items-center gap-1 text-xs text-[var(--fg-subtle)]">Next <ChevronRight className="h-3.5 w-3.5" /></span>
                    <span className="text-sm font-medium text-[var(--fg)]">{next.name}</span>
                </Link>
            ) : <span className="flex-1" />}
        </div>
    );
}

export default function DocsLayout() {
    const { pathname } = useLocation();
    const page = findPage(pathname);
    const isIndex = pathname.replace(/\/+$/, '') === '/components';
    const Page = page?.component;

    useEffect(() => {
        window.scrollTo({ top: 0 });
        document.title = page ? `${page.name} – ApexUI` : isIndex ? 'Components – ApexUI' : 'ApexUI';
    }, [pathname, page, isIndex]);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
            <SiteHeader />
            <div className="mx-auto flex max-w-[1440px]">
                <aside className="thin-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] px-3 pt-8 lg:block">
                    <DocsSidebar />
                </aside>
                <main className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-8 lg:px-12 lg:pt-10">
                    <Suspense fallback={<PageSkeleton />}>
                        {Page ? <Page /> : isIndex ? <ComponentsIndex /> : <NotFound inline />}
                    </Suspense>
                    {page && <Pager path={page.path} />}
                    <div className="mx-auto mt-16 flex max-w-3xl items-center justify-between border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-subtle)] xl:max-w-6xl">
                        <span>© {new Date().getFullYear()} ApexUI · MIT Licensed</span>
                        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">Edit on GitHub</a>
                    </div>
                </main>
            </div>
            <FeedbackButton />
        </div>
    );
}
