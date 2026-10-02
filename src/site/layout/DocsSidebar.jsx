import { NavLink } from 'react-router-dom';
import { sidebarSections } from '../config/navigation.js';

export function NewBadge({ children = 'New' }) {
    return (
        <span className="rounded-full bg-[var(--accent-soft)] px-1.5 py-px text-[10px] font-medium leading-4 text-[var(--accent-text)]">
            {children}
        </span>
    );
}

export default function DocsSidebar({ onNavigate }) {
    return (
        <nav aria-label="Documentation" className="space-y-7 pb-10 text-sm">
            {sidebarSections.map((section) => (
                <div key={section.title}>
                    <h4 className="mb-2 flex items-center justify-between px-3 text-xs font-semibold tracking-wide text-[var(--fg)]">
                        {section.title}
                        {section.title === 'Components' && (
                            <span className="font-mono text-[10px] font-normal text-[var(--fg-subtle)]">{section.items.length}</span>
                        )}
                    </h4>
                    <ul className="space-y-px">
                        {section.items.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `relative flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${isActive
                                            ? 'bg-[var(--surface-2)] font-medium text-[var(--fg)] before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-[var(--accent)]'
                                            : 'text-[var(--fg-muted)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--fg)]'
                                        }`
                                    }
                                >
                                    <span className="truncate">{item.name}</span>
                                    {item.badge && <NewBadge>{item.badge}</NewBadge>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
