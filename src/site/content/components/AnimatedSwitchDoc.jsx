import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import AnimatedSwitch from '../../../components/MainUI/ApexUI-Kit/AnimatedSwitch/AnimatedSwitch.jsx';

const props = [
    { prop: 'variant', type: "'classic' | 'icon' | 'daynight' | 'neon'", def: '"classic"', desc: 'Switch style.' },
    { prop: 'checked', type: 'boolean', def: 'none', desc: 'Controlled value (pair it with onChange).' },
    { prop: 'defaultChecked', type: 'boolean', def: 'false', desc: 'Starting value when uncontrolled.' },
    { prop: 'onChange', type: '(checked) => void', def: 'none', desc: 'Called with the new value.' },
    { prop: 'label', type: 'string', def: 'none', desc: 'Text next to the switch.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'On color (classic, icon, neon).' },
    { prop: 'size', type: 'number', def: '1', desc: 'Size multiplier.' },
    { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disable the switch.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Knob spring, stretch and twinkling stars.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const DEMOS = [
    { variant: 'classic', label: 'Notifications' },
    { variant: 'icon', label: 'Auto-save' },
    { variant: 'daynight', label: 'Night mode' },
    { variant: 'neon', label: 'Turbo' },
];

export default function AnimatedSwitchDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const [size, setSize] = useState(1.2);

    const code = `import { useState } from 'react';
import AnimatedSwitch from './ApexUI-Kit/AnimatedSwitch/AnimatedSwitch.jsx';

const App = () => {
  const [night, setNight] = useState(false);
  return (
    <>
${DEMOS.map((d) => `      <AnimatedSwitch variant="${d.variant}" label="${d.label}" accentColor="${accent}" size={${size}}${d.variant === 'daynight' ? ' checked={night} onChange={setNight}' : ''} />`).join('\n')}
    </>
  );
};

export default App;`;

    return (
        <ComponentDoc
            title="Animated Switches"
            description="Toggles with personality, a classic pill whose knob stretches as it moves, icon knobs, a day-to-night sky and a glowing neon track."
            preview={
                <div className="grid gap-6 text-[var(--ink)] sm:grid-cols-2">
                    {DEMOS.map((d, i) => (
                        <AnimatedSwitch key={d.variant} variant={d.variant} label={d.label} accentColor={accent} size={size} defaultChecked={i % 2 === 0} />
                    ))}
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={0.8} max={2} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
                </ControlGrid>
            }
            code={code}
            cli="animated-switch"
            props={props}
            dependencies={dependencies}
        />
    );
}
