// Template from the Lay's build. Paths assume client/src/lib/mock.js and server/src/ side by side; adjust the imports to your layout.
/*
 * The demo build runs on a static host (apex-ui.in), so the Express API is replaced by the
 * same routes running in the browser. Prices and the 3-pack rule come from the server's own
 * catalogue.js and pricing.js; validation messages match routes.js. Stock, orders and
 * newsletter sign-ups are kept in localStorage for this visitor.
 */
import { PRODUCTS, CATEGORIES, BOXES, BOX_OFF, PICK3, FREE_SHIPPING_FROM, SHIPPING, MAX_QTY } from '../../../server/src/catalogue.js';
import { priceLines, totalsFor, fail } from '../../../server/src/pricing.js';

const KEY = 'lays-demo-db';
const BASE = import.meta.env.BASE_URL;

const fresh = () => ({
    stock: Object.fromEntries(PRODUCTS.flatMap((p) => p.sizes.map((s) => [`${p.slug}:${s.id}`, s.id === 'l' ? 120 : 400]))),
    orders: [],
    subscribers: [],
});
function load() {
    let db = null;
    try {
        db = JSON.parse(localStorage.getItem(KEY));
    } catch {
        db = null;
    }
    return db?.stock ? db : fresh();
}
function save(db) {
    try {
        localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
        /* private mode: the demo still works for this visit */
    }
}

/* ---------- validation, with the server's messages ---------- */
const SLUG = /^[a-z0-9-]{2,40}$/;
const PHONE = /^[6-9]\d{9}$/;
const PIN = /^[1-9]\d{5}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const s = (v) => (typeof v === 'string' ? v.trim() : '');

function invalid(fields) {
    const keys = Object.keys(fields);
    if (keys.length) throw fail(fields[keys[0]], 400, fields);
}
function bag(body, needItems) {
    const fields = {};
    const items = Array.isArray(body?.items) ? body.items : [];
    if (!Array.isArray(body?.items)) fields.items = 'Your bag is empty.';
    else if (items.length > 40) fields.items = 'That is a lot of lines. Split it into two orders.';
    else if (needItems && !items.length) fields.items = 'Your bag is empty.';
    items.forEach((it, i) => {
        if (!SLUG.test(it?.slug ?? '')) fields[`items.${i}.slug`] ??= 'Unknown flavour.';
        if (!['s', 'm', 'l'].includes(it?.size)) fields[`items.${i}.size`] ??= 'Choose a pack size.';
        if (!Number.isInteger(it?.qty) || it.qty < 1) fields[`items.${i}.qty`] ??= 'At least one pack.';
        else if (it.qty > MAX_QTY) fields[`items.${i}.qty`] ??= `At most ${MAX_QTY} of one pack per order.`;
    });
    invalid(fields);
    return { items: items.map((it) => ({ slug: it.slug, size: it.size, qty: it.qty, box: it.box ?? null })), coupon: s(body?.coupon).slice(0, 24) };
}
function customer(c = {}) {
    const f = {};
    const name = s(c.name);
    if (name.length < 2) f['customer.name'] = 'Enter your full name.';
    else if (name.length > 80) f['customer.name'] = 'Keep the name under 80 characters.';
    if (!PHONE.test(s(c.phone))) f['customer.phone'] = 'Enter a 10 digit mobile number.';
    if (s(c.email) && !EMAIL.test(s(c.email))) f['customer.email'] = 'Enter a valid email or leave it empty.';
    const address = s(c.address);
    if (address.length < 8) f['customer.address'] = 'Enter a house number and street.';
    else if (address.length > 240) f['customer.address'] = 'Keep the address under 240 characters.';
    if (s(c.city).length < 2) f['customer.city'] = 'Enter your city.';
    if (!PIN.test(s(c.pincode))) f['customer.pincode'] = 'Enter a 6 digit pincode.';
    return { f, value: { name, phone: s(c.phone), email: s(c.email), address, city: s(c.city), pincode: s(c.pincode) } };
}

/* ---------- public shapes, as in routes.js ---------- */
const publicProduct = (p, stock) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    short: p.short,
    colour: p.colour,
    deep: p.deep,
    glow: p.glow,
    ink: p.ink,
    text: p.text,
    image: p.image ? BASE + p.image.replace(/^\//, '') : p.image,
    ingredient: p.ingredient,
    note: p.note,
    fact: p.fact,
    ingredients: p.ingredients,
    sizes: p.sizes.map((x) => ({ ...x, inStock: (stock[`${p.slug}:${x.id}`] ?? 0) > 0 })),
});
const publicOrder = (o) => ({
    number: o.number,
    placedAt: o.placedAt,
    status: o.status,
    payment: o.payment,
    name: o.customer.name.split(' ')[0],
    city: o.customer.city,
    pincode: o.customer.pincode,
    eta: o.eta,
    lines: o.lines.map(({ slug, name, colour, sizeLabel, price, qty, box, lineTotal, boxOff }) => ({ slug, name, colour, sizeLabel, price, qty, box, lineTotal, boxOff })),
    totals: o.totals,
});
const etaFor = (pincode) => {
    const d = Number(pincode[0]);
    return d === 1 || d === 4 || d === 5 || d === 6 || d === 7 ? '2 to 3 days' : '3 to 5 days';
};
const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

