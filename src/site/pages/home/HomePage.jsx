import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Blocks, Copy, Check, Moon, MousePointer2, Sparkles, Terminal, Wand2 } from 'lucide-react';
import SiteHeader from '../../layout/SiteHeader.jsx';
import SiteFooter from '../../layout/SiteFooter.jsx';
import { ComponentCard } from '../ComponentsIndex.jsx';
import CodeBlock, { CommandLine } from '../../ui/CodeBlock.jsx';
import { CATEGORIES, componentPages } from '../../config/navigation.js';
import { FramerIcon, GsapIcon, ReactIcon, TailwindIcon } from './BrandIcons.jsx';
import GlareCard from '../../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';
import HyperCard from '../../../components/MainUI/ApexUI-Kit/HyperCard/HyperCard.jsx';
import ToolTip from '../../../components/MainUI/ApexUI-Kit/ToolTip/ToolTip.jsx';
import CardStack from '../../../components/MainUI/ApexUI-Kit/CardStack/CardStack.jsx';
import HoverText from '../../../components/MainUI/ApexUI-Kit/HoverText/HoverText.jsx';
import ParallaxCarousel from '../../../components/MainUI/ApexUI-Kit/ParallaxCarousel/ParallaxCarousel.jsx';

const people = [
    { id: 1, name: 'Captain America', designation: 'Leader of the Avengers', image: '/assets/captainamerica.png' },
    { id: 2, name: 'Doctor Strange', designation: 'Sorcerer Supreme', image: '/assets/doctorStrange.png' },
    { id: 3, name: 'Iron Man', designation: 'Leader Of Stark Industries', image: '/assets/ironman.png' },
    { id: 4, name: 'HULK', designation: 'Scientist', image: '/assets/hulk.png' },
    { id: 5, name: 'Spider-Man', designation: 'Friendly Neighborhood Spider-Man', image: '/assets/spiderman.png' },
    { id: 6, name: 'Thanos', designation: 'The Mad Titan', image: '/assets/thanos.png' },
];

