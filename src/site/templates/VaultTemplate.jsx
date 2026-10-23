import { BadgePercent, Globe2, LineChart, Lock, Smartphone, Zap } from 'lucide-react';
import DotGlobe from '../../components/MainUI/ApexUI-Kit/DotGlobe/DotGlobe.jsx';
import RollingCounter from '../../components/MainUI/ApexUI-Kit/RollingCounter/RollingCounter.jsx';
import GlareCard from '../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';
import SpotlightGrid from '../../components/MainUI/ApexUI-Kit/SpotlightGrid/SpotlightGrid.jsx';
import AuroraBackground from '../../components/MainUI/ApexUI-Kit/AuroraBackground/AuroraBackground.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import ShinyText from '../../components/MainUI/ApexUI-Kit/ShinyText/ShinyText.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';

const ACCENT = '#34d399';

const MARKERS = [
    { label: 'London', lat: 51.5, lon: -0.1 },
    { label: 'New York', lat: 40.7, lon: -74 },
    { label: 'Singapore', lat: 1.35, lon: 103.8 },
    { label: 'Mumbai', lat: 19.07, lon: 72.87 },
    { label: 'Lagos', lat: 6.5, lon: 3.4 },
    { label: 'São Paulo', lat: -23.5, lon: -46.6 },
];
// Index pairs into MARKERS.
const ARCS = [
    [0, 1],
    [0, 3],
    [2, 3],
    [1, 5],
    [0, 4],
];

const FEATURES = [
    { title: 'Send in seconds', description: 'Money arrives in 160 countries, most of it instantly.', icon: Zap, span: 2 },
    { title: 'Real exchange rate', description: 'No markup hidden in the rate, ever.', icon: BadgePercent },
    { title: '40 currencies', description: 'Hold, convert and spend like a local.', icon: Globe2 },
    { title: 'Smart insights', description: 'See where your money goes, by category.', icon: LineChart },
    { title: 'Bank-grade security', description: 'Licensed, audited and insured up to $250k.', icon: Lock },
    { title: 'All in one app', description: 'Cards, savings and transfers in your pocket.', icon: Smartphone, span: 2 },
];

const FAQ = [
    { q: 'Is my money safe with Vault?', a: 'Yes. Customer funds are held at tier 1 banks and protected up to $250,000.' },
    { q: 'How much does a transfer cost?', a: 'A small flat fee shown upfront, plus the real mid-market rate. No surprises.' },
    { q: 'Can I use Vault for my business?', a: 'Yes, Vault Business adds invoicing, team cards and accounting sync.' },
];

/* Vault: a global money app. */
export default function VaultTemplate() {
    return (
        <div className="bg-[#050807] text-white">
            <div className="relative overflow-hidden">
                <TemplateHeader brand="Vault" links={['Personal', 'Business', 'Pricing']} cta="Open account" accent={ACCENT} />
                <div className="mx-auto grid max-w-7xl items-center gap-8 px-[clamp(1rem,4vw,3rem)] pb-16 pt-28 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs">
                            <ShinyText text="Now in 160 countries" color="#6ee7b7" shineColor="#ffffff" />
                        </span>
                        <h1 className="mt-6 text-[clamp(2.6rem,6.5vw,5.4rem)] font-black leading-[0.95] tracking-tight">Money without borders</h1>
                        <p className="mt-5 max-w-md text-white/65">Send, spend and save in 40 currencies at the real exchange rate. One account for the whole world.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <MagneticButton accentColor={ACCENT}>Open free account</MagneticButton>
                            <span className="inline-flex h-12 items-center self-center rounded-full border border-white/15 px-6 text-sm font-semibold">See rates</span>
                        </div>
                        <div className="mt-10 flex gap-8">
                            <div>
                                <RollingCounter value={4.2} decimals={1} prefix="$" suffix="B" fontSize={1.8} fontWeight={800} />
                                <p className="text-xs text-white/50">moved every month</p>
                            </div>
                            <div>
                                <RollingCounter value={9} suffix="M" fontSize={1.8} fontWeight={800} />
                                <p className="text-xs text-white/50">customers</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <DotGlobe markers={MARKERS} arcs={ARCS} markerColor={ACCENT} arcColor={ACCENT} glowColor={ACCENT} maxSize={30} />
                    </div>
                </div>
            </div>

            <Section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div className="flex justify-center">
                        <GlareCard backgroundImage="">
                            <div className="flex h-full flex-col justify-between bg-gradient-to-br from-[#0f2a22] via-[#07120e] to-black p-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black tracking-tight">Vault</span>
                                    <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[0.65rem]">METAL</span>
                                </div>
                                <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
                                <div>
                                    <p className="font-mono text-lg tracking-[0.2em]">•••• 4821</p>
                                    <p className="mt-1 text-xs text-white/60">ALEX MORGAN</p>
                                </div>
                            </div>
                        </GlareCard>
                    </div>
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Vault Metal</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">A card that feels like it</h2>
                        <p className="mt-4 text-white/65">18 g of brushed steel, 2% back on travel, airport lounges and no foreign fees. Tilt it, it catches the light.</p>
                    </div>
                </div>
            </Section>

            <Section eyebrow="Why Vault" title="Built for a borderless life">
                <div className="mx-auto max-w-6xl">
                    <SpotlightGrid items={FEATURES} color={ACCENT} theme="dark" />
                </div>
            </Section>

            <Section eyebrow="FAQ" title="Questions people ask">
                <div className="mx-auto max-w-3xl">
                    <FaqAccordion items={FAQ} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <div className="relative overflow-hidden">
                <AuroraBackground colors={[ACCENT, '#22d3ee', '#a78bfa', '#34d399']} theme="dark" containerClassName="!h-auto">
                    <div className="flex flex-col items-center px-6 py-[clamp(4rem,10vw,7rem)] text-center">
                        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tight">Open an account in minutes</h2>
                        <p className="mt-3 text-white/70">No paperwork, no branch, no minimum balance.</p>
                        <div className="mt-8">
                            <MagneticButton accentColor={ACCENT}>Get Vault</MagneticButton>
                        </div>
                    </div>
                </AuroraBackground>
            </div>

            <Footer brand="Vault" note="Vault Ltd is authorised as an e-money institution." />
        </div>
    );
}
