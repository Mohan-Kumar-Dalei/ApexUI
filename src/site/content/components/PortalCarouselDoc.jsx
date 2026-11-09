import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import PortalCarousel from '../../../components/MainUI/ApexUI-Kit/PortalCarousel/PortalCarousel.jsx';

const props = [
    { prop: 'items', type: '{ image, title?, subtitle?, meta?, badge?, alt?, id? }[]', def: 'seven Avengers', desc: 'One arch per item. title, subtitle and meta (a price, a date) show under the front arch; badge sits on the arch.' },
    { prop: 'variant', type: "'curve' | 'stage'", def: '"curve"', desc: 'curve: side arches turn away in 3D and the front one gets a frame. stage: side arches shrink, sink and blur.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Text, line and badge colours for a dark or a light section.' },
    { prop: 'frameColor', type: 'string', def: '"#C9A253"', desc: 'Frame of the front arch and the price colour (curve).' },
    { prop: 'height', type: 'string', def: '"clamp(18rem, min(58svh, 118vw), 34rem)"', desc: 'Height of the arches. Width follows from ratio, so it fits laptops, big screens and phones.' },
    { prop: 'ratio', type: 'number', def: '0.6', desc: 'Width of an arch divided by its height.' },
    { prop: 'visible', type: 'number', def: '2', desc: 'Arches shown on each side of the front one.' },
    { prop: 'startIndex', type: 'number', def: '0', desc: 'Item in front at first.' },
    { prop: 'autoPlay', type: 'number', def: '0', desc: 'Milliseconds between moves; 0 is off. Pauses on hover and focus.' },
    { prop: 'showCaption', type: 'boolean', def: 'true', desc: 'Caption and arrows (curve) or progress, counter and arrows (stage).' },
    { prop: 'renderActions', type: '(item, index) => ReactNode', def: 'none', desc: 'Your buttons between the arrows, for example Add to bag.' },
    { prop: 'onChange', type: '(index, item) => void', def: 'none', desc: 'Called when the front arch changes.' },
    { prop: 'label', type: 'string', def: '"Gallery"', desc: 'Accessible name of the carousel.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the outer element.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Moves, turns and blurs the arches.' },
    { name: 'Lucide React', desc: 'The arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const opts = (list) => list.map(([value, label]) => ({ value, label }));

export default function PortalCarouselDoc() {
    const [variant, setVariant] = useState('curve');
    const [theme, setTheme] = useState('dark');
    const [frame, setFrame] = useState('#C9A253');
    const [visible, setVisible] = useState(2);
    const [auto, setAuto] = useState(false);

    const code = `import PortalCarousel from './ApexUI-Kit/PortalCarousel/PortalCarousel.jsx';

const heroes = [
  { image: "/ironman.png", title: "Iron Man", subtitle: "Mark 85 armour", meta: "Tony Stark" },
  { image: "/spiderman.png", title: "Spider-Man", subtitle: "Web shooters and good timing", meta: "Peter Parker", badge: "Fan pick" },
  { image: "/hulk.png", title: "Hulk", subtitle: "Strongest there is", meta: "Bruce Banner" },
];

const App = () => (
  <section style={{ background: "${theme === 'dark' ? '#1C1714' : '#FBF7F1'}" }}>
    <PortalCarousel
      items={heroes}
      variant="${variant}"
      theme="${theme}"
      frameColor="${frame}"
      visible={${visible}}${auto ? '\n      autoPlay={4000}' : ''}
      renderActions={(item) => <button>Read more</button>}
    />
  </section>
);

export default App;`;

    return (
        <ComponentDoc
            title="Portal Carousel"
            description="Photos in arch-topped frames: the one in front large and sharp, the rest stepping back. Curve turns the sides away in 3D with a framed front arch and a caption; stage shrinks and blurs them with a progress bar. Drag, swipe, keys or a click on a side arch."
            previewClassName="!px-0"
            preview={
                <div className="w-full rounded-[1.2rem] px-4 py-10" style={{ background: theme === 'dark' ? '#1C1714' : '#FBF7F1', fontFamily: 'Georgia, serif' }}>
                    <PortalCarousel key={`${variant}-${visible}`} variant={variant} theme={theme} frameColor={frame} visible={visible} autoPlay={auto ? 3500 : 0} startIndex={1} height="clamp(16rem, min(46svh, 100vw), 28rem)" />
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Variant" value={variant} onChange={setVariant} options={opts([['curve', 'Curve'], ['stage', 'Stage']])} />
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={opts([['dark', 'Dark'], ['light', 'Light']])} />
                    <RangeControl label="Side arches" value={visible} onChange={setVisible} min={1} max={3} />
                    <ColorControl label="Frame" value={frame} onChange={setFrame} />
                    <ToggleControl label="Autoplay" value={auto} onChange={setAuto} />
                </ControlGrid>
            }
            code={code}
            cli="portal-carousel"
            props={props}
            dependencies={dependencies}
        />
    );
}
