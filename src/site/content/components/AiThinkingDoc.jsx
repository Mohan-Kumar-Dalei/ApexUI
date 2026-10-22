import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import AiThinking from '../../../components/MainUI/ApexUI-Kit/AiThinking/AiThinking.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'steps', type: '{ label, detail? }[]', def: '4 demo steps', desc: 'What the assistant is doing, in order.' },
    { prop: 'step', type: 'number', def: 'none', desc: 'Current step index to drive it yourself; steps.length means done.' },
    { prop: 'stepDuration', type: 'number', def: '1400', desc: 'Milliseconds per step when it plays on its own.' },
    { prop: 'loop', type: 'boolean', def: 'true', desc: 'Start over after finishing (demo mode).' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Icon and check color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Panel colors.' },
    { prop: 'defaultOpen', type: 'boolean', def: 'true', desc: 'Show the step list at first.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Step and panel motion.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AiThinkingDoc() {
    const theme = useSiteTheme();
    const [speed, setSpeed] = useState(1400);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="AI Thinking"
            description="Shows an assistant working, a shimmering Thinking label with a live timer, steps that tick off one by one and a collapsible panel for the reasoning."
            preview={<AiThinking key={speed} theme={theme} stepDuration={speed} accentColor={accent} />}
            controls={
                <ControlGrid>
                    <RangeControl label="Step time" value={speed} onChange={setSpeed} min={500} max={3000} step={100} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import AiThinking from './ApexUI-Kit/AiThinking/AiThinking.jsx';

const steps = [
  { label: "Reading your files", detail: "3 files, 412 lines" },
  { label: "Planning the change" },
  { label: "Writing code" },
];

// Drive it from your app: pass the current step (steps.length = done).
const App = ({ step }) => <AiThinking steps={steps} step={step} accentColor="${accent}" theme="${theme}" />;

export default App;`}
            cli="ai-thinking"
            props={props}
            dependencies={dependencies}
        />
    );
}
