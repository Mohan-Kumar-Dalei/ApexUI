import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { CATEGORIES, componentPages } from '../config/navigation.js';
import { ComponentGrid, ComponentList } from '../ui/ComponentIndex.jsx';
import { DocHero } from '../docs/parts.jsx';
import { PAD_X } from '../docs/style.js';
import SiteFooter from '../layout/SiteFooter.jsx';

const VIEW_KEY = 'apexui:index-view';

export default function ComponentsIndex() {
    // Category and search live in the URL, so filtered views can be shared and survive reloads.
    const [params, setParams] = useSearchParams();
    const category = params.get('category') ?? 'All';
    const query = params.get('q') ?? '';
    const [view, setView] = useState(() => {
        try {
            return localStorage.getItem(VIEW_KEY) || 'grid';
        } catch {
            return 'grid';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(VIEW_KEY, view);
        } catch {
            /* ignore */
        }
    }, [view]);

    const update = (key, value) => {
        const next = new URLSearchParams(params);
        if (!value || value === 'All') next.delete(key);
        else next.set(key, value);
        setParams(next, { replace: true, preventScrollReset: true });
    };

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        return componentPages.filter(
            (c) => (category === 'All' || c.category === category) && (!q || c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))
        );
    }, [category, query]);

    const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, componentPages.filter((p) => p.category === c).length])), []);

    const chip = (active) =>
        `inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.84rem] transition-colors ${active
            ? 'border-[var(--lime)] bg-[var(--lime)] text-[var(--lime-ink)]'
            : 'border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]'}`;

    return (
        <div>
            <DocHero
                meta={<><span>Library</span><span>· {componentPages.length} components</span><span>· {CATEGORIES.length} categories</span></>}
                title="The Component Index"
                description="Every ApexUI component with a live playground, props and a one-line install. Filter by category or search by name."
            />

            <div className={`${PAD_X} sticky top-[calc(var(--pad)+3.5rem)] z-20 flex flex-col gap-3 border-y border-[var(--line)] bg-[var(--bg)]/90 py-3 backdrop-blur-xl xl:flex-row xl:items-center`}>
                <div className="thin-scroll -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1">
                    {['All', ...CATEGORIES].map((c) => (
                        <button key={c} type="button" onClick={() => update('category', c)} className={chip(category === c)}>
                            {c}
                            <span className="font-mono text-[0.68rem] opacity-60">{c === 'All' ? componentPages.length : counts[c]}</span>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 xl:ml-auto">
                    <label className="relative block flex-1 xl:w-72 xl:flex-none">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-3)]" />
                        <input
                            value={query}
                            onChange={(e) => update('q', e.target.value)}
                            placeholder="Search components"
                            className="h-10 w-full rounded-full border border-[var(--line)] bg-[var(--panel)] pl-10 pr-9 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--lime-line)] focus:outline-none"
                        />
                        {query && (
                            <button type="button" onClick={() => update('q', '')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink)]">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </label>
                    <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--panel)] p-0.5" role="group" aria-label="View">
                        {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                            <button
                                key={v}
                                type="button"
                                onClick={() => setView(v)}
                                aria-pressed={view === v}
                                aria-label={`${v} view`}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${view === v ? 'bg-[var(--lime)] text-[var(--lime-ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`${PAD_X} py-[clamp(1.5rem,3vw,3rem)]`}>
                {items.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="font-display text-2xl text-[var(--ink)]">Nothing found.</p>
                        <p className="mt-2 text-sm text-[var(--ink-2)]">Try another name or clear the filters.</p>
                    </div>
                ) : view === 'grid' ? (
                    <ComponentGrid items={items} />
                ) : (
                    <ComponentList items={items} />
                )}
            </div>
            <SiteFooter />
        </div>
    );
}
