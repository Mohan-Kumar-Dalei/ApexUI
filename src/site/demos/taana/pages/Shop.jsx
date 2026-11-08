import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { CardSkeleton, PageHead, ProductCard } from '../parts.jsx';
import { useApi, useScrollLock } from '../lib.jsx';

const PRICES = [
    ['Under ₹10,000', '', '10000'],
    ['₹10,000 to ₹25,000', '10000', '25000'],
    ['₹25,000 to ₹50,000', '25000', '50000'],
    ['Above ₹50,000', '50000', ''],
];
const SORTS = [
    ['featured', 'Our picks'],
    ['price-asc', 'Price, low to high'],
    ['price-desc', 'Price, high to low'],
    ['new', 'Newest'],
];
const EASE = [0.16, 1, 0.3, 1];

// Filters live in the URL, so a filtered list can be shared or bookmarked.
function useFilters() {
    const [params, setParams] = useSearchParams();
    const list = (k) => (params.get(k) ? params.get(k).split(',') : []);
    // set('weave', [...]) or set({ min, max }) in one URL update
    const set = (k, v) =>
        setParams(
            (p) => {
                const next = new URLSearchParams(p);
                for (const [key, val] of Object.entries(typeof k === 'object' ? k : { [k]: v })) {
                    if (val === '' || val == null || (Array.isArray(val) && !val.length)) next.delete(key);
                    else next.set(key, Array.isArray(val) ? val.join(',') : val);
                }
                return next;
            },
            { replace: true, preventScrollReset: true },
        );
    return { params, list, set, clear: () => setParams({}, { replace: true }) };
}

