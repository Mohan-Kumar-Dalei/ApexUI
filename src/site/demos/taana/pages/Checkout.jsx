import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { Row } from '../chrome.jsx';
import { Field } from '../parts.jsx';
import { api, img, inr, useAuth, useBag } from '../lib.jsx';
import { u } from '../base.js';

const EASE = [0.16, 1, 0.3, 1];
const PAY = [
    ['upi', 'UPI', 'We send a payment link to your phone after you place the order.'],
    ['card', 'Card', 'Pay on the secure page that opens next.'],
    ['cod', 'Pay on delivery', 'Cash or UPI to the courier. Orders up to ₹50,000.'],
];

export default function Checkout() {
    const bag = useBag();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });
    const [payment, setPayment] = useState('upi');
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [fail, setFail] = useState('');
    const t = bag.quote?.totals;

    useEffect(() => {
        document.title = 'Checkout | Taana';
    }, []);
    useEffect(() => {
        if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
    }, [user]);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: undefined }));
    };

    // Same rules as the server, so most mistakes are caught before sending.
    const check = () => {
        const e = {};
        if (form.name.trim().length < 2) e.name = 'Enter your name.';
        if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a 10 digit mobile number.';
        if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
        if (form.address.trim().length < 8) e.address = 'Enter your full address.';
        if (form.city.trim().length < 2) e.city = 'Enter your city.';
        if (!/^[1-9]\d{5}$/.test(form.pincode)) e.pincode = 'Enter a 6 digit pincode.';
        if (payment === 'cod' && t?.total > 50000) e.payment = 'Pay on delivery is for orders up to ₹50,000. Choose UPI or card.';
        return e;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        setFail('');
        const e = check();
        setErrors(e);
        if (Object.keys(e).length) return document.getElementById(`co-${Object.keys(e)[0]}`)?.focus();
        setBusy(true);
        try {
            const { order } = await api('/orders', {
                method: 'POST',
                body: { items: bag.items.map(({ slug, qty, blouse, blouseSize, fallPico, look }) => ({ slug, qty, blouse, blouseSize, fallPico, look })), customer: form, payment, coupon: bag.quote?.coupon?.ok ? bag.coupon : undefined },
            });
            bag.clear();
            navigate(u(`/order/${order.orderNo}`), { state: { order }, replace: true });
        } catch (err) {
            if (err.fields) setErrors(Object.fromEntries(err.fields.map((f) => [f.path.replace('customer.', ''), f.message])));
            setFail(err.message);
            setBusy(false);
        }
    };

    if (!bag.items.length)
        return (
            <div className="mx-auto max-w-xl px-5 pb-32 pt-40 sm:px-8">
                <h1 className="text-5xl">Your bag is empty.</h1>
                <p className="mt-4 text-tn-muted">Pick a saree first, then come back here to send it home.</p>
                <Link to={u('/sarees')} className="mt-8 inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                    See the sarees
                </Link>
            </div>
        );

    return (
        <form onSubmit={submit} noValidate className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-28 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-[1fr_440px] lg:gap-16">
            <div className="min-w-0">
                <h1 className="text-[clamp(2.6rem,6vw,4.6rem)]">Send it home</h1>
                {!user && (
                    <p className="mt-3 text-tn-muted">
                        Have an account?{' '}
                        <Link to={u('/account')} state={{ back: u('/checkout') }} className="text-tn-ink underline underline-offset-4">
                            Sign in
                        </Link>{' '}
                        to keep this order with your others. Or just continue.
                    </p>
                )}

                <fieldset className="mt-10 min-w-0">
                    <legend className="label">Delivery</legend>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <Field id="co-name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                        <Field id="co-phone" label="Mobile number" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={form.phone} onChange={(e) => set('phone')({ target: { value: e.target.value.replace(/\D/g, '') } })} error={errors.phone} />
                        <Field id="co-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} className="sm:col-span-2" />
                        <Field id="co-address" label="Address" autoComplete="street-address" placeholder="Flat, building, street, area" value={form.address} onChange={set('address')} error={errors.address} className="sm:col-span-2" />
                        <Field id="co-city" label="City" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
                        <Field id="co-pincode" label="Pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode} onChange={(e) => set('pincode')({ target: { value: e.target.value.replace(/\D/g, '') } })} error={errors.pincode} />
                    </div>
                </fieldset>

                <fieldset className="mt-12 min-w-0">
                    <legend className="label">Payment</legend>
                    <div className="mt-4 grid gap-2">
                        {PAY.map(([v, label, note]) => (
                            <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition-colors ${payment === v ? 'border-tn-ink bg-tn-card' : 'border-tn-line hover:border-tn-muted'}`}>
                                <input id={v === 'upi' ? 'co-payment' : undefined} type="radio" name="payment" value={v} checked={payment === v} onChange={() => (setPayment(v), setErrors((er) => ({ ...er, payment: undefined })))} className="sr-only" />
                                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${payment === v ? 'border-tn-accent' : 'border-tn-line'}`}>{payment === v && <span className="h-2.5 w-2.5 rounded-full bg-tn-accent" />}</span>
                                <span>
                                    <span className="block font-medium">{label}</span>
                                    <span className="text-[14px] text-tn-muted">{note}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.payment && <p className="mt-2 text-[13px] text-tn-accent">{errors.payment}</p>}
                </fieldset>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-tn-line bg-tn-card p-6">
                    <h2 className="text-2xl">
                        {bag.count} {bag.count === 1 ? 'saree' : 'sarees'}
                    </h2>
                    <ul className="mt-4 space-y-4">
                        {bag.items.map((it) => (
                            <li key={`${it.slug}${it.blouse}${it.blouseSize}${it.fallPico}${it.look}`} className="flex gap-3">
                                <img src={img(it.image, 120, 160)} alt="" className="h-20 w-[60px] shrink-0 bg-tn-surface object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-tn-display text-[1.05rem] leading-tight">{it.name}</p>
                                    <p className="mt-1 text-[13px] text-tn-muted">
                                        Qty {it.qty}
                                        {it.kind !== 'jewellery' && ` · blouse ${it.blouse === 'stitched' ? `stitched, size ${it.blouseSize}` : it.blouse === 'none' ? 'none' : 'piece'}`}
                                        {it.fallPico ? ' · fall and pico' : ''}
                                        {it.look ? ' · part of a look' : ''}
                                    </p>
                                </div>
                                <span className="text-[15px] tnum">{inr(it.price * it.qty)}</span>
                            </li>
                        ))}
                    </ul>
                    <dl className="mt-6 space-y-1.5 border-t border-tn-line pt-4 text-[15px]">
                        <Row k="Sarees" v={t ? inr(t.subtotal) : '…'} />
                        {t?.services > 0 && <Row k="Stitching and finishing" v={inr(t.services)} />}
                        {t?.lookDiscount > 0 && <Row k="Complete look, 10% off" v={`− ${inr(t.lookDiscount)}`} />}
                        {t?.discount > 0 && <Row k={`Coupon ${bag.coupon}`} v={`− ${inr(t.discount)}`} />}
                        <Row k="Shipping" v={t ? (t.shipping ? inr(t.shipping) : 'Free') : '…'} />
                        <div className="flex justify-between border-t border-tn-line pt-3 text-xl font-semibold">
                            <dt>To pay</dt>
                            <dd className="tnum">{t ? inr(t.total) : '…'}</dd>
                        </div>
                    </dl>
                    {fail && (
                        <p role="alert" className="mt-4 rounded-xl bg-tn-surface p-3 text-[14px] text-tn-accent">
                            {fail}
                        </p>
                    )}
                    <button disabled={busy || !t} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-tn-accent text-[16px] font-medium text-tn-on-accent disabled:opacity-60">
                        <Lock className="h-4 w-4" /> {busy ? 'Placing your order' : `Place order${t ? `, ${inr(t.total)}` : ''}`}
                    </button>
                    <p className="mt-3 text-center text-[13px] text-tn-muted">Returns within 7 days if unworn. Stitched blouses can be exchanged.</p>
                </div>
            </aside>
        </form>
    );
}

