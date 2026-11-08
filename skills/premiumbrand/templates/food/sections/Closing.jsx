import { useState } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { api } from '../lib/api.js';
import { BlurFade, Lines, Reveal } from '../lib/motion.jsx';
import { ArrowPill, SunMark } from '../components/Brand.jsx';

const QUESTIONS = [
    ['Are all the flavours vegetarian?', 'Yes. Every pack in this store carries the green vegetarian mark. Cream & Onion has milk solids, so it is not vegan.'],
    ['Why is there so much air in the pack?', 'It is nitrogen, not ordinary air. Oxygen makes chips go stale and soft; nitrogen keeps them crisp and stops them breaking on the way to you.'],
    ['How long do the chips keep?', 'Unopened, about four months from the date on the back of the pack. Once open, fold the top over and finish them within a day or two.'],
    ['When will my order arrive?', 'Two to three days in most metro pincodes and three to five days elsewhere. Check your pincode at checkout to see the exact promise.'],
    ['Can I pay when it arrives?', 'Yes. Pay in cash or with UPI to the delivery partner. There is nothing to pay online.'],
    ['How do party boxes work?', 'A box is a fixed set of packs. Add the whole box and every pack in it is 10% off. Remove one pack and the box price goes back to normal.'],
];

export function Questions() {
    const [open, setOpen] = useState(0);
    return (
        <section id="qa" data-tone="light" className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
                <BlurFade className="caps text-gold">Before you order</BlurFade>
                <Lines text="Good" accent="questions." className="mt-3 font-display text-[clamp(40px,6vw,84px)] font-black leading-[0.95] tracking-[-0.02em]" />
                <Reveal as="p" className="mt-5 max-w-[340px] text-[16px] leading-relaxed text-muted">
                    Already ordered?{' '}
                    <Link to="/track" className="font-semibold text-ink underline underline-offset-4">
                        Track it here
                    </Link>{' '}
                    with your order number and phone.
                </Reveal>
            </div>
            <Reveal stagger={0.06} as="ul" className="border-t border-ink/15">
                {QUESTIONS.map(([q, a], i) => (
                    <li key={q} className="border-b border-ink/15">
                        <h3>
                            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold sm:text-[19px]">
                                {q}
                                <Plus size={20} className={`shrink-0 transition-transform duration-500 ease-expo ${open === i ? 'rotate-45 text-accent' : ''}`} />
                            </button>
                        </h3>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-expo ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <p className="overflow-hidden pr-10 text-[15px] leading-relaxed text-muted">
                                <span className="block pb-6">{a}</span>
                            </p>
                        </div>
                    </li>
                ))}
            </Reveal>
        </section>
    );
}

export function Letter() {
    const [email, setEmail] = useState('');
    const [state, setState] = useState({ busy: false, ok: '', error: '' });
    const submit = async (e) => {
        e.preventDefault();
        setState({ busy: true, ok: '', error: '' });
        try {
            const r = await api('/newsletter', { method: 'POST', body: { email } });
            setState({ busy: false, ok: r.message, error: '' });
            setEmail('');
        } catch (err) {
            setState({ busy: false, ok: '', error: err.message });
        }
    };
    return (
        <section id="join" data-tone="light" className="px-3 sm:px-5">
            <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[34px] bg-sun px-6 py-14 sm:px-12 md:py-20">
                <div className="absolute -right-24 -top-24 aspect-square w-[420px] rounded-full bg-[#F8D447]" aria-hidden="true" />
                <div className="relative grid items-center gap-8 lg:grid-cols-2">
                    <div>
                        <p className="caps text-ink/70">The crunch letter</p>
                        <h2 className="mt-3 font-display text-[clamp(34px,4.6vw,64px)] font-black leading-[0.98]">New flavours, once a month.</h2>
                        <p className="mt-4 max-w-[420px] text-[16px] text-ink/80">One short email when something new reaches the shelf. No daily offers.</p>
                    </div>
                    <form onSubmit={submit} className="w-full" noValidate>
                        <label htmlFor="letter-email" className="caps text-ink/70">
                            Email address
                        </label>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                            <input id="letter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={!!state.error} aria-describedby="letter-msg" className="h-14 min-w-0 flex-1 rounded-full border-2 border-ink/15 bg-white px-6 text-[16px] font-medium outline-none transition focus:border-ink" />
                            <ArrowPill tone="ink" type="submit" disabled={state.busy} className="h-14 justify-between">
                                {state.busy ? 'Adding you' : 'Sign me up'}
                            </ArrowPill>
                        </div>
                        <p id="letter-msg" role="status" className={`mt-3 min-h-[22px] text-[14px] font-semibold ${state.error ? 'text-accent-deep' : 'text-ink'}`}>
                            {state.error || state.ok}
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer data-tone="dark" className="mt-24 bg-ink text-bg">
            <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <div className="flex items-center gap-3">
                        <SunMark className="h-12 w-14" />
                        <p className="font-display text-[26px] font-black italic">Crunch Store</p>
                    </div>
                    <p className="mt-4 max-w-[320px] text-[15px] leading-relaxed text-bg/70">Every flavour in every size, sent to your door. Pay in cash or UPI when it arrives.</p>
                    <p className="mt-6 text-[14px] text-bg/70">
                        hello@crunchstore.example
                        <br />
                        Mon to Sat, 10 am to 7 pm
                    </p>
                </div>
                {[
                    ['Shop', [['#shelf', 'The shelf'], ['#boxes', 'Party boxes'], ['#flavours', 'By moment']]],
                    ['Orders', [['/track', 'Track an order'], ['/checkout', 'Checkout'], ['#questions', 'Delivery']]],
                    ['About', [['#kitchen', 'How chips are made'], ['#questions', 'Questions'], ['#top', 'Back to top']]],
                ].map(([h, links]) => (
                    <div key={h}>
                        <p className="caps text-sun">{h}</p>
                        <ul className="mt-4 space-y-2.5">
                            {links.map(([to, label]) => (
                                <li key={label}>
                                    {to.startsWith('#') ? (
                                        <Link to={`/${to}`} className="text-[15px] text-bg/80 transition hover:text-sun">
                                            {label}
                                        </Link>
                                    ) : (
                                        <Link to={to} className="text-[15px] text-bg/80 transition hover:text-sun">
                                            {label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-bg/10">
                <p className="mx-auto max-w-[1320px] px-5 py-6 text-[12.5px] leading-relaxed text-bg/50 sm:px-8">
                    A fan-made concept store built as a design and code study. It is not affiliated with, endorsed by or operated by PepsiCo or the Lay's brand. Product names are used for illustration; packs, prices, stock and nutrition figures are sample data and no real orders are fulfilled.
                </p>
            </div>
        </footer>
    );
}
