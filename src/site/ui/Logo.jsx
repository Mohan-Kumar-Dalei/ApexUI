import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-7 w-7' }) {
    return (
        <span className={`relative inline-flex items-center justify-center rounded-lg bg-[var(--fg)] text-[var(--bg)] ${className}`}>
            <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 20 12 4l8 16" />
                <path d="M7.5 14h9" stroke="var(--accent)" />
            </svg>
        </span>
    );
}

export default function Logo({ showVersion = false, version }) {
    return (
        <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="ApexUI home">
            <LogoMark />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                Apex<span className="text-[var(--accent-text)]">UI</span>
            </span>
            {showVersion && version && (
                <span className="hidden rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-muted)] sm:inline">
                    {version}
                </span>
            )}
        </Link>
    );
}
