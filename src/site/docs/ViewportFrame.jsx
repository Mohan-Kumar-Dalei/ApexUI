import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SRC_DOC = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>';

// Copy the site's stylesheets (Tailwind, fonts, CSS variables) into the frame,
// and keep them in sync while Vite hot-swaps styles in development.
function syncStyles(doc) {
    doc.head.querySelectorAll('[data-viewport-copy]').forEach((n) => n.remove());
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((n) => {
        const copy = n.cloneNode(true);
        copy.setAttribute('data-viewport-copy', '');
        doc.head.appendChild(copy);
    });
}

/*
 * Renders the preview inside a real iframe of a fixed width, so media
 * queries (sm:, md:…), vw units and container sizes behave exactly like on a
 * phone or tablet. The React tree is portalled into the frame, so the
 * preview keeps its state and the playground controls still drive it.
 */
export default function ViewportFrame({ width, label, bodyClassName = '', children }) {
    const frameRef = useRef(null);
    const [doc, setDoc] = useState(null);

    const onLoad = () => {
        const d = frameRef.current?.contentDocument;
        if (!d) return;
        syncStyles(d);
        d.documentElement.className = document.documentElement.className;
        d.documentElement.style.colorScheme = getComputedStyle(document.documentElement).colorScheme;
        d.body.style.margin = '0';
        setDoc(d);
    };

    // Theme toggles and new style tags follow the main page.
    useEffect(() => {
        if (!doc) return undefined;
        const htmlObs = new MutationObserver(() => {
            doc.documentElement.className = document.documentElement.className;
        });
        htmlObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        const headObs = new MutationObserver(() => syncStyles(doc));
        headObs.observe(document.head, { childList: true });
        return () => {
            htmlObs.disconnect();
            headObs.disconnect();
        };
    }, [doc]);

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-3 py-3">
            <iframe
                ref={frameRef}
                title={`${label} preview`}
                srcDoc={SRC_DOC}
                onLoad={onLoad}
                className="h-full min-h-0 max-w-full flex-1 rounded-[1.4rem] border-[6px] border-[var(--panel-3)] bg-[var(--stage)] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)] transition-[width] duration-300 ease-out"
                style={{ width }}
            />
            {doc &&
                createPortal(
                    <div className={`relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--stage)] p-4 text-[var(--stage-ink)] ${bodyClassName}`}>{children}</div>,
                    doc.body,
                )}
            <span className="font-mono text-[0.68rem] text-[var(--ink-3)]">
                {label} · {width}px
            </span>
        </div>
    );
}
