import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SiteFooter from '../../layout/SiteFooter.jsx';
import CodeBlock, { CommandLine } from '../../ui/CodeBlock.jsx';
import { ComponentList } from '../../ui/ComponentIndex.jsx';
import { LOGO_FULL } from '../../ui/Logo.jsx';
import { CliChip, Meta } from '../../docs/parts.jsx';
import { PAD_X } from '../../docs/style.js';
import { CATEGORIES, componentPages, prefetch, SITE } from '../../config/navigation.js';
import { FramerIcon, GsapIcon, ReactIcon, TailwindIcon } from './BrandIcons.jsx';
import GlareCard from '../../../components/MainUI/ApexUI-Kit/GlareCard/GlareCard.jsx';
import HyperCard from '../../../components/MainUI/ApexUI-Kit/HyperCard/HyperCard.jsx';
import ToolTip from '../../../components/MainUI/ApexUI-Kit/ToolTip/ToolTip.jsx';
import CardStack from '../../../components/MainUI/ApexUI-Kit/CardStack/CardStack.jsx';
import HoverText from '../../../components/MainUI/ApexUI-Kit/HoverText/HoverText.jsx';
import Avatar from '../../../components/MainUI/ApexUI-Kit/Avatar/Avatar.jsx';
import WaterDropReveal from '../../../components/MainUI/ApexUI-Kit/WaterDropReveal/WaterDropReveal.jsx';

const ease = [0.22, 1, 0.36, 1];
const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8, ease },
};

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
];

