import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import AiVoiceOrb from '../../../components/MainUI/ApexUI-Kit/AiVoiceOrb/AiVoiceOrb.jsx';

const props = [
    { prop: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", def: 'none', desc: 'Control the state yourself; leave it out and a tap cycles through them.' },
    { prop: 'onStateChange', type: '(state) => void', def: 'none', desc: 'Called when the orb is tapped.' },
    { prop: 'colors', type: 'string[]', def: 'lime / cyan / violet / pink', desc: 'Colors swirling inside the orb.' },
    { prop: 'size', type: 'number', def: '12', desc: 'Orb size in rem.' },
    { prop: 'showLabel', type: 'boolean', def: 'true', desc: 'Show the state under the orb.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Blob swirl, pulse and ripples.' },
    { name: 'Lucide React', desc: 'Mic icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const PALETTES = {
    apex: ['#a3e635', '#22d3ee', '#a78bfa', '#f472b6'],
    sunset: ['#f97316', '#f43f5e', '#facc15', '#a855f7'],
    ocean: ['#0ea5e9', '#6366f1', '#14b8a6', '#38bdf8'],
};

export default function AiVoiceOrbDoc() {
    const [state, setState] = useState('auto');
    const [palette, setPalette] = useState('apex');
    return (
        <ComponentDoc
            title="AI Voice Orb"
            description="The face of a voice assistant, colour blobs swirl inside a glass sphere that breathes when idle, pulses while listening, spins while thinking and ripples while speaking."
            preview={
                <div className="text-[var(--ink)]">
                    <AiVoiceOrb key={state} state={state === 'auto' ? undefined : state} colors={PALETTES[palette]} />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="State" value={state} onChange={setState} options={[{ value: 'auto', label: 'Tap to cycle' }, 'idle', 'listening', 'thinking', 'speaking']} />
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                </ControlGrid>
            }
            code={`import { useState } from 'react';
import AiVoiceOrb from './ApexUI-Kit/AiVoiceOrb/AiVoiceOrb.jsx';

const App = () => {
  const [state, setState] = useState("idle");
  // Switch the state from your speech / model events.
  return <AiVoiceOrb state={state} onStateChange={setState} colors={${JSON.stringify(PALETTES[palette])}} />;
};

export default App;`}
            cli="ai-voice-orb"
            props={props}
            dependencies={dependencies}
        />
    );
}
