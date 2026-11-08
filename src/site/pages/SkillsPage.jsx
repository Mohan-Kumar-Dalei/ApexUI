import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Database, Gauge, Github, KeyRound, Languages, Layers, Lock, PenLine, Ruler, Server, ShieldCheck, Smartphone } from 'lucide-react';
import SiteFooter from '../layout/SiteFooter.jsx';
import { CommandLine } from '../ui/CodeBlock.jsx';
import FaqAccordion from '../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import SpotlightGrid from '../../components/MainUI/ApexUI-Kit/SpotlightGrid/SpotlightGrid.jsx';
import StarBorder from '../../components/MainUI/ApexUI-Kit/StarBorder/StarBorder.jsx';
import useSiteTheme from '../ui/useSiteTheme.js';
import { DEMOS } from '../demos/index.js';

const ProBadge = ({ className = '' }) => (
    <span className={`inline-flex items-center gap-1 rounded-full border border-[var(--lime-line)] bg-[var(--lime-soft)] px-2 py-0.5 text-[0.7rem] font-semibold text-[var(--lime)] ${className}`}>
        <Lock className="h-3 w-3" /> Pro
    </span>
);

// How to install for each agent. Every option is one npm command.
const AGENTS = [
    { id: 'claude', name: 'Claude Code', cmd: 'npx apex-ui-kit skill --ai claude', where: '.claude/skills/apexui/', steps: ['Run the command in your project folder.', 'Ask for a website or an app. Claude Code reads the skill on its own when the task fits.', 'Want it in every project? Copy the folder to ~/.claude/skills/apexui/.'] },
    { id: 'antigravity', name: 'Antigravity', cmd: 'npx apex-ui-kit skill --ai antigravity', where: '.agents/skills/apexui/', steps: ['Run the command in your workspace.', 'Antigravity loads it from .agents/skills/ and uses it when the request matches.', 'For all workspaces, copy the folder to ~/.gemini/config/skills/apexui/.'] },
    { id: 'cursor', name: 'Cursor', cmd: 'npx apex-ui-kit skill --ai cursor', where: '.cursor/rules/apexui.mdc', steps: ['Run the command in your project.', 'Cursor attaches the rule when it is relevant. Type @apexui to call it yourself.'] },
    { id: 'windsurf', name: 'Windsurf', cmd: 'npx apex-ui-kit skill --ai windsurf', where: '.windsurf/rules/apexui.md', steps: ['Run the command in your project.', 'Cascade applies the rule whenever you ask for UI work.'] },
    { id: 'copilot', name: 'Copilot', cmd: 'npx apex-ui-kit skill --ai copilot', where: '.github/instructions/apexui.instructions.md', steps: ['Run the command in your repository.', 'Copilot Chat and the coding agent pick the instructions up automatically.'] },
    { id: 'codex', name: 'Codex', cmd: 'npx apex-ui-kit skill --ai codex', where: 'AGENTS.md', steps: ['Run the command. It adds an ApexUI section to AGENTS.md and keeps everything you already had there.', 'Works with Codex and any other tool that reads AGENTS.md.'] },
    { id: 'gemini', name: 'Gemini CLI', cmd: 'npx apex-ui-kit skill --ai gemini', where: 'GEMINI.md', steps: ['Run the command in your project.', 'Gemini CLI reads GEMINI.md at the start of every session.'] },
    { id: 'chat', name: 'ChatGPT or Claude.ai', cmd: 'npx apex-ui-kit skill --ai codex', where: 'AGENTS.md and .apexui/skill/', steps: ['Run the command in an empty folder.', 'Open a Project in ChatGPT or Claude.ai and add AGENTS.md plus the files in .apexui/skill/references to it.', 'Ask for your site in that Project.'] },
];

