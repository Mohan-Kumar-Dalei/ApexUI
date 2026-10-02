import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { componentPages, componentsByCategory, guidePages, prefetch } from '../config/navigation.js';

export function NewDot() {
    return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lime)] shadow-[0_0_8px_var(--lime)]" title="New" />;
}

function Row({ page, onNavigate }) {
    return (
        <NavLink
            to={page.path}
            end
            onClick={onNavigate}
            onMouseEnter={() => prefetch(page)}
            onFocus={() => prefetch(page)}
            className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-2.5 py-[0.4rem] text-[0.86rem] transition-colors ${isActive
                    ? 'bg-[var(--panel-2)] text-[var(--ink)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--panel-2)]/60 hover:text-[var(--ink)]'}`
            }
        >
            {({ isActive }) => (
                <>
                    <span className={`w-5 shrink-0 font-mono text-[0.68rem] tabular-nums ${isActive ? 'text-[var(--lime-text)]' : 'text-[var(--ink-3)]'}`}>{page.num}</span>
                    <span className="truncate">{page.name}</span>
                    {page.badge && <NewDot />}
                    {isActive && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[var(--lime)]" />}
                </>
            )}
        </NavLink>
    );
}

function Group({ title, count, children }) {
    return (
        <div>
            <h4 className="mb-1.5 flex items-center justify-between px-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--ink-3)]">
                {title}
                {count != null && <span>{String(count).padStart(2, '0')}</span>}
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
        <div className="space-y-6">
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

export default function IndexPanel() {
    return (
        <aside className="thin-scroll sticky top-[var(--pad)] z-30 hidden h-shell w-[17.5rem] shrink-0 overflow-y-auto border-r border-[var(--line)] px-4 pb-10 pt-5 xl:block">
            <div className="mb-5 flex items-baseline justify-between px-2.5">
                <span className="font-display text-lg font-semibold text-[var(--ink)]">Index</span>
                <span className="font-mono text-[0.68rem] text-[var(--ink-3)]">{componentPages.length} items</span>
            </div>
            <IndexNav />
        </aside>
    );
}
