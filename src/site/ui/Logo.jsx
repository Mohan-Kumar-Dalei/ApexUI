import { Link } from 'react-router-dom';
import { SITE } from '../config/navigation.js';

/* The official ApexUI logo files from /public — the images themselves are unchanged. */
export const LOGO_ICON = '/web-app-manifest-192x192.png';
export const LOGO_FULL = '/assets/ApexUI-Logo.png';

export function LogoMark({ className = 'h-10 w-10' }) {
    return (
        <img
            src={LOGO_ICON}
            alt="ApexUI"
            width={192}
            height={192}
            draggable="false"
            className={`shrink-0 rounded-full ring-1 ring-[var(--line-strong)] ${className}`}
        />
    );
}

export default function Logo({ withText = true, className = '' }) {
    return (
        <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="ApexUI home">
            <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[-8deg]" />
            {withText && (
                <span className="font-display text-[1.05rem] font-semibold tracking-tight text-[var(--ink)]">
                    Apex<span className="text-[var(--lime-text)]">UI</span>
                    <span className="ml-2 align-middle font-mono text-[0.65rem] font-normal text-[var(--ink-3)]">{SITE.version}</span>
                </span>
            )}
        </Link>
    );
}
