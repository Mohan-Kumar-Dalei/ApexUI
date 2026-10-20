import { IndexNav } from './IndexNav.jsx';

/* Left docs sidebar (desktop): guides plus every component, grouped by category. */
export default function Sidebar() {
    return (
        <aside aria-label="Docs navigation" className="hidden w-[16.5rem] shrink-0 border-r border-[var(--line)] lg:block">
            <div className="thin-scroll sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto px-4 pb-10 pt-6">
                <IndexNav />
            </div>
        </aside>
    );
}
