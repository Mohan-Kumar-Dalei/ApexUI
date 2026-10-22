import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import LoadingScreen from '../../../components/MainUI/ApexUI-Kit/LoadingScreen/LoadingScreen.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'variant', type: "'orbit' | 'progress' | 'blocks' | 'catch' | 'runner'", def: '"orbit"', desc: 'Loader style; catch and runner are mini games to play while waiting.' },
    { prop: 'progress', type: 'number', def: '—', desc: 'Real progress 0–100. Leave it out to run a simulated load.' },
    { prop: 'duration', type: 'number', def: '6000', desc: 'Length of the simulated load, in ms.' },
    { prop: 'loop', type: 'boolean', def: 'true', desc: 'Restart the simulated load when it finishes.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Main color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Background and text colors.' },
    { prop: 'title', type: 'string', def: '"Loading"', desc: 'Label under the loader (and for screen readers).' },
    { prop: 'fullScreen', type: 'boolean', def: 'false', desc: 'Cover the whole viewport (fixed) instead of filling the parent.' },
    { prop: 'onComplete', type: '() => void', def: '—', desc: 'Called when progress reaches 100.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Orbit, blocks, message and orb motion.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const VARIANTS = [
    { id: 'orbit', name: 'Orbit', description: 'Dots orbit a breathing core around the percentage — a calm, animated loader.' },
    { id: 'progress', name: 'Progress', description: 'A big counting percentage with a sliding bar and status lines that change as it loads.' },
    { id: 'blocks', name: 'Blocks', description: 'A grid of tiles fills in like a wave as the load moves along.' },
    { id: 'catch', name: 'Catch Game', description: 'A mini game while you wait: tap the orb before it fades to build a streak.' },
    { id: 'runner', name: 'Runner Game', description: 'A tiny endless runner: press Space, ↑ or tap to jump the blocks while things load.' },
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

    return (
        <ComponentDoc
            title="Loading Screens"
            description="Five ways to wait — orbit, progress and blocks loaders, plus two mini games (catch the orb, endless runner) so visitors stay busy until your app is ready."
            variants={variants}
        />
    );
}
