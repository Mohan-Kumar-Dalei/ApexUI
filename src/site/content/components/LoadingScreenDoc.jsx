import { useMemo, useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import LoadingScreen from '../../../components/MainUI/ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';
import { useLoadProgress } from '../../../components/MainUI/ApexUI-Kit/LoadingScreen/useLoadProgress.js';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'variant', type: "'orbit' | 'progress' | 'blocks' | 'catch' | 'runner' | 'racer'", def: '"orbit"', desc: 'Loader style; catch, runner and racer are mini games to play while waiting.' },
    { prop: 'progress', type: 'number', def: 'none', desc: 'Real progress 0 to 100. Leave it out to run a simulated load.' },
    { prop: 'duration', type: 'number', def: '6000', desc: 'Length of the simulated load, in ms.' },
    { prop: 'loop', type: 'boolean', def: 'true', desc: 'Restart the simulated load when it finishes.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Main color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Background and text colors.' },
    { prop: 'title', type: 'string', def: '"Loading"', desc: 'Label under the loader (and for screen readers).' },
    { prop: 'fullScreen', type: 'boolean', def: 'false', desc: 'Cover the whole viewport (fixed) instead of filling the parent.' },
    { prop: 'onComplete', type: '() => void', def: 'none', desc: 'Called when progress reaches 100.' },
    { prop: 'statusText', type: 'string', def: 'none', desc: 'Text next to the percentage in the game variants, e.g. "3 of 8 files loaded".' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const realProps = [
    { prop: 'useLoadProgress(items)', type: '(string | (() => Promise) | Promise)[]', def: 'none', desc: 'Loads every item in parallel: image URLs are decoded, other URLs fetched, functions called. Pass a stable list.' },
    { prop: 'progress', type: 'number', def: '0', desc: 'Returned: share of items finished, 0 to 100. Pass it to LoadingScreen.' },
    { prop: 'loaded / total', type: 'number', def: '0 / items.length', desc: 'Returned: counts for your status text.' },
    { prop: 'done', type: 'boolean', def: 'false', desc: 'Returned: true when every item has finished.' },
    { prop: 'errors', type: 'number', def: '0', desc: 'Returned: items that failed (they still count as finished, so the screen never sticks).' },
    { prop: '{ enabled }', type: 'boolean', def: 'true', desc: 'Option: set false to wait before starting.' },
];

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets';
const HEROES = ['spiderman', 'black-panther', 'hulk', 'thanos', 'captainamerica', 'doctorStrange', 'ironman'];

/* Downloads real images (fresh each run) and feeds the true progress to the Runner game. */
function RealProgressDemo({ accent, theme }) {
    const [run, setRun] = useState(1);
    const items = useMemo(() => Array.from({ length: 14 }, (_, i) => `${IK}/${HEROES[i % HEROES.length]}.png?tr=w-${700 + i * 37}&run=${run}`), [run]);
    const { progress, loaded, total, done } = useLoadProgress(items);
    return (
        <div className="flex w-full flex-col items-center gap-3">
            <div className="h-[24rem] w-full overflow-hidden rounded-2xl">
                <LoadingScreen variant="runner" accentColor={accent} theme={theme} progress={progress} statusText={done ? `All ${total} images loaded` : `${loaded} of ${total} images loaded`} title="Real progress" />
            </div>
            <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full bg-[var(--panel-2)] px-4 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--panel-3)]">
                Load again
            </button>
        </div>
    );
}