/* ---------------- after the order ---------------- */
export function OrderDone() {
    const { state } = useLocation();
    const order = state?.order;
    useEffect(() => {
        document.title = 'Order placed | Taana';
    }, []);
    if (!order)
        return (
            <div className="mx-auto max-w-xl px-5 pb-32 pt-40 sm:px-8">
                <h1 className="text-5xl">Looking for an order?</h1>
                <p className="mt-4 text-tn-muted">Track it with its number and your phone from your account page.</p>
                <Link to={u('/account')} className="mt-8 inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                    Track an order
                </Link>
            </div>
        );
    const eta = new Date(new Date(order.createdAt).getTime() + 6 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    return (
        <div className="mx-auto max-w-3xl px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }} className="grid h-16 w-16 place-items-center rounded-full bg-tn-accent text-tn-on-accent">
                <Check className="h-7 w-7" />
            </motion.span>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
                <h1 className="mt-8 text-[clamp(2.6rem,6vw,4.6rem)]">Thank you, {order.customer.name.split(' ')[0]}.</h1>
                <p className="mt-4 text-[1.1rem] text-tn-muted">
                    Order <strong className="font-semibold text-tn-ink tnum">{order.orderNo}</strong> is placed. It leaves our Varanasi room within 48 hours and should reach {order.customer.city} by {eta}.
                    {order.payment === 'upi' && ' A UPI payment link is on its way to your phone.'}
                </p>
                <ul className="mt-10 divide-y divide-tn-line border-y border-tn-line">
                    {order.items.map((it) => (
                        <li key={it.slug + it.blouse} className="flex items-center gap-4 py-4">
                            <img src={img(it.image, 120, 160)} alt="" className="h-20 w-[60px] bg-tn-surface object-cover" />
                            <span className="flex-1 font-tn-display text-lg">
                                {it.name} <span className="font-tn-text text-[14px] text-tn-muted">× {it.qty}</span>
                            </span>
                            <span className="tnum">{inr(it.lineTotal)}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 flex justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span className="tnum">{inr(order.totals.total)}</span>
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                    <Link to={u('/sarees')} className="inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                        Keep looking
                    </Link>
                    <Link to={u('/account')} className="inline-flex h-12 items-center rounded-full border border-tn-ink px-6 font-medium">
                        Your orders
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
