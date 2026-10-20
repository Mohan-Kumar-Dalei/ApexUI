import { useEffect, useState } from 'react';

/* "On this page" list with scroll-spy, shown in the right column of docs pages. */
export default function TableOfContents({ items }) {
    const ids = items.map((i) => i.id).join('|');
    const [active, setActive] = useState(items[0]?.id);

    useEffect(() => {
        const els = ids.split('|').map((id) => document.getElementById(id)).filter(Boolean);
        if (!els.length) return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-96px 0px -60% 0px' }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ids]);

    return (
        <nav aria-label="On this page">
            <p className="mb-3 text-[0.8rem] font-semibold text-[var(--ink)]">On this page</p>
            <ol className="space-y-0.5 border-l border-[var(--line)]">
                {items.map((item) => {
                    const on = active === item.id;
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    history.replaceState(null, '', `#${item.id}`);
                                    setActive(item.id);
                                }}
                                className={`-ml-px block border-l py-1 pl-3.5 text-[0.84rem] transition-colors ${on ? 'border-[var(--lime)] font-medium text-[var(--ink)]' : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink-2)]'}`}
                            >
                                {item.label}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
