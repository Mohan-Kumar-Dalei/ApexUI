import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Database, Download, FileText, Gauge, Github, KeyRound, Layers, Lock, Palette, Server, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import SiteFooter from '../layout/SiteFooter.jsx';
import CodeBlock, { CommandLine } from '../ui/CodeBlock.jsx';
import HorizonGlow from '../../components/MainUI/ApexUI-Kit/HorizonGlow/HorizonGlow.jsx';
import ShinyText from '../../components/MainUI/ApexUI-Kit/ShinyText/ShinyText.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import useSiteTheme from '../ui/useSiteTheme.js';
import { componentPages } from '../config/navigation.js';
import skillMd from '../../../skills/apexui/SKILL.md?raw';

const SKILL_FILE = '/skills/apexui/SKILL.md';
const ALL_IN_ONE = '/skills/apexui-skill.md';

const ProBadge = ({ className = '' }) => (
    <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--lime-line)] bg-[var(--lime-soft)] px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--lime)] ${className}`}>
        <Lock className="h-3 w-3" /> Pro
    </span>
);

// How to install for each agent. `cmd` runs in the project folder.
const AGENTS = [
    { id: 'claude', name: 'Claude Code', cmd: 'npx apex-ui-kit skill --ai claude', where: '.claude/skills/apexui/', steps: ['Run the command in your project folder.', 'Claude Code picks the skill up on its own when the task fits (a landing page, an app screen, "make it premium").', 'For every project on this computer, copy the folder to ~/.claude/skills/apexui/ instead.'] },
    { id: 'claude-web', name: 'Claude.ai', file: true, steps: ['Download the skill folder files (or the all-in-one file).', 'Zip the apexui folder and upload it in Settings > Capabilities > Skills, or add the all-in-one file to a Project’s knowledge.', 'Ask Claude to build with ApexUI.'] },
    { id: 'chatgpt', name: 'ChatGPT', file: true, steps: ['Download the all-in-one file.', 'Create a Project (or a custom GPT) and add the file to it.', 'In the instructions write: "Follow the ApexUI skill in apexui-skill.md for every UI task."'] },
    { id: 'antigravity', name: 'Antigravity', cmd: 'npx apex-ui-kit skill --ai antigravity', where: '.agents/skills/apexui/', steps: ['Run the command in your workspace.', 'Antigravity loads skills from .agents/skills/ and uses this one when the task matches.', 'For all workspaces, copy the folder to ~/.gemini/config/skills/apexui/.'] },
    { id: 'cursor', name: 'Cursor', cmd: 'npx apex-ui-kit skill --ai cursor', where: '.cursor/rules/apexui.mdc', steps: ['Run the command in your project.', 'The rule is attached when relevant; mention @apexui to force it.', 'Reference files go to .apexui/skill/references/.'] },
    { id: 'windsurf', name: 'Windsurf', cmd: 'npx apex-ui-kit skill --ai windsurf', where: '.windsurf/rules/apexui.md', steps: ['Run the command in your project.', 'Cascade applies the rule when the task matches its description.'] },
    { id: 'copilot', name: 'Copilot', cmd: 'npx apex-ui-kit skill --ai copilot', where: '.github/instructions/apexui.instructions.md', steps: ['Run the command in your repository.', 'Copilot Chat and the coding agent read the instructions automatically.'] },
    { id: 'codex', name: 'Codex & others', cmd: 'npx apex-ui-kit skill --ai codex', where: 'AGENTS.md', steps: ['Run the command; it adds an ApexUI section to AGENTS.md and keeps what you already had.', 'Works with Codex and other tools that read AGENTS.md. For Gemini CLI use --ai gemini (GEMINI.md).'] },
];

const INSIDE = [
    { icon: Layers, title: 'Every component', body: `All ${componentPages.length} ApexUI components with their CLI names and when to use each.` },
    { icon: Sparkles, title: 'Page and screen recipes', body: 'Section orders for SaaS, AI, portfolio, store, events, dashboards, auth and mobile app screens.' },
    { icon: Palette, title: 'Design system', body: '10 palettes in light and dark, 8 font pairs, fluid type, spacing, radius and motion tokens.' },
    { icon: Smartphone, title: 'Responsive and mobile', body: 'Container-first layouts, touch targets, safe areas, PWA setup and phone performance budgets.' },
    { icon: ShieldCheck, title: 'Security', body: 'No secrets in the bundle, XSS and link safety, cookie auth, security headers, dependency checks.' },
    { icon: Check, title: 'Ship checklist', body: 'Design, responsive, performance, accessibility and security checks before the agent says "done".' },
];

const PRO_SECURE = ['Argon2id passwords, generic login errors, lockout', 'Short JWT + rotating refresh token in httpOnly cookies', 'Helmet, CORS allowlist, rate limits (global + auth)', 'CSRF defence: SameSite cookies + Origin check', 'Zod on every input, NoSQL injection guards', 'Ownership checks on every record (OWASP API1)', 'Upload checks, SSRF guard, redacted logs', 'Env validated at boot, secret scanning, npm audit'];
const PRO_FAST = ['Indexes, lean queries, cursor pagination', 'Compression, HTTP caching, Redis where it pays', 'Background jobs for slow work', 'Graceful shutdown, health checks, stateless API', 'Code-split React, TanStack Query caching', 'Docker, CI with tests, monitoring, backups'];

const ENV_PREVIEW = `# server/.env  (never commit this file)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/myapp
JWT_ACCESS_SECRET=<64 random bytes>
JWT_REFRESH_SECRET=<a different 64 random bytes>
CLIENT_ORIGIN=http://localhost:5173