/* ---------- routes ---------- */
function route(method, path, body) {
    const [p, query = ''] = path.split('?');
    const q = Object.fromEntries(new URLSearchParams(query));

    if (method === 'GET' && p === '/products') {
        const { stock } = load();
        return {
            products: PRODUCTS.map((x) => publicProduct(x, stock)),
            categories: CATEGORIES.map((c) => ({ ...c, count: PRODUCTS.filter((x) => x.category === c.id).length })),
            boxes: BOXES,
            pick3: PICK3,
            rules: { boxOff: BOX_OFF, freeShippingFrom: FREE_SHIPPING_FROM, shipping: SHIPPING, maxQty: MAX_QTY },
        };
    }
    if (method === 'GET' && p === '/delivery') {
        if (!PIN.test(q.pincode ?? '')) throw fail('Enter a 6 digit pincode.', 400, { pincode: 'Enter a 6 digit pincode.' });
        return { pincode: q.pincode, eta: etaFor(q.pincode), cod: true };
    }
    if (method === 'POST' && p === '/quote') {
        const { items, coupon } = bag(body, false);
        const lines = priceLines(items);
        return { lines, totals: totalsFor(lines, coupon) };
    }
    if (method === 'POST' && p === '/orders') {
        const { items, coupon } = bag(body, true);
        const { f, value } = customer(body?.customer);
        if (!['cod', 'upi'].includes(body?.payment)) f.payment = 'Choose how you will pay.';
        invalid(f);
        const lines = priceLines(items);
        const totals = totalsFor(lines, coupon);
        if (totals.couponError) throw fail(totals.couponError, 400, { coupon: totals.couponError });
        const db = load();
        for (const l of lines) {
            const k = `${l.slug}:${l.size}`;
            if ((db.stock[k] ?? 0) < l.qty) throw fail(`Only ${db.stock[k] ?? 0} of ${l.name} (${l.sizeLabel}) left. Lower the count and try again.`);
        }
        lines.forEach((l) => (db.stock[`${l.slug}:${l.size}`] -= l.qty));
        const o = { number: 'LY' + hex(4), placedAt: new Date().toISOString(), status: 'placed', payment: body.payment, customer: value, eta: etaFor(value.pincode), lines, totals };
        db.orders.push(o);
        save(db);
        return { order: publicOrder(o) };
    }
    if (method === 'POST' && p === '/orders/lookup') {
        const number = s(body?.number).toUpperCase();
        const f = {};
        if (!/^LY[0-9A-F]{8}$/.test(number)) f.number = 'Order numbers look like LY1A2B3C4D.';
        if (!PHONE.test(s(body?.phone))) f.phone = 'Enter a 10 digit mobile number.';
        invalid(f);
        const o = load().orders.find((x) => x.number === number && x.customer.phone === s(body.phone));
        if (!o) throw fail('No order matches that number and phone.', 404);
        return { order: publicOrder(o) };
    }
    if (method === 'POST' && p === '/newsletter') {
        const email = s(body?.email).toLowerCase();
        if (!EMAIL.test(email) || email.length > 120) throw fail('Enter a valid email address.', 400, { email: 'Enter a valid email address.' });
        const db = load();
        const isNew = !db.subscribers.some((x) => x.email === email);
        if (isNew) db.subscribers.push({ email, at: new Date().toISOString() });
        save(db);
        return { ok: true, message: isNew ? 'You are on the list. The first letter comes at the start of next month.' : 'You were already on the list. See you next month.' };
    }
    throw fail('Not found.', 404);
}

// Same contract as fetch('/api...'): resolves with the JSON body or throws { message, status, fields }.
export async function mockApi(path, { method = 'GET', body } = {}) {
    await new Promise((r) => setTimeout(r, 120 + Math.random() * 140));
    try {
        return structuredClone(route(method, path, body));
    } catch (e) {
        throw Object.assign(new Error(e.message || 'Something went wrong. Try again.'), { status: e.status || 500, fields: e.fields || {} });
    }
}
