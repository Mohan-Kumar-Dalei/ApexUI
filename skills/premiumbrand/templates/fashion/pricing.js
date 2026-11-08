// Template from the Taana build: server-side pricing with services, bundles (looks) and coupons.
// Use it inside your Express routes: products come from MongoDB, items from the validated request body.

export const COUPONS = { FIRSTDRAPE: { pct: 10, cap: 3000, label: '10% off your first order, up to ₹3,000' } };
export const BLOUSE_STITCHING = 1450; // a made-to-size service; rename for your products
export const FALL_PICO = 250; // a finishing service
export const FREE_SHIPPING_FROM = 5000;
export const SHIPPING = 180;
export const LOOK_OFF = 10; // percent off every piece of a look bought whole
export const LOOKS = [
    // { id: 'temple-red', photo: 'photo-...', saree: 'temple-red-kanjivaram', pieces: ['temple-choker', 'pearl-jhumkas'] },
];

// Prices always come from the database, never from the browser.
export function priceLines(items, products) {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const lines = items.map((it) => {
        const p = bySlug.get(it.slug);
        if (!p) throw Object.assign(new Error(`${it.slug} is no longer available.`), { status: 409 });
        // blouse and finishing only exist for sarees; a stitched blouse needs a size
        const saree = p.kind === 'saree';
        const blouse = saree ? it.blouse : 'none';
        const fallPico = saree && it.fallPico;
        const blouseSize = blouse === 'stitched' ? it.blouseSize : undefined;
        const services = (blouse === 'stitched' ? BLOUSE_STITCHING : 0) + (fallPico ? FALL_PICO : 0);
        return { product: p._id, slug: p.slug, name: p.name, image: p.images[0], price: p.price, qty: it.qty, blouse, blouseSize, fallPico, look: it.look, services: services * it.qty, lineTotal: (p.price + services) * it.qty };
    });
    // A look counts only when every one of its pieces is in the bag under that look.
    const whole = new Set(LOOKS.filter((l) => [l.saree, ...l.pieces].every((s) => lines.some((x) => x.slug === s && x.look === l.id))).map((l) => l.id));
    lines.forEach((l) => {
        l.lookOff = l.look && whole.has(l.look) ? Math.round((l.lineTotal * LOOK_OFF) / 100) : 0;
    });
    return lines;
}

export function totalsFor(lines, couponCode) {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const services = lines.reduce((s, l) => s + l.services, 0);
    const lookDiscount = lines.reduce((s, l) => s + (l.lookOff || 0), 0);
    const c = couponCode ? COUPONS[couponCode] : null;
    const discount = c ? Math.min(c.cap, Math.round(((subtotal - lookDiscount) * c.pct) / 100)) : 0;
    const shipping = subtotal - lookDiscount - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
    return { subtotal, services, lookDiscount, discount, shipping, total: subtotal + services - lookDiscount - discount + shipping };
}

