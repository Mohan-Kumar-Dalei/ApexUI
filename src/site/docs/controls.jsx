/* Small, consistent inputs for the live "playground" panels under previews. */

export function ControlGrid({ children }) {
    return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export default function ColorControl({ label, value, onChange }) {
    return (
        <label className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--fg-muted)]">{label}</span>
            <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] py-1 pl-1 pr-2.5">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                />
                <span className="font-mono text-xs uppercase text-[var(--fg-muted)]">{value}</span>
            </span>
        </label>
    );
}

export function RangeControl({ label, value, onChange, min, max, step = 1, format = (v) => v }) {
    return (
        <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[var(--fg-muted)]">{label}</span>
                <span className="font-mono text-xs text-[var(--fg)]">{format(value)}</span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-3)] accent-[var(--accent)]"
            />
        </label>
    );
}

export function SelectControl({ label, value, onChange, options }) {
    return (
        <label className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--fg-muted)]">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 text-sm text-[var(--fg)] focus:outline-none"
            >
                {options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                ))}
            </select>
        </label>
    );
}

export function ToggleControl({ label, value, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-[var(--fg-muted)]">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={value}
                onClick={() => onChange(!value)}
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${value ? 'justify-end bg-[var(--accent)]' : 'justify-start bg-[var(--surface-3)]'}`}
            >
                <span className="h-4 w-4 rounded-full bg-white shadow" />
            </button>
        </label>
    );
}
