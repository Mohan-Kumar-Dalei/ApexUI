import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Minus, Plus } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade.jsx';
import { Marquee } from '../components/ui/marquee.jsx';
import { NumberTicker } from '../components/ui/number-ticker.jsx';
import { Moods, PickASilk } from '../sections/Looks.jsx';
import TryTheLook from '../sections/TryTheLook.jsx';
import Rail from '../sections/Rail.jsx';
import { Bridal, FeelTheDrape } from '../sections/Stories.jsx';
import { Curtain, EASE, Lines, api, getLenis, img, reduced, useApi } from '../lib.jsx';
import { u } from '../base.js';

/*
 * Round 1 gave the structure. Round 2 adds the motion: the camera travels through the
 * loom room as you scroll (GSAP ScrollTrigger scrubbing the 3D progress, Lenis smoothing
 * the scroll), chapters rise in, and every section enters with a quiet reveal.
 */

const LoomScene = lazy(() => import('../LoomScene.jsx'));

const CHAPTERS = [
    { k: 'Inside the loom room', title: 'Woven by hand, worn for a lifetime.', text: 'Scroll through the room where a Banarasi is made. Sarees from 212 looms in nine weaving towns, bought straight from the weavers.' },
    { k: '01 The weave', title: 'Thirty four days for one saree.', text: 'A Banarasi kadhwa is woven one butti at a time. The weaver passes the shuttle, the helper lifts the cards, and nothing on it is printed.' },
    { k: '02 The thread', title: 'Silk from Bengaluru, zari from Surat.', text: 'Every spool is dyed in the cluster. Real silver zari is dipped in gold, and we say on each page which kind yours has.' },
    { k: '03 The drape', title: 'Six yards that fall like water.', text: 'Off the loom, finished by hand, folded in muslin and sent to you within 48 hours.' },
];

const WEAVES = [
    ['Banarasi', 'Varanasi', 'photo-1727430228383-aa1fb59db8bf'],
    ['Kanjivaram', 'Kanchipuram', 'photo-1679006831648-7c9ea12e5807'],
    ['Paithani', 'Yeola', 'photo-1617627143750-d86bc21e42bb'],
    ['Patola', 'Patan', 'photo-1616986491129-3e37cb654c82'],
    ['Kasavu', 'Balaramapuram', 'photo-1787295779612-b3182bea0a81'],
    ['Chanderi', 'Chanderi', 'photo-1610030469668-8e9f641aaf27'],
    ['Bandhani', 'Bhuj', 'photo-1769275061202-cf3ef67d7279'],
    ['Jamdani', 'Phulia', 'photo-1610189026205-27510cfc52f8'],
];

const TICKER = [
    ['Try the look', 'Eight sarees, styled head to toe'],
    ['Pure zari', 'Real silver dipped in gold, tagged on every silk'],
    ['On the rail', 'Every saree we have, in one row'],
    ['Bridal', 'For the muhurtham, with the blouse stitched'],
    ['Video call', 'See it in daylight before you buy'],
];

const FAQ = [
    ['How do I know the zari is real?', 'Every silk saree ships with a Silk Mark tag and a note from the cluster saying what the zari is: real silver dipped in gold, or tested metallic thread. We say which on each page.'],
    ['Can I see a saree before I pay?', 'Yes. Book a free video call and we will hold it up to daylight, drape it and show you the border and pallu up close.'],
    ['How should I store silk?', 'Fold it in muslin, not plastic, and refold along different lines every three months so the zari does not crack.'],
    ['What if it is not right?', 'Return it unworn within 7 days with the tags on and we refund in full. Stitched blouses can be exchanged, not returned.'],
];

