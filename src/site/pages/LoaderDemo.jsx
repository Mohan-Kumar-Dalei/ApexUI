import { useState } from 'react';
import PageLoader, { LoaderCard, NavigationLoader } from '../layout/PageLoader.jsx';

/*
 * Dev-only playground for the page loader (route /loader-demo, not built into
 * production). Shows the card on its own, as the in-app navigation overlay,
 * and as the full-screen first-visit loader.
 */
export default function LoaderDemo() {
    const [mode, setMode] = useState('card'); // card | overlay | full
    const btn = (id, label) => (
        <button
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === id ? 'bg-[var(--lime)] text-black' : 'bg-[var(--panel-2)] text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center gap-6 px-4 py-10">
            <div className="text-center">
                <h1 className="font-display text-2xl font-semibold">Page loader demo</h1>
                <p className="mt-1 text-sm text-[var(--ink-2)]">Only on localhost. Try the games, switch them, and preview each way the loader appears.</p>
            </div>
            <div className="relative z-[100] flex flex-wrap justify-center gap-2">
                {btn('card', 'Card')}
                {btn('overlay', 'Navigation overlay')}
                {btn('full', 'First visit (full screen)')}
            </div>
            {mode === 'card' && <LoaderCard />}
            <NavigationLoader loading={mode === 'overlay'} />
            {mode === 'full' && (
                <div className="contents" onDoubleClick={() => setMode('card')}>
                    <PageLoader />
                    <button type="button" onClick={() => setMode('card')} className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-[var(--panel-2)] px-4 py-2 text-sm text-[var(--ink)] shadow-lg">
                        Close full screen
                    </button>
                </div>
            )}
            {mode === 'overlay' && (
                <button type="button" onClick={() => setMode('card')} className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-[var(--panel-2)] px-4 py-2 text-sm text-[var(--ink)] shadow-lg">
                    Close overlay
                </button>
            )}
        </div>
    );
}