function FilterGroups({ facets, f }) {
    const weaves = f.list('weave');
    const colours = f.list('colour');
    const toggle = (k, cur, v) => f.set(k, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    const min = f.params.get('min') ?? '';
    const max = f.params.get('max') ?? '';
    return (
        <div className="space-y-9">
            <fieldset>
                <legend className="label">Weave</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                    {facets?.weaves.map((w) => {
                        const on = weaves.includes(w._id);
                        return (
                            <button key={w._id} type="button" aria-pressed={on} onClick={() => toggle('weave', weaves, w._id)} className={`h-10 rounded-full border px-4 text-[14px] transition-colors ${on ? 'border-tn-ink bg-tn-ink text-tn-bg' : 'border-tn-line hover:border-tn-ink'}`}>
                                {w._id} <span className={on ? 'text-tn-bg/60' : 'text-tn-muted'}>{w.count}</span>
                            </button>
                        );
                    })}
                </div>
            </fieldset>
            <fieldset>
                <legend className="label">Colour</legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                    {facets?.colours.map((c) => {
                        const on = colours.includes(c._id);
                        return (
                            <button key={c._id} type="button" aria-pressed={on} aria-label={`${c._id}, ${c.count}`} title={c._id} onClick={() => toggle('colour', colours, c._id)} className={`grid h-10 w-10 place-items-center rounded-full ring-1 ring-offset-2 ring-offset-tn-bg transition-shadow ${on ? 'ring-2 ring-tn-ink' : 'ring-tn-line'}`} style={{ background: c.swatch }}>
                                {on && <Check className="h-4 w-4 text-white mix-blend-difference" />}
                            </button>
                        );
                    })}
                </div>
            </fieldset>
            <fieldset>
                <legend className="label">Price</legend>
                <div className="mt-3 flex flex-col gap-1">
                    {PRICES.map(([label, lo, hi]) => {
                        const on = min === lo && max === hi;
                        return (
                            <button
                                key={label}
                                type="button"
                                aria-pressed={on}
                                onClick={() => f.set({ min: on ? '' : lo, max: on ? '' : hi })}
                                className="flex h-10 items-center gap-3 text-left text-[15px]"
                            >
                                <span className={`grid h-5 w-5 place-items-center rounded-full border ${on ? 'border-tn-accent' : 'border-tn-line'}`}>{on && <span className="h-2.5 w-2.5 rounded-full bg-tn-accent" />}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>
        </div>
    );
}

export default function Shop() {
    const f = useFilters();
    const [sheet, setSheet] = useState(false);
    const [q, setQ] = useState(f.params.get('q') ?? '');
    useScrollLock(sheet);
    useEffect(() => {
        document.title = 'All sarees | Taana';
    }, []);
    // search waits until typing pauses
    useEffect(() => {
        const t = setTimeout(() => f.set('q', q.trim()), 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    const facets = useApi('/filters').data;
    const query = useMemo(() => {
        const p = new URLSearchParams();
        for (const k of ['weave', 'colour', 'min', 'max', 'q', 'sort']) if (f.params.get(k)) p.set(k, f.params.get(k));
        return `/products?${p}`;
    }, [f.params]);
    const { data, loading, error } = useApi(query, { minDelay: 550 });
    const active = ['weave', 'colour', 'min', 'max', 'q'].some((k) => f.params.get(k));
    const count = data?.products.length;

    return (
        <>
            <PageHead label="The collection" title="Every saree on our shelves">
                <p className="mt-4 max-w-xl text-tn-muted">Woven in small numbers. When one sells out it may take a month or more to come back, and sometimes it does not.</p>
            </PageHead>

            <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-28 sm:px-8 lg:grid-cols-[260px_1fr] lg:gap-14">
                <aside className="hidden lg:block">
                    <div className="sticky top-28">
                        <FilterGroups facets={facets} f={f} />
                        {active && (
                            <button type="button" onClick={() => (setQ(''), f.clear())} className="mt-8 text-[14px] font-medium underline underline-offset-4">
                                Clear all filters
                            </button>
                        )}
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 border-b border-tn-line pb-5">
                        <label className="relative min-w-0 flex-1 basis-60">
                            <span className="sr-only">Search sarees</span>
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tn-muted" />
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by weave, colour or town" className="h-12 w-full rounded-full border border-tn-line bg-tn-card pl-11 pr-4 text-[16px] outline-none placeholder:text-tn-muted focus:border-tn-ink" />
                        </label>
                        <button type="button" onClick={() => setSheet(true)} className="flex h-12 items-center gap-2 rounded-full border border-tn-line px-5 text-[15px] lg:hidden">
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </button>
                        <label className="relative">
                            <span className="sr-only">Sort</span>
                            <select value={f.params.get('sort') ?? 'featured'} onChange={(e) => f.set('sort', e.target.value === 'featured' ? '' : e.target.value)} className="h-12 appearance-none rounded-full border border-tn-line bg-tn-card pl-5 pr-11 text-[15px] outline-none focus:border-tn-ink">
                                {SORTS.map(([v, l]) => (
                                    <option key={v} value={v}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                        </label>
                    </div>
                    <p className="mt-4 text-[14px] text-tn-muted" aria-live="polite">
                        {loading ? 'Looking through the shelves' : count != null ? `${count} ${count === 1 ? 'saree' : 'sarees'}` : ''}
                    </p>

                    {error && <p className="mt-10 text-tn-accent">{error.message}</p>}
                    {!loading && data && count === 0 && (
                        <div className="mt-16 max-w-md">
                            <p className="font-tn-display text-3xl">Nothing matches that yet.</p>
                            <p className="mt-2 text-tn-muted">Try fewer filters, or book a video call and tell us what you are looking for. We can ask the looms.</p>
                            <button type="button" onClick={() => (setQ(''), f.clear())} className="mt-6 h-12 rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                                Clear filters
                            </button>
                        </div>
                    )}
                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:grid-cols-3">
                        {loading
                            ? Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)
                            : data?.products.map((p, i) => (
                                  <motion.div key={p.slug} className="min-w-0" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 6) * 0.05 }}>
                                      <ProductCard p={p} priority={i < 2} />
                                  </motion.div>
                              ))}
                    </div>
                </div>
            </div>

            {/* phone filter sheet */}
            <AnimatePresence>
                {sheet && (
                    <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setSheet(false)} />
                        <motion.div role="dialog" aria-modal="true" aria-label="Filters" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.55, ease: EASE }} className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-3xl bg-tn-bg">
                            <div className="flex items-center justify-between border-b border-tn-line px-5 py-4">
                                <h2 className="text-2xl">Filters</h2>
                                <button type="button" onClick={() => setSheet(false)} aria-label="Close filters" className="-mr-2 grid h-11 w-11 place-items-center">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto px-5 py-6" data-lenis-prevent>
                                <FilterGroups facets={facets} f={f} />
                            </div>
                            <div className="flex gap-3 border-t border-tn-line px-5 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                                <button type="button" onClick={() => (setQ(''), f.clear())} className="h-12 flex-1 rounded-full border border-tn-line font-medium">
                                    Clear
                                </button>
                                <button type="button" onClick={() => setSheet(false)} className="h-12 flex-[2] rounded-full bg-tn-ink font-medium text-tn-bg">
                                    Show {count ?? ''} sarees
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
