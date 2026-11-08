import { JEWELLERY, LOOKS, SAREES } from './catalogue.js';

/*
 * The Taana demo runs on a static host, so its Express + MongoDB API is replaced here by
 * the same routes running in the browser: same prices, bundle rule, stock checks,
 * validation messages and booking rules. Data is kept in localStorage for this visitor.
 * The real server is part of the ApexUI Pro brand playbook.
 */

const KEY = 'taana-demo-db';
const COUPONS = { FIRSTDRAPE: { pct: 10, cap: 3000, label: '10% off your first saree, up to ₹3,000' } };
const BLOUSE_STITCHING = 1450;
const FALL_PICO = 250;
const FREE_SHIPPING_FROM = 5000;
const SHIPPING = 180;
const LOOK_OFF = 10;
const SIZES = ['34', '36', '38', '40', '42'];
const SLOTS = ['11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];

const fail = (status, error, fields) => Object.assign(new Error(error), { status, fields });

function load() {
    let db = null;
    try {
        db = JSON.parse(localStorage.getItem(KEY));
    } catch {
        db = null;
    }
    if (!db) db = { stock: {}, users: [], orders: [], appointments: [], subscribers: [], session: null };
    return db;
}
function save(db) {
    try {
        localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
        /* private mode: the demo still works for this page view */
    }
}
const all = () => [...SAREES, ...JEWELLERY];
const withStock = (db, p) => ({ ...p, stock: db.stock[p.slug] ?? p.stock });

/* ---------- validation, with the server's messages ---------- */
const rx = {
    phone: [/^[6-9]\d{9}$/, 'Enter a 10 digit mobile number.'],
    pincode: [/^[1-9]\d{5}$/, 'Enter a 6 digit pincode.'],
    email: [/^\S+@\S+\.\S+$/, 'Enter a valid email.'],
};
function check(obj, rules) {
    const fields = [];
    for (const [path, test, message] of rules) {
        const v = path.split('.').reduce((o, k) => o?.[k], obj);
        if (!test(v)) fields.push({ path, message });
    }
    if (fields.length) throw fail(400, fields[0].message, fields);
}
const str = (min, max = 240) => (v) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
const match = ([re]) => (v) => typeof v === 'string' && re.test(v);

/* ---------- pricing: the same rules as the server ---------- */
function priceLines(items) {
    const bySlug = new Map(all().map((p) => [p.slug, p]));
    const lines = items.map((it) => {
        const p = bySlug.get(it.slug);
        if (!p) throw fail(409, `${it.slug} is no longer available.`);
        const saree = p.kind === 'saree';
        const blouse = saree ? it.blouse ?? 'unstitched' : 'none';
        const fallPico = saree && !!it.fallPico;
        const blouseSize = blouse === 'stitched' ? it.blouseSize : undefined;
        const services = (blouse === 'stitched' ? BLOUSE_STITCHING : 0) + (fallPico ? FALL_PICO : 0);
        const qty = Math.max(1, Math.min(3, Number(it.qty) || 1));
        return { slug: p.slug, name: p.name, image: p.images[0], price: p.price, qty, blouse, blouseSize, fallPico, look: it.look, services: services * qty, lineTotal: (p.price + services) * qty };
    });
    // a look counts only when every one of its pieces is in the bag under that look
    const whole = new Set(LOOKS.filter((l) => [l.saree, ...l.pieces].every((s) => lines.some((x) => x.slug === s && x.look === l.id))).map((l) => l.id));
    lines.forEach((l) => (l.lookOff = l.look && whole.has(l.look) ? Math.round((l.lineTotal * LOOK_OFF) / 100) : 0));
    return lines;
}
function totalsFor(lines, code) {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const services = lines.reduce((s, l) => s + l.services, 0);
    const lookDiscount = lines.reduce((s, l) => s + (l.lookOff || 0), 0);
    const c = code ? COUPONS[code] : null;
    const discount = c ? Math.min(c.cap, Math.round(((subtotal - lookDiscount) * c.pct) / 100)) : 0;
    const shipping = subtotal - lookDiscount - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
    return { subtotal, services, lookDiscount, discount, shipping, total: subtotal + services - lookDiscount - discount + shipping };
}
const publicOrder = (o) => ({ ...o, customer: { name: o.customer.name, city: o.customer.city, pincode: o.customer.pincode }, user: undefined });

function bookable(date) {
    const ist = new Date(Date.now() + 330 * 60 * 1000);
    const today = ist.toISOString().slice(0, 10);
    const d = new Date(`${date}T00:00:00Z`);
    const days = Math.round((d - new Date(`${today}T00:00:00Z`)) / 86400000);
    return days >= 1 && days <= 14 && d.getUTCDay() !== 0;
}

const SORTS = {
    featured: (a, b) => Number(b.featured) - Number(a.featured),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    new: () => 0,
};

/* ---------- the routes ---------- */
export async function mockApi(path, { method = 'GET', body } = {}) {
    await new Promise((r) => setTimeout(r, 120)); // a little network time, so loaders show
    const db = load();
    const [route, qs] = path.split('?');
    const q = new URLSearchParams(qs);
    const me = db.users.find((u) => u.id === db.session);
    const respond = (data) => {
        save(db);
        return JSON.parse(JSON.stringify(data));
    };

    if (method === 'GET' && route === '/products') {
        const kind = q.get('kind') || 'saree';
        let list = all().filter((p) => kind === 'all' || p.kind === kind);
        if (q.get('weave')) list = list.filter((p) => q.get('weave').split(',').includes(p.weave));
        if (q.get('colour')) list = list.filter((p) => q.get('colour').split(',').includes(p.colour));
        if (q.get('min')) list = list.filter((p) => p.price >= Number(q.get('min')));
        if (q.get('max')) list = list.filter((p) => p.price <= Number(q.get('max')));
        if (q.get('featured')) list = list.filter((p) => p.featured);
        if (q.get('q')) {
            const words = q.get('q').toLowerCase().split(/\s+/).filter(Boolean);
            list = list.filter((p) => words.some((w) => `${p.name} ${p.weave} ${p.colour} ${p.region}`.toLowerCase().includes(w)));
        }
        list = [...list].sort(SORTS[q.get('sort')] ?? SORTS.featured);
        return respond({ products: list.map((p) => withStock(db, p)) });
    }
    if (method === 'GET' && route === '/filters') {
        const count = (key) => {
            const m = new Map();
            SAREES.forEach((p) => m.set(p[key], { _id: p[key], swatch: m.get(p[key])?.swatch ?? p.swatch, count: (m.get(p[key])?.count ?? 0) + 1 }));
            return [...m.values()].sort((a, b) => a._id.localeCompare(b._id));
        };
        const prices = SAREES.map((p) => p.price);
        return respond({ weaves: count('weave'), colours: count('colour'), range: { min: Math.min(...prices), max: Math.max(...prices) } });
    }
    if (method === 'GET' && route.startsWith('/products/')) {
        const p = all().find((x) => x.slug === route.slice(10));
        if (!p) throw fail(404, 'We could not find that saree.');
        const related = all().filter((x) => x.kind === p.kind && x.weave === p.weave && x.slug !== p.slug).slice(0, 4);
        return respond({ product: withStock(db, p), related: related.map((x) => withStock(db, x)) });
    }
    if (method === 'GET' && route === '/looks') {
        const by = Object.fromEntries(all().map((p) => [p.slug, withStock(db, p)]));
        return respond({ looks: LOOKS.map((l) => ({ id: l.id, photo: l.photo, saree: by[l.saree], pieces: l.pieces.map((s) => by[s]) })), lookOff: LOOK_OFF });
    }
    if (method === 'POST' && route === '/quote') {
        const code = body.coupon ? String(body.coupon).toUpperCase() : undefined;
        const lines = priceLines(body.items ?? []);
        const ok = !code || !!COUPONS[code];
        return respond({ lines, totals: totalsFor(lines, ok ? code : null), coupon: code ? { code, ok, label: COUPONS[code]?.label ?? 'This code is not valid.' } : null });
    }
    if (method === 'POST' && route === '/orders') {
        check(body, [
            ['customer.name', str(2, 60), 'Enter your name.'],
            ['customer.phone', match(rx.phone), rx.phone[1]],
            ['customer.email', match(rx.email), rx.email[1]],
            ['customer.address', str(8), 'Enter your full address.'],
            ['customer.city', str(2, 60), 'Enter your city.'],
            ['customer.pincode', match(rx.pincode), rx.pincode[1]],
        ]);
        if (!body.items?.length) throw fail(400, 'Your bag is empty.');
        if (body.items.some((i) => i.blouse === 'stitched' && !SIZES.includes(i.blouseSize))) throw fail(400, 'Pick a blouse size for the stitched blouse.');
        const code = body.coupon ? String(body.coupon).toUpperCase() : undefined;
        if (code && !COUPONS[code]) throw fail(400, 'That coupon code is not valid.');
        const lines = priceLines(body.items);
        const totals = totalsFor(lines, code);
        if (body.payment === 'cod' && totals.total > 50000) throw fail(400, 'Pay on delivery is for orders up to ₹50,000. Choose UPI or card.');
        // take stock line by line; nothing is taken if any line runs out
        const need = {};
        lines.forEach((l) => (need[l.slug] = (need[l.slug] ?? 0) + l.qty));
        for (const [slug, n] of Object.entries(need)) {
            const left = db.stock[slug] ?? all().find((p) => p.slug === slug).stock;
            if (left < n) throw fail(409, `Only a few of the ${all().find((p) => p.slug === slug).name} were left and they just sold. Remove it to continue.`);
        }
        Object.entries(need).forEach(([slug, n]) => (db.stock[slug] = (db.stock[slug] ?? all().find((p) => p.slug === slug).stock) - n));
        const order = { orderNo: `TA${Date.now().toString(36).toUpperCase().slice(-5)}${Math.floor(100 + Math.random() * 900)}`, user: me?.id, items: lines, customer: body.customer, payment: body.payment, coupon: code, totals, status: 'placed', createdAt: new Date().toISOString() };
        db.orders.push(order);
        return respond({ order: publicOrder(order) });
    }
    if (method === 'POST' && route === '/orders/lookup') {
        const o = db.orders.find((x) => x.orderNo === String(body.orderNo || '').toUpperCase());
        if (!o || o.customer.phone !== body.phone) throw fail(404, 'No order matches that number and phone.');
        return respond({ order: publicOrder(o) });
    }
    if (method === 'GET' && route === '/me/orders') {
        if (!me) throw fail(401, 'Please sign in first.');
        return respond({ orders: db.orders.filter((o) => o.user === me.id).reverse().map(publicOrder) });
    }
    if (route === '/auth/me') return respond({ user: me ? { id: me.id, name: me.name, email: me.email } : null });
    if (method === 'POST' && route === '/auth/register') {
        check(body, [
            ['name', str(2, 60), 'Enter your name.'],
            ['email', match(rx.email), rx.email[1]],
            ['password', (v) => typeof v === 'string' && v.length >= 8, 'Use at least 8 characters for the password.'],
        ]);
        const email = body.email.toLowerCase();
        if (db.users.some((u) => u.email === email)) throw fail(409, 'An account with this email already exists. Sign in instead.');
        // demo only: the password is never stored, the real server keeps a bcrypt hash
        const user = { id: `u${Date.now().toString(36)}`, name: body.name.trim(), email };
        db.users.push(user);
        db.session = user.id;
        return respond({ user });
    }
    if (method === 'POST' && route === '/auth/login') {
        const user = db.users.find((u) => u.email === String(body.email || '').toLowerCase());
        if (!user || !body.password) throw fail(401, 'Email or password is not right.');
        db.session = user.id;
        return respond({ user });
    }
    if (method === 'POST' && route === '/auth/logout') {
        db.session = null;
        return respond({ ok: true });
    }
    if (method === 'GET' && route === '/appointments/slots') {
        const date = q.get('date');
        if (!bookable(date)) return respond({ date, slots: [] });
        const booked = new Set(db.appointments.filter((a) => a.date === date).map((a) => a.slot));
        return respond({ date, slots: SLOTS.map((time) => ({ time, free: !booked.has(time) })) });
    }
    if (method === 'POST' && route === '/appointments') {
        check(body, [
            ['name', str(2, 60), 'Enter your name.'],
            ['phone', match(rx.phone), rx.phone[1]],
        ]);
        if (!bookable(body.date) || !SLOTS.includes(body.slot)) throw fail(400, 'Pick a day between tomorrow and two weeks out, Monday to Saturday.');
        if (db.appointments.some((a) => a.date === body.date && a.slot === body.slot)) throw fail(409, 'Someone just booked that time. Pick another slot.');
        db.appointments.push({ date: body.date, slot: body.slot, name: body.name, language: body.language });
        return respond({ ok: true });
    }
    if (method === 'POST' && route === '/newsletter') {
        check(body, [['email', match(rx.email), rx.email[1]]]);
        if (!db.subscribers.includes(body.email.toLowerCase())) db.subscribers.push(body.email.toLowerCase());
        return respond({ ok: true });
    }
    throw fail(404, 'Not found.');
}
