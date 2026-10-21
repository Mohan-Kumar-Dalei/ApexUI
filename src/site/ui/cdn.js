/*
 * ImageKit delivery for the site's own images (demos, thumbnails, logo).
 *
 * `cdn('/assets/ironman.png', { w: 600 })` returns a resized, auto-format
 * (WebP / AVIF) URL on the ImageKit endpoint. The files are uploaded once with
 * `npm run images:upload` into the /apexui folder, same structure as /public.
 *
 * If an ImageKit image fails to load (not uploaded yet, offline CDN …) the
 * global fallback swaps it back to the local file, so nothing ever breaks.
 * Set VITE_IMAGEKIT_ENDPOINT="" to turn the CDN off completely.
 */

const ENDPOINT = (import.meta.env.VITE_IMAGEKIT_ENDPOINT ?? 'https://ik.imagekit.io/ny6yinyut/apexui').replace(/\/+$/, '');

// ImageKit replaces every character other than letters, digits, ".", "-" and "_" in a file name with "_".
export const ikPath = (path) =>
    path
        .split('/')
        .map((segment) => segment.replace(/[^A-Za-z0-9._-]/g, '_'))
        .join('/');

const originals = new Map();
// Any image file served from /public (route paths like "/components/x" are left alone).
const PUBLIC_IMAGE = /^\/[^?#]*\.(png|jpe?g|webp|gif|svg|avif)$/i;

export function cdn(src, { w, q = 80 } = {}) {
    if (!ENDPOINT || typeof src !== 'string' || !PUBLIC_IMAGE.test(src)) return src;
    const local = decodeURI(src);
    const tr = ['f-auto', `q-${q}`, w && `w-${w}`].filter(Boolean).join(',');
    const url = `${ENDPOINT}${ikPath(local)}?tr=${tr}`;
    originals.set(url, src);
    return url;
}

/* Deep-copies demo data, sending every local image path ("/assets/…") through cdn(). */
export function withCdn(value, options) {
    if (typeof value === 'string') return cdn(value, options);
    if (Array.isArray(value)) return value.map((v) => withCdn(v, options));
    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withCdn(v, options)]));
    }
    return value;
}

/*
 * Marks every ImageKit <img> that is still loading with data-ik-loading, which
 * theme.css draws as a shimmering skeleton. The mark is dropped once the image
 * (or its local fallback) has loaded, so components need no changes.
 * Images that are ready within a moment (cached) never get the mark, so they
 * don't flash a skeleton for a frame.
 */
export function installImageSkeletons() {
    if (!ENDPOINT || typeof window === 'undefined') return;
    const isLoading = (img) => !img.complete && (img.currentSrc || img.src).startsWith(ENDPOINT);
    const mark = (img) => {
        if (!isLoading(img)) return;
        setTimeout(() => {
            if (isLoading(img)) img.dataset.ikLoading = '';
        }, 120);
    };
    const scan = (node) => {
        if (node instanceof HTMLImageElement) mark(node);
        else if (node instanceof Element) node.querySelectorAll('img').forEach(mark);
    };
    const settle = (event) => {
        const img = event.target;
        // After an error the fallback may have swapped in the local file; keep the skeleton until that loads.
        if (img instanceof HTMLImageElement && img.complete) delete img.dataset.ikLoading;
    };
    // On document, not window: an element's load event never propagates to window.
    document.addEventListener('load', settle, true);
    document.addEventListener('error', settle, true);
    new MutationObserver((records) => {
        for (const record of records) {
            if (record.type === 'attributes') mark(record.target);
            else record.addedNodes.forEach(scan);
        }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    scan(document.documentElement);
}

/* Falls back to the local file when an ImageKit image cannot be loaded. */
export function installCdnFallback() {
    if (!ENDPOINT || typeof window === 'undefined') return;
    window.addEventListener(
        'error',
        (event) => {
            const el = event.target;
            if (!(el instanceof HTMLImageElement) || el.dataset.cdnFallback) return;
            const local = originals.get(el.currentSrc) ?? originals.get(el.src);
            if (!local) return;
            el.dataset.cdnFallback = '1';
            // Handled here: keep the component's own onError from also reacting
            // (some clear the src). If the local file fails too, it gets that event.
            event.stopPropagation();
            el.src = local;
        },
        true
    );
}
