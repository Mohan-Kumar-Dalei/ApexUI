import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Field, PageHead } from '../parts.jsx';
import { api, img, inr, useAuth } from '../lib.jsx';
import { u } from '../base.js';

const EASE = [0.16, 1, 0.3, 1];
const STEPS = ['placed', 'packed', 'shipped', 'delivered'];

function OrderCard({ o }) {
    const at = STEPS.indexOf(o.status);
    return (
        <article className="rounded-2xl border border-tn-line bg-tn-card p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl tnum">{o.orderNo}</h3>
                <span className="text-[14px] text-tn-muted">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label={`Status: ${o.status}`}>
                {STEPS.map((s, i) => (
                    <li key={s}>
                        <span className={`block h-1 rounded-full ${i <= at ? 'bg-tn-accent' : 'bg-tn-line'}`} />
                        <span className={`mt-2 block text-[12px] capitalize ${i <= at ? 'text-tn-ink' : 'text-tn-muted'}`}>{s}</span>
                    </li>
                ))}
            </ol>
            <ul className="mt-5 flex flex-wrap gap-3">
                {o.items.map((it) => (
                    <li key={it.slug + it.blouse}>
                        <Link to={u(`/saree/${it.slug}`)} className="flex items-center gap-3">
                            <img src={img(it.image, 96, 128)} alt="" className="h-16 w-12 bg-tn-surface object-cover" />
                            <span className="text-[14px]">
                                {it.name}
                                <span className="block text-tn-muted">× {it.qty}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
            <p className="mt-5 flex justify-between border-t border-tn-line pt-4 font-semibold">
                <span>Total</span>
                <span className="tnum">{inr(o.totals.total)}</span>
            </p>
        </article>
    );
}

function Track() {
    const [orderNo, setOrderNo] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState({ busy: false, error: '', order: null });
    const submit = async (e) => {
        e.preventDefault();
        setState({ busy: true, error: '', order: null });
        try {
            const { order } = await api('/orders/lookup', { method: 'POST', body: { orderNo, phone } });
            setState({ busy: false, error: '', order });
        } catch (err) {
            setState({ busy: false, error: err.message, order: null });
        }
    };
    return (
        <section className="min-w-0">
            <h2 className="text-3xl">Track an order</h2>
            <p className="mt-2 text-tn-muted">No account needed. Use the order number from your email and the phone you ordered with.</p>
            <form onSubmit={submit} noValidate className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Field id="tr-no" label="Order number" value={orderNo} onChange={(e) => setOrderNo(e.target.value.toUpperCase())} placeholder="TA1B2C3456" />
                <Field id="tr-phone" label="Mobile number" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                <button disabled={state.busy} className="h-12 rounded-full bg-tn-ink px-6 font-medium text-tn-bg disabled:opacity-60">
                    {state.busy ? 'Finding it' : 'Find order'}
                </button>
            </form>
            {state.error && (
                <p role="alert" className="mt-4 text-[14px] text-tn-accent">
                    {state.error}
                </p>
            )}
            {state.order && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mt-6">
                    <OrderCard o={state.order} />
                </motion.div>
            )}
        </section>
    );
}

function SignIn() {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [mode, setMode] = useState('in');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [fail, setFail] = useState('');
    const [busy, setBusy] = useState(false);
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setFail('');
        setErrors({});
        setBusy(true);
        try {
            if (mode === 'in') await login({ email: form.email, password: form.password });
            else await register(form);
            if (state?.back) navigate(state.back);
        } catch (err) {
            if (err.fields) setErrors(Object.fromEntries(err.fields.map((f) => [f.path, f.message])));
            setFail(err.message);
        }
        setBusy(false);
    };

    return (
        <section className="min-w-0">
            <div role="tablist" aria-label="Sign in or create account" className="inline-flex rounded-full border border-tn-line p-1">
                {[
                    ['in', 'Sign in'],
                    ['up', 'Create account'],
                ].map(([m, l]) => (
                    <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => (setMode(m), setFail(''), setErrors({}))} className="relative h-10 rounded-full px-5 text-[15px] font-medium">
                        {mode === m && <motion.span layoutId="acc-tab" className="absolute inset-0 rounded-full bg-tn-ink" transition={{ duration: 0.45, ease: EASE }} />}
                        <span className={`relative ${mode === m ? 'text-tn-bg' : ''}`}>{l}</span>
                    </button>
                ))}
            </div>
            <form onSubmit={submit} noValidate className="mt-8 grid max-w-md gap-5">
                <AnimatePresence initial={false}>
                    {mode === 'up' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                            <Field id="ac-name" label="Your name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Field id="ac-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
                <Field id="ac-password" label="Password" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={form.password} onChange={set('password')} error={errors.password} />
                {fail && !Object.keys(errors).length && (
                    <p role="alert" className="text-[14px] text-tn-accent">
                        {fail}
                    </p>
                )}
                <button disabled={busy} className="h-12 rounded-full bg-tn-accent font-medium text-tn-on-accent disabled:opacity-60">
                    {busy ? 'One moment' : mode === 'in' ? 'Sign in' : 'Create account'}
                </button>
            </form>
        </section>
    );
}

export default function Account() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState(null);
    useEffect(() => {
        document.title = 'Your account | Taana';
    }, []);
    useEffect(() => {
        if (!user) return setOrders(null);
        api('/me/orders')
            .then((d) => setOrders(d.orders))
            .catch(() => setOrders([]));
    }, [user]);

    if (user === undefined) return <div className="min-h-[70vh]" />;

    return (
        <>
            <PageHead label="Account" title={user ? `Hello, ${user.name.split(' ')[0]}` : 'Your account'}>
                {user && (
                    <p className="mt-4 text-tn-muted">
                        Signed in as {user.email}.{' '}
                        <button type="button" onClick={logout} className="text-tn-ink underline underline-offset-4">
                            Sign out
                        </button>
                    </p>
                )}
            </PageHead>
            <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-28 sm:px-8 lg:grid-cols-2">
                {user ? (
                    <section className="min-w-0">
                        <h2 className="text-3xl">Your orders</h2>
                        <div className="mt-6 space-y-4">
                            {orders === null && [0, 1].map((i) => <div key={i} className="bone h-56 rounded-2xl" />)}
                            {orders?.length === 0 && (
                                <p className="text-tn-muted">
                                    No orders yet. <Link to={u('/sarees')} className="text-tn-ink underline underline-offset-4">See the sarees</Link>.
                                </p>
                            )}
                            {orders?.map((o) => <OrderCard key={o.orderNo} o={o} />)}
                        </div>
                    </section>
                ) : (
                    <SignIn />
                )}
                <Track />
            </div>
        </>
    );
}
