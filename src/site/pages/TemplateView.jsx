import { lazy, Suspense, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Code2, Download, Lock } from 'lucide-react';
import PageLoader from '../layout/PageLoader.jsx';
import { TEMPLATES } from '../templates/index.js';
import { ProBadge } from './TemplatesPage.jsx';

// One lazy component per template, created once.
const views = new Map();
const viewFor = (t) => {
    if (!views.has(t.slug)) views.set(t.slug, lazy(t.load));
    return views.get(t.slug);
};

export default function TemplateView() {
    const { slug } = useParams();
    const template = TEMPLATES.find((t) => t.slug === slug);
    const View = useMemo(() => template && viewFor(template), [template]);
    const [note, setNote] = useState(false);
    if (!template) return <Navigate to="/templates" replace />;

    const locked = (label, Icon) => (
        <button
            type="button"
            onClick={() => setNote(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--line)] px-3.5 text-xs font-semibold text-[var(--ink-2)] transition hover:border-[var(--lime-line)] hover:text-[var(--ink)]"
            title="ApexUI Pro, coming soon"
        >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
            <Lock className="h-3 w-3 opacity-60" />
        </button>
    );

    return (
        <div className="w-full">
            <div className="sticky top-16 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-[100rem] items-center gap-3 px-[clamp(1rem,2.2vw,2rem)]">
                    <Link to="/templates" className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-2)] hover:text-[var(--ink)]">
                        <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Templates</span>
                    </Link>
                    <span className="h-5 w-px bg-[var(--line)]" />
                    <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: template.accent }} />
                        <span className="truncate text-sm font-semibold text-[var(--ink)]">{template.name}</span>
                        <span className="hidden truncate text-xs text-[var(--ink-3)] md:inline">· {template.kind}</span>
                    </span>
                    <ProBadge className="ml-1" />
                    <div className="ml-auto flex items-center gap-2">
                        {locked('Get code', Code2)}
                        {locked('Download', Download)}
                    </div>
                </div>
                {note && (
                    <div className="border-t border-[var(--line)] bg-[var(--lime-soft)] px-4 py-2 text-center text-xs text-[var(--ink)]">
                        Template source code is part of <b>ApexUI Pro</b>, coming soon. Every component used here is free in the{' '}
                        <Link to="/components" className="underline">
                            component library
                        </Link>
                        .
                        <button type="button" onClick={() => setNote(false)} className="ml-3 text-[var(--ink-3)] hover:text-[var(--ink)]" aria-label="Dismiss">
                            ✕
                        </button>
                    </div>
                )}
            </div>
            {/* clip (not hidden) keeps 3D overflow off the page without breaking sticky sections. */}
            <div className="overflow-x-clip">
                <Suspense fallback={<PageLoader />}>
                    <View />
                </Suspense>
            </div>
        </div>
    );
}
