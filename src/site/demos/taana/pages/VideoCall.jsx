import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Video } from 'lucide-react';
import { Field, PageHead } from '../parts.jsx';
import { api, img, useApi } from '../lib.jsx';
import { u } from '../base.js';

const EASE = [0.16, 1, 0.3, 1];
const LANGS = ['English', 'Hindi', 'Tamil', 'Marathi', 'Bengali'];

// Tomorrow to 14 days out, skipping Sundays (dates in IST).
function days() {
    const out = [];
    const ist = new Date(Date.now() + 330 * 60000);
    for (let i = 1; i <= 14; i++) {
        const d = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + i));
        if (d.getUTCDay() === 0) continue;
        out.push({ iso: d.toISOString().slice(0, 10), day: d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' }), date: d.getUTCDate(), month: d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' }) });
    }
    return out;
}
const twelve = (t) => {
    const h = Number(t.slice(0, 2));
    return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'pm' : 'am'}`;
};

export default function VideoCall() {
    const [params] = useSearchParams();
    const dates = useMemo(days, []);
    const [date, setDate] = useState(dates[0].iso);
    const [slot, setSlot] = useState('');
    const [form, setForm] = useState({ name: '', phone: '', language: 'English', interest: params.get('saree') ? `The ${params.get('saree').replace(/-/g, ' ')}` : '' });
    const [errors, setErrors] = useState({});
    const [fail, setFail] = useState('');
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [nonce, setNonce] = useState(0);
    const slots = useApi(`/appointments/slots?date=${date}&n=${nonce}`, { minDelay: 400 });

    useEffect(() => {
        document.title = 'Book a video call | Taana';
    }, []);
    useEffect(() => setSlot(''), [date]);

    const submit = async (e) => {
        e.preventDefault();
        setFail('');
        const er = {};
        if (!slot) er.slot = 'Pick a time.';
        if (form.name.trim().length < 2) er.name = 'Enter your name.';
        if (!/^[6-9]\d{9}$/.test(form.phone)) er.phone = 'Enter a 10 digit mobile number.';
        setErrors(er);
        if (Object.keys(er).length) return;
        setBusy(true);
        try {
            await api('/appointments', { method: 'POST', body: { date, slot, ...form, interest: form.interest || undefined } });
            setDone(true);
        } catch (err) {
            setFail(err.message);
            if (err.status === 409) {
                setSlot('');
                setNonce((n) => n + 1);
            }
        }
        setBusy(false);
    };

    const picked = dates.find((d) => d.iso === date);

    return (
        <>
            <PageHead label="Free, 20 minutes" title="See it on a video call">
                <p className="mt-4 max-w-xl text-tn-muted">Someone from our Varanasi room drapes the saree, holds it to the window and shows you the border and the back of the weave. You do not have to buy.</p>
            </PageHead>
            <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 sm:px-8 lg:grid-cols-[1fr_420px]">
                <AnimatePresence mode="wait">
                    {done ? (
                        <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="min-w-0">
                            <span className="grid h-14 w-14 place-items-center rounded-full bg-tn-accent text-tn-on-accent">
                                <Check className="h-6 w-6" />
                            </span>
                            <h2 className="mt-6 text-[clamp(2.2rem,5vw,3.6rem)]">
                                Booked for {picked.day} {picked.date} {picked.month}, {twelve(slot)}.
                            </h2>
                            <p className="mt-4 max-w-lg text-tn-muted">We will call {form.phone} on WhatsApp video at that time, in {form.language}. If you need to move it, reply to the confirmation message.</p>
                            <Link to={u('/sarees')} className="mt-8 inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                                Shortlist sarees for the call
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }} className="min-w-0">
                            <fieldset className="min-w-0">
                                <legend className="label">Day</legend>
                                <div className="no-bar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" data-lenis-prevent>
                                    {dates.map((d) => (
                                        <button key={d.iso} type="button" aria-pressed={date === d.iso} onClick={() => setDate(d.iso)} className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors ${date === d.iso ? 'border-tn-ink bg-tn-ink text-tn-bg' : 'border-tn-line hover:border-tn-ink'}`}>
                                            <span className={`text-[12px] ${date === d.iso ? 'text-tn-bg/70' : 'text-tn-muted'}`}>{d.day}</span>
                                            <span className="font-tn-display text-2xl leading-none">{d.date}</span>
                                            <span className={`text-[12px] ${date === d.iso ? 'text-tn-bg/70' : 'text-tn-muted'}`}>{d.month}</span>
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <fieldset className="mt-10 min-w-0">
                                <legend className="label">Time (IST)</legend>
                                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                                    {slots.loading || !slots.data
                                        ? Array.from({ length: 7 }, (_, i) => <div key={i} className="bone h-12 rounded-xl" aria-hidden="true" />)
                                        : slots.data.slots.map((s) => (
                                              <button key={s.time} type="button" disabled={!s.free} aria-pressed={slot === s.time} onClick={() => (setSlot(s.time), setErrors((e) => ({ ...e, slot: undefined })))} className={`h-12 rounded-xl border text-[15px] tnum transition-colors disabled:cursor-not-allowed disabled:border-dashed disabled:text-tn-muted disabled:line-through ${slot === s.time ? 'border-tn-accent bg-tn-accent text-tn-on-accent' : 'border-tn-line hover:border-tn-ink'}`}>
                                                  {twelve(s.time)}
                                              </button>
                                          ))}
                                </div>
                                {errors.slot && <p className="mt-2 text-[13px] text-tn-accent">{errors.slot}</p>}
                            </fieldset>

                            <fieldset className="mt-10 grid min-w-0 gap-5 sm:grid-cols-2">
                                <legend className="label mb-3">You</legend>
                                <Field id="vc-name" label="Name" autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
                                <Field id="vc-phone" label="WhatsApp number" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} error={errors.phone} />
                                <div className="sm:col-span-2">
                                    <p className="mb-2 text-[14px] font-medium">Language</p>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGS.map((l) => (
                                            <button key={l} type="button" aria-pressed={form.language === l} onClick={() => setForm((f) => ({ ...f, language: l }))} className={`h-10 rounded-full border px-4 text-[14px] ${form.language === l ? 'border-tn-ink bg-tn-ink text-tn-bg' : 'border-tn-line hover:border-tn-ink'}`}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Field id="vc-interest" label="What would you like to see? (optional)" value={form.interest} onChange={(e) => setForm((f) => ({ ...f, interest: e.target.value }))} placeholder="A red Kanjivaram for my sister's wedding" className="sm:col-span-2" />
                            </fieldset>
                            {fail && (
                                <p role="alert" className="mt-6 text-[14px] text-tn-accent">
                                    {fail}
                                </p>
                            )}
                            <button disabled={busy} className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-tn-accent text-[16px] font-medium text-tn-on-accent disabled:opacity-60 sm:w-auto sm:px-10">
                                <Video className="h-4 w-4" /> {busy ? 'Booking' : slot ? `Book ${picked?.day} ${picked?.date}, ${twelve(slot)}` : 'Book the call'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
                <aside className="hidden lg:block">
                    <div className="sticky top-28">
                        <div className="aspect-[4/5] overflow-hidden bg-tn-surface">
                            <img src={img('photo-1610189012906-4c0aa9b9781e', 840, 1050)} alt="A navy and gold silk saree draped for the camera" className="h-full w-full object-cover" />
                        </div>
                        <p className="mt-4 text-[15px] text-tn-muted">Calls are on WhatsApp video from our room in Varanasi, with natural light so the colour on your screen is close to the real thing.</p>
                    </div>
                </aside>
            </div>
        </>
    );
}
