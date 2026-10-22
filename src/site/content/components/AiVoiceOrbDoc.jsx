import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import AiVoiceOrb from '../../../components/MainUI/ApexUI-Kit/AiVoiceOrb/AiVoiceOrb.jsx';
import AiSpeak from '../../../components/MainUI/ApexUI-Kit/AiSpeak/AiSpeak.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const orbProps = [
    { prop: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", def: '—', desc: 'Control the state yourself; leave it out and a tap cycles through them.' },
    { prop: 'onStateChange', type: '(state) => void', def: '—', desc: 'Called when the orb is tapped.' },
    { prop: 'colors', type: 'string[]', def: 'lime / cyan / violet / pink', desc: 'Colors swirling inside the orb.' },
    { prop: 'size', type: 'number', def: '12', desc: 'Orb size in rem.' },
    { prop: 'showLabel', type: 'boolean', def: 'true', desc: 'Show the state under the orb.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const speakProps = [
    { prop: 'text', type: 'string', def: 'demo sentence', desc: 'What to read out loud.' },
    { prop: 'lang', type: 'string', def: '"en"', desc: 'Language code; also filters the voice list.' },
    { prop: 'showVoicePicker', type: 'boolean', def: 'true', desc: 'Show a voice dropdown when several voices exist.' },
    { prop: 'onEnd', type: '() => void', def: '—', desc: 'Called when reading finishes.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Button, waveform and highlight color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Card colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const PALETTES = {
    apex: ['#a3e635', '#22d3ee', '#a78bfa', '#f472b6'],
    sunset: ['#f97316', '#f43f5e', '#facc15', '#a855f7'],
    ocean: ['#0ea5e9', '#6366f1', '#14b8a6', '#38bdf8'],
};

export default function AiVoiceOrbDoc() {
    const theme = useSiteTheme();
    const [state, setState] = useState('auto');
    const [palette, setPalette] = useState('apex');
    const [accent, setAccent] = useState('#a3e635');

    const variants = [
        {
            name: 'Voice Orb',
            description: 'The face of a voice assistant — colour blobs swirl inside a glass sphere that breathes when idle, pulses while listening, spins while thinking and ripples while speaking.',
            preview: (
                <div className="text-[var(--ink)]">
                    <AiVoiceOrb key={state} state={state === 'auto' ? undefined : state} colors={PALETTES[palette]} />
                </div>
            ),
            controls: (
                <ControlGrid>
                    <SelectControl label="State" value={state} onChange={setState} options={[{ value: 'auto', label: 'Tap to cycle' }, 'idle', 'listening', 'thinking', 'speaking']} />
                    <SelectControl label="Colors" value={palette} onChange={setPalette} options={[{ value: 'apex', label: 'Apex' }, { value: 'sunset', label: 'Sunset' }, { value: 'ocean', label: 'Ocean' }]} />
                </ControlGrid>
            ),
            code: `import { useState } from 'react';
import AiVoiceOrb from './ApexUI-Kit/AiVoiceOrb/AiVoiceOrb.jsx';

const App = () => {
  const [state, setState] = useState("idle");
  // Switch the state from your speech / model events.
  return <AiVoiceOrb state={state} onStateChange={setState} colors={${JSON.stringify(PALETTES[palette])}} />;
};

export default App;`,
            cli: 'ai-voice-orb',
            props: orbProps,
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'Framer Motion', desc: 'Blob swirl, pulse and ripples (GPU transforms only).' },
                { name: 'Lucide React', desc: 'Mic icons.' },
                { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
            ],
        },
        {
            name: 'AI Speak',
            description: 'Reads text out loud with the browser’s own voice and highlights each word as it is spoken, over a live waveform — with voice and speed pickers, pause, resume and stop.',
            preview: <AiSpeak theme={theme} accentColor={accent} />,
            controls: (
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            ),
            code: `import AiSpeak from './ApexUI-Kit/AiSpeak/AiSpeak.jsx';

const App = ({ answer }) => (
  <AiSpeak text={answer} lang="en" accentColor="${accent}" theme="${theme}" onEnd={() => console.log("done")} />
);

export default App;`,
            cli: 'ai-speak',
            props: speakProps,
            dependencies: [
                { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
                { name: 'Web Speech API', desc: 'Built into browsers — no API key or server needed.' },
                { name: 'Framer Motion', desc: 'Waveform bars.' },
                { name: 'Lucide React', desc: 'Icons.' },
                { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
            ],
        },
    ];

    return (
        <ComponentDoc
            title="AI Voice"
            description="Voice UI for assistants — a glass orb that reacts to listening, thinking and speaking, and an AI Speak player that reads answers aloud with word-by-word highlighting."
            variants={variants}
        />
    );
}
