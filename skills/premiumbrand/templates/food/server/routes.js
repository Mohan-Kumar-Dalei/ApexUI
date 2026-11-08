import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { PRODUCTS, CATEGORIES, BOXES, BOX_OFF, PICK3, FREE_SHIPPING_FROM, SHIPPING, MAX_QTY } from './catalogue.js';
import { priceLines, totalsFor, fail } from './pricing.js';
import { tx, read } from './store.js';

export const api = Router();

const writes = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many tries. Wait a few minutes and try again.' } });
const quotes = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Slow down a little and try again.' } });

/* ---------- validation ---------- */
const slug = z.string().regex(/^[a-z0-9-]{2,40}$/, 'Unknown flavour.');
const Item = z.object({
    slug,
    size: z.enum(['s', 'm', 'l'], { message: 'Choose a pack size.' }),
    qty: z.number().int().min(1, 'At least one pack.').max(MAX_QTY, `At most ${MAX_QTY} of one pack per order.`),
    box: z.string().regex(/^[a-z0-9-]{2,40}$/).nullish(),
});
const Bag = z.object({
    items: z.array(Item).max(40, 'That is a lot of lines. Split it into two orders.'),
    coupon: z.string().trim().max(24).optional().default(''),
});
const Customer = z.object({
    name: z.string().trim().min(2, 'Enter your full name.').max(80, 'Keep the name under 80 characters.'),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a 10 digit mobile number.'),
    email: z.union([z.literal(''), z.string().trim().email('Enter a valid email or leave it empty.')]).optional().default(''),
    address: z.string().trim().min(8, 'Enter a house number and street.').max(240, 'Keep the address under 240 characters.'),
    city: z.string().trim().min(2, 'Enter your city.').max(60),
    pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a 6 digit pincode.'),
});
const Order = Bag.extend({
    items: Bag.shape.items.min(1, 'Your bag is empty.'),
    customer: Customer,
    payment: z.enum(['cod', 'upi'], { message: 'Choose how you will pay.' }),
});

const parse = (schema, data) => {
    const r = schema.safeParse(data);
    if (r.success) return r.data;
    const fields = {};
    for (const i of r.error.issues) {
        const k = i.path.join('.') || 'form';
        if (!fields[k]) fields[k] = i.message;
    }
    throw fail(Object.values(fields)[0] || 'Check the form and try again.', 400, fields);
};

/* ---------- public shapes ---------- */
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
    image: p.image,
    ingredient: p.ingredient,
    note: p.note,
    fact: p.fact,
    ingredients: p.ingredients,
    sizes: p.sizes.map((s) => ({ ...s, inStock: (stock[`${p.slug}:${s.id}`] ?? 0) > 0 })),
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
    // sample delivery promise: metros by first digit are quicker
    const d = Number(pincode[0]);
    return d === 1 || d === 4 || d === 5 || d === 6 || d === 7 ? '2 to 3 days' : '3 to 5 days';
};

/* ---------- routes ---------- */
api.get('/products', (_req, res) => {
    const { stock } = read();
    res.json({
        products: PRODUCTS.map((p) => publicProduct(p, stock)),
        categories: CATEGORIES.map((c) => ({ ...c, count: PRODUCTS.filter((p) => p.category === c.id).length })),
        boxes: BOXES,
        pick3: PICK3,
        rules: { boxOff: BOX_OFF, freeShippingFrom: FREE_SHIPPING_FROM, shipping: SHIPPING, maxQty: MAX_QTY },
    });
});

api.get('/delivery', (req, res) => {
    const { pincode } = parse(z.object({ pincode: z.string().regex(/^[1-9]\d{5}$/, 'Enter a 6 digit pincode.') }), req.query);
    res.json({ pincode, eta: etaFor(pincode), cod: true });
});

api.post('/quote', quotes, (req, res) => {
    const { items, coupon } = parse(Bag, req.body);
    const lines = priceLines(items);
    res.json({ lines, totals: totalsFor(lines, coupon) });
});

api.post('/orders', writes, async (req, res) => {
    const { items, coupon, customer, payment } = parse(Order, req.body);
    const lines = priceLines(items);
    const totals = totalsFor(lines, coupon);
    if (totals.couponError) throw fail(totals.couponError, 400, { coupon: totals.couponError });
    const order = await tx((db) => {
        // take stock for every line, or none of it
        const taken = [];
        for (const l of lines) {
            const key = `${l.slug}:${l.size}`;
            if ((db.stock[key] ?? 0) < l.qty) {
                taken.forEach(([k, q]) => (db.stock[k] += q));
                throw fail(`Only ${db.stock[key] ?? 0} of ${l.name} (${l.sizeLabel}) left. Lower the count and try again.`);
            }
            db.stock[key] -= l.qty;
            taken.push([key, l.qty]);
        }
        const o = {
            number: 'LY' + randomBytes(4).toString('hex').toUpperCase(),
            placedAt: new Date().toISOString(),
            status: 'placed',
            payment,
            customer,
            eta: etaFor(customer.pincode),
            lines,
            totals,
        };
        db.orders.push(o);
        return o;
    });
    res.status(201).json({ order: publicOrder(order) });
});

// POST keeps the phone number out of URLs and logs
api.post('/orders/lookup', writes, (req, res) => {
    const { number, phone } = parse(
        z.object({
            number: z.string().trim().toUpperCase().pipe(z.string().regex(/^LY[0-9A-F]{8}$/, 'Order numbers look like LY1A2B3C4D.')),
            phone: Customer.shape.phone,
        }),
        req.body,
    );
    const o = read().orders.find((x) => x.number === number && x.customer.phone === phone);
    if (!o) throw fail('No order matches that number and phone.', 404);
    res.json({ order: publicOrder(o) });
});

api.post('/newsletter', writes, async (req, res) => {
    const { email } = parse(z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address.').max(120) }), req.body);
    const isNew = await tx((db) => {
        if (db.subscribers.some((s) => s.email === email)) return false;
        db.subscribers.push({ email, at: new Date().toISOString() });
        return true;
    });
    res.status(isNew ? 201 : 200).json({ ok: true, message: isNew ? 'You are on the list. The first letter comes at the start of next month.' : 'You were already on the list. See you next month.' });
});

api.use((_req, _res) => {
    throw fail('Not found.', 404);
});
