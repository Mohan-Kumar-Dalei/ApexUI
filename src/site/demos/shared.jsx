/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/*
 * Shared pieces for the demo sites. Each demo is a full page built the way the
 * ApexUI skill tells an agent to build: one art direction, flat colours, real
 * photography, human copy, every section from nav to footer.
 */

// Unsplash photo by id, sized for its slot.
export const photo = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// Loads the demo's Google Fonts once.
export function useFonts(href) {
    useEffect(() => {
        if (document.querySelector(`link[data-demo-font="${href}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.demoFont = href;
        document.head.appendChild(link);
    }, [href]);
}

export const Container = ({ className = '', children }) => <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;

export const Section = ({ className = '', id, children }) => (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-28 lg:py-36 ${className}`}>
        {children}
    </section>
);

export const Img = ({ id, w, alt, ratio = 'aspect-[4/5]', className = '', imgClassName = '' }) => (
    <div className={`overflow-hidden ${ratio} ${className}`} style={{ background: 'var(--d-surface)' }}>
        <img src={photo(id, w)} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] ${imgClassName}`} />
    </div>
);

// A small way back to the demo list, kept out of the demo's own design.
export function BackPill() {
    return (
        <Link
            to="/demos"
            className="fixed bottom-4 left-4 z-[60] inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/95 px-4 text-[13px] font-medium text-black shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: 'system-ui, sans-serif', marginBottom: 'env(safe-area-inset-bottom)' }}
        >
            <ArrowLeft className="h-4 w-4" /> All demos
        </Link>
    );
}

// Calm entrance for the hero: fade and rise once, off for reduced motion.
export const riseCss = `
@keyframes demo-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.demo-rise { animation: demo-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
@media (prefers-reduced-motion: reduce) { .demo-rise { animation: none; } }
`;
