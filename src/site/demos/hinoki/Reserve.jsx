import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import { SEATINGS } from './content.js';

/*
 * Booking widget. Picking a day "asks" for seats, so the seatings show a skeleton
 * for a moment, then the real counts arrive. Nothing is sent anywhere: it is a demo.
 */
const EASE = [0.16, 1, 0.3, 1];
const PRICE = 9500;
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

function nextDays(count) {
    const out = [];
    const d = new Date();
    while (out.length < count) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 1) out.push(new Date(d)); // closed on Mondays
    }
    return out;
}

export default function Reserve({ serif }) {
    const days = useMemo(() => nextDays(7), []);
    const [day, setDay] = useState(0);
    const [loading, setLoading] = useState(true);
    const [seating, setSeating] = useState(null);
    const [guests, setGuests] = useState(2);
    const [sent, setSent] = useState(false);
    const box = useRef(null);
    const seen = useInView(box, { once: true, margin: '0px 0px -20% 0px' });

    useEffect(() => {
        setLoading(true);
        setSeating(null);
        if (!seen) return undefined;
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, [day, seen]);

    const left = seating === null ? 0 : SEATINGS[seating].left[day];
    useEffect(() => {
        if (seating !== null) setGuests((g) => Math.min(Math.max(g, 1), left));
    }, [seating, left]);

    const submit = (e) => {
        e.preventDefault();
        if (seating === null) return;
        setSent(true);
    };

    const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'short' });
    const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    if (sent) {
        return (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="border border-[var(--h-line)] p-8 sm:p-12">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--h-accent)] text-[var(--h-accent)]">
                    <Check className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-[clamp(2rem,5vw,3rem)] leading-none" style={serif}>
                    Your seats are held
                </h3>
                <p className="mt-4 max-w-md text-[var(--h-muted)]">
                    {guests} {guests === 1 ? 'guest' : 'guests'}, {fmtDay(days[day])} {fmtDate(days[day])} at {SEATINGS[seating].time}. We will call within the hour to confirm. Please let us know about allergies then.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 text-sm text-[var(--h-ink)] underline decoration-[var(--h-line)] underline-offset-8 hover:decoration-[var(--h-ink)]">
                    Change the booking
                </button>
            </motion.div>
        );
    }

    return (
        <form ref={box} onSubmit={submit} className="grid gap-10">
            <fieldset className="min-w-0">
                <legend className="text-[11px] uppercase tracking-[0.2em] text-[var(--h-muted)]">1. Day</legend>
                <div className="-mx-5 mt-4 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0 sm:pb-0">
                    {days.map((d, i) => (
                        <button
                            key={d.toISOString()}
                            type="button"
                            onClick={() => setDay(i)}
                            aria-pressed={day === i}
                            className={`flex min-w-[4.5rem] snap-start flex-col items-center border py-3 transition-colors duration-500 ${day === i ? 'border-[var(--h-ink)] bg-[var(--h-ink)] text-[var(--h-bg)]' : 'border-[var(--h-line)] text-[var(--h-ink)] hover:border-[var(--h-muted)]'}`}
                        >
                            <span className="text-[11px] uppercase tracking-[0.16em] opacity-70">{fmtDay(d)}</span>
                            <span className="mt-1 text-xl" style={serif}>
                                {d.getDate()}
                            </span>
                        </button>
                    ))}
                </div>
            </fieldset>

            <fieldset aria-busy={loading} className="min-w-0">
                <legend className="text-[11px] uppercase tracking-[0.2em] text-[var(--h-muted)]">2. Seating</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <AnimatePresence mode="wait" initial={false}>
                        {loading
                            ? SEATINGS.map((s) => (
                                  <motion.div key={`sk-${s.time}`} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="hk-bone flex h-[5.5rem] flex-col justify-center gap-3 border border-[var(--h-line)] px-5">
                                      <span className="hk-bar block h-5 w-24" />
                                      <span className="hk-bar block h-2.5 w-36" />
                                  </motion.div>
                              ))
                            : SEATINGS.map((s, i) => {
                                  const n = s.left[day];
                                  const full = n === 0;
                                  return (
                                      <motion.button
                                          key={`${s.time}-${day}`}
                                          type="button"
                                          disabled={full}
                                          onClick={() => setSeating(i)}
                                          aria-pressed={seating === i}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                                          className={`flex h-[5.5rem] items-center justify-between border px-5 text-left transition-colors duration-500 ${seating === i ? 'border-[var(--h-accent)]' : 'border-[var(--h-line)] hover:border-[var(--h-muted)]'} disabled:cursor-not-allowed disabled:opacity-40`}
                                      >
                                          <span>
                                              <span className="block text-2xl" style={serif}>
                                                  {s.time}
                                              </span>
                                              <span className="mt-1 block text-sm text-[var(--h-muted)]">{full ? 'Full, ask about the waitlist' : `${n} of 12 seats left`}</span>
                                          </span>
                                          <span className={`grid h-6 w-6 place-items-center rounded-full border transition-colors ${seating === i ? 'border-[var(--h-accent)] bg-[var(--h-accent)]' : 'border-[var(--h-line)]'}`}>
                                              {seating === i && <Check className="h-3.5 w-3.5 text-[var(--h-bg)]" />}
                                          </span>
                                      </motion.button>
                                  );
                              })}
                    </AnimatePresence>
                </div>
            </fieldset>

            <div className="grid gap-8 sm:grid-cols-2">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--h-muted)]">3. Guests</p>
                    <div className="mt-4 flex h-14 items-center justify-between border border-[var(--h-line)] px-2">
                        <button type="button" aria-label="One guest fewer" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)} className="grid h-10 w-10 place-items-center text-[var(--h-ink)] disabled:opacity-30">
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-xl tabular-nums" style={serif} aria-live="polite">
                            {guests} {guests === 1 ? 'guest' : 'guests'}
                        </span>
                        <button type="button" aria-label="One guest more" disabled={guests >= Math.min(4, seating === null ? 4 : left)} onClick={() => setGuests((g) => g + 1)} className="grid h-10 w-10 place-items-center text-[var(--h-ink)] disabled:opacity-30">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-[var(--h-muted)]">Up to four online. For more, call us.</p>
                </div>
                <div className="grid content-start gap-3">
                    <label className="grid gap-1.5">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--h-muted)]">Name</span>
                        <input required autoComplete="name" className="h-12 border-b border-[var(--h-line)] bg-transparent text-[var(--h-ink)] outline-none transition-colors focus:border-[var(--h-ink)]" />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--h-muted)]">Phone</span>
                        <input required type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9 +]{8,15}" className="h-12 border-b border-[var(--h-line)] bg-transparent text-[var(--h-ink)] outline-none transition-colors focus:border-[var(--h-ink)]" />
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-[var(--h-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[var(--h-muted)]">
                    <span className="text-2xl text-[var(--h-ink)]" style={serif}>
                        {inr(PRICE * guests)}
                    </span>{' '}
                    for {guests}, paid at the counter
                </p>
                <button type="submit" disabled={seating === null} className="h-14 bg-[var(--h-accent)] px-8 text-sm uppercase tracking-[0.18em] text-[var(--h-ink)] transition-opacity duration-500 hover:opacity-90 disabled:opacity-35">
                    Hold my seats
                </button>
            </div>
        </form>
    );
}