# make each secret like this (run once per secret)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`;

const FAQ = [
    { q: 'What is a skill?', a: 'A folder of instructions and reference files that an AI agent reads before it works. This one teaches the agent how to plan, design and build with ApexUI, and what to check before it says the work is done.' },
    { q: 'Is the ApexUI skill free?', a: 'Yes. The website and app skill is free and open source, like the components. The Fullstack skill is part of ApexUI Pro, coming soon.' },
    { q: 'Does it make my app 100% secure?', a: 'No tool can promise that. The skill makes the agent follow a strict security checklist (secrets, XSS, links, auth cookies, headers, dependencies) and tell you anything it could not check. Review the code before you ship.' },
    { q: 'How do I update it?', a: 'Run the same command again. It replaces the skill files (and only the ApexUI section of AGENTS.md or GEMINI.md).' },
    { q: 'Can I edit it?', a: 'Yes. It is plain Markdown in your project. Add your brand colours to the design system file and your agent will use them.' },
];

export default function SkillsPage() {
    const theme = useSiteTheme();
    const [agent, setAgent] = useState(AGENTS[0].id);
    const [showMd, setShowMd] = useState(false);
    const a = AGENTS.find((x) => x.id === agent);

    return (
        <div className="mx-auto w-full max-w-[100rem]">
            {/* Hero */}
            <section className="px-[clamp(0.75rem,2.2vw,2rem)] pt-[clamp(0.75rem,2vw,1.5rem)]">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c16] text-white">
                    <div className="absolute inset-0">
                        <HorizonGlow preset="lilac" intensity={0.8} />
                    </div>
                    <div className="relative mx-auto max-w-4xl px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(3rem,7vw,6rem)] text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs backdrop-blur">
                            <ShinyText text="Agent Skills · new" color="#c4b5fd" shineColor="#ffffff" />
                        </span>
                        <h1 className="font-display mt-5 text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
                            Teach your AI agent
                            <br />
                            <span className="bg-gradient-to-r from-[#f0abfc] via-[#c4b5fd] to-[#93c5fd] bg-clip-text text-transparent">to build like a pro</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] text-white/70">
                            One skill that makes Claude, ChatGPT, Antigravity, Cursor and Copilot build premium, responsive and secure websites and mobile web apps with ApexUI.
                        </p>
                        <div className="mx-auto mt-8 max-w-md text-left">
                            <CommandLine command="npx apex-ui-kit skill" />
                        </div>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <a href={SKILL_FILE} download="SKILL.md" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90">
                                <Download className="h-4 w-4" /> SKILL.md
                            </a>
                            <a href={ALL_IN_ONE} download="apexui-skill.md" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold backdrop-blur transition hover:bg-white/10">
                                <FileText className="h-4 w-4" /> All-in-one file
                            </a>
                        </div>
                        <p className="mt-6 text-xs text-white/50">Claude Code · Claude.ai · ChatGPT · Antigravity · Cursor · Windsurf · Copilot · Codex · Gemini CLI</p>
                    </div>
                </div>
            </section>

            {/* The two skills */}
            <section id="skills" className="scroll-mt-24 px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(3rem,6vw,5rem)]">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ink-3)]">The skills</p>
                <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Pick what you are building</h2>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <article className="relative flex flex-col overflow-hidden rounded-[1.6rem] border border-[var(--lime-line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)]">
                        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--lime)] opacity-[0.1] blur-3xl" />
                        <div className="relative flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--lime)] text-[var(--lime-ink)]">
                                <Sparkles className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-display text-xl font-semibold text-[var(--ink)]">ApexUI Skill</h3>
                                <p className="text-sm text-[var(--ink-3)]">Websites and mobile web apps · Free</p>
                            </div>
                        </div>
                        <p className="relative mt-4 text-[var(--ink-2)]">Plans the page, picks the right components, applies a real design system, builds mobile first and runs a security and quality checklist before it hands the work back.</p>
                        <ul className="relative mt-5 grid gap-2 text-sm text-[var(--ink)] sm:grid-cols-2">
                            {['Landing pages and full sites', 'Mobile-first app screens and PWAs', 'Dashboards and auth screens', 'Light and dark themes', 'Accessible and fast', 'Security checklist built in'].map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 shrink-0 text-[var(--lime)]" /> {f}
                                </li>
                            ))}
                        </ul>
                        <div className="relative mt-auto pt-6">
                            <CommandLine command="npx apex-ui-kit skill" />
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)]">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--panel-2)] text-[var(--ink)]">
                                    <Server className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-display text-xl font-semibold text-[var(--ink)]">ApexUI Fullstack</h3>
                                    <p className="text-sm text-[var(--ink-3)]">React + Node + Express + MongoDB · JWT</p>
                                </div>
                            </div>
                            <ProBadge />
                        </div>
                        <p className="mt-4 text-[var(--ink-2)]">The agent builds the whole app, front end to database, the way a senior engineer would ship it to production, then walks you through adding your MongoDB URI and secrets.</p>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                                    <ShieldCheck className="h-4 w-4 text-[var(--lime)]" /> Secure
                                </p>
                                <ul className="space-y-1.5 text-sm text-[var(--ink-2)]">
                                    {PRO_SECURE.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                                    <Gauge className="h-4 w-4 text-[var(--lime)]" /> Fast and ready to run
                                </p>
                                <ul className="space-y-1.5 text-sm text-[var(--ink-2)]">
                                    {PRO_FAST.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-auto pt-6">
                            <button type="button" disabled className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] text-sm font-semibold text-[var(--ink-3)]">
                                <Lock className="h-4 w-4" /> Pro, coming soon
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            {/* Install per agent */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ink-3)]">Install</p>
                <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Works with your agent</h2>
                <div className="mt-6 flex flex-wrap gap-1.5">
                    {AGENTS.map((x) => (
                        <button key={x.id} type="button" onClick={() => setAgent(x.id)} aria-pressed={agent === x.id} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${agent === x.id ? 'text-[var(--lime-ink)]' : 'border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]'}`}>
                            {agent === x.id && <motion.span layoutId="skill-agent" className="absolute inset-0 rounded-full bg-[var(--lime)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                            <span className="relative">{x.name}</span>
                        </button>
                    ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="mt-5 grid gap-5 rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[1fr_1fr]">
                        <ol className="space-y-3">
                            {a.steps.map((s, i) => (
                                <li key={s} className="flex gap-3 text-[var(--ink-2)]">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--lime-soft)] font-mono text-xs font-semibold text-[var(--lime)]">{i + 1}</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ol>
                        <div className="min-w-0 space-y-3">
                            {a.cmd ? (
                                <>
                                    <CommandLine command={a.cmd} />
                                    <p className="text-sm text-[var(--ink-3)]">
                                        Writes <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[0.78rem] text-[var(--ink)]">{a.where}</code>. Install for every agent at once with <code className="font-mono text-[0.78rem] text-[var(--ink)]">--ai all</code>.
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    <a href={ALL_IN_ONE} download="apexui-skill.md" className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                                        <FileText className="h-4 w-4" /> All-in-one file
                                    </a>
                                    <a href={SKILL_FILE} download="SKILL.md" className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--lime-line)]">
                                        <Download className="h-4 w-4" /> SKILL.md
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* What's inside */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ink-3)]">What is inside</p>
                <h2 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Everything a senior designer would tell the agent</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {INSIDE.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="rounded-[1.3rem] border border-[var(--line)] bg-[var(--panel)] p-5">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--lime-soft)] text-[var(--lime)]">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-4 font-semibold text-[var(--ink)]">{title}</h3>
                            <p className="mt-1.5 text-sm text-[var(--ink-2)]">{body}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <button type="button" onClick={() => setShowMd((v) => !v)} aria-expanded={showMd} className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--lime-line)]">
                        <FileText className="h-4 w-4" /> {showMd ? 'Hide' : 'Read'} SKILL.md
                    </button>
                    <AnimatePresence initial={false}>
                        {showMd && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="mt-4">
                                <CodeBlock code={skillMd} language="text" title="skills/apexui/SKILL.md" className="[&_.thin-scroll]:max-h-[32rem] [&_.thin-scroll]:overflow-y-auto" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Pro: env guide preview */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--lime-line)] bg-[var(--panel)] p-[clamp(1.5rem,4vw,3.5rem)]">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--lime)] opacity-[0.12] blur-3xl" />
                    <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <div>
                            <ProBadge />
                            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">From empty folder to a secure full-stack app</h2>
                            <p className="mt-3 max-w-lg text-[var(--ink-2)]">When the build is done, the Fullstack skill hands you a plain guide: where to get your MongoDB connection string, how to make strong JWT secrets, and where to put them on your computer and your host.</p>
                            <ul className="mt-6 space-y-3 text-[var(--ink)]">
                                {[
                                    [Database, 'MongoDB Atlas setup, least-privilege user, network access'],
                                    [KeyRound, 'Random JWT and cookie secrets, one per variable'],
                                    [ShieldCheck, 'The app refuses to start if a secret is missing or weak'],
                                ].map(([Icon, t]) => (
                                    <li key={t} className="flex items-center gap-3">
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--lime-soft)] text-[var(--lime)]">
                                            <Icon className="h-3.5 w-3.5" />
                                        </span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://github.com/Mohan-Kumar-Dalei/ApexUI" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--lime)] px-6 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                                <Github className="h-4 w-4" /> Star on GitHub to hear first
                            </a>
                        </div>
                        <div className="min-w-0">
                            <CodeBlock code={ENV_PREVIEW} language="bash" title="Preview: the guide you get" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-[clamp(1rem,2.2vw,2rem)] py-[clamp(4rem,8vw,7rem)]">
                <h2 className="font-display mb-8 text-center text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Questions</h2>
                <FaqAccordion items={FAQ} accentColor="#a3e635" theme={theme === 'light' ? 'light' : 'dark'} />
                <p className="mt-8 text-center text-sm text-[var(--ink-3)]">
                    Prefer to build by hand? <Link to="/components" className="font-medium text-[var(--ink)] underline-offset-4 hover:underline">Browse all components <ArrowUpRight className="inline h-3.5 w-3.5" /></Link>
                </p>
            </section>
            <SiteFooter />
        </div>
    );
}