const stackCards = [
    { title: 'ApexUI Card Stack', subtitle: 'Modern glassmorphic stack', desc: 'Pause on hover, auto-cycling.', color: 'from-blue-500/60 to-blue-300/30', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80' },
    { title: 'React Modern Card', subtitle: 'Responsive, animated, clean', desc: 'Stacked with smooth transitions.', color: 'from-pink-500/60 to-pink-300/30', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80' },
    { title: 'Pause & Cycle', subtitle: 'Auto-cycling, pause on hover', desc: 'Click the top card to cycle.', color: 'from-yellow-500/60 to-yellow-300/30', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80' },
];

const byPath = (path) => componentPages.find((c) => c.path === path);

const wall = [
    { page: byPath('/components/glare-card'), className: 'xl:row-span-2', node: <GlareCard /> },
    { page: byPath('/components/hyper-card'), className: 'xl:row-span-2', node: <HyperCard text="Apex UI is Lightning" LastText="Speed" SubText="Hover to jump to warp speed." starColor="#b5ef3a" glow /> },
    { page: byPath('/components/tool-tip'), className: 'md:col-span-2', node: <ToolTip items={people} /> },
    { page: byPath('/components/hover-text'), className: '', node: <HoverText text="Hover me" effect="wave" effectColor="#b5ef3a" fontSize="clamp(1.8rem, 3vw, 2.6rem)" /> },
    { page: byPath('/components/avatar'), className: '', node: <Avatar users={avatars} /> },
    { page: byPath('/components/card-stack'), className: 'md:col-span-2', node: <CardStack cards={stackCards} cycleInterval={3200} /> },
    { page: byPath('/components/water-drop-reveal'), className: 'md:col-span-2', node: <WaterDropReveal text={'Hover to reveal\nthe water drop effect.'} animationSpeed={0.5} /> },
];

const stack = [
    { name: 'React', icon: ReactIcon, href: 'https://react.dev' },
    { name: 'Tailwind CSS', icon: TailwindIcon, href: 'https://tailwindcss.com' },
    { name: 'Framer Motion', icon: FramerIcon, href: 'https://motion.dev' },
    { name: 'GSAP', icon: GsapIcon, href: 'https://gsap.com' },
];

const principles = [
    { title: 'Copy, don’t depend', body: 'The CLI writes the component into your project. No runtime package to update, no black box.' },
    { title: 'Motion first', body: 'GSAP and Framer Motion, tuned for 60fps and paused when off-screen.' },
    { title: 'Own every line', body: 'Plain React + Tailwind. Change a prop, a class or rewrite the whole thing.' },
    { title: `${CATEGORIES.length} families`, body: `${CATEGORIES.join(', ')}.` },
];

/* The real ApexUI logo on a tilting card that follows the pointer. */
function LogoStage() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 18 });
    const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 18 });
    const glare = useTransform([mx, my], ([x, y]) => `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.18), transparent 55%)`);

    const chips = [
        { label: `${componentPages.length} components`, className: 'left-[2%] top-[12%]', delay: 0 },
        { label: 'npx apex-ui-kit add', className: 'right-[0%] top-[34%] font-mono', delay: 0.6 },
        { label: 'MIT · open source', className: 'left-[6%] bottom-[12%]', delay: 1.2 },
    ];

    return (
        <div
            className="relative flex h-full min-h-[24rem] items-center justify-center [perspective:1200px]"
            onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left) / r.width - 0.5);
                my.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onPointerLeave={() => {
                mx.set(0);
                my.set(0);
            }}
        >
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[var(--glow)] blur-[90px]" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, ease }}
                style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
                className="relative w-[min(78%,32rem)]"
            >
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
                    <img src={LOGO_FULL} alt="ApexUI logo" className="block aspect-square w-full object-cover" draggable="false" />
                    <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
                </div>
            </motion.div>
            {chips.map((c) => (
                <motion.span
                    key={c.label}
                    className={`absolute hidden items-center rounded-full border border-[var(--line-strong)] bg-[var(--panel)]/90 px-3.5 py-1.5 text-[0.78rem] text-[var(--ink-2)] shadow-[var(--shadow)] backdrop-blur sm:inline-flex ${c.className}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: [0, -8, 0] }}
                    transition={{ opacity: { delay: 0.6 + c.delay * 0.3, duration: 0.6 }, y: { delay: c.delay, duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
                    {c.label}
                </motion.span>
            ))}
        </div>
    );
}

function Hero() {
    return (
        <section className="relative isolate overflow-hidden border-b border-[var(--line)]">
            <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,#000_35%,transparent_85%)]" />
            <div className={`${PAD_X} grid min-h-[calc(100dvh-3.5rem-2*var(--pad))] items-center gap-10 py-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]`}>
                <div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                        <Meta>
                            <span>ApexUI {SITE.version}</span>
                            <span>· React component library</span>
                            <span>· Open source</span>
                        </Meta>
                    </motion.div>
                    <h1 className="font-display mt-6 text-[clamp(3.2rem,7.6vw,9.5rem)] font-semibold leading-[0.88] text-[var(--ink)]">
                        {['Interfaces', 'that'].map((w, i) => (
                            <motion.span key={w} className="mr-[0.22em] inline-block" initial={{ opacity: 0, y: '0.4em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08 + i * 0.08, ease }}>
                                {w}
                            </motion.span>
                        ))}
                        <br className="hidden sm:block" />
                        <motion.span className="font-serif-italic inline-block font-normal text-[var(--lime-text)]" initial={{ opacity: 0, y: '0.4em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.26, ease }}>
                            move.
                        </motion.span>
                    </h1>
                    <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease }} className="mt-7 max-w-[46ch] text-[clamp(1.02rem,1.2vw,1.25rem)] leading-relaxed text-[var(--ink-2)]">
                        {componentPages.length} animated, copy-paste React components built with Tailwind CSS, GSAP and Framer Motion. Add one with a single command and own every line.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease }} className="mt-9 flex flex-wrap items-center gap-3">
                        <Link to="/components" className="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--lime)] pl-6 pr-2 text-[0.95rem] font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                            Explore components
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lime-ink)] text-[var(--lime)] transition-transform duration-300 group-hover:translate-x-0.5">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                        <Link to="/components/docs/getting-started/introduction" className="inline-flex h-12 items-center rounded-full border border-[var(--line-strong)] px-6 text-[0.95rem] font-medium text-[var(--ink)] transition hover:bg-[var(--panel-2)]">
                            Read the docs
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-5">
                        <CliChip command="npx apex-ui-kit add hyper-card" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.75 }} className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3">
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">Built with</span>
                        {stack.map(({ name, icon: Icon, href }) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]">
                                <Icon className="h-5 w-5" />
                                {name}
                            </a>
                        ))}
                    </motion.div>
                </div>
                <LogoStage />
            </div>
        </section>
    );
}

function Ticker() {
    const row = (
        <div className="flex shrink-0 items-center">
            {componentPages.map((c) => (
                <span key={c.path} className="font-display flex items-center whitespace-nowrap px-6 text-[clamp(1.2rem,2vw,2rem)] font-semibold">
                    {c.name}
                    <span className="ml-12 text-[0.7em]">✦</span>
                </span>
            ))}
        </div>
    );
    return (
        <div className="ticker overflow-hidden border-b border-[var(--line)] bg-[var(--lime)] py-4 text-[var(--lime-ink)]" aria-hidden="true">
            <div className="ticker-track flex w-max">
                {row}
                {row}
            </div>
        </div>
    );
}

function SectionHead({ index, label, children, aside }) {
    return (
        <motion.div {...reveal} className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
                <Meta><span>{index}</span><span>· {label}</span></Meta>
                <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,5.5rem)] font-semibold leading-[0.92] text-[var(--ink)]">{children}</h2>
            </div>
            {aside}
        </motion.div>
    );
}

function LiveWall() {
    return (
        <section className={`${PAD_X} py-[clamp(4rem,8vw,8rem)]`}>
            <SectionHead
                index="01"
                label="Live wall"
                aside={<p className="max-w-[40ch] text-[1.02rem] leading-relaxed text-[var(--ink-2)]">Every tile is the real component running in your browser. Hover, click and play — then open its page for props and code.</p>}
            >
                Live, not <span className="font-serif-italic font-normal text-[var(--lime-text)]">screenshots.</span>
            </SectionHead>

            <div className="grid auto-rows-[minmax(20rem,auto)] gap-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-2 xl:grid-cols-4">
                {wall.map(({ page, className, node }, i) => (
                    <motion.div
                        key={page.path}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease }}
                        className={`group relative flex min-h-[20rem] items-center justify-center overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--stage)] stage-dots p-6 pt-16 text-white [transform:translateZ(0)] ${className}`}
                    >
                        <Link
                            to={page.path}
                            onMouseEnter={() => prefetch(page)}
                            className="absolute inset-x-3 top-3 z-20 flex items-center justify-between rounded-full border border-white/10 bg-black/40 py-1 pl-3 pr-1 text-[0.78rem] text-white/80 backdrop-blur transition-colors hover:border-[var(--lime-line)] hover:text-white"
                        >
                            <span className="truncate"><span className="mr-2 font-mono text-[0.68rem] text-white/45">No. {page.num}</span>{page.name}</span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[var(--lime)] group-hover:text-[var(--lime-ink)]">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                        </Link>
                        <div className="flex h-full w-full items-center justify-center">{node}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function IndexPreview() {
    return (
        <section className={`${PAD_X} border-t border-[var(--line)] py-[clamp(4rem,8vw,8rem)]`}>
            <SectionHead
                index="02"
                label="The index"
                aside={
                    <Link to="/components" className="group inline-flex h-12 items-center gap-2 self-start rounded-full border border-[var(--line-strong)] px-6 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--lime)] hover:bg-[var(--lime)] hover:text-[var(--lime-ink)] lg:self-auto">
                        View all {componentPages.length} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                }
            >
                {componentPages.length} pieces, <span className="font-serif-italic font-normal text-[var(--lime-text)]">one kit.</span>
            </SectionHead>
            <ComponentList items={componentPages.slice(0, 10)} />
        </section>
    );
}

const usage = `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

export default function App() {
  return <HyperCard starColor="#b5ef3a" glow />;
}`;

function Workflow() {
    const steps = [
        { title: 'Install', body: 'One package gives you the ApexUI CLI.', command: 'npm i apex-ui-kit' },
        { title: 'Add', body: 'The source lands in src/ApexUI-Kit — yours to edit.', command: 'npx apex-ui-kit add hyper-card' },
        { title: 'Ship', body: 'Import it like any other React component.', command: null },
    ];
    return (
        <section className="border-t border-[var(--line)]">
            <div className={`${PAD_X} pt-[clamp(4rem,8vw,8rem)]`}>
                <SectionHead index="03" label="Workflow">
                    From terminal to UI in <span className="font-serif-italic font-normal text-[var(--lime-text)]">a minute.</span>
                </SectionHead>
            </div>
            <div className="grid border-t border-[var(--line)] lg:grid-cols-3">
                {steps.map((s, i) => (
                    <motion.div
                        key={s.title}
                        {...reveal}
                        transition={{ ...reveal.transition, delay: i * 0.08 }}
                        className={`${PAD_X} flex min-w-0 flex-col gap-5 border-b border-[var(--line)] py-10 lg:border-b-0 lg:border-r lg:last:border-r-0`}
                    >
                        <span className="font-display text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--lime-line)]">0{i + 1}</span>
                        <div>
                            <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">{s.title}</h3>
                            <p className="mt-1.5 text-[0.95rem] text-[var(--ink-2)]">{s.body}</p>
                        </div>
                        <div className="mt-auto min-w-0">{s.command ? <CommandLine command={s.command} /> : <CodeBlock code={usage} title="src/App.jsx" />}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Principles() {
    return (
        <section className="grid border-t border-[var(--line)] sm:grid-cols-2 2xl:grid-cols-4">
            {principles.map((p, i) => (
                <motion.div key={p.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className={`${PAD_X} border-b border-[var(--line)] py-12 sm:border-r 2xl:border-b-0`}>
                    <span className="font-mono text-[0.7rem] text-[var(--lime-text)]">P·0{i + 1}</span>
                    <h3 className="font-display mt-4 text-[1.7rem] font-semibold leading-tight text-[var(--ink)]">{p.title}</h3>
                    <p className="mt-2 max-w-[36ch] text-[0.95rem] leading-relaxed text-[var(--ink-2)]">{p.body}</p>
                </motion.div>
            ))}
        </section>
    );
}

function Cta() {
    return (
        <section className="relative isolate overflow-hidden bg-[var(--lime)] text-[var(--lime-ink)]">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:1.1rem_1.1rem]" />
            <div className={`${PAD_X} flex flex-col items-start justify-between gap-10 py-[clamp(4rem,8vw,8rem)] lg:flex-row lg:items-end`}>
                <motion.h2 {...reveal} className="font-display max-w-[14ch] text-[clamp(2.8rem,6.5vw,7.5rem)] font-semibold leading-[0.9]">
                    Make your next interface feel <span className="font-serif-italic font-normal">alive.</span>
                </motion.h2>
                <motion.div {...reveal} className="flex flex-wrap gap-3">
                    <Link to="/components/docs/getting-started/introduction" className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--lime-ink)] pl-7 pr-2 text-base font-semibold text-[var(--lime)]">
                        Get started
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--lime-ink)] transition-transform duration-300 group-hover:rotate-[-45deg]">
                            <ArrowRight className="h-5 w-5" />
                        </span>
                    </Link>
                    <Link to="/templates-soon" className="inline-flex h-14 items-center rounded-full border border-[var(--lime-ink)]/25 px-7 text-base font-semibold transition hover:bg-[var(--lime-ink)]/10">
                        Templates · soon
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default function HomePage() {
    return (
        <div>
            <Hero />
            <Ticker />
            <LiveWall />
            <IndexPreview />
            <Workflow />
            <Principles />
            <Cta />
            <SiteFooter />
        </div>
    );
}