const REAL_CODE = (accent, theme) => `import LoadingScreen from './ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';
import { useLoadProgress } from './ApexUI-Kit/LoadingScreen/useLoadProgress.js';

// Everything the page needs before it can show. Keep this list stable.
const ASSETS = [
  "/images/hero.jpg",
  "/images/product.png",
  "/data/products.json",
  () => import("./Dashboard.jsx"),
];

const App = () => {
  const { progress, loaded, total, done } = useLoadProgress(ASSETS);

  if (!done) {
    return (
      <LoadingScreen
        variant="runner"
        accentColor="${accent}"
        theme="${theme}"
        progress={progress}
        statusText={loaded + " of " + total + " files loaded"}
        fullScreen
      />
    );
  }
  return <main>Your app</main>;
};

export default App;`;

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Orbit, blocks, message and orb motion.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const VARIANTS = [
    { id: 'orbit', name: 'Orbit', description: 'Dots orbit a breathing core around the percentage, a calm, animated loader.' },
    { id: 'progress', name: 'Progress', description: 'A big counting percentage with a sliding bar and status lines that change as it loads.' },
    { id: 'blocks', name: 'Blocks', description: 'A grid of tiles fills in like a wave as the load moves along.' },
    { id: 'catch', name: 'Catch Game', description: 'A mini game while you wait: tap the orb before it fades to build a streak.' },
    { id: 'runner', name: 'Runner Game', description: 'A tiny endless runner: press Space, ↑ or tap to jump the blocks while things load.' },
    { id: 'racer', name: 'Racing Game', description: 'A top-down racer: steer through oncoming traffic with ← → or a tap on either side while things load.' },
];

export default function LoadingScreenDoc() {
    const siteTheme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    const [duration, setDuration] = useState(6000);
    const [themeChoice, setThemeChoice] = useState('site');
    const theme = themeChoice === 'site' ? siteTheme : themeChoice;

    const controls = (
        <ControlGrid>
            <ColorControl label="Accent" value={accent} onChange={setAccent} />
            <RangeControl label="Load time" value={duration} onChange={setDuration} min={2000} max={15000} step={500} format={(v) => `${(v / 1000).toFixed(1)}s`} />
            <SelectControl label="Theme" value={themeChoice} onChange={setThemeChoice} options={[{ value: 'site', label: 'Match site' }, { value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
        </ControlGrid>
    );

    const variants = VARIANTS.map((v) => ({
        name: v.name,
        description: v.description,
        preview: (
            <div className="h-[26rem] w-full overflow-hidden rounded-2xl">
                <LoadingScreen key={`${v.id}-${duration}`} variant={v.id} accentColor={accent} duration={duration} theme={theme} />
            </div>
        ),
        controls,
        code: `import { useState } from 'react';
import LoadingScreen from './ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';

const App = () => {
  const [ready, setReady] = useState(false);
  if (!ready) {
    return (
      <LoadingScreen
        variant="${v.id}"
        accentColor="${accent}"
        theme="${theme}"
        duration={${duration}}
        loop={false}
        fullScreen
        onComplete={() => setReady(true)}
      />
    );
  }
  return <main>Your app</main>;
};

export default App;`,
        cli: 'loading-screen',
        props,
        dependencies,
    }));

    const real = {
        name: 'Real progress',
        description: 'Show the true progress of your own load. useLoadProgress downloads what your page needs (images, files or code) and returns the real percentage and counts, so the bar and the number match what actually finished. This preview downloads 14 real images each time.',
        preview: <RealProgressDemo accent={accent} theme={theme} />,
        controls: (
            <ControlGrid>
                <ColorControl label="Accent" value={accent} onChange={setAccent} />
                <SelectControl label="Theme" value={themeChoice} onChange={setThemeChoice} options={[{ value: 'site', label: 'Match site' }, { value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
            </ControlGrid>
        ),
        code: REAL_CODE(accent, theme),
        cli: 'loading-screen',
        props: [...realProps, ...props],
        dependencies,
    };

    return (
        <ComponentDoc
            title="Loading Screens"
            description="Six ways to wait, orbit, progress and blocks loaders, plus three mini games (catch the orb, endless runner, racing). Pass real progress with useLoadProgress so the bar and the number show what actually loaded."
            variants={[real, ...variants]}
        />
    );
}
