import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import ScrollStack, { ScrollStackItem } from '../../../components/MainUI/ApexUI-Kit/ScrollStack/ScrollStack.jsx';

const CARDS = [
    ['01', 'Design', 'Sketch the layout and pick a palette.', 'linear-gradient(135deg,#6366f1,#8b5cf6)'],
    ['02', 'Build', 'Drop in components with one CLI command.', 'linear-gradient(135deg,#0ea5e9,#22d3ee)'],
    ['03', 'Animate', 'Motion that feels smooth on every screen.', 'linear-gradient(135deg,#f97316,#f43f5e)'],
    ['04', 'Ship', 'Push it live and watch it scroll.', 'linear-gradient(135deg,#10b981,#84cc16)'],
    ['05', 'Repeat', 'Pick the next idea and stack it up.', 'linear-gradient(135deg,#ec4899,#a855f7)'],
];

const props = [
    { prop: 'children', type: 'ScrollStackItem[]', def: 'required', desc: 'The cards. Wrap each one in ScrollStackItem (or any element with a fixed height).' },
    { prop: 'gap', type: 'number', def: '90', desc: 'Scroll distance between cards before they stack, in px.' },
    { prop: 'offset', type: 'number', def: '22', desc: 'How much of each stacked card peeks out above the next, in px.' },
    { prop: 'top', type: 'number', def: '64', desc: 'Where the first card pins, in px from the top of the scroll area.' },
    { prop: 'scaleStep', type: 'number', def: '0.05', desc: 'How much a card shrinks for each card stacked on it.' },
    { prop: 'minScale', type: 'number', def: '0.82', desc: 'Smallest a buried card gets.' },
    { prop: 'dim', type: 'number', def: '0.22', desc: 'How much a covered card darkens per card on top (0 to 1).' },
    { prop: 'blur', type: 'number', def: '0', desc: 'Blur in px per card stacked on top (0 turns it off).' },
    { prop: 'tilt', type: 'number', def: '0', desc: 'Degrees a covered card leans back.' },
    { prop: 'endSpace', type: 'number', def: '180', desc: 'Extra scroll room after the last card, in px.' },
    { prop: 'useWindowScroll', type: 'boolean', def: 'false', desc: 'Stack with the page scroll instead of its own scroll box.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'Height of the scroll box (ignored with useWindowScroll).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes. ScrollStackItem also takes className and style.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ScrollStackDoc() {
    const [offset, setOffset] = useState(22);
    const [scaleStep, setScaleStep] = useState(0.05);
    const [dim, setDim] = useState(0.22);
    const [blur, setBlur] = useState(0);
    const [tilt, setTilt] = useState(0);

    return (
        <ComponentDoc
            title="Scroll Stack"
            description="Cards pin one after another as you scroll and pile up into a stack. A covered card shrinks a little, darkens and can blur or lean back, so the pile reads as depth. It rides on native sticky scrolling with one update per frame, so it stays smooth with mouse, trackpad, touch and keyboard."
            preview={
                <div className="absolute inset-0">
                    <ScrollStack offset={offset} scaleStep={scaleStep} dim={dim} blur={blur} tilt={tilt} top={40} className="thin-scroll">
                        {CARDS.map(([n, title, body, bg]) => (
                            <ScrollStackItem key={n} className="mx-auto flex max-w-xl flex-col justify-between text-white" style={{ background: bg }}>
                                <span className="font-mono text-sm opacity-70">{n} / 05</span>
                                <div>
                                    <h3 className="text-[clamp(1.6rem,5cqw,2.4rem)] font-bold leading-tight">{title}</h3>
                                    <p className="mt-2 max-w-xs text-sm opacity-85">{body}</p>
                                </div>
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </div>
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Peek" value={offset} onChange={setOffset} min={0} max={48} step={1} format={(v) => `${v}px`} />
                    <RangeControl label="Shrink" value={scaleStep} onChange={setScaleStep} min={0} max={0.12} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Dim" value={dim} onChange={setDim} min={0} max={0.6} step={0.02} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Blur" value={blur} onChange={setBlur} min={0} max={6} step={0.5} format={(v) => `${v}px`} />
                    <RangeControl label="Lean" value={tilt} onChange={setTilt} min={0} max={20} step={1} format={(v) => `${v}°`} />
                </ControlGrid>
            }
            code={`import ScrollStack, { ScrollStackItem } from './ApexUI-Kit/ScrollStack/ScrollStack.jsx';

const App = () => (
  <ScrollStack height="32rem" offset={${offset}} scaleStep={${scaleStep}} dim={${dim}}${blur ? ` blur={${blur}}` : ''}${tilt ? ` tilt={${tilt}}` : ''}>
    <ScrollStackItem className="bg-indigo-500 text-white">First card</ScrollStackItem>
    <ScrollStackItem className="bg-sky-500 text-white">Second card</ScrollStackItem>
    <ScrollStackItem className="bg-rose-500 text-white">Third card</ScrollStackItem>
  </ScrollStack>
);

// Or stack with the page scroll:
// <ScrollStack useWindowScroll>...</ScrollStack>

export default App;`}
            cli="scroll-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
