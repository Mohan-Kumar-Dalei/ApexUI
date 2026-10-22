import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import WorldMap from '../../../components/MainUI/ApexUI-Kit/WorldMap/WorldMap.jsx';

const sharedProps = [
    { prop: 'variant', type: "'connections' | 'live' | 'locations'", def: '"connections"', desc: 'Flights between cities, live pings, or clickable office pins.' },
    { prop: 'locations', type: '{ key?, label, lat, lon, note? }[]', def: '7 cities', desc: 'Pins (locations) and the cities connections can refer to by key.' },
    { prop: 'connections', type: '[keyA, keyB][]', def: 'demo routes', desc: 'City pairs to connect (connections).' },
    { prop: 'dotColor', type: 'string', def: '"rgba(161,161,170,0.55)"', desc: 'Land dot color.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Pins, arcs and pings.' },
    { prop: 'pingRate', type: 'number', def: '700', desc: 'Milliseconds between pings (live).' },
    { prop: 'showLabels', type: 'boolean', def: 'true', desc: 'Show pin labels (on hover for connections).' },
    { prop: 'zoomable', type: 'boolean', def: 'true', desc: 'Zoom with the +/− buttons, Ctrl/⌘ + scroll, double-click or pinch, and drag to pan.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Arc, ping and info-card motion.' },
    { name: 'Lucide React', desc: 'Pin and close icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const frame = (child) => <div className="w-full max-w-3xl rounded-2xl bg-neutral-950 p-3 sm:p-5">{child}</div>;

const snippet = (variant, extra = '') => `import WorldMap from './ApexUI-Kit/WorldMap/WorldMap.jsx';

const App = () => <WorldMap variant="${variant}"${extra} />;

export default App;`;

export default function WorldMapDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const [rate, setRate] = useState(700);

    const accentControl = (
        <ControlGrid>
            <ColorControl label="Accent" value={accent} onChange={setAccent} />
        </ControlGrid>
    );

    const variants = [
        {
            name: 'Connections',
            description: 'Flights arc between cities with a travelling glow; hover a pin for its name.',
            preview: frame(<WorldMap variant="connections" accentColor={accent} />),
            controls: accentControl,
            code: snippet('connections', ` accentColor="${accent}" connections={[["bbsr", "sf"], ["bbsr", "ldn"], ["tyo", "sf"]]}`),
            cli: 'world-map',
            props: sharedProps,
            dependencies,
        },
        {
            name: 'Live',
            description: 'Visitors ping in across the land in real time, with an online counter.',
            preview: frame(<WorldMap variant="live" accentColor={accent} pingRate={rate} />),
            controls: (
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Ping every" value={rate} onChange={setRate} min={200} max={2000} step={100} format={(v) => `${v}ms`} />
                </ControlGrid>
            ),
            code: snippet('live', ` accentColor="${accent}" pingRate={${rate}}`),
            cli: 'world-map',
            props: sharedProps,
            dependencies,
        },
        {
            name: 'Locations',
            description: 'Office pins with labels, click one to open its info card.',
            preview: frame(<WorldMap variant="locations" accentColor={accent} />),
            controls: accentControl,
            code: snippet('locations', ` accentColor="${accent}"`),
            cli: 'world-map',
            props: sharedProps,
            dependencies,
        },
    ];

    return (
        <ComponentDoc
            title="World Map"
            description="A flat dotted world map in three modes, flight connections, live visitor pings and clickable office locations, that zooms and pans, with a built-in 2 kB land mask."
            variants={variants}
        />
    );
}
