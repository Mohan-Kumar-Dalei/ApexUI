import { Link } from 'react-router-dom';
import { img, inr } from './lib.jsx';
import { u } from './base.js';

/* A saree in a grid: the second photo slides in on hover, low stock is said plainly. */
export function ProductCard({ p, priority = false }) {
    return (
        <Link to={u(`/saree/${p.slug}`)} className="group block min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-tn-surface">
                <img src={img(p.images[0], 700, 933)} alt={p.name} loading={priority ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                {p.images[1] && <img src={img(p.images[1], 700, 933)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
                {p.stock <= 2 && <span className="absolute left-3 top-3 bg-tn-bg px-2.5 py-1 text-[12px] font-semibold text-tn-ink">{p.stock === 0 ? 'Sold out' : `Only ${p.stock} left`}</span>}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="label">{p.weave}</p>
                    <h3 className="mt-1.5 text-[1.3rem] leading-tight">{p.name}</h3>
                </div>
                <span className="mt-[22px] shrink-0 text-[15px] tnum">{inr(p.price)}</span>
            </div>
            <p className="mt-1.5 flex items-center gap-2 text-[13px] text-tn-muted">
                <span className="h-3 w-3 rounded-full ring-1 ring-tn-line" style={{ background: p.swatch }} />
                {p.loomDays} days on the loom
            </p>
        </Link>
    );
}

export function CardSkeleton() {
    return (
        <div aria-hidden="true">
            <div className="bone aspect-[3/4]" />
            <div className="bone mt-4 h-3 w-20" />
            <div className="mt-2.5 flex justify-between gap-4">
                <div className="bone h-6 w-2/3" />
                <div className="bone h-5 w-16" />
            </div>
            <div className="bone mt-2.5 h-3 w-32" />
        </div>
    );
}

export function Field({ label, error, id, className = '', ...props }) {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
                {label}
            </label>
            <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`h-12 w-full rounded-xl border bg-tn-card px-4 text-[16px] outline-none transition-colors placeholder:text-tn-muted focus:border-tn-ink ${error ? 'border-tn-accent' : 'border-tn-line'}`} {...props} />
            {error && (
                <p id={`${id}-err`} className="mt-1.5 text-[13px] text-tn-accent">
                    {error}
                </p>
            )}
        </div>
    );
}

export function PageHead({ label, title, children }) {
    return (
        <header className="mx-auto max-w-[1400px] px-5 pb-10 pt-32 sm:px-8 sm:pt-40">
            {label && <p className="label">{label}</p>}
            <h1 className="mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">{title}</h1>
            {children}
        </header>
    );
}
