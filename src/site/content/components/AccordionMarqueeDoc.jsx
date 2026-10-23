import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import AccordionMarquee from '../../../components/MainUI/ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';

const props = [
    { prop: 'items', type: '{ title: string, text?: string, image?: string, href?: string }[]', def: 'demo rows', desc: 'Rows. text scrolls in the band (falls back to title); image sits between the repeats.' },
    { prop: 'speed', type: 'number', def: '70', desc: 'Marquee speed in px per second.' },
    { prop: 'direction', type: "'left' | 'right' | 'alternate'", def: '"left"', desc: 'Marquee direction. Alternate flips every other row.' },
    { prop: 'cursorBoost', type: 'number', def: '0.5', desc: 'How much moving the pointer sideways speeds up or reverses the marquee (0 to 1).' },
    { prop: 'duration', type: 'number', def: '0.5', desc: 'Seconds the band takes to glide to a row.' },
    { prop: 'stretch', type: 'number', def: '0.6', desc: 'How much the band stretches while it travels (0 is rigid).' },
    { prop: 'magnet', type: 'number', def: '0.2', desc: 'How much the band leans toward the pointer inside a row (0 to 1).' },
    { prop: 'bgColor', type: 'string', def: '"#bbf451"', desc: 'Band color.' },
    { prop: 'textColor', type: 'string', def: '"#18181b"', desc: 'Text color inside the band.' },
    { prop: 'menuBg', type: 'string', def: '"#0f0f12"', desc: 'Menu background.' },
    { prop: 'menuColor', type: 'string', def: '"#fafafa"', desc: 'Row title color.' },
    { prop: 'lineColor', type: 'string', def: '"rgba(255,255,255,0.14)"', desc: 'Lines between rows.' },
    { prop: 'inset', type: 'number', def: '0', desc: 'Gap between the band and the row edges, in px.' },
    { prop: 'radius', type: 'number', def: '0', desc: 'Band corner radius in px (large values give a pill).' },
    { prop: 'imageShape', type: "'pill' | 'rounded' | 'circle'", def: '"pill"', desc: 'Shape of the images in the band.' },
    { prop: 'showIndex', type: 'boolean', def: 'false', desc: 'Number each row.' },
    { prop: 'dimOthers', type: 'boolean', def: 'false', desc: 'Fade the other rows while the band is on one.' },
    { prop: 'intro', type: 'boolean', def: 'true', desc: 'Titles rise in and the lines draw on mount.' },
    { prop: 'height', type: 'string', def: '"32rem"', desc: 'Menu height. Rows share it equally.' },
    { prop: 'onSelect', type: '(item, index, event) => void', def: 'undefined', desc: 'Called when a row is clicked.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AccordionMarqueeDoc() {
    const theme = useSiteTheme();
    const light = theme === 'light';
    const [band, setBand] = useState('#bbf451');
    const [speed, setSpeed] = useState(70);
    const [stretch, setStretch] = useState(0.6);
    const [magnet, setMagnet] = useState(0.2);
    const [direction, setDirection] = useState('left');
    const [radius, setRadius] = useState(0);
    const [showIndex, setShowIndex] = useState(true);
    const [dimOthers, setDimOthers] = useState(false);
    const menu = light ? { menuBg: '#fafafa', menuColor: '#18181b', lineColor: 'rgba(0,0,0,0.12)' } : { menuBg: '#0f0f12', menuColor: '#fafafa', lineColor: 'rgba(255,255,255,0.14)' };
    const pill = radius > 0;

    return (
        <ComponentDoc
            title="Accordion Marquee"
            description="A menu of big rows with one colored band that glides from row to row. Its edges ride separate springs, so it stretches like liquid on the way and settles when it lands, leaning a little toward the pointer. Inside, a marquee scrolls, and moving the mouse sideways speeds it up or turns it around. Tap on touch, Tab with the keyboard."
            preview={
                <div className="absolute inset-0">
                    <AccordionMarquee bgColor={band} speed={speed} stretch={stretch} magnet={magnet} direction={direction} radius={radius} inset={pill ? 10 : 0} showIndex={showIndex} dimOthers={dimOthers} height="100%" {...menu} />
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Band" value={band} onChange={setBand} />
                    <RangeControl label="Speed" value={speed} onChange={setSpeed} min={0} max={200} step={5} format={(v) => `${v}px/s`} />
                    <RangeControl label="Stretch" value={stretch} onChange={setStretch} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Magnet" value={magnet} onChange={setMagnet} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Radius" value={radius} onChange={setRadius} min={0} max={80} step={2} format={(v) => `${v}px`} />
                    <SelectControl label="Direction" value={direction} onChange={setDirection} options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'alternate', label: 'Alternate' }]} />
                    <ToggleControl label="Numbers" value={showIndex} onChange={setShowIndex} />
                    <ToggleControl label="Dim others" value={dimOthers} onChange={setDimOthers} />
                </ControlGrid>
            }
            code={`import AccordionMarquee from './ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';

const items = [
  { title: 'Work', text: 'Selected projects', image: '/images/work.jpg', href: '/work' },
  { title: 'About', text: 'Who we are', image: '/images/about.jpg', href: '/about' },
  { title: 'Contact', text: 'Say hello', href: '/contact' },
];

const App = () => (
  <AccordionMarquee
    items={items}
    bgColor="${band}"
    speed={${speed}}
    stretch={${stretch}}
    magnet={${magnet}}${direction !== 'left' ? `\n    direction="${direction}"` : ''}${pill ? `\n    radius={${radius}}\n    inset={10}` : ''}${showIndex ? '\n    showIndex' : ''}${dimOthers ? '\n    dimOthers' : ''}
    menuBg="${menu.menuBg}"
    menuColor="${menu.menuColor}"
  />
);

export default App;`}
            cli="accordion-marquee"
            props={props}
            dependencies={dependencies}
        />
    );
}
