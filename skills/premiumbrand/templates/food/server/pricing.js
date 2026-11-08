// Prices always come from the catalogue on the server, never from the browser.
import { PRODUCTS, BOXES, COUPONS, BOX_OFF, PICK3, FREE_SHIPPING_FROM, SHIPPING } from './catalogue.js';

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
export const fail = (msg, status = 409, fields) => Object.assign(new Error(msg), { status, expose: true, fields });

export function priceLines(items) {
    // merge duplicate lines (same flavour, size and box)
    const merged = new Map();
    for (const it of items) {
        const key = `${it.slug}:${it.size}:${it.box || ''}`;
        const prev = merged.get(key);
        merged.set(key, prev ? { ...prev, qty: prev.qty + it.qty } : { ...it });
    }
    const lines = [...merged.values()].map((it) => {
        const p = bySlug.get(it.slug);
        if (!p) throw fail(`${it.slug} is no longer on the shelf.`);
        const size = p.sizes.find((s) => s.id === it.size);
        if (!size) throw fail(`${p.name} does not come in that pack size.`, 400);
        const inPick3 = it.box === PICK3.id && size.id === PICK3.size;
        const box = inPick3 || (it.box && BOXES.some((b) => b.id === it.box && b.pieces.some((pc) => pc.slug === p.slug && pc.size === size.id))) ? it.box : null;
        return { slug: p.slug, name: p.name, colour: p.colour, size: size.id, sizeLabel: size.label, price: size.price, qty: it.qty, box, lineTotal: size.price * it.qty, boxOff: 0 };
    });
    // a box counts only when every piece is in the bag, under that box, in full quantity
    for (const b of BOXES) {
        const whole = b.pieces.every((pc) => lines.some((l) => l.box === b.id && l.slug === pc.slug && l.size === pc.size && l.qty >= pc.qty));
        if (!whole) continue;
        lines.forEach((l) => {
            if (l.box !== b.id) return;
            // the discount covers the box quantity, not extra packs added on top
            const pc = b.pieces.find((x) => x.slug === l.slug && x.size === l.size);
            l.boxOff = Math.round((l.price * pc.qty * BOX_OFF) / 100);
        });
    }
    // build-your-3-pack: each full set of three 52 g packs under pick3 is PICK3.off% off
    const picked = lines.filter((l) => l.box === PICK3.id);
    let left = Math.floor(picked.reduce((s, l) => s + l.qty, 0) / PICK3.count) * PICK3.count;
    for (const l of picked) {
        const take = Math.min(l.qty, left);
        l.boxOff = Math.round((l.price * take * PICK3.off) / 100);
        left -= take;
    }
    return lines;
}

export function totalsFor(lines, couponCode) {
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const boxDiscount = lines.reduce((s, l) => s + l.boxOff, 0);
    const code = couponCode ? couponCode.trim().toUpperCase() : '';
    const c = code ? COUPONS[code] : null;
    const discount = c ? Math.min(c.cap, Math.round(((subtotal - boxDiscount) * c.pct) / 100)) : 0;
    const after = subtotal - boxDiscount - discount;
    const shipping = lines.length === 0 || after >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
    return {
        subtotal,
        boxDiscount,
        discount,
        coupon: c ? { code, label: c.label } : null,
        couponError: code && !c ? 'That code does not work. Check the spelling and try again.' : null,
        shipping,
        freeShippingFrom: FREE_SHIPPING_FROM,
        total: after + shipping,
    };
}
