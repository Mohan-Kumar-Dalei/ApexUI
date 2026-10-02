import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { findPage } from '../config/navigation.js';

/* Right-hand "On this page" list with scroll-spy. */
function TableOfContents({ items }) {
    const [active, setActive] = useState(items[0]?.id);

    useEffect(() => {
        const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
        if (!els.length) return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-80px 0px -65% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [items]);

    if (items.length < 2) return null;
    return (
        <nav aria-label="On this page" className="text-sm">
            <p className="mb-3 text-xs font-semibold text-[var(--fg)]">On this page</p>
            <ul className="space-y-2 border-l border-[var(--border)]">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setActive(item.id);
                            }}
                            className={`-ml-px block border-l py-0.5 transition-colors ${item.depth === 2 ? 'pl-7' : 'pl-4'} ${active === item.id
                                ? 'border-[var(--fg)] text-[var(--fg)]'
                                : 'border-transparent text-[var(--fg-subtle)] hover:text-[var(--fg-muted)]'}`}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export function DocSection({ id, title, description, children, level = 2, className = '' }) {
    const Heading = level === 2 ? 'h2' : 'h3';
    return (
        <section id={id} className={`scroll-mt-24 ${className}`}>
            {title && (
                <Heading className={`font-semibold tracking-tight text-[var(--fg)] ${level === 2 ? 'text-xl' : 'text-base'}`}>
                    {title}
                </Heading>
            )}
            {description && <p className="mt-1.5 text-[15px] leading-7 text-[var(--fg-muted)]">{description}</p>}
            <div className={title || description ? 'mt-4' : ''}>{children}</div>
        </section>
    );
}

/*
 * Page frame shared by guides and component docs: breadcrumb, title,
 * lead paragraph, and an optional right-hand table of contents.
 */
export default function DocShell({ title, description, eyebrow, toc = [], meta, children }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);
    const crumb = eyebrow || page?.section || (page?.category ? 'Components' : 'Docs');

    return (
        <div className="mx-auto flex max-w-6xl gap-12">
            <article className="mx-auto min-w-0 max-w-3xl flex-1 xl:mx-0 xl:max-w-none">
                <div className="mb-4 flex items-center gap-1.5 text-sm text-[var(--fg-subtle)]">
                    <Link to={page?.category ? '/components' : '/components/docs/getting-started/introduction'} className="hover:text-[var(--fg)]">
                        {crumb}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="truncate text-[var(--fg-muted)]">{title}</span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-[2.25rem] sm:leading-tight">{title}</h1>
                {description && <p className="mt-3 max-w-2xl text-[17px] leading-7 text-[var(--fg-muted)]">{description}</p>}
                {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
                <div className="mt-10 space-y-14">{children}</div>
            </article>
            {toc.length > 1 && (
                <aside className="hidden w-52 shrink-0 xl:block">
                    <div className="sticky top-24">
                        <TableOfContents items={toc} />
                    </div>
                </aside>
            )}
        </div>
    );
}
