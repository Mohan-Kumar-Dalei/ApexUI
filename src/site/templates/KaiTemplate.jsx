import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import ParticleText from '../../components/MainUI/ApexUI-Kit/ParticleText/ParticleText.jsx';
import TypewriterText from '../../components/MainUI/ApexUI-Kit/TypewriterText/TypewriterText.jsx';
import CrossedMarquee from '../../components/MainUI/ApexUI-Kit/CrossedMarquee/CrossedMarquee.jsx';
import DistortionImage from '../../components/MainUI/ApexUI-Kit/DistortionImage/DistortionImage.jsx';
import EdgeGlowForm from '../../components/MainUI/ApexUI-Kit/EdgeGlowForm/EdgeGlowFrom.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import StarBorder from '../../components/MainUI/ApexUI-Kit/StarBorder/StarBorder.jsx';
import { Footer, Section } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#22d3ee';

const PROJECTS = [
    { title: 'Ledger', kind: 'Fintech dashboard', year: '2026', img: 'photo-1551288049-bebda4e38f71', stack: 'React · D3 · Node' },
    { title: 'Northwind', kind: 'E-commerce rebuild', year: '2025', img: 'photo-1556742049-0cfed4f6a45d', stack: 'Next.js · Stripe · Postgres' },
    { title: 'Halo', kind: 'WebGL product launch', year: '2025', img: 'photo-1618005182384-a83a8bd57fbe', stack: 'Three.js · GLSL · GSAP' },
    { title: 'Signal', kind: 'Realtime chat app', year: '2024', img: 'photo-1519389950473-47ba0277781c', stack: 'React Native · WebSockets' },
];

const JOBS = [
    ['2024 — now', 'Senior Frontend Engineer', 'Brightline', 'Leading the design system and the web app used by 2M people.'],
    ['2021 — 2024', 'Frontend Engineer', 'Kettle Studio', 'Shipped 30+ marketing sites and two award winning launches.'],
    ['2019 — 2021', 'Full-stack Developer', 'Freelance', 'APIs, dashboards and small products for early startups.'],
];

/* Kai: a developer portfolio. */
export default function KaiTemplate() {
    return (
        <div className="bg-[#06080d] text-white">
            <header className="flex items-center justify-between px-[clamp(1rem,4vw,3rem)] py-5">
                <span className="font-mono text-sm font-bold">kai.dev</span>
                <nav className="flex items-center gap-5 text-sm text-white/70">
                    <a href="#work">Work</a>
                    <a href="#about" className="hidden sm:inline">
                        About
                    </a>
                    <a href="#contact">Contact</a>
                </nav>
            </header>

            <section className="px-[clamp(1rem,4vw,3rem)] pb-16 pt-[clamp(1rem,4vw,3rem)]">
                <div className="mx-auto max-w-6xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Open to new projects
                    </span>
                    <div className="mt-6 text-[#e6f9fd]">
                        <ParticleText text="KAI ROSS" fontSize={11} particleSize={2.4} gap={3} height="clamp(8rem, 24vw, 19rem)" color="#e6f9fd" accentColor={ACCENT} />
                    </div>
                    <TypewriterText prefix="I build " words={['fast web apps.', 'design systems.', 'things with WebGL.', 'calm interfaces.']} accentColor={ACCENT} className="mt-2 text-[clamp(1.4rem,3.4vw,2.4rem)] font-semibold" />
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <MagneticButton accentColor={ACCENT}>Hire me</MagneticButton>
                        <StarBorder color={ACCENT} theme="dark">
                            Download CV
                        </StarBorder>
                        <span className="ml-1 flex gap-3 text-white/60">
                            <Github className="h-5 w-5" />
                            <Linkedin className="h-5 w-5" />
                            <Mail className="h-5 w-5" />
                        </span>
                    </div>
                </div>
            </section>

            <CrossedMarquee items={['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Vite', 'MongoDB', 'Redux']} accentColor={ACCENT} backColor="#0e1a22" />

            <Section className="!pt-10">
                <div id="about" className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
                    <img src={photo('photo-1507003211169-0a1dd7228f2d', 900)} alt="Kai Ross" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover grayscale transition duration-700 hover:grayscale-0" />
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">About</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Engineer with a designer&apos;s eye</h2>
                        <p className="mt-4 text-white/65">Seven years turning ideas into fast, accessible products. I care about the last 10%: motion that feels right, pages that load instantly and code the next person enjoys reading.</p>
                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                            {[
                                ['7+', 'years'],
                                ['60+', 'projects'],
                                ['4', 'awards'],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <p className="text-3xl font-black" style={{ color: ACCENT }}>
                                        {n}
                                    </p>
                                    <p className="text-xs text-white/50">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section eyebrow="Selected work" title="Things I shipped" text="Hover a project.">
                <div id="work" className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
                    {PROJECTS.map((p) => (
                        <article key={p.title} className="group">
                            <DistortionImage src={photo(p.img, 1100)} aspectRatio="4 / 3" width={40} rounded="1.25rem" className="!w-full" />
                            <div className="mt-4 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold">{p.title}</h3>
                                    <p className="text-sm text-white/55">
                                        {p.kind} · {p.stack}
                                    </p>
                                </div>
                                <span className="flex items-center gap-1 font-mono text-xs text-white/40">
                                    {p.year} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </Section>

            <Section eyebrow="Experience" title="Where I've worked">
                <ol className="mx-auto max-w-3xl">
                    {JOBS.map(([when, role, org, note]) => (
                        <li key={when} className="grid gap-1 border-t border-white/10 py-6 sm:grid-cols-[10rem_1fr]">
                            <span className="font-mono text-xs text-white/45">{when}</span>
                            <div>
                                <p className="font-semibold">
                                    {role} <span className="text-white/45">· {org}</span>
                                </p>
                                <p className="mt-1 text-sm text-white/60">{note}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Section>

            <Section eyebrow="Contact" title="Let's build something">
                <div id="contact" className="mx-auto flex max-w-xl justify-center">
                    <EdgeGlowForm GlowColor="cyan" borderGlowColor="#22d3ee88" borderGlowShadow="#22d3ee33" />
                </div>
            </Section>

            <Footer brand="Kai Ross" note="Designed and built with ApexUI components" />
        </div>
    );
}
