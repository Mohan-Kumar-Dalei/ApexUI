import React, { useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BarChart3, Bell, ChevronDown, FolderKanban, Home, Inbox, LifeBuoy, PanelLeftClose, PanelLeftOpen, Settings, Users } from "lucide-react";

/*
 * Sidebar Nav: an app sidebar that collapses to an icon rail. The active
 * pill slides between items, groups open and close, badges show counts, and
 * the rail shows each name as a tooltip.
 */

const DEFAULT_SECTIONS = [
    {
        title: "Main",
        items: [
            { id: "home", label: "Dashboard", icon: Home },
            { id: "inbox", label: "Inbox", icon: Inbox, badge: 4 },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            {
                id: "projects",
                label: "Projects",
                icon: FolderKanban,
                children: [
                    { id: "apex", label: "ApexUI" },
                    { id: "website", label: "Website" },
                    { id: "mobile", label: "Mobile app" },
                ],
            },
            { id: "team", label: "Team", icon: Users },
        ],
    },
    {
        title: "Other",
        items: [
            { id: "notifications", label: "Notifications", icon: Bell, badge: 12 },
            { id: "settings", label: "Settings", icon: Settings },
            { id: "help", label: "Help", icon: LifeBuoy },
        ],
    },
];

const THEMES = {
    dark: {
        panel: "bg-neutral-950 text-white border-white/10",
        muted: "text-white/45",
        item: "text-white/70 hover:text-white hover:bg-white/[0.05]",
        pill: "bg-white/[0.08]",
        tip: "bg-white text-neutral-900",
    },
    light: {
        panel: "bg-white text-neutral-900 border-black/10",
        muted: "text-neutral-400",
        item: "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04]",
        pill: "bg-black/[0.06]",
        tip: "bg-neutral-900 text-white",
    },
};

