import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { componentPages, componentsByCategory, guidePages, prefetch } from '../config/navigation.js';
import NewBadge from '../ui/NewBadge.jsx';

function Row({ page, onNavigate }) {
    return (
        <NavLink
            to={page.path}
            end
            onClick={onNavigate}
            onMouseEnter={() => prefetch(page)}
            onFocus={() => prefetch(page)}
            onTouchStart={() => prefetch(page)}
            className={({ isActive }) =>
                `relative flex items-center rounded-md px-3 py-[0.42rem] text-[0.875rem] transition-colors ${isActive
                    ? 'bg-[var(--lime-soft)] font-medium text-[var(--ink)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]'}`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--lime)]" />}
                    <span className="truncate">{page.name}</span>
                    {page.isNew && <NewBadge className="ml-auto" />}
                </>
            )}
        </NavLink>
    );
}

function Group({ title, count, children }) {
    return (
        <div>
            <h4 className="mb-1 flex items-center justify-between px-3 text-[0.78rem] font-semibold text-[var(--ink)]">
                {title}
                {count != null && <span className="font-mono text-[0.68rem] font-normal text-[var(--ink-3)]">{count}</span>}
            </h4>
            <div className="space-y-px">{children}</div>
        </div>
    );
}

/* Docs navigation: guides plus every component, grouped by category, with a filter. */
export function IndexNav({ onNavigate, autoFocus = false }) {
    const [query, setQuery] = useState('');
    const q = query.trim().toLowerCase();

    const groups = useMemo(
        () => componentsByCategory
            .map((g) => ({ ...g, items: g.items.filter((p) => !q || p.name.toLowerCase().includes(q)) }))
            .filter((g) => g.items.length),
        [q]
    );
    const guides = guidePages.filter((p) => !q || p.name.toLowerCase().includes(q));

    return (
        <div className="space-y-7">
            <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-3)]" />
                <input
                    autoFocus={autoFocus}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Filter ${componentPages.length} components`}
                    className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--panel)] pl-8 pr-8 text-[0.82rem] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--lime-line)] focus:outline-none"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')} aria-label="Clear filter" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--ink-3)] hover:text-[var(--ink)]">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </label>

            {guides.length > 0 && (
                <Group title="Guides">
                    {guides.map((p) => <Row key={p.path} page={p} onNavigate={onNavigate} />)}
                </Group>
            )}
            {groups.map((g) => (
                <Group key={g.category} title={g.category} count={g.items.length}>
                    {g.items.map((p) => <Row key={p.path} page={p} onNavigate={onNavigate} />)}
                </Group>
            ))}
            {!guides.length && !groups.length && (
                <p className="px-2.5 text-sm text-[var(--ink-3)]">Nothing matches “{query}”.</p>
            )}
        </div>
    );
}
