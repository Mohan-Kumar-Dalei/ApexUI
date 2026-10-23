import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import CircularCarousel from '../../../components/MainUI/ApexUI-Kit/CircularCarousel/CircularCarousel.jsx';

const props = [
    { prop: 'items', type: '{ src: string, title?: string }[]', def: 'demo images', desc: 'Cards on the ring. Images are cover cropped to the card shape.' },
    { prop: 'cardWidth', type: 'number', def: '1', desc: 'Card width in scene units (the camera fits the ring, so this mostly sets the ring size relative to the cards).' },
    { prop: 'aspectRatio', type: 'number', def: '0.8', desc: 'Card width / height.' },
    { prop: 'gap', type: 'number', def: '0.12', desc: 'Space between cards, as a fraction of the card width.' },
    { prop: 'speed', type: 'number', def: '12', desc: 'Autoplay drift in degrees per second.' },
    { prop: 'autoplay', type: 'boolean', def: 'true', desc: 'Keep the ring drifting on its own.' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'true', desc: 'Stop drifting while the pointer is over it.' },
    { prop: 'snap', type: 'boolean', def: 'true', desc: 'Settle on the nearest card after a throw.' },
    { prop: 'tilt', type: 'number', def: '-6', desc: 'Camera tilt in degrees (negative looks down on the ring).' },
    { prop: 'depthFade', type: 'number', def: '0.6', desc: 'How much cards facing away fade into fadeColor (0 to 1).' },
    { prop: 'fadeColor', type: 'string', def: '"#0a0a0a"', desc: 'Color far cards fade into. Use your background.' },
    { prop: 'cornerRadius', type: 'number', def: '0.06', desc: 'Card corner radius, as a fraction of the card height.' },
    { prop: 'captions', type: 'boolean', def: 'true', desc: 'Show the front card title and index.' },
    { prop: 'height', type: 'string', def: '"28rem"', desc: 'Height of the carousel.' },
    { prop: 'onChange', type: '(index: number) => void', def: 'undefined', desc: 'Called when a new card reaches the front.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Three.js', desc: 'WebGL cards bent onto a cylinder in a vertex shader.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CircularCarouselDoc() {
    const theme = useSiteTheme();
    const [speed, setSpeed] = useState(12);
    const [tilt, setTilt] = useState(-6);
    const [gap, setGap] = useState(0.12);
    const [depthFade, setDepthFade] = useState(0.6);
    const [autoplay, setAutoplay] = useState(true);
    const [snap, setSnap] = useState(true);
    const fadeColor = theme === 'light' ? '#f4f4f5' : '#0b0b0e';

    return (
        <ComponentDoc
            title="Circular Carousel"
            description="Image cards bent around a 3D ring and drawn in WebGL. It drifts on its own; drag or flick to throw it and it glides, then settles on a card. Hover pauses it, a click brings that card to the front, arrow keys step through, and cards turning away fade into the background."
            preview={<div className="absolute inset-0"><CircularCarousel speed={speed} tilt={tilt} gap={gap} depthFade={depthFade} autoplay={autoplay} snap={snap} fadeColor={fadeColor} height="100%" /></div>}
            controls={
                <ControlGrid>
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={40} step={1} format={(v) => `${v}°/s`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-20} max={20} step={1} format={(v) => `${v}°`} />
                    <RangeControl label="Gap" value={gap} onChange={setGap} min={0} max={0.5} step={0.02} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Depth fade" value={depthFade} onChange={setDepthFade} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <ToggleControl label="Autoplay" value={autoplay} onChange={setAutoplay} />
                    <ToggleControl label="Snap" value={snap} onChange={setSnap} />
                </ControlGrid>
            }
            code={`import CircularCarousel from './ApexUI-Kit/CircularCarousel/CircularCarousel.jsx';

const items = [
  { src: '/images/one.jpg', title: 'One' },
  { src: '/images/two.jpg', title: 'Two' },
  // ...at least 6 work best
];

const App = () => (
  <CircularCarousel
    items={items}
    speed={${speed}}
    tilt={${tilt}}
    gap={${gap}}
    depthFade={${depthFade}}
    fadeColor="${fadeColor}"${autoplay ? '' : '\n    autoplay={false}'}${snap ? '' : '\n    snap={false}'}
  />
);

export default App;`}
            cli="circular-carousel"
            props={props}
            dependencies={dependencies}
        />
    );
}
