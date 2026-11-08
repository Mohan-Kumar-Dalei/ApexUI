import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SiteFooter from '../layout/SiteFooter.jsx';
import { CommandLine } from '../ui/CodeBlock.jsx';
import { DEMOS } from '../demos/index.js';

/* Gallery of full sites built with the ApexUI skill. */
export default function DemosPage() {
    return (
        <div className="mx-auto w-full max-w-[100rem]">
            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(2.5rem,6vw,5rem)]">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-8">
                        <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.03em] text-[var(--ink)]">Built with the skill</h1>
                        <p className="mt-5 max-w-xl text-[1.02rem] text-[var(--ink-2)]">
                            Five complete sites made by following the ApexUI skill. Each has its own layout, page loader, skeleton state and motion, so no two feel alike. Open one on your phone too.
                        </p>
                    </div>
                    <div className="lg:col-span-4">
                        <CommandLine command="npx apex-ui-kit skill" />
                    </div>
                </div>
            </section>

            <section className="px-[clamp(1rem,2.2vw,2rem)] pt-[clamp(2.5rem,5vw,4rem)]">
                <ul className="grid gap-6 md:grid-cols-2">
                    {DEMOS.map((d) => (
                        <li key={d.slug}>
                            <Link to={`/demos/${d.slug}`} className="group block">
                                <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[var(--panel-2)]">
                                    <img src={d.image} alt={`${d.name}, ${d.kind}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                                </div>
                                <div className="mt-4 flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h2 className="font-display text-[1.5rem] font-semibold text-[var(--ink)]">{d.name}</h2>
                                        <p className="mt-1 text-sm text-[var(--ink-3)]">
                                            {d.kind}, {d.direction} direction
                                        </p>
                                        <p className="mt-2 text-[0.95rem] text-[var(--ink-2)]">{d.brief}</p>
                                        <p className="mt-2 text-sm text-[var(--ink-3)]">{d.build}</p>
                                    </div>
                                    <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-3)] transition-colors group-hover:border-transparent group-hover:bg-[var(--lime)] group-hover:text-[var(--lime-ink)]">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="px-[clamp(1rem,2.2vw,2rem)] py-[clamp(4rem,8vw,6rem)]">
                <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-[clamp(1.5rem,4vw,3rem)]">
                    <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] text-[var(--ink)]">Make your own</h2>
                    <p className="mt-3 max-w-2xl text-[var(--ink-2)]">
                        Install the skill, then ask your agent for the site you need, for example "a website for my bakery in Pune, warm and simple, with a menu and opening hours". It picks a direction, writes the copy and builds every section.
                    </p>
                    <Link to="/skills" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--lime)] px-5 text-sm font-semibold text-[var(--lime-ink)] transition hover:brightness-105">
                        How to install it <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
            <SiteFooter />
        </div>
    );
}
