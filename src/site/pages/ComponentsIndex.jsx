import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { CATEGORIES, componentPages } from '../config/navigation.js';
import { NewBadge } from '../layout/DocsSidebar.jsx';

export function ComponentCard({ item }) {
    return (
        <Link
            to={item.path}
            className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow)]"
        >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-[var(--preview-bg)]">
                <img
                    src={item.image}
                    alt={`${item.name} preview`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-[var(--fg)]">{item.name}</h3>
                    {item.badge && <NewBadge>{item.badge}</NewBadge>}
                    <span className="ml-auto text-[11px] text-[var(--fg-subtle)]">{item.category}</span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-[var(--fg-muted)]">{item.summary}</p>
            </div>
        </Link>
    );
}

export default function ComponentsIndex() {
    const [category, setCategory] = useState('All');
    const [query, setQuery] = useState('');

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        return componentPages.filter(
            (c) =>
                (category === 'All' || c.category === category) &&
                (!q || c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))
        );
    }, [category, query]);

    const chip = (active) =>
        `rounded-full border px-3 py-1 text-sm transition-colors ${active
            ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
            : 'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]'}`;

    return (
        <div className="mx-auto max-w-6xl">
            <header className="max-w-2xl">
                <p className="text-sm font-medium text-[var(--accent-text)]">Library</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">Components</h1>
                <p className="mt-3 text-[var(--fg-muted)]">
                    {componentPages.length} animated, production-ready components. Preview them live, copy the code or add them with one CLI command.
                </p>
            </header>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {['All', ...CATEGORIES].map((c) => (
                        <button key={c} type="button" onClick={() => setCategory(c)} className={chip(category === c)}>
                            {c}
                        </button>
                    ))}
                </div>
                <label className="relative block md:w-64">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter components"
                        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:border-[var(--border-strong)] focus:outline-none"
                    />
                </label>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <ComponentCard key={item.path} item={item} />
                ))}
            </div>
            {items.length === 0 && (
                <p className="py-20 text-center text-sm text-[var(--fg-subtle)]">No components match your filters.</p>
            )}
        </div>
    );
}