const INSIDE = [
    { icon: Ruler, title: 'Taste, written down', description: 'What makes a page feel expensive, and the generic AI looks to avoid. No gradients, no glow, no template feel.' },
    { icon: Layers, title: 'Eight art directions', description: 'Complete palettes, font pairs, image styles and a signature idea each. Or the recipe to make your own.' },
    { icon: PenLine, title: 'Ready sections', description: 'Code for every part of a page, nav to footer, so even a small, fast model builds the whole thing properly.' },
    { icon: Languages, title: 'Copy that sounds human', description: 'Plain words, real details, no dashes or buzzwords. A final check that catches what slips through.' },
    { icon: Smartphone, title: 'Mobile apps too', description: 'Screen layouts, tab bars, sheets, sizes and motion for apps that feel native on a phone.' },
    { icon: ShieldCheck, title: 'Safe and responsive', description: 'Works from 320px up, keyboard friendly, and keeps secrets and unsafe HTML out of the browser.' },
];

const PRO_SECURE = ['Argon2id passwords, lockout after failed logins', 'Short-lived JWT and a rotating refresh token in httpOnly cookies', 'Helmet, a CORS allowlist and rate limits on every route', 'Protection against CSRF and NoSQL injection', 'Every record checked against its owner', 'Secrets checked when the server starts'];
const PRO_FAST = ['Indexes, lean queries and paged results', 'Compression and caching where it pays', 'Health checks and graceful restarts', 'Docker, CI with tests, backups'];

const FAQ = [
    { q: 'What is a skill?', a: 'A set of instructions and reference files that an AI agent reads before it starts. This one teaches it how to plan, design, write and build a site or an app, and what to check before it calls the work finished.' },
    { q: 'Do I have to use ApexUI components?', a: 'No. The skill works on its own with any stack. ApexUI components are there if you want an animated piece, and the skill tells the agent when one fits.' },
    { q: 'Will a small model really make a good site with it?', a: 'That is what it is written for. The rules are specific, the art directions are complete and the sections come as code, so the model follows them instead of guessing.' },
    { q: 'Is it free?', a: 'Yes. The website and app skill is free and open source. The Fullstack skill will be part of ApexUI Pro.' },
    { q: 'Does it make my site fully secure?', a: 'No tool can promise that. The skill makes the agent follow a strict checklist and tell you anything it could not check. Read the code before you put it live.' },
    { q: 'How do I update it?', a: 'Run the same command again. It replaces the skill files and only the ApexUI part of AGENTS.md or GEMINI.md.' },
];

