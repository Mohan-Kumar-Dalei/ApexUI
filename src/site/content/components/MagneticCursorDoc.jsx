import { useState } from 'react';
import { Github, Instagram, Twitter } from 'lucide-react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import MagneticCursor from '../../../components/MainUI/ApexUI-Kit/MagneticCursor/MagneticCursor.jsx';

const props = [
    { prop: 'children', type: 'ReactNode', def: '—', desc: 'The area that gets the custom cursor.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Ring, dot and label bubble color.' },
    { prop: 'ringSize', type: 'number', def: '2.25', desc: 'Resting ring size, in rem.' },
    { prop: 'padding', type: 'number', def: '6', desc: 'Space between a hovered element and the ring, in px.' },
    { prop: 'magnetStrength', type: 'number', def: '0.35', desc: 'How far data-magnetic elements follow the pointer (0–1).' },
    { prop: 'blend', type: 'boolean', def: 'false', desc: 'Use mix-blend-mode: difference for the ring.' },
    { prop: 'trail', type: "'none' | 'comet' | 'dots' | 'sparkles' | 'ghost'", def: '"none"', desc: 'A tail that follows the cursor.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
    { prop: 'data-cursor-text', type: 'attribute', def: '—', desc: 'Put on any child to show a labelled bubble, e.g. "View".' },
    { prop: 'data-magnetic', type: 'attribute', def: '—', desc: 'Put on any child to make it lean toward the pointer.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring-driven ring morphing.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const IMG = 'https://ik.imagekit.io/ny6yinyut/apexui/assets/doctorStrange.png?tr=f-auto,q-80,w-480';

export default function MagneticCursorDoc() {
    const [color, setColor] = useState('#a3e635');
    const [ringSize, setRingSize] = useState(2.25);
    const [magnet, setMagnet] = useState(0.35);
    const [blend, setBlend] = useState(false);
    const [trail, setTrail] = useState('comet');

    const code = `import MagneticCursor from './ApexUI-Kit/MagneticCursor/MagneticCursor.jsx';

const App = () => (
  <MagneticCursor color="${color}" trail="${trail}" ringSize={${ringSize}} magnetStrength={${magnet}}${blend ? ' blend' : ''}>
    <nav>
      <a href="#">Work</a>
      <a href="#">About</a>
    </nav>
    <img src="/project.jpg" data-cursor-text="View" />
    <button data-magnetic>Let's talk</button>
  </MagneticCursor>
);

export default App;`;

    return (
        <ComponentDoc
            title="Magnetic Cursor"
            description="A dot-and-ring cursor with a following tail (comet, dots, sparkles or ghost rings) — it wraps links and buttons, grows into a labelled bubble over images and pulls magnetic elements toward the pointer."
            preview={
                <MagneticCursor color={color} trail={trail} ringSize={ringSize} magnetStrength={magnet} blend={blend} className="w-full max-w-xl rounded-2xl">
                    <div className="flex flex-col gap-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
                        <nav className="flex items-center justify-between">
                            <span className="font-display text-lg font-semibold">studio.</span>
                            <div className="flex gap-1 text-sm">
                                {['Work', 'About', 'Contact'].map((l) => (
                                    <a key={l} href="#" onClick={(e) => e.preventDefault()} className="rounded-full px-3 py-1.5 text-[var(--ink-2)] hover:text-[var(--ink)]">{l}</a>
                                ))}
                            </div>
                        </nav>
                        <div data-cursor-text="View" className="relative h-44 overflow-hidden rounded-xl bg-neutral-900">
                            <img src={IMG} alt="" className="h-full w-full object-cover opacity-90" draggable="false" />
                            <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">Project — Mystic Arts</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <button type="button" data-magnetic className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)]">Let&apos;s talk</button>
                            <div className="flex gap-2">
                                {[Github, Twitter, Instagram].map((Icon, i) => (
                                    <button key={i} type="button" data-magnetic aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-2)]">
                                        <Icon className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </MagneticCursor>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Trail" value={trail} onChange={setTrail} options={[{ value: 'none', label: 'None' }, { value: 'comet', label: 'Comet' }, { value: 'dots', label: 'Dots' }, { value: 'sparkles', label: 'Sparkles' }, { value: 'ghost', label: 'Ghost rings' }]} />
                    <ColorControl label="Color" value={color} onChange={setColor} />
                    <RangeControl label="Ring size" value={ringSize} onChange={setRingSize} min={1.25} max={4} step={0.25} format={(v) => `${v}rem`} />
                    <RangeControl label="Magnet" value={magnet} onChange={setMagnet} min={0} max={0.8} step={0.05} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Difference blend" value={blend} onChange={setBlend} />
                </ControlGrid>
            }
            code={code}
            cli="magnetic-cursor"
            props={props}
            dependencies={dependencies}
        />
    );
}
