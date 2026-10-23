import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import ArcGallery from '../../../components/MainUI/ApexUI-Kit/ArcGallery/ArcGallery.jsx';

const props = [
    { prop: 'items', type: '{ image: string, text?: string }[]', def: 'demo images', desc: 'Cards in the row. It repeats endlessly in both directions.' },
    { prop: 'bend', type: 'number', def: '1', desc: 'How strongly the row curves. Positive bends down at the sides, negative up, 0 is flat.' },
    { prop: 'cardHeight', type: 'number', def: '0.62', desc: 'Card height as a fraction of the gallery height.' },
    { prop: 'aspectRatio', type: 'number', def: '0.78', desc: 'Card width / height.' },
    { prop: 'gap', type: 'number', def: '0.22', desc: 'Space between cards, as a fraction of the card width.' },
    { prop: 'cornerRadius', type: 'number', def: '0.05', desc: 'Card corner radius, as a fraction of the card height.' },
    { prop: 'wave', type: 'number', def: '1', desc: 'Strength of the ripple while it moves (0 turns it off).' },
    { prop: 'pull', type: 'number', def: '1', desc: 'How far the trailing edge of each card bows out, like it is being pulled along, while the gallery moves (0 turns it off).' },
    { prop: 'fadeEdges', type: 'number', def: '0.14', desc: 'Width of the fade at the left and right edges (0 to 0.5).' },
    { prop: 'ease', type: 'number', def: '0.08', desc: 'How quickly it catches up with a drag or scroll. Lower glides longer.' },
    { prop: 'autoScroll', type: 'number', def: '40', desc: 'Auto scroll speed in px per second (0 turns it off; negative goes the other way).' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'true', desc: 'Stop the auto scroll while the pointer is over the gallery.' },
    { prop: 'snap', type: 'boolean', def: 'true', desc: 'Settle on the nearest card when you let go.' },
    { prop: 'showTitles', type: 'boolean', def: 'true', desc: 'Show each item text under its card.' },
    { prop: 'height', type: 'string', def: '"26rem"', desc: 'Height of the gallery.' },
    { prop: 'onChange', type: '(index: number) => void', def: 'undefined', desc: 'Called when a new card reaches the center.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL cards with a shader for corners, fade and ripple.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ArcGalleryDoc() {
    const [bend, setBend] = useState(1);
    const [gap, setGap] = useState(0.22);
    const [wave, setWave] = useState(1);
    const [pull, setPull] = useState(1);
    const [ease, setEase] = useState(0.08);
    const [snap, setSnap] = useState(true);
    const [autoScroll, setAutoScroll] = useState(40);
    const [titles, setTitles] = useState(true);

    return (
        <ComponentDoc
            title="Arc Gallery"
            description="An endless row of image cards laid along a gentle arc and drawn in WebGL. It drifts on its own and pauses on hover; drag, flick or swipe sideways and it eases to a stop on a card. While it moves, each card is pulled along so its trailing edge bows out into a half circle, then springs back flat. Click a card to center it, use arrow keys to step, and the edges fade out."
            preview={<div className="absolute inset-0"><ArcGallery bend={bend} gap={gap} wave={wave} pull={pull} ease={ease} autoScroll={autoScroll} snap={snap} showTitles={titles} height="100%" /></div>}
            controls={
                <ControlGrid>
                    <RangeControl label="Bend" value={bend} onChange={setBend} min={-3} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Gap" value={gap} onChange={setGap} min={0.05} max={0.6} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Pull" value={pull} onChange={setPull} min={0} max={2.5} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Ripple" value={wave} onChange={setWave} min={0} max={3} step={0.1} format={(v) => v.toFixed(1)} />
                    <RangeControl label="Ease" value={ease} onChange={setEase} min={0.02} max={0.3} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Auto scroll" value={autoScroll} onChange={setAutoScroll} min={-120} max={120} step={5} format={(v) => (v ? `${v}px/s` : 'Off')} />
                    <ToggleControl label="Snap" value={snap} onChange={setSnap} />
                    <ToggleControl label="Titles" value={titles} onChange={setTitles} />
                </ControlGrid>
            }
            code={`import ArcGallery from './ApexUI-Kit/ArcGallery/ArcGallery.jsx';

const items = [
  { image: '/images/one.jpg', text: 'One' },
  { image: '/images/two.jpg', text: 'Two' },
  // ...
];

const App = () => (
  <ArcGallery
    items={items}
    bend={${bend}}
    gap={${gap}}
    wave={${wave}}
    pull={${pull}}
    ease={${ease}}
    autoScroll={${autoScroll}}${snap ? '' : '\n    snap={false}'}${titles ? '' : '\n    showTitles={false}'}
  />
);

export default App;`}
            cli="arc-gallery"
            props={props}
            dependencies={dependencies}
        />
    );
}
