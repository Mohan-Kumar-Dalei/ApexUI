import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, FileText, Github, LayoutGrid, LogOut, Moon, Plus, Search, Settings, Sparkles, User } from "lucide-react";

/*
 * Command Palette: a ⌘K / Ctrl+K search box for jumping anywhere. Typing
 * filters with a forgiving fuzzy match (letters in order, gaps allowed) and
 * highlights the matched letters; arrow keys move a highlight that slides
 * between rows, Enter runs the command, Escape closes. The panel eases in and
 * out with CSS transitions only, so it never blinks.
 */

const DEFAULT_GROUPS = [
    {
        heading: "Suggestions",
        items: [
            { id: "new", label: "Create new project", icon: Plus, shortcut: "N" },
            { id: "components", label: "Browse components", icon: LayoutGrid, hint: "107 ready to use" },
            { id: "ai", label: "Ask AI to build a section", icon: Sparkles, keywords: "assistant generate" },
        ],
    },
    {
        heading: "Pages",
        items: [
            { id: "docs", label: "Documentation", icon: FileText },
            { id: "github", label: "Open GitHub", icon: Github, keywords: "repo source" },
        ],
    },
    {
        heading: "Settings",
        items: [
            { id: "profile", label: "Profile", icon: User, shortcut: "P" },
            { id: "theme", label: "Toggle dark mode", icon: Moon, keywords: "theme light" },
            { id: "settings", label: "Preferences", icon: Settings, shortcut: "," },
            { id: "logout", label: "Log out", icon: LogOut },
        ],
    },
];

// Letters in order, gaps allowed. Lower score is better; returns matched indexes.
function fuzzy(text, query) {
    if (!query) return { score: 0, hits: [] };
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    let ti = 0;
    let score = 0;
    let prev = -1;
    const hits = [];
    for (const ch of q) {
        if (ch === " ") continue;
        const at = t.indexOf(ch, ti);
        if (at < 0) return null;
        score += at - prev - 1 + (at === 0 || t[at - 1] === " " ? 0 : 0.5);
        hits.push(at);
        prev = at;
        ti = at + 1;
    }
    return { score, hits };
}

const Highlight = ({ text, hits }) => {
    if (!hits.length) return text;
    const set = new Set(hits);
    return [...text].map((ch, i) => (set.has(i) ? <mark key={i} className="bg-transparent font-semibold text-[var(--cp-accent)]">{ch}</mark> : ch));
};

