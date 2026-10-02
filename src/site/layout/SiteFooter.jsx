import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { SITE, componentPages } from '../config/navigation.js';

const columns = [
    {
        title: 'Documentation',
        links: [
            { label: 'Introduction', to: '/components/docs/getting-started/introduction' },
            { label: 'Installation', to: '/components/docs/getting-started/installation/react-setup' },
            { label: 'CLI', to: '/components/docs/getting-started/installation/apexui-cli' },
        ],
    },
    {
        title: 'Components',
        links: [
            { label: 'All components', to: '/components' },
            ...componentPages.filter((c) => c.badge).slice(0, 3).map((c) => ({ label: c.name, to: c.path })),
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'GitHub', href: SITE.github },
            { label: 'npm', href: SITE.npm },
            { label: 'Privacy Policy', href: SITE.privacy },
            { label: 'Terms & Conditions', href: SITE.terms },
        ],
    },
];

const socials = [
    { label: 'GitHub', href: SITE.github, icon: Github },
    { label: 'LinkedIn', href: SITE.linkedin, icon: Linkedin },
    { label: 'Instagram', href: SITE.instagram, icon: Instagram },
];

const linkClass = 'text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]';

export default function SiteFooter() {
    return (
        <footer className="border-t border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
                    <div className="space-y-4">
                        <Logo />
                        <p className="max-w-xs text-sm leading-6 text-[var(--fg-muted)]">
                            Animated, copy-paste React components built with Tailwind CSS, GSAP and Framer Motion.
                        </p>
                        <div className="flex gap-1">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--fg-subtle)] transition hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="mb-3 text-sm font-medium text-[var(--fg)]">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        {l.to ? (
                                            <Link to={l.to} className={linkClass}>{l.label}</Link>
                                        ) : (
                                            <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{l.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} ApexUI. MIT Licensed.</span>
                    <span>Made with care by Mohan Kumar Dalei</span>
                </div>
            </div>
        </footer>
    );
}
