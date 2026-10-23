import { BarChart3, Bell, CalendarCheck, Lock, MessagesSquare, Zap } from 'lucide-react';
import HorizonGlow from '../../components/MainUI/ApexUI-Kit/HorizonGlow/HorizonGlow.jsx';
import SpotlightGrid from '../../components/MainUI/ApexUI-Kit/SpotlightGrid/SpotlightGrid.jsx';
import OrbitIcons from '../../components/MainUI/ApexUI-Kit/OrbitIcons/OrbitIcons.jsx';
import RollingCounter from '../../components/MainUI/ApexUI-Kit/RollingCounter/RollingCounter.jsx';
import Testimonials from '../../components/MainUI/ApexUI-Kit/Testimonials/Testimonials.jsx';
import PricingCards from '../../components/MainUI/ApexUI-Kit/PricingCards/PricingCards.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import BlurRevealText from '../../components/MainUI/ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';
import ShinyText from '../../components/MainUI/ApexUI-Kit/ShinyText/ShinyText.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#f0abfc';

const FEATURES = [
    { title: 'One calm inbox', description: 'Tasks, mentions and reviews land in one place, sorted by what needs you first.', icon: Bell, span: 2 },
    { title: 'Plans that adapt', description: 'Move a deadline and every dependent task shifts with it.', icon: CalendarCheck },
    { title: 'Threads, not noise', description: 'Discuss work right on the task, not in a separate chat.', icon: MessagesSquare },
    { title: 'Honest reports', description: 'See where time goes without timesheets.', icon: BarChart3 },
    { title: 'Instant everything', description: 'Every view opens in under 100 ms, even with 10k tasks.', icon: Zap },
    { title: 'Private by design', description: 'SSO, audit logs and data residency on every plan.', icon: Lock, span: 2 },
];

const QUOTES = [
    { author: 'Maya Chen', title: 'Head of Product, Fieldwork', text: 'We moved three tools into Nova in a week. Standups got shorter and nobody misses the old board.' },
    { author: 'Daniel Okafor', title: 'CTO, Brightline', text: 'The first planning tool our engineers open on their own. It is fast enough to stay out of the way.' },
    { author: 'Sofia Marquez', title: 'Studio lead, Northbound', text: 'Clients get a clean view of progress and we stopped writing weekly status emails.' },
];

const PLANS = [
    { name: 'Free', monthly: 0, yearly: 0, description: 'For small teams getting organised.', features: ['Up to 5 people', 'Unlimited tasks', 'Basic reports'], cta: 'Start free' },
    { name: 'Team', monthly: 12, yearly: 10, description: 'Per person, for growing teams.', features: ['Unlimited people', 'Timelines and goals', 'Guest access', 'Priority support'], cta: 'Start trial', featured: true },
    { name: 'Business', monthly: 24, yearly: 20, description: 'Per person, for larger companies.', features: ['Everything in Team', 'SSO and SCIM', 'Audit logs', 'Dedicated manager'], cta: 'Talk to sales' },
];

const FAQ = [
    { q: 'Can I import from my current tool?', a: 'Yes. Nova imports projects, tasks and comments from the most common planning tools in a couple of minutes.' },
    { q: 'Is there a free trial of Team?', a: 'Every new workspace gets 14 days of Team, no card needed. After that you can stay on Free.' },
    { q: 'Where is my data stored?', a: 'In the EU or the US, your choice, encrypted at rest and in transit.' },
    { q: 'Do you offer discounts for non-profits?', a: 'Yes, non-profits and schools get 50% off any paid plan.' },
];

