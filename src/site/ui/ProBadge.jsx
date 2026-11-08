import { Lock } from 'lucide-react';

// Marks work that is part of ApexUI Pro, which is not out yet.
export default function ProBadge({ className = '' }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--lime-line)] bg-[var(--lime-soft)] px-2 py-0.5 text-[0.7rem] font-semibold text-[var(--lime)] ${className}`}>
            <Lock className="h-3 w-3" /> Pro
        </span>
    );
}
