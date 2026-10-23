import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import ImageAccordion from '../../../components/MainUI/ApexUI-Kit/ImageAccordion/ImageAccordion.jsx';

const props = [
    { prop: 'items', type: '{ image: string, title: string, description?: string }[]', def: 'demo panels', desc: 'Panels, in order.' },
    { prop: 'defaultActive', type: 'number', def: '0', desc: 'Panel open at the start.' },
    { prop: 'autoPlay', type: 'number', def: '0', desc: 'Seconds between automatic steps (0 is off). Pauses while hovered.' },
    { prop: 'openRatio', type: 'number', def: '4', desc: 'How much wider the open panel is than a folded one.' },
    { prop: 'radius', type: 'number', def: '1.25', desc: 'Corner radius in rem.' },
    { prop: 'gap', type: 'number', def: '0.6', desc: 'Gap between panels in rem.' },
    { prop: 'duration', type: 'number', def: '700', desc: 'Open / close time in ms.' },
    { prop: 'height', type: 'string', def: '"26rem"', desc: 'Height in the row layout (the stacked layout grows to fit).' },
    { prop: 'onChange', type: '(index: number) => void', def: 'undefined', desc: 'Called when another panel opens.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ImageAccordionDoc() {
    const [openRatio, setOpenRatio] = useState(4);
    const [gap, setGap] = useState(0.6);
    const [autoPlay, setAutoPlay] = useState(0);
    const [duration, setDuration] = useState(700);

    return (
        <ComponentDoc
            title="Image Accordion"
            description="A row of image panels where the active one opens wide and the rest fold into slim strips with their titles turned sideways. Hover, focus or tap to open a panel, or let it cycle on its own. In a box narrower than 520px it stacks vertically, so it fits phones."
            preview={
                <div className="w-full max-w-4xl">
                    <ImageAccordion key={duration} openRatio={openRatio} gap={gap} autoPlay={autoPlay} duration={duration} height="24rem" />
                </div>
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Open ratio" value={openRatio} onChange={setOpenRatio} min={2} max={8} step={0.5} format={(v) => `${v}x`} />
                    <RangeControl label="Gap" value={gap} onChange={setGap} min={0} max={1.5} step={0.1} format={(v) => `${v.toFixed(1)}rem`} />
                    <RangeControl label="Auto play" value={autoPlay} onChange={setAutoPlay} min={0} max={8} step={1} format={(v) => (v ? `${v}s` : 'Off')} />
                    <RangeControl label="Duration" value={duration} onChange={setDuration} min={300} max={1400} step={50} format={(v) => `${v}ms`} />
                </ControlGrid>
            }
            code={`import ImageAccordion from './ApexUI-Kit/ImageAccordion/ImageAccordion.jsx';

const items = [
  { image: '/images/one.jpg', title: 'One', description: 'First panel' },
  { image: '/images/two.jpg', title: 'Two', description: 'Second panel' },
  { image: '/images/three.jpg', title: 'Three' },
];

const App = () => <ImageAccordion items={items} openRatio={${openRatio}} gap={${gap}}${autoPlay ? ` autoPlay={${autoPlay}}` : ''} duration={${duration}} />;

export default App;`}
            cli="image-accordion"
            props={props}
            dependencies={dependencies}
        />
    );
}
