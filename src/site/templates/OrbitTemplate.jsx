import WarpTunnel from '../../components/MainUI/ApexUI-Kit/WarpTunnel/WarpTunnel.jsx';
import FlipClock from '../../components/MainUI/ApexUI-Kit/FlipClock/FlipClock.jsx';
import BounceCards from '../../components/MainUI/ApexUI-Kit/BounceCards/BounceCards.jsx';
import Stepper from '../../components/MainUI/ApexUI-Kit/Stepper/Stepper.jsx';
import DotGlobe from '../../components/MainUI/ApexUI-Kit/DotGlobe/DotGlobe.jsx';
import StarBorder from '../../components/MainUI/ApexUI-Kit/StarBorder/StarBorder.jsx';
import GlitchText from '../../components/MainUI/ApexUI-Kit/GlitchText/GlitchText.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#a78bfa';

const SPEAKERS = [
    ['photo-1494790108377-be9c29b29330', 'Amara Okoye', 'Design lead, Linear'],
    ['photo-1507003211169-0a1dd7228f2d', 'Jonas Weber', 'Creator of Motionkit'],
    ['photo-1438761681033-6461ffad8d80', 'Priya Nair', 'Staff engineer, Vercel'],
    ['photo-1500648767791-00dcc994a43e', 'Leo Martins', 'WebGL artist'],
    ['photo-1534528741775-53994a69daeb', 'Hana Sato', 'Head of UX, Figma'],
];

const DAY = (talks) => (
    <ul className="space-y-3 text-sm">
        {talks.map(([time, title, who]) => (
            <li key={time} className="flex gap-4">
                <span className="w-14 shrink-0 font-mono text-white/45">{time}</span>
                <span>
                    <b className="font-semibold">{title}</b>
                    <span className="block text-white/55">{who}</span>
                </span>
            </li>
        ))}
    </ul>
);

const SCHEDULE = [
    { title: 'Day 1', content: DAY([['09:30', 'Opening keynote: the web, in motion', 'Amara Okoye'], ['11:00', 'Shaders for product people', 'Leo Martins'], ['14:00', 'Design systems that scale', 'Hana Sato']]) },
    { title: 'Day 2', content: DAY([['09:30', 'Fast by default', 'Priya Nair'], ['11:00', 'Springs, not timelines', 'Jonas Weber'], ['15:00', 'Live build: 0 to launch in 45 minutes', 'Panel']]) },
    { title: 'Workshops', content: DAY([['10:00', 'WebGL from zero', 'Leo Martins'], ['13:00', 'Motion for designers', 'Jonas Weber'], ['16:00', 'Accessible animation', 'Hana Sato']]) },
];

const CITIES = [
    { label: 'Lisbon', lat: 38.7, lon: -9.1 },
    { label: 'New York', lat: 40.7, lon: -74 },
    { label: 'Tokyo', lat: 35.7, lon: 139.7 },
    { label: 'Bengaluru', lat: 12.97, lon: 77.6 },
    { label: 'São Paulo', lat: -23.5, lon: -46.6 },
];

const TICKETS = [
    ['Student', 149, ['Both days', 'Talk recordings']],
    ['General', 449, ['Both days', 'Workshops', 'Party night'], true],
    ['VIP', 899, ['Everything in General', 'Speaker dinner', 'Front row seats']],
];

/* Orbit Conf: a two-day design and engineering conference. */
export default function OrbitTemplate() {
    return (
        <div className="bg-[#07060d] text-white">
            <div className="relative h-[min(100svh,52rem)] min-h-[38rem]">
                <TemplateHeader brand="Orbit Conf" links={['Speakers', 'Schedule', 'Tickets']} cta="Get tickets" accent={ACCENT} />
                <WarpTunnel colors={[ACCENT, '#22d3ee']} speed={0.7}>
                    <div className="flex h-full flex-col items-center justify-center px-5 pt-14 text-center">
                        <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/70">Lisbon · 14 to 15 May 2026</p>
                        <h1 className="mt-3 text-[clamp(3rem,12vw,9rem)] font-black leading-[0.9] tracking-tighter">
                            <GlitchText text="ORBIT/26" colors={['#22d3ee', ACCENT]} />
                        </h1>
                        <p className="mt-3 max-w-md text-white/75">Two days on design, motion and the future of the web. Hold anywhere to warp.</p>
                        <div className="mt-8 rounded-2xl bg-black/40 p-3 backdrop-blur">
                            <FlipClock seconds={41 * 86400 + 7 * 3600 + 32 * 60} accentColor={ACCENT} size={2} />
                        </div>
                    </div>
                </WarpTunnel>
            </div>

            <Section eyebrow="Speakers" title="Forty voices, one stage" text="Hover the cards.">
                <div id="speakers" className="flex justify-center">
                    <BounceCards images={SPEAKERS.map(([id]) => photo(id, 500))} cardSize={10} />
                </div>
                <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-5">
                    {SPEAKERS.map(([, name, role]) => (
                        <div key={name} className="text-center">
                            <p className="font-semibold">{name}</p>
                            <p className="text-xs text-white/50">{role}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section eyebrow="Schedule" title="Plan your two days" className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-2xl">
                    <Stepper steps={SCHEDULE} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <Section>
                <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Watch parties</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Live in five cities</h2>
                        <p className="mt-4 text-white/65">Can&apos;t make it to Lisbon? Join a local watch party with talks streamed live and meetups after.</p>
                    </div>
                    <div className="flex justify-center">
                        <DotGlobe markers={CITIES} arcs={[]} markerColor={ACCENT} arcColor={ACCENT} glowColor={ACCENT} maxSize={26} />
                    </div>
                </div>
            </Section>

            <Section eyebrow="Tickets" title="Early bird pricing ends soon">
                <div id="tickets" className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
                    {TICKETS.map(([name, price, perks, hot]) => (
                        <div key={name} className={`flex flex-col rounded-3xl border p-6 ${hot ? 'border-[#a78bfa] bg-[#a78bfa]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                            <p className="font-semibold">{name}</p>
                            <p className="mt-2 text-4xl font-black">€{price}</p>
                            <ul className="mt-4 flex-1 space-y-2 text-sm text-white/70">
                                {perks.map((x) => (
                                    <li key={x}>· {x}</li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <StarBorder color={ACCENT} theme="dark" className="w-full">
                                    Buy {name}
                                </StarBorder>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Footer brand="Orbit Conf" note="LX Factory, Lisbon · hello@orbitconf.dev" />
        </div>
    );
}