/* Nova: a launch page for a calm team workspace. */
export default function NovaTemplate() {
    return (
        <div className="bg-[#0a0b14] text-white">
            <div className="relative h-[min(100svh,48rem)] min-h-[38rem]">
                <TemplateHeader brand="Nova" links={['Product', 'Customers', 'Pricing']} cta="Sign in" accent={ACCENT} />
                <HorizonGlow preset="lilac">
                    <div className="flex h-full flex-col items-center justify-center px-6 pb-[10%] pt-20 text-center">
                        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs backdrop-blur">
                            <ShinyText text="New · Timelines are here" color="#c4b5fd" shineColor="#ffffff" />
                        </span>
                        <BlurRevealText as="h1" text="The calm workspace for busy teams" highlight={['calm']} accentColor={ACCENT} className="mt-6 max-w-3xl text-[clamp(2.3rem,6.5vw,5.2rem)] font-black leading-[0.98] tracking-tight" />
                        <p className="mt-5 max-w-lg text-[clamp(0.95rem,1.6vw,1.1rem)] text-white/70">Plan, track and ship together without the noise. Nova keeps everyone on the same page, literally.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <MagneticButton accentColor={ACCENT}>Start free</MagneticButton>
                            <span className="inline-flex h-12 items-center self-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold backdrop-blur">Book a demo</span>
                        </div>
                    </div>
                </HorizonGlow>
            </div>

            <div className="px-[clamp(1rem,4vw,3rem)] pt-[clamp(3rem,6vw,5rem)]">
                <div className="mx-auto max-w-5xl rounded-[1.4rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-2 shadow-[0_40px_120px_-40px_rgba(240,171,252,0.45)]">
                    <img src={photo('photo-1551288049-bebda4e38f71', 1800)} alt="Nova dashboard" className="aspect-[16/9] w-full rounded-2xl object-cover" />
                </div>
                <p className="mt-14 text-center text-xs uppercase tracking-[0.25em] text-white/40">Trusted by 12,000 teams</p>
                <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-bold tracking-tight text-white/35">
                    {['Fieldwork', 'Brightline', 'Northbound', 'Kettle', 'Orbital', 'Paperplane'].map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>
            </div>

            <Section eyebrow="Features" title="Built for focus" text="Move the cursor over the grid.">
                <div className="mx-auto max-w-6xl">
                    <SpotlightGrid items={FEATURES} color={ACCENT} theme="dark" />
                </div>
            </Section>

            <Section className="!pt-0">
                <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
                    <img src={photo('photo-1522071820081-009f0129c71c', 1200)} alt="A team planning together" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover" />
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Why Nova</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Less status, more work</h2>
                        <p className="mt-4 text-white/65">Teams on Nova spend half as long in status meetings. Progress is visible to everyone, so the meeting becomes a quick check in.</p>
                        <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                            {[
                                [12000, '+', 'teams'],
                                [50, '%', 'fewer meetings'],
                                [99.99, '%', 'uptime'],
                            ].map(([v, s, l]) => (
                                <div key={l} className="min-w-0">
                                    <RollingCounter value={v} decimals={v % 1 ? 2 : 0} suffix={s} fontSize={1.4} fontWeight={800} />
                                    <p className="mt-1 text-xs text-white/50">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div className="order-2 flex justify-center md:order-1">
                        <OrbitIcons accentColor={ACCENT} size={24} center={<span className="text-lg font-black" style={{ color: ACCENT }}>Nova</span>} className="text-white" />
                    </div>
                    <div className="order-1 md:order-2">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Integrations</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Connects to the tools you already use</h2>
                        <p className="mt-4 text-white/65">GitHub, Figma, Slack, your calendar and 80 more. Updates flow both ways, so nothing gets copied by hand.</p>
                    </div>
                </div>
            </Section>

            <Testimonials testimonials={QUOTES} />

            <Section eyebrow="Pricing" title="Fair pricing that grows with you">
                <div className="mx-auto max-w-6xl">
                    <PricingCards plans={PLANS} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <Section eyebrow="FAQ" title="Questions, answered">
                <div className="mx-auto max-w-3xl">
                    <FaqAccordion items={FAQ} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <Footer brand="Nova" note="© Nova Labs. Made in Lisbon." />
        </div>
    );
}
