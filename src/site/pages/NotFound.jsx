import { Link } from 'react-router-dom';
import SiteHeader from '../layout/SiteHeader.jsx';

function Body() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-mono text-sm text-[var(--accent-text)]">404</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)]">Page not found</h1>
            <p className="mt-3 max-w-sm text-[var(--fg-muted)]">We couldn’t find anything at this address. It may have moved or been renamed.</p>
            <div className="mt-8 flex gap-3">
                <Link to="/components" className="inline-flex h-10 items-center rounded-lg bg-[var(--fg)] px-4 text-sm font-medium text-[var(--bg)] hover:opacity-90">
                    Browse components
                </Link>
                <Link to="/" className="inline-flex h-10 items-center rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--fg)] hover:bg-[var(--surface-2)]">
                    Go home
                </Link>
            </div>
        </div>
    );
}

export default function NotFound({ inline = false }) {
    if (inline) return <Body />;
    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <SiteHeader />
            <Body />
        </div>
    );
}