/* ---------- the hero: a full-bleed photograph, the glass nav floats on top ---------- */
function Hero({ ready }) {
    const root = useRef(null);
    useLayoutEffect(() => {
        if (reduced()) return undefined;
        const ctx = gsap.context(() => {
            gsap.fromTo('[data-hero-img]', { scale: 1.12 }, { scale: 1, duration: 2.6, ease: 'expo.out' });
            gsap.to('[data-hero-img]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
        }, root);
        return () => ctx.revert();
    }, []);
    useLayoutEffect(() => {
        if (!ready || reduced()) return undefined;
        const ctx = gsap.context(() => gsap.from('[data-hero-in]', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1, delay: 0.55, ease: EASE }), root);
        return () => ctx.revert();
    }, [ready]);
    return (
        <section ref={root} className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden bg-tn-ink text-white">
            <img data-hero-img src={img('photo-1618901185975-d59f7091bcfe', 2400)} alt="A woman in a red Kanjivaram silk saree seated on the steps of a carved temple" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
            <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
            <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-black/20 lg:w-[55%]" />
            <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14">
                <p data-hero-in className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E2C47E]" /> <span className="hidden sm:inline">Varanasi · </span>Pure zari · Handwoven silk
                </p>
                {ready ? <Lines as="h1" onLoad delay={0.25} text="Woven for the wedding, and every day after." className="mt-6 max-w-[15ch] text-[clamp(3rem,8vw,7.2rem)] leading-[0.95] text-white" /> : <h1 className="mt-6 max-w-[15ch] text-[clamp(3rem,8vw,7.2rem)] leading-[0.95] opacity-0">Woven for the wedding, and every day after.</h1>}
                <p data-hero-in className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-white/85">Taana brings the looms of nine weaving towns home: Banarasi, Kanjivaram and Paithani silks bought straight from the weavers, bordered in real zari and finished by hand.</p>
                <div data-hero-in className="mt-8 flex flex-wrap gap-3">
                    <a href="#look" onClick={(e) => (e.preventDefault(), jump('look'))} className="group inline-flex h-14 items-center gap-4 rounded-full bg-tn-accent pl-7 pr-2 text-[16px] font-medium text-tn-on-accent">
                        Try the look
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-tn-accent transition-transform duration-500 group-hover:rotate-45">
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </a>
                    <a href="#rail" onClick={(e) => (e.preventDefault(), jump('rail'))} className="group inline-flex h-14 items-center gap-4 rounded-full bg-white pl-7 pr-2 text-[16px] font-medium text-tn-ink">
                        Browse the rail
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-tn-surface text-tn-accent transition-transform duration-500 group-hover:rotate-45">
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </a>
                </div>
            </div>
            {/* the ticker: what is on this page, in one running line */}
            <div className="relative border-t border-white/10 bg-tn-band py-4 text-tn-on-band">
                <Marquee className="p-0 [--duration:46s] [--gap:2rem]" aria-label="On this page">
                    {TICKER.map(([k, v]) => (
                        <span key={k} className="flex items-center gap-8 whitespace-nowrap text-[15px]">
                            <span className="font-semibold uppercase tracking-[0.16em] text-[#E2C47E]">{k}</span>
                            <span className="text-tn-band-muted">{v}</span>
                            <span className="text-[#E2C47E]" aria-hidden="true">
                                ✦
                            </span>
                        </span>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}

// smooth scroll to a section on this page
const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const l = getLenis();
    if (l) l.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: 'smooth' });
};

