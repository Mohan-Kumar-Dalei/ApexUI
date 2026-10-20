import ThemeToggle from '../../components/MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';

/* Site theme switch: the kit's ThemeToggle in a navbar-sized icon button. */
export default function ThemeSwitch({ className = '' }) {
    return (
        <span
            title="Toggle theme"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-2)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--ink)] [&_button]:inline-flex [&_button]:h-full [&_button]:w-full [&_button]:items-center [&_button]:justify-center [&_button]:hover:scale-100 [&_svg]:h-[1.05rem] [&_svg]:w-[1.05rem] ${className}`}
        >
            <ThemeToggle LightTheme="light" animation="circle-left" duration="0.9s" className="text-inherit" />
        </span>
    );
}