export default function SkillsPage() {
    const theme = useSiteTheme();
    const [agent, setAgent] = useState(AGENTS[0].id);
    const a = AGENTS.find((x) => x.id === agent);

    return (
        <div className="mx-auto w-full max-w-[100rem]">
            {/* Intro */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(2.5rem,7vw,6rem)]">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-sm text-[var(--ink-3)]">A free skill for AI coding agents</p>
                    <h1 className="font-display mt-4 text-[clamp(2.5rem,6.5vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--ink)]">Your AI agent, with a designer's eye</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-[var(--ink-2)]">
                        Install it once and ask Claude, Cursor, Antigravity or Copilot for a website or an app. It picks a real art direction, writes like a person and builds every section, nav to footer, ready for phones.
                    </p>
                    <div className="mx-auto mt-9 max-w-md text-left">
                        <CommandLine command="npx apex-ui-kit skill" />
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                        <Link to="/demos" className="font-medium text-[var(--ink)] underline decoration-[var(--line)] underline-offset-8 hover:decoration-[var(--ink)]">
                            See sites built with it
                        </Link>
                        <a href="#install" className="text-[var(--ink-2)] underline decoration-[var(--line)] underline-offset-8 hover:decoration-[var(--ink)]">
                            Install for your agent
                        </a>
                    </div>
                </div>
            </section>

            {/* Demos */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(3.5rem,7vw,6rem)]">
                <div className="flex items-end justify-between gap-6">
                    <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Built with the skill</h2>
                    <Link to="/demos" className="shrink-0 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)]">
                        All demos
                    </Link>
                </div>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {DEMOS.map((d) => (
                        <li key={d.slug}>
                            <Link to={`/demos/${d.slug}`} className="group block">
                                <div className="aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[var(--panel-2)]">
                                    <img src={d.poster} alt={`${d.name}, ${d.kind}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                                </div>
                                <div className="mt-3 flex items-baseline justify-between gap-3">
                                    <span className="font-semibold text-[var(--ink)]">{d.name}</span>
                                    <span className="text-sm text-[var(--ink-3)]">{d.kind}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* The two skills */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Two skills</h2>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <article className="flex flex-col rounded-[1.4rem] border border-[var(--ink)]/80 bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)]">
                        <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">ApexUI Skill</h3>
                        <p className="mt-1 text-sm text-[var(--ink-3)]">Websites and mobile apps. Free.</p>
                        <p className="mt-4 text-[var(--ink-2)]">Plans the page, chooses a direction, writes the copy, builds every section and checks it on a phone before handing it back.</p>
                        <ul className="mt-5 grid gap-2 text-sm text-[var(--ink)] sm:grid-cols-2">
                            {['Stores, portfolios, restaurants', 'SaaS and AI product sites', 'Mobile app screens', 'Light and dark', 'Works with any stack', 'Security checklist'].map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 shrink-0 text-[var(--ink-3)]" /> {f}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto pt-7">
                            <CommandLine command="npx apex-ui-kit skill" />
                        </div>
                    </article>

                    <article className="flex flex-col rounded-[1.4rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">ApexUI Fullstack</h3>
                                <p className="mt-1 text-sm text-[var(--ink-3)]">React, Node, Express, MongoDB and JWT</p>
                            </div>
                            <ProBadge />
                        </div>
                        <p className="mt-4 text-[var(--ink-2)]">The agent builds the whole app, front end to database, the way a senior engineer would ship it. Then it shows you where to put your MongoDB address and secrets.</p>
                        <div className="mt-5 grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                                    <ShieldCheck className="h-4 w-4 text-[var(--ink-3)]" /> Security
                                </p>
                                <ul className="space-y-1.5 text-sm text-[var(--ink-2)]">
                                    {PRO_SECURE.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                                    <Gauge className="h-4 w-4 text-[var(--ink-3)]" /> Speed and running it
                                </p>
                                <ul className="space-y-1.5 text-sm text-[var(--ink-2)]">
                                    {PRO_FAST.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                                <p className="mt-4 flex items-center gap-2 text-sm text-[var(--ink-2)]">
                                    <Database className="h-4 w-4 shrink-0 text-[var(--ink-3)]" /> MongoDB Atlas setup guide
                                </p>
                                <p className="mt-1.5 flex items-center gap-2 text-sm text-[var(--ink-2)]">
                                    <KeyRound className="h-4 w-4 shrink-0 text-[var(--ink-3)]" /> How to make strong secrets
                                </p>
                            </div>
                        </div>
                        <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
                            <StarBorder as="button" disabled aria-disabled="true" color="#a3e635" speed={6} theme={theme === 'light' ? 'light' : 'dark'} className="cursor-not-allowed">
                                <span className="inline-flex items-center gap-2 text-sm">
                                    <Server className="h-4 w-4" /> Coming soon
                                </span>
                            </StarBorder>
                            <a href="https://github.com/Mohan-Kumar-Dalei/ApexUI" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)]">
                                <Github className="h-4 w-4" /> Star the repo to hear first
                            </a>
                        </div>
                    </article>
                </div>
            </section>

            {/* Style skills, called by name */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Three styles, when you ask for them</h2>
                <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
                    They only run when you call them, so they never get mixed up with the main skill. In Claude Code each one is a slash command; in Cursor type <code className="font-mono text-[0.85em] text-[var(--ink)]">@simplepremium</code>.
                </p>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    {[
                        ['/simplepremium', 'Calm product UI', 'Apps, dashboards, admin panels and internal tools. Light neutrals, one blue accent, one sans font, motion only on dialogs and menus. No hero, no scroll animations.', '/simplepremium leave tracker dashboard', 'npx apex-ui-kit skill simplepremium'],
                        ['/luxurypremium', 'Luxury websites', 'Fashion, hotels, jewellery, restaurants. Ivory and charcoal, a serif display face, generous space, big type and slow, considered motion.', '/luxurypremium website for a boutique hotel in Udaipur', 'npx apex-ui-kit skill luxurypremium'],
                        ['/premiumbrand', 'Brand stores with 3D', 'A full store for any label: photo hero with a glass nav, a 3D product rail, styled looks with bundle pricing and a Node, Express and MongoDB backend. Ships with README, prompts and screenshots. See the Taana demo.', '/premiumbrand a store for my handmade leather bags', 'npx apex-ui-kit skill premiumbrand'],
                    ].map(([cmd, title, body, example, install]) => (
                        <article key={cmd} className="flex flex-col rounded-[1.4rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)]">
                            <p className="font-mono text-sm text-[var(--ink-3)]">{cmd}</p>
                            <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]">{title}</h3>
                            <p className="mt-3 text-[var(--ink-2)]">{body}</p>
                            <p className="mt-5 text-sm text-[var(--ink-3)]">Type in Claude Code</p>
                            <p className="mt-1.5 break-words rounded-lg bg-[var(--panel-2)] px-3 py-2 font-mono text-[0.82rem] text-[var(--ink)]">{example}</p>
                            <div className="mt-auto pt-6">
                                <CommandLine command={install} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Install per agent */}
            <section id="install" className="scroll-mt-24 px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Install it for your agent</h2>
                <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
                    One command. Run <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--ink)]">npx apex-ui-kit skill</code> to pick from a list, or add <code className="font-mono text-[0.85em] text-[var(--ink)]">--ai all</code> to set up every agent at once.
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                    {AGENTS.map((x) => (
                        <button key={x.id} type="button" onClick={() => setAgent(x.id)} aria-pressed={agent === x.id} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${agent === x.id ? 'text-[var(--lime-ink)]' : 'border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]'}`}>
                            {agent === x.id && <motion.span layoutId="skill-agent" className="absolute inset-0 rounded-full bg-[var(--lime)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                            <span className="relative">{x.name}</span>
                        </button>
                    ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="mt-5 grid gap-6 rounded-[1.4rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-2">
                        <ol className="space-y-3">
                            {a.steps.map((s, i) => (
                                <li key={s} className="flex gap-3 text-[var(--ink-2)]">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--ink)]">{i + 1}</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ol>
                        <div className="min-w-0 space-y-3">
                            <CommandLine command={a.cmd} />
                            <p className="text-sm text-[var(--ink-3)]">
                                Writes <code className="break-all rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[0.78rem] text-[var(--ink)]">{a.where}</code>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* What is inside */}
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(4rem,8vw,6rem)]">
                <h2 className="font-display max-w-3xl text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">What the agent learns</h2>
                <SpotlightGrid items={INSIDE} color="#a3e635" theme={theme === 'light' ? 'light' : 'dark'} minCardWidth={26} className="mt-8" />
            </section>

            <section className="mx-auto max-w-3xl px-[clamp(1rem,2.2vw,2rem)] py-[clamp(4rem,8vw,7rem)]">
                <h2 className="font-display mb-8 text-center text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Questions</h2>
                <FaqAccordion items={FAQ} accentColor="#a3e635" theme={theme === 'light' ? 'light' : 'dark'} />
                <p className="mt-8 text-center text-sm text-[var(--ink-3)]">
                    Prefer to build by hand?{' '}
                    <Link to="/components" className="font-medium text-[var(--ink)] underline-offset-4 hover:underline">
                        Browse all components <ArrowUpRight className="inline h-3.5 w-3.5" />
                    </Link>
                </p>
            </section>
            <SiteFooter />
        </div>
    );
}
