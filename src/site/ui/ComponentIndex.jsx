import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { prefetch } from '../config/navigation.js';

/* Grid tile: screenshot, catalogue number, name, category. */
export function ComponentTile({ item, index = 0 }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.03, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                to={item.path}
                onMouseEnter={() => prefetch(item)}
                onFocus={() => prefetch(item)}
                className="group block rounded-[1.1rem] border border-[var(--line)] bg-[var(--panel)] p-2 transition duration-300 hover:-translate-y-1 hover:border-[var(--lime-line)] hover:shadow-[var(--shadow)]"
            >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[0.8rem] bg-[var(--stage)]">
                    <img
                        src={item.image}
                        alt={`${item.name} preview`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[0.65rem] text-white/80 backdrop-blur">No. {item.num}</span>
                    {item.badge && <span className="absolute right-2.5 top-2.5 rounded-full bg-[var(--lime)] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--lime-ink)]">New</span>}
                    <span className="absolute bottom-2.5 right-2.5 inline-flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--lime-ink)] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>
                <div className="px-2 pb-1.5 pt-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display truncate text-[1.12rem] font-semibold text-[var(--ink)]">{item.name}</h3>
                        <span className="shrink-0 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">{item.category}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[0.86rem] leading-relaxed text-[var(--ink-2)]">{item.summary}</p>
                </div>
            </Link>
        </motion.div>
    );
}

export function ComponentGrid({ items }) {
    return (
        <motion.div layout className="grid gap-[clamp(0.75rem,1.2vw,1.5rem)] [grid-template-columns:repeat(auto-fill,minmax(min(100%,19rem),1fr))]">
            <AnimatePresence mode="popLayout">
                {items.map((item, i) => <ComponentTile key={item.path} item={item} index={i} />)}
            </AnimatePresence>
        </motion.div>
    );
}

/*
 * Editorial list: big typographic rows. On pointer devices a preview image
 * follows the cursor while hovering a row.
 */
export function ComponentList({ items }) {
    const [hovered, setHovered] = useState(null);
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
    };

    return (
        <div ref={ref} className="relative" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
            <ul className="border-t border-[var(--line)]">
                {items.map((item) => (
                    <li key={item.path} className="border-b border-[var(--line)]">
                        <Link
                            to={item.path}
                            onMouseEnter={() => {
                                setHovered(item);
                                prefetch(item);
                            }}
                            className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 py-[clamp(0.9rem,1.4vw,1.5rem)] transition-colors md:grid-cols-[4rem_minmax(0,1fr)_12rem_3rem]"
                        >
                            <span className="font-mono text-[0.78rem] text-[var(--ink-3)] transition-colors group-hover:text-[var(--lime-text)]">{item.num}</span>
                            <span className="flex min-w-0 items-center gap-3">
                                <span className="font-display truncate text-[clamp(1.4rem,2.6vw,2.7rem)] font-semibold leading-none text-[var(--ink)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
                                    {item.name}
                                </span>
                                {item.badge && <span className="shrink-0 rounded-full bg-[var(--lime)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--lime-ink)]">New</span>}
                            </span>
                            <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--ink-3)] md:block">{item.category}</span>
                            <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-[var(--line)] text-[var(--ink-3)] transition-all duration-300 group-hover:border-[var(--lime)] group-hover:bg-[var(--lime)] group-hover:text-[var(--lime-ink)]">
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        key="preview"
                        className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[clamp(14rem,20vw,22rem)] md:block"
                        style={{ x: sx, y: sy }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="-translate-y-1/2 translate-x-8 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--stage)] shadow-2xl">
                            <img src={hovered.image} alt="" className="aspect-[4/3] w-full object-cover" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
