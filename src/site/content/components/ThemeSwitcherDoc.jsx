import { useRef } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ThemeSwitcher from '../../../components/MainUI/ApexUI-Kit/ThemeSwitcher/ThemeSwitcher.jsx';

const props = [
    { prop: 'themes', type: '{ id, name, scheme, vars }[]', def: '8 built-in themes', desc: 'Themes to offer. vars sets --bg, --surface, --ink, --muted, --line, --accent and --accent-ink.' },
    { prop: 'placement', type: "'down' | 'up'", def: '"down"', desc: 'Open the panel below or above the button.' },
    { prop: 'align', type: "'right' | 'left'", def: '"right"', desc: 'Which edge of the button the panel lines up with.' },
    { prop: 'label', type: 'string', def: 'undefined', desc: 'Text on the trigger. Without it the trigger is a round icon button.' },
    { prop: 'storageKey', type: 'string', def: '"theme"', desc: 'localStorage key for the choice.' },
    { prop: 'target', type: 'Element | ref', def: '<html>', desc: 'Where the theme variables go. Leave it out to theme the whole page.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the wrapper.' },
    { prop: 'buttonClassName', type: 'string', def: '""', desc: 'Classes for the trigger button.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces (react-dom for flushSync).' },
    { name: 'Framer Motion', desc: 'Springs for the panel.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ThemeSwitcherDoc() {
    const box = useRef(null);

    return (
        <ComponentDoc
            title="Theme Switcher"
            description="A palette button that opens a grid of colour themes. Picking one reveals it with a soft circle growing from the swatch you clicked (View Transitions API, with an instant fallback), and every component calling useTheme stays in sync. Ships 8 themes, saves the choice and has a tiny inline script to avoid a flash on load."
            preview={
                <div ref={box} className="absolute inset-0 flex flex-col bg-[var(--bg)] text-[var(--ink)] transition-colors">
                    <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
                        <span className="text-sm font-black tracking-tight">Studio</span>
                        <ThemeSwitcher target={box} storageKey="apexui-demo-theme" />
                    </div>
                    <div className="grid flex-1 place-items-center px-6 text-center">
                        <div>
                            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--muted)]">Pick a colour vibe</p>
                            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Your brand, any mood</h3>
                            <div className="mt-6 flex justify-center gap-3">
                                <span className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-ink)]">Get started</span>
                                <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold">Docs</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            fullBleed
            code={`// index.html <head>, before your app script, to avoid a flash on load:
// <script>{output of themeScript("theme")}</script>
import ThemeSwitcher, { useTheme, themeScript } from './ApexUI-Kit/ThemeSwitcher/ThemeSwitcher.jsx';

const App = () => {
  const [theme, setTheme] = useTheme();
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <ThemeSwitcher />
      <ThemeSwitcher placement="up" align="left" label="Theme" />
      <button onClick={(e) => setTheme("grape", e.currentTarget)}>Grape</button>
      <p>Current: {theme}</p>
    </div>
  );
};

export default App;`}
            cli="theme-switcher"
            props={props}
            dependencies={dependencies}
        />
    );
}
