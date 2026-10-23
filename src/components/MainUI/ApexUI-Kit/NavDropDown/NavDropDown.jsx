import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];
const CLOSE_DELAY = 140;

/* "services": two columns of feature tiles with a monogram (or a custom icon). */
const Services = ({ items }) => (
    <ul className="grid w-[min(34rem,calc(100vw-2rem))] grid-cols-1 gap-1 p-2 sm:grid-cols-2">
        {items.map((sub, i) => (
            <li key={i}>
                <a href={sub.href} className="group flex items-start gap-3 rounded-xl p-3 outline-none transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.07]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-lime-400/20 bg-lime-400/10 text-sm font-semibold text-lime-300 transition-colors group-hover:border-lime-400/40 group-hover:bg-lime-400/15">
                        {sub.icon ? <sub.icon size={16} /> : sub.label.charAt(0)}
                    </span>
                    <span className="min-w-0">
                        <span className="flex items-center gap-1 text-sm font-medium text-zinc-100">
                            {sub.label}
                            <ArrowRight size={13} className="-translate-x-1 text-lime-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        {sub.subtitle && <span className="mt-0.5 block text-[0.8rem] leading-snug text-zinc-500">{sub.subtitle}</span>}
                    </span>
                </a>
            </li>
        ))}
    </ul>
);

/* "products": image cards, four across on wide screens. */
const Products = ({ items }) => (
    <ul className="grid w-[min(40rem,calc(100vw-2rem))] grid-cols-2 gap-2 p-2 sm:grid-cols-4">
        {items.map((sub, i) => (
            <li key={i}>
                <a href={sub.href} className="group block rounded-xl p-1.5 outline-none transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.07]">
                    <span className="block aspect-[4/3] overflow-hidden sm:aspect-square rounded-lg bg-zinc-900 ring-1 ring-white/10">
                        <img src={sub.image} alt="" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="mt-2 block truncate px-0.5 text-sm font-medium text-zinc-100">{sub.label}</span>
                    {sub.subtitle && <span className="block truncate px-0.5 text-xs text-zinc-500">{sub.subtitle}</span>}
                </a>
            </li>
        ))}
    </ul>
);

