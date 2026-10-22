import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import FlipClock from '../../../components/MainUI/ApexUI-Kit/FlipClock/FlipClock.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'mode', type: "'seconds' | 'date' | 'clock'", def: '"seconds"', desc: 'Count down a number of seconds, count down to a date, or show the time.' },
    { prop: 'seconds', type: 'number', def: '3d 4h 25m', desc: 'Countdown length for mode "seconds".' },
    { prop: 'target', type: 'string | Date', def: '—', desc: 'End date for mode "date".' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Separator dots.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Card colors.' },
    { prop: 'showLabels', type: 'boolean', def: 'true', desc: 'Show Days / Hours / … under the digits.' },
    { prop: 'size', type: 'number', def: '3', desc: 'Font size in rem (the whole clock scales with it).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'The folding flaps.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function FlipClockDoc() {
    const theme = useSiteTheme();
    const [mode, setMode] = useState('seconds');
    const [size, setSize] = useState(3);
    const [accent, setAccent] = useState('#a3e635');

    const code = `import FlipClock from './ApexUI-Kit/FlipClock/FlipClock.jsx';

const App = () => (
  <FlipClock
    mode="${mode}"${mode === 'date' ? '\n    target="2027-01-01T00:00:00"' : mode === 'seconds' ? '\n    seconds={3 * 86400 + 4 * 3600 + 25 * 60}' : ''}
    accentColor="${accent}"
    theme="${theme}"
    size={${size}}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Flip Clock"
            description="Split-flap digits that fold over as they change — count down to a launch, run a timer, or show the time of day."
            preview={<FlipClock key={mode} mode={mode} target="2027-01-01T00:00:00" accentColor={accent} theme={theme} size={size} className="max-w-full" />}
            controls={
                <ControlGrid>
                    <SelectControl label="Mode" value={mode} onChange={setMode} options={[{ value: 'seconds', label: 'Timer' }, { value: 'date', label: 'To a date' }, { value: 'clock', label: 'Clock' }]} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={1.5} max={5} step={0.25} format={(v) => `${v}rem`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="flip-clock"
            props={props}
            dependencies={dependencies}
        />
    );
}
