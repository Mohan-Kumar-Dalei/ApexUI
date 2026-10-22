import { useEffect, useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import LoadingScreen from '../../../components/MainUI/ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'variant', type: "'orbit' | 'progress' | 'blocks' | 'catch' | 'runner' | 'racer'", def: '"orbit"', desc: 'Loader style; catch, runner and racer are mini games to play while the page loads.' },
    { prop: 'progress', type: 'number', def: 'real page load', desc: 'Leave it out and the loader follows the real page load. Pass 0 to 100 to drive it yourself.' },
    { prop: 'autoHide', type: 'boolean', def: 'true', desc: 'Fade out and unmount once the page has loaded.' },
    { prop: 'fullScreen', type: 'boolean', def: 'false', desc: 'Cover the whole viewport (fixed) instead of filling the parent.' },
    { prop: 'onComplete', type: '() => void', def: 'none', desc: 'Called when loading reaches 100%.' },
    { prop: 'statusText', type: 'string', def: 'page status', desc: 'Text next to the percentage. Defaults to "Loading page…", "Almost ready…", then "Page ready".' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Main color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Background and text colors.' },
    { prop: 'title', type: 'string', def: '"Loading"', desc: 'Label for the loader (and for screen readers).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Orbit, blocks, message and orb motion.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const VARIANTS = [
    { id: 'orbit', name: 'Orbit', description: 'Dots orbit a breathing core around the percentage, a calm, animated page loader.' },
    { id: 'progress', name: 'Progress', description: 'A big counting percentage with a sliding bar and a page status line.' },
    { id: 'blocks', name: 'Blocks', description: 'A grid of tiles fills in like a wave as the page loads.' },
    { id: 'catch', name: 'Catch Game', description: 'A mini game while the page loads: tap the orb before it fades to build a streak.' },
    { id: 'runner', name: 'Runner Game', description: 'A tiny endless runner: press Space, ↑ or tap to jump the blocks while the page loads.' },
    { id: 'racer', name: 'Racing Game', description: 'A top-down racer: steer through oncoming traffic with ← → or a tap on either side while the page loads.' },
];

/*
 * Preview only: the docs page has already loaded, so this plays a short demo
 * load (0 to 100%) to show the look. In your app you leave `progress` out and
 * the loader follows the real page load (see the Code tab).
 */
function DemoPreview({ variant, accent, theme, seconds }) {
    const [run, setRun] = useState(0);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / (seconds * 1000));
            // Fast start, slower middle, quick finish, like a real page.
            setProgress(Math.round((t < 0.8 ? 0.9 * (1 - Math.pow(1 - t / 0.8, 2)) : 0.9 + 0.1 * ((t - 0.8) / 0.2)) * 100));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        setProgress(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [run, seconds]);
    return (
        <div className="flex w-full flex-col items-center gap-3">
            <div className="h-[24rem] w-full overflow-hidden rounded-2xl">
                <LoadingScreen variant={variant} accentColor={accent} theme={theme} progress={progress} autoHide={false} />
            </div>
            <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full bg-[var(--panel-2)] px-4 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--panel-3)]">
                Play again
            </button>
        </div>
    );
}

export default function LoadingScreenDoc() {
    const siteTheme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    const [seconds, setSeconds] = useState(5);
    const [themeChoice, setThemeChoice] = useState('site');
    const theme = themeChoice === 'site' ? siteTheme : themeChoice;

    const controls = (
        <ControlGrid>
            <ColorControl label="Accent" value={accent} onChange={setAccent} />
            <RangeControl label="Demo length" value={seconds} onChange={setSeconds} min={2} max={12} step={0.5} format={(v) => `${v}s`} />
            <SelectControl label="Theme" value={themeChoice} onChange={setThemeChoice} options={[{ value: 'site', label: 'Match site' }, { value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
        </ControlGrid>
    );

    const variants = VARIANTS.map((v) => ({
        name: v.name,
        description: v.description,
        preview: <DemoPreview key={`${v.id}-${seconds}`} variant={v.id} accent={accent} theme={theme} seconds={seconds} />,
        controls,
        code: `// 1. Add it:  npx apex-ui-kit add loading-screen
// 2. Render it once at the top of your app with fullScreen.
//    It covers the page while it loads, the bar and percentage follow
//    the real page load, then it fades out on its own.
import LoadingScreen from './ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';

const App = () => (
  <>
    <LoadingScreen variant="${v.id}" accentColor="${accent}" theme="${theme}" fullScreen />
    <main>Your app</main>
  </>
);

export default App;

// 3. Optional: drive it yourself, e.g. while your own data loads.
//    <LoadingScreen variant="${v.id}" progress={percent} statusText="Loading your dashboard" fullScreen />`,
        cli: 'loading-screen',
        props,
        dependencies,
    }));

    return (
        <ComponentDoc
            title="Loading Screens"
            description="Six page loading screens: orbit, progress and blocks loaders, plus three mini games (catch the orb, endless runner, racing). Drop it into your app and the bar and percentage follow the real page load, then it hides itself."
            variants={variants}
        />
    );
}
