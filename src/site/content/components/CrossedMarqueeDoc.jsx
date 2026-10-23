import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import CrossedMarquee from '../../../components/MainUI/ApexUI-Kit/CrossedMarquee/CrossedMarquee.jsx';

const props = [
    { prop: 'items', type: '(string | { label, icon? })[]', def: 'MERN stack', desc: 'Labels. Known names (React, Next.js, Tailwind CSS…) get their brand icon; icon can be a simple-icons object or any React node. Without an icon the tile shows initials.' },
    { prop: 'duration', type: 'number', def: '45', desc: 'Seconds for the front band to travel one loop (the back band is 22% slower).' },
    { prop: 'tilt', type: 'number', def: '3', desc: 'Band tilt in degrees.' },
    { prop: 'accentColor', type: 'string', def: '"#ff5b1f"', desc: 'Front band colour (a CSS variable works too).' },
    { prop: 'bandInk', type: 'string', def: '"#14110d"', desc: 'Borders, labels and tile outlines.' },
    { prop: 'backColor', type: 'string', def: '"#121110"', desc: 'Back band colour.' },
    { prop: 'tileColor', type: 'string', def: '"#fffaf2"', desc: 'Icon tile background.' },
    { prop: 'showBackBand', type: 'boolean', def: 'true', desc: 'Show the second, crossing band.' },
    { prop: 'reactToScroll', type: 'boolean', def: 'true', desc: 'Burst forward while the page scrolls and reverse when scrolling up.' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'false', desc: 'Stop while hovered.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'simple-icons', desc: 'Brand icons, imported by name so only the used ones ship.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CrossedMarqueeDoc() {
    const [accent, setAccent] = useState('#ff5b1f');
    const [duration, setDuration] = useState(45);
    const [tilt, setTilt] = useState(3);
    const [back, setBack] = useState(true);

    return (
        <ComponentDoc
            title="Crossed Marquee"
            description="Two tilted bands crossing like an X and scrolling in opposite directions: brand tiles and big labels in front, a quieter row behind. Scrolling the page bursts the bands forward (or reverses them when you scroll up), then they settle back to a cruise. The loop runs on requestAnimationFrame with a wrapped position, so it never stalls at an edge."
            preview={
                <div className="w-full">
                    <CrossedMarquee accentColor={accent} duration={duration} tilt={tilt} showBackBand={back} />
                </div>
            }
            previewClassName="!px-0"
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Loop time" value={duration} onChange={setDuration} min={10} max={90} step={1} format={(v) => `${v}s`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={0} max={8} step={0.5} format={(v) => `${v}°`} />
                    <ToggleControl label="Back band" value={back} onChange={setBack} />
                </ControlGrid>
            }
            code={`import CrossedMarquee from './ApexUI-Kit/CrossedMarquee/CrossedMarquee.jsx';

const App = () => (
  <>
    <CrossedMarquee accentColor="${accent}" duration={${duration}} tilt={${tilt}}${back ? '' : ' showBackBand={false}'} />
    <CrossedMarquee items={["MongoDB", "Express.js", "React", "Node.js"]} accentColor="var(--accent)" />
  </>
);

export default App;`}
            cli="crossed-marquee"
            props={props}
            dependencies={dependencies}
        />
    );
}
