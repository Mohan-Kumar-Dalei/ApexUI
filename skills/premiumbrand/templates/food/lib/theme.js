// The flavour on show recolours the page: the hero carousel calls this on every change.
export function applyFlavor(p) {
    if (!p) return;
    const r = document.documentElement.style;
    r.setProperty('--flavor', p.colour);
    r.setProperty('--flavor-deep', p.deep);
    r.setProperty('--flavor-glow', p.glow);
    r.setProperty('--flavor-ink', p.ink);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.colour);
    current = p;
    window.dispatchEvent(new CustomEvent('lays:flavor', { detail: p }));
}
let current = null;
export const currentFlavor = () => current;

// Readable text on a flavour colour.
export const inkOn = (p) => p?.ink ?? '#ffffff';

// The pack art path for a flavour.
export const packSrc = (p) => p?.image ?? `${import.meta.env.BASE_URL}packs/${p?.slug}.png`;