const stackCards = [
    { title: 'ApexUI Card Stack', subtitle: 'Modern glassmorphic stack', desc: 'Pause on hover, auto-cycling.', color: 'from-blue-500/60 to-blue-300/30', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80', link: '#', github: '#' },
    { title: 'React Modern Card', subtitle: 'Responsive, animated, clean', desc: 'Stacked with smooth transitions.', color: 'from-pink-500/60 to-pink-300/30', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80', link: '#', github: '#' },
    { title: 'Pause & Cycle', subtitle: 'Auto-cycling, pause on hover', desc: 'Try it now!', color: 'from-yellow-500/60 to-yellow-300/30', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80', link: '#', github: '#' },
];

const slides = [
    { imageUrl: '/assets/ironman.png', pngUrl: '/assets/png/iron-man.png', title: 'Iron Man', subtitle: 'Gain insights that matter.', text: 'Track your performance with an advanced analytics dashboard.' },
    { imageUrl: '/assets/spiderman.png', pngUrl: '/assets/png/spider-man.png', title: 'Spider Man', subtitle: 'Swing into action.', text: 'An adventure through the city.' },
    { imageUrl: '/assets/captainamerica.png', pngUrl: '/assets/png/captain-america.png', title: 'Captain America', subtitle: 'Stand tall and fight.', text: 'Join the battle for justice.' },
    { imageUrl: '/assets/hulk.png', pngUrl: '/assets/png/hulk.png', title: 'Hulk', subtitle: 'Unleash the beast within.', text: 'A journey of strength and resilience.' },
];

const showcase = [
    { name: 'Glare Card', path: '/components/glare-card', render: () => <GlareCard /> },
    { name: 'Hyper Card', path: '/components/hyper-card', render: () => <HyperCard text="Apex UI is Lightning" LastText="Speed" LastTextColor="#9AE600" SubText="Experience the power of fully animated components." starColor="#9AE600" glow /> },
    { name: 'ToolTip', path: '/components/tool-tip', render: () => <ToolTip items={people} /> },
    { name: 'Card Stack', path: '/components/card-stack', render: () => <CardStack cards={stackCards} autoCycle cycleInterval={3000} /> },
    { name: 'Hover Text', path: '/components/hover-text', render: () => <HoverText text="Hover Me!" effect="wave" effectColor="#a3e635" /> },
    { name: 'Carousel', path: '/components/carousel', render: () => <div className="w-full scale-[0.85]"><ParallaxCarousel slides={slides} /></div> },
];

const stack = [
    { name: 'React', icon: ReactIcon, href: 'https://react.dev' },
    { name: 'Tailwind CSS', icon: TailwindIcon, href: 'https://tailwindcss.com' },
    { name: 'Framer Motion', icon: FramerIcon, href: 'https://motion.dev' },
    { name: 'GSAP', icon: GsapIcon, href: 'https://gsap.com' },
];

const features = [
    { icon: Terminal, title: 'One command away', body: 'npx apex-ui-kit add <name> drops the source straight into your project. No wrappers, no lock-in.', wide: true },
    { icon: Sparkles, title: 'Motion built in', body: 'GSAP and Framer Motion tuned for smooth, 60fps interactions.' },
    { icon: Moon, title: 'Dark-first', body: 'Designed for dark interfaces, at home on any background.' },
    { icon: Wand2, title: 'Yours to customize', body: 'Plain React + Tailwind. Change props, tweak classes or rewrite it.' },
    { icon: Blocks, title: `${CATEGORIES.length} categories`, body: `${CATEGORIES.join(', ')}.` },
];

const usageSnippet = `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

export default function App() {
  return <HyperCard starColor="#a3e635" glow />;
}`;

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

function SectionHeading({ eyebrow, title, body, center = true }) {
    return (
        <motion.div {...fadeUp} className={`w-full max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
            <p className="text-sm font-medium text-[var(--accent-text)]">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">{title}</h2>
            {body && <p className="mt-4 text-[17px] leading-7 text-[var(--fg-muted)]">{body}</p>}
        </motion.div>
    );
}

function InstallChip() {
    const command = 'npx apex-ui-kit add hyper-card';
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(command);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                } catch { /* clipboard unavailable */ }
            }}
            className="group inline-flex h-11 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 font-mono text-[13px] text-[var(--fg-muted)] backdrop-blur transition hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
        >
            <span className="text-[var(--fg-subtle)]">$</span>
            {command}
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent-text)]" /> : <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />}
        </button>
    );
}

function Hero() {
    const latest = componentPages.filter((c) => c.badge).slice(0, 2);
    return (
        <section className="relative isolate overflow-hidden">
            <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
            <div className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--glow)] blur-[120px]" />

            <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 text-center sm:px-6 sm:pt-40">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Link
                        to={latest[0]?.path || '/components'}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 py-1 pl-1 pr-3 text-xs text-[var(--fg-muted)] backdrop-blur transition hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                    >
                        <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-medium text-[var(--accent-fg)]">New</span>
                        {latest.map((c) => c.name).join(' & ')}
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-7 max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)] sm:text-6xl md:text-7xl"
                >
                    Animated React components,
                    <br className="hidden sm:block" />{' '}
                    <span className="bg-gradient-to-b from-[var(--accent-text)] to-[var(--accent)] bg-clip-text text-transparent">crafted to ship.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-6 max-w-2xl text-[17px] leading-7 text-[var(--fg-muted)] sm:text-lg"
                >
                    {componentPages.length} copy-paste components and effects built with Tailwind CSS, GSAP and Framer Motion. Add them with one command and own every line.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    <Link to="/components" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--fg)] px-5 text-sm font-medium text-[var(--bg)] shadow-[var(--shadow)] transition hover:opacity-90">
                        Browse components <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/components/docs/getting-started/introduction" className="inline-flex h-11 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 text-sm font-medium text-[var(--fg)] backdrop-blur transition hover:bg-[var(--surface-2)]">
                        Read the docs
                    </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-5 flex justify-center">
                    <InstallChip />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-14 flex flex-col items-center gap-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Built with</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                        {stack.map(({ name, icon: Icon, href }) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--fg-subtle)] transition hover:text-[var(--fg)]">
                                <Icon className="h-5 w-5" />
                                {name}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Showcase() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return undefined;
        const id = setInterval(() => setActive((i) => (i + 1) % showcase.length), 6000);
        return () => clearInterval(id);
    }, [paused]);

    const current = showcase[active];
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
                {...fadeUp}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
            >
                <div className="flex items-center gap-4 border-b border-[var(--border)] px-4 py-3">
                    <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-[var(--surface-3)]" />
                        <span className="h-3 w-3 rounded-full bg-[var(--surface-3)]" />
                        <span className="h-3 w-3 rounded-full bg-[var(--surface-3)]" />
                    </div>
                    <div className="thin-scroll -mb-px flex flex-1 gap-1 overflow-x-auto">
                        {showcase.map((item, i) => (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => setActive(i)}
                                className={`relative shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${i === active ? 'text-[var(--fg)]' : 'text-[var(--fg-subtle)] hover:text-[var(--fg-muted)]'}`}
                            >
                                {i === active && <motion.span layoutId="showcase-tab" className="absolute inset-0 rounded-md bg-[var(--surface-2)] ring-1 ring-[var(--border)]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                                <span className="relative">{item.name}</span>
                            </button>
                        ))}
                    </div>
                    <Link to={current.path} className="hidden shrink-0 items-center gap-1 text-sm text-[var(--fg-muted)] transition hover:text-[var(--fg)] sm:inline-flex">
                        View docs <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="bg-dots relative flex h-[440px] items-center justify-center overflow-hidden bg-[var(--preview-bg)] p-6 text-white [transform:translateZ(0)] sm:h-[520px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.name}
                            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="flex h-full w-full items-center justify-center"
                        >
                            {current.render()}
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute bottom-0 left-0 h-px w-full bg-white/5">
                        {!paused && <motion.div key={active} className="h-full bg-[var(--accent)]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

function Stats() {
    const stats = [
        { value: componentPages.length, label: 'Components' },
        { value: CATEGORIES.length, label: 'Categories' },
        { value: '1', label: 'Command to install' },
        { value: 'MIT', label: 'Open source' },
    ];
    return (
        <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-[var(--bg)] px-6 py-7 text-center">
                        <p className="text-3xl font-semibold tracking-tight text-[var(--fg)]">{s.value}</p>
                        <p className="mt-1 text-sm text-[var(--fg-subtle)]">{s.label}</p>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}

function Features() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
            <SectionHeading eyebrow="Why ApexUI" title="Everything you need, nothing you don’t." body="A focused set of polished, animated building blocks for landing pages, portfolios and dashboards." />
            <div className="mt-14 grid gap-4 md:grid-cols-3">
                {features.map(({ icon: Icon, title, body, wide }, i) => (
                    <motion.div
                        key={title}
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                        className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--border-strong)] ${wide ? 'md:col-span-2' : ''}`}
                    >
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--glow)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--accent-text)]">
                            <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-5 text-base font-medium text-[var(--fg)]">{title}</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--fg-muted)]">{body}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Gallery() {
    const picks = ['/components/hyper-card', '/components/lens-flare-background', '/components/card-stack', '/components/tool-tip', '/components/accordion-marquee', '/components/luminous-particle-ocean']
        .map((p) => componentPages.find((c) => c.path === p))
        .filter(Boolean);
    return (
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
            <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <SectionHeading center={false} eyebrow="Library" title="Explore the components" body="Backgrounds, cards, text effects, navigation and more — each with a live preview, props and code." />
                    <motion.div {...fadeUp}>
                        <Link to="/components" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--surface-2)]">
                            View all {componentPages.length} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {picks.map((item, i) => (
                        <motion.div key={item.path} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
                            <ComponentCard item={item} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
            <div className="grid items-center gap-14 lg:grid-cols-2">
                <div className="min-w-0">
                    <SectionHeading center={false} eyebrow="How it works" title="From install to UI in under a minute." />
                    <motion.ol {...fadeUp} className="mt-10 space-y-7">
                        {[
                            { title: 'Install the package', body: 'One dev dependency gives you the ApexUI CLI.' },
                            { title: 'Add a component', body: 'The source is copied into src/ApexUI-Kit — no runtime library.' },
                            { title: 'Import and customize', body: 'Use it like any React component and tweak it freely.' },
                        ].map((step, i) => (
                            <li key={step.title} className="flex gap-4">
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] font-mono text-sm text-[var(--fg)]">{i + 1}</span>
                                <div>
                                    <h3 className="font-medium text-[var(--fg)]">{step.title}</h3>
                                    <p className="mt-1 text-sm leading-6 text-[var(--fg-muted)]">{step.body}</p>
                                </div>
                            </li>
                        ))}
                    </motion.ol>
                </div>
                <motion.div {...fadeUp} className="min-w-0 space-y-3">
                    <CommandLine command="npm i apex-ui-kit" />
                    <CommandLine command="npx apex-ui-kit add hyper-card" />
                    <CodeBlock title="src/App.jsx" code={usageSnippet} />
                </motion.div>
            </div>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
            <motion.div {...fadeUp} className="relative isolate overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center sm:px-12">
                <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,#000_30%,transparent_100%)]" />
                <div className="pointer-events-none absolute bottom-[-200px] left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--glow)] blur-[100px]" />
                <MousePointer2 className="mx-auto h-6 w-6 text-[var(--accent-text)]" />
                <h2 className="mx-auto mt-5 max-w-xl text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">Make your next interface feel alive.</h2>
                <p className="mx-auto mt-4 max-w-lg text-[var(--fg-muted)]">Start with a single component — your users will notice the difference.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/components/docs/getting-started/introduction" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--fg)] px-5 text-sm font-medium text-[var(--bg)] transition hover:opacity-90">
                        Get started <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/templates-soon" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] px-5 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--surface-2)]">
                        Templates
                        <span className="rounded-full bg-[var(--accent-soft)] px-1.5 py-px text-[10px] text-[var(--accent-text)]">Soon</span>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}

export default function HomePage() {
    useEffect(() => {
        document.title = 'ApexUI – Animated React components';
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
            <div className="fixed inset-x-0 top-0 z-[1000]">
                <SiteHeader />
            </div>
            <main>
                <Hero />
                <Showcase />
                <Stats />
                <Features />
                <Gallery />
                <HowItWorks />
                <FinalCta />
            </main>
            <SiteFooter />
        </div>
    );
}
