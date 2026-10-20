import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CopyButton } from '../ui/CodeBlock.jsx';
import { allDocPages, prefetch, SITE } from '../config/navigation.js';
import { PAD_X } from './style.js';

/* "Glare Card" → Glare <i>Card</i>: the last word is set in the serif italic. */
export function SplitTitle({ text }) {
    const words = text.split(' ');
    if (words.length < 2) return <span>{text}</span>;
    const last = words.pop();
    return (
        <>
            {words.join(' ')} <span className="text-accent">{last}</span>
        </>
    );
}

export function Meta({ children }) {
    return <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">{children}</div>;
}

export function CliChip({ command }) {
    return (
        <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] py-1.5 pl-4 pr-1.5 font-mono text-[0.78rem] text-[var(--ink-2)] shadow-[var(--shadow)]">
            <span className="text-[var(--lime-text)]">$</span>
            <span className="truncate">{command}</span>
            <span className="rounded-full bg-[var(--panel-2)] text-[var(--ink)] [&_button]:text-[var(--ink-2)] [&_button:hover]:bg-[var(--panel-3)] [&_button:hover]:text-[var(--ink)]">
                <CopyButton text={command} />
            </span>
        </div>
    );
}

/* Big editorial page header shared by component pages and guides. */
export function DocHero({ meta, title, description, aside }) {
    return (
        <header className={`${PAD_X} grid items-end gap-8 pb-10 pt-[clamp(2.25rem,5vw,4.5rem)] xl:grid-cols-[minmax(0,1fr)_auto]`}>
            <div className="min-w-0">
                <Meta>{meta}</Meta>
                <h1 className="font-display mt-4 text-[clamp(2.6rem,5.2vw,5.6rem)] font-semibold leading-[0.92] text-[var(--ink)]">
                    <SplitTitle text={title} />
                </h1>
                {description && <p className="mt-5 max-w-[56ch] text-[1.06rem] leading-relaxed text-[var(--ink-2)]">{description}</p>}
            </div>
            {aside && <div className="min-w-0">{aside}</div>}
        </header>
    );
}

/* Compact page header used inside the docs layout (guides and component pages). */
export function PageHeader({ eyebrow, title, description, aside }) {
    return (
        <header className="flex flex-col gap-5 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                {eyebrow && <p className="text-[0.82rem] font-medium text-[var(--lime-text)]">{eyebrow}</p>}
                <h1 className="font-display mt-2 text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--ink)]">{title}</h1>
                {description && <p className="mt-3 max-w-[62ch] text-[1.02rem] leading-relaxed text-[var(--ink-2)]">{description}</p>}
            </div>
            {aside && <div className="min-w-0 shrink-0">{aside}</div>}
        </header>
    );
}

/* Previous / next cards at the bottom of every docs page. */
export function Pager({ path }) {
    const i = allDocPages.findIndex((p) => p.path === path);
    if (i === -1) return null;
    const prev = allDocPages[i - 1];
    const next = allDocPages[i + 1];

    const card = (page, dir) =>
        page ? (
            <Link
                to={page.path}
                onMouseEnter={() => prefetch(page)}
                className={`group flex flex-col gap-1 rounded-xl border border-[var(--line)] p-4 transition-colors hover:border-[var(--lime-line)] hover:bg-[var(--panel)] ${dir === 'next' ? 'items-end text-right sm:col-start-2' : ''}`}
            >
                <span className="flex items-center gap-1.5 text-[0.78rem] text-[var(--ink-3)]">
                    {dir === 'prev' && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />}
                    {dir === 'prev' ? 'Previous' : 'Next'}
                    {dir === 'next' && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                </span>
                <span className="text-[0.98rem] font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--lime-text)]">{page.name}</span>
            </Link>
        ) : null;

    return (
        <nav aria-label="Pagination" className="mt-16 grid gap-3 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
            {card(prev, 'prev')}
            {card(next, 'next')}
        </nav>
    );
}

export function DocFooter() {
    return (
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-6 text-[0.8rem] text-[var(--ink-3)]">
            <span>© {new Date().getFullYear()} ApexUI · MIT licensed</span>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">Edit this page on GitHub ↗</a>
        </footer>
    );
}