/* "links": a titled list; switches to two columns when it gets long. */
const Links = ({ title, items }) => {
    const wide = items.length > 5;
    return (
        <div className={`p-2 ${wide ? 'w-[min(26rem,calc(100vw-2rem))]' : 'w-[min(15rem,calc(100vw-2rem))]'}`}>
            <p className="px-3 pb-1 pt-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-zinc-500">{title}</p>
            <ul className={wide ? 'grid grid-cols-2' : ''}>
                {items.map((sub, i) => (
                    <li key={i}>
                        <a href={sub.href} className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 outline-none transition-colors hover:bg-white/[0.05] hover:text-zinc-100 focus-visible:bg-white/[0.07] focus-visible:text-zinc-100">
                            {sub.label}
                            <ArrowUpRight size={14} className="text-lime-300 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PanelContent = ({ item }) => {
    if (item.type === 'products') return <Products items={item.submenu} />;
    if (item.type === 'links') return <Links title={item.label} items={item.submenu} />;
    return <Services items={item.submenu} />;
};

/*
 * Phones: a Menu button opens one full-width sheet; each section expands in
 * place (accordion) instead of a hover panel that would not fit.
 */
const MobileNav = ({ navData }) => {
    const [open, setOpen] = useState(false);
    const [section, setSection] = useState(null);
    const root = useRef(null);
    useEffect(() => {
        if (!open) return undefined;
        const down = (e) => !root.current?.contains(e.target) && setOpen(false);
        const key = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('pointerdown', down);
        window.addEventListener('keydown', key);
        return () => {
            window.removeEventListener('pointerdown', down);
            window.removeEventListener('keydown', key);
        };
    }, [open]);
    return (
        <div ref={root} className="relative w-full max-w-sm">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-full border border-white/10 bg-zinc-950/85 px-5 py-3 text-sm font-medium text-zinc-200 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)] outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-lime-400/60"
            >
                Menu
                {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.nav
                        aria-label="Main"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.22, ease }}
                        className="absolute left-0 right-0 top-full z-10 mt-2 max-h-[70vh] origin-top overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                    >
                        {navData.map((item, i) => {
                            const hasMenu = Boolean(item.submenu?.length);
                            const isOpen = section === i;
                            if (!hasMenu) {
                                return (
                                    <a key={i} href={item.href || '#'} className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-200 outline-none hover:bg-white/[0.05] focus-visible:bg-white/[0.07]">
                                        {item.label}
                                    </a>
                                );
                            }
                            return (
                                <div key={i}>
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => setSection(isOpen ? null : i)}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium outline-none hover:bg-white/[0.05] focus-visible:bg-white/[0.07] ${isOpen ? 'text-lime-300' : 'text-zinc-200'}`}
                                    >
                                        {item.label}
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.ul
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease }}
                                                className="overflow-hidden pl-2"
                                            >
                                                {item.submenu.map((sub, j) => (
                                                    <li key={j}>
                                                        <a href={sub.href} className="flex items-center gap-3 rounded-lg px-3 py-2 outline-none hover:bg-white/[0.05] focus-visible:bg-white/[0.07]">
                                                            {sub.image ? (
                                                                <img src={sub.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover ring-1 ring-white/10" />
                                                            ) : (
                                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-lime-400/20 bg-lime-400/10 text-xs font-semibold text-lime-300">
                                                                    {sub.icon ? <sub.icon size={14} /> : sub.label.charAt(0)}
                                                                </span>
                                                            )}
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm text-zinc-100">{sub.label}</span>
                                                                {sub.subtitle && <span className="block truncate text-xs text-zinc-500">{sub.subtitle}</span>}
                                                            </span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
};

// Below this much room the desktop bar would not fit, so the phone menu shows.
const COMPACT_BELOW = 640;

const NavDropDown = ({ navData = [], className = '' }) => {
    const hostRef = useRef(null);
    const [compact, setCompact] = useState(false);
    useLayoutEffect(() => {
        const host = hostRef.current?.parentElement;
        if (!host) return undefined;
        const check = () => setCompact(host.clientWidth < COMPACT_BELOW);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(host);
        return () => ro.disconnect();
    }, []);
    return (
        <div ref={hostRef} className={`flex w-full justify-center ${className}`}>
            {compact ? <MobileNav navData={navData} /> : <DesktopNav navData={navData} />}
        </div>
    );
};

const DesktopNav = ({ navData = [], className = '' }) => {
    const uid = useId();
    const rootRef = useRef(null);
    const barRef = useRef(null);
    const triggerRefs = useRef([]);
    const contentRef = useRef(null);
    const closeTimer = useRef(0);
    const pointerType = useRef('');

    const [open, setOpen] = useState(null);
    const [hovered, setHovered] = useState(null);
    // +1 / -1: which side the next panel's content slides in from.
    const [dir, setDir] = useState(0);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [caretX, setCaretX] = useState(0);

    const show = useCallback((index) => {
        clearTimeout(closeTimer.current);
        setOpen((prev) => {
            if (prev !== null && prev !== index) setDir(index > prev ? 1 : -1);
            else if (prev === null) setDir(0);
            return index;
        });
    }, []);

    const hide = useCallback(() => {
        clearTimeout(closeTimer.current);
        setOpen(null);
    }, []);

    // A short delay lets the pointer travel from a trigger into the panel.
    const hideSoon = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(hide, CLOSE_DELAY);
    };

    // Size the panel to its content and point the caret at the open trigger.
    const measure = useCallback(() => {
        const content = contentRef.current;
        const bar = barRef.current;
        const trigger = triggerRefs.current[open];
        if (!content || !bar || !trigger) return;
        const w = content.offsetWidth;
        setSize({ w, h: content.offsetHeight });
        const barBox = bar.getBoundingClientRect();
        const t = trigger.getBoundingClientRect();
        const panelLeft = (barBox.width - w) / 2;
        setCaretX(Math.min(Math.max(t.left - barBox.left + t.width / 2 - panelLeft, 20), w - 20));
    }, [open]);

    useLayoutEffect(() => {
        if (open !== null) measure();
    }, [open, measure]);

    useEffect(() => {
        if (open === null) return undefined;
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            triggerRefs.current[open]?.focus();
            hide();
        };
        const onPointer = (e) => {
            if (!rootRef.current?.contains(e.target)) hide();
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('pointerdown', onPointer);
        window.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('pointerdown', onPointer);
            window.removeEventListener('resize', measure);
        };
    }, [open, hide, measure]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    // Warm the cache for submenu images so a panel never opens with empty tiles.
    useEffect(() => {
        const id = setTimeout(() => {
            navData.forEach((item) => item.submenu?.forEach((sub) => {
                if (sub.image) new Image().src = sub.image;
            }));
        }, 300);
        return () => clearTimeout(id);
    }, [navData]);

    const onTriggerKey = (e, index) => {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        show(index);
        // Wait for the panel to render, then move focus into it.
        requestAnimationFrame(() => contentRef.current?.querySelector('a')?.focus());
    };

    const active = open !== null ? navData[open] : null;
    const panelId = `${uid}-panel`;

    return (
        <MotionConfig reducedMotion="user">
            <div
                ref={rootRef}
                className={`relative inline-block max-w-full ${className}`}
                style={{ zIndex: 4000 }}
                onPointerLeave={(e) => e.pointerType === 'mouse' && hideSoon()}
                onPointerEnter={() => clearTimeout(closeTimer.current)}
                onBlur={(e) => !rootRef.current?.contains(e.relatedTarget) && hide()}
            >
                <nav aria-label="Main" ref={barRef} className="max-w-full overflow-x-auto rounded-full border border-white/10 bg-zinc-950/85 p-1 [scrollbar-width:none] sm:p-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                    <LayoutGroup id={uid}>
                        <ul className="flex items-center gap-0.5" onPointerLeave={() => setHovered(null)}>
                            {navData.map((item, index) => {
                                const hasMenu = Boolean(item.submenu?.length);
                                const isOpen = open === index;
                                const lit = hovered === index || (hovered === null && isOpen);
                                const base = `relative flex items-center gap-0.5 whitespace-nowrap rounded-full px-2 py-1.5 text-[0.78rem] font-medium sm:gap-1 sm:px-3.5 sm:py-2 sm:text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lime-400/60 ${isOpen ? 'text-lime-300' : 'text-zinc-300 hover:text-white'}`;
                                const highlight = lit && (
                                    <motion.span layoutId="hover" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                                );
                                return (
                                    <li key={index} className="relative isolate" onPointerEnter={() => setHovered(index)}>
                                        {hasMenu ? (
                                            <button
                                                type="button"
                                                ref={(el) => (triggerRefs.current[index] = el)}
                                                className={base}
                                                aria-expanded={isOpen}
                                                aria-controls={isOpen ? panelId : undefined}
                                                onPointerEnter={(e) => e.pointerType === 'mouse' && show(index)}
                                                onPointerDown={(e) => (pointerType.current = e.pointerType)}
                                                onClick={() => {
                                                    // Hover already opened it for a mouse; touch and keyboard toggle.
                                                    if (pointerType.current === 'mouse' || !isOpen) show(index);
                                                    else hide();
                                                    pointerType.current = '';
                                                }}
                                                onKeyDown={(e) => onTriggerKey(e, index)}
                                            >
                                                {highlight}
                                                {item.label}
                                                <ChevronDown size={15} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        ) : (
                                            <a href={item.href || '#'} className={base} onPointerEnter={(e) => e.pointerType === 'mouse' && hideSoon()}>
                                                {highlight}
                                                {item.label}
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </LayoutGroup>
                </nav>

                {/* One shared panel that resizes and slides its content as you move between menus. */}
                <div className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 justify-center pt-3">
                    <AnimatePresence>
                        {active && (
                            <motion.div
                                id={panelId}
                                className="pointer-events-auto relative origin-top"
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
                                transition={{ duration: 0.25, ease }}
                            >
                                <motion.span
                                    aria-hidden
                                    className="absolute -top-[5px] z-10 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-white/10 bg-zinc-950"
                                    initial={false}
                                    animate={{ left: caretX }}
                                    transition={{ duration: 0.3, ease }}
                                />
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                                    initial={false}
                                    animate={{ width: size.w || 'auto', height: size.h || 'auto' }}
                                    transition={{ duration: 0.3, ease }}
                                >
                                    <span aria-hidden className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
                                    <AnimatePresence initial={false} custom={dir}>
                                        <motion.div
                                            key={open}
                                            // The leaving copy unmounts later; ignore its null so the ref keeps the new content.
                                            ref={(el) => {
                                                if (el) contentRef.current = el;
                                            }}
                                            custom={dir}
                                            className="absolute left-0 top-0"
                                            variants={{
                                                enter: (d) => ({ opacity: 0, x: d * 32 }),
                                                center: { opacity: 1, x: 0 },
                                                leave: (d) => ({ opacity: 0, x: d * -32 }),
                                            }}
                                            initial="enter"
                                            animate="center"
                                            exit="leave"
                                            transition={{ duration: 0.25, ease }}
                                        >
                                            <PanelContent item={active} />
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MotionConfig>
    );
};

export default NavDropDown;
