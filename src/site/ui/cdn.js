/*
 * ImageKit delivery for the site's own images (demos, thumbnails, logo).
 *
 * `cdn('/assets/ironman.png', { w: 600 })` returns a resized, auto-format
 * (WebP / AVIF) URL on the ImageKit endpoint. The files are uploaded once with
 * `npm run images:upload`, which keeps the same folder structure as /public.
 *
 * If an ImageKit image fails to load (not uploaded yet, offline CDN …) the
 * global fallback swaps it back to the local file, so nothing ever breaks.
 * Set VITE_IMAGEKIT_ENDPOINT="" to turn the CDN off completely.
 */

const ENDPOINT = (import.meta.env.VITE_IMAGEKIT_ENDPOINT ?? 'https://ik.imagekit.io/ny6yinyut').replace(/\/+$/, '');

// ImageKit replaces every character other than letters, digits, ".", "-" and "_" in a file name with "_".
export const ikPath = (path) =>
    path
        .split('/')
        .map((segment) => segment.replace(/[^A-Za-z0-9._-]/g, '_'))
        .join('/');

const originals = new Map();

export function cdn(src, { w, q = 80 } = {}) {
    if (!ENDPOINT || typeof src !== 'string' || !src.startsWith('/assets/')) return src;
    const local = decodeURI(src);
    const tr = ['f-auto', `q-${q}`, w && `w-${w}`].filter(Boolean).join(',');
    const url = `${ENDPOINT}${ikPath(local)}?tr=${tr}`;
    originals.set(url, src);
    return url;
}

/* Deep-copies demo data, sending every "/assets/…" string through cdn(). */
export function withCdn(value, options) {
    if (typeof value === 'string') return cdn(value, options);
    if (Array.isArray(value)) return value.map((v) => withCdn(v, options));
    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withCdn(v, options)]));
    }
    return value;
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
