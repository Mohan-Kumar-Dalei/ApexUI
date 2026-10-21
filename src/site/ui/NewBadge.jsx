/*
 * Small "New" pill for recently added components. Mark a page with
 * `isNew: true` in src/site/config/navigation.js to show it in the sidebar,
 * search, the component gallery and the page header.
 */
export default function NewBadge({ className = '' }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center rounded-full bg-[var(--lime)] px-1.5 py-px text-[0.62rem] font-semibold uppercase leading-4 tracking-wide text-[var(--lime-ink)] ${className}`}
        >
            New
        </span>
    );
}
