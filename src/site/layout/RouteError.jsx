import { useEffect } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import NotFound from '../pages/NotFound.jsx';

const RELOAD_KEY = 'apexui:chunk-reload';

// After a new deploy, an open tab can ask for code files that no longer exist.
const isChunkError = (error) =>
    /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Unable to preload CSS/i.test(
        String(error?.message || error)
    );

export default function RouteError() {
    const error = useRouteError();
    const chunk = isChunkError(error);

    // Reload once to pick up the new build; the flag prevents a reload loop.
    useEffect(() => {
        if (!chunk) return;
        try {
            if (!sessionStorage.getItem(RELOAD_KEY)) {
                sessionStorage.setItem(RELOAD_KEY, '1');
                window.location.reload();
            }
        } catch {
            /* storage unavailable */
        }
    }, [chunk]);

    if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--lime-text)]">{chunk ? 'Update available' : 'Something broke'}</p>
            <h1 className="font-display mt-4 text-4xl font-semibold text-[var(--ink)]">
                {chunk ? 'A new version of ApexUI was released.' : 'This page hit an error.'}
            </h1>
            <p className="mt-3 max-w-md text-[var(--ink-2)]">
                {chunk ? 'Reload to get the latest files.' : 'Try reloading. If it keeps happening, let us know through the feedback button.'}
            </p>
            <div className="mt-8 flex gap-3">
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105"
                >
                    <RotateCcw className="h-4 w-4" /> Reload
                </button>
                <Link to="/" className="inline-flex h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--panel-2)]">
                    Go home
                </Link>
            </div>
            {!chunk && import.meta.env.DEV && (
                <pre className="mt-8 max-w-2xl overflow-auto rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-left text-xs text-[var(--ink-2)]">
                    {String(error?.stack || error?.message || error)}
                </pre>
            )}
        </div>
    );
}
