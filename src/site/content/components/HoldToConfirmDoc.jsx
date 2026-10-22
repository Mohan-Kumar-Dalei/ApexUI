import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import HoldToConfirm from '../../../components/MainUI/ApexUI-Kit/HoldToConfirm/HoldToConfirm.jsx';

const props = [
    { prop: 'onConfirm', type: "(input: 'pointer' | 'keyboard') => void", def: '—', desc: 'Called once the hold completes.' },
    { prop: 'children', type: 'ReactNode', def: '"Hold to delete"', desc: 'Button label.' },
    { prop: 'confirmedLabel', type: 'ReactNode', def: '"Deleted"', desc: 'Shown with a check after confirming.' },
    { prop: 'icon', type: 'component | null', def: 'Trash2', desc: 'Icon before the label; null hides it.' },
    { prop: 'duration', type: 'number', def: '1500', desc: 'How long to hold, in ms.' },
    { prop: 'resetAfter', type: 'number', def: '1800', desc: 'Back to idle after confirming, in ms (0 keeps it confirmed).' },
    { prop: 'color', type: 'string', def: '"#ef4444"', desc: 'Border, fill and confirmed color.' },
    { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disable the button.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Label swap and the cancel shake.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function HoldToConfirmDoc() {
    const [color, setColor] = useState('#ef4444');
    const [duration, setDuration] = useState(1500);
    const [count, setCount] = useState(0);
    return (
        <ComponentDoc
            title="Hold to Confirm"
            description="A button for actions you don't want to trigger by accident — press and hold (pointer, Enter or Space) to fill it; let go early and it drains back with a nudge, finish and it confirms."
            preview={
                <div className="flex flex-col items-center gap-4 text-[var(--ink)]">
                    <HoldToConfirm color={color} duration={duration} onConfirm={() => setCount((c) => c + 1)} />
                    <p className="font-mono text-xs text-[var(--ink-3)]">confirmed {count}×</p>
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <RangeControl label="Hold time" value={duration} onChange={setDuration} min={600} max={4000} step={100} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                </ControlGrid>
            }
            code={`import HoldToConfirm from './ApexUI-Kit/HoldToConfirm/HoldToConfirm.jsx';

const App = () => (
  <HoldToConfirm color="${color}" duration={${duration}} onConfirm={() => deleteProject()}>
    Hold to delete
  </HoldToConfirm>
);

export default App;`}
            cli="hold-to-confirm"
            props={props}
            dependencies={dependencies}
        />
    );
}
