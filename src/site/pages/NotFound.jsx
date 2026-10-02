import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative isolate flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
            <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_80%)]" />
            <p className="font-display select-none text-[clamp(7rem,22vw,18rem)] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--line-strong)]">404</p>
            <h1 className="font-display -mt-4 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold text-[var(--ink)]">
                This page went <span className="font-serif-italic font-normal text-[var(--lime-text)]">off-grid.</span>
            </h1>
            <p className="mt-3 max-w-md text-[var(--ink-2)]">It may have moved or been renamed. Search with Ctrl K, or jump back in below.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/components" className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                    Browse components <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/" className="inline-flex h-11 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--panel-2)]">
                    Go home
                </Link>
            </div>
        </div>
    );
}
