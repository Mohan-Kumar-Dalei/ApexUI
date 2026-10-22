import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { CATEGORIES, componentPages } from '../config/navigation.js';
import { ComponentGrid, ComponentList } from '../ui/ComponentIndex.jsx';
import { DocFooter, PageHeader } from '../docs/parts.jsx';
import { DOC_PAD } from '../docs/style.js';
import { slugify } from '../docs/toc.js';
import TableOfContents from '../docs/TableOfContents.jsx';

const VIEW_KEY = 'apexui:index-view';

const blurbs = {
    Backgrounds: 'WebGL, canvas and CSS backdrops that bring a page to life.',
    Cards: 'Tilt, glare, stacks and grids for content that wants attention.',
    'Text & Motion': 'Marquees, hover effects and reveals for headlines.',
    Navigation: 'Menus and dropdowns with smooth animated indicators.',
    Buttons: 'Buttons with hover, press and loading animations.',
    Interactive: 'Carousels, tooltips, avatars and playful details.',
    Loaders: 'Loading screens and mini games that keep visitors busy while your app loads.',
    Maps: 'Globes and world maps with pins, arcs and live pings.',
};

/* The component library, in the docs layout: filters on top, then one section per category. */
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

    const q = query.trim().toLowerCase();
    const items = useMemo(
        () => componentPages.filter((c) => (category === 'All' || c.category === category) && (!q || c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))),
        [category, q]
    );
    const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, componentPages.filter((p) => p.category === c).length])), []);

    // Without a search, results are grouped by category with a heading each.
    const groups = CATEGORIES.map((c) => ({ category: c, id: slugify(c), items: items.filter((p) => p.category === c) })).filter((g) => g.items.length);
    const grouped = !q;
    const toc = grouped ? groups.map((g) => ({ id: g.id, label: g.category })) : [];
    const Results = view === 'grid' ? ComponentGrid : ComponentList;
    // Inside a category section the tag would just repeat the heading.
    const showCategory = !grouped;

    const pill = (active) =>
        `inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[0.84rem] font-medium transition-colors ${active
            ? 'bg-[var(--ink)] text-[var(--bg)]'
            : 'text-[var(--ink-2)] hover:bg-[var(--panel-2)] hover:text-[var(--ink)]'}`;

    return (
        <article className={`${DOC_PAD} mx-auto grid w-full max-w-[84rem] gap-12 pb-4 pt-[clamp(1.75rem,4vw,3rem)] xl:grid-cols-[minmax(0,1fr)_12.5rem]`}>
            <div className="min-w-0">
                <PageHeader
                    eyebrow="Library"
                    title="Components"
                    description="Every ApexUI component with a live preview, props and a one-line install. Filter by category or search by name."
                    aside={
                        <div className="flex gap-6 text-right">
                            <div>
                                <p className="font-display text-2xl font-semibold text-[var(--ink)]">{componentPages.length}</p>
                                <p className="text-[0.78rem] text-[var(--ink-3)]">components</p>
                            </div>
                            <div>
                                <p className="font-display text-2xl font-semibold text-[var(--ink)]">{CATEGORIES.length}</p>
                                <p className="text-[0.78rem] text-[var(--ink-3)]">categories</p>
                            </div>
                        </div>
                    }
                />

                {/* Toolbar: sticks under the navbar while the gallery scrolls. */}
                <div className="sticky top-16 z-20 -mx-2 mb-8 rounded-2xl border border-[var(--line)] bg-[var(--bg)]/85 p-2 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <label className="relative block min-w-0 flex-1 md:max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-3)]" />
                            <input
                                value={query}
                                onChange={(e) => update('q', e.target.value)}
                                placeholder="Search components"
                                className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--panel)] pl-9 pr-8 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--lime-line)] focus:outline-none"
                            />
                            {query && (
                                <button type="button" onClick={() => update('q', '')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink)]">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </label>
                        <div className="ml-auto inline-flex shrink-0 rounded-lg border border-[var(--line)] p-0.5" role="group" aria-label="View">
                            {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setView(v)}
                                    aria-pressed={view === v}
                                    aria-label={`${v} view`}
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${view === v ? 'bg-[var(--panel-2)] text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="thin-scroll mt-2 flex items-center gap-1 overflow-x-auto md:flex-wrap md:overflow-visible">
                        {['All', ...CATEGORIES].map((c) => (
                            <button key={c} type="button" onClick={() => update('category', c)} className={pill(category === c)} aria-pressed={category === c}>
                                {c}
                                <span className="font-mono text-[0.68rem] opacity-60">{c === 'All' ? componentPages.length : counts[c]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[var(--line-strong)] py-20 text-center">
                        <p className="font-display text-xl font-semibold text-[var(--ink)]">No components found</p>
                        <p className="mt-1.5 text-sm text-[var(--ink-2)]">Try another name or clear the filters.</p>
                        <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-5 rounded-lg border border-[var(--line-strong)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--panel-2)]">
                            Clear filters
                        </button>
                    </div>
                ) : grouped ? (
                    <div className="space-y-14">
                        {groups.map((g) => (
                            <section key={g.category} id={g.id} className="scroll-mt-36">
                                <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-3">
                                    <div>
                                        <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--ink)]">{g.category}</h2>
                                        <p className="mt-1 text-[0.9rem] text-[var(--ink-2)]">{blurbs[g.category]}</p>
                                    </div>
                                    <span className="shrink-0 font-mono text-[0.75rem] text-[var(--ink-3)]">{String(g.items.length).padStart(2, '0')}</span>
                                </div>
                                <Results items={g.items} showCategory={showCategory} />
                            </section>
                        ))}
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-[var(--ink-3)]">
                            {items.length} result{items.length === 1 ? '' : 's'} for “{query}”
                        </p>
                        <Results items={items} showCategory={showCategory} />
                    </>
                )}

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
