import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Code2, Gauge, MonitorSmartphone, Palette, Sparkles, Terminal } from 'lucide-react';
import SiteFooter from '../../layout/SiteFooter.jsx';
import CodeBlock, { CommandLine } from '../../ui/CodeBlock.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import { CliChip } from '../../docs/parts.jsx';
import { PAD_X } from '../../docs/style.js';
import { CATEGORIES, componentPages, prefetch, SITE } from '../../config/navigation.js';
import { FramerIcon, GsapIcon, ReactIcon, TailwindIcon } from './BrandIcons.jsx';
import GlareCard from '../../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';
import HyperCard from '../../../components/MainUI/ApexUI-Kit/HyperCard/HyperCard.jsx';
import ToolTip from '../../../components/MainUI/ApexUI-Kit/ToolTip/ToolTip.jsx';
import CardStack from '../../../components/MainUI/ApexUI-Kit/CardStack/CardStack.jsx';
import HoverText from '../../../components/MainUI/ApexUI-Kit/HoverText/HoverText.jsx';
import Avatar from '../../../components/MainUI/ApexUI-Kit/Avatar/Avatar.jsx';

const ease = [0.22, 1, 0.36, 1];
const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease },
};

const CONTAINER = `${PAD_X} mx-auto w-full max-w-[110rem]`;

const people = [
    { id: 1, name: 'Captain America', designation: 'Leader of the Avengers', image: '/assets/captainamerica.png' },
    { id: 2, name: 'Doctor Strange', designation: 'Sorcerer Supreme', image: '/assets/doctorStrange.png' },
    { id: 3, name: 'Iron Man', designation: 'Leader Of Stark Industries', image: '/assets/ironman.png' },
    { id: 4, name: 'HULK', designation: 'Scientist', image: '/assets/hulk.png' },
    { id: 5, name: 'Spider-Man', designation: 'Friendly Neighborhood Spider-Man', image: '/assets/spiderman.png' },
];

const avatars = [
    { name: 'Iron Man', imageUrl: '/assets/ironman.png', color: '#6366f1' },
    { name: 'Spider Man', imageUrl: '/assets/spiderman.png', color: '#ec4899' },
    { name: 'HULK', imageUrl: '/assets/hulk.png', color: '#22c55e' },
    { name: 'Doc Strange', imageUrl: '/assets/doctorStrange.png', color: '#f97316' },
    { name: 'Captain', imageUrl: '/assets/captainamerica.png', color: '#06b6d4' },
];

