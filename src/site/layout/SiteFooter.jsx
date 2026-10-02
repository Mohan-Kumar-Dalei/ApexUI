import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { LogoMark } from '../ui/Logo.jsx';
import { SITE, componentPages } from '../config/navigation.js';
import { openFeedback } from './overlays.js';
import { PAD_X } from '../docs/style.js';

const columns = [
    {
        title: 'Docs',
        links: [
            { label: 'Introduction', to: '/components/docs/getting-started/introduction' },
            { label: 'React + Vite', to: '/components/docs/getting-started/installation/react-setup' },
            { label: 'Tailwind', to: '/components/docs/getting-started/installation/tailwind-setup' },
            { label: 'CLI', to: '/components/docs/getting-started/installation/apexui-cli' },
        ],
    },
    {
        title: 'Library',
        links: [
            { label: `All ${componentPages.length} components`, to: '/components' },
            ...componentPages.filter((c) => c.badge).map((c) => ({ label: c.name, to: c.path })),
        ],
    },
    {
        title: 'Project',
        links: [
            { label: 'GitHub', href: SITE.github },
            { label: 'npm', href: SITE.npm },
            { label: 'Send feedback', action: openFeedback },
            { label: 'Privacy', href: SITE.privacy },
            { label: 'Terms', href: SITE.terms },
        ],
    },
];

const socials = [
    { label: 'GitHub', href: SITE.github, icon: Github },
    { label: 'LinkedIn', href: SITE.linkedin, icon: Linkedin },
    { label: 'Instagram', href: SITE.instagram, icon: Instagram },
];

const linkClass = 'text-[0.9rem] text-[var(--ink-2)] transition-colors hover:text-[var(--lime-text)]';

export default function SiteFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-[var(--line)]">
            <div className={`${PAD_X} grid gap-12 pb-10 pt-16 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]`}>
                <div className="space-y-5">
                    <div className="flex items-center gap-3">
                        <LogoMark className="h-12 w-12" />
                        <div>
                            <p className="font-display text-xl font-semibold text-[var(--ink)]">Apex<span className="text-[var(--lime-text)]">UI</span></p>
                            <p className="font-mono text-[0.7rem] text-[var(--ink-3)]">{SITE.version} · MIT</p>
                        </div>
                    </div>
                    <p className="max-w-xs text-[0.92rem] leading-relaxed text-[var(--ink-2)]">
                        Animated, copy-paste React components built with Tailwind CSS, GSAP and Framer Motion.
                    </p>
                    <div className="flex gap-1.5">
                        {socials.map(({ label, href, icon: Icon }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-3)] transition hover:border-[var(--lime-line)] hover:text-[var(--lime-text)]">
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
                {columns.map((col) => (
                    <div key={col.title}>
                        <h4 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">{col.title}</h4>
                        <ul className="space-y-2.5">
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    {l.to ? (
                                        <Link to={l.to} className={linkClass}>{l.label}</Link>
                                    ) : l.action ? (
                                        <button type="button" onClick={l.action} className={linkClass}>{l.label}</button>
                                    ) : (
                                        <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{l.label}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* Wordmark stretched to the full footer width; a soft fill instead of a text stroke,
                which drew the overlapping contours of the variable font. */}
            <div aria-hidden="true" className={`${PAD_X} pointer-events-none select-none overflow-hidden pt-4`}>
                <svg viewBox="0 0 1200 250" className="block h-auto w-full" preserveAspectRatio="xMidYMax meet">
                    <defs>
                        <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" style={{ stopColor: 'var(--ink)', stopOpacity: 0.16 }} />
                            <stop offset="0.75" style={{ stopColor: 'var(--ink)', stopOpacity: 0.04 }} />
                            <stop offset="1" style={{ stopColor: 'var(--ink)', stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    <text
                        x="0"
                        y="232"
                        textLength="1200"
                        lengthAdjust="spacingAndGlyphs"
                        fill="url(#footer-wordmark)"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 300, letterSpacing: '-0.04em' }}
                    >
                        ApexUI
                    </text>
                </svg>
            </div>
            <div className={`${PAD_X} flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] py-5 font-mono text-[0.7rem] text-[var(--ink-3)]`}>
                <span>© {new Date().getFullYear()} ApexUI. All rights reserved.</span>
                <span>Made with care by Mohan Kumar Dalei</span>
            </div>
        </footer>
    );
}
