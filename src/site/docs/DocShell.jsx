import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findPage } from '../config/navigation.js';
import { DocFooter, DocHero, Pager } from './parts.jsx';
import { PAD_X } from './style.js';

/* "On this page" list with scroll-spy. */
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
            { rootMargin: '-90px 0px -60% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [items]);

    return (
        <nav aria-label="On this page">
            <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">On this page</p>
            <ol className="space-y-1">
                {items.map((item, i) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                history.replaceState(null, '', `#${item.id}`);
                                setActive(item.id);
                            }}
                            className={`group flex items-baseline gap-3 rounded-md py-1 text-[0.85rem] transition-colors ${active === item.id ? 'text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'}`}
                        >
                            <span className={`font-mono text-[0.66rem] ${active === item.id ? 'text-[var(--lime-text)]' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function DocSection({ id, title, description, children }) {
    return (
        <section id={id} className="scroll-mt-24">
            {title && <h2 className="font-display text-[clamp(1.5rem,2vw,2rem)] font-semibold text-[var(--ink)]">{title}</h2>}
            {description && <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-[var(--ink-2)]">{description}</p>}
            <div className={title || description ? 'mt-6' : ''}>{children}</div>
        </section>
    );
}

/* Editorial frame for guides: big header, content column, sticky table of contents. */
export default function DocShell({ title, description, toc = [], children }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);

    return (
        <article>
            <DocHero
                meta={
                    <>
                        <span>Guide {page?.num && `· ${page.num}`}</span>
                        {page?.section && <span>· {page.section}</span>}
                    </>
                }
                title={title}
                description={description}
            />
            <div className={`${PAD_X} grid gap-x-16 gap-y-10 border-t border-[var(--line)] pt-12 xl:grid-cols-[minmax(0,1fr)_16rem]`}>
                <div className="min-w-0 max-w-[68rem] space-y-16">{children}</div>
                {toc.length > 1 && (
                    <aside className="hidden xl:block">
                        <div className="sticky top-24">
                            <TableOfContents items={toc} />
                        </div>
                    </aside>
                )}
            </div>
            {page && <Pager path={page.path} />}
            <DocFooter />
        </article>
    );
}
