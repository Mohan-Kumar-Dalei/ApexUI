import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import InfiniteCanvas from '../../../components/MainUI/ApexUI-Kit/InfiniteCanvas/InfiniteCanvas.jsx';

const props = [
    { prop: 'items', type: '{ image: string, title?: string }[]', def: 'demo images', desc: 'Cards on the wall. They repeat in every direction.' },
    { prop: 'cardWidth', type: 'number', def: '14', desc: 'Card width in rem (cards shrink on small screens so a few always fit).' },
    { prop: 'aspectRatio', type: 'number', def: '0.8', desc: 'Card width / height.' },
    { prop: 'gap', type: 'number', def: '1.25', desc: 'Space between cards in rem.' },
    { prop: 'drift', type: 'number', def: '18', desc: 'Idle drift speed in px per second (0 holds still).' },
    { prop: 'tilt', type: 'number', def: '1', desc: 'How much cards lean with the speed of a drag (0 keeps them flat).' },
    { prop: 'friction', type: 'number', def: '0.93', desc: 'How quickly a flick slows down (lower stops sooner).' },
    { prop: 'showTitles', type: 'boolean', def: 'true', desc: 'Show the item title on hover.' },
    { prop: 'height', type: 'string', def: '"34rem"', desc: 'Height of the canvas.' },
    { prop: 'onItemClick', type: '(item, index) => void', def: 'undefined', desc: 'Called when a card is clicked (not dragged).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function InfiniteCanvasDoc() {
    const [cardWidth, setCardWidth] = useState(14);
    const [drift, setDrift] = useState(18);
    const [tilt, setTilt] = useState(1);
    const [titles, setTitles] = useState(true);
    const [picked, setPicked] = useState('');

    return (
        <ComponentDoc
            title="Infinite Canvas"
            description="An endless wall of image cards you can drag, flick or scroll in any direction. It glides to a stop with momentum, cards lean with the speed of the move and settle flat again, and the wall drifts on its own while nobody touches it. Only enough cards to fill the view are rendered and recycled at the edges."
            preview={
                <div className="absolute inset-0">
                    <InfiniteCanvas cardWidth={cardWidth} drift={drift} tilt={tilt} showTitles={titles} height="100%" onItemClick={(item) => setPicked(item.title)} />
                    {picked && <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">Clicked: {picked}</p>}
                </div>
            }
            fullBleed
            controls={
                <ControlGrid>
                    <RangeControl label="Card width" value={cardWidth} onChange={setCardWidth} min={8} max={22} step={0.5} format={(v) => `${v}rem`} />
                    <RangeControl label="Drift" value={drift} onChange={setDrift} min={0} max={80} step={2} format={(v) => `${v}px/s`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
                    <ToggleControl label="Titles" value={titles} onChange={setTitles} />
                </ControlGrid>
            }
            code={`import InfiniteCanvas from './ApexUI-Kit/InfiniteCanvas/InfiniteCanvas.jsx';

const items = [
  { image: '/images/one.jpg', title: 'One' },
  { image: '/images/two.jpg', title: 'Two' },
  // ...more cards repeat better
];

const App = () => (
  <InfiniteCanvas
    items={items}
    cardWidth={${cardWidth}}
    drift={${drift}}
    tilt={${tilt}}${titles ? '' : '\n    showTitles={false}'}
    onItemClick={(item) => console.log(item.title)}
  />
);

export default App;`}
            cli="infinite-canvas"
            props={props}
            dependencies={dependencies}
        />
    );
}
