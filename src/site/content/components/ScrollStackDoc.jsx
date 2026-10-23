import { useState } from 'react';
import ComponentDoc, { DocSection } from '../../docs/ComponentDoc.jsx';
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
    { prop: 'useWindowScroll', type: 'boolean', def: 'true', desc: 'Stack with the page scroll (the normal use). Set false to stack inside its own scroll box instead.' },
    { prop: 'height', type: 'string', def: '"100%"', desc: 'Height of the scroll box when useWindowScroll is false.' },
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
            description="Cards pin one after another as you scroll and pile up into a stack. A covered card shrinks a little, darkens and can blur or lean back, so the pile reads as depth. It rides on the page scroll with native sticky positioning and one update per frame, so it stays smooth with mouse, trackpad, touch and keyboard."
            preview={
                // A small browser window stands in for your page here; the section
                // further down stacks with this real page as you scroll.
                <div className="absolute inset-0 flex flex-col p-[clamp(0.5rem,2vw,1.25rem)]">
                    <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-[var(--line)] bg-[var(--panel)] px-3 py-2">
                        <span className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        </span>
                        <span className="mx-auto rounded-md bg-[var(--panel-2)] px-3 py-0.5 font-mono text-[0.68rem] text-[var(--ink-3)]">yoursite.com</span>
                        <a href="#page-demo" className="hidden rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] sm:block">
                            Try it on this page ↓
                        </a>
                    </div>
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-2xl border border-[var(--line)] bg-[#0b0b0e]">
                        <ScrollStack useWindowScroll={false} offset={offset} scaleStep={scaleStep} dim={dim} blur={blur} tilt={tilt} top={24} className="thin-scroll">
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
                </div>
            }
            fullBleed
            extraToc={[{ id: 'page-demo', label: 'On a real page' }]}
            extra={
                <DocSection id="page-demo" title="On a real page" description="This is the normal use: the cards pin under the top of the window and pile up as you scroll this page.">
                    <ScrollStack offset={offset} scaleStep={scaleStep} dim={dim} blur={blur} tilt={tilt} top={96} gap={110} endSpace={60}>
                        {CARDS.map(([n, title, body, bg]) => (
                            <ScrollStackItem key={n} className="flex flex-col justify-between text-white" style={{ background: bg }}>
                                <span className="font-mono text-sm opacity-70">{n} / 05</span>
                                <div>
                                    <h3 className="text-[clamp(1.6rem,5cqw,2.4rem)] font-bold leading-tight">{title}</h3>
                                    <p className="mt-2 max-w-xs text-sm opacity-85">{body}</p>
                                </div>
                            </ScrollStackItem>
                        ))}
                    </ScrollStack>
                </DocSection>
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
  <ScrollStack offset={${offset}} scaleStep={${scaleStep}} dim={${dim}}${blur ? ` blur={${blur}}` : ''}${tilt ? ` tilt={${tilt}}` : ''}>
    <ScrollStackItem className="bg-indigo-500 text-white">First card</ScrollStackItem>
    <ScrollStackItem className="bg-sky-500 text-white">Second card</ScrollStackItem>
    <ScrollStackItem className="bg-rose-500 text-white">Third card</ScrollStackItem>
  </ScrollStack>
);

// Stacks with the page scroll by default. To stack inside a box instead:
// <ScrollStack useWindowScroll={false} height="32rem">...</ScrollStack>

export default App;`}
            cli="scroll-stack"
            props={props}
            dependencies={dependencies}
        />
    );
}
