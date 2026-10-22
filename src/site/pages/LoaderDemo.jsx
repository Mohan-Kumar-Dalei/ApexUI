import { useMemo, useState } from 'react';
import { LoaderCard } from '../layout/PageLoader.jsx';
import { useLoadProgress } from '../../components/MainUI/ApexUI-Kit/LoadingScreen/useLoadProgress.js';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets';
const HEROES = ['spiderman', 'black-panther', 'hulk', 'thanos', 'captainamerica', 'doctorStrange', 'ironman'];

/*
 * Dev-only playground for the page loader (route /loader-demo, not built into
 * production). "Load" downloads real images (fresh each run) so the bar and
 * the count follow an actual load, the same way the site loader follows the
 * page's code files.
 */
export default function LoaderDemo() {
    const [run, setRun] = useState(0);
    const [count, setCount] = useState(12);
    const items = useMemo(
        () => (run ? Array.from({ length: count }, (_, i) => `${IK}/${HEROES[i % HEROES.length]}.png?tr=w-${600 + i * 40}&run=${run}`) : []),
        [run, count],
    );
    const { progress, loaded, total, done } = useLoadProgress(items, { enabled: run > 0 });

    return (
        <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center gap-6 px-4 py-10">
            <div className="text-center">
                <h1 className="font-display text-2xl font-semibold">Page loader demo</h1>
                <p className="mt-1 text-sm text-[var(--ink-2)]">Only on localhost. Press Load: real images download and the bar and number follow them.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {[6, 12, 24].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setCount(n)}
                        className={`rounded-full px-3 py-1.5 text-sm ${count === n ? 'bg-[var(--panel-3)] text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'}`}
                    >
                        {n} files
                    </button>
                ))}
                <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full bg-[var(--lime)] px-4 py-2 text-sm font-semibold text-black">
                    Load
                </button>
            </div>
            <LoaderCard progress={run ? progress : 0} status={run ? (done ? `All ${total} files loaded` : `${loaded} of ${total} files loaded`) : 'Press Load to start'} />
        </div>
    );
}
