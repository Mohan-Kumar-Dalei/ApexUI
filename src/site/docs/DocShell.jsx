import { useLocation } from 'react-router-dom';
import { findPage } from '../config/navigation.js';
import { DocFooter, PageHeader, Pager } from './parts.jsx';
import { DOC_PAD } from './style.js';
import TableOfContents from './TableOfContents.jsx';

export function DocSection({ id, title, description, children }) {
    return (
        <section id={id} className="scroll-mt-24">
            {title && <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--ink)]">{title}</h2>}
            {description && <p className="mt-1.5 max-w-[62ch] text-[0.98rem] leading-relaxed text-[var(--ink-2)]">{description}</p>}
            <div className={title || description ? 'mt-5' : ''}>{children}</div>
        </section>
    );
}

/* Guide pages in the docs layout: header, content column, "On this page" on the right. */
export default function DocShell({ title, description, toc = [], children }) {
    const { pathname } = useLocation();
    const page = findPage(pathname);

    return (
        <article className={`${DOC_PAD} mx-auto grid w-full max-w-[84rem] gap-12 pb-4 pt-[clamp(1.75rem,4vw,3rem)] xl:grid-cols-[minmax(0,1fr)_12.5rem]`}>
            <div className="min-w-0">
                <PageHeader eyebrow={page?.section ?? 'Guide'} title={title} description={description} />
                <div className="space-y-14 pt-4">{children}</div>
                {page && <Pager path={page.path} />}
                <DocFooter />
            </div>
            {toc.length > 1 && (
                <aside className="hidden xl:block">
                    <div className="sticky top-24">
                        <TableOfContents items={toc} />
                    </div>
                </aside>
            )}
        </article>
    );
}