const CommandPalette = ({ groups = DEFAULT_GROUPS, placeholder = "Type a command or search…", hotkey = "k", accentColor = "#a3e635", theme = "dark", contained = false, triggerLabel = "Search", defaultOpen = false, onSelect, className = "" }) => {
    const [open, setOpen] = useState(defaultOpen);
    const [mounted, setMounted] = useState(defaultOpen);
    const [shown, setShown] = useState(defaultOpen);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [done, setDone] = useState(null);
    const input = useRef(null);
    const listRef = useRef(null);
    const bar = useRef(null);
    const rows = useRef([]);
    const dark = theme !== "light";

    const results = useMemo(() => {
        const out = [];
        groups.forEach((g) => {
            const items = g.items
                .map((it) => {
                    const m = fuzzy(it.label, query) ?? (it.keywords && fuzzy(it.keywords, query) ? { score: 50, hits: [] } : null);
                    return m && { ...it, ...m };
                })
                .filter(Boolean)
                .sort((a, b) => a.score - b.score);
            if (items.length) out.push({ heading: g.heading, items });
        });
        return out;
    }, [groups, query]);
    const flat = useMemo(() => results.flatMap((g) => g.items), [results]);

    // Mount, then show on the next frame so the enter transition runs; hide, then unmount.
    useEffect(() => {
        if (open) {
            setMounted(true);
            const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
            return () => cancelAnimationFrame(id);
        }
        setShown(false);
        const t = setTimeout(() => setMounted(false), 220);
        return () => clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (shown) input.current?.focus({ preventScroll: true });
    }, [shown]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [hotkey]);

    useEffect(() => setActive(0), [query]);

    // Slide the highlight to the active row and keep it in view.
    useLayoutEffect(() => {
        const row = rows.current[active];
        const b = bar.current;
        if (!row || !b) {
            if (b) b.style.opacity = "0";
            return;
        }
        b.style.opacity = "1";
        b.style.transform = `translateY(${row.offsetTop}px)`;
        b.style.height = `${row.offsetHeight}px`;
        row.scrollIntoView({ block: "nearest" });
    }, [active, flat.length, mounted]);

    const close = useCallback(() => {
        setOpen(false);
        setTimeout(() => setQuery(""), 220);
    }, []);
    const run = (item) => {
        if (!item) return;
        onSelect?.(item);
        setDone(item.label);
        setTimeout(() => setDone(null), 1600);
        close();
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") setActive((a) => (flat.length ? (a + 1) % flat.length : 0));
        else if (e.key === "ArrowUp") setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0));
        else if (e.key === "Home") setActive(0);
        else if (e.key === "End") setActive(Math.max(0, flat.length - 1));
        else if (e.key === "Enter") run(flat[active]);
        else if (e.key === "Escape") close();
        else return;
        e.preventDefault();
    };

    const t = dark
        ? { panel: "border-white/10 bg-neutral-950/90 text-white", muted: "text-white/45", line: "border-white/10", row: "text-white/85", hl: "bg-white/[0.07]", kbd: "border-white/15 bg-white/5 text-white/60", trigger: "border-white/10 bg-neutral-900 text-white/70 hover:text-white" }
        : { panel: "border-black/10 bg-white/95 text-neutral-900", muted: "text-neutral-400", line: "border-black/10", row: "text-neutral-700", hl: "bg-black/[0.05]", kbd: "border-black/10 bg-black/[0.03] text-neutral-500", trigger: "border-black/10 bg-white text-neutral-500 hover:text-neutral-900" };
    let n = -1;
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    return (
        <div className={className} style={{ "--cp-accent": accentColor }}>
            <button type="button" onClick={() => setOpen(true)} className={`inline-flex w-full max-w-xs items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${t.trigger}`}>
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">{triggerLabel}</span>
                <kbd className={`rounded-md border px-1.5 py-0.5 font-mono text-[0.68rem] ${t.kbd}`}>{isMac ? "⌘" : "Ctrl"} {hotkey.toUpperCase()}</kbd>
            </button>
            {done && <p className={`mt-3 text-center text-xs ${t.muted}`}>Ran “{done}”</p>}

            {mounted && (
                <div className={`${contained ? "absolute" : "fixed"} inset-0 z-[300] flex items-start justify-center px-3 pt-[12vh]`} onPointerDown={(e) => e.target === e.currentTarget && close()}>
                    <div aria-hidden="true" className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ease-out" style={{ opacity: shown ? 1 : 0 }} onPointerDown={close} />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command palette"
                        className={`relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl ${t.panel}`}
                        style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(-10px) scale(0.97)", transition: "opacity 180ms ease-out, transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                    >
                        <div className={`flex items-center gap-3 border-b px-4 ${t.line}`}>
                            <Search className={`h-4 w-4 shrink-0 ${t.muted}`} />
                            <input
                                ref={input}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder={placeholder}
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="cp-list"
                                aria-activedescendant={flat[active] ? `cp-${flat[active].id}` : undefined}
                                className="h-12 w-full bg-transparent text-[0.95rem] outline-none placeholder:opacity-50"
                            />
                            <kbd className={`hidden rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem] sm:block ${t.kbd}`}>ESC</kbd>
                        </div>
                        <div ref={listRef} id="cp-list" role="listbox" className="relative max-h-[min(22rem,55vh)] overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]">
                            <div ref={bar} aria-hidden="true" className={`pointer-events-none absolute inset-x-2 top-0 rounded-xl ${t.hl}`} style={{ transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), height 180ms ease, opacity 120ms" }}>
                                <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[var(--cp-accent)]" />
                            </div>
                            {results.length === 0 && <p className={`px-3 py-10 text-center text-sm ${t.muted}`}>No results for “{query}”</p>}
                            {results.map((g) => (
                                <div key={g.heading} role="group" aria-label={g.heading}>
                                    <p className={`px-3 pb-1 pt-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${t.muted}`}>{g.heading}</p>
                                    {g.items.map((it) => {
                                        n += 1;
                                        const i = n;
                                        const Icon = it.icon;
                                        return (
                                            <div
                                                key={it.id}
                                                id={`cp-${it.id}`}
                                                ref={(e) => (rows.current[i] = e)}
                                                role="option"
                                                aria-selected={i === active}
                                                onPointerMove={() => i !== active && setActive(i)}
                                                onClick={() => run(it)}
                                                className={`relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${t.row}`}
                                            >
                                                {Icon && <Icon className={`h-4 w-4 shrink-0 transition-colors ${i === active ? "text-[var(--cp-accent)]" : t.muted}`} />}
                                                <span className="flex-1 truncate">
                                                    <Highlight text={it.label} hits={it.hits} />
                                                    {it.hint && <span className={`ml-2 text-xs ${t.muted}`}>{it.hint}</span>}
                                                </span>
                                                {it.shortcut && <kbd className={`rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem] ${t.kbd}`}>{isMac ? "⌘" : "Ctrl"} {it.shortcut}</kbd>}
                                                {i === active && <CornerDownLeft className={`h-3.5 w-3.5 ${t.muted}`} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className={`flex items-center gap-4 border-t px-4 py-2.5 text-[0.7rem] ${t.line} ${t.muted}`}>
                            <span>↑↓ to move</span>
                            <span>↵ to run</span>
                            <span className="ml-auto">esc to close</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommandPalette;
