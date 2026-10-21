import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { prefetch } from '../config/navigation.js';

const ease = [0.22, 1, 0.36, 1];

/* Gallery card: framed screenshot, name, category and a two-line summary. */
export function ComponentCard({ item, index = 0, showCategory = true }) {
    return (
        <motion.li
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.03, ease }}
            className="min-w-0"
        >
            <Link
                to={item.path}
                onMouseEnter={() => prefetch(item)}
                onFocus={() => prefetch(item)}
                className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-1.5 transition duration-300 hover:border-[var(--lime-line)] hover:shadow-[var(--shadow)]"
            >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--stage)]">
                    <img
                        src={item.image}
                        alt={`${item.name} preview`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--lime-ink)] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-3.5">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-[0.98rem] font-semibold text-[var(--ink)]">{item.name}</h3>
                        {showCategory && <span className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-[0.68rem] text-[var(--ink-3)]">{item.category}</span>}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-[var(--ink-2)]">{item.summary}</p>
                </div>
            </Link>
        </motion.li>
    );
}

export function ComponentGrid({ items, showCategory = true }) {
    return (
        <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,17rem),1fr))]">
            {items.map((item, i) => <ComponentCard key={item.path} item={item} index={i} showCategory={showCategory} />)}
        </ul>
    );
}

/* Compact list: small thumbnail, name, summary and category on one row. */
export function ComponentList({ items, showCategory = true }) {
    return (
        <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            {items.map((item) => (
                <li key={item.path}>
                    <Link
                        to={item.path}
                        onMouseEnter={() => prefetch(item)}
                        onFocus={() => prefetch(item)}
                        className="group flex items-center gap-4 px-3 py-3 transition-colors hover:bg-[var(--panel-2)] sm:px-4"
                    >
                        <span className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--stage)] sm:w-28">
                            <img src={item.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.95rem] font-semibold text-[var(--ink)]">{item.name}</span>
                            <span className="mt-0.5 block truncate text-[0.84rem] text-[var(--ink-2)]">{item.summary}</span>
                        </span>
                        {showCategory && <span className="hidden shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-[0.7rem] text-[var(--ink-3)] md:inline">{item.category}</span>}
                        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-3)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
