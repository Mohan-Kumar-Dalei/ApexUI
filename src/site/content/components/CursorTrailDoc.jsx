import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import CursorTrail from '../../../components/MainUI/ApexUI-Kit/CursorTrail/CursorTrail.jsx';

const props = [
    { prop: 'variant', type: "'comet' | 'rainbow' | 'dots' | 'ribbon' | 'sparkles' | 'ghost'", def: '"comet"', desc: 'Tail style.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Tail color (hex; rainbow ignores it).' },
    { prop: 'size', type: 'number', def: '1', desc: 'Thickness multiplier.' },
    { prop: 'length', type: 'number', def: '1', desc: 'Tail length multiplier.' },
    { prop: 'global', type: 'boolean', def: 'false', desc: 'Follow the mouse across the whole page instead of one area.' },
    { prop: 'children', type: 'ReactNode', def: '—', desc: 'The area the tail lives in (when not global).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Canvas 2D', desc: 'One canvas, and the loop sleeps once the tail fades.' },
];

const VARIANTS = [
    { id: 'comet', name: 'Comet', description: 'A glowing tapered streak that fades behind the pointer.' },
    { id: 'rainbow', name: 'Rainbow', description: 'The comet, cycling through every hue as it moves.' },
    { id: 'dots', name: 'Dots', description: 'A chain of dots that springs along after the pointer.' },
    { id: 'ribbon', name: 'Ribbon', description: 'A smooth ribbon that snakes after the pointer and tapers off.' },
    { id: 'sparkles', name: 'Sparkles', description: 'Little star sparks fly off and fall as you move.' },
    { id: 'ghost', name: 'Ghost Rings', description: 'Echo rings ripple out from the path of the pointer.' },
];

function Area({ children }) {
    return (
        <div className="flex h-[24rem] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--line-strong)] text-center">
            {children}
        </div>
    );
}

export default function CursorTrailDoc() {
    const [color, setColor] = useState('#a3e635');
    const [size, setSize] = useState(1);
    const [length, setLength] = useState(1);

    const controls = (
        <ControlGrid>
            <ColorControl label="Color" value={color} onChange={setColor} />
            <RangeControl label="Thickness" value={size} onChange={setSize} min={0.4} max={2.5} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
            <RangeControl label="Length" value={length} onChange={setLength} min={0.4} max={3} step={0.1} format={(v) => `${v.toFixed(1)}×`} />
        </ControlGrid>
    );

    const variants = VARIANTS.map((v) => ({
        name: v.name,
        description: v.description,
        preview: (
            <CursorTrail variant={v.id} color={color} size={size} length={length} className="w-full">
                <Area>
                    <p className="font-display text-2xl font-semibold text-[var(--ink)]">Move your mouse here</p>
                    <p className="text-sm text-[var(--ink-3)]">{v.name} trail</p>
                </Area>
            </CursorTrail>
        ),
        controls,
        code: `import CursorTrail from './ApexUI-Kit/CursorTrail/CursorTrail.jsx';

// Around one section…
const Hero = () => (
  <CursorTrail variant="${v.id}" color="${color}" size={${size}} length={${length}}>
    <section className="h-screen">…</section>
  </CursorTrail>
);

// …or across the whole page.
const App = () => <CursorTrail variant="${v.id}" global />;

export default App;`,
        cli: 'cursor-trail',
        props,
        dependencies,
    }));

    return (
        <ComponentDoc
            title="Cursor Trail"
            description="A tail that follows the mouse — comet, rainbow, dots, ribbon, sparkles or ghost rings — around one area or across the whole page."
            variants={variants}
        />
    );
}
