import { useRef, useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import ToastStack from '../../../components/MainUI/ApexUI-Kit/ToastStack/ToastStack.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'position', type: "'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'", def: '"bottom-right"', desc: 'Corner the stack lives in.' },
    { prop: 'duration', type: 'number', def: '4000', desc: 'Milliseconds before a toast closes (paused while hovered).' },
    { prop: 'max', type: 'number', def: '4', desc: 'Most toasts kept at once; the oldest drop off.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Toast colors.' },
    { prop: 'contained', type: 'boolean', def: 'false', desc: 'Position inside the nearest relative parent instead of the viewport.' },
    { prop: 'ref.show', type: '({ title, description?, type? }) => id', def: 'none', desc: 'Adds a toast. type is success, error, warning or info.' },
    { prop: 'ref.dismiss', type: '(id) => void', def: 'none', desc: 'Closes a toast early.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Stack layout, fan-out and swipe to dismiss.' },
    { name: 'Lucide React', desc: 'Status icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const SAMPLES = [
    { type: 'success', title: 'Changes saved', description: 'Your profile is up to date.' },
    { type: 'info', title: 'New version', description: 'ApexUI 2.2 is out, 15 new components.' },
    { type: 'warning', title: 'Storage almost full', description: 'You have used 92% of your space.' },
    { type: 'error', title: 'Upload failed', description: 'The file is larger than 10 MB.' },
];

export default function ToastStackDoc() {
    const theme = useSiteTheme();
    const toast = useRef(null);
    const [position, setPosition] = useState('bottom-right');
    const [duration, setDuration] = useState(4000);

    const code = `import { useRef } from 'react';
import ToastStack from './ApexUI-Kit/ToastStack/ToastStack.jsx';

const App = () => {
  const toast = useRef(null);
  return (
    <>
      <button onClick={() => toast.current.show({ type: "success", title: "Changes saved" })}>
        Save
      </button>
      <ToastStack ref={toast} position="${position}" duration={${duration}} theme="${theme}" />
    </>
  );
};

export default App;`;

    const btn = 'rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--lime-line)] active:scale-95';

    return (
        <ComponentDoc
            title="Toast Stack"
            description="Notifications that pile up as a neat stack, fan out when hovered, pause while you read and swipe away with a flick."
            preview={
                <div className="relative flex h-[24rem] w-full items-center justify-center">
                    <div className="flex flex-wrap justify-center gap-2">
                        {SAMPLES.map((s) => (
                            <button key={s.type} type="button" className={btn} onClick={() => toast.current?.show(s)}>
                                {s.type[0].toUpperCase() + s.type.slice(1)}
                            </button>
                        ))}
                    </div>
                    <ToastStack ref={toast} key={position} position={position} duration={duration} theme={theme} contained />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl
                        label="Position"
                        value={position}
                        onChange={setPosition}
                        options={['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center'].map((p) => ({ value: p, label: p.replace('-', ' ') }))}
                    />
                    <RangeControl label="Auto close" value={duration} onChange={setDuration} min={1500} max={10000} step={500} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                </ControlGrid>
            }
            code={code}
            cli="toast-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
