import { useEffect, useState } from 'react';
import { LoaderCard } from '../layout/PageLoader.jsx';

/*
 * Dev-only playground for the site's page loader (route /loader-demo, not
 * built into production). It plays a demo page load so you can see the card,
 * the Runner game, the bar and the percentage together.
 */
export default function LoaderDemo() {
    const [run, setRun] = useState(0);
    const [seconds, setSeconds] = useState(6);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!run) return undefined;
        let raf = 0;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / (seconds * 1000));
            setProgress(Math.round((t < 0.8 ? 0.9 * (1 - Math.pow(1 - t / 0.8, 2)) : 0.9 + 0.1 * ((t - 0.8) / 0.2)) * 100));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        setProgress(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [run, seconds]);

    const status = !run ? 'Press Play to start' : progress >= 100 ? 'Page ready' : progress < 85 ? 'Loading page…' : 'Almost ready…';

    return (
        <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center gap-6 px-4 py-10">
            <div className="text-center">
                <h1 className="font-display text-2xl font-semibold">Page loader demo</h1>
                <p className="mt-1 text-sm text-[var(--ink-2)]">Only on localhost. Plays a demo page load; on the real site the bar follows the page actually loading.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {[3, 6, 10].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setSeconds(n)}
                        className={`rounded-full px-3 py-1.5 text-sm ${seconds === n ? 'bg-[var(--panel-3)] text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                    >
                        {n}s load
                    </button>
                ))}
                <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full bg-[var(--lime)] px-4 py-2 text-sm font-semibold text-black">
                    Play
                </button>
            </div>
            <LoaderCard progress={run ? progress : 0} status={status} />
        </div>
    );
}