const SidebarNav = ({
    sections = DEFAULT_SECTIONS,
    brand = { name: "Apex", logo: null },
    user = { name: "Mohan Dalei", email: "mohan@apex-ui.in", avatar: "https://ik.imagekit.io/ny6yinyut/apexui/assets/captainamerica.png?tr=f-auto,q-80,w-96" },
    defaultActive = "home",
    defaultCollapsed = false,
    accentColor = "#a3e635",
    theme = "dark",
    onSelect,
    className = "",
}) => {
    const t = THEMES[theme] ?? THEMES.dark;
    const pillId = useId();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [active, setActive] = useState(defaultActive);
    const [open, setOpen] = useState(() => new Set(["projects"]));
    const [tip, setTip] = useState(null);
    const asideRef = useRef(null);

    const select = (item) => {
        setActive(item.id);
        onSelect?.(item);
    };
    const toggle = (id) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    // A render function (not a component) so rows keep their identity between renders.
    const renderRow = (item, depth = 0) => {
        const Icon = item.icon;
        const hasChildren = Boolean(item.children?.length);
        const isOpen = open.has(item.id);
        const isActive = active === item.id || (hasChildren && collapsed && item.children.some((c) => c.id === active));
        return (
            <li key={item.id}>
                <button
                    type="button"
                    onClick={() => (hasChildren && !collapsed ? toggle(item.id) : select(hasChildren ? item.children[0] : item))}
                    onMouseEnter={(e) => {
                        if (!collapsed) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        setTip({ label: item.label, top: r.top + r.height / 2 - asideRef.current.getBoundingClientRect().top });
                    }}
                    onMouseLeave={() => setTip(null)}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={hasChildren && !collapsed ? isOpen : undefined}
                    className={`relative flex h-9 w-full items-center gap-3 rounded-lg text-[0.86rem] font-medium transition-colors ${collapsed ? "justify-center px-0" : "px-2.5"} ${isActive ? "" : t.item}`}
                    style={{ paddingLeft: !collapsed && depth ? "2.6rem" : undefined }}
                >
                    {isActive && (
                        <motion.span layoutId={`${pillId}-pill`} className={`absolute inset-0 rounded-lg ${t.pill}`} transition={{ type: "spring", stiffness: 500, damping: 38 }}>
                            <span className="absolute inset-y-2 left-0 w-[3px] rounded-full" style={{ background: accentColor }} />
                        </motion.span>
                    )}
                    {Icon && <Icon className="relative h-[1.1rem] w-[1.1rem] shrink-0" style={isActive ? { color: accentColor } : undefined} />}
                    {!collapsed && <span className="relative min-w-0 flex-1 truncate text-left">{item.label}</span>}
                    {!collapsed && item.badge != null && (
                        <span className="relative rounded-full px-1.5 py-px text-[0.68rem] font-semibold text-black" style={{ background: accentColor }}>
                            {item.badge}
                        </span>
                    )}
                    {collapsed && item.badge != null && <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />}
                    {!collapsed && hasChildren && <ChevronDown className={`relative h-4 w-4 opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                </button>
                <AnimatePresence initial={false}>
                    {hasChildren && isOpen && !collapsed && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="relative mt-0.5 space-y-0.5 overflow-hidden"
                        >
                            <span aria-hidden="true" className={`absolute bottom-2 left-[1.3rem] top-1 w-px ${theme === "light" ? "bg-black/10" : "bg-white/10"}`} />
                            {item.children.map((child) => renderRow(child, depth + 1))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </li>
        );
    };

    return (
        <motion.aside
            ref={asideRef}
            aria-label="Sidebar"
            animate={{ width: collapsed ? "4.25rem" : "15.5rem" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className={`relative flex h-full shrink-0 flex-col border-r ${t.panel} ${className}`}
        >
            <div className={`flex items-center gap-2.5 px-3.5 ${collapsed ? "flex-col justify-center gap-2 py-3" : "h-14"}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-bold text-black" style={{ background: accentColor }}>
                    {brand.logo ? <img src={brand.logo} alt="" className="h-5 w-5" /> : brand.name?.[0]}
                </span>
                {!collapsed && <span className="truncate text-[0.95rem] font-semibold">{brand.name}</span>}
                <button
                    type="button"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    onClick={() => {
                        setCollapsed((c) => !c);
                        setTip(null);
                    }}
                    className={`grid h-8 w-8 place-items-center rounded-lg ${t.item} ${collapsed ? "" : "ml-auto"}`}
                >
                    {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
            </div>

            <LayoutGroup id={pillId}>
                <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-3" style={{ scrollbarWidth: "thin", scrollbarColor: `${theme === "light" ? "rgba(0,0,0,.15)" : "rgba(255,255,255,.15)"} transparent` }}>
                    {sections.map((section) => (
                        <div key={section.title} className="mt-3 first:mt-1">
                            {!collapsed ? (
                                <p className={`mb-1.5 px-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${t.muted}`}>{section.title}</p>
                            ) : (
                                <span aria-hidden="true" className={`mx-auto mb-2 block h-px w-6 ${theme === "light" ? "bg-black/10" : "bg-white/10"}`} />
                            )}
                            <ul className="space-y-0.5">
                                {section.items.map((item) => renderRow(item))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </LayoutGroup>

            <AnimatePresence>
                {collapsed && tip && (
                    <motion.span
                        key={tip.label}
                        role="tooltip"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className={`pointer-events-none absolute left-[4.6rem] z-50 whitespace-nowrap rounded-md px-2 py-1 text-[0.75rem] font-medium shadow-lg ${t.tip}`}
                        style={{ top: tip.top, translateY: "-50%" }}
                    >
                        {tip.label}
                    </motion.span>
                )}
            </AnimatePresence>

            {user && (
                <div className={`flex items-center gap-3 border-t p-3 ${theme === "light" ? "border-black/10" : "border-white/10"} ${collapsed ? "justify-center" : ""}`}>
                    <img src={user.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2" style={{ "--tw-ring-color": accentColor }} />
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-[0.85rem] font-semibold">{user.name}</p>
                            <p className={`truncate text-[0.75rem] ${t.muted}`}>{user.email}</p>
                        </div>
                    )}
                </div>
            )}
        </motion.aside>
    );
};

export default SidebarNav;
