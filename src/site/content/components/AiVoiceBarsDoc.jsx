import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import AiVoiceBars from '../../../components/MainUI/ApexUI-Kit/AiVoiceBars/AiVoiceBars.jsx';

const props = [
    { prop: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", def: '—', desc: 'Control the state yourself; leave it out and a tap cycles through them.' },
    { prop: 'onStateChange', type: '(state) => void', def: '—', desc: 'Called when it is tapped.' },
    { prop: 'color', type: 'string', def: "'#a3e635'", desc: 'Bar color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: "'dark'", desc: 'Pill background.' },
    { prop: 'count', type: 'number', def: '7', desc: 'How many bars.' },
    { prop: 'showLabel', type: 'boolean', def: 'true', desc: 'Show the state underneath.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Label transitions.' },
    { name: 'Lucide React', desc: 'Mic icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const PALETTES = { apex: '#a3e635', sunset: '#f97316', ocean: '#38bdf8' };

export default function AiVoiceBarsDoc() {
    const [state, setState] = useState('auto');
    const [palette, setPalette] = useState('apex');
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="AI Voice Bars"
            description="A pill of rounded equalizer bars — short dots when idle, mirrored peaks while listening, a travelling ripple while thinking and tall bursts while speaking."
            preview={
                <div className="text-[var(--ink)]">
                    <AiVoiceBars key={state} state={state === 'auto' ? undefined : state} color={PALETTES[palette]} theme={theme} />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="State" value={state} onChange={setState} options={[{ value: 'auto', label: 'Tap to cycle' }, 'idle', 'listening', 'thinking', 'speaking']} />
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                </ControlGrid>
            }
            code={`import { useState } from 'react';
import AiVoiceBars from './ApexUI-Kit/AiVoiceBars/AiVoiceBars.jsx';

const App = () => {
  const [state, setState] = useState("idle");
  // Switch the state from your speech / model events.
  return <AiVoiceBars state={state} onStateChange={setState} color={${JSON.stringify(PALETTES[palette])}} />;
};

export default App;`}
            cli="ai-voice-bars"
            props={props}
            dependencies={dependencies}
        />
    );
}
