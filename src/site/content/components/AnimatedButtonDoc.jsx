import { useCallback, useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import AnimatedButton from '../../../components/MainUI/ApexUI-Kit/AnimatedButton/AnimatedButton.jsx';
import HoldToConfirm from '../../../components/MainUI/ApexUI-Kit/HoldToConfirm/HoldToConfirm.jsx';
import UndoNotice from '../../../components/MainUI/ApexUI-Kit/HoldToConfirm/UndoNotice.jsx';
import { Trash2 } from 'lucide-react';

const VARIANTS = [
    { variant: 'shine', label: 'Get started', hint: 'Hover' },
    { variant: 'fill', label: 'Explore', hint: 'Hover from any side' },
    { variant: 'border', label: 'Upgrade to Pro', hint: 'Always on' },
    { variant: 'press', label: 'Press me', hint: 'Click & hold' },
    { variant: 'loading', label: 'Save changes', hint: 'Click' },
    { variant: 'ripple', label: 'Ripple', hint: 'Click anywhere' },
    { variant: 'arrow', label: 'Continue', hint: 'Hover' },
];

const props = [
    { prop: 'variant', type: "'shine' | 'fill' | 'border' | 'press' | 'loading' | 'ripple' | 'arrow'", def: '"shine"', desc: 'The animation style.' },
    { prop: 'children', type: 'ReactNode', def: '"Get started"', desc: 'Button label.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Accent color; the label turns black or white to stay readable.' },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", def: '"md"', desc: 'Button size.' },
    { prop: 'onClick', type: '(event) => void | Promise', def: '—', desc: 'For "loading", return a promise and the button waits for it before showing the check.' },
    { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disable the button.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
    { prop: '...rest', type: 'any', def: '—', desc: 'Other props (type, aria-*, …) go to the <button>.' },
];

const holdProps = [
    { prop: 'onConfirm', type: "(input: 'pointer' | 'keyboard') => void", def: '—', desc: 'HoldToConfirm: called once the hold completes.' },
    { prop: 'children', type: 'ReactNode', def: '"Hold to confirm"', desc: 'HoldToConfirm: button content (icon + label).' },
    { prop: 'confirmedContent', type: 'ReactNode', def: '✓ Confirmed', desc: 'HoldToConfirm: shown after confirming.' },
    { prop: 'duration', type: 'number', def: '1600', desc: 'HoldToConfirm: how long to hold, in ms.' },
    { prop: 'resetAfter', type: 'number', def: '1800', desc: 'HoldToConfirm: back to idle after confirming, in ms (0 keeps it confirmed).' },
    { prop: 'disabled', type: 'boolean', def: 'false', desc: 'HoldToConfirm: disable (cancels a hold in progress).' },
    { prop: 'message', type: 'string', def: '"Project deleted"', desc: 'UndoNotice: what just happened.' },
    { prop: 'duration ', type: 'number', def: '5000', desc: 'UndoNotice: time to undo, in ms.' },
    { prop: 'onUndo', type: "(input: 'pointer' | 'keyboard') => void", def: '—', desc: 'UndoNotice: called when Undo is pressed.' },
    { prop: 'onExpire', type: '() => void', def: '—', desc: 'UndoNotice: called when the time runs out.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes (both).' },
];

const holdDependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Reduced-motion check.' },
    { name: 'Lucide React', desc: 'Trash, check and undo icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Fill, ripple, beam and loading-state motion.' },
    { name: 'Lucide React', desc: 'Arrow, spinner and check icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AnimatedButtonDoc() {
    const [color, setColor] = useState('#a3e635');
    const [size, setSize] = useState('md');
    const [holdTime, setHoldTime] = useState(1600);
    const [stage, setStage] = useState('idle'); // closed | idle | undo
    const closeNotice = useCallback(() => setStage('closed'), []);

    const code = `import AnimatedButton from './ApexUI-Kit/AnimatedButton/AnimatedButton.jsx';

const save = () => fetch('/api/save', { method: 'POST' });

const App = () => (
  <div className="flex flex-wrap gap-4">
${VARIANTS.map((v) => `    <AnimatedButton variant="${v.variant}" color="${color}" size="${size}"${v.variant === 'loading' ? ' onClick={save}' : ''}>${v.label}</AnimatedButton>`).join('\n')}
  </div>
);

export default App;`;

    return (
        <ComponentDoc
            title="Animated Buttons"
            description="Buttons with feel — shine, directional fill, border beam, 3D press, loading-to-success, ripple, sliding arrow, and a hold-to-confirm button for actions you don't want to trigger by accident."
            variants={[
                {
                    name: 'Animated',
                    description: "One button with seven feels — shine, directional fill, border beam, 3D press, loading-to-success, ripple and sliding arrow — each with hover and press states.",
                    preview: (
                        <div className="grid w-full max-w-2xl grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-4 gap-y-7">
                            {VARIANTS.map((v) => (
                                <div key={v.variant} className="flex flex-col items-center gap-2.5">
                                    <AnimatedButton variant={v.variant} color={color} size={size}>
                                        {v.label}
                                    </AnimatedButton>
                                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                                        {v.variant} · {v.hint}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                    controls: (
                        <ControlGrid>
                            <ColorControl label="Color" value={color} onChange={setColor} />
                            <SelectControl label="Size" value={size} onChange={setSize} options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />
                        </ControlGrid>
                    ),
                    code,
                    cli: 'animated-button',
                    props,
                    dependencies,
                },
                {
                    name: 'Hold to Confirm',
                    description: "Press and hold (pointer, Enter or Space) and a solid copy of the button wipes in; let go, slide off or lose focus and it snaps back. Finish the hold and an Undo notice counts down before the delete is final.",
                    preview: (
                        <div className="flex min-h-[6rem] w-full flex-col items-center justify-center gap-4 text-[var(--ink)]">
                            {stage === 'idle' && (
                                <HoldToConfirm duration={holdTime} onConfirm={() => setStage('undo')} resetAfter={0}>
                                    <Trash2 aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={2.5} />
                                    Hold to delete
                                </HoldToConfirm>
                            )}
                            {stage === 'undo' && <UndoNotice onExpire={closeNotice} onUndo={() => setStage('idle')} />}
                            {stage === 'closed' && (
                                <button type="button" onClick={() => setStage('idle')} className="font-mono text-xs text-[var(--ink-3)] underline underline-offset-4">
                                    deleted — reset demo
                                </button>
                            )}
                        </div>
                    ),
                    controls: (
                        <ControlGrid>
                            <RangeControl label="Hold time" value={holdTime} onChange={setHoldTime} min={600} max={4000} step={100} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                        </ControlGrid>
                    ),
                    code: `import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import HoldToConfirm from './ApexUI-Kit/HoldToConfirm/HoldToConfirm.jsx';
import UndoNotice from './ApexUI-Kit/HoldToConfirm/UndoNotice.jsx';

export function DeleteAction() {
  const [stage, setStage] = useState("idle"); // "closed" | "idle" | "undo"

  if (stage === "closed") {
    return null;
  }

  if (stage === "undo") {
    return (
      <UndoNotice
        onExpire={() => setStage("closed")}
        onUndo={() => setStage("idle")}
      />
    );
  }

  return (
    <HoldToConfirm
      duration={${holdTime}}
      onConfirm={() => setStage("undo")}
      resetAfter={0}
    >
      <Trash2 aria-hidden="true" size={15} strokeWidth={2.5} />
      Hold to delete
    </HoldToConfirm>
  );
}`,
                    cli: 'hold-to-confirm',
                    props: holdProps,
                    dependencies: holdDependencies,
                },
            ]}
        />
    );
}
