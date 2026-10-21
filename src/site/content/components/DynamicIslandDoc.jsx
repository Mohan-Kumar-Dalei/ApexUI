import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import DynamicIsland from '../../../components/MainUI/ApexUI-Kit/DynamicIsland/DynamicIsland.jsx';

const props = [
    { prop: 'view', type: "'idle' | 'music' | 'call' | 'timer' | 'notification'", def: '—', desc: 'Show one view yourself. Leave it out to let the island cycle on its own.' },
    { prop: 'defaultView', type: 'string', def: '"music"', desc: 'First view when uncontrolled.' },
    { prop: 'views', type: 'string[]', def: 'all five', desc: 'Which views to cycle through, in order.' },
    { prop: 'autoPlay', type: 'boolean', def: 'true', desc: 'Cycle through the views (pauses on hover and while expanded).' },
    { prop: 'interval', type: 'number', def: '3600', desc: 'Milliseconds each view stays before the next one.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Waveform, progress and notification icon color.' },
    { prop: 'music', type: '{ title, artist, cover }', def: 'demo track', desc: 'Now-playing details. Click the music view to expand it.' },
    { prop: 'call', type: '{ name, subtitle, avatar }', def: 'Tony Stark', desc: 'Incoming call details.' },
    { prop: 'notification', type: '{ app, title, message }', def: 'demo message', desc: 'Notification details.' },
    { prop: 'timerSeconds', type: 'number', def: '300', desc: 'Countdown length for the timer view.' },
    { prop: 'onViewChange', type: '(view) => void', def: '—', desc: 'Called when the island moves to the next view on its own.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring morphs between views.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const viewOptions = [
    { value: 'auto', label: 'Auto cycle' },
    { value: 'idle', label: 'Idle' },
    { value: 'music', label: 'Music' },
    { value: 'call', label: 'Call' },
    { value: 'timer', label: 'Timer' },
    { value: 'notification', label: 'Notification' },
];

export default function DynamicIslandDoc() {
    const [view, setView] = useState('auto');
    const [accent, setAccent] = useState('#a3e635');
    const [interval, setIntervalMs] = useState(3600);

    const code = `import DynamicIsland from './ApexUI-Kit/DynamicIsland/DynamicIsland.jsx';

const App = () => (
  <DynamicIsland
${view === 'auto' ? `    interval={${interval}}` : `    view="${view}"`}
    accentColor="${accent}"
    music={{ title: "Midnight City", artist: "Apex Sessions", cover: "/cover.png" }}
    call={{ name: "Tony Stark", subtitle: "Mobile", avatar: "/tony.png" }}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Dynamic Island"
            description="A black capsule that morphs between live activities — music, calls, timers and notifications — with smooth spring motion."
            preview={
                <DynamicIsland
                    key={view === 'auto' ? `auto-${interval}` : 'fixed'}
                    view={view === 'auto' ? undefined : view}
                    interval={interval}
                    accentColor={accent}
                />
            }
            previewClassName="!items-start pt-16"
            controls={
                <ControlGrid>
                    <SelectControl label="View" value={view} onChange={setView} options={viewOptions} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Cycle speed" value={interval} onChange={setIntervalMs} min={2000} max={6000} step={200} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                </ControlGrid>
            }
            code={code}
            cli="dynamic-island"
            props={props}
            dependencies={dependencies}
        />
    );
}