/* ---------- the 3D story: the room stays in place while the chapters scroll over it ---------- */
function LoomStory() {
    const progress = useRef(0);
    const root = useRef(null);
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // scroll position through the story drives the camera: 0 at the room, 3 at the drape
            gsap.to(progress, { current: CHAPTERS.length - 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
            if (reduced()) return;
            root.current.querySelectorAll('[data-chapter]').forEach((card, i) => {
                if (i === 0) return;
                gsap.from(card, { y: 60, autoAlpha: 0, duration: 1.1, ease: EASE, scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' } });
            });
        }, root);
        return () => ctx.revert();
    }, []);
    return (
        <section ref={root} aria-label="Inside the loom room" className="relative" style={{ height: `${CHAPTERS.length * 100}svh` }}>
            <div className="sticky top-0 h-svh overflow-hidden bg-tn-surface">
                <Suspense fallback={null}>
                    <LoomScene progress={progress} className="absolute inset-0" />
                </Suspense>
            </div>
            <div className="absolute inset-0">
                {CHAPTERS.map((c, i) => (
                    <div key={c.k} className="flex h-svh items-end px-5 pb-14 sm:px-8 lg:items-center lg:pb-0">
                        <div className={`mx-auto w-full max-w-[1400px] ${i % 2 ? 'lg:flex lg:justify-end' : ''}`}>
                            <div data-chapter className="max-w-xl rounded-2xl bg-tn-bg/90 p-6 shadow-[0_30px_80px_-40px_rgba(28,23,20,0.5)] backdrop-blur-sm sm:p-8">
                                <p className="label">{c.k}</p>
                                {i === 0 ? <Lines text={c.title} className="mt-3 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" /> : <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1]">{c.title}</h2>}
                                <p className="mt-4 text-[1.05rem] leading-relaxed text-tn-muted">{c.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}



function Numbers() {
    return (
        <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
            <dl className="grid grid-cols-2 gap-y-10 border-y border-tn-line py-12 lg:grid-cols-4">
                {[
                    [212, '', 'looms we buy from'],
                    [9, '', 'weaving towns'],
                    [34, ' days', 'for an average silk saree'],
                    [48, ' h', 'from our room to the courier'],
                ].map(([n, unit, label]) => (
                    <div key={label} className="px-2">
                        <dt className="text-[clamp(2.6rem,5vw,4rem)] leading-none">
                            <NumberTicker value={n} />
                            <span className="font-tn-display">{unit}</span>
                        </dt>
                        <dd className="mt-2 text-[15px] text-tn-muted">{label}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function CallBand() {
    return (
        <section className="bg-tn-band text-tn-on-band">
            <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2">
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tn-band-muted">Before you buy</p>
                    <Lines text="See it move in daylight, on a video call." className="mt-3 text-[clamp(2.4rem,5vw,4.4rem)]" />
                    <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-tn-band-muted">Twenty minutes with someone from our Varanasi room. We drape it, hold the pallu to the window and show you the back of the border.</p>
                    <Link to={u('/video-call')} className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-tn-on-band px-7 font-medium text-tn-band">
                        Pick a time <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <Curtain src={img('photo-1641699862936-be9f49b1c38d', 1100, 825)} alt="A purple and gold silk saree held up on camera" ratio="aspect-[4/3]" imgClass="object-top" />
            </div>
        </section>
    );
}

function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <section id="care" className="mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <p className="label">Care and questions</p>
                <Lines text="Silk lasts longer than people." className="mt-3 text-[clamp(2.2rem,4vw,3.4rem)]" />
            </div>
            <div className="border-t border-tn-line lg:col-span-8">
                {FAQ.map(([q, a], i) => (
                    <div key={q} className="border-b border-tn-line">
                        <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                            <span className="font-tn-display text-[1.35rem] sm:text-2xl">{q}</span>
                            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open === i ? 'border-tn-accent bg-tn-accent text-tn-on-accent' : 'border-tn-line'}`}>{open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <p className="overflow-hidden text-[1.02rem] leading-relaxed text-tn-muted">
                                <span className="block max-w-2xl pb-7">{a}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Letter() {
    const [email, setEmail] = useState('');
    const [state, setState] = useState({ status: 'idle', msg: '' });
    const submit = async (e) => {
        e.preventDefault();
        setState({ status: 'busy', msg: '' });
        try {
            await api('/newsletter', { method: 'POST', body: { email } });
            setState({ status: 'done', msg: 'Thank you. The next letter goes out on the first of the month.' });
            setEmail('');
        } catch (err) {
            setState({ status: 'error', msg: err.message });
        }
    };
    return (
        <section className="mx-auto max-w-[1400px] px-5 pb-28 sm:px-8">
            <div className="grid gap-10 border-t border-tn-line pt-14 lg:grid-cols-2">
                <div>
                    <p className="label">Once a month</p>
                    <Lines text="A letter from the looms." className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)]" />
                </div>
                <form onSubmit={submit} className="self-end" noValidate>
                    <label htmlFor="letter-email" className="block text-[14px] font-medium">
                        Email
                    </label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                        <input id="letter-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-14 w-full rounded-full border border-tn-line bg-tn-card px-5 text-[16px] outline-none placeholder:text-tn-muted focus:border-tn-ink sm:flex-1" />
                        <button disabled={state.status === 'busy'} className="h-14 rounded-full bg-tn-ink px-8 font-medium text-tn-bg disabled:opacity-60">
                            {state.status === 'busy' ? 'Adding you' : 'Send me the letter'}
                        </button>
                    </div>
                    <p role="status" className={`mt-3 min-h-6 text-[14px] ${state.status === 'error' ? 'text-tn-accent' : 'text-tn-veg'}`}>
                        {state.msg}
                    </p>
                </form>
            </div>
        </section>
    );
}

export default function Home({ ready }) {
    useEffect(() => {
        document.title = 'Taana | Handwoven sarees from the loom';
    }, []);
    const { data } = useApi('/products');
    const products = data?.products;
    const bySlug = useMemo(() => Object.fromEntries((products ?? []).map((p) => [p.slug, p])), [products]);
    return (
        <>
            <Hero ready={ready} />
            <Moods />
            <TryTheLook />
            {products ? (
                <>
                    <PickASilk products={products.filter((p) => !p.featured || p.price < 40000)} />
                    <LoomStory />
                    <Numbers />
                    <Rail products={products} />
                    <FeelTheDrape />
                    <Bridal bySlug={bySlug} />
                </>
            ) : (
                <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-5 py-24 sm:px-8 lg:grid-cols-4" aria-label="Loading the collection">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="bone aspect-[3/4]" />
                    ))}
                </div>
            )}
            <CallBand />
            <Faq />
            <Letter />
        </>
    );
}
