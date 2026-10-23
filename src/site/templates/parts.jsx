/* Small building blocks shared by the template pages (header, section shell, photos). */

export function TemplateHeader({ brand, links = ['Product', 'Pricing', 'Docs'], cta = 'Get started', dark = true, accent = '#a3e635' }) {
    return (
        <header className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[clamp(1rem,4vw,3rem)] py-5 ${dark ? 'text-white' : 'text-neutral-900'}`}>
            <span className="flex items-center gap-2 text-lg font-black tracking-tight">
                <span className="grid h-8 w-8 place-items-center rounded-xl text-sm text-black" style={{ background: accent }}>
                    {brand[0]}
                </span>
                {brand}
            </span>
            <nav className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 text-sm backdrop-blur md:flex ${dark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white/60'}`}>
                {links.map((l) => (
                    <span key={l} className={`rounded-full px-3 py-1 ${dark ? 'text-white/75' : 'text-neutral-600'}`}>
                        {l}
                    </span>
                ))}
            </nav>
            <span className="rounded-full px-4 py-2 text-sm font-semibold text-black" style={{ background: accent }}>
                {cta}
            </span>
        </header>
    );
}

export function Section({ eyebrow, title, text, children, dark = true, className = '' }) {
    return (
        <section className={`px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,9vw,7rem)] ${className}`}>
            {(eyebrow || title) && (
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    {eyebrow && <p className={`font-mono text-[0.7rem] uppercase tracking-[0.3em] ${dark ? 'text-white/50' : 'text-neutral-500'}`}>{eyebrow}</p>}
                    {title && <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">{title}</h2>}
                    {text && <p className={`mt-4 text-[0.98rem] ${dark ? 'text-white/65' : 'text-neutral-600'}`}>{text}</p>}
                </div>
            )}
            {children}
        </section>
    );
}

export function Footer({ brand, note }) {
    return (
        <footer className="border-t border-white/10 px-[clamp(1rem,4vw,3rem)] py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-white/45 sm:flex-row">
                <span className="font-semibold text-white/70">{brand}</span>
                <span>{note}</span>
            </div>
        </footer>
    );
}
