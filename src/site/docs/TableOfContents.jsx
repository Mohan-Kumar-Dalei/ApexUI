import { useEffect, useState } from 'react';

/* "On this page" list with scroll-spy, shown in the right column of docs pages. */
export default function TableOfContents({ items }) {
    const ids = items.map((i) => i.id).join('|');
    const [active, setActive] = useState(items[0]?.id);

    useEffect(() => {
        const list = ids.split('|');
        let frame = 0;
        // The active section is the last one whose top has passed the line under the sticky header.
        // Reading positions (instead of intersection events) stays right when the layout changes size.
        const update = () => {
            frame = 0;
            const line = window.innerHeight * 0.3;
            let current = list[0];
            for (const id of list) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                current = list.findLast((id) => document.getElementById(id)?.getBoundingClientRect().top < window.innerHeight) ?? current;
            }
            setActive(current);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        // Sections grow as lazy previews load, which moves the ones below without any scroll.
        const resize = new ResizeObserver(schedule);
        list.forEach((id) => {
            const el = document.getElementById(id);
            if (el) resize.observe(el);
        });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            resize.disconnect();
        };
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
