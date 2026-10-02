import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Box, Search } from 'lucide-react';
import { componentPages, guidePages } from '../config/navigation.js';
import { OPEN_SEARCH_EVENT, openSearch } from './search.js';


export function SearchTrigger({ className = '', compact = false }) {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
    return (
        <button
            type="button"
            onClick={openSearch}
            className={`group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--fg-subtle)] transition hover:border-[var(--border-strong)] hover:text-[var(--fg-muted)] ${compact ? 'h-9 w-9 justify-center' : 'h-9 w-full px-3'} ${className}`}
            aria-label="Search documentation"
        >
            <Search className="h-4 w-4 shrink-0" />
            {!compact && (
                <>
                    <span className="flex-1 text-left">Search docs…</span>
                    <kbd className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)]">
                        {isMac ? '⌘' : 'Ctrl'} K
                    </kbd>
                </>
            )}
        </button>
    );
}

const groups = [
    { label: 'Guides', icon: BookOpen, items: guidePages },
    { label: 'Components', icon: Box, items: componentPages },
];

export default function CommandMenu() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        const onKey = (e) => {
            const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
            window.removeEventListener('keydown', onKey);
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setQuery('');
            setActive(0);
        }
        document.body.style.overflow = open ? 'hidden' : '';
    }, [open]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return groups
            .map((g) => ({
                ...g,
                items: g.items.filter(
                    (item) => !q || item.name.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)
                ),
            }))
            .filter((g) => g.items.length);
    }, [query]);

    const flat = results.flatMap((g) => g.items);

    const go = (item) => {
        if (!item) return;
        setOpen(false);
        navigate(item.path);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') setOpen(false);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, flat.length - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        }
        if (e.key === 'Enter') go(flat[active]);
    };

    useEffect(() => {
        listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    let index = -1;
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
                >
                    <motion.div
                        role="dialog"
                        aria-label="Search documentation"
                        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                            <Search className="h-4 w-4 text-[var(--fg-subtle)]" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActive(0);
                                }}
                                onKeyDown={onKeyDown}
                                placeholder="Search components and guides…"
                                className="h-12 flex-1 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none"
                            />
                            <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)]">ESC</kbd>
                        </div>
                        <div ref={listRef} className="thin-scroll max-h-[min(60vh,420px)] overflow-y-auto p-2">
                            {results.length === 0 && (
                                <p className="px-3 py-10 text-center text-sm text-[var(--fg-subtle)]">No results for “{query}”.</p>
                            )}
                            {results.map((group) => (
                                <div key={group.label} className="mb-1">
                                    <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-subtle)]">{group.label}</p>
                                    {group.items.map((item) => {
                                        index += 1;
                                        const i = index;
                                        const isActive = i === active;
                                        return (
                                            <button
                                                key={item.path}
                                                type="button"
                                                data-active={isActive}
                                                onMouseMove={() => setActive(i)}
                                                onClick={() => go(item)}
                                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-[var(--surface-2)] text-[var(--fg)]' : 'text-[var(--fg-muted)]'}`}
                                            >
                                                <group.icon className="h-4 w-4 shrink-0 text-[var(--fg-subtle)]" />
                                                <span className="flex-1 truncate">{item.name}</span>
                                                {item.category && <span className="text-xs text-[var(--fg-subtle)]">{item.category}</span>}
                                                <ArrowRight className={`h-3.5 w-3.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
