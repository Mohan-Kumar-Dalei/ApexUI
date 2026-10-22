import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/*
 * Floating Navbar: a glassy pill that floats over the page. A highlight
 * follows the pointer across the links, the active link keeps a dot, and the
 * bar tucks away when you scroll down and slides back when you scroll up.
 * It switches to a hamburger menu based on its own width (container query),
 * so it is responsive wherever you put it.
 */

const DEFAULT_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Components", href: "#components" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
];

function Burger({ open }) {
    return (
        <span className="relative block h-3.5 w-5" aria-hidden="true">
            <motion.span className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-current" animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "0%", rotate: 0, y: 0 }} />
            <motion.span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-current" animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.3 : 1 }} />
            <motion.span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-current" animate={open ? { bottom: "50%", rotate: -45, y: "50%" } : { bottom: "0%", rotate: 0, y: 0 }} />
        </span>
    );
}

const FloatingNavbar = ({
    brand = "Apex",
    links = DEFAULT_LINKS,
    cta = { label: "Get started", href: "#start" },
    active: activeProp,
    onNavigate,
    hideOnScroll = true,
    scrollRoot,
    accentColor = "#a3e635",
    theme = "dark",
    className = "",
}) => {
    const id = useId();
    const [active, setActive] = useState(activeProp ?? links[0]?.label);
    const [hover, setHover] = useState(null);
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [compact, setCompact] = useState(false);
    const dark = theme !== "light";

    // Hide on scroll down, show on scroll up; compact once the page has moved.
    useEffect(() => {
        const root = scrollRoot?.current ?? window;
        const read = () => (root === window ? window.scrollY : root.scrollTop);
        let last = read();
        const onScroll = () => {
            const y = read();
            setCompact(y > 24);
            if (hideOnScroll && Math.abs(y - last) > 6) setHidden(y > last && y > 80);
            last = y;
        };
        root.addEventListener("scroll", onScroll, { passive: true });
        return () => root.removeEventListener("scroll", onScroll);
    }, [hideOnScroll, scrollRoot]);

    const go = (link, e) => {
        setActive(link.label);
        setOpen(false);
        onNavigate?.(link, e);
    };

    const surface = dark ? "border-white/10 bg-neutral-900/70 text-white shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]" : "border-black/10 bg-white/75 text-neutral-900 shadow-[0_10px_40px_-14px_rgba(0,0,0,0.25)]";
    const muted = dark ? "text-white/65 hover:text-white" : "text-neutral-500 hover:text-neutral-900";

    return (
        <div className={`@container sticky top-3 z-50 w-full px-3 ${className}`}>
            <motion.nav
                aria-label="Main"
                initial={false}
                animate={{ y: hidden && !open ? "-140%" : "0%", opacity: hidden && !open ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className={`mx-auto max-w-4xl rounded-[1.6rem] border backdrop-blur-xl transition-[padding] duration-300 ${surface} ${compact ? "px-2.5 py-1.5" : "px-3 py-2.5"}`}
            >
                <div className="flex items-center justify-between gap-3">
                    <a href="#home" onClick={(e) => go(links[0], e)} className="flex items-center gap-2 pl-1.5 text-[0.95rem] font-bold">
                        <motion.span whileHover={{ rotate: -12, scale: 1.08 }} className="grid h-8 w-8 place-items-center rounded-xl text-sm font-black text-black" style={{ background: accentColor }}>
                            {brand[0]}
                        </motion.span>
                        {brand}
                    </a>

                    {/* Desktop links with a pill that follows the pointer. */}
                    <ul className="hidden items-center gap-0.5 @xl:flex" onPointerLeave={() => setHover(null)}>
                        {links.map((link) => {
                            const on = active === link.label;
                            return (
                                <li key={link.label} className="relative">
                                    <a
                                        href={link.href}
                                        onClick={(e) => go(link, e)}
                                        onPointerEnter={() => setHover(link.label)}
                                        aria-current={on ? "page" : undefined}
                                        className={`relative block rounded-full px-3 py-2 text-[0.86rem] font-medium transition-colors ${on ? "" : muted}`}
                                    >
                                        {hover === link.label && <motion.span layoutId={`${id}-hover`} className={`absolute inset-0 rounded-full ${dark ? "bg-white/[0.08]" : "bg-black/[0.05]"}`} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                                        <span className="relative">{link.label}</span>
                                        {on && <motion.span layoutId={`${id}-dot`} className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" style={{ background: accentColor }} />}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-1.5">
                        {cta && (
                            <motion.a
                                href={cta.href}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="hidden items-center gap-1 rounded-full px-4 py-2 text-[0.85rem] font-semibold text-black @3xl:inline-flex"
                                style={{ background: accentColor }}
                            >
                                {cta.label}
                                <ArrowUpRight className="h-4 w-4" />
                            </motion.a>
                        )}
                        <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)} className={`grid h-10 w-10 place-items-center rounded-full @xl:hidden ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
                            <Burger open={open} />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden @xl:hidden">
                            <ul className="space-y-1 px-1 pb-2 pt-3">
                                {links.map((link, i) => (
                                    <motion.li key={link.label} initial={{ x: -14, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.04 * i + 0.05 }}>
                                        <a href={link.href} onClick={(e) => go(link, e)} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-medium ${active === link.label ? (dark ? "bg-white/[0.08]" : "bg-black/[0.05]") : ""}`}>
                                            {link.label}
                                            {active === link.label && <span className="h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />}
                                        </a>
                                    </motion.li>
                                ))}
                                {cta && (
                                    <motion.li initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 * links.length + 0.08 }} className="pt-2">
                                        <a href={cta.href} className="flex items-center justify-center gap-1 rounded-2xl py-3 text-[0.95rem] font-semibold text-black" style={{ background: accentColor }}>
                                            {cta.label} <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    </motion.li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

export default FloatingNavbar;
