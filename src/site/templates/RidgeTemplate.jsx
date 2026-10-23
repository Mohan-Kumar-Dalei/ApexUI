import { Mountain, Tent, Users } from 'lucide-react';
import SunriseBackground from '../../components/MainUI/ApexUI-Kit/SunriseBackground/SunriseBackground.jsx';
import ImageAccordion from '../../components/MainUI/ApexUI-Kit/ImageAccordion/ImageAccordion.jsx';
import RollingCounter from '../../components/MainUI/ApexUI-Kit/RollingCounter/RollingCounter.jsx';
import Stepper from '../../components/MainUI/ApexUI-Kit/Stepper/Stepper.jsx';
import Testimonials from '../../components/MainUI/ApexUI-Kit/Testimonials/Testimonials.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import BlurRevealText from '../../components/MainUI/ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#ffb15c';

const TRIPS = [
    { image: photo('photo-1464822759023-fed622ff2c3b', 1300), title: 'Alpine Traverse', description: '7 days · hut to hut across the high passes.' },
    { image: photo('photo-1470770841072-f978cf4d019e', 1300), title: 'Dolomites Lakes', description: '5 days · gentle trails and mirror lakes.' },
    { image: photo('photo-1493246507139-91e8fad9978e', 1300), title: 'Sunrise Summits', description: '3 days · first light from three peaks.' },
    { image: photo('photo-1441974231531-c6227db76b6e', 1300), title: 'Forest Retreat', description: '4 days · slow walks, sauna, no signal.' },
];

const PILLARS = [
    [Mountain, 'Small groups', 'Never more than 10 people and two certified guides.'],
    [Tent, 'Cozy huts', 'Warm beds, hot showers and dinners cooked on site.'],
    [Users, 'Every level', 'Trips graded from easy rambles to big days.'],
];

const STEPS = [
    { title: 'Pick a trip', content: <p>Choose a route and a date. Every trip lists distance, climb and difficulty.</p> },
    { title: 'Meet the group', content: <p>We send a short call invite a week before so you know who you are walking with.</p> },
    { title: 'Pack light', content: <p>We carry the heavy stuff between huts, you bring a day pack and good boots.</p> },
];

const QUOTES = [
    { author: 'Lena Fischer', title: 'Alpine Traverse, 2025', text: 'Watching the sun come up over the ridge on day four is something I will never forget.' },
    { author: 'Marco Bianchi', title: 'Dolomites Lakes, 2025', text: 'Perfectly paced, the guides knew every flower and every story. Already booked again.' },
];

const FAQ = [
    { q: 'How fit do I need to be?', a: 'Each trip has a grade. If you can walk 5 to 6 hours with breaks, most of our trips are for you.' },
    { q: 'What is included?', a: 'Guides, huts, all meals on the trail, luggage transfers and a transfer from the nearest station.' },
    { q: 'Can I cancel?', a: 'Free cancellation up to 30 days before you start, and a voucher after that.' },
];

/* Ridge: a mountain retreat and guided hiking company, with a sunrise hero. */
export default function RidgeTemplate() {
    return (
        <div className="bg-[#0e0a10] text-white">
            <div className="relative h-[min(100svh,52rem)] min-h-[38rem]">
                <TemplateHeader brand="Ridge" links={['Trips', 'Huts', 'Stories']} cta="Book a trip" accent={ACCENT} />
                <SunriseBackground preset="dawn" duration={5}>
                    <div className="flex h-full flex-col items-center px-6 pt-[clamp(6rem,16vh,9rem)] text-center">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/70">Guided hikes · Alps & Dolomites</p>
                        <BlurRevealText as="h1" text="Walk into the sunrise" highlight={['sunrise']} accentColor={ACCENT} className="mt-4 max-w-3xl text-[clamp(2.6rem,7.5vw,6rem)] font-black leading-[0.92] tracking-tight" />
                        <p className="mt-4 max-w-md text-white/80">Small group trips through the mountains, hut to hut, with everything carried and cooked for you.</p>
                        <div className="mt-8">
                            <MagneticButton accentColor={ACCENT}>Find your trip</MagneticButton>
                        </div>
                    </div>
                </SunriseBackground>
            </div>

            <section className="grid border-b border-white/10 sm:grid-cols-3">
                {[
                    [12000, '+', 'hikers since 2014'],
                    [48, '', 'routes across 4 countries'],
                    [4.9, '/5', 'average trip rating'],
                ].map(([v, s, l]) => (
                    <div key={l} className="border-white/10 px-[clamp(1rem,4vw,3rem)] py-8 text-center sm:[&:not(:last-child)]:border-r">
                        <RollingCounter value={v} decimals={v % 1 ? 1 : 0} suffix={s} fontSize={2.2} fontWeight={900} />
                        <p className="mt-1 text-xs text-white/55">{l}</p>
                    </div>
                ))}
            </section>

            <Section eyebrow="Trips" title="Where we walk this season" text="Hover a trip to open it.">
                <div className="mx-auto max-w-6xl">
                    <ImageAccordion items={TRIPS} height="28rem" />
                </div>
            </Section>

            <Section className="!pt-0">
                <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
                    {PILLARS.map(([Icon, title, text]) => (
                        <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${ACCENT}22`, color: ACCENT }}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-5 text-xl font-bold">{title}</h3>
                            <p className="mt-2 text-sm text-white/60">{text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <img src={photo('photo-1500530855697-b586d89ba3ee', 1100)} alt="A trail at sunrise" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover" />
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">How it works</p>
                        <h2 className="mb-6 mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Three steps to the trailhead</h2>
                        <Stepper steps={STEPS} accentColor={ACCENT} theme="dark" />
                    </div>
                </div>
            </Section>

            <Testimonials testimonials={QUOTES} />

            <Section eyebrow="FAQ" title="Before you lace up">
                <div className="mx-auto max-w-3xl">
                    <FaqAccordion items={FAQ} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <Footer brand="Ridge" note="Guided hiking since 2014 · Innsbruck" />
        </div>
    );
}
