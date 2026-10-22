import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import AiVoiceWave from '../../../components/MainUI/ApexUI-Kit/AiVoiceWave/AiVoiceWave.jsx';

const props = [
    { prop: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", def: 'none', desc: 'Control the state yourself; leave it out and a tap cycles through them.' },
    { prop: 'onStateChange', type: '(state) => void', def: 'none', desc: 'Called when it is tapped.' },
    { prop: 'colors', type: 'string[]', def: 'lime / cyan / violet', desc: 'Colors used for the visual.' },
    { prop: 'height', type: 'number', def: '9', desc: 'Wave height in rem.' },
    { prop: 'showLabel', type: 'boolean', def: 'true', desc: 'Show the state underneath.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Label transitions.' },
    { name: 'Lucide React', desc: 'Mic icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const PALETTES = {
    apex: ['#a3e635', '#22d3ee', '#a78bfa'],
    sunset: ['#f97316', '#f43f5e', '#facc15'],
    ocean: ['#0ea5e9', '#6366f1', '#14b8a6'],
};

export default function AiVoiceWaveDoc() {
    const [state, setState] = useState('auto');
    const [palette, setPalette] = useState('apex');
    return (
        <ComponentDoc
            title="AI Voice Wave"
            description="Layered glowing sine waves for a voice assistant, a calm line when idle, lively while listening, a slow swell while thinking and syllable-like bursts while speaking."
            preview={
                <div className="flex w-full justify-center px-4 text-[var(--ink)]">
                    <AiVoiceWave key={state} state={state === 'auto' ? undefined : state} colors={PALETTES[palette]} />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="State" value={state} onChange={setState} options={[{ value: 'auto', label: 'Tap to cycle' }, 'idle', 'listening', 'thinking', 'speaking']} />
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                </ControlGrid>
            }
            code={`import { useState } from 'react';
import AiVoiceWave from './ApexUI-Kit/AiVoiceWave/AiVoiceWave.jsx';

const App = () => {
  const [state, setState] = useState("idle");
  // Switch the state from your speech / model events.
  return <AiVoiceWave state={state} onStateChange={setState} colors={${JSON.stringify(PALETTES[palette])}} />;
};

export default App;`}
            cli="ai-voice-wave"
            props={props}
            dependencies={dependencies}
        />
    );
}
