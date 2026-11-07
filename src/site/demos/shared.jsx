/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/*
 * Shared pieces for the demo sites: photo URLs, font loading and the way back to the
 * gallery. Everything else (layout, loader, skeleton, motion) belongs to each demo.
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
