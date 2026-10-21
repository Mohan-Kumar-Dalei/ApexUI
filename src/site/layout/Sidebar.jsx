import { IndexNav } from './IndexNav.jsx';
import useActiveInView from './useActiveInView.js';

/* Left docs sidebar (desktop): guides plus every component, grouped by category. */
export default function Sidebar() {
    const listRef = useActiveInView();
    return (
        <aside aria-label="Docs navigation" className="hidden w-[16.5rem] shrink-0 border-r border-[var(--line)] lg:block">
            {/* Sticky under the navbar, scrolls on its own and never drags the page along (overscroll-contain). */}
            <div ref={listRef} className="thin-scroll sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-4 pb-10 pt-6">
                <IndexNav />
            </div>
        </aside>
    );
}
