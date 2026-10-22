import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import AnimatedButton from '../../../components/MainUI/ApexUI-Kit/AnimatedButton/AnimatedButton.jsx';

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

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Fill, ripple, beam and loading-state motion.' },
    { name: 'Lucide React', desc: 'Arrow, spinner and check icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AnimatedButtonDoc() {
    const [color, setColor] = useState('#a3e635');
    const [size, setSize] = useState('md');

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
            description="One button with seven feels — shine, directional fill, border beam, 3D press, loading-to-success, ripple and sliding arrow — each with hover and press states."
            preview={
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
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <SelectControl label="Size" value={size} onChange={setSize} options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]} />
                </ControlGrid>
            }
            code={code}
            cli="animated-button"
            props={props}
            dependencies={dependencies}
        />
    );
}