const stackCards = [
    { title: 'ApexUI Card Stack', subtitle: 'Modern glassmorphic stack', desc: 'Pause on hover, auto-cycling.', color: 'from-blue-500/60 to-blue-300/30', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80' },
    { title: 'React Modern Card', subtitle: 'Responsive, animated, clean', desc: 'Stacked with smooth transitions.', color: 'from-pink-500/60 to-pink-300/30', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80' },
    { title: 'Pause & Cycle', subtitle: 'Auto-cycling, pause on hover', desc: 'Click the top card to cycle.', color: 'from-yellow-500/60 to-yellow-300/30', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80' },
];

const byPath = (path) => componentPages.find((c) => c.path === path);

const stack = [
    { name: 'React', icon: ReactIcon, href: 'https://react.dev' },
    { name: 'Tailwind CSS', icon: TailwindIcon, href: 'https://tailwindcss.com' },
    { name: 'Framer Motion', icon: FramerIcon, href: 'https://motion.dev' },
    { name: 'GSAP', icon: GsapIcon, href: 'https://gsap.com' },
];

/* Real components shown in the hero showcase; `render` gets the site theme. */
const showcase = [
    { slug: 'hyper-card', render: () => <HyperCard text="Apex UI is Lightning" LastText="Speed" SubText="Hover to jump to warp speed." starColor="#b5ef3a" glow /> },
    { slug: 'glare-card', render: () => <GlareCard /> },
    { slug: 'card-stack', render: () => <CardStack cards={stackCards} cycleInterval={3200} /> },
    { slug: 'tool-tip', render: () => <ToolTip items={people} /> },
    { slug: 'hover-text', render: (theme) => <HoverText key={theme} text="Hover me" effect="wave" effectColor="#84cc16" textColor={theme === 'light' ? '#09090b' : '#fff'} fontSize="clamp(2.2rem, 4vw, 3.6rem)" /> },
    { slug: 'avatar', render: () => <Avatar users={avatars} /> },
].map((s) => ({ ...s, page: byPath(`/components/${s.slug}`) }));

const CYCLE_MS = 7000;

/* Types `npx apex-ui-kit add <slug>` whenever the slug changes. */
function useTyped(text) {
    const reduce = useReducedMotion();
    const [count, setCount] = useState(text.length);
    useEffect(() => {
        if (reduce) {
            setCount(text.length);
            return undefined;
        }
        setCount(0);
        const id = setInterval(() => {
            setCount((n) => {
                if (n >= text.length) {
                    clearInterval(id);
                    return n;
                }
                return n + 1;
            });
        }, 28);
        return () => clearInterval(id);
    }, [text, reduce]);
    return text.slice(0, count);
}

/*
 * Hero showcase: a component list on the left and a live, theme-aware stage
 * on the right. Cycles on its own, pauses while the pointer is over it.
 */
function Showcase() {
    const theme = useSiteTheme();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const item = showcase[index];
    const command = `npx apex-ui-kit add ${item.slug}`;
    const typed = useTyped(command);

    useEffect(() => {
        if (paused) return undefined;
        const id = setTimeout(() => setIndex((i) => (i + 1) % showcase.length), CYCLE_MS);
        return () => clearTimeout(id);
    }, [index, paused]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.35 }}
            className="relative"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
        >
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 -z-10 rounded-[3rem] bg-[var(--glow)] blur-[90px]" />
            <div className="grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-[var(--line-strong)] bg-[var(--panel)] shadow-[var(--shadow)] lg:grid-cols-[minmax(15rem,19rem)_minmax(0,1fr)]">
                {/* Component list */}
                <div className="min-w-0 border-b border-[var(--line)] lg:border-b-0 lg:border-r">
                    <p className="hidden px-5 pb-2 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-3)] lg:block">Live components</p>
                    <div className="thin-scroll flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-4 lg:pt-1" role="tablist" aria-label="Showcase">
                        {showcase.map((s, i) => {
                            const active = i === index;
                            return (
                                <button
                                    key={s.slug}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setIndex(i)}
                                    onMouseEnter={() => prefetch(s.page)}
                                    className={`relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors ${active ? 'bg-[var(--panel-2)] text-[var(--ink)]' : 'text-[var(--ink-2)] hover:bg-[var(--panel-2)]/60 hover:text-[var(--ink)]'}`}
                                >
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.68rem] ${active ? 'bg-[var(--lime)] text-[var(--lime-ink)]' : 'bg-[var(--panel-2)] text-[var(--ink-3)]'}`}>{s.page.num}</span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-[0.9rem] font-medium">{s.page.name}</span>
                                        <span className="hidden truncate text-[0.72rem] text-[var(--ink-3)] lg:block">{s.page.category}</span>
                                    </span>
                                    {active && (
                                        <motion.span
                                            key={`${index}-${paused}`}
                                            aria-hidden="true"
                                            className="absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full bg-[var(--lime)]"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: paused ? 0 : 1 }}
                                            transition={{ duration: paused ? 0.2 : CYCLE_MS / 1000, ease: 'linear' }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stage */}
                <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[var(--panel-2)] px-3 py-2 font-mono text-[0.78rem] text-[var(--ink)]">
                            <span className="text-[var(--lime-text)]">$</span>
                            <span className="truncate">{typed}</span>
                            <span className="inline-block h-4 w-[2px] animate-pulse bg-[var(--lime)]" />
                        </div>
                        <Link to={item.page.path} className="group hidden shrink-0 items-center gap-1.5 text-[0.82rem] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] sm:inline-flex">
                            Open docs <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                    <div className="relative isolate flex h-[clamp(26rem,50vh,38rem)] items-center justify-center overflow-hidden bg-[var(--stage)] p-4 text-[var(--stage-ink)] sm:p-6">
                        <div aria-hidden="true" className="stage-dots pointer-events-none absolute inset-0 -z-10" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={item.slug}
                                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.45, ease }}
                                className="flex w-full items-center justify-center"
                            >
                                {item.render(theme)}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Hero() {
    const latest = componentPages.find((p) => p.badge) ?? componentPages[0];
    return (
        <section className="relative isolate overflow-hidden">
            <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_30%,transparent_80%)]" />
            <div className="pointer-events-none absolute left-1/2 top-[-18rem] -z-10 h-[34rem] w-[min(70rem,90%)] -translate-x-1/2 rounded-full bg-[var(--glow)] blur-[110px]" />
            <div className={`${CONTAINER} pb-[clamp(3rem,6vw,6rem)] pt-[clamp(3rem,7vw,7rem)]`}>
                <div className="mx-auto flex max-w-[64rem] flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                        <Link
                            to={latest.path}
                            className="group inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] py-1 pl-1 pr-3 text-[0.8rem] text-[var(--ink-2)] shadow-[var(--shadow)] transition-colors hover:border-[var(--lime-line)] hover:text-[var(--ink)]"
                        >
                            <span className="rounded-full bg-[var(--lime)] px-2 py-0.5 text-[0.7rem] font-semibold text-[var(--lime-ink)]">New</span>
                            {latest.name} is here
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.08, ease }}
                        className="font-display mt-7 max-w-[20ch] text-[clamp(2.3rem,4.8vw,5.8rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--ink)] [text-wrap:balance]"
                    >
                        Animated React components for interfaces that <span className="text-accent">move.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.18, ease }}
                        className="mt-6 max-w-[56ch] text-[clamp(1.02rem,1.25vw,1.3rem)] leading-relaxed text-[var(--ink-2)]"
                    >
                        {componentPages.length} copy-paste components built with Tailwind CSS, GSAP and Framer Motion. Add one with a single command — the code lands in your project, yours to change.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.26, ease }}
                        className="mt-9 flex flex-wrap items-center justify-center gap-3"
                    >
                        <Link to="/components" className="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--lime)] pl-6 pr-2 text-[0.95rem] font-semibold text-[var(--lime-ink)] shadow-[0_10px_30px_-10px_var(--lime)] transition hover:brightness-105">
                            Browse components
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lime-ink)] text-[var(--lime)] transition-transform duration-300 group-hover:translate-x-0.5">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                        <Link to="/components/docs/getting-started/introduction" className="inline-flex h-12 items-center rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-6 text-[0.95rem] font-medium text-[var(--ink)] transition hover:bg-[var(--panel-2)]">
                            Read the docs
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.34 }} className="mt-5">
                        <CliChip command="npx apex-ui-kit add hyper-card" />
                    </motion.div>
                </div>

                <div className="mx-auto mt-[clamp(3rem,6vw,5.5rem)] max-w-[92rem]">
                    <Showcase />
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">Built with</span>
                    {stack.map(({ name, icon: Icon, href }) => (
                        <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]">
                            <Icon className="h-5 w-5" />
                            {name}
                        </a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function Stats() {
    const stats = [
        { value: componentPages.length, label: 'Animated components' },
        { value: CATEGORIES.length, label: 'Component families' },
        { value: 1, label: 'Command to add one' },
        { value: 'MIT', label: 'Free and open source' },
    ];
    return (
        <section className="border-y border-[var(--line)] bg-[var(--panel)]">
            <div className={`${CONTAINER} grid grid-cols-2 lg:grid-cols-4`}>
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        {...reveal}
                        transition={{ ...reveal.transition, delay: i * 0.06 }}
                        className={`py-8 lg:py-10 ${i % 2 ? 'pl-6' : ''} ${i > 0 ? 'lg:border-l lg:border-[var(--line)] lg:pl-8' : ''} ${i === 1 ? 'border-l border-[var(--line)]' : ''} ${i === 3 ? 'border-l border-[var(--line)]' : ''} ${i > 1 ? 'border-t border-[var(--line)] lg:border-t-0' : ''}`}
                    >
                        <p className="font-display text-[clamp(2rem,3.4vw,3.4rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--ink)]">{s.value}</p>
                        <p className="mt-2 text-[0.9rem] text-[var(--ink-3)]">{s.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function SectionHead({ eyebrow, title, children }) {
    return (
        <motion.div {...reveal} className="mx-auto mb-12 max-w-[48rem] text-center">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--lime-text)]">{eyebrow}</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)]">{title}</h2>
            {children && <p className="mx-auto mt-4 max-w-[52ch] text-[1.02rem] leading-relaxed text-[var(--ink-2)]">{children}</p>}
        </motion.div>
    );
}

const categoryCover = {
    Backgrounds: '/components/lens-flare-background',
    Cards: '/components/hyper-card',
    'Text & Motion': '/components/accordion-marquee',
    Navigation: '/components/nav-drop-down',
    Interactive: '/components/carousel',
};

const categoryBlurb = {
    Backgrounds: 'WebGL, canvas and CSS backdrops that bring a page to life.',
    Cards: 'Tilt, glare, stacks and grids for content that wants attention.',
    'Text & Motion': 'Marquees, hover effects and reveals for headlines.',
    Navigation: 'Menus and dropdowns with smooth animated indicators.',
    Interactive: 'Carousels, tooltips, avatars and playful details.',
};

function Families() {
    const groups = CATEGORIES.map((category) => {
        const items = componentPages.filter((p) => p.category === category);
        return { category, items, cover: byPath(categoryCover[category]) ?? items[0] };
    });
    return (
        <section className={`${CONTAINER} py-[clamp(4rem,8vw,8rem)]`}>
            <SectionHead eyebrow="The kit" title={<>Five families, <span className="text-accent">one kit.</span></>}>
                Every component has a live playground, a props table and a one-line install.
            </SectionHead>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
                {groups.map(({ category, items, cover }, i) => (
                    <motion.div key={category} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className={i === 0 ? 'md:col-span-2 xl:row-span-2' : ''}>
                        <Link
                            to={`/components?category=${encodeURIComponent(category)}`}
                            className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-[var(--panel)] transition duration-300 hover:-translate-y-1 hover:border-[var(--lime-line)] hover:shadow-[var(--shadow)]"
                        >
                            <div className={`relative overflow-hidden bg-[var(--stage)] ${i === 0 ? 'aspect-[16/10] xl:aspect-auto xl:flex-1' : 'aspect-[16/9]'}`}>
                                <img src={cover.image} alt={`${cover.name} preview`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
                                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[0.68rem] text-white backdrop-blur">{items.length} components</span>
                            </div>
                            <div className="flex items-start justify-between gap-4 p-5">
                                <div className="min-w-0">
                                    <h3 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--ink)]">{category}</h3>
                                    <p className="mt-1 text-[0.9rem] leading-relaxed text-[var(--ink-2)]">{categoryBlurb[category]}</p>
                                    <p className="mt-3 truncate text-[0.78rem] text-[var(--ink-3)]">{items.slice(0, 3).map((p) => p.name).join(' · ')}{items.length > 3 ? ' …' : ''}</p>
                                </div>
                                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors group-hover:border-[var(--lime)] group-hover:bg-[var(--lime)] group-hover:text-[var(--lime-ink)]">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

const features = [
    { icon: Terminal, title: 'One command', body: 'npx apex-ui-kit add <name> writes the component straight into your project.' },
    { icon: Code2, title: 'You own the code', body: 'No runtime package or black box. Plain React and Tailwind you can edit freely.' },
    { icon: Sparkles, title: 'Motion first', body: 'GSAP and Framer Motion animations, tuned to stay smooth at 60fps.' },
    { icon: Palette, title: 'Easy to theme', body: 'Colours, speed and behaviour are props — match your brand in seconds.' },
    { icon: Gauge, title: 'Lightweight', body: 'Each component pulls in only what it needs. Nothing global, nothing extra.' },
    { icon: MonitorSmartphone, title: 'Responsive', body: 'From phones to 27" displays, layouts adapt without extra work.' },
];

function Features() {
    return (
        <section className="border-t border-[var(--line)] bg-[var(--panel)]/40">
            <div className={`${CONTAINER} py-[clamp(4rem,8vw,8rem)]`}>
                <SectionHead eyebrow="Why ApexUI" title={<>Built for developers who <span className="text-accent">ship.</span></>} />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {features.map(({ icon: Icon, title, body }, i) => (
                        <motion.div
                            key={title}
                            {...reveal}
                            transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
                            className="group rounded-[1.25rem] border border-[var(--line)] bg-[var(--panel)] p-6 transition-colors hover:border-[var(--lime-line)]"
                        >
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-soft)] text-[var(--lime-text)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="font-display mt-5 text-[1.15rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">{title}</h3>
                            <p className="mt-1.5 text-[0.93rem] leading-relaxed text-[var(--ink-2)]">{body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const usage = `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

export default function App() {
  return <HyperCard starColor="#b5ef3a" glow />;
}`;

function Steps() {
    const steps = [
        { title: 'Install the CLI', body: 'One package gives you the ApexUI command.', node: <CommandLine command="npm i apex-ui-kit" /> },
        { title: 'Add a component', body: 'The source lands in src/ApexUI-Kit — yours to edit.', node: <CommandLine command="npx apex-ui-kit add hyper-card" /> },
        { title: 'Use it', body: 'Import it like any other React component.', node: <CodeBlock code={usage} title="src/App.jsx" /> },
    ];
    return (
        <section className={`${CONTAINER} border-t border-[var(--line)] py-[clamp(4rem,8vw,8rem)]`}>
            <SectionHead eyebrow="How it works" title={<>From terminal to UI <span className="text-accent">in a minute.</span></>} />
            <div className="grid gap-4 lg:grid-cols-3">
                {steps.map((s, i) => (
                    <motion.div
                        key={s.title}
                        {...reveal}
                        transition={{ ...reveal.transition, delay: i * 0.08 }}
                        className="flex min-w-0 flex-col gap-5 rounded-[1.25rem] border border-[var(--line)] bg-[var(--panel)] p-6"
                    >
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lime)] font-mono text-[0.75rem] font-semibold text-[var(--lime-ink)]">{i + 1}</span>
                            <h3 className="font-display text-[1.15rem] font-semibold text-[var(--ink)]">{s.title}</h3>
                        </div>
                        <p className="-mt-2 text-[0.93rem] text-[var(--ink-2)]">{s.body}</p>
                        <div className="mt-auto min-w-0">{s.node}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Cta() {
    return (
        <section className={`${CONTAINER} pb-[clamp(4rem,8vw,8rem)]`}>
            <motion.div {...reveal} className="relative isolate overflow-hidden rounded-[2rem] bg-[var(--lime)] px-[clamp(1.5rem,5vw,5rem)] py-[clamp(3rem,6vw,6rem)] text-[var(--lime-ink)]">
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:1.1rem_1.1rem] [mask-image:radial-gradient(ellipse_at_80%_50%,#000,transparent_70%)]" />
                <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
                    <div>
                        <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,5vw,5rem)] font-semibold leading-[1] tracking-[-0.045em]">Make your next interface feel alive.</h2>
                        <p className="mt-4 max-w-[46ch] text-[1.02rem] text-[var(--lime-ink)]/75">Start with the docs, pick a component and drop it into your app — {SITE.version}, MIT licensed.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/components/docs/getting-started/introduction" className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--lime-ink)] pl-7 pr-2 text-base font-semibold text-[var(--lime)]">
                            Get started
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--lime-ink)] transition-transform duration-300 group-hover:-rotate-45">
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </Link>
                        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center rounded-full border border-[var(--lime-ink)]/25 px-7 text-base font-semibold transition hover:bg-[var(--lime-ink)]/10">
                            Star on GitHub
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default function HomePage() {
    return (
        <div>
            <Hero />
            <Stats />
            <Families />
            <Features />
            <Steps />
            <Cta />
            <SiteFooter />
        </div>
    );
}
