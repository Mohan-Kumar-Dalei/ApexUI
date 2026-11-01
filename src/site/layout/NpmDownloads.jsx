import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

/*
 * Total npm downloads of apex-ui-kit, shown as a small link in the navbar.
 * The npm API caps one request at 18 months, so the total is summed over
 * 500-day windows from the day the package was first published. Cached for
 * the session so page changes don't refetch.
 */

const PKG = 'apex-ui-kit';
const SINCE = '2025-08-25';
const KEY = 'apexui-npm-downloads';

const day = (d) => d.toISOString().slice(0, 10);

async function fetchTotal() {
    const end = new Date();
    let from = new Date(SINCE);
    let total = 0;
    while (from <= end) {
        const to = new Date(Math.min(end.getTime(), from.getTime() + 499 * 86400000));
        const res = await fetch(`https://api.npmjs.org/downloads/point/${day(from)}:${day(to)}/${PKG}`);
        if (!res.ok) throw new Error(String(res.status));
        total += (await res.json()).downloads ?? 0;
        from = new Date(to.getTime() + 86400000);
    }
    return total;
}

const short = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k` : String(n));

export default function NpmDownloads({ className = '' }) {
    const [count, setCount] = useState(() => {
        try {
            return Number(sessionStorage.getItem(KEY)) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (count) return undefined;
        let alive = true;
        fetchTotal()
            .then((n) => {
                if (!alive) return;
                setCount(n);
                try {
                    sessionStorage.setItem(KEY, String(n));
                } catch {
                    /* storage blocked: it just refetches next time */
                }
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [count]);

    if (!count) return null;
    return (
        <a
            href={`https://www.npmjs.com/package/${PKG}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`${count.toLocaleString()} npm downloads`}
            className={`h-8 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] px-2.5 text-[0.75rem] font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--lime-line)] hover:text-[var(--ink)] ${className}`}
        >
            <Download className="h-3.5 w-3.5 text-[var(--lime)]" />
            <span className="tabular-nums">{short(count)}</span>
            <span className="hidden font-normal text-[var(--ink-3)] xl:inline">downloads</span>
        </a>
    );
}
