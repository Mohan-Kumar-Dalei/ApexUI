import { Brain, FileCode2, Workflow } from 'lucide-react';
import DitherWaves from '../../components/MainUI/ApexUI-Kit/DitherWaves/DitherWaves.jsx';
import AiPromptBox from '../../components/MainUI/ApexUI-Kit/AiPromptBox/AiPromptBox.jsx';
import AiVoiceOrb from '../../components/MainUI/ApexUI-Kit/AiVoiceOrb/AiVoiceOrb.jsx';
import Marquee3D from '../../components/MainUI/ApexUI-Kit/Marquee3D/Marquee3D.jsx';
import CommandPalette from '../../components/MainUI/ApexUI-Kit/CommandPalette/CommandPalette.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import ScrambleText from '../../components/MainUI/ApexUI-Kit/ScrambleText/ScrambleText.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const INK = '#c8f560';

const STEPS = [
    { icon: Brain, title: 'Understands your work', text: 'Connect your docs, tickets and code. Pulse reads them so you never paste context again.' },
    { icon: Workflow, title: 'Plans before it acts', text: 'Every task becomes a short plan you can edit before anything runs.' },
    { icon: FileCode2, title: 'Ships real output', text: 'Pull requests, briefs, spreadsheets and decks, ready for review.' },
];

const SHOWCASE = [
    'photo-1498050108023-c5249f4df085',
    'photo-1517694712202-14dd9538aa97',
    'photo-1555066931-4365d14bab8c',
    'photo-1531297484001-80022131f5a1',
    'photo-1519389950473-47ba0277781c',
    'photo-1504384308090-c894fdcc538d',
    'photo-1551288049-bebda4e38f71',
    'photo-1618005182384-a83a8bd57fbe',
    'photo-1522071820081-009f0129c71c',
    'photo-1526170375885-4d8ecf77b99f',
    'photo-1523275335684-37898b6baf30',
    'photo-1505740420928-5e560c06d30e',
].map((id) => photo(id, 700));

const FAQ = [
    { q: 'Which models does Pulse use?', a: 'Pulse picks the best model for each step and lets you pin one per workspace if you prefer.' },
    { q: 'Is my data used for training?', a: 'Never. Your files stay in your workspace and are deleted when you remove them.' },
    { q: 'Can Pulse run on our own cloud?', a: 'Yes, the Enterprise plan runs fully inside your AWS, GCP or Azure account.' },
    { q: 'How does pricing work?', a: 'A flat price per seat with generous limits. No per token surprises at the end of the month.' },
];

/* Pulse: an AI assistant startup. */
export default function PulseTemplate() {
    return (
        <div className="bg-[#0b0d0a] text-white">
            <div className="relative h-[min(100svh,50rem)] min-h-[38rem]">
                <TemplateHeader brand="Pulse" links={['Product', 'Agents', 'Pricing']} cta="Try Pulse" accent={INK} />
                <DitherWaves ink={INK} paper="#0b0d0a" pixelSize={3} contrast={1.05} scale={2}>
                    <div className="flex h-full flex-col items-center justify-center px-5 pt-16 text-center">
                        <h1 className="rounded-xl bg-[#0b0d0a] px-4 py-2 font-mono text-[clamp(2rem,6vw,4.6rem)] font-black leading-none tracking-tight" style={{ color: INK }}>
                            <ScrambleText text="Think out loud." />
                        </h1>
                        <p className="mt-4 max-w-md rounded-lg bg-[#0b0d0a]/90 px-3 py-1.5 text-sm text-white/75">An assistant that plans, writes and ships with your team.</p>
                        <div className="mt-8 w-full max-w-xl rounded-[1.75rem] bg-[#0b0d0a]/90 p-2 text-left">
                            <AiPromptBox colors={[INK, '#22d3ee', '#a78bfa', '#f472b6']} models={['Pulse 3', 'Pulse 3 Fast', 'Pulse Vision']} placeholder="Ask Pulse to plan your launch…" />
                        </div>
                    </div>
                </DitherWaves>
            </div>

            <Section eyebrow="How it works" title="From a sentence to shipped work">
                <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <div className="flex items-center justify-between">
                                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#c8f560]/10" style={{ color: INK }}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="font-mono text-xs text-white/35">0{i + 1}</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold">{title}</h3>
                            <p className="mt-2 text-sm text-white/60">{text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div className="flex justify-center">
                        <AiVoiceOrb colors={[INK, '#22d3ee', '#a78bfa', '#f472b6']} size={13} />
                    </div>
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Voice mode</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Talk, don&apos;t type</h2>
                        <p className="mt-4 text-white/65">Tap the orb and think out loud. Pulse listens, asks one good question and turns it into a plan.</p>
                    </div>
                </div>
            </Section>

            <Section eyebrow="Made with Pulse" title="What teams ship every day" className="!pb-0">
                <div className="mx-auto h-[30rem] max-w-7xl overflow-hidden rounded-3xl border border-white/10">
                    <Marquee3D images={SHOWCASE} />
                </div>
            </Section>

            <Section eyebrow="Shortcuts" title="Everything is a keystroke away" text="Press Ctrl / ⌘ + K anywhere on this page, or click below.">
                <div className="relative mx-auto flex h-[24rem] max-w-2xl justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] px-4 pt-10">
                    <CommandPalette contained accentColor={INK} triggerLabel="Search Pulse…" className="w-full max-w-xs" />
                </div>
            </Section>

            <Section eyebrow="FAQ" title="Good questions">
                <div className="mx-auto max-w-3xl">
                    <FaqAccordion items={FAQ} accentColor={INK} theme="dark" />
                </div>
            </Section>

            <Footer brand="Pulse AI" note="© Pulse Labs, San Francisco" />
        </div>
    );
}
